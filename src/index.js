const express = require('express');
const app = express();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

const event = {
    name: 'Vampires & Werewolves'
};

app.use(express.json());

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(event))
});


//Events CRUD
app.get('/api/events', (req, res) => {
    connection.query('SELECT * FROM Events', (error, results, fields) => {
        res.setHeader('Content-Type', 'application/json');
        if (error) {
            res.send(JSON.stringify({
                code: error.code,
                errno: error.errno,
                sqlState: error.sqlState,
                sqlMessage: error.sqlMessage,
            }))
            return;
        }
        res.send(JSON.stringify(results))
    });
});

app.get('/api/events/:id', (req, res) => {
    connection.query('SELECT * FROM Events WHERE ID = ?', [req.params.id], (error, results, fields) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(results[0]))
    });
});

app.post('/api/events', (req, res) => {
    console.log(req.body);
    connection.query('INSERT INTO Events (`Theme ID`, `Date`, `Venue ID`, `Ticket Price`, `Number Tickets for Sale`) VALUES (?, ?, ?, ?, ?)',
        [req.body['Theme ID'], req.body['Date'], req.body['Venue ID'], req.body['Ticket Price'], req.body['Number Tickets for Sale']], (error, results, fields) => {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            res.send('Done')
        });

});

app.delete('/api/events/:id', (req, res) => {
    connection.query('DELETE FROM Events WHERE ID = ?', [req.params.id], (error, results, fields) => {
        res.setHeader('Content-Type', 'application/json');
        res.send('Done');
    });
});

connection.connect();
app.listen(3000);