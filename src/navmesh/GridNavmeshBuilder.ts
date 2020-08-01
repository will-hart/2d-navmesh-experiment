import { PolyPoint } from './gridBuilder'

import ndarray from 'ndarray'
import createPlanner from 'l1-path-finder'

export interface GridSearchResult {
  path: PolyPoint[]
  meshElapsed: number
  pathElapsed: number
}

const gridToNdArray = (grid: number[][]) => {
  // 2d grid is y[x[]], flat turns it into [x1y1, x2y1, x1y2, x2y2, ...]
  return ndarray(grid.flat(), [grid.length, grid.length])
}

const arrayToPath = (raw: number[]): PolyPoint[] => {
  const result: PolyPoint[] = []
  for (let i = 0; i < raw.length - 1; i += 2) {
    result.push({ x: raw[i], y: raw[i + 1] })
  }

  return result
}

export const getL1PathFromGrid = (
  grid: number[][],
  from: PolyPoint,
  to: PolyPoint,
  iterations = 100,
): GridSearchResult => {
  let start = new Date().getTime()
  let planner: any
  let path: PolyPoint[] = []

  const ndGrid = gridToNdArray(grid)

  for (let i = 0; i < iterations; ++i) {
    planner = createPlanner(ndGrid)
  }

  const meshElapsed = (new Date().getTime() - start) / iterations
  start = new Date().getTime()

  for (let i = 0; i < iterations; ++i) {
    const rawPath: number[] = []
    planner.search(from.x, from.y, to.x, to.y, rawPath)
    path = arrayToPath(rawPath)
  }
  const pathElapsed = (new Date().getTime() - start) / iterations

  return { path, meshElapsed, pathElapsed }
}
