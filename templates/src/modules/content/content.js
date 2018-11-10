import Vue from 'vue';
import App from './App.vue';

import { injectRootDom, onMessage, sendMessage, onExtensionReload } from './util';

const content = {
  contentId: 'chrome-content-root',

  run() {
    this.listen();
    sendMessage('init');
    injectRootDom(this.contentId);

    this.render();
  },

  listen() {
    onMessage(({ action, data }, sender, response) => { // eslint-disable-line
      switch (action) {
        case 'init':
          window.chromeContentConfig = Object.assign({}, data);
          break;
        // todo
        default: break;
      }
    });

    // auto reload extension when save
    if (process.env.NODE_ENV !== 'production') {
      onExtensionReload(process.env.PORT);
    }
  },
  render() {
    /* eslint-disable no-new */
    new Vue({
      el: `#${this.contentId}`,
      render: h => h(App),
    });
  },
}

content.run();
