import Vector2 from './Vector2'
import Seeker from './Seeker'

class Wanderer extends Seeker {
  private currentWanderAngle: number = 0
  private wanderAngleDelta: number = 0.5

  public initialise(): void {
    this.activeRadius = 15
    this.useActiveRadiusEffects = false
  }
  protected getDesiredVelocity = (): Vector2 => {
    // determine the new wander angle
    this.currentWanderAngle +=
      Math.random() * this.wanderAngleDelta - 0.5 * this.wanderAngleDelta

    // get a vec from the wander angle
    // TODO: random movement is often applied at an offset
    //       based on the current velocity. here its just done
    //       on the "active" circle
    const wanderVec = new Vector2(
      Math.cos(this.currentWanderAngle),
      Math.sin(this.currentWanderAngle),
    )

    this.setTarget(wanderVec.add(this.position))
    return super.getDesiredVelocity()
  }
}

export default Wanderer
