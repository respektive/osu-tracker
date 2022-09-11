import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import React, { useContext } from 'react'
import { SettingsContext } from './SettingsContext';
import Tooltip from '@mui/material/Tooltip';

const hoverTheme = {
    cursor: "pointer",
    borderColor: "white"
}

function OsuAvatar({toggleSettings}) {
    const [settings] = useContext(SettingsContext)

    return (
        <Tooltip title="Settings">
        <IconButton onClick={toggleSettings} sx={{ p: 0, borderRadius: "50%", border: "2px solid transparent", "&:hover": hoverTheme }}>
            <Avatar alt="osu! Avatar" src={ settings?.user_id ? `https://a.ppy.sh/${settings?.user_id}` : "https://osu.ppy.sh/images/layout/avatar-guest.png" }/>
        </IconButton>
        </Tooltip>
    )
}
  
export default OsuAvatar;
  