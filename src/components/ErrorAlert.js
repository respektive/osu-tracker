import React, { useState, useEffect } from 'react'
import { Stack, Alert, Collapse } from "@mui/material"

export default function ErrorAlert({errorOpen, setErrorOpen, errorText}) {
    
  return (
    <Stack>
        <Collapse in={errorOpen}>
            <Alert severity='error' onClose={() => {setErrorOpen(false)}}>{errorText}</Alert>
        </Collapse>
    </Stack>
  )
}
