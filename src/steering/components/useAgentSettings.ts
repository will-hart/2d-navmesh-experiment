import * as React from 'react'
import Seeker from '../lib/Seeker'
import { AgentSettingsProps } from './AgentSettings'

const useAgent = <T extends Seeker>(
  initialAgent: T,
): AgentSettingsProps & { agent: React.MutableRefObject<T> } => {
  const agent = React.useRef<T>(initialAgent)
  const [mass, _setMass] = React.useState(10)
  const [maxForce, _setMaxForce] = React.useState(3)
  const [maxVel, _setMaxVel] = React.useState(5)

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

  return { mass, setMass, maxForce, setMaxForce, maxVel, setMaxVel, agent }
}

export default useAgent
