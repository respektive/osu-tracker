import React, { useContext, useState, useEffect } from "react";
import { SettingsContext } from "./SettingsContext";
import {
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { HslColorPicker } from "react-colorful";
import { useDebounce } from "use-debounce";
import "./color-picker.css";

export default function GeneralSettings({ refreshStats }) {
    const [settings, setSettings] = useContext(SettingsContext);
    const [user_id, setUserId] = useState(settings?.user_id ?? "");
    const [showColor, setShowColor] = useState(false);
    const [customColor, setCustomColor] = useState(settings?.custom_color ?? "333");
    const [debouncedColor] = useDebounce(customColor, 200);

    const setClientId = (event) => {
        setSettings({ ...settings, client_id: event.target.value });
    };

    const setClientSecret = (event) => {
        setSettings({ ...settings, client_secret: event.target.value });
    };

    const handleUserIdChange = (event) => {
        setUserId(event.target.value);
    };

    const handleTitlebarToggle = (event) => {
        setSettings({ ...settings, custom_titlebar: event.target.checked });
    };

    const updateUser = () => {
        setSettings({ ...settings, user_id: user_id });
        refreshStats(true);
        setTimeout(() => {
            refreshStats(true);
        }, 1000);
    };

    const getGamemodeValue = () => {
        if (settings.mania_variant > 0) {
            return `mania${settings.mania_variant}k`;
        }
        return settings.gamemode ?? "osu";
    };

    const setGamemode = (event) => {
        switch (event.target.value) {
            case "mania4k":
                setSettings({ ...settings, gamemode: "mania", mania_variant: 4 });
                break;
            case "mania7k":
                setSettings({ ...settings, gamemode: "mania", mania_variant: 7 });
                break;
            default:
                setSettings({ ...settings, gamemode: event.target.value, mania_variant: null });
                break;
        }
    };

    const setDelay = (event) => {
        setSettings({ ...settings, interval: event.target.value * 1000 });
    };

    const setTheme = (event) => {
        setSettings({ ...settings, theme: event.target.value });
    };

    const saveCustomColor = (event) => {
        setCustomColor(event);
    };

    useEffect(() => {
        setSettings({ ...settings, custom_color: debouncedColor });
        // eslint-disable-next-line
    }, [debouncedColor]);

    return (
        <>
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
                <Grid item xs={5.5}>
                    <TextField
                        label="Client ID"
                        variant="filled"
                        type="number"
                        margin="dense"
                        size="small"
                        value={settings?.client_id ?? ""}
                        onChange={setClientId}
                    />
                </Grid>
                <Grid item xs={5.5}>
                    <TextField
                        label="Client Secret"
                        variant="filled"
                        type="password"
                        margin="dense"
                        size="small"
                        value={settings?.client_secret ?? ""}
                        onChange={setClientSecret}
                    />
                </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
                <Grid item xs={5.5}>
                    <TextField
                        label="User ID"
                        variant="filled"
                        type="number"
                        margin="dense"
                        size="small"
                        value={user_id}
                        onChange={handleUserIdChange}
                    />
                </Grid>
                <Grid item xs={5.5}>
                    <Button size="large" sx={{ mt: 1 }} variant="contained" onClick={updateUser}>
                        Refresh User
                    </Button>
                </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
                <Grid item xs={5.5}>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel id="gamemode-label">Gamemode</InputLabel>
                        <Select
                            value={getGamemodeValue()}
                            labelId="gamemode-label"
                            id="gamemode-label"
                            margin="dense"
                            variant="filled"
                            size="small"
                            onChange={setGamemode}
                        >
                            <MenuItem value={""} disabled>
                                Select a gamemode
                            </MenuItem>
                            <MenuItem value={"osu"}>osu!</MenuItem>
                            <MenuItem value={"taiko"}>osu!taiko</MenuItem>
                            <MenuItem value={"fruits"}>osu!catch</MenuItem>
                            <MenuItem value={"mania"}>osu!mania</MenuItem>
                            <MenuItem value={"mania4k"}>osu!mania (4K)</MenuItem>
                            <MenuItem value={"mania7k"}>osu!mania (7K)</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={5.5}>
                    <Typography>Interval in seconds</Typography>
                    <Slider
                        sx={{ p: 0 }}
                        aria-label="Interval in seconds"
                        defaultValue={settings?.interval ? settings?.interval / 1000 : 30}
                        step={5}
                        marks
                        min={5}
                        max={120}
                        valueLabelDisplay="auto"
                        onChange={setDelay}
                    />
                </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
                <Grid item xs={5.5}>
                    <FormControl fullWidth sx={{ mt: 1.5 }}>
                        <InputLabel id="theme-label">Theme</InputLabel>
                        <Select
                            value={settings?.theme ?? "dark"}
                            labelId="theme-label"
                            id="theme-label"
                            margin="dense"
                            variant="filled"
                            size="small"
                            onChange={setTheme}
                        >
                            <MenuItem value={""} disabled>
                                Select a theme
                            </MenuItem>
                            <MenuItem value={"custom"}>Custom</MenuItem>
                            <MenuItem value={"dark"}>Dark</MenuItem>
                            <MenuItem value={"light"}>Light</MenuItem>
                            <MenuItem value={"discord"}>Discord</MenuItem>
                            <MenuItem value={"osuPink"}>osu! Pink</MenuItem>
                            <MenuItem value={"osuPurple"}>osu! Purple</MenuItem>
                            <MenuItem value={"osuBlue"}>osu! Blue</MenuItem>
                            <MenuItem value={"osuGreen"}>osu! Green</MenuItem>
                            <MenuItem value={"osuLime"}>osu! Lime</MenuItem>
                            <MenuItem value={"osuOrange"}>osu! Orange</MenuItem>
                            <MenuItem value={"osuRed"}>osu! Red</MenuItem>
                            <MenuItem value={"osuDarkOrange"}>osu! Dark Orange</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={5.5}>
                    <Button
                        disabled={!(settings?.theme === "custom")}
                        size="large"
                        sx={{ mt: 2 }}
                        variant="contained"
                        onClick={() => {
                            setShowColor(!showColor);
                        }}
                    >
                        Color Picker
                    </Button>
                </Grid>
            </Grid>
            {showColor ? (
                <Grid
                    className="color-picker"
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{ mt: 2, mb: 2 }}
                >
                    <HslColorPicker
                        style={!(settings?.theme === "custom") ? { display: "none" } : {}}
                        color={customColor}
                        onChange={saveCustomColor}
                    />
                </Grid>
            ) : (
                <></>
            )}

            <Grid container direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
                <Grid item xs={11} sx={{ mt: 1 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={settings?.custom_titlebar ?? true}
                                onChange={handleTitlebarToggle}
                                color="primary"
                            />
                        }
                        label="Use custom titlebar (requires restart)"
                    />
                </Grid>
            </Grid>
        </>
    );
}
