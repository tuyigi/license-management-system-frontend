import React,{useState,useEffect} from 'react';

import './App.css';
import { MyTheme } from './utils/styles.jsx'
import { MuiThemeProvider } from '@material-ui/core/styles' 


import { Button, Snackbar } from '@material-ui/core'
import Translator from './translator.jsx'
import { LocalizeProvider } from "react-localize-redux";
import axios from "axios";

require('typeface-lato')

function App() {

  const [theme, setTheme] = useState(0)
  const [reload, showReload] = useState(false)
  const [update, setUpdate] = useState(0)

  useEffect(() =>
  {

    const t = window.localStorage.getItem("theme")
    if (t != null) {
      setTheme(t)
    }

    const u = window.localStorage.getItem("update")
    if (u != null) {
      setUpdate(u)
      if (u == 1) {
        showReload(true)
      }
    }

    window.addEventListener("newContentAvailable", () =>
    {
      showReload(true)
      window.localStorage.setItem("update", 1)

    });

  }, [])

  const changeTheme = (t) =>
  {
    window.localStorage.setItem('theme', t);
    setTheme(t)
  }

  const handleSnackClose = (event, reason) =>
  {
    if (reason === "clickaway") {
      return;
    }
    caches.keys().then(function (names)
    {
      for (let name of names)
        caches.delete(name);
    });

    window.localStorage.setItem("update", 0)

    window.location.reload();

    showReload(false);

  };

  return (
   <MuiThemeProvider theme={MyTheme(theme)}>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={reload}
        autoHideDuration={120000}
        onClose={handleSnackClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}

        message={<span id="message-id">{"This app contents are updated,click update to get the latest version."}</span>}
        action={[
          <Button color='primary' onClick={handleSnackClose}>Update</Button>
        ]}
      />
     <LocalizeProvider>
        <Translator changeTheme={changeTheme} themer={theme} />
        </LocalizeProvider>
    </MuiThemeProvider>
  );
}

export default App;
