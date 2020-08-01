import { GridBuilder, Poly } from './gridBuilder'

const gridBuilder2: GridBuilder = (grid: number[][]) => {
  const start = new Date().getTime()

  const polyGrid: number[][] = grid.map((row) =>
    row.map((cell) => (cell === 0 ? 0 : -1)),
  )

  const polys: Poly[] = []

  let polyIdx = 2
  let x = 0
  let y = 0

  //
  //

  /**
   * check if the given square can grow assuming the top left and bottom right corners
   * of the square are given
   *
   * @param topX
   * @param topY
   * @param bottomX
   * @param bottomY
   * @param checkBottom
   * @param checkRight
   *
   * @returns array containing boolean flags for  "can grow bottom", "can grow right", "can grow corner"
   */
  const canGrow = (
    topX: number,
    topY: number,
    bottomX: number,
    bottomY: number,
    checkBottom = true,
    checkRight = true,
  ): boolean[] => {
    const canExpand = [
      checkBottom && bottomY + 1 < polyGrid.length,
      checkRight && bottomX + 1 < polyGrid[polyGrid.length - 1].length,
      checkBottom &&
        checkRight &&
        bottomY + 1 < polyGrid.length &&
        bottomX + 1 < polyGrid[polyGrid.length - 1].length &&
        polyGrid[bottomY + 1][bottomX + 1] === 0,
    ]

    // check underneath
    if (canExpand[0]) {
      for (let xNew = topX; xNew <= bottomX; ++xNew) {
        if (polyGrid[bottomY + 1][xNew] !== 0) {
          canExpand[0] = false
          break
        }
      }
    }

    // check the right hand side
    if (canExpand[1]) {
      for (let yNew = topY; yNew <= bottomY; ++yNew) {
        if (polyGrid[yNew][bottomX + 1] !== 0) {
          canExpand[1] = false
          break
        }
      }
    }

    return canExpand
  }

  const getExtents = (
    x: number,
    y: number,
  ): { xSize: number; ySize: number } => {
    let xSize = 0
    let ySize = 0

    const growing = [true, true]

    while (true) {
      const newGrowth = canGrow(
        x,
        y,
        x + xSize,
        y + ySize,
        growing[0],
        growing[1],
      )
      growing[0] = growing[0] && newGrowth[0]
      growing[1] = growing[1] && newGrowth[1]

      if (!newGrowth.some((g) => !g)) {
        // we can grow in all directions, including the corner
        xSize++
        ySize++
      } else if (growing[1]) {
        // grow right
        xSize++
      } else if (growing[0]) {
        // prefer to grow down, just because
        ySize++
      } else {
        // stop growing
        break
      }
    }

    return { xSize: xSize + 1, ySize: ySize + 1 }
  }

  const markPoly = (poly: Poly): void => {
    for (let x = poly.x; x < poly.x + poly.width; ++x) {
      for (let y = poly.y; y < poly.y + poly.height; ++y) {
        polyGrid[y][x] = poly.id
      }
    }
  }

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

    // we are in a free cell, see how far it can grow
    const { xSize, ySize } = getExtents(x, y)
    const poly: Poly = { x, y, width: xSize, height: ySize, id: polyIdx }
    markPoly(poly)

    polys.push(poly)

    polyIdx++
  }

  const elapsed = new Date().getTime() - start
  // console.log(
  //   `Built grid using Builder 2 in ${elapsed}ms, creating ${polyIdx} polys`,
  // )
  return { polys, polyGrid, numPolys: polyIdx - 2, elapsed }
}

export default gridBuilder2
