/*NodeSocket Server
	Trying to make a working Socket.io Server
	using Express and Angular
*/

/* Dependencies */
var util = require('util');
var express = require('express');
var io = require('socket.io')();
var morgan = require('morgan');
var http = require('http');

/*Setting up Express Server */
var app = express();
/*Setting up Socket IO instance for the bottom*/
var server = http.Server(app);


/*Serving Static Files */
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(function(err, req, res, next){
	console.log("Server Error: " + err);
	console.log("With Request " + util.inspect(req));
	res.send(err);
	next();
});

/*Defining Routes*/
app.get('/', function(req, res) {
	res.send('index.html');
});

/*Global Socket Array */
var users = [];
/*Socket Event Listener*/

io.sockets.on('connection', function(socket){
	console.log(socket.id + " has connected!");
	users.push(socket.id);
	console.log('Users:' + users);
	/* We get a message, we send it to all */
	socket.on('newMsg', function(msg){
		console.log("Message received from " + socket.id);
		console.log(msg);
		io.emit('msg', msg);
	});
	
	/* We get a message, we send a gift back to the guy who sent it */
	socket.on('newMsg', function(msg){
		socket.emit('msg', {'name':'Host', 'message':'Thanks for sending something!'});
	});
	
});

io.sockets.on('disconnection', function(socket){
	console.log(socket.id + " has gone");
	var index = users.indexOf(socket.id);
	if(index > -1){
		users.splice(index, 1);
	}
});

/*Initialising Server*/
server.listen('3000', function(){
	console.log('Server listening on Port 3000');
});
io.listen(server);
