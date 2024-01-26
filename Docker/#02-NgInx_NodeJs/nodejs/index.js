const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql')
const geradornome = require('gerador-nome')

const connection = mysql.createConnection(config)
connection.query('create table people (id int not null auto_increment, name varchar(255) not null, primary key (id))');

const strSelectPeople = `SELECT * FROM people`
var peoples = [];

app.get('/', (req, res) => {        
    var strInsert = `INSERT INTO people (name) values ('${geradornome.geradorNome()}')` 
    connection.query(strInsert)
    connection.query(strSelectPeople, (err, result) => {
      peoples = result;

      var body = '<h1>Full Cycle Rocks!!!</h1>'   
	    body += '<span>Pressione (F5) para um novo membro Full Cycle Rocks!!!</span></br></br>'

      peoples.forEach(element => {
        body += `<li>${element.name}</li>`    
      });

      res.send(body)
    });    
})

app.listen(port, () => {
    console.log('Rodando na porta ' + port)    
    //connection.end()
    //Aqui faltou fechar a conexão em algum evento onDestroy
})