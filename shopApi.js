let mysql = require("mysql");
let connData = {
	host: "localhost",
	user: "root",
	password: "",
	database: "mydb",
};

let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
	);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});
//const port = 2410;
var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

app.get("/resetData", function(req,res){
	let connection = mysql.createConnection(connData);
	let sql1 = "DELETE FROM shops";
	let sqlProd = "DELETE FROM products6";
	let sqlPur = "DELETE FROM purchases";
	connection.query(sql1, function(err, result) {
		if (err) console.log(err);
		else console.log("Successfully deleted. Affected rows :", result.affectedRows);
		let arr = data.shops.map(p => [p.shopId, p.name, p.rent]);
		let sql2 = "INSERT INTO shops(shopId, name, rent) VALUES ?";
		connection.query(sql2, [arr], function(err, result){
			if (err) console.log(err);
			else console.log("Successfully inserted. Affected rows :", result.affectedRows);
		});
	})
	connection.query(sqlProd, function(err, result) {
		if (err) console.log(err);
		else console.log("Successfully deleted. Affected rows :", result.affectedRows);
		let {data} = require("./shopChainData.js");
		let arr1 = data.products.map(p => [p.productId, p.productName, p.category, p.description]);
		let sql3 = "INSERT INTO products6(productId, productName, category, description) VALUES ?";
		connection.query(sql3, [arr1], function(err, result){
			if (err) console.log(err);
			else console.log("Successfully inserted. Affected rows :", result.affectedRows);
		});
	})
	connection.query(sqlPur, function(err, result) {
		if (err) console.log(err);
		else console.log("Successfully deleted. Affected rows :", result.affectedRows);
		let {data} = require("./shopChainData.js");
		let arr2 = data.purchases.map(p => [p.purchaseId, p.shopId, p.productid, p.quantity, p.price]);
		let sql4 = "INSERT INTO purchases(purchaseId,shopId, productid, quantity, price) VALUES ?";
		connection.query(sql4, [arr2], function(err, result){
			if (err) console.log(err);
			else console.log("Successfully inserted. Affected rows :", result.affectedRows);
		});
	})
	res.send("Data in file is reset");
})

app.get("/shops", function(req, res){
	let connection = mysql.createConnection(connData);
	let sql = "SELECT * FROM shops";
	connection.query(sql, function(err, result) {
		if (err) console.log(err);
		else {
			res.send(result);
		}
	});
});

app.post("/shops", function(req,res){
	let body = req.body;
	let param = [];
	param.push(body.name);
	param.push(body.rent);
	let connection = mysql.createConnection(connData);
	let sql = "INSERT INTO shops(name, rent) VALUES(?,?)";
	connection.query(sql, param, function (err, result) {
		if (err) console.log(err);
		else{
			res.send(result);
			console.log(result);
		}
	});
});

app.get("/products", function(req, res){
	let connection = mysql.createConnection(connData);
	let sql = "SELECT * FROM products6";
	connection.query(sql, function(err, result) {
		if (err) console.log(err);
		else {
			res.send(result);
		}
	});
});

app.get("/products/:productId", function(req, res){
	let productId = +req.params.productId;
	let connection = mysql.createConnection(connData);
	let sql = "SELECT * FROM products6 WHERE productId=?";
	connection.query(sql, productId, function(err, result) {
		if (err) console.log(err);
		else res.send(result);
	});
});

app.post("/products", function(req,res){
	let body = req.body;
	let param = [];
	param.push(body.productName);
	param.push(body.category);
	param.push(body.description);
	let connection = mysql.createConnection(connData);
	let sql = "INSERT INTO products6(productName, category, description) VALUES(?,?,?)";
	connection.query(sql, param, function (err, result) {
		if (err) console.log(err);
		else{
			res.send(result);
		}
	});
});

app.put("/products/:productId", function(req,res){
	let body = req.body;
	let productId = +req.params.productId;
	let connection = mysql.createConnection(connData);
	let sql = "UPDATE products6 SET category=?, description=? WHERE productId=?";
	connection.query(sql,[body.category,body.description,productId],function(err, result) {
		if (err) res.status(404).send(err);
		else {
				res.send(result);
			}
	});
});

