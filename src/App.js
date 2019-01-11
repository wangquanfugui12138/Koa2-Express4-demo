import React, { Component } from 'react'
import Routers from './router/router'
import { Layout } from 'antd'

import './App.css'

const {  Footer } = Layout
const url = window.location.pathname
const token = localStorage.getItem('csrftoken')

!token && url.indexOf('/login') < 0 && (window.location.href = `/login?next=${window.location.pathname}`) 

class App extends Component {
  render() {
    const date = new Date()
    return (
      <Layout>
        <Routers />
        <Footer style={{color:'silver',textAlign:'center'}}>
          Copyright © Yuk·Jo {`${ date.getFullYear()}/${+date.getMonth()+1}`}
        </Footer>
      </Layout>
    )
  }
}

export default App
