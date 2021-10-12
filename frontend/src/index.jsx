import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.css';
import '@ant-design/pro-form/dist/form.css';
import '@ant-design/pro-layout/dist/layout.css';
import '@ant-design/pro-list/dist/list.css';
import { MainProvider } from './views/context/mainContext';
import { ConfigProvider } from 'antd';
import enUs from 'antd/lib/locale/en_US';

ReactDOM.render(
  <ConfigProvider locale={enUs}>
    <Router>
      <MainProvider>
        <App />
      </MainProvider>
    </Router>
  </ConfigProvider>,
  document.getElementById('root')
);
