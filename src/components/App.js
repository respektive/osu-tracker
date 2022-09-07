import { useState, useEffect, useMemo } from "react"
import { SettingsContext } from "./SettingsContext.js"
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container';
import StatsGrid from "./StatsGrid"
import Header from "./Header"
import Alert from "./ErrorAlert"
import Settings from "./Settings"
import themes from "./themes"

let timeout;

function App() {
  const [settings, setSettings] = useState(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [username, setUsername] = useState()
  const [stats, setStats] = useState([]);
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const theme = useMemo(() =>
    createTheme(themes[settings?.theme ?? "dark"]),
    [settings]
    );

  // get stats loop
  const getStats = async (first = false) => {
    let data = await window.api.getStats();
    // try one more time if it returns null on first run
    // sometimes the initial user might be set too late idk
    if (first && data == null) {
      data = await window.api.getStats();
    }
    // if the data is not an array it will be an error msg
    if (!Array.isArray(data)) {
        setErrorOpen(true)
        setErrorMsg(data ?? "Some unknown Error occurred")
    } else {
        setStats(data)
    }

    if (timeout != null) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(getStats, settings?.interval ?? 30000) // default 30sec interval
  }

  const refreshStats = async (clearInitialUser=false) => {
    clearTimeout(timeout);
    if (clearInitialUser) {
      await window.api.setInitialUser();
    }
    timeout = null
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    getStats()
    async function getUsername() {
      const response = await window.api.getUsername();
      setUsername(response)
    }
    getUsername()
  }

  // Run on mount
  useEffect(() => {
    async function getSettings() {
      const response = await window.api.getSettings();
      setSettings(response)
    }
    async function setInitialUser() {
      await window.api.setInitialUser();
    }
    async function getUsername() {
      const response = await window.api.getUsername();
      setUsername(response)
    }
    getUsername()
    getSettings()
    setInitialUser()
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    getStats(true)

    return () => {
      clearTimeout(timeout);
      timeout = null
    }
  }, [])

  useEffect(() => {
    async function saveSettings() {
      await window.api.saveSettings(settings);
    }
    saveSettings()
  }, [settings, setSettings])

  function toggleSettings() {
    setIsSettingsOpen(!isSettingsOpen);
  }

  return (
    <SettingsContext.Provider value={[settings, setSettings]}>
      <ThemeProvider theme={theme}>
        <Container disableGutters={true} fixed>
          <CssBaseline />
          <Header toggleSettings={toggleSettings} username={username}/>
          <Alert errorOpen={errorOpen} setErrorOpen={setErrorOpen} errorText={errorMsg}/>
          {isSettingsOpen ? <Settings refreshStats={refreshStats}/> : <StatsGrid stats={stats}/>}
        </Container>
      </ThemeProvider>
    </SettingsContext.Provider>
  );
}

export default App;
