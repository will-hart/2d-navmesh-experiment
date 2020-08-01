import * as React from 'react'
import './styles.css'

import NavMeshApp from './navmesh/NavMeshApp'
import SteeringApp from './steering/SteeringApp'

export default function App() {
  const [page, setPage] = React.useState<'home' | 'navmesh' | 'steering'>(
    'navmesh',
  )

  if (page === 'navmesh') return <NavMeshApp onBack={() => setPage('home')} />
  if (page === 'steering') return <SteeringApp onBack={() => setPage('home')} />

  return (
    <div>
      <h1>Nav mesh experiments</h1>
      <button onClick={() => setPage('navmesh')}>Navmesh Generation</button>
      <button onClick={() => setPage('steering')}>Steering</button>
    </div>
  )
}
