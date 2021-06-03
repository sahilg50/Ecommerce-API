const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const app = express();

let user = {};
var cart_Id = '';
app.use(bodyParser.json({ limit: '50mb', extended: true }));

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
	cart_Id = 'cart'.concat(user.userId);
	console.log(cart_Id);
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

//Retrieve cart items when user logins
app.get('/retrieve_cart_items', (req, res) => {
	var sql =
		'SELECT cart.CartId,cart.Quantity,cart.productid, product.productImage,product.productPrice,product.productName FROM cart left join product on cart.productId=product.productId where cartId=?';
	connection.query(sql, cart_Id, (err, rows) => {
		if (err) {
			console.log('Cart Items cannot be sent to the frontend');
		} else {
			console.log(rows);
			const test = JSON.stringify(rows);
			res.json(JSON.parse(test));
		}
	});
});

//Insert a new item to the cart
app.post('/insert_item_to_cart', (req, res) => {
	console.log(req.body);

	var sql = 'insert into cart set ?';

	var cart_item = {
		CartId: cart_Id,
		Quantity: 1,
		productid: req.body.id,
	};
	connection.query(sql, cart_item, (err, rows) => {
		if (err) {
			console.log(err);
		} else {
			res.json('New Item Added Sucessfully');
			console.log(rows);
		}
	});
});

//Increase the quantity of an existing cart item by one
app.post('/add_item_to_cart', (req, res) => {
	console.log(req.body);

	var sql =
		'update cart set quantity=quantity+1 where cartId=? and productId=?';

	var cart_item = [cart_Id, req.body.id];
	connection.query(sql, cart_item, (err, rows) => {
		if (err) {
			console.log(err);
		} else {
			res.json('Item quantity increased by 1 Sucessfully');
			console.log(rows);
		}
	});
});

//Decrease the quantity of an existing cart item by one
app.post('/remove_item_from_cart', (req, res) => {
	console.log(req.body);

	var sql =
		'update cart set quantity=quantity-1 where cartId=? and productId=?';

	var cart_item = [cart_Id, req.body.id];
	connection.query(sql, cart_item, (err, rows) => {
		if (err) {
			console.log(err);
		} else {
			res.json('Item quantity decreases by 1 Sucessfully');
			console.log(rows);
		}
	});
});

//Remove the a particular cart item
app.post('/clear_item_from_cart', (req, res) => {
	console.log(req.body);

	var sql = 'delete from cart where cartId=? and productId=?';

	var cart_item = [cart_Id, req.body.Id];
	connection.query(sql, cart_item, (err, rows) => {
		if (err) {
			console.log(err);
		} else {
			res.json('Item removed Sucessfully');
			console.log(rows);
		}
	});
});

//Place Orders
app.post('/place_order', (req, res) => {
	var sql =
		'insert into order_product_cart(cartId,productId,quantity,totalAmount,orderDate,OrderId)select cart.cartId,product.ProductId,Quantity,productPrice,curdate() as orderDate ,? as orderId from cart left join product on cart.productId=product.productId where cartId=?;';

	var order = [req.body.OrderId, cart_Id];

	connection.query(sql, order, (err, rows) => {
		if (err) {
			console.log(err);
		} else {
			res.json('Order Placed Sucessfully');
			console.log(rows);
		}
	});
});

//Empty The Cart
app.get('/empty_the_cart', (req, res) => {
	console.log(req.body);
	var sql = 'Delete from cart Where cartId=?';

	connection.query(sql, cart_Id, (err, rows) => {
		if (err) {
			console.log(err);
		} else {
			res.json('Cart Emptied');
			console.log(rows);
		}
	});
});

//Get Distinct ORders
app.get('/get_distinct_orders', (req, res) => {
	var sql =
		'SELECT distinct orderId FROM order_product_cart natural join product where cartId=?';

	connection.query(sql, cart_Id, (err, rows) => {
		if (err) {
			console.log(err);
		} else {
			res.json(rows);
			console.log(rows);
		}
	});
});

//Get OrderItems based Uoin OrderId
app.post('/get_orderItems', (req, res) => {
	console.log('New Fetch');
	console.log(req.body.orderId);
	var sql =
		'SELECT * FROM order_product_cart natural join product where orderId=?';

	connection.query(sql, req.body.orderId, (err, rows) => {
		if (err) {
			console.log(err);
		} else {
			res.json(rows);
			console.log(rows);
		}
	});
});

//Verify Seller
app.post('/seller_login', (req, res) => {
	console.log(req.body);

	var sql =
		'select true from seller where sellerusername=? and sellerPassword=?';

	var seller_info = [req.body.sellerusername, req.body.password];
	connection.query(sql, seller_info, (err, rows) => {
		if (err) {
			console.log('Seller Login Error');
		} else {
			res.json(rows);
			console.log(rows);
		}
	});
});

//Get Ccontact Info
app.get('/get_contactus', (req, res) => {
	var sql = 'select states, TollFreeNumber from communication';
	connection.query(sql, (err, rows) => {
		if (err) {
			console.log('Contact details Error');
		} else {
			res.json(rows);
			console.log(rows);
		}
	});
});

app.listen(4000, () => {
	console.log('app is running on port 4000');
});

// connection.end();
