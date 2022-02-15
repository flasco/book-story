import { render } from 'react-dom';

import 'antd-mobile/es/global';

import App from './router';

import './initial';

import './base.scss';

render(<App />, document.getElementById('root')!);
