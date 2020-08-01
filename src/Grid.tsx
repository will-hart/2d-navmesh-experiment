import * as React from 'react'

import { CELL_SIZE, GRID_SIZE } from './constants'
import { Poly, PolyPoint } from './gridBuilder'

const Grid = ({
  grid,
  polys,
  path,
  onDraw,
  colourMap: cmap,
  width,
  height,
}: {
  grid: number[][]
  polys?: Poly[]
  path?: PolyPoint[]
  onDraw?: (x: number, y: number, isObstacle?: boolean) => void
  keybase?: string
  colourMap?: Map<number, string>
  width: number
  height: number
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [dragging, setDragging] = React.useState(false)
  const [lastPos, setLastPos] = React.useState({ x: -1, y: -1 })
  const [nextPos, setNextPos] = React.useState({ x: -1, y: -1 })
  const [isAddingObstacle, setIsAddingObstacle] = React.useState(true)

  const colourMap =
    cmap ||
    new Map<number, string>([
      [-1, 'rgba(50, 50, 50, 0.8'],
      [0, 'rgba(50, 150, 50, 0.3)'],
      [1, 'rgba(50, 50, 50, 0.8)'],
    ])

  const getClickedCell = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = Math.floor((e.clientX - rect.left) / CELL_SIZE)
      const y = Math.floor((e.clientY - rect.top) / CELL_SIZE)

      return { x, y }
    },
    [],
  )

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setDragging(true)
      const { x, y } = getClickedCell(e) || { x: 0, y: 0 }
      setIsAddingObstacle(grid[y][x] === 0)
    },
    [grid, getClickedCell, setDragging, setIsAddingObstacle],
  )

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!dragging) return

      const { x, y } = getClickedCell(e) || { x: 0, y: 0 }
      setNextPos({ x, y })
    },
    [dragging, getClickedCell, setNextPos],
  )

  React.useEffect(() => {
    if (!onDraw) {
      return
    }

    // this prevents spurious updates and should prevent endless loops
    if (nextPos.x === lastPos.x && nextPos.y === lastPos.y) {
      return
    }

    // draw on the grid item if we aren't setting an "unclicked" state
    if (nextPos.x !== -1 && nextPos.y !== -1) {
      onDraw(nextPos.x, nextPos.y, isAddingObstacle)
    }

    setLastPos(nextPos)
  }, [isAddingObstacle, setLastPos, lastPos, nextPos, onDraw])

  React.useEffect(() => {
    if (!canvasRef.current) {
      console.warn('No canvas to draw on')
      return
    }

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) {
      console.log('No drawing context')
      return
    }

    ctx.clearRect(0, 0, CELL_SIZE * width, CELL_SIZE * height)

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

    if (polys) return

    // otherwise just draw a bunch of grid squares
    for (let y = 0; y < grid.length; ++y) {
      for (let x = 0; x < grid[y].length; ++x) {
        ctx.beginPath()
        ctx.fillStyle = colourMap.get(grid[y][x]) || '#eee'
        ctx.rect(CELL_SIZE * x, CELL_SIZE * y, CELL_SIZE, CELL_SIZE)
        ctx.fill()
      }
    }
  }, [grid, colourMap, path, polys, width, height])

  return (
    <div className="grid">
      <canvas
        onMouseDown={onMouseDown}
        onMouseUp={() => {
          setDragging(false)
          setLastPos({ x: -1, y: -1 })
        }}
        onMouseMove={onMouseMove}
        style={{
          background: 'white',
          width: `${width * CELL_SIZE}px`,
          height: `${height * CELL_SIZE}px`,
        }}
        ref={canvasRef}
        width={CELL_SIZE * width}
        height={CELL_SIZE * height}
      />
    </div>
  )
}

export default Grid
