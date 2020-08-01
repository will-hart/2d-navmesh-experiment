import * as React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import './styles.css'

import NavMeshApp from './navmesh/NavMeshApp'
import SteeringApp from './steering/SteeringApp'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/namesh">
          <NavMeshApp />
        </Route>
        <Route path="/steering">
          <SteeringApp />
        </Route>
        <Route path="/">
          <div>
            <h1>Nav mesh experiments</h1>
            <ul>
              <li>
                <Link to="navmesh">Navmesh Generation</Link>
              </li>
              <li>
                <Link to="steering">Steering</Link>
              </li>
            </ul>
          </div>
        </Route>
      </Switch>
    </Router>
  )
}
