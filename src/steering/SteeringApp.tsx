import * as React from 'react'

export default function SteeringApp(props: { onBack: () => void }) {
  return (
    <div className="App">
      <h1>Steering Experiments</h1>

      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <button onClick={props.onBack}>&lt; back</button>
      </div>
    </div>
  )
}
