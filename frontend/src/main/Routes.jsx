import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/Home'
import Hardwares from '../components/products/Hardwares'
import Desktops from '../components/products/Desktops'
import Mobiles from '../components/products/Mobiles'

export default props =>
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/hardwares' component={Hardwares} />
        <Route path='/desktops' component={Desktops} />
        <Route path='/mobiles' component={Mobiles} />
        <Redirect from='*' to='/' />
    </Switch>