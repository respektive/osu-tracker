import React from 'react'
import { Typography, Box, Button } from '@mui/material'

export default function Overlays() {

    const openLink = (url) => {
        window.api.openExternalLink(url)
    }

  return (
    <Box textAlign="center" sx={{ width: '100%', p: 0 }}>
        <Typography align="center" sx={{fontWeight: 'bold', mb: 1}}>Overlays for use in OBS:</Typography>

        <Button variant="contained" onClick={ () => { openLink("http://127.0.0.1:17882/") } }>
            <Typography sx={{ mt: 0.5 }} variant="button" >Show Overlays</Typography>
        </Button>

    </Box>
  )
}
