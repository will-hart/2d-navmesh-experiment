import Vector2 from './Vector2'
import Seeker from './Seeker'

class Fleer extends Seeker {
  public initialise(): void {
    this.activeRadius = 300
  }

  protected target: Vector2 | null = null

  protected getDesiredVelocity = (): Vector2 => {
    if (!this.targetAgent) {
      this.setTarget(this.position.clone())
      return new Vector2(0, 0)
    }

    // calculate the vector and distance to the target agent
    const deltaToTarget = this.position.clone().subtract(this.targetAgent.pos)
    const distance = deltaToTarget.length()

    if (distance > this.activeRadius) {
      this.setTarget(this.position.clone())
      return new Vector2(0, 0)
    }

    this.setTarget(deltaToTarget.norm().scale(this.mass).add(this.position))
    return super.getVelocityForStaticTarget()
  }
}

export default Fleer
