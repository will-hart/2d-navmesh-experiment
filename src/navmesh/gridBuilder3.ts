import { GridBuilder, Poly } from './gridBuilder'

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Extracts a list of "barrier" lines that run along the corners of obstacles
 *
 * @param grid
 */
const getCornerObstacles = (grid: number[][]): { x: number[]; y: number[] } => {
  const xLines = new Set<number>([0, grid[0].length])
  const yLines = new Set<number>([0, grid.length])

  // can check every second one here as we look at both sides of the obstacle
  for (let y = 1; y < grid.length - 1; ++y) {
    for (let x = 1; x < grid[y].length - 1; ++x) {
      const thisCell = grid[y][x]

      if (grid[y][x - 1] !== thisCell) xLines.add(x) // left
      if (grid[y][x + 1] !== thisCell) xLines.add(x + 1) // right
      if (grid[y - 1][x] !== thisCell) yLines.add(y) // top
      if (grid[y + 1][x] !== thisCell) yLines.add(y + 1) // bottom
    }
  }

  return {
    x: Array.from(xLines).sort((a, b) => a - b),
    y: Array.from(yLines).sort((a, b) => a - b),
  }
}

/**
 * Algorithm:
 *
 *  1. find all the "naked" corners (where there are no obstacles to side, top or diagonal)
 *  2. store the x and y coordinates (consider as horizontal / vertical barrier lines across the map)
 *  3. start at the first empty cell. Flood fill until x/y barrier lines are reached
 *  4. each flood filled area should be rectangular and a singe polygon
 * @param grid
 */
const gridBuilder3: GridBuilder = (grid: number[][]) => {
  const start = new Date().getTime()

  const polyGrid: number[][] = grid.map((row) =>
    row.map((cell) => (cell === 0 ? 0 : -1)),
  )

  const markPoly = (poly: Poly): void => {
    for (let x = poly.x; x < poly.x + poly.width; ++x) {
      for (let y = poly.y; y < poly.y + poly.height; ++y) {
        polyGrid[y][x] = poly.id
      }
    }
  }

  const polys: Poly[] = []

  let polyIdx = 2

  const { x: xBarriers, y: yBarriers } = getCornerObstacles(grid)

  for (let x = 0; x < xBarriers.length; x++) {
    for (let y = 0; y < yBarriers.length; y++) {
      const xBarr = xBarriers[x]
      const yBarr = yBarriers[y]

      // ignore the last items as they are edges
      if (
        yBarr >= grid.length ||
        xBarr >= grid[grid.length - 1].length ||
        grid[yBarr][xBarr] === 1
      )
        continue // skip obstacles

      const poly = {
        id: polyIdx,
        x: xBarr,
        y: yBarr,
        width: xBarriers[x + 1] - xBarr,
        height: yBarriers[y + 1] - yBarr,
      }

      markPoly(poly)
      polys.push(poly)

      polyIdx++
    }
  }

  const elapsed = new Date().getTime() - start
  // console.log(
  //   `Built grid using Builder 2 in ${elapsed}ms, creating ${polyIdx} polys`,
  // )
  return { polys, polyGrid, numPolys: polyIdx - 2, elapsed }
}

export default gridBuilder3
