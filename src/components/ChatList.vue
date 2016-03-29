<template>
  <chat-line v-for="msg in msgs" track-by="$index" :data="msg"></chat-line>
</template>

<script>
  import ChatLine from './ChatList/ChatLine.vue';

  let client;
  let channel = 'simulatedgreg';

  function initClient() {
    return new Promise((res, rej) => {
      let options = {
        options: {
          debug: true
        },
        connection: {
          cluster: 'aws',
          reconnect: true
        },
        channels: [`#${channel}`]
      };

      client = new irc.client(options);
      client.connect();

      let wait = setInterval(() => {
        if(client.readyState() === 'OPEN') {
          clearInterval(wait);
          res();
        }
      }, 100);
    });
  }

  export default {
    components: { ChatLine },
    data() {
      return {
        ffz: null,
        ffzEmotes: null,
        msgs: []
      }
    },
    methods: {
      getFFZ() {
        this.ffzEmotes = [];
        this.$http.get(`https://api.frankerfacez.com/v1/room/${channel}`)
          .then((res) => {
            if(res.status === 200)
              this.ffz = res.data;

              for(let emote in this.ffz.sets) {
                if(this.ffz.sets.hasOwnProperty(emote)) {
                  for(let i = 0; i < this.ffz.sets[emote].emoticons.length; i++) {
                    this.ffzEmotes.push({
                      ffz: true,
                      id: this.ffz.sets[emote].emoticons[i].id,
                      name: this.ffz.sets[emote].emoticons[i].name
                    });
                  }
                }
              }
          });
      },
      readMessages() {
        client.on('message', (channel, user, message, self) => {
          this.msgs.push({
            channel,
            message,
            user
          });
        });
      }
    },
    ready() {
      initClient().then(() => {
        this.readMessages();
        this.getFFZ();
      });
    }
  }
</script>
