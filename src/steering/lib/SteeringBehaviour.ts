import Vector2 from './Vector2'
import SteeringAgent, { ISteeringData } from './SteeringAgent'

export const EDGE_REPULSION_FACTOR = 10

export interface ISteeringBehaviour {
  getNormalisedForce(
    agent: SteeringAgent,
    target: ISteeringData | null,
  ): Vector2
}

/**
 * Steering behaviours are classes that provide some
 * steering forces to an object based on the local conditions.
 *
 * They include behaviours that seek/pursue, flee/evade, avoid
 * obstacles, randomly wander around, or avoid map edges.
 *
 * Classes that derive from SteeringBehaviour can be composed
 * together to provide an overall steering behaviour on a
 * SteeringAgent.
 *
 * In some cases SteeringBehaviours may retain state, (for instance in
 * the WanderBehaviour) so may not be suited to reuse between agents.
 */
export default abstract class SteeringBehavior implements ISteeringBehaviour {
  //#region ISteeringBehaviour implementation
  abstract getNormalisedForce(
    agent: SteeringAgent,
    target: ISteeringData,
  ): Vector2

  //#endregion

  //# region behaviour helpers

  /**
   * Predicts the location of the target in the future. The prediction
   * factor is based on the distance to the target and the maximum velocity
   * of the agent.
   *
   * @param agent
   * @param target
   */
  protected getPredictedTarget(
    agent: SteeringAgent,
    target: ISteeringData,
    predictionMultiplier: number,
  ): Vector2 {
    const predictionFactor =
      (predictionMultiplier *
        agent.position.clone().subtract(target.position).length()) /
      agent.maxV
    const velVector = (target.velocity?.clone() || new Vector2(0, 0)).scale(
      predictionFactor,
    )
    return target.position.clone().add(velVector)
  }

  /**
   * Finds a vector from the agent to the target
   *
   * @param agent
   * @param target
   * @param reversed
   */
  protected getDeltaToTarget(
    agent: SteeringAgent,
    target: Vector2,
    reversed = false,
  ): Vector2 {
    const delta = target.clone().subtract(agent.position)
    if (reversed) delta.scale(-1)

    return delta
  }

  //#endregion
}
