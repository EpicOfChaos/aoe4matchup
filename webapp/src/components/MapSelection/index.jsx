import React from 'react'
import { Autocomplete, Card, CardContent, TextField, Tooltip, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useTheme } from '@mui/material/styles'
import MapIcon from '@mui/icons-material/Map'
import propTypes from 'prop-types'
import aoeStrings from '../../services/aoeiv-net/aoeiv-strings.json'

const sortedMaps = aoeStrings.map_type.sort((a, b) => {
  if (a.string < b.string) {
    return -1
  }
  if (a.string > b.string) {
    return 1
  }
  return 0
})

export default function MapSelection({ selectFunction }) {
  const theme = useTheme()

  return (
    <Card
      sx={{
        width: '280px',
        marginBottom: theme.spacing(2),
        marginRight: theme.spacing(2),
      }}
      elevation={4}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 20, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
          color="text.primary"
          gutterBottom
        >
          <MapIcon fontSize="large" color="primary" />
          Select Map
          <Tooltip title="Select a map to compare map specific statistics." placement="top" arrow>
            <InfoOutlinedIcon color="secondary" fontSize="small" />
          </Tooltip>
        </Typography>
        <Autocomplete
          getOptionLabel={option => option.string}
          options={sortedMaps}
          onChange={(event, newValue) => {
            let newMapId = null
            if (newValue && newValue.id != null) {
              newMapId = newValue.id
            }
            selectFunction(newMapId)
          }}
          renderInput={params => (
            <TextField
              {...params}
              fullWidth
              placeholder="select map"
              sx={{
                color: 'inherit',
                width: '250px',
                '& .MuiOutlinedInput-root': {
                  color: 'inherit',
                  padding: theme.spacing(1, 1, 1, 0),
                },
              }}
            />
          )}
        />
      </CardContent>
    </Card>
  )
}

MapSelection.propTypes = {
  selectFunction: propTypes.func.isRequired,
}
