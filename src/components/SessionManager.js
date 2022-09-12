import React, { useState, useEffect } from 'react'
import { Typography, Button, Paper, Stack, Box, Divider, IconButton, Grid, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import RestoreIcon from '@mui/icons-material/Restore'
import SaveAltIcon from '@mui/icons-material/SaveAlt'

const gamemodes = {
    osu: "osu!",
    taiko: "osu!taiko",
    fruits: "osu!catch",
    mania: "osu!mania"
}

function getDate(d) {
    if(!d) {
        return "no session"
    }
    let date = new Date(d)
    date.setSeconds(0,0)
    date = date.toISOString().replaceAll("T", " ").replaceAll(":00.000Z", "")
    return date
}

export default function SessionManager({ refreshStats, setGamemode }) {
    const [sessions, setSessions] = useState([])
    const [currentSession, setCurrentSession] = useState({})

    async function getCurrentSession() {
        const result = await window.api.getCurrentSession()
        setCurrentSession(result)
    }

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
        setGamemode(session.gamemode)
        const result = await window.api.loadSession(session)
        setCurrentSession(session)
        setSessions(result)
        refreshStats()
    }

    useEffect(() => {
        getCurrentSession()
        getSessions()
    }, [])

    return (
    <Box textAlign="center" sx={{ width: '100%', p: 1 }}>
        <Paper elevation={0} sx={{ p: 1 }}>

            <Typography align="center" sx={{fontWeight: 'bold'}}>Current Session</Typography>
            <Divider />
            <Paper sx={{ mt: 1, p: 0.5}}>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Grid item container direction="row" xs={9}>
                        <Tooltip title={gamemodes[currentSession?.gamemode ?? "osu"]}>
                            <img src={(currentSession?.gamemode ?? "osu") + ".svg"} height={24} width={24} alt=""/>
                        </Tooltip>
                        <Typography sx={{ pl: 1}}>Start Date: {getDate(currentSession?.date)}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Button size="small" variant="contained" onClick={saveSession} endIcon={<SaveAltIcon />}>Save</Button>
                    </Grid>
                </Grid>
            </Paper>

            <Typography align="center" sx={{fontWeight: 'bold', mt: 1 }}>Saved Sessions</Typography>
            <Divider />

        <Stack spacing={1}>
            {Array.from(sessions).sort(function(a, b) {
                const dateA = new Date(a.date)
                const dateB = new Date(b.date)

                if (dateA > dateB) return -1
                if (dateA < dateB) return 1
                return 0;
            }).map((session) => {
                return (
                <Paper sx={{ mt: 1, p: 0.5}} key={session.date}>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>

                    <Grid item container direction="row" xs={9}>
                        <Tooltip title={gamemodes[session?.gamemode ?? "osu"]}>
                            <img src={(session?.gamemode ?? "osu") + ".svg"} height={24} width={24} alt=""/>
                        </Tooltip>
                        <Typography sx={{ pl: 1}}>{getDate(session?.date)}</Typography>
                    </Grid>

                    <Grid item xs={3}>
                    <Tooltip title="Load">
                    <IconButton aria-label="load" size="small" onClick={() => {loadSession(session)}}>
                        <RestoreIcon />
                    </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                    <IconButton aria-label="delete" size="small" onClick={() => {deleteSession(session)}} >
                        <DeleteIcon color="error" />
                    </IconButton>
                    </Tooltip>
                    </Grid>
                </Grid>
                </Paper>
                )
            })}
        </Stack>    
        </Paper>
    </Box>
    )
}
