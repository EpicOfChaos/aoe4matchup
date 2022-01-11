import React from 'react'
import PlayerStatCompare from './index'

export default {
  title: 'Player Stat Compare',
  component: PlayerStatCompare,
}
const Template = args => <PlayerStatCompare {...args} />
export const NoMap = Template.bind({})
NoMap.args = {
  playersStats: {
    740451: {
      winRate: 0.5368421052631579,
      mostRecentPlayedCiv: 4,
      civWinRates: {
        1: 0.3333333333333333,
        3: 0.6428571428571429,
        4: 0.5441176470588235,
        5: 0.4444444444444444,
        7: 0,
      },
      mostPlayedCiv: '4',
    },
    8376673: {
      winRate: 0.6349206349206349,
      mostRecentPlayedCiv: 7,
      civWinRates: {
        1: 0.4166666666666667,
        3: 0.7142857142857143,
        4: 0.5,
        7: 0.6857142857142857,
      },
      mostPlayedCiv: '7',
    },
  },
}

export const WithMap = Template.bind({})
WithMap.args = {
  playersStats: {
    740451: {
      winRate: 0.5368421052631579,
      mostRecentPlayedCiv: 4,
      civWinRates: {
        1: 0.3333333333333333,
        3: 0.6428571428571429,
        4: 0.5441176470588235,
        5: 0.4444444444444444,
        7: 0,
      },
      mostPlayedCiv: '4',
      mapStats: {
        mapWinRate: 0.3333333333333333,
        mapHighestWinRateCiv: '4',
        mapHighestWinRateCivWinRate: 0.8333333333333334,
      },
    },
    8376673: {
      winRate: 0.6349206349206349,
      mostRecentPlayedCiv: 7,
      civWinRates: {
        1: 0.4166666666666667,
        3: 0.7142857142857143,
        4: 0.5,
        7: 0.6857142857142857,
      },
      mostPlayedCiv: '7',
      mapStats: {
        mapWinRate: 1,
        mapHighestWinRateCiv: '3',
        mapHighestWinRateCivWinRate: 1,
      },
    },
  },
  mapId: '7',
}
