import Vector2 from './Vector2'

const EDGE_REPULSION_FACTOR = 10

export interface ISteeredAgent {
  setTarget: (target: Vector2) => void
  update: () => void
  vel: Vector2
  pos: Vector2
  maxV: number
  maxF: number
  mass: number
  activeRadius: number
  colour: string
}

class Seeker implements ISteeredAgent {
  protected target: Vector2 | null = null
  protected targetAgent?: ISteeredAgent

  public activeRadius = 100

  /**
   * 0-1, the strength of active radius effects (0 is ignore)
   */
  public useActiveRadiusEffects = true

  constructor(
    protected position: Vector2,
    protected velocity: Vector2,
    public maxV: number,
    public maxF: number,
    public mass: number,
    public colour = 'rgb(200, 50, 50)',
    public applyPursuitFactor = true,
  ) {
    this.initialise()
  }

  public initialise(): void {
    // some other classes can use this to prevent overriding the constructor
  }

  public setTarget(target: Vector2): void {
    this.target = target
  }

  public setTargetAgent(target: ISteeredAgent): void {
    this.targetAgent = target
  }

  public update(): void {
    const rawSteer = this.getSteering()
    // TODO: at some point this can go NaN. need to check/prevent this
    this.applySteeringForce(rawSteer)
    this.position.add(this.velocity)
  }

  get pos(): Vector2 {
    return this.position
  }

  get vel(): Vector2 {
    return this.velocity
  }

  get targetPos(): Vector2 | null {
    return this.target
  }

  protected applySteeringForce(steering: Vector2): void {
    const steer = steering
      .clone()
      .truncate(this.maxF)
      .scale(1 / this.mass)

    this.velocity.add(steer).truncate(this.maxV)
  }

  protected getSteering(): Vector2 {
    return this.getDesiredVelocity().subtract(this.velocity)
  }

  protected getDesiredVelocity(): Vector2 {
    return (
      this.getVelocityForAgentIntercept() || this.getVelocityForStaticTarget()
    )
  }

  private getVelocityForAgentIntercept(): Vector2 | null {
    const targetPos = this.targetAgent?.pos
    if (!targetPos) return null

    const targetVel = this.applyPursuitFactor
      ? this.targetAgent?.vel.clone().scale(
          // predict based on distance to pursuer
          (1.5 * this.position.clone().subtract(targetPos).length()) /
            this.maxV,
        ) || new Vector2(0, 0)
      : new Vector2(0, 0)

    this.setTarget(targetPos.clone().add(targetVel))
    return this.getVelocityForStaticTarget()
  }

  protected getVelocityForStaticTarget(): Vector2 {
    if (!this.target) return new Vector2(0, 0)

    const delta = this.target.clone().subtract(this.position)
    const distance = delta.length()
    const scaleFactor =
      distance > this.activeRadius || !this.useActiveRadiusEffects
        ? this.maxV
        : this.maxV * (distance / this.activeRadius)

    return this.applyEdgeForcesToVector(delta).norm().scale(scaleFactor)
  }

  protected applyEdgeForcesToVector(vec: Vector2): Vector2 {
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
}

export default Seeker
