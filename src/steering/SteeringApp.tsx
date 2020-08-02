import * as React from 'react'
import { Link } from 'react-router-dom'

import Seeker from './lib/Seeker'
import Fleer from './lib/Fleer'
import Wanderer from './lib/Wanderer'
import Vector2 from './lib/Vector2'

import AgentSettings from './components/AgentSettings'
import useAgentSettings from './components/useAgentSettings'
import { useAnimationFrame } from './canvasUtilities'

export default function SteeringApp() {
  const { agent: seeker, ...seekerSettings } = useAgentSettings<Seeker>(
    new Seeker(new Vector2(50, 50), new Vector2(0, 0), 10, 3, 5),
  )

  const { agent: wanderer } = useAgentSettings<Wanderer>(
    new Wanderer(
      new Vector2(250, 250),
      new Vector2(0, 0),
      1.2,
      5,
      80,
      'goldenrod', // 'rgb(250, 210, 30)',
    ),
  )

  const { agent: pursuer } = useAgentSettings<Seeker>(
    new Seeker(
      new Vector2(450, 250),
      new Vector2(0, 0),
      1.4,
      9,
      80,
      'rgb(30, 30, 210)',
      true,
    ),
  )
  pursuer.current.setTargetAgent(wanderer.current)

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

  const {
    canvasRef,
    displayRadius,
    displayTarget,
    setDisplayRadius,
    setDisplayTarget,
  } = useAnimationFrame(
    [seeker.current, fleer.current, wanderer.current, pursuer.current],
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
  }

  return (
    <div className="App">
      <h1>Steering Experiments</h1>
      <p
        style={{
          fontSize: '0.9em',
          width: '80%',
          margin: 'auto',
          color: '#777',
        }}
      >
        <span style={{ fontWeight: 'bold', color: 'red' }}>Red</span> "seeker" -
        Left click to move.{' '}
        <span style={{ fontWeight: 'bold', color: 'green' }}>Green</span>{' '}
        "fleer" - runs away from red when nearby.{' '}
        <span style={{ fontWeight: 'bold', color: 'goldenrod' }}>Yellow</span>{' '}
        "wanderer" - wanders around randomly.{' '}
        <span style={{ fontWeight: 'bold', color: 'blue' }}>Blue</span> pursues
        yellow.
      </p>
      <p>
        <input
          id="display-radius-input"
          type="checkbox"
          checked={displayRadius}
          onChange={() => setDisplayRadius(!displayRadius)}
        />{' '}
        <label htmlFor="display-radius-input">Display active radius</label>
      </p>
      <p>
        <input
          id="display-target-input"
          type="checkbox"
          checked={displayTarget}
          onChange={() => setDisplayTarget(!displayTarget)}
        />{' '}
        <label htmlFor="display-radius-input">Display agent targets</label>
      </p>

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
        style={{ width: '600px', height: '600px', margin: 'auto' }}
      />
    </div>
  )
}
