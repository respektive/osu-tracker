import { useState } from 'react'
import { Box, Link, Modal } from '@mui/material';
import About from './About';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "97%",
    borderRadius: "5px",
    bgcolor: 'background.default',
    boxShadow: 24,
    p: 1,
    pb: 2,
    pt: 2
  };

export default function Footer() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

  return (
    <Box textAlign="center" sx={{ width: '100%', height: "24px", bottom: 0, bgcolor: 'background.paper' }}>
        <Link component="button" variant="body2" underline="hover" onClick={handleOpen} >made by respektive</Link>

        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <About />
            </Box>
        </Modal>
    </Box>
  )
}
