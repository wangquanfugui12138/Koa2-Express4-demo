import React, { Component } from 'react'
import { Menu } from 'antd'
import { Link,withRouter } from 'react-router-dom'

const routerConfig = [
  {
    key: '/',
    title: '首页'
  }, {
    key: 'contact',
    title: '联系客服'
  },
]
class Nav extends Component {
  constructor() {
    super()
    this.state = {
      key: ['/'],
    }
  }
  componentDidMount() {
    this.setRoute()
    this.freshPageSetRoute()
  }
  setRoute = () => {
    this.props.history.listen(location => {
      const { pathname } = location
      routerConfig.forEach(item => pathname.indexOf(item.key) >= 0 && this.setState({ key: [item.key] }))
    })
  }
  freshPageSetRoute = () => {
    const { pathname } = this.props.history.location
    routerConfig.forEach(item => pathname.indexOf(item.key) >= 0 && this.setState({ key: [item.key] }))
  }
  render() {
    const { key } = this.state

    return (
      <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={key}
            style={{ lineHeight: '64px' }}
          >
            {
              routerConfig.map(item =>
                <Menu.Item key={item.key}>
                  {item.title}
                  <Link className='link' to={item.key} />
                </Menu.Item>)
            }
          </Menu>
    )
      
  }
}

export default withRouter(Nav)
