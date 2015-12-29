var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
 
app.use(express.static(__dirname + '/public'));


app.get('/' , function(req , res){
      res.sendFile(__dirname + '/index.html');
});

var usernames = [];
var no_of_users = 0;
var named_users = 0;
//var rooms = []
//var users_in_rooms =[]

io.on('connection' , function(socket){
  debugger;
  console.log('a user connected');
  no_of_users++;
  io.emit('update online list' , usernames,no_of_users);
  console.log("no of total users=" + String(no_of_users));
  console.log("no of named users=" + String(named_users)); 


  socket.on('disconnect', function(){
  console.log('user disconnected');
  if(socket.username != 'Anonymous' && socket.username != null)
  {  no_of_users-- ;
     named_users--;
     index = usernames.indexOf(socket.username);
     usernames.splice(index,1);
     io.emit('leave chat', socket.username);
   }
  else
  {
    no_of_users--;
  }
  io.emit('update online list' , usernames,no_of_users);
  });


  socket.on('chat message', function(msg){
  if(socket.username == null)
    socket.username = 'Anonymous';
  io.emit('chat message',msg,socket.username);
  });


/*
 * Used to add new users as well as change names
*/
  socket.on('add user' , function(name){
  previous_name = socket.username;
  if(previous_name)
   {
    if(name == 'Anonymous' && previous_name != 'Anonymous') 
      {
        named_users--;
        index = usernames.indexOf(previous_name);
        usernames.splice(index,1);
        io.emit('leave chat', previous_name);
      }
   }
  socket.username = name;
  if(socket.username != 'Anonymous' && previous_name == null)
  {
   named_users++;
   usernames.push(socket.username);
  }
 else if(socket.username != 'Anonymous' && previous_name == 'Anonymous')
  {
   named_users++;
   usernames.push(socket.username);
  }
  else if(socket.username != 'Anonymous' && previous_name != 'Anonymous')
  {
        index = usernames.indexOf(previous_name);
        usernames.splice(index,1);
        usernames.push(socket.username);
  }
 
  console.log(usernames);
  socket.emit('update username' , socket.username);
  socket.broadcast.emit('chat notif',previous_name , socket.username)    
  io.emit('update online list' , usernames,no_of_users);
  });


  socket.on('typing' , function(is_typing){
          io.emit('istyping',socket.username,is_typing);
          console.log("ran");
});
});

    
http.listen(3000 , function(){
  console.log('listening on *:3000');
  });
