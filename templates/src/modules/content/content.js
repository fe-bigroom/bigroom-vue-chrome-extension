import Vue from 'vue';
import App from './App.vue';

import { injectRootDom, onMessage, sendMessage } from './util';

const contentId = 'chrome-content-root';

onMessage(({ action, data }, sender, response) => { // eslint-disable-line
  switch (action) {
    case 'init':
      window.chromeContentConfig = Object.assign({}, data);
      break;

    default: break;
  }
});

sendMessage('init');
injectRootDom(contentId);

/* eslint-disable no-new */
new Vue({
  el: `#${contentId}`,
  render: h => h(App),
});
