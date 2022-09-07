import React, { useContext, useState } from 'react'
import { SettingsContext } from './SettingsContext';
import { Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Slider } from '@mui/material';

export default function GeneralSettings({ refreshStats }) {
    const [settings, setSettings] = useContext(SettingsContext)
    const [user_id, setUserId] = useState(settings?.user_id ?? "")

    const setClientId = (event) => {
        setSettings({ ...settings, client_id: event.target.value });
    };

    const setClientSecret = (event) => {
        setSettings({ ...settings, client_secret: event.target.value });
    };

    const handleUserIdChange = (event) => {
        setUserId(event.target.value);
    };

    const updateUser = () => {
        setSettings({ ...settings, user_id: user_id });
        refreshStats(true)
        setTimeout(() => {
            refreshStats(true)
        }, 1000);
    };

    const setGamemode = (event) => {
        setSettings({ ...settings, gamemode: event.target.value });
    };

    const setDelay = (event) => {
        setSettings({ ...settings, interval: (event.target.value * 1000) });
    };

    const setTheme = (event) => {
        setSettings({ ...settings, theme: event.target.value });
    };


    return (
        <>
        <Grid container direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
            <Grid item xs={5.5}>
                <TextField label="Client ID" variant="filled" type="number" margin="dense" size="small"
                value={settings?.client_id ?? ""} onChange={setClientId}/>
            </Grid>
            <Grid item xs={5.5}>
                <TextField label="Client Secret" variant="filled" type="password" margin="dense" size="small"
                value={settings?.client_secret ?? ""} onChange={setClientSecret}/>
            </Grid> 
        </Grid>

        <Grid container direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
            <Grid item xs={5.5}>
                <TextField label="User ID" variant="filled" type="number" margin="dense" size="small" value={user_id} onChange={handleUserIdChange}/>
            </Grid>
            <Grid item xs={5.5}>
                <Button size="large" sx={{ mt: .5 }} variant="contained" onClick={updateUser}>Refresh User</Button>
            </Grid>
        </Grid>

        <Grid container direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
            <Grid item xs={5.5} >
                <FormControl fullWidth  sx={{ mt: 1 }}>
                <InputLabel id="gamemode-label">Gamemode</InputLabel>
                <Select value={settings?.gamemode ?? ""} labelId="gamemode-label" id="gamemode-label" margin="dense" variant="filled" size="small" onChange={setGamemode}>
                    <MenuItem value={""} disabled>Select a gamemode</MenuItem>
                    <MenuItem value={"osu"}>osu!</MenuItem>
                    <MenuItem value={"taiko"}>osu!taiko</MenuItem>
                    <MenuItem value={"fruits"}>osu!catch</MenuItem>
                    <MenuItem value={"mania"}>osu!mania</MenuItem>
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={5.5}>
                <Typography>Interval in seconds</Typography>
                <Slider aria-label="Interval in seconds" defaultValue={30} step={5} marks min={5} max={120} valueLabelDisplay="auto" onChange={setDelay}/>
            </Grid>
        </Grid>

        <Grid container direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
            <Grid item xs={5.5}>
                <FormControl fullWidth  sx={{ mt: 1 }}>
                <InputLabel id="theme-label">Theme</InputLabel>
                <Select value={settings?.theme ?? ""} labelId="theme-label" id="theme-label" margin="dense" variant="filled" size="small" onChange={setTheme}>
                    <MenuItem value={""} disabled>Select a theme</MenuItem>
                    <MenuItem value={"dark"}>Dark</MenuItem>
                    <MenuItem value={"light"}>Light</MenuItem>
                    <MenuItem value={"osuRed"}>osu! Redish</MenuItem>
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={5.5}>
                Something
            </Grid>
        </Grid>
    </>
    )
}
