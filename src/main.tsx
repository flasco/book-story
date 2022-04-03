import { createRoot } from 'react-dom/client';

import 'antd-mobile/es/global';

import App from './router';

import './initial';

import './base.scss';

createRoot(document.getElementById('root')!).render(<App />);
