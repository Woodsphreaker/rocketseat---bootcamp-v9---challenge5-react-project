import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Main from './pages/Main'
import Repository from './pages/Repository'

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main}></Route>
        <Route path="/repository" component={Repository}></Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
