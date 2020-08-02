export interface ISteeringBehaviour {
  stoppingRadius?: number
  activeRadius?: number
  reversed: boolean
  predict: boolean
}

export const SEEK: ISteeringBehaviour = {
  reversed: false,
  predict: false,
  stoppingRadius: 100,
}

export const FLEE: ISteeringBehaviour = {
  predict: false,
  reversed: true,
  stoppingRadius: 0,
  activeRadius: 200,
}

export const PURUSE: ISteeringBehaviour = {
  ...SEEK,
  predict: true,
}

export const EVADE: ISteeringBehaviour = {
  ...PURUSE,
  reversed: true,
}

export const WANDER: ISteeringBehaviour = {
  ...SEEK,
  stoppingRadius: undefined,
}
