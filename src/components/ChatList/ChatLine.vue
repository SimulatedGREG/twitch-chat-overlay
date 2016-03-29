<template>
  {{ username }}: <span v-html="message"></span><br>
</template>

<script>
  export default {
    computed: {
      message() {
        if(this.data.user.emotes !== null || this.$parent.ffz !== null) {
          return this.addEmotes();
        }
        else return this.data.message;
      },
      username() {
        return (
          this.data.user['display-name'] !== null ?
            this.data.user['display-name'] :
            this.data.user.username
        );
      }
    },
    data() {
      return { emotes: [] }
    },
    methods: {
      addEmotes() {
        let emotes = this.data.user.emotes;
        let output = this.data.message;

        for(let emote in emotes) {
          if(emotes.hasOwnProperty(emote)) {
            this.emotes.push({
              id: emote,
              name: output.substring(
                Number(emotes[emote][0].split('-')[0]),
                Number(emotes[emote][0].split('-')[1])+1
              )
            });
          }
        }

        if(this.$parent.ffz !== null)
          this.emotes = this.emotes.concat(this.$parent.ffzEmotes);



        for(let i = 0; i < this.emotes.length; i++) {
          let emoteUrl = this.emotes[i].ffz ?
            'https://cdn.frankerfacez.com/emoticon/{key}/1' :
            'http://static-cdn.jtvnw.net/emoticons/v1/{key}/1.0';

          let b = (this.emotes[i].name.length < 4) ? '' : '\\b';
          this.emotes[i].name = this.emotes[i].name.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
          let re = new RegExp(b + this.emotes[i].name + b, 'g');
          let imgTag = '<img src="' + emoteUrl.replace('{key}', this.emotes[i].id) + '">';
          output = output.replace(re, imgTag);

        }

        return output;
      }
    },
    props: ['data']
  }
</script>
