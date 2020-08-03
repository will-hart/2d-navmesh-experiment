import { PolyPoint } from '../../navmesh/gridBuilder'

class Vector2 implements PolyPoint {
  public constructor(public x: number, public y: number) {}

  clone(): Vector2 {
    return new Vector2(this.x, this.y)
  }

  add(other: Vector2): Vector2 {
    this.x += other.x
    this.y += other.y
    return this
  }

  subtract(other: Vector2): Vector2 {
    this.x -= other.x
    this.y -= other.y
    return this
  }

  length(): number {
    return Math.sqrt(this.lengthSqr())
  }

  lengthSqr(): number {
    return this.x * this.x + this.y * this.y
  }

  norm(): Vector2 {
    const length = this.length()
    this.x /= length
    this.y /= length
    return this
  }

  scale(scaleBy: number): Vector2 {
    this.x *= scaleBy
    this.y *= scaleBy
    return this
  }

  truncate(maxLength: number): Vector2 {
    const length = this.length()
    if (length <= maxLength) return this
    return this.norm().scale(maxLength)
  }
}

export default Vector2
