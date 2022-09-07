import React, { useContext } from 'react'
import { SettingsContext } from './SettingsContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import OsuAvatar from './OsuAvatar';


export default function Header({toggleSettings, username}) {
  const [settings] = useContext(SettingsContext)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" sx={ settings?.theme === "osuRed" ? {bgcolor: "#3d2932", backgroundImage: "none"} : {} }>
        <Toolbar variant="dense" >
            <img src={(settings?.gamemode ?? "osu") + ".svg"} height={30} width={30} alt=""/>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', ml: 1 }}>
            {username}
          </Typography>
          <OsuAvatar toggleSettings={toggleSettings} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}