import React from 'react';
import ReactDOM from 'react-dom';
import { AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui';
import { VKMiniAppAPI } from '@vkontakte/vk-mini-apps-api';
import bridge from '@vkontakte/vk-bridge';

import '@vkontakte/vkui/dist/vkui.css';

import { App } from './App';

import { loadEruda } from './eruda';

loadEruda();

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider>
      <AdaptivityProvider>
        <App vkAPI={new VKMiniAppAPI(bridge)} />
      </AdaptivityProvider>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
