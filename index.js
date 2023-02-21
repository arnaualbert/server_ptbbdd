// const express = require('express')
// const bodyParser = require('body-parser')
// const mysql = require('mysql')
// const path = require('path'); 
// const app = express()
// const cors = require('cors')
// const port = process.env.PORT || 5000;
// app.use('/', express.static(path.join(__dirname, 'public')))

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// // parse application/json
// app.use(bodyParser.json())

// // MySQL
// const pool  = mysql.createPool({
//     connectionLimit : 10,
//     host            : 'localhost',
//     user            : 'root',
//     password        : '',
//     database        : 'bank'
// })
   
// // we get the data of the database
// app.get('/api/datos', (req, res) => {
//     pool.getConnection((err, connection) => {
//         if(err) throw err
//         console.log('connected as id ' + connection.threadId)
//         connection.query('SELECT * from accounts', (err, rows) => {
//             connection.release() // return the connection to pool

//             if (!err) {
//                 res.send(rows)
//             } else {
//                 console.log(err)
//             }

//             // if(err) throw err
//             console.log('The data from beer table are: \n', rows)
//         })
//     })
// })


// // we send the data to the database
// app.post('/api/mod', (req, res) => {

//     pool.getConnection((err, connection) => {
//         if(err) throw err
//         console.log(`connected as id ${connection.threadId}`)

//         const { dni, full_name, account_type, amount, client_type,entry_date} = req.body

//         connection.query(`UPDATE accounts SET full_name = "${full_name}", account_type = "${account_type}", amount = ${amount}, client_type = "${client_type}", entry_date = "${entry_date}" WHERE dni = "${dni}";` , (err, rows) => {
//             connection.release() // return the connection to pool

//             if(!err) {
//                 res.send(`Client with the dni: ${dni} has been modified.`)
//             } else {
//                 console.log(err)
//             }

//         })

//         console.log(req.body)
//     })
// })



// app.listen(port, () => console.log(`Listening on port ${port}`))
// app.listen(3009, ()=>{
//     console.log('Aquesta és la nostra API-REST que corre en http://localhost:3009')
// })
"use stric";
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
//const { connect } = require("http2");
const app = express();
// const path = require("path");
const cors = require("cors");

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Allow", "POST, GET, PUT, DELETE, OPTIONS");
//   next();
// });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use("/", express.static(path.join(__dirname, "public")));

//Create mysql connection
let connection = mysql.createConnection({
  host: 'localhost',
  database: "animals",
  user: "root",
  password: "",
//   multipleStatements: true,
});

app.get('/'), (req, res) => {
  res.send("Hello")
}

//*Get all the data from DataBase
app.get("/users", (req, res) => {
  connection.connect(function (err) {
    if (err) {
      console.log("Error connectiong " + err.stack);
      return;
    }
    console.log("Connected as id: " + connection.threadId);
  });

  connection.query("SELECT * FROM users", (error, results, field) => {
    if (error) {
      res.status(400).send({ response: null });
    } else {
      //Connection OK
      res.status(200).send({ response: results });
    }
  });
});


app.post('/login',function(req,res){//luego ha de coincidir con angular
    // desde angular se pasa usuari y password (lsa variables son con el mismo nombre)
    console.log("estic dins login")
    console.log(req.body)
    let user = req.body.user;
    let password = req.body.password;

    // connection.connect(function(err){
    //     if(err){
    //         console.log('error connecting' + err.stack);
    //         return;
    //     }
    //     console.log('connected as id' + connection.threadId);
    // });


    ////var sql = 'SELECT * FROM accounts WHERE full_name=? and account_type=?';
    var sql = 'SELECT * FROM users WHERE username=? and password=?';

    connection.query(sql,[user,password],function(error,result){
        if(error){
            res.send('username or password incorrect')
        }else{
            console.log(result);
            res.json(result[0]);
        }
    })


});


