import * as React from 'react'

import { CELL_SIZE } from './constants'
import { Poly, PolyPoint } from './gridBuilder'
import { drawPolys, drawGrid, clearCanvas } from './canvasUtilities'

const Grid = ({
  grid,
  polys,
  path,
  onDraw,
  colourMap: cmap,
  width,
  height,
  showAgent,
}: {
  grid: number[][]
  polys?: Poly[]
  path?: PolyPoint[]
  onDraw?: (x: number, y: number, isObstacle?: boolean) => void
  keybase?: string
  colourMap?: Map<number, string>
  width: number
  height: number
  showAgent?: boolean
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
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    clearCanvas(ctx, width, height)

    if (grid) {
      drawGrid(ctx, grid, colourMap)
    }
    if (polys) {
      drawPolys(ctx, width, height, polys, colourMap, path)
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
