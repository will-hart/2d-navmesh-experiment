import NavMesh from 'navmesh'
// import { NavMesh as NavMesh2 } from 'nav2d'

import { Poly, PolyPoint } from './gridBuilder'

const polyMapper = (poly: Poly): PolyPoint[] => [
  { x: poly.x, y: poly.y },
  { x: poly.x + poly.width, y: poly.y },
  { x: poly.x + poly.width, y: poly.y + poly.height },
  { x: poly.x, y: poly.y + poly.height },
]

export const getNavMesh = (
  polys: Poly[],
  from: PolyPoint,
  to: PolyPoint,
  iterations: number,
): { path: PolyPoint[]; meshingElapsed: number; pathingElapsed: number } => {
  let start = new Date().getTime()
  let navMesh: any = null
  let path: PolyPoint[] = []

  for (let i = 0; i < iterations; ++i) {
    const mesh = polys.map(polyMapper)
    navMesh = new NavMesh(mesh)
  }

  const meshingElapsed = new Date().getTime() - start
  start = new Date().getTime()

  for (let i = 0; i < iterations; ++i) {
    path = navMesh.findPath(from, to)
  }
  const pathingElapsed = new Date().getTime() - start

  return {
    path,
    meshingElapsed: meshingElapsed / iterations,
    pathingElapsed: pathingElapsed / iterations,
  }
}

// const polyMapper2 = (poly: Poly): PolyArrayPoint[] => [
//   [poly.x, poly.y],
//   [poly.x + poly.width, poly.y],
//   [poly.x + poly.width, poly.y + poly.height],
//   [poly.x, poly.y + poly.height],
// ]

// export const getNavMesh2 = (
//   polys: Poly[],
//   from: PolyPoint,
//   to: PolyPoint,
// ): PolyPoint[] => {
//   const mesh = polys.map(polyMapper2)
//   const navMesh = new NavMesh2(mesh)
//   return navMesh.findPath([from.x, from.y], [to.x, to.y])
// }
