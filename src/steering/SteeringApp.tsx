import * as React from 'react'
import { Link } from 'react-router-dom'

import Seeker from './lib/Seeker'
import Fleer from './lib/Fleer'
import Vector2 from './lib/Vector2'

import AgentSettings from './components/AgentSettings'
import useAgentSettings from './components/useAgentSettings'
import { useAnimationFrame } from './canvasUtilities'

export default function SteeringApp() {
  const { agent: seeker, ...seekerSettings } = useAgentSettings<Seeker>(
    new Seeker(new Vector2(50, 50), new Vector2(0, 0), 10, 3, 5),
  )

  const { agent: fleer, ...fleerSettings } = useAgentSettings<Fleer>(
    new Fleer(
      new Vector2(350, 350),
      new Vector2(0, 0),
      1,
      1,
      100,
      'rgb(50, 200, 50)',
    ),
  )

  fleer.current.setTargetAgent(seeker.current)

  const { canvasRef } = useAnimationFrame(
    [seeker.current, fleer.current],
    600,
    600,
  )

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

    seeker.current.setTarget(target)
    fleer.current.setTarget(target)
  }

  return (
    <div className="App">
      <h1>Steering Experiments</h1>
      <h3>Click on the canvas to steer to that point</h3>

      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <Link to="/">&lt; back</Link>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <AgentSettings title="Seeker" {...seekerSettings} />
        <AgentSettings title="Fleer" {...fleerSettings} />
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
