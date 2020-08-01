import * as React from 'react'
import { Link } from 'react-router-dom'

import Seeker from './lib/Seeker'
import Vector2 from './lib/Vector2'

import { useAnimationFrame } from './canvasUtilities'

export default function SteeringApp() {
  const agent = new Seeker(new Vector2(50, 50), new Vector2(0, 0), 5, 3, 10)
  const { canvasRef } = useAnimationFrame(agent, 600, 600)

  return (
    <div className="App">
      <h1>Steering Experiments</h1>

      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <Link to="/">&lt; back</Link>
      </div>

      <canvas
        ref={canvasRef}
        width="600"
        height="600"
        style={{ width: '600px', height: '600px' }}
      />
    </div>
  )
}
