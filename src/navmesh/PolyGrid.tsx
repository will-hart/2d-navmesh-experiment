import * as React from 'react'
import Grid from './Grid'
import { GridBuilderResult, PolyPoint } from './gridBuilder'

const PolyGrid = ({
  builderResult,
  colourMap,
  path,
  meshElapsed,
  pathElapsed,
  algoName,
  width,
  height,
  showAgent,
}: {
  builderResult?: GridBuilderResult
  colourMap: Map<number, string>
  path?: PolyPoint[]
  meshElapsed?: number
  pathElapsed?: number
  algoName: string
  width: number
  height: number
  showAgent?: boolean
}) => {
  if (!builderResult) return <div>Loading...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1em' }}>
      <Grid
        grid={builderResult.polyGrid}
        polys={builderResult.polys}
        path={path}
        colourMap={colourMap}
        keybase={`poly_${algoName.replace(/\w/g, '')}`}
        width={width}
        height={height}
        showAgent={showAgent}
      />
      <div>
        <h3>{algoName}</h3>
        <p>{builderResult.numPolys} polygons</p>
        <p>{(meshElapsed || 0).toFixed(2)} ms/iter mesh</p>

        <p>
          {(pathElapsed || 0) > 0 && `${pathElapsed?.toFixed(2)} ms/iter path`}
          {!path && ', no path found'}
        </p>
      </div>
    </div>
  )
}

export default PolyGrid
