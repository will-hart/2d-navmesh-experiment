import * as React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import './styles.css'

import NavMeshApp from './navmesh/NavMeshApp'
import SteeringApp from './steering/SteeringApp'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/navmesh">
          <NavMeshApp />
        </Route>
        <Route path="/steering">
          <SteeringApp />
        </Route>
        <Route path="/">
          <div>
            <h1>Nav mesh experiments</h1>
            <p>
              A few random experiments with 2D navigation on a grid.{' '}
              <a href="https://github.com/will-hart/2d-navmesh-experiment">
                Github Repo
              </a>{' '}
              | <a href="https://2d-navmesh-experiment.vercel.app/">Demo</a>
            </p>
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
