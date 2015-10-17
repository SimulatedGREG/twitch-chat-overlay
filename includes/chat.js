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
      channels: ["#trihex"]
  };
  var badges;

  var client = new irc.client(options);

  client.api({
    url: 'https://api.twitch.tv/kraken/chat/' + options.channels[0].substr(1, options.channels[0].length-1) + '/badges'
  }, function(err, res, body) {
    badges = body;
  });

  client.connect();

  client.on('message', function(channel, user, message, self) {
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
      user: user['display-name'] || user.username,
      message: message,
      color: user.color || 'black',
      type: user['message-type'],
      subscriber: user.subscriber,
      sub_icon: badges.subscriber.image,
      turbo: user.turbo,
      turbo_icon: badges.turbo.image,
      mod: user['user-type'] == 'mod' ? true : false,
      mod_icon: badges.mod.image
    });

    $('#chat-messages').append(rendered);
    $('.chatline').one('webkitAnimationEnd', function() {
      $(this).next().detach();
      $(this).detach();
    });
  });

});
