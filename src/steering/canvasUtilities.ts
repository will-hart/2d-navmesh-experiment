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
): void => {
  ctx.beginPath()

  ctx.fillStyle = 'red'
  ctx.ellipse(agent.pos.x, agent.pos.y, 5, 5, 0, 0, 360)
  ctx.fill()

  // TODO fix
  ctx.beginPath()
  ctx.strokeStyle = 'red'
  ctx.lineWidth = 4
  ctx.moveTo(agent.pos.x, agent.pos.y)
  const lineTo = agent.pos.clone().add(agent.vel.clone().scale(3.5))
  ctx.lineTo(lineTo.x, lineTo.y)
  ctx.stroke()
}

export const useAnimationFrame = (
  agent: Seeker,
  width: number,
  height: number,
) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    let animationFrame = 0

    const onFrame = () => {
      if (!canvasRef.current) return
      const ctx = canvasRef.current.getContext('2d')
      if (!ctx) return

      agent.update()
      clearCanvas(ctx, width, height)
      drawAgent(ctx, agent)

      loop()
    }

    const loop = () => {
      animationFrame = requestAnimationFrame(onFrame)
    }

    loop()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [agent, width, height])

  return { canvasRef }
}
