var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

server.listen(process.env.port || 3001);
console.log("server running.. 3001")
app.get('/',function(req,res){

  res.sendFile(__dirname +"/index.html");

});

connections= [];
users = [];
 io.sockets.on("connection",function(socket){
   
     connections.push(socket);
    console.log("connected:  %s sockets connected",connections.length);   
        socket.on('disconnect',function(){
        connections.splice(connections.indexOf(socket),1);
        users.splice(users.indexOf(socket.username),1);
        updateusername();
        console.log("disconnected:  %s  sockets connected",connections.length);
      });
      socket.on('Send Message',function(data){
          io.sockets.emit('New Message',{msg:data,username:socket.username});
     });

     //Create new user
     socket.on('New User',function(data,callback){

        callback(true);
        socket.username = data;
        users.push(socket.username)
        updateusername();
     });

    
     function updateusername(){

       io.sockets.emit('Get User',users);
     }

     //who is typing
      
     socket.on('typing',function(data){

       socket.broadcast.emit('typing',{name:socket.username});

     });

     socket.on('stopTyping',function(data){

      socket.broadcast.emit('stopTyping',{name:socket.username});

    });

     

     //

  });
