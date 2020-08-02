import * as React from 'react'
import Seeker from './lib/Seeker'

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
  agent: Seeker,
  displayRadius: boolean,
): void => {
  ctx.beginPath()

  // agent
  ctx.fillStyle = agent.colour
  ctx.ellipse(agent.pos.x, agent.pos.y, 5, 5, 0, 0, 360)
  ctx.fill()

  // velocity vector
  ctx.beginPath()
  ctx.strokeStyle = agent.colour
  ctx.lineWidth = 1
  ctx.moveTo(agent.pos.x, agent.pos.y)
  const lineTo = agent.pos.clone().add(agent.vel.clone().scale(15))
  ctx.lineTo(lineTo.x, lineTo.y)
  ctx.stroke()

  // active radius
  if (displayRadius) {
    ctx.beginPath()
    ctx.strokeStyle = agent.colour
    ctx.ellipse(
      agent.pos.x,
      agent.pos.y,
      agent.activeRadius,
      agent.activeRadius,
      0,
      0,
      360,
    )
    ctx.stroke()
  }
}

export const useAnimationFrame = (
  agents: (Seeker | undefined)[],
  width: number,
  height: number,
) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [displayRadius, setDisplayRadius] = React.useState(true)

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
        drawAgent(ctx, agent, displayRadius)
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
  }, [agents, displayRadius, width, height])

  return { canvasRef, displayRadius, setDisplayRadius }
}
