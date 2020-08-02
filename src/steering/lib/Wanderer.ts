import Vector2 from './Vector2'
import Seeker from './Seeker'

class Wanderer extends Seeker {
  private currentWanderAngle: number = 0
  private wanderAngleDelta: number = 0.5

  public initialise(): void {
    this.activeRadius = 15
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

    // don't wander off the 600x600 map
    if (this.position.x < 50) {
      wanderVec.add(new Vector2(1, 0))
    } else if (this.position.x > 550) {
      wanderVec.add(new Vector2(-1, 0))
    }

    if (this.position.y < 50) {
      wanderVec.add(new Vector2(0, 1))
    } else if (this.position.y > 550) {
      wanderVec.add(new Vector2(0, -1))
    }

    return wanderVec.norm()
  }
}

export default Wanderer
