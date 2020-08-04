import SteeringAgent, { ISteeringData } from './SteeringAgent'
import SteeringBehavior from './SteeringBehaviour'
import Vector2 from './Vector2'

export class SeekBehaviour extends SteeringBehavior {
  getNormalisedForce(agent: SteeringAgent, target: ISteeringData): Vector2 {
    const delta = this.getDeltaToTarget(agent, target.position, false)
    return delta.norm()
  }
}

export class FleeBehaviour extends SeekBehaviour {
  getNormalisedForce(agent: SteeringAgent, target: ISteeringData): Vector2 {
    if (!agent.targetAgent) return new Vector2(0, 0)
    const delta = this.getDeltaToTarget(agent, target.position, true)
    if (agent.effectRadius && delta.length() > agent.effectRadius)
      return super.getNormalisedForce(agent, agent.target!)

    agent.target = {
      position: delta
        .norm()
        .scale(2 * agent.stoppingRadius)
        .add(agent.position),
    }
    return super.getNormalisedForce(agent, agent.target)
  }
}

export class PursueBehaviour extends SteeringBehavior {
  constructor(private predictionMultiplier: number) {
    super()
  }

  getNormalisedForce(agent: SteeringAgent, target: ISteeringData): Vector2 {
    const predictedPosition = this.getPredictedTarget(
      agent,
      target,
      this.predictionMultiplier,
    )

    agent.target = { position: predictedPosition }
    const delta = this.getDeltaToTarget(agent, predictedPosition, false)
    return delta.norm()
  }
}

export class EvadeBehaviour extends SeekBehaviour {
  getNormalisedForce(agent: SteeringAgent, target: ISteeringData): Vector2 {
    if (!agent.targetAgent) return new Vector2(0, 0)
    const delta = this.getDeltaToTarget(
      agent,
      this.getPredictedTarget(agent, target, 1),
      true,
    )
    if (agent.effectRadius && delta.length() > agent.effectRadius)
      return super.getNormalisedForce(
        agent,
        agent.target || { position: agent.position },
      )

    agent.target = {
      position: delta
        .norm()
        .scale(2 * agent.stoppingRadius)
        .add(agent.position),
    }
    return super.getNormalisedForce(agent, agent.target)
  }
}

export class WanderBehaviour extends SeekBehaviour {
  private currentWanderAngle: number

  constructor(private wanderAngleDelta: number) {
    super()
    this.currentWanderAngle = Math.random()
  }

  getNormalisedForce(agent: SteeringAgent, target: ISteeringData): Vector2 {
    // determine the new wander angle
    this.currentWanderAngle +=
      Math.random() * this.wanderAngleDelta - 0.5 * this.wanderAngleDelta

    // get a vec from the wander angle
    // TODO: random movement is often applied at an offset in the velocity direction
    const delta = new Vector2(
      Math.cos(this.currentWanderAngle),
      Math.sin(this.currentWanderAngle),
    )

    agent.target = {
      position: agent.position.clone().add(delta.scale(agent.stoppingRadius)),
    }

    return super.getNormalisedForce(agent, agent.target)
  }
}

export class AttractorBehaviour extends SteeringBehavior {
  private attractorPosition: Vector2

  constructor(
    x: number,
    y: number,
    private attractorRange: number,
    private attractorForce: number,
  ) {
    super()
    this.attractorPosition = new Vector2(x, y)
  }

  getNormalisedForce(agent: SteeringAgent, target: ISteeringData): Vector2 {
    const delta = this.getDeltaToTarget(agent, this.attractorPosition)
    const distance = delta.length()
    return delta
      .norm()
      .scale((this.attractorForce * distance) / this.attractorRange)
  }
}

export class AvoidBoundariesBehaviour extends SteeringBehavior {
  constructor(
    private width: number,
    private height: number,
    private avoidanceRange = 30,
    private avoidanceStrength = 10,
  ) {
    super()
  }

  public updateBoundaries(width: number, height: number) {
    this.width = width
    this.height = height
  }

  getNormalisedForce(agent: SteeringAgent, _target: ISteeringData): Vector2 {
    const force = new Vector2(0, 0)

    // blend in x-forces as the agent gets closer to the boundary
    if (agent.position.x < this.avoidanceRange) {
      force.addX(
        this.avoidanceStrength * (1 - agent.position.x / this.avoidanceRange),
      )
    } else if (agent.position.x > this.width - this.avoidanceRange) {
      force.addX(
        (-this.avoidanceStrength * (this.width - agent.position.x)) /
          this.avoidanceRange,
      )
    }

    // blend in y-forces as the agent gets closer to the boundary
    if (agent.position.y < this.avoidanceRange) {
      force.addY(
        this.avoidanceStrength * (1 - agent.position.y / this.avoidanceRange),
      )
    } else if (agent.position.y > this.height - this.avoidanceRange) {
      force.addY(
        (-this.avoidanceStrength * (this.height - agent.position.y)) /
          this.avoidanceRange,
      )
    }

    return force
  }
}
