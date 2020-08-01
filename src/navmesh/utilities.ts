import { GridBuilder, GridBuilderResult } from './gridBuilder'

export const simpleGrid = [
  [0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1],
  [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
]

export const buildEmptyGrid = (width: number, height: number) =>
  Array(height)
    .fill(null)
    .map(() => Array(width).fill(0))

export const buildRandomGrid = (
  width: number,
  height: number,
  obstacleRate = 0.5,
): number[][] =>
  Array(height)
    .fill(null)
    .map(() =>
      Array(width)
        .fill(null)
        .map(() => (Math.random() < obstacleRate ? 1 : 0)),
    )

export const buildColourMap = (colours: number): Map<number, string> => {
  const cMap = new Map<number, string>([[-1, 'black']])

  for (let i = 1; i <= colours + 1; ++i) {
    cMap.set(i, `rgba(${Math.random() * 255}, 50, ${Math.random() * 255}, 0.3)`)
  }

  return cMap
}

/**
 * Measures a grid builder over 100 iterations
 * @param grid
 * @param builder
 */
export const quickGridBuilderBenchmark = (
  grid: number[][],
  builder: GridBuilder,
  iterations = 1000,
): GridBuilderResult => {
  const start = new Date().getTime()
  let builderResult: GridBuilderResult = {} as any

  for (let i = 0; i < iterations; ++i) {
    builderResult = builder(grid)
  }

  return {
    ...builderResult,
    elapsed: (new Date().getTime() - start) / iterations,
  }
}
