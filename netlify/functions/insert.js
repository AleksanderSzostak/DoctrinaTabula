import { neon } from '@netlify/neon';


export const handler = async (event, context) => {
  const sql = neon(); // Uses NETLIFY_DATABASE_URL automatically
  const data = JSON.parse(event.body);

  let answer;

  try {
    if (data.table === "fiszki") {
      const { slowo, definicja, zdanie, groupid } = data;

      [answer] = await sql`
        INSERT INTO ${data.table} 
          (slowo, definicja, zdanie, groupid)
        VALUES (${slowo}, ${definicja}, ${zdanie}, ${groupid})
        RETURNING *;
      `;
    } 
    else if (data.table === "groups") {
      const { nazwa, userid, private: privateTemp } = data;
      const private1 = privateTemp === "true";

      [answer] = await sql`
        INSERT INTO ${data.table} 
          (nazwa, userid, private)
        VALUES (${nazwa}, ${userid}, ${private1})
        RETURNING *;
      `;
    } 
    else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid table" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(answer),
    };
  } catch (err) {
    console.error(err);
    return {
        
      statusCode: 500,
      body: JSON.stringify({ error: "Database error"+err }),
    };
  }
};
