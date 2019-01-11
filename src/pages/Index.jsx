import React, { Component } from 'react'
import { Button, Input, message, Spin } from 'antd'
import axios from 'axios'

class Index extends Component {
  constructor() {
    super()
    this.state = {
      filteredData: [],
      isLoading: true
    }
    this.nameInput = React.createRef()
  }
  componentWillUnmount(){
    this.setState=()=>{}
  }
  componentDidMount() {
    this.nameInput.current.focus()
    this.getData()
  }
  getData = async () => {
    const data = await axios.get(`http://localhost:3001/todoList`)

    this.setState({ filteredData: data.data, isLoading: false })
    !data.success && message.error('获取todoList失败！')
  }
  write = async e => {
    e.preventDefault()

    const { filteredData } = this.state
    const postData = {
      name: this.nameInput.current.input.value || '空',
      isDoing: false,
      createDate: Date.now()
    },
      data = await axios.post('http://localhost:3001/todoList', postData)

    if (data.success) {
      filteredData.push({ ...data.data })

      this.setState({ filteredData })
      message.success('添加成功')
    } else {
      message.error('添加失败')
    }

  }
  search = async e => {
    e.preventDefault()

    const data = await axios.get(`http://localhost:3001/todoList/${this.nameInput.current.input.value}`)

    !data.data.length ? message.warning('该名称不存在') : message.success(`共有${data.data.length}个结果`)
  }
  delete = async e => {
    e.preventDefault()

    let { filteredData } = this.state, name = e.target.id
    const data = await axios.delete(`http://localhost:3001/todoList/${name}`)

    if (data.success) {
      for (let i = 0, len = filteredData.length; i < len; i++) {
        if (filteredData[i].name === name) {
          filteredData.splice(i, 1)
          break
        }
      }

      this.setState({ filteredData })
      message.success('删除成功')
    } else {
      message.error('删除失败')
    }
  }
  render() {
    const { filteredData, isLoading } = this.state
    return (
      <div className="App">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Input style={{ width: '200px', float: 'left' }} ref={this.nameInput} />
          <Button type='primary' onClick={this.write} style={{ margin: '0 15px' }}>添加</Button>
          <Button type='primary' onClick={this.search}>查询</Button>
        </div>
        <Spin spinning={isLoading}>
          <ol style={{ display: 'block', background: '#fff', boxShadow: ' 0 0 5px 5px silver', width: '300px', margin: '20px auto', height: '400px', overflowY: 'scroll' }}>
            {
              filteredData.map((item, index) => <li key={index} id={item.name} className='item' onClick={this.delete}>{item.name}</li>)
            }
          </ol>
        </Spin>
      </div>
    );
  }
}

export default Index;
