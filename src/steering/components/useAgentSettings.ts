import * as React from 'react'
import { ISteeredAgent } from '../lib/Seeker'
import { AgentSettingsProps } from './AgentSettings'

const useAgent = <T extends ISteeredAgent>(
  initialAgent: T,
): AgentSettingsProps & { agent: React.MutableRefObject<T> } => {
  const agent = React.useRef<T>(initialAgent)
  const [mass, _setMass] = React.useState(agent.current.mass)
  const [maxForce, _setMaxForce] = React.useState(agent.current.maxF)
  const [maxVel, _setMaxVel] = React.useState(agent.current.maxV)
  const [activeRadius, _setactiveRadius] = React.useState(
    agent.current.activeRadius,
  )

  const setMass = (mass: number) => {
    _setMass(mass)
    agent.current.mass = mass
  }
  const setMaxForce = (maxF: number) => {
    _setMaxForce(maxF)
    agent.current.maxF = maxF
  }
  const setMaxVel = (maxVel: number) => {
    _setMaxVel(maxVel)
    agent.current.maxV = maxVel
  }
  const setActiveRadius = (activeRadius: number) => {
    _setactiveRadius(activeRadius)
    agent.current.activeRadius = activeRadius
  }

  return {
    mass,
    activeRadius,
    setActiveRadius,
    setMass,
    maxForce,
    setMaxForce,
    maxVel,
    setMaxVel,
    agent,
  }
}

export default useAgent
