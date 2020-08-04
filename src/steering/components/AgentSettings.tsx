import * as React from 'react'

export interface AgentSettingsProps {
  effectRadius: number
  setEffectRadius: (val: number) => void
  mass: number
  setMass: (val: number) => void
  maxForce: number
  setMaxForce: (val: number) => void
  maxVel: number
  setMaxVel: (val: number) => void
  stoppingRadius: number
  setStoppingRadius: (val: number) => void
}

const AgentSettings = ({
  title,
  effectRadius,
  setEffectRadius,
  mass,
  setMass,
  maxForce,
  setMaxForce,
  maxVel,
  setMaxVel,
  stoppingRadius,
  setStoppingRadius,
}: AgentSettingsProps & { title: string }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '1em',
        marginBottom: '1em',
      }}
    >
      <h3>Settings for {title}</h3>
      <div>
        {title} mass
        <input
          type="range"
          min="1"
          max="100"
          value={mass}
          onChange={(e) => {
            setMass(parseInt(e.target.value, 10))
          }}
        />
        {mass} kg
      </div>
      <div>
        {title} max velocity
        <input
          type="range"
          min="1"
          max="100"
          value={maxVel}
          onChange={(e) => {
            setMaxVel(parseInt(e.target.value, 10))
          }}
        />
        {maxVel} m/s
      </div>
      <div>
        {title} max steering force
        <input
          type="range"
          min="1"
          max="50"
          value={maxForce}
          onChange={(e) => {
            setMaxForce(parseInt(e.target.value, 10))
          }}
        />
        {maxForce} N
      </div>
      <div>
        {title} stopping radius
        <input
          type="range"
          min="10"
          max="400"
          value={stoppingRadius}
          onChange={(e) => {
            setStoppingRadius(parseInt(e.target.value, 10))
          }}
        />
        {stoppingRadius} m
      </div>
      <div>
        {title} effect radius
        <input
          type="range"
          min="10"
          max="400"
          value={effectRadius}
          onChange={(e) => {
            setEffectRadius(parseInt(e.target.value, 10))
          }}
        />
        {effectRadius} m
      </div>
    </div>
  )
}

export default AgentSettings
