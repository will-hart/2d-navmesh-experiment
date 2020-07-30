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
        {builderResult.numPolys} polygons,
        {((builderResult.elapsed || 0) / 100).toFixed(2)} ms/iter mesh{' '}
        {pathElapsed && <span>{pathElapsed} ms/iter path</span>}
      </div>
    </div>
  )
}

export default PolyGrid
