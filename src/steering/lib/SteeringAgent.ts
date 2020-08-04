import Vector2 from './Vector2'
import { ISteeringBehaviour } from './SteeringBehaviour'

export interface ISteeringData {
  position: Vector2
  velocity?: Vector2
}

export interface ISteeringParameters {
  maxF: number
  maxV: number
  mass: number
  stoppingRadius: number
  effectRadius: number
}

export default class SteeringAgent
  implements ISteeringData, ISteeringParameters {
  maxF: number = 15
  maxV: number = 2
  mass: number = 10
  stoppingRadius: number = 10
  effectRadius: number = 100
  velocity: Vector2 = new Vector2(0, 0)
  debugColor: string = 'red'

  targetAgent: SteeringAgent | null = null
  target: ISteeringData | null = null

  constructor(
    public position: Vector2,
    public behaviours: ISteeringBehaviour[],
  ) {
    this.target = { position }
  }

  public update() {
    const force = this.behaviours.reduce(
      (steer: Vector2, behaviour: ISteeringBehaviour): Vector2 => {
        return steer.add(
          behaviour.getNormalisedForce(this, this.targetAgent || this.target),
        )
      },
      new Vector2(0, 0),
    )

    // switch target and targetAgent priority here as behaviours may set target
    this.applySteeringForce(
      force,
      ((this.target || this.targetAgent)?.position || this.position)
        .clone()
        .subtract(this.position)
        .length(),
    )
  }

  /** Applies the given steering force to the agent */
  protected applySteeringForce(
    steering: Vector2,
    distanceToTarget?: number,
  ): void {
    const steer = steering
      .clone()
      .truncate(this.maxF)
      .scale(1 / this.mass) // a = F/m

    this.velocity = (this.velocity || new Vector2(0, 0))
      .add(steer) // v2 = v1 + a
      .truncate(this.maxV)
      .scale(
        distanceToTarget
          ? this.getStoppingRadiusMultiplier(this, distanceToTarget)
          : 1,
      )

    this.position = this.position.add(this.velocity) // x2 = x1 + v
  }

  /**
   * Scales the vector by the proportion of the stopping distance represented
   * by the legnth. The effect of this is to apply smaller forces as the agent
   * nears the target
   * @param agent
   * @param distanceToTarget
   */
  private getStoppingRadiusMultiplier(
    agent: SteeringAgent,
    distanceToTarget: number,
  ): number {
    if (distanceToTarget > agent.stoppingRadius) return 1
    return distanceToTarget / agent.stoppingRadius
  }
}
