module.exports = function(io){
	io.sockets.on('connection', function(socket){
		console.log("Cliente connected");

		socket.on('set_nickname', function(nickname,
			callback){
			console.log('Trying to set nickname: ' + nickname);

			var isAvailable = isNicknameAvailable(nickname);

			if (isAvailable)
				socket.nickname = nickname;
			callback(isAvailable);

			sendMessage("SERVER", "User @" + nickname + " has conected");

		});

		socket.on('message', function(message){
			sendMessage(socket.nickname, message);	
		});

		socket.on('disconnection', function(){
			sendMessage("SERVER", "User @" + socket.nickname + " has disconnected.");
		});
	});

	var sendMessage = function(nickname, message){
		io.sockets.emit('message', nickname, message);
	};

	var isNicknameAvailable = function(nickname){
		 var clients = io.sockets.clients();

		 for (var client in clients){
		 	if (clients.hasOwnProperty(client)){
		 		client = clients[client];

		 		if (client.nickname == nickname)
		 			return false;
		 	}
		 }
		return true;
	};
}	
