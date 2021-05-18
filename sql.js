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

let sql = 'SELECT * FROM ecommerce.users';
connection.query(sql, (err, rows) => {
	if (err) {
		throw err;
	} else {
		console.log('Query ran successfully ');
		console.log(rows);
	}
});
connection.end();
