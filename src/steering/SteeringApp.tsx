import * as React from 'react'
import { Link } from 'react-router-dom'

import Seeker from './lib/Seeker'
import Vector2 from './lib/Vector2'

import { useAnimationFrame } from './canvasUtilities'

export default function SteeringApp() {
  const agent = new Seeker(new Vector2(50, 50), new Vector2(0, 0), 5, 3, 10)
  const { canvasRef } = useAnimationFrame(agent, 600, 600)

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

    agent.setTarget(target)
  }

  return (
    <div className="App">
      <h1>Steering Experiments</h1>
      <h3>Click on the canvas to steer to that point</h3>

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
