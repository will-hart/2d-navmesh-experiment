import * as React from 'react'
import SteeringAgent from './lib/SteeringAgent'

export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = 'rgb(20, 20, 40)'
  ctx.rect(0, 0, width, height)
  ctx.fill()
}

export const drawAgent = (
  ctx: CanvasRenderingContext2D,
  agent: SteeringAgent,
  displayOptions: { showRadius: boolean; showTarget: boolean },
): void => {
  const { showRadius, showTarget } = displayOptions

  // agent
  ctx.beginPath()
  ctx.fillStyle = agent.debugColor
  ctx.ellipse(agent.position.x, agent.position.y, 2, 2, 0, 0, 360)
  ctx.fill()

  // velocity vector
  ctx.beginPath()
  ctx.strokeStyle = agent.debugColor
  ctx.lineWidth = 1
  ctx.moveTo(agent.position.x, agent.position.y)
  const lineTo = agent.position.clone().add(agent.velocity.clone().scale(15))
  ctx.lineTo(lineTo.x, lineTo.y)
  ctx.stroke()

  // active radius
  if (showRadius) {
    ctx.beginPath()
    ctx.lineWidth = 1
    ctx.strokeStyle = agent.debugColor
    ctx.ellipse(
      agent.position.x,
      agent.position.y,
      agent.stoppingRadius,
      agent.stoppingRadius,
      0,
      0,
      360,
    )
    ctx.stroke()

    if (agent.effectRadius) {
      ctx.beginPath()
      ctx.setLineDash([5, 3])
      ctx.lineWidth = 1
      ctx.strokeStyle = agent.debugColor
      ctx.ellipse(
        agent.position.x,
        agent.position.y,
        agent.effectRadius,
        agent.effectRadius,
        0,
        0,
        360,
      )
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  // draw target
  if (agent.target && showTarget) {
    ctx.beginPath()
    ctx.strokeStyle = agent.debugColor
    ctx.lineWidth = 2
    ctx.ellipse(
      agent.target.position.x,
      agent.target.position.y,
      5,
      5,
      0,
      0,
      360,
    )
    ctx.stroke()
  }
}

export const useAnimationFrame = (
  agents: (SteeringAgent | undefined)[],
  width: number,
  height: number,
) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [displayRadius, setDisplayRadius] = React.useState(true)
  const [displayTarget, setDisplayTarget] = React.useState(true)

  React.useEffect(() => {
    let animationFrame = 0

    const onFrame = () => {
      if (!canvasRef.current) return
      const ctx = canvasRef.current.getContext('2d')
      if (!ctx) return

      clearCanvas(ctx, width, height)

      for (const agent of agents) {
        if (!agent) continue
        agent.update()
        drawAgent(ctx, agent, {
          showRadius: displayRadius,
          showTarget: displayTarget,
        })
      }

      loop()
    }

    const loop = () => {
      animationFrame = requestAnimationFrame(onFrame)
    }

    loop()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [agents, displayRadius, displayTarget, width, height])

  return {
    canvasRef,
    displayRadius,
    displayTarget,
    setDisplayRadius,
    setDisplayTarget,
  }
}