app.get("/purchases/shops/:shopId", function(req, res){
	let shopId = +req.params.shopId;
	let connection = mysql.createConnection(connData);
	let sql = "SELECT * FROM purchases WHERE shopId=?";
	connection.query(sql, shopId, function(err, result) {
		if (err) console.log(err);
		else res.send(result);
	});
});

app.get("/purchases/products/:productid", function(req, res){
	let productid = +req.params.productid;
	let connection = mysql.createConnection(connData);
	let sql = "SELECT * FROM purchases WHERE productid=?";
	connection.query(sql, productid, function(err, result) {
		if (err) console.log(err);
		else res.send(result);
	});
});

app.post("/purchases", function(req,res){
	let body = req.body;
	let param = [];
	param.push(body.shopId);
	param.push(body.productid);
	param.push(body.quantity);
	param.push(body. price);
	let connection = mysql.createConnection(connData);
	let sql = "INSERT INTO purchases(shopId, productid, quantity, price) VALUES(?,?,?,?)";
	connection.query(sql, param, function (err, result) {
		if (err) console.log(err);
		else{
			res.send(result);
		}
	});
});

app.get("/totalPurchase/shop/:id", function(req, res){
	let shopId = +req.params.id;
	let connection = mysql.createConnection(connData);
	let sql = "SELECT * FROM purchases WHERE shopId=?";
	connection.query(sql, shopId, function(err, result) {
		if (err) console.log(err);
		else {
			let prodArr = result.reduce((acc,curr) => (acc.find(a => a === Number(curr.productid))) ? acc : [...acc, Number(curr.productid)], []);
			let arr2 = [];
			for(let i=0; i<prodArr.length; i++) {
				let id = prodArr[i];
				let totalQty = result.reduce((acc, curr) => (curr.productid === id) ? acc + curr.quantity : acc, 0);
				let price = result.reduce((acc, curr) => (curr.productid === id) ? curr.price : acc, 0);
				let purjson = {};
				purjson.productid = prodArr[i];
				purjson.TotalQuantity = totalQty;
				purjson.price = price;
				arr2.push(purjson);
		}
		res.send(arr2);
	}
	});
});

app.get("/totalPurchase/product/:id", function(req, res){
	let productid = +req.params.id;
	let connection = mysql.createConnection(connData);
	let sql = "SELECT * FROM purchases WHERE productid=?";
	connection.query(sql, productid, function(err, result) {
		if (err) console.log(err);
		else {
			let prodArr = result.reduce((acc,curr) => (acc.find(a => a === Number(curr.shopId))) ? acc : [...acc, Number(curr.shopId)], []);
			let arr2 = [];
			for(let i=0; i<prodArr.length; i++) {
				let id = prodArr[i];
				let totalQty = result.reduce((acc, curr) => (curr.shopId === id) ? acc + curr.quantity : acc, 0);
				let price = result.reduce((acc, curr) => (curr.shopId === id) ? curr.price : acc, 0);
				let purjson = {};
				purjson.shopId = prodArr[i];
				purjson.TotalQuantity = totalQty;
				purjson.price = price;
				arr2.push(purjson);
		}
		res.send(arr2);
	}
	});
});

app.get("/purchases", function(req, res) {
	let shop = req.query.shop;
	let product = req.query.product;
	let sort = req.query.sort;
	let productsArr = [];
	console.log(product);
	let connection = mysql.createConnection(connData);
	let sql = "SELECT * FROM purchases";
	connection.query(sql, function(err, result) {
		if (err) console.log(err);
		else {
			if(product){
				productsArr = product.split(",");
			}
		
			if(shop) {
				result = result.filter((a) => Number(a.shopId) === Number(shop));
			}
			if(productsArr.length > 0) {
				console.log(productsArr);
				result = result.filter((a) => productsArr.find((val) => Number(val) === Number(a.productid)));
			}
			if(sort) {
				result = (sort === "QtyAsc") ? result.sort((a1, a2) => a1.quantity - a2.quantity) :
				(sort === "QtyDesc") ? result.sort((a1, a2) => a2.quantity - a1.quantity) :
				(sort === "ValueAsc") ? result.sort((a1, a2) => (a1.price*a1.quantity) - (a2.price*a2.quantity)) :
				(sort === "ValueDesc") ? result.sort((a1, a2) => (a2.price*a2.quantity) - (a1.price*a1.quantity)) :
				result;
			}
			res.send(result);
		}
	});
});