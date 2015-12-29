$(document).ready( function(){
    //Globals
    var nickname = "Anonymous";   
    var typing = false;

    var socket = io();
    
    function notTyping(){
         typing = false;
         socket.emit('typing' , false);
      }

    socket.emit('add user' , nickname);
    $('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
      });

    socket.on('chat message',function(msg,name){
     $('#messages').append($('<li>').text(name + ' : ' + msg));
     clearTimeout(timeout);
     timeout = setTimeout(notTyping , 0);
     
     });

    socket.on('chat notif',function(prev,user){
     if(user != 'Anonymous')
     {
       if(prev != 'Anonymous')
       $('#messages').append($('<li>').text(prev + " changed his name to " + user));
       else
       $('#messages').append($('<li>').text("new user "+ user + " joined"));
     }
    });

    socket.on('leave chat',function(name){
     $('#messages').append($('<li>').text(name + " has left the chat "));
    });


    socket.on('update username' , function(nickname){
     $('.name').text("your nickname is: " + nickname);
     });
     

      
    $('#nick_btn').click( function(){
       nickname = $('#nick').val();
       if ( !$.trim(nickname) )
        { 
          socket.emit('add user' , "Anonymous");
        }
       else
        { 
          socket.emit('add user' , nickname);
          console.log(socket);
        }
         
     });

    socket.on('update online list' , function(usernames,num_users){
       $('#num_users').html('Total users(Anonymous + Non Anonymous): '+ String(num_users));
       $('#online-list').html('');
       var html = ''
       if(usernames.length != 0)
       {
       for(var i=0 ;i<usernames.length;i++)
       {
          html += '<li>' + usernames[i] + '</li>';
       }
       $('#online-list').html(html);
       }
       else
      { $('#online-list').html("<li> No one online </li>");}
      });
  
      $('#m').keypress(function(e){
            if(e.which !==13)
             {
               if(typing == false && $('#m').is(':focus'))
               {
                  typing = true;
                  socket.emit('typing' , true);
               }
               else
               {  
                  clearTimeout(timeout);
                  timeout = setTimeout(notTyping , 4000);
               }
             }
      }); 

    socket.on('istyping' , function(name , is_typing){
         if(is_typing){
            if(name != 'Anonymous' && name != null )  
            {
            $('#info').append("<li id='" + name +"'>" + name +"is typing</li>");
            timeout = setTimeout(notTyping , 4000);
            }
            else
            {
              typing = false;
            }
         }
         else
         {
            $("#" + name).remove();
         }
   }); 
              
      
});
