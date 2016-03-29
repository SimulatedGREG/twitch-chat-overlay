import Vue from 'vue';
import Resource from 'vue-resource';

import App from './App.vue';

Vue.use(Resource);
Vue.config.debug = true;

var app = new Vue({
  el: 'body',
  components: { App }
});
