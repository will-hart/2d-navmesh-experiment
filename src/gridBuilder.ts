export type PolyArrayPoint = [number, number]

export interface PolyPoint {
  x: number
  y: number
}

export interface Poly extends PolyPoint {
  width: number
  height: number
  id: number
}

export interface GridBuilderResult {
  polys: Poly[]
  polyGrid: number[][]
  numPolys: number
  elapsed?: number
}

export type GridBuilder = (grid: number[][]) => GridBuilderResult

const gridBuilder: GridBuilder = (grid: number[][]) => {
  const start = new Date().getTime()

  const polyGrid: number[][] = grid.map((row) =>
    row.map((cell) => (cell === 0 ? 0 : -1)),
  )

  const polys: Poly[] = []

  let polyIdx = 2
  let x = 0
  let y = 0

  while (y < polyGrid.length) {
    // find a free cell
    if (polyGrid[y][x] !== 0) {
      x++

      if (x >= polyGrid[y].length) {
        // console.log('NEW LINE ', y)
        x = 0
        y++
      }

      continue
    }

    // mark the current cell as in this poly
    let xSize = 0
    let ySize = 1

    // console.log('Checking', x, y)

    // find all the cells in the x-direction that are walkable
    while (x + xSize < polyGrid[y].length && polyGrid[y][x + xSize] === 0) {
      polyGrid[y][x + xSize] = polyIdx
      xSize++
    }

    // console.log('row size', xSize, 'cells')

    // check if all of the next row can be added, and if yes, add it
    while (y + ySize < polyGrid.length) {
      let found = false
      for (let i = x; i < x + xSize; ++i) {
        if (polyGrid[y + ySize][i] !== 0) {
          // console.log('skipping nextrow, obstacle at @ (', i, y + ySize, ')')
          found = true
          break
        }
      }

      if (found) break

      // add this row, double loop :(
      for (let i = x; i < x + xSize; ++i) {
        polyGrid[y + ySize][i] = polyIdx
      }

      ySize++
      // console.log('Added row', y + ySize)
    }

    // console.log('POLY: ', x, y, xSize, ySize)
    polys.push({ x, y, width: xSize, height: ySize, id: polyIdx })

    // move to the next poly
    x += xSize
    if (x >= polyGrid[y].length) {
      x = 0
      y++
    }

    polyIdx++
  }

  const elapsed = new Date().getTime() - start
  // console.log(
  //   `Built grid using Builder 1 in ${elapsed}ms, creating ${polyIdx} polys`,
  // )
  return { polys, polyGrid, numPolys: polyIdx - 2, elapsed }
}

export default gridBuilder
