import React from 'react'
import PropTypes from 'prop-types'

import { Form, Icon, Input, Button, Spin, message } from 'antd'
import LoginPic from '../assets/images/login_pic.png'

import './Login.css'
import axios from 'axios'

const FormItem = Form.Item
class LoginForm extends React.Component {
    static propTypes = {
        form: PropTypes.object,
        history: PropTypes.object
    }
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            nextPage: ''
        }
    }
    componentWillUnmount(){
        this.setState=()=>{}
    }
    componentDidMount() {
        this.getNextPage()
    }
    getNextPage = () => {
        const nextPage = this.props.history.location.search.replace('?next=', '')
        this.setState({nextPage})
    }
    login = e => {
        e.preventDefault()
        const { nextPage } = this.state
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({isLoading: true})
                const data = await axios.post('http://localhost:3001/login',{...values})

                this.setState({isLoading: false})
                if (data.success) {
                    localStorage.setItem('csrftoken',data.token) 
                    if (nextPage !== '') {
                        window.location = `${nextPage}`
                    } else {
                        window.location = '/'
                    }
                } else {
                    message.error('账号或用户名错误')
                }
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { isLoading } = this.state
        return (
            <Spin spinning={isLoading} size="large">
                <div className="login_wrapper">
                    <div className="login">
                        <div className="login_left">
                            <div className="login_picture">
                                <img src={LoginPic} alt="" />
                            </div>
                        </div>
                        <div className="login_right">
                            <div className="welcome">
                                欢迎使用
                            </div>
                            <div className="form_wrapper">
                                <Form onSubmit={this.login} className="login-form">
                                    <FormItem>
                                        {getFieldDecorator('username', {
                                            rules: [{ required: true, message: '请输入用户名!' }],
                                        })(
                                            <Input className="login_input" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                                        )}
                                    </FormItem>
                                    <FormItem>
                                        {getFieldDecorator('password', {
                                            rules: [{ required: true, message: '请输入密码!' }],
                                        })(
                                            <Input className="login_input" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                                        )}
                                    </FormItem>
                                    <FormItem>
                                        <Button className="login_btn" type="primary" htmlType="submit" style={{ width: "100%" }}>登录</Button>
                                    </FormItem>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        )
    }
}
const Login = Form.create()(LoginForm)
export default Login