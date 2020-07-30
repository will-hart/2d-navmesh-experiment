import NavMesh from 'navmesh'
import { NavMesh as NavMesh2 } from 'nav2d'

import { Poly, PolyPoint, PolyArrayPoint } from './gridBuilder'

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
): PolyPoint[] => {
  const mesh = polys.map(polyMapper)
  const navMesh = new NavMesh(mesh)
  return navMesh.findPath(from, to)
}

const polyMapper2 = (poly: Poly): PolyArrayPoint[] => [
  [poly.x, poly.y],
  [poly.x + poly.width, poly.y],
  [poly.x + poly.width, poly.y + poly.height],
  [poly.x, poly.y + poly.height],
]

export const getNavMesh2 = (
  polys: Poly[],
  from: PolyPoint,
  to: PolyPoint,
): PolyPoint[] => {
  const mesh = polys.map(polyMapper2)
  const navMesh = new NavMesh2(mesh)
  return navMesh.findPath([from.x, from.y], [to.x, to.y])
}
