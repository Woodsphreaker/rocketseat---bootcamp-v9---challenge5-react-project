import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Main from './pages/Main'
import Repository from './pages/Repository'
import TestPage from './pages/Users'

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main}></Route>
        <Route path="/repository" component={Repository}></Route>
        <Route path="/test-page" component={TestPage}></Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
