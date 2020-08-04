import * as React from 'react'
import SteeringAgent from '../lib/SteeringAgent'
import { AgentSettingsProps } from './AgentSettings'

const useAgent = (
  initialAgent: SteeringAgent,
): AgentSettingsProps & { agent: React.MutableRefObject<SteeringAgent> } => {
  const agent = React.useRef<SteeringAgent>(initialAgent)
  const [mass, _setMass] = React.useState(agent.current.mass)
  const [maxForce, _setMaxForce] = React.useState(agent.current.maxF)
  const [maxVel, _setMaxVel] = React.useState(agent.current.maxV)
  const [effectRadius, _setEffectRadius] = React.useState(
    agent.current.effectRadius,
  )
  const [stoppingRadius, _setStoppingRadius] = React.useState(
    agent.current.stoppingRadius,
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
  const setEffectRadius = (effectRadius: number) => {
    _setEffectRadius(effectRadius)
    agent.current.effectRadius = effectRadius
  }
  const setStoppingRadius = (stoppingRadius: number) => {
    _setStoppingRadius(stoppingRadius)
    agent.current.stoppingRadius = stoppingRadius
  }

  return {
    mass,
    effectRadius,
    setEffectRadius,
    setMass,
    maxForce,
    setMaxForce,
    maxVel,
    setMaxVel,
    stoppingRadius,
    setStoppingRadius,
    agent,
  }
}

export default useAgent
