import React, { useState, useEffect } from 'react'
import { Typography, Button, Paper, Stack, Box, Divider, IconButton, Grid, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import RestoreIcon from '@mui/icons-material/Restore'

function getDate(d) {
    if(!d) {
        return "no date"
    }
    let date = new Date(d).toISOString().replaceAll("T", " ");
    date = date.substring(0, date.indexOf('.'));
    return date;
}

export default function SessionManager({ refreshStats }) {
    const [sessions, setSessions] = useState([])

    async function getSessions() {
        const result = await window.api.getSessions()
        setSessions(result)
    }

    async function saveSession() {
        const result = await window.api.saveSession()
        setSessions(result)
    }

    async function deleteSession(session) {
        const result = await window.api.deleteSession(session)
        setSessions(result)
    }

    async function loadSession(session) {
        const result = await window.api.loadSession(session)
        setSessions(result)
        refreshStats()
    }

    useEffect(() => {
        getSessions()
    }, [])

    return (
    <Box textAlign="center" sx={{ width: '100%', p: 1 }}>
        <Paper elevation={0} sx={{ p: 1 }}>
            <Typography align="center" sx={{fontWeight: 'bold'}}>Sessions</Typography>
            <Divider />
        <Stack spacing={1}>
            {Array.from(sessions).map((session) => {
                return (
                <Paper sx={{ mt: 1, p: 0.5}} key={session.date}>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Grid item >
                    <Typography>Start Date: {getDate(session.date)}</Typography>
                    </Grid>
                    <Grid item >
                    <Tooltip title="Load">
                    <IconButton aria-label="load" onClick={() => {loadSession(session)}}>
                        <RestoreIcon />
                    </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={() => {deleteSession(session)}} >
                        <DeleteIcon />
                    </IconButton>
                    </Tooltip>
                    </Grid>
                </Grid>
                </Paper>
                )
            })}
        </Stack>    
        </Paper>
        <Button size="large" sx={{ mt: .5 }} variant="contained" onClick={saveSession}>Save current Session</Button>
    </Box>
    )
}
