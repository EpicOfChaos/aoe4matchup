import { avgDuration } from './avg-duration'

export function groupByAvgDuration(grouped) {
  const groupedAvgDuration = {}
  for (const [key, value] of Object.entries(grouped)) {
    groupedAvgDuration[key] = avgDuration(value)
  }

  return groupedAvgDuration
}
