import { CELL_SIZE } from './constants'
import { Poly, PolyPoint } from './gridBuilder'

export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  ctx.clearRect(0, 0, CELL_SIZE * width, CELL_SIZE * height)
}

export const drawPolys = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  polys: Poly[] | undefined,
  colourMap: Map<number, string>,
  path: PolyPoint[] | undefined,
) => {
  // draw polys if available
  if (polys) {
    for (const poly of polys) {
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = 'black'
      ctx.fillStyle = colourMap.get(poly.id) || '#eee'
      ctx.rect(
        poly.x * CELL_SIZE,
        poly.y * CELL_SIZE,
        poly.width * CELL_SIZE,
        poly.height * CELL_SIZE,
      )
      ctx.fill()
      ctx.stroke()
      ctx.closePath()
    }
  }

  if (path && path.length > 1) {
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'red'
    ctx.fillStyle = 'red'
    ctx.moveTo(path[0].x * CELL_SIZE, path[0].y * CELL_SIZE)

    for (let i = 1; i < path.length; ++i) {
      ctx.lineTo(path[i].x * CELL_SIZE, path[i].y * CELL_SIZE)
    }

    ctx.stroke()

    for (const pt of path) {
      ctx.beginPath()
      ctx.ellipse(pt.x * CELL_SIZE, pt.y * CELL_SIZE, 3, 3, 0, 0, 180)
      ctx.fill()
    }
  }
}

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  grid: number[][],
  colourMap: Map<number, string>,
) => {
  // otherwise just draw a bunch of grid squares
  for (let y = 0; y < grid.length; ++y) {
    for (let x = 0; x < grid[y].length; ++x) {
      ctx.beginPath()
      ctx.fillStyle = colourMap.get(grid[y][x]) || '#eee'
      ctx.rect(CELL_SIZE * x, CELL_SIZE * y, CELL_SIZE, CELL_SIZE)
      ctx.fill()
    }
  }
}

export const drawAgent = (ctx: CanvasRenderingContext2D, pos: PolyPoint) => {
  ctx.beginPath()
  ctx.ellipse(pos.x * CELL_SIZE, pos.y * CELL_SIZE, 5, 5, 0, 0, 360)
  ctx.fillStyle = 'blue'
  ctx.fill()

  ctx.beginPath()
  ctx.strokeStyle = '5px blue'
  ctx.moveTo(pos.x * CELL_SIZE, pos.y * CELL_SIZE)
  ctx.lineTo(pos.x * CELL_SIZE + 10, pos.y * CELL_SIZE)
  ctx.stroke()
}
