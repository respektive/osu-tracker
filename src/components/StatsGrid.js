import React, { useContext } from 'react'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { SettingsContext } from './SettingsContext';


export default function StatsGrid({stats}) {
  const [settings] = useContext(SettingsContext)

  const borderStyle = {
    border: "1px solid transparent",
    '&:hover': {
      border: `1px solid ${settings?.theme === "light" ? "grey" : "white"}`
    },
  }

  const fontColor = settings?.theme === "light" ? "grey" : "white"

  return (
    <Box sx={{ flexGrow: 1, padding: 1 }}>
      <Grid container spacing={1}>

        { stats && stats.length > 0 ? 
        stats.map(({name, value, gained}) => {
            return (
              <React.Fragment key={name}>
                <Grid item xs={3.6}>
                  <Typography sx={{ fontSize: "14px", fontWeight: 'bold', color: fontColor }}>{name}:</Typography>
                </Grid>
                <Grid item xs={4.2}>
                  <Paper elevation={0} sx={borderStyle}>
                    <Typography align="right" sx={{ fontSize: "14px", fontWeight: 'bold', color: fontColor, mr: "5px", pt: "3px" }}>{value}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4.2}>
                  <Paper elevation={0} sx={borderStyle}>
                    <Typography align="left" sx={{ fontSize: "14px", fontWeight: 'bold', ml: "5px", pt: "3px", color: gained.color }}>{gained.value ?? "⠀"}</Typography>
                  </Paper>
                </Grid>
              </React.Fragment>
            );
        }) : 
        <Box sx={{ width: '100%', padding: 2 }}>
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        </Box> }

      </Grid>
    </Box>
  );
}
