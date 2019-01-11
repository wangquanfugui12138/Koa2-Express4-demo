import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import Nav from '../components/nav'
const MyLoadingComponent = () => {
    return ''
}
const Index = Loadable({
    loader: () => import(/* webpackChunkName: "Index" */'../pages/Index'),
    loading: MyLoadingComponent
})
const Login = Loadable({
    loader: () => import(/* webpackChunkName: "Login" */'../pages/Login'),
    loading: MyLoadingComponent
})
const Contact = Loadable({
    loader: () => import(/* webpackChunkName: "Contact" */'../pages/Contact'),
    loading: MyLoadingComponent
})
const NotFound = Loadable({
    loader: () => import(/* webpackChunkName: "404" */'../pages/404'),
    loading: MyLoadingComponent
})
const url = window.location.pathname

class routers extends Component {
    render() {
        return (
            <Router>
                <div>
                    {url.indexOf('/login') < 0 && <Nav />}
                    <Switch>
                        <Route exact path="/" component={Index} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/contact" component={Contact} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default routers