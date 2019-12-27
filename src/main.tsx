import React from 'react';
import { setConfig } from 'react-hot-loader';
import { render } from 'react-dom';
import EE from 'onfire.js';

import App from './app';

export const ee = new EE();

setConfig({
  pureRender: true, // RHL will not change render method
});

document.body.addEventListener(
  'touchmove',
  function(e) {
    e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
  },
  { passive: false }
); //passive 参数不能省略，用来兼容ios和android

document.body.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

document.addEventListener('visibilitychange', function() {
  ee.fire('app-state', !document.hidden);
});

render(<App />, document.getElementById('root'));
