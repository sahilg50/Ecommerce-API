const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

let user = {};
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
	user = req.body;
	res.json('UserVerified');

	const userDetails = {
		customerId: user.userId,
		Name: user.userName,
		emailId: user.userEmail,
	};

	var sql = 'insert into customer set ?';

	connection.query(sql, userDetails, (err, rows) => {
		if (err) {
			console.log('User Already exists!');
		} else {
			console.log('New user added!');
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

//Query to get broad Category data from the server(Directory Data)
app.get('/category', (req, res) => {
	var sql = ("select * from category WHERE category like '%broad%';");
	connection.query(sql, (err, rows) => {
		if (err) {
			console.log('Category Unsuccessful');
		} else {
			res.send(rows);
			console.log('Data sent successfully ');
		}
	});
});

//Query to recieve from category from the frontEnd and return the collction related to that.
app.post('/collections', (req, res) => {
	const category = req.body;

	var sql =
		'SELECT productId,productName,productPrice,productImage FROM product left join category on product.categoryId=category.category_id where categoryName = ?';

	connection.query(sql, category.collection, (err, rows) => {
		if (err) {
			console.log('Collection Error');
		} else {
			res.json(rows);
			console.log('Successful');
		}
	});
});

//Fetch total number of categories.
app.get('/total_categories', (req, res) => {
	var sql = 'select category_id,categoryName from category';
	connection.query(sql, (err, rows) => {
		if (err) {
			console.log('Total_Categories Error');
		} else {
			const test = JSON.stringify(rows);
			res.json(JSON.parse(test));
		}
	});
});

//Add the Items to the cart
app.post('/add_item_to_cart', (req, res) => {
	const cart_Id = 'cart'.concat(user.userId);
	const product_Id = req.body.id;
	console.log(cart_Id);
	console.log(product_Id);

	var sql =
		"use ecommerce;SET SQL_SAFE_UPDATES = 0;set @productId='3';set @cartId = '1';create table temp (productId varchar(20),cartId varchar(20));Insert into temp VALUES(@productId, @cartId);UPDATE cart set Quantity =Quantity+1 where productId = @productId and cartId=@cartId;insert into cart(productId, CartId, Quantity)select productId, cartId, 1 as'Quantity' from temp where productId not in (select productId from cart where cartId=@cartId);Drop table temp;";

	const vars = [product_Id, cart_Id];
	connection.query(sql, (err, rows) => {
		if (err) {
			console.log(err);
		} else {
			const test = JSON.stringify(rows);
			res.json(JSON.parse(test));
			console.log(rows);
		}
	});
});

app.listen(4000, () => {
	console.log('app is running on port 4000');
});
