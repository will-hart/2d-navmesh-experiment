import * as React from 'react'
import './styles.css'
import PolyGrid from './PolyGrid'
import {
  buildRandomGrid,
  buildColourMap,
  quickGridBuilderBenchmark,
  buildEmptyGrid,
} from './utilities'
import gridBuilder, { GridBuilderResult, PolyPoint } from './gridBuilder'
import Grid from './Grid'
import gridBuilder3 from './gridBuilder3'
import { getNavMesh as navMeshBuilder } from './NavMeshBuilder'
// import { getNavMesh2 as navMeshBuilder } from './NavMeshBuilder'

import { GRID_SIZE, OBSTACLE_RATE } from './constants'

export default function App() {
  const [grid, setGrid] = React.useState<number[][]>(
    buildRandomGrid(GRID_SIZE, GRID_SIZE, OBSTACLE_RATE),
  )

  const [cMap, setCMap] = React.useState<Map<number, string>>(
    buildColourMap(10),
  )
  const [builder1, setBuilder1] = React.useState<GridBuilderResult>()
  const [builder2, setBuilder2] = React.useState<GridBuilderResult>()

  const [path, setPath] = React.useState<PolyPoint[]>([])
  const [pathElapsed, setPathElapsed] = React.useState(0)
  const [meshElapsed, setMeshElapsed] = React.useState(0)

  const [obstacleDensity, setObstacleDensity] = React.useState(
    OBSTACLE_RATE * 100,
  )
  const [gridSize, setGridSize] = React.useState(GRID_SIZE)

  const buildGrids = React.useCallback(() => {
    setBuilder1(quickGridBuilderBenchmark(grid, gridBuilder, 100))
    setBuilder2(quickGridBuilderBenchmark(grid, gridBuilder3, 100))
  }, [setBuilder1, grid])

  const toggleObstacle = (x: number, y: number, forceToObstacle?: boolean) => {
    const nextGrid = [...grid]
    nextGrid[y][x] =
      forceToObstacle === undefined
        ? grid[y][x] === 1
          ? 0
          : 1
        : forceToObstacle
        ? 1
        : 0
    setGrid(nextGrid)
  }

  React.useEffect(() => {
    const cm = buildColourMap(
      Math.max(builder1?.numPolys || 5, builder2?.numPolys || 5),
    )
    setCMap(cm)
  }, [builder1, builder2, setCMap])

  React.useEffect(() => {
    buildGrids()
  }, [buildGrids])

  React.useEffect(() => {
    if (!builder1?.polys) return

    const iterations = 100
    const { path, meshingElapsed, pathingElapsed } = navMeshBuilder(
      builder1?.polys,
      { x: 1, y: 1 },
      { x: gridSize - 2, y: gridSize - 2 },
      iterations,
    )

    setPathElapsed(pathingElapsed)
    setMeshElapsed(meshingElapsed)
    setPath(path)
  }, [builder1, gridSize, setPath, setPathElapsed])

  React.useEffect(() => {
    setGrid(buildRandomGrid(gridSize, gridSize, obstacleDensity / 100))
  }, [obstacleDensity, gridSize, setGrid])

  return (
    <div className="App">
      <h1>2D Grid to Navmesh Experiment</h1>
      <p>
        <a href="https://github.com/will-hart/2d-navmesh-experiment">
          https://github.com/will-hart/2d-navmesh-experiment
        </a>
      </p>
      <div className="button-wrapper">
        <button onClick={() => setGrid(buildEmptyGrid(gridSize, gridSize))}>
          Clear grid
        </button>
        <button
          onClick={() =>
            setGrid(buildRandomGrid(gridSize, gridSize, obstacleDensity / 100))
          }
        >
          Randomise grid
        </button>
      </div>
      <div>
        Obstacle Density
        <input
          type="range"
          min="10"
          max="100"
          value={obstacleDensity}
          onChange={(e) => {
            setObstacleDensity(parseInt(e.target.value, 10))
          }}
        />
        {obstacleDensity}%
      </div>
      <div>
        Grid Size
        <input
          type="range"
          min="10"
          max="50"
          value={gridSize}
          onChange={(e) => {
            setGridSize(parseInt(e.target.value, 10))
          }}
        />
        {gridSize}x{gridSize}
      </div>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', marginTop: '1em' }}
        >
          <Grid
            grid={grid}
            path={path}
            keybase="sketcher"
            onDraw={toggleObstacle}
            width={gridSize}
            height={gridSize}
          />

          <div>
            <h3>Grid (click to toggle obstacles)</h3>
          </div>
        </div>
        {/* <PolyGrid builderResult={builder2} colourMap={cMap} algoName="Builder 3" /> */}
        <PolyGrid
          builderResult={builder1}
          colourMap={cMap}
          path={path}
          meshElapsed={(builder1?.elapsed || 0) + meshElapsed}
          pathElapsed={pathElapsed}
          algoName="Builder 1"
          width={gridSize}
          height={gridSize}
        />
      </div>
    </div>
  )
}
