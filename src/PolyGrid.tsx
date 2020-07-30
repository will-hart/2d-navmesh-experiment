import * as React from 'react'
import Grid from './Grid'
import { GridBuilderResult, PolyPoint } from './gridBuilder'

const PolyGrid = ({
  builderResult,
  colourMap,
  path,
  pathElapsed,
  algoName,
}: {
  builderResult?: GridBuilderResult
  colourMap: Map<number, string>
  path?: PolyPoint[]
  pathElapsed?: number
  algoName: string
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
      />
      <div>
        <h3>{algoName}</h3>
        <p>{builderResult.numPolys} polygons</p>
        <p>{((builderResult.elapsed || 0) / 100).toFixed(2)} ms/iter mesh</p>

        <p>
          {pathElapsed && `${pathElapsed} ms/iter path`}
          {!path && ', no path found'}
        </p>
      </div>
    </div>
  )
}

export default PolyGrid
