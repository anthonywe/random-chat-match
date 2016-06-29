var Sequelize = require('sequelize');
var express = require('express');
// var http = require('http').Server(app);
var session = require('express-session');
// var io = require('socket.io')(http);


var sequelize = new Sequelize('final', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	host: 'localhost',
	dialect: 'postgres',
	define: {
		timestamps: false
	}
});
var app = express();
// app.use(qt.static(__dirname + './src/'));
// app.use(express.static('./src/'));
app.use(express.static('./src/'));

app.set('views', './src/views');
app.set('view engine', 'jade');


//tables<<

app.use(session({
	secret: 'oh wow very secret much security',
	resave: true,
	saveUninitialized: false
}));



//routes<<

// app.get('/', function(req, res){
//   res.render('chat');
// });

app.get('/', function(req, res){
  res.render('index');
});

// io.on('connection', function(socket){
//   console.log('a user connected');
// });


sequelize.sync().then(function () {
	var server = app.listen(3000, function () {
		console.log('Final app listening on port: ' + server.address().port);
	});
});