app.post('/register',function(req,res){
  console.log('im in the registration')
  console.log(req.body)
  let username = req.body.username
  let password = req.body.password
  let name = req.body.name
  let lastname = req.body.lastname
  let role = req.body.role
  let mail = req.body.mail
  let number = req.body.number
  let age = req.body.age
  //INSERT INTO `users`(`username`, `password`, `name`, `lastname`, `role`, `mail`, `number`, `age`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]')
  var sql = 'INSERT INTO users (username, password, name, lastname, role, mail, number, age) VALUES (?,?,?,?,?,?,?,?)'

  connection.query(sql,[username,password,name,lastname,role,mail,number,age],function(error,result){
  if(error){
    res.send('incorrect')
    console.log('incorrect')
  }else(
    console.log('success')
  )
  })
})

app.get('/tabla', function(req,res){
  console.log('im in the table')
  console.log(req.bpdy)
  var sql = 'SELECT * FROM exotic'
  connection.query(sql,function(error,result){
    if(error){
      console.log('incorrect')
    }else{
      console.log(result);
      res.json(result)
    }
  })
});

app.post('/newanimal',function(req,res){
  console.log('im adding a new animal')
  console.log(req.body)
  let nombre = req.body.nombre
  let especie = req.body.especie
  let cantidad = req.body.cantidad
  let familia = req.body.familia
  let alimentacion = req.body.alimentacion
  let habitat = req.body.habitat

  var sql = 'INSERT INTO exotic (nombre,especie,cantidad,familia,alimentacion,habitat) VALUES (?,?,?,?,?,?)'

  connection.query(sql,[nombre,especie,cantidad,familia,alimentacion,habitat],function(error,result){
    if(error){
      console.log('incorrect')
      res.send('incorrect')
    }else{
      //res.send(JSON.stringify(result))
      console.log('success');
      res.send({'result':'added'})
    }
  })

})



// //*Send update data to the DataBase
// app.post("/api/update", (req, res) => {
//   let data = req.body;
//   let query = "";

//   if (typeof data.accounts !== "undefined" && data.accounts.length > 0) {
//     data.accounts.forEach((account) => {
//       query += mysql.format(`UPDATE Clients SET 
//             NAME = '${account.NAME}',
//             ACCOUNT_TYPE = '${account.ACCOUNT_TYPE}',
//             AMOUNT= '${account.AMOUNT}',
//             CLIENT_TYPE= '${account.CLIENT_TYPE}',
//             ENTRY_DATE = '${account.ENTRY_DATE}' WHERE DNI = '${account.DNI}';`);
//     });
//   }

//   connection.query(query, (error, results, field) => {
//     if (error) {
//       res.status(400).send({ response: null });
//     } else {
//       //Connection OK
//       res.status(200).send({ response: results });
//     }
//   }); //end of query
// });

// //*Send update data to the DataBase
// app.post("/api/delete", (req, res) => {
//   let data = req.body;
//   let query = "";

//   if (typeof data.accounts !== "undefined" && data.accounts.length > 0) {
//     data.accounts.forEach((account) => {
//       query += mysql.format(`UPDATE Clients SET 
//             NAME = '${account.NAME}',
//             ACCOUNT_TYPE = '${account.ACCOUNT_TYPE}',
//             AMOUNT= '${account.AMOUNT}',
//             CLIENT_TYPE= '${account.CLIENT_TYPE}',
//             ENTRY_DATE = '${account.ENTRY_DATE}' WHERE DNI = '${account.DNI}';`);
//     });
//   }

//   connection.query(query, (error, results, field) => {
//     if (error) {
//       res.status(400).send({ response: null });
//     } else {
//       //Connection OK
//       res.status(200).send({ response: results });
//     }
//   }); //end of query
// });

app.listen(3000, () => {
  console.log(
    "Aquesta és la nostra API-REST que corre en http://localhost:3000"
  );
});