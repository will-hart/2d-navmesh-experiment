import * as React from 'react'
import { Link } from 'react-router-dom'

import {
  SeekBehaviour,
  PursueBehaviour,
  WanderBehaviour,
  AvoidBoundariesBehaviour,
  FleeBehaviour,
  AttractorBehaviour,
} from './lib/behaviours'
import Vector2 from './lib/Vector2'

import AgentSettings from './components/AgentSettings'
import useAgentSettings from './components/useAgentSettings'
import { useAnimationFrame } from './canvasUtilities'
import SteeringAgent from './lib/SteeringAgent'

export default function SteeringApp() {
  // red click seeker
  let agent = new SteeringAgent(new Vector2(50, 50), [new SeekBehaviour()])
  agent.maxV = 1.2 * agent.maxV
  const { agent: seeker, ...seekerSettings } = useAgentSettings(agent)

  // yellow wanderer
  const { agent: wanderer } = useAgentSettings(
    new SteeringAgent(new Vector2(250, 250), [
      new WanderBehaviour(0.4),
      new AttractorBehaviour(300, 300, 300, 0.9),
      new AvoidBoundariesBehaviour(600, 600, 5, 8),
    ]),
  )
  wanderer.current.debugColor = 'goldenrod'

  // Blue pursuer
  agent = new SteeringAgent(new Vector2(450, 250), [
    new PursueBehaviour(0.5),
    new AvoidBoundariesBehaviour(600, 600, 20, 3),
  ])
  agent.effectRadius = 350
  agent.debugColor = 'rgb(30, 30, 210)'
  agent.targetAgent = wanderer.current
  agent.maxV *= 0.5
  const { agent: pursuer } = useAgentSettings(agent)

  // green fleer
  agent = new SteeringAgent(new Vector2(350, 350), [
    new FleeBehaviour(),
    new AvoidBoundariesBehaviour(600, 600, 20, 3),
  ])
  agent.debugColor = 'rgb(50, 200, 50)'
  agent.effectRadius = 200
  agent.targetAgent = seeker.current
  const { agent: fleer, ...fleerSettings } = useAgentSettings(agent)

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

    seeker.current.target = { position: target }
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
        <label htmlFor="display-target-input">Display agent targets</label>
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
