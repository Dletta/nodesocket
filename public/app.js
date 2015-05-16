/*Global Variables and Object definition */
function message(name, message){
	this.name = name;
	this.message = message;
} 
/*define Angular Bootstrap App */
var app= angular.module('myApp', []);

/*Controller for index.html*/

app.controller('mainController', function($scope, socket){
	/*Dev verification that bootstrap works */
	$scope.name = "it works";
	/* Array for Object : Message with Message and Name Properties */
	$scope.messages = [];
	
	/* When new message is released we are adding it to the messages */
	socket.on('msg', function(msg){
		var name = msg.name;
		var mess = msg.message;
		$scope.messages.push(new message(name, mess));
	})
	
	
	
	/*Socket send the Message a user typed*/
	$scope.send = function() {
		var msg = {'message': $scope.msg, 'name': $scope.user};
		socket.emit('newMsg', msg);
		$scope.msg = "";
	};
});








/*Getting Socket Ready to be sued in the Scope Object*/
app.factory('socket', function($rootScope){
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});