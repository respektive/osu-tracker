import React from 'react'
import { Stack, Alert, Collapse, Link, AlertTitle } from "@mui/material"

export default function ErrorAlert({updateAvail, setUpdateAvail}) {

    const openLink = () => {
        window.api.openExternalLink("https://github.com/respektive/osu-tracker/releases/latest")
    }
    
  return (
    <Stack>
        <Collapse in={updateAvail}>
            <Alert color="warning" severity='info' onClose={() => {setUpdateAvail(false)}}>
            <AlertTitle>New Update Available!</AlertTitle>
            <Link component="button" variant="body2" underline="hover" onClick={openLink}>Click here</Link> to open the GitHub page.
            </Alert>
        </Collapse>
    </Stack>
  )
}
