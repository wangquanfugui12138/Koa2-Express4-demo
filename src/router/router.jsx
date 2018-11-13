import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import Nav from '../components/nav'
const MyLoadingComponent = () => {
    return ''
}
const Index = Loadable({
    loader: () => import('../pages/Index'),
    loading: MyLoadingComponent
})
const Contact = Loadable({
    loader: () => import('../pages/Contact'),
    loading: MyLoadingComponent
})


class routers extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Nav />
                    <Switch>
                        <Route exact path="/" component={Index} />
                        <Route exact path="/contact" component={Contact} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default routers