import { useState, useEffect, useContext } from 'react'
import { SettingsContext } from './SettingsContext'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import GeneralSettings from './GeneralSettings';
import VisibilitySettings from './VisibilitySettings';
import SessionManager from './SessionManager';
import Footer from './Footer';
import Overlays from './Overlays';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  

export default function Settings({ refreshStats }) {
    const [settings, setSettings] = useContext(SettingsContext)
    const [value, setValue] = useState(0);
    const [visibilityData, setVisibilityData] = useState({});

    async function getData() {
      const result = await window.api.getVisibilityData()
      setVisibilityData(result)
    }

    useEffect(() => {
        getData()
    }, [])

    const handleChange = (event, newValue) => {
      setValue(newValue);
      getData()
    };

    const setGamemode = (mode) => {
      setSettings({ ...settings, gamemode: mode })
    };

    return (    
      <>
        <Box sx={{ flexGrow: 1, overflow: 'hidden', pb: 0, minHeight: "calc(100vh - 104px);" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth" >
                    <Tab label="Settings" {...a11yProps(0)} />
                    <Tab label="Visibility" {...a11yProps(1)} />
                    <Tab label="Sessions" {...a11yProps(2)} />
                    <Tab label="OBS" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <GeneralSettings refreshStats={refreshStats} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <VisibilitySettings visibilityData={visibilityData} refreshStats={refreshStats}/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <SessionManager refreshStats={refreshStats} setGamemode={setGamemode}/>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Overlays />
            </TabPanel>
        </Box>

        <Footer />
      </>
    )
}
