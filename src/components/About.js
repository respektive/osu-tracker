import React from 'react'
import { Typography, Box, Grid, Button, Stack } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function About() {

    const openLink = (url) => {
        window.api.openExternalLink(url)
    }

    const openLogs = () => {
        window.api.openLogs();
    }

    return (
        <Box textAlign="center" sx={{ width: '100%', p: 0 }}>
            <Typography align="center" sx={{fontWeight: 'bold', mb: 1}}>osu!tracker made by respektive</Typography>

            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={5.5}>
                    <Stack spacing={2}>
                    <Button startIcon={<GitHubIcon />} variant="contained" onClick={ () => { openLink("https://github.com/respektive/osu-tracker") } }>
                        <Typography sx={{ mt: 0.5 }} variant="button" >Source Code</Typography>
                    </Button>
                    <Button startIcon={<DescriptionIcon />} variant="contained" onClick={ openLogs }>
                        <Typography sx={{ mt: 0.5 }} variant="button" >Show Logs</Typography>
                    </Button>
                    </Stack>
                </Grid>
                <Grid item xs={5.5}>
                    <Stack spacing={2}>
                    <Button startIcon={<AccountCircleIcon />} variant="contained" onClick={ () => { openLink("https://osu.ppy.sh/users/1023489") } }>
                        <Typography sx={{ mt: 0.5 }} variant="button" >osu! profile</Typography>
                    </Button>
                    <Button startIcon={<TwitterIcon />}variant="contained" onClick={ () => { openLink("https://twitter.com/respektivee") } }>
                        <Typography sx={{ mt: 0.5 }} variant="button" >Twitter</Typography>
                    </Button>
                    </Stack>
                </Grid> 
            </Grid>

        </Box>
    )
}
