import * as React from 'react'
import { Link } from 'react-router-dom'

import Seeker from './lib/Seeker'
import Vector2 from './lib/Vector2'

import { useAnimationFrame } from './canvasUtilities'

export default function SteeringApp() {
  const [mass, setMass] = React.useState(10)
  const [maxForce, setMaxForce] = React.useState(3)
  const [maxVel, setMaxVel] = React.useState(5)
  const agent = React.useRef<Seeker>(
    new Seeker(new Vector2(50, 50), new Vector2(0, 0), maxVel, maxForce, mass),
  )
  const { canvasRef } = useAnimationFrame(agent.current, 600, 600)

  const getClickedPoint = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): Vector2 | null => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return null

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      return new Vector2(x, y)
    },
    [canvasRef],
  )

  const handleOnClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const target = getClickedPoint(e)
    if (!target) return

    agent.current.setTarget(target)
  }

  return (
    <div className="App">
      <h1>Steering Experiments</h1>
      <h3>Click on the canvas to steer to that point</h3>

      <div>
        Agent mass
        <input
          type="range"
          min="1"
          max="100"
          value={mass}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10)
            setMass(val)
            agent.current.mass = val
          }}
        />
        {mass} kg
      </div>
      <div>
        Agent max velocity
        <input
          type="range"
          min="1"
          max="100"
          value={maxVel}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10)
            setMaxVel(val)
            agent.current.maxV = val
          }}
        />
        {maxVel} m/s
      </div>
      <div>
        Agent max steering force
        <input
          type="range"
          min="1"
          max="50"
          value={maxForce}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10)
            setMaxForce(val)
            agent.current.maxF = val
          }}
        />
        {maxForce} N
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <Link to="/">&lt; back</Link>
      </div>

      <canvas
        onClick={handleOnClick}
        ref={canvasRef}
        width="600"
        height="600"
        style={{ width: '600px', height: '600px' }}
      />
    </div>
  )
}
