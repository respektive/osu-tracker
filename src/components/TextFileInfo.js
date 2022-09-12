import { useState, useEffect } from 'react'
import { Typography, Box, Grid, Button, Stack, Paper } from '@mui/material'

export default function TextFileInfo() {
    const [allStats, setAllStats] = useState([])

    const showTextFiles = () => {
        window.api.showTextFiles()
    }

    const getAllStats = async () => {
        const result = await window.api.getAllStats()
        console.log(result)
        setAllStats(result)
    }

    useEffect(() => {
        getAllStats()
    }, [])

  return (
    <Box textAlign="center" sx={{ width: '100%', p: 0, maxHeight: "66vh", overflow: "auto" }} >
        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ pb: 2}}>
            <Grid item>
                <Typography align="center" sx={{fontWeight: 'bold'}}>Placeholder values:</Typography>
            </Grid>

            <Grid item>
                <Button size="small" variant="contained" onClick={ showTextFiles }>
                    <Typography sx={{ mt: 0.5 }} variant="button">Open Folder</Typography>
                </Button>
            </Grid>
        </Grid>

        <Stack spacing={1}>
            {allStats.map( (stat) => (
                <Paper elevation={0} >
                    <Typography>{stat.name}: %{stat.id}%</Typography>
                    <Typography>{stat.name} Gained: %{stat.id}_gained%</Typography>
                </Paper>
            ))}
        </Stack>

    </Box>
  )
}
