import Vector2 from './Vector2'

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

  public activeRadius = 100

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

  protected getDesiredVelocity = (): Vector2 => {
    if (!this.target) return new Vector2(0, 0)

    const delta = this.target.clone().subtract(this.position)
    const distance = delta.length()

    const scaleFactor =
      distance > this.activeRadius
        ? this.maxV
        : this.maxV * (distance / this.activeRadius)

    return delta.norm().scale(scaleFactor)
  }
}

export default Seeker
