import { verifyUser } from "./index.js"
import { connection } from "./index.js" 
import mysql from "mysql";


function queryAsync(sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export default async function zapiszFiszki(req, res) {
    let userId = verifyUser(req);
    if (!userId) {
        return res.status(401).send({
        message: "Unathorized"
        })
    }

    let bodyOfReq = req.body;
    console.log(bodyOfReq)
    let dodaneGrupy = bodyOfReq.dodaneGrupy;
    let usunieteGrupy = bodyOfReq.usunieteGrupy;
    let zmienioneGrupy = bodyOfReq.zmienioneGrupy;
    let dodaneFiszki = bodyOfReq.dodaneFiszki;
    let usunieteFiszki = bodyOfReq.usunieteFiszki;
    let zmienioneFiszki = bodyOfReq.zmienioneFiszki;

    console.log("\n-------------------");
    connection.beginTransaction();

    try {
        const tempToRealId = {};

        for (const grupa of dodaneGrupy) {
            const insertGroupSql = `
                INSERT INTO groups (nazwa, userid)
                VALUES (?, ?)
            `;
            const values = [grupa.nazwa, userId];

            console.log("\ninserting groups");
            console.log(mysql.format(insertGroupSql, values));

            const result = await queryAsync(insertGroupSql, values);
            tempToRealId[grupa.tempId] = result.insertId;
        }

        const existingGroupIds = dodaneFiszki
        .filter(f => f.groupId !== -1)
        .map(f => f.groupId);

        if (existingGroupIds.length > 0) {
        const selectGroupsSql = `
            SELECT id
            FROM groups
            WHERE userid = ?
            AND id IN (?)
        `;

        console.log("\nverifying groups");
        console.log(mysql.format(selectGroupsSql, [
            userId,
            existingGroupIds
        ]));

        const rows = await queryAsync(selectGroupsSql, [userId, existingGroupIds]);
        const validIds = rows.map(r => r.id);
        for (const gid of existingGroupIds) {
          if (!validIds.includes(gid)) throw new Error("Unauthorized group access");
        }
        }

        const fiszkiValues = dodaneFiszki.map(f => {
        let finalGroupId;

        if (f.groupId !== -1) {
            finalGroupId = f.groupId;
        } else {
            finalGroupId = tempToRealId[f.tempIdGrupy];
            if (!finalGroupId) throw new Error("Missing mapped group id");
        }

        return [
            finalGroupId,
            f.slowo,
            f.definicja,
            f.zdanie
        ];
        });

        const insertFiszkiSql = `
        INSERT INTO fiszki (
            groupId,
            slowo,
            definicja,
            zdanie
        )
        VALUES ?
        `;

        if (fiszkiValues.length > 0) {
            console.log("\ninserting fiszki");
            console.log(mysql.format(insertFiszkiSql, [fiszkiValues]));
            await queryAsync(insertFiszkiSql, [fiszkiValues]);
        }

        if (usunieteFiszki.length > 0) {
            const fiszkiIds = usunieteFiszki.map(f => f.id);
    
            const deleteFiszkiSql = `
            DELETE f
            FROM fiszki f
            INNER JOIN groups g ON f.groupId = g.id
            WHERE f.id IN (?)
                AND g.userid = ?
            `;
    
            console.log("\ndeleting fiszki");
            console.log(mysql.format(deleteFiszkiSql, [fiszkiIds, userId]));
    
            await queryAsync(deleteFiszkiSql, [fiszkiIds, userId]);
        }
    
        if (usunieteGrupy.length > 0) {
            const groupIds = usunieteGrupy.map(g => g.id);
    
            const deleteGroupsSql = `
            DELETE FROM groups
            WHERE id IN (?)
                AND userid = ?
            `;
    
            console.log("\ndeleting groups");
            console.log(mysql.format(deleteGroupsSql, [groupIds, userId]));
    
            await queryAsync(deleteGroupsSql, [groupIds, userId]);
        }
    
        for (const grupa of zmienioneGrupy) {
            const updateGroupSql = `
            UPDATE groups
            SET nazwa = ?
            WHERE id = ? AND userid = ?
            `;
            const values = [grupa.nazwa, grupa.id, userId];
    
            console.log("\nupdating groups");
            console.log(mysql.format(updateGroupSql, values));
    
            await queryAsync(updateGroupSql, values);
        }
    
        for (const fiszka of zmienioneFiszki) {
            const updateFiszkaSql = `
            UPDATE fiszki f
            INNER JOIN groups g ON f.groupId = g.id
            SET f.slowo = ?, f.definicja = ?, f.zdanie = ?
            WHERE f.id = ? AND g.userid = ?
            `;
            const values = [
            fiszka.slowo,
            fiszka.definicja,
            fiszka.zdanie,
            fiszka.id,
            userId
            ];
    
            console.log("\nupdating fiszki");
            console.log(mysql.format(updateFiszkaSql, values));
    
            await queryAsync(updateFiszkaSql, values);
        }


        console.log("\ncommiting");
        connection.commit();

        return res.status(200).send();

    } catch (err) {
        console.log("\nrollback");
        console.error(err);
        connection.rollback();

        return res.status(400).send();
    }
}