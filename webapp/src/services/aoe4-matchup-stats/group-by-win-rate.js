import { winRate } from './win-rate'

export function groupByWinRate(grouped) {
  const groupedWinRate = {}
  for (const [key, value] of Object.entries(grouped)) {
    groupedWinRate[key] = winRate(value)
  }

  return groupedWinRate
}
