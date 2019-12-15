import React from 'react';
import { setConfig } from 'react-hot-loader';
import { render } from 'react-dom';
import App from './app';

setConfig({
  pureRender: true, // RHL will not change render method
});

document.body.addEventListener('touchmove', function (e) {
  e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
}, { passive: false }); //passive 参数不能省略，用来兼容ios和android

render(<App />, document.getElementById('root'));
