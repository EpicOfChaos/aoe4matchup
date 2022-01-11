import countBy from 'lodash/countBy'

export function civSelectionRate(grouped) {
  const groupedSelectionCounts = {}
  const groupedSelectionTotals = {}
  for (const [map, matches] of Object.entries(grouped)) {
    groupedSelectionCounts[map] = countBy(matches, match => {
      return match.civId
    })

    groupedSelectionTotals[map] = matches.length
  }

  const groupedSelectionRate = {}
  for (const [map, civs] of Object.entries(groupedSelectionCounts)) {
    const groupCivSelectionRates = {}
    for (const [civ, count] of Object.entries(civs)) {
      groupCivSelectionRates[civ] = count / groupedSelectionTotals[map]
    }
    groupedSelectionRate[map] = groupCivSelectionRates
  }

  return groupedSelectionRate
}
