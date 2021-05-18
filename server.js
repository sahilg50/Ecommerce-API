const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '223546',
	database: 'Ecommerce',
	port: 3306,
});

connection.connect((err) => {
	if (err) {
		console.log('Connection to Mysql failed');
	} else {
		console.log('Connection to Mysql is successful');
	}
});

//Query to Store user in the databse
app.post('/', (req, res) => {
	const user = req.body;
	console.log(user);
	res.json('UserDetails recieved by the server!!');

	const userDetails = {
		customerId: user.userId,
		Name: user.userName,
		emailId: user.userEmail,
	};

	var sql = 'insert into customer set ?';

	connection.query(sql, userDetails, (err, rows) => {
		if (err) {
			console.log('User Query Unsuccessful');
		} else {
			console.log('User Query ran successfully ');
			console.log(rows);
		}
	});
});

//Query to store items in the server
app.post('/item', (req, res) => {
	itemDetails = req.body;
	res.json('ItemsDetails recieved by the server!!');

	var sql = 'insert into product set ?';

	connection.query(sql, itemDetails, (err, rows) => {
		if (err) {
			console.log('Unsuccessful');
		} else {
			console.log('Query ran successfully ');
			console.log(rows);
		}
	});
});

// prettier-ignore

//Query to get Category data from the server
app.get('/category', (req, res) => {
	var sql = ("select * from category WHERE category like '%broad%';");
	connection.query(sql, (err, rows) => {
		if (err) {
			console.log('Category Unsuccessful');
		} else {
			console.log(rows);
			res.send(rows);
			console.log('Data sent successfully ');
		}
	});
});

app.listen(4000, () => {
	console.log('app is running on port 4000');
});
