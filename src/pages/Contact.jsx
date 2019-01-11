import React, { Component } from 'react'
import { Upload, Icon, message,Button } from 'antd'
import axios from 'axios'

const Dragger = Upload.Dragger

const props = {
  name: 'file',
  multiple: true,
  action: '//localhost:3001/upload',
  onChange(info) {
    const status = info.file.status
    if (status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
    } else if (status === 'error') {
      if(info.file.error.status === 401) {
        message.warning('请先登录')
        window.location.href = `/login?next=${window.location.pathname}` 
      }
      message.error(`${info.file.name} file upload failed.`)
    }
  },
}

class Contact extends Component {
  state = {
    img:''
  }
  componentWillUnmount(){
    this.setState=()=>{}
  }
  outdoor = async () =>{
    await axios.get(`http://localhost:3001/out`)
  }
  downloadFile = () =>{
    window.open(`http://localhost:3001/downloadFile/1.csv`,'_self')
  }
  downloadImg = () =>{
    window.open(`http://localhost:3001/downloadImg/1.jpg`,'_self')
  }
  batchDownload = async () => {
    window.open('http://localhost:3001/batchDownload','_self')
    //.then(res=>window.open('http://localhost:3001/batchDownload','_self'))
    // window.open('http://localhost:3001/batchDownload','_self')
  }
  render() {
    return (
      <div>
        <Button onClick={this.outdoor}>google</Button>
        <Button onClick={this.downloadFile}>downloadFile</Button>
        <Button onClick={this.downloadImg}>downloadImg</Button>
        <Button onClick={this.batchDownload}>batchDownload</Button>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
        </Dragger>
      </div>
    )
      
  }
}

export default Contact
