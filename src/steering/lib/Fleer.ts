import Vector2 from './Vector2'
import Seeker, { ISteeredAgent } from './Seeker'

class Fleer extends Seeker {
  private targetAgent?: ISteeredAgent

  public constructor(
    position: Vector2,
    velocity: Vector2,
    maxV: number,
    maxF: number,
    mass: number,
    colour?: string,
  ) {
    super(position, velocity, maxV, maxF, mass, colour)
    this.activeRadius = 300
  }

  public setTargetAgent = (target: ISteeredAgent): void => {
    this.targetAgent = target
  }

  protected target: Vector2 | null = null

  protected getDesiredVelocity = (): Vector2 => {
    if (!this.targetAgent) return new Vector2(0, 0)

    // calculate the vector and distance to the target agent
    const delta = this.position.clone().subtract(this.targetAgent.pos)
    const distance = delta.length()

    // only flee at a certain distance
    if (distance > this.activeRadius) return new Vector2(0, 0)

    // flee with speed proportional to how far away the targetAgent is
    const scaleFactor =
      this.maxV *
      Math.min(1, Math.max(0, (this.activeRadius - distance) / distance))
    return delta.norm().scale(scaleFactor)
  }
}

export default Fleer
