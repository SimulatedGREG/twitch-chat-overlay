$(document).ready(function() {

  var message_template = $('#message').html();
  Mustache.parse(message_template);

  var options = {
      options: {
          debug: true
      },
      connection: {
          random: "chat",
          reconnect: true
      },
      channels: ["#simulatedgreg"]
  };

  var client = new irc.client(options);

  client.connect();

  client.on('message', function(channel, user, message, self) {
    //check for emotes
    function replaceRange(s, start, end, substitute) {
      return s.substring(0, start) + substitute + s.substring(end);
    }

    function getEmoteName(start,end) {
      return message.substring(start, Number(end)+1);
    }

    if(user.emotes) {
      var new_message = message;
      for (var key in user.emotes) {
        if (user.emotes.hasOwnProperty(key)) {
          var re = new RegExp('\\b' + getEmoteName(user.emotes[key][0].split('-')[0], user.emotes[key][0].split('-')[1]) + '\\b', 'g');
          new_message = new_message.replace(re, '<img src="http://static-cdn.jtvnw.net/emoticons/v1/' + key + '/1.0">');
        }
      }
      message = new_message;
    }

    var rendered = Mustache.render(message_template, {
      user: user['display-name'],
      message: message,
      color: user.color,
      type: user['message-type']
    });

    console.log(user);

    // http://static-cdn.jtvnw.net/emoticons/v1/{image_id}/1.0


    $('#chat-messages').append(rendered);
    $('.chatline').one('webkitAnimationEnd', function() {
      $(this).detach();
      // $('#chat-messages br').detach();
    });
  });

});
