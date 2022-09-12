import { useState, useEffect } from 'react'
import { Typography, Box, Button, List, ListItem, Grid, Tooltip, IconButton, TextField, Paper, Modal } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import InfoIcon from '@mui/icons-material/Info'
import TextFileInfo from "./TextFileInfo"

const itemHoverStyle = {
  '&:hover': {
    boxShadow: "inset 0 0 100px 100px rgba(255, 255, 255, 0.05)",
  }
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "97%",
  borderRadius: "15px",
  bgcolor: 'background.default',
  boxShadow: 24,
  p: 1,
  pb: 2,
  pt: 2
};

export default function Overlays() {
    const [fileName, setFileName] = useState()
    const [selectedFile, setSelectedFile] = useState()
    const [files, setFiles] = useState([])
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleFileNameChange = (event) => {
      setFileName(event.target.value);
    }

    const addFile = () => {
      if (!fileName || fileName === "") return
      if (!files.some(file => file.file_name === fileName)) {
        const newFile = {
          file_name: fileName,
          content: ""
        }
        const newFiles = [...files, newFile]
        setFiles(newFiles)
        window.api.setFiles(newFiles)
      }
    }

    async function getFiles() {
      const result = await window.api.getFiles()
      setFiles(result)
    }

    const setSelectedFileIndex = (index) => {
        const file = files[index]
        file.index = index
        setSelectedFile(file)
    }

    const deleteFile = (index) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)
        window.api.setFiles(newFiles)
    }

    const saveFile = (event) => {
        if (selectedFile) {
          console.log(event.target.value)
          const file = {...selectedFile, content: event.target.value}
          setSelectedFile(file)
          const newFiles = [...files]
          newFiles[selectedFile.index] = file
          setFiles(newFiles)
          window.api.setFiles(newFiles)
        }
    }

    const openLink = (url) => {
        window.api.openExternalLink(url)
    }

    useEffect(() => {
      getFiles()
    }, [])

  return (
    <Box textAlign="center" sx={{ width: '100%', p: 0, pb: 1 }}>

        <Typography align="center" sx={{fontWeight: 'bold', mt: 1 }}>Text file output:</Typography>

        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ pb: 1 }}>
            <Grid item>
                <TextField size="small" variant="filled" label="File Name" onChange={handleFileNameChange}></TextField>
            </Grid>

            <Grid item>
                <Button size="small" variant="contained">
                <Typography sx={{ mt: 0.5 }} variant="button" onClick={addFile}>Add</Typography>
                </Button>
            </Grid>

        </Grid>

        <List dense 
              sx={{
                ml: "auto",
                mr: "auto",
                width: '90%',
                bgcolor: 'background.paper',
                overflow: 'auto',
                minHeight: 50,
                maxHeight: 200,
              }}
            >
              {files.map((file, index) => (
                  <ListItem key={file.file_name} disablePadding sx={itemHoverStyle}>
                      <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>

                          <Grid item xs={9}>
                              <Typography sx={{ pl: 1}}>{file.file_name}</Typography>
                          </Grid>

                          <Grid item xs={3}>
                          <Tooltip title="Edit">
                          <IconButton aria-label="load" size="small" onClick={() => {setSelectedFileIndex(index)}}>
                              <EditIcon />
                          </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                          <IconButton aria-label="delete" size="small" onClick={() => {deleteFile(index)}} >
                              <DeleteIcon color="error" />
                          </IconButton>
                          </Tooltip>
                          </Grid>

                      </Grid>
                  </ListItem>
              ))}
        </List>

        <TextField
          label="File Content"
          multiline
          rows={4}
          value={selectedFile?.content ?? ""}
          onChange={saveFile}
          variant="filled"
          sx={{
            ml: "auto",
            mr: "auto",
            width: '90%',
          }}
        />

        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ p: 2 }}>
        
            <Grid item>
              <Paper elevation={0} sx={{ p: 1}}>
                <Typography>Editing: {selectedFile?.file_name ?? "No file selected"}</Typography>
              </Paper>  
            </Grid>

            <Grid item>
            <Tooltip title="Info">
                <IconButton aria-label="load" size="small" onClick={handleOpen} >
                    <InfoIcon />
                </IconButton>
            </Tooltip>
            </Grid>
            
        </Grid>

        <Typography align="center" sx={{fontWeight: 'bold', mb: 1}}>WIP Overlays for OBS:</Typography>

        <Button size="small" variant="contained" onClick={ () => { openLink("http://127.0.0.1:17882/") } }>
            <Typography sx={{ mt: 0.5 }} variant="button" >open in browser</Typography>
        </Button>

        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <TextFileInfo />
            </Box>
        </Modal>
    </Box>
  )
}
