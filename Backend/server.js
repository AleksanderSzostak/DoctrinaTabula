const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: "localhost",
    user : 'root',
    password : '',
    database: 'fiszki'
})

app.get('/',(re, res)=>{
    return res.json("Bajo jajo BACK");
})
app.get('/fiszka/:id',(req,res)=>{
    const sql = "SELECT * FROM fiszki WHERE id = "+ req.params.id;
    db.query(sql,(err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
app.get('/fiszki/:id',(req,res)=>{
    const sql = "SELECT id FROM fiszki WHERE groupid = "+ req.params.id;
    db.query(sql,(err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.listen(8081,()=>{
    console.log("bAJO JAJO SLUCHA")
})