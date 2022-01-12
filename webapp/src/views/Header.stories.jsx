import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { rest } from 'msw'
import Header from './Header'

export default {
  title: 'Header',
  component: Header,
}

const Template = args => <Header {...args} />
export const Basic = Template.bind({})

export const WithResults = Template.bind({})
WithResults.parameters = {
  msw: {
    handlers: [
      rest.get('https://aoeiv.net/api/leaderboard', (req, res, ctx) =>
        res(
          ctx.json({
            total: 48999,
            leaderboard_id: 17,
            start: 1,
            count: 3,
            leaderboard: [
              {
                profile_id: 1095455,
                rank: 4950,
                rating: 1229,
                steam_id: '76561197968176584',
                icon: null,
                name: 'Tepico',
                clan: null,
                country: 'DE',
                previous_rating: 1211,
                highest_rating: 1274,
                streak: 2,
                lowest_streak: -5,
                highest_streak: 4,
                games: 95,
                wins: 51,
                losses: 44,
                drops: 0,
                last_match_time: 1639496892,
              },
              {
                profile_id: 740451,
                rank: 7208,
                rating: 1182,
                steam_id: '76561197979396787',
                icon: null,
                name: 'EpicOfChaos',
                clan: null,
                country: 'US',
                previous_rating: 1198,
                highest_rating: 1255,
                streak: -2,
                lowest_streak: -6,
                highest_streak: 7,
                games: 272,
                wins: 143,
                losses: 129,
                drops: 10,
                last_match_time: 1641798678,
              },
              {
                profile_id: 8950180,
                rank: 47157,
                rating: 719,
                steam_id: '76561197977644143',
                icon: null,
                name: '.::Il PoRCePiCO!!!::.',
                clan: null,
                country: null,
                previous_rating: 738,
                highest_rating: 767,
                streak: -2,
                lowest_streak: -2,
                highest_streak: 2,
                games: 19,
                wins: 6,
                losses: 13,
                drops: 3,
                last_match_time: 1641817173,
              },
            ],
          }),
        ),
      ),
    ],
  },
}
