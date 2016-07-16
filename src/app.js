var Sequelize = require('sequelize');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
// var session = require('express-session');
var io = require('socket.io')(http);


var sequelize = new Sequelize('icebreaker', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	host: 'localhost',
	dialect: 'postgres',
	define: {
		timestamps: false
	}
});
//tables<<
var Session = sequelize.define('session', {
	uid: Sequelize.STRING,
	token: Sequelize.STRING,
	partner: Sequelize.STRING
});



	// server = http.createServer(app),
 //    io = require('socket.io').listen(server);
// app.use(qt.static(__dirname + './src/'));

app.use(express.static('./src/'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set('views', './src/views');
app.set('view engine', 'jade');





//routes<<


app.get('/', function(req, res){
	res.render('index');
});


app.get('/chat', function(req, res){
	res.render('chat');
});

app.post('/api', function(req, res){
	if (req.body.token != undefined && req.body.uid != undefined) {
		res.send(req.body.token + ' and id ' + req.body.uid)
	} else {
		res.send('no token and or id')
	}	
	console.log("token: " + req.body.token, req.body.uid)
	Session.create({
		token: req.body.token,
		uid: req.body.uid
	});
});

//>>>ATTEMPT TO ADD SOCKIT CHAT FUNCTION<<<<

// this should sent back the msg to everyone logged in
// including the sender (me)

// var socket = io.connect(serverBaseUrl);

// var sessionId = '';

io.emit('some event', { for: 'everyone' });

clients = [];

//adds an id and stores in clients object when connected
io.on('connection', function(socket) {
	console.info('New client connected (id=' + socket.id + ').');
	clients.push(socket);

//removes the id from the clients object when disconnected
socket.on('disconnect', function() {
	var index = clients.indexOf(socket);
	if (index != -1) {
		clients.splice(index, 1);
		console.info('Client gone (id=' + socket.id + ').');
	}
});
});

// a way to send msg to specific socketID
// io.on('connection', function(socket){
// 	socket.on('chat message', function(msg){
// 		socket.broadcast.to(socketid).emit('message', msg)
// 	})

// connects the user and logs that the when they
// are connected and disconnected.
io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

// gets the sessionId and logs it
// socket.on('connect', function () {
//     sessionId = socket.io.engine.id;
//     console.log('Connected ' + sessionId);    
//   });
// }




// //gets the message out of server to sent to chatbox
io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
});



// receives the msg in server, and logs the msg received
io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		console.log('chat message ' + msg);
	});
});



sequelize.sync({force: true}).then(function () {
	http.listen(3000, function(){
		console.log('listening on *:3000');
	});
});