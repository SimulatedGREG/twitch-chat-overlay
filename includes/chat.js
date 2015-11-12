$(document).ready(function() {

  //url settings
  function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }

  var params = getUrlVars();

  var _CHANNEL = $('#channel').text();
  var message_template = $('#message').html();
  Mustache.parse(message_template);

  var options = {
      options: {
          debug: true
      },
      connection: {
          random: 'chat',
          reconnect: true
      },
      channels: ['#' + _CHANNEL]
  };
  var badges, ffz;

  var client = new irc.client(options);

  client.api({
    url: 'https://api.twitch.tv/kraken/chat/' + _CHANNEL + '/badges'
  }, function(err, res, body) {
    badges = body;
  });

  $.ajax({
    method: 'GET',
    url: 'https://api.frankerfacez.com/v1/room/' + _CHANNEL,
    success: function(data, textStatus, xhr) {
      ffz = data;
    },
    error: function(xhr, textStatus, err) {
      ffz = null;
    }
  });

  client.connect();

  client.on('message', function(channel, user, message, self) {
    message = message.replace(/<[^>]*>?/g, '');

    function replaceRange(s, start, end, substitute) {
      return s.substring(0, start) + substitute + s.substring(end);
    }

    function getEmoteName(start,end) {
      return message.substring(start, Number(end)+1);
    }

    if(user.emotes) {
      var new_message = message;
      for(var key in user.emotes) {
        if(user.emotes.hasOwnProperty(key)) {
          var re = new RegExp('\\b' + getEmoteName(user.emotes[key][0].split('-')[0], user.emotes[key][0].split('-')[1]) + '\\b', 'g');
          new_message = new_message.replace(re, '<img src="http://static-cdn.jtvnw.net/emoticons/v1/' + key + '/1.0">');
        }
      }
      message = new_message;
    }

    if(ffz) {
      for(var set in ffz.sets) {
        if(ffz.sets.hasOwnProperty(set)) {
          for(var i = 0; i < ffz.sets[set].emoticons.length; i++) {
            var reg = new RegExp('\\b' + ffz.sets[set].emoticons[i].name + '\\b', 'g');
            message = message.replace(reg, '<img src="http:' + ffz.sets[set].emoticons[i].urls['1'] + '">');
          }
        }
      }
    }

    var rendered = $(Mustache.render(message_template, {
      user: user['display-name'] || user.username,
      message: message,
      color: user.color || 'black',
      type: user['message-type'],
      subscriber: user.subscriber,
      sub_icon: badges.subscriber !== null ? badges.subscriber.image : null,
      turbo: user.turbo,
      turbo_icon: badges.turbo.image,
      mod: user['user-type'] == 'mod' ? true : false,
      mod_icon: (!ffz ? badges.mod.image : (!ffz.room.moderator_badge ? badges.mod.image : 'http:' + ffz.room.moderator_badge)),
      broadcaster: channel.substr(1, channel.length-1) == user.username ? true : false,
      broadcaster_icon: badges.broadcaster.image,
      ffz: !ffz ? false : true
    }));

    $('#chat-messages').append(rendered);

    var settings = {
      screenPosition: params.screenPosition || 'bottomLeft'
    };

    switch(settings.screenPosition) {
      case 'bottomRight':
        settings.screenPosition = 'slideRightBigIn';
        $('#container').addClass('rightBottom');
        break;
      default:
        settings.screenPosition = 'slideLeftBigIn';
        $('#container').addClass('leftBottom');      
    }


    $(rendered).slideDown(300).find('div').velocity('transition.' + settings.screenPosition, {
      display: 'inline-block'
    }).velocity('fadeOut', {
      duration: 1000,
      delay: 5000,
      complete: function(elm) {
        $(this).parent().detach();
      }
    });

  });

});
