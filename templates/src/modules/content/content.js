import Vue from 'vue';
import App from './App.vue';

console.log('content injected done!');

/* eslint-disable no-new */
new Vue({
  el: '#chrome-content-root',
  render: h => h(App),
});
