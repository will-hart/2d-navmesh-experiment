import Vector2 from './Vector2'

class Seeker {
  protected target: Vector2 | null = null

  constructor(
    protected position: Vector2,
    protected velocity: Vector2,
    public maxV: number,
    public maxF: number,
    public mass: number,
    public colour = 'rgb(200, 50, 50)',
  ) {}

  public setTarget = (target: Vector2): void => {
    this.target = target
  }

  public update = (): void => {
    const rawSteer = this.getSteering()
    this.applySteeringForce(rawSteer)
    this.position.add(this.velocity)
  }

  get pos(): Vector2 {
    return this.position
  }

  get vel(): Vector2 {
    return this.velocity
  }

  protected applySteeringForce = (steering: Vector2): void => {
    const steer = steering
      .clone()
      .truncate(this.maxF)
      .scale(1 / this.mass)

    this.velocity.add(steer).truncate(this.maxV)
  }

  protected getSteering = (): Vector2 =>
    this.getDesiredVelocity().subtract(this.velocity)

  protected getDesiredVelocity = (): Vector2 =>
    !this.target
      ? new Vector2(0, 0)
      : this.target.clone().subtract(this.position).norm().scale(this.maxV)
}

export default Seeker
