import Vector2 from './Vector2'
import Seeker from './Seeker'

class Fleer extends Seeker {
  protected target: Vector2 | null = null

  protected getDesiredVelocity = (): Vector2 =>
    !this.target
      ? new Vector2(0, 0)
      : this.position.clone().subtract(this.target).norm().scale(this.maxV)
}

export default Fleer
