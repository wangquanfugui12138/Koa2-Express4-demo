import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import './config.js';
import 'antd/dist/antd.min.css'
ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()