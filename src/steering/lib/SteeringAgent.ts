import Vector2 from './Vector2'
import { ISteerParameters } from './SteeringParameters'
import { ISteeringBehaviour } from './SteeringBehaviours'

const EDGE_REPULSION_FACTOR = 10

export interface ISteeredAgent extends ISteerParameters, ISteeringBehaviour {
  setTarget: (target: Vector2, velocity?: Vector2) => void
  setBehaviour(behaviour: ISteeringBehaviour): void
  update: (position: Vector2) => void
  vel: Vector2
  stoppingRadius: number | undefined
}

export default class SteeringAgent implements ISteeredAgent {
  protected target: Vector2 | null = null
  protected targetVelocity: Vector2 = new Vector2(0, 0)

  // parameters
  public maxV: number = 1
  public maxF: number = 2
  public mass: number = 50
  public debugColour: string = 'red'

  // behaviour
  public stoppingRadius: number | undefined = 100
  public activeRadius: number | undefined
  public reversed: boolean = false
  public predict: boolean = false

  constructor(
    protected position: Vector2,
    protected velocity: Vector2,
    parameters: ISteerParameters,
    behaviour: ISteeringBehaviour,
  ) {
    this.setParameters(parameters)
    this.setBehaviour(behaviour)
  }

  //#region Setters
  public setTarget(target: Vector2, velocity?: Vector2): void {
    this.target = target.clone()
    if (velocity) this.targetVelocity = velocity.clone()
  }

  public setBehaviour(behaviour: ISteeringBehaviour): void {
    this.stoppingRadius = behaviour.stoppingRadius
    this.activeRadius = behaviour.activeRadius
    this.reversed = behaviour.reversed
    this.predict = behaviour.predict
  }

  public setParameters(parameters: ISteerParameters): void {
    this.maxV = parameters.maxV
    this.maxF = parameters.maxF
    this.mass = parameters.mass
    this.debugColour = parameters.debugColour
  }
  //#endregion

  public update(): void {
    const steer = this.getDeltaToTarget()
    const distance = steer.length()

    if (this.activeRadius && distance > this.activeRadius) {
      return
    }

    this.applyEdgeForces(steer)
    this.applyStoppingForces(steer.norm(), distance)

    const vel = this.velocity
    steer
      .subtract(vel)
      .truncate(this.maxF)
      .scale(1 / this.mass)

    this.velocity = vel.add(steer).truncate(this.maxV)

    this.position.add(this.velocity)
  }

  /**
   * Gets the target position, including prediction if any
   */
  protected getTargetPosition(): Vector2 | null {
    // no target
    if (!this.target) return null

    // don't predict target path
    if (!this.predict) return this.target.clone()

    // predict target path
    const targetVelocity = this.velocity
      .clone()
      .norm()
      .scale(
        // reduce the prediction size closer to the target
        (1.5 * this.position.clone().subtract(this.target).length()) /
          this.maxV,
      )
    return this.target.clone().add(targetVelocity)
  }

  /**
   * Gets the desired velocity vector towards the predicted target position,
   * reversed if required.
   *
   * The vector is NOT normalised.
   */
  protected getDeltaToTarget(): Vector2 {
    const targetPos = this.getTargetPosition()
    if (!targetPos) return new Vector2(0, 0)

    const delta =
      this.target?.clone().subtract(this.position) || new Vector2(0, 0)

    if (this.reversed) {
      delta.scale(-1)
    }

    return delta
  }

  protected applyStoppingForces(delta: Vector2, distance: number): Vector2 {
    if (!this.stoppingRadius || this.stoppingRadius === 0) return delta

    const scaleFactor =
      distance > this.stoppingRadius
        ? this.maxV
        : this.maxV * (distance / this.stoppingRadius)

    return delta.scale(scaleFactor)
  }

  protected applyEdgeForces(vec: Vector2): Vector2 {
    // don't wander off the 600x600 map
    if (this.position.x < 50) {
      vec.add(new Vector2(EDGE_REPULSION_FACTOR, 0))
    } else if (this.position.x > 550) {
      vec.add(new Vector2(-EDGE_REPULSION_FACTOR, 0))
    }

    if (this.position.y < 50) {
      vec.add(new Vector2(0, EDGE_REPULSION_FACTOR))
    } else if (this.position.y > 550) {
      vec.add(new Vector2(0, -EDGE_REPULSION_FACTOR))
    }

    return vec
  }

  //#region Properties
  get pos(): Vector2 {
    return this.position
  }

  get vel(): Vector2 {
    return this.velocity
  }

  get targetPos(): Vector2 | null {
    return this.target
  }
  //#endregion Properties
}
