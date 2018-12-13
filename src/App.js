import React, { Component } from 'react'
import Routers from './router/router'
import { Layout } from 'antd'

import './App.css';
const {  Footer } = Layout

class App extends Component {
  render() {

    return (
      <Layout>
        <Routers />
        <Footer style={{color:'silver',textAlign:'center'}}>
          Copyright © Yuk·Jo 2018/11
        </Footer>
      </Layout>
    )
  }
}

export default App
