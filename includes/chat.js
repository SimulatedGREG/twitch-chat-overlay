$(document).ready(function() {

  var message_template = $('#message').html();
  // Mustache.parse(message);

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
    var rendered = Mustache.render(message_template, {
      user: user['display-name'],
      message: message,
      color: user.color,
      type: user['message-type']
    });
    $('#chat-messages').append(rendered);
    $('.chatline').one('webkitAnimationEnd', function() {
      $(this).detach();
    });
    $('.kappa').kappa({
      customClass: 'twitch-emote'
    });
    $('.kappa').removeClass('kappa');
  });

});
