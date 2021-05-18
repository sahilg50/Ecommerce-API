const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var items = [];
var customers = [];
var orders = [];

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'nishtha',
	database: 'dbdb',
	port: 3306
});

connection.connect((err) => {
	if (err) {
		console.log("ERRE")
	}
	else {
		console.log("HELLOO NISHTHAAA")
	}
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', function (req, res) {
	var newItem = 'AYUSH';

	res.render('index', { new_item: newItem });
});

app.get('/index.html', function (req, res) {
	var newItem = 'AYUSH';

	res.render('index', { new_item: newItem });
});

// app.get('/dashboard.html', function (req, res) {
// 	res.render('dashboard');
// });

app.get('/login.html', function (req, res) {
	res.render('login');
});

app.get('/blog.html', function (req, res) {
	res.render('blog');
});

app.get('/user-profile.html', function (req, res) {
	res.render('user-profile');
});

app.get('/ad-listing.html', function (req, res) {
	res.render('ad-listing');
});

app.get('/ad-orders.html', function (req, res) {
	res.render('ad-orders');
});

app.get('/ad-customer.html', function (req, res) {
	res.render('ad-customers');
});

app.get('/about-us.html', function (req, res) {
	res.render('about-us');
});

app.get('/category.html', (req, res) => {
	items = [];
	let sql = 'select * from Inventory';
	connection.query(sql, (err, rows) => {
		if (err) {
			throw err
		} else {
			console.log("DATA BHEJ DIYA MENE NISHTHA")
			// console.log(rows)
			console.log("DONT SCOLD ME")
			// res.send("Done");
		}
		console.log(rows[0]['Type']);

		for (let i = 0; i < rows.length; i++) {
			items.push(rows[i]);
		}
		res.render('category', { inventory: items });
		console.log(items);
	})

	// console.log(post)
});

app.get('/customer.html', function (req, res) {
	let sql = 'select * from customers';
	customers = [];
	connection.query(sql, (err, rows) => {
		if (err) {
			throw err
		} else {
			console.log("DATA BHEJ DIYA MENE NISHTHA")
			// console.log(rows)
			console.log("DONT SCOLD ME")
			// res.send("Done");
		}
		for (let i = 0; i < rows.length; i++) {
			customers.push(rows[i]);
		}
		console.log(customers);
		res.render('customers', { customers: customers });
	})
});

app.get('/dashboard.html', function (req, res) {
	let sql = 'select * from orders order by Order_ID';
	orders = [];
	connection.query(sql, (err, rows) => {
		if (err) {
			throw err
		} else {
			console.log("DATA BHEJ DIYA MENE NISHTHA")
			// console.log(rows)
			console.log("DONT SCOLD ME")
			// res.send("Done");
		}
		var query = "SELECT Name FROM Customers where Customer_ID in( SELECT Customer_ID FROM Customer_Order order by Order_ID)"
		connection.query(query, (err, data) => {
			if (err) {
				throw err
			} else {
			}
			for (let i = 0; i < data.length; i++) {
				customers.push(data[i]);
			}
			console.log("customers here")
			console.log(customers)
			for (let i = 0; i < rows.length; i++) {
				orders.push(rows[i]);
			}
			console.log(rows)
			res.render('dashboard', { orders: orders, customers: customers });
		})

	})
});

app.post('/ad-listing.html', (req, res) => {
	var item = req.body.type;
	var status = req.body.status;
	var ig = req.body.ig;
	var condition = req.body.condition;
	var price = req.body.price;
	let sql = "insert into Inventory set ?"
	let post = { Type: item, Status: status, Price: price, Item_condition: condition, IG_Link: ig }
	connection.query(sql, post, (err, rows) => {
		if (err) {
			throw err
		} else {
			console.log("DATA BHEJ DIYA MENE NISHTHA")
			// console.log(rows)
			console.log("DONT SCOLD ME")
			// res.send("Done");
			console.log('solddd');
		}
	})
	res.redirect('/ad-listing.html');
	// console.log(post)
});

app.post('/ad-customer.html', (req, res) => {
	var name = req.body.name;
	var num = req.body.num;
	var add = req.body.add;
	var state = req.body.state;
	var ig = req.body.ig;
	var email = req.body.email;
	let sql = "insert into customers set ?"
	let post = { Name: name, Instagram_Handle: ig, Address: add, State: state, Contact: num, Email_ID: email }
	connection.query(sql, post, (err, rows) => {
		if (err) {
			throw err
		} else {
			console.log("DATA BHEJ DIYA MENE NISHTHA")
			// console.log(rows)
			console.log("DONT SCOLD ME")
			// res.send("Done");
			console.log('solddd');
		}
	})
	res.redirect('/ad-customer.html');
	// console.log(post)
});

app.post('/ad-orders.html', (req, res) => {
	var oid = req.body.oid;
	var odate = req.body.odate;
	var add = req.body.add;
	var cid = req.body.cid;
	var iid = req.body.iid;
	var amt = req.body.amt;
	var paymode = req.body.paymode;
	var pdate = req.body.pdate;
	var status = 'Pending';
	var sql = "insert into orders set ?"
	let o_post = { Order_ID: oid, Order_Date: odate, Amount: amt, Delivery_Address: add, Order_Status: status }
	let ol_post = { Order_ID: oid, Item_ID: iid }
	let co_post = { Customer_ID: cid, Order_ID: oid }
	let pay_post = { Order_ID: oid, Amount: amt, Payment_Mode: paymode, Payment_Date: pdate }

	connection.query(sql, o_post, (err, rows) => {
		if (err) {
			throw err;
		} else {
			console.log(rows);
		}
	});

	var sql = "insert into order_list set ?"

	connection.query(sql, ol_post, (err, rows) => {
		if (err) {
			throw err;
		} else {
			console.log(rows);
		}
	});

	var sql = "insert into customer_order set ?"

	connection.query(sql, co_post, (err, rows) => {
		if (err) {
			throw err;
		} else {
			console.log(rows);
		}
	});

	var sql = "insert into payment set ?"

	connection.query(sql, pay_post, (err, rows) => {
		if (err) {
			throw err;
		} else {
			console.log(rows);
		}
	});
	res.redirect('/ad-orders.html');
})

app.listen(5000, function () {
	console.log("Started");
});