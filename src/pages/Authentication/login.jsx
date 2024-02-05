import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Box,
  AppBar,
  Toolbar,
  TextField,
  Button,
  IconButton,
  Paper,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Badge,
  InputAdornment,
  Grid
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  AccountCircle,
  Close,
  Vidiblity,
  Visibility,
  VisibilityOff,
  RadioButtonCheckedRounded
} from "@material-ui/icons";
import LanguageToggleMenu from "../../utils/languagetoggle_menu.jsx";
import { withLocalize, Translate } from "react-localize-redux";
import { useSnackbar } from "notistack";

import { useHistory } from "react-router-dom";

import LogoWhite from "../../assets/img/bnr_logo.png";
import HomeLicenseImage from "../../assets/svg/home_license.svg"

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
    paper: {
      padding: 15,
    },
    btn:{
      textTransform:'capitalize'
    },
    login_container:{
        marginTop: 150
    }
  }));
  

function Login(props) {
  const classes = useStyles();
  const history = useHistory();

  const [confirming, setConfirming] = useState(false);


  const [username, setUsername] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [logging, setLogging] = useState(false);
  const [passSecure, setPassSecure] = useState(true);
  const requestRef = useRef(null);
  const [expired, setExpired] = useState(false);


  useEffect(() => {
    var ex = history?.location?.state?.expired;
    if (ex != null) {
      history.replace(history.location.pathname);
      localStorage.removeItem("nx_cent");
      localStorage.removeItem("nx_op");
      localStorage.removeItem("nx_ag");

      localStorage.removeItem("profile");
      localStorage.removeItem("agent_profile");
      setExpired(true);
    }


  }, []);

  const handleLanguageClose = (code) => {};

  const onUsernameChange = (event) => {
    if (event.target.value === "") {
      setUsername({ value: "", error: "Enter your email or username" });
    } else {
      setUsername({ value: event.target.value, error: "" });
    }
  };

  const onPasswordChange = (event) => {
    if (event.target.value === "") {
      setPassword({ value: "", error: "Enter your password" });
    } else {
      setPassword({ value: event.target.value, error: "" });
    }
  };

  const onLoginClick = (e) => {
    e.preventDefault();

    if (username.value === "") {
      setUsername({ value: "", error: "Enter your email or username here" });
    } else if (password.value === "") {
      setPassword({ value: "", error: "Enter your password here" });
    } else {
      doLogin();
    }
  };

  //////////////////////

  const [tempToken,setTempToken] = useState("");

  const doLogin = () => {

  
  };




  ///////////// notify component ////

  const notify = (variant, msg, status) => {
    if (status == 401) {
      history.push("/", { expired: true });
    }
    enqueueSnackbar(msg, {
      variant: variant,
      action: (k) => (
        <IconButton
          onClick={() => {
            closeSnackbar(k);
          }}
          size="small"
        >
          <Close fontSize="small" />
        </IconButton>
      ),
    });
  };



  return (
    <div className={classes.root}>
      <CssBaseline />

      <AppBar position="static" elevation={2} color="primary">
        <Toolbar>
          <img src={LogoWhite} alt="Icon" height={50} />
          <Box className={classes.title} style={{marginLeft: 10}}>
          
              <Typography variant="h5">License MS</Typography>
           
          </Box>
          <LanguageToggleMenu close={handleLanguageClose} />
        </Toolbar>
      </AppBar>

      <Container >

      <Box style={{marginTop: 180}} />
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} sm={12} md={6}>
          <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={1}
              ref={requestRef}
            >
                <img src={HomeLicenseImage} width={300} />
              {/* <Typography variant="h4" gutterBottom>
                <b>Interested in our services?</b>
              </Typography> */}
            </Box>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              width={1}
              ref={requestRef}
            >
              <Typography variant="h4" gutterBottom>
                <b>License Management System</b>
              </Typography>
            </Box>
            <Box display="flex" alignItems="flex-start" p={1}>
              <Typography>
                License MIS is a system system system system system system system system system system system system system system system system system system system system system system system system system system system system system
              </Typography>
            </Box>

          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Paper className={classes.paper} elevation={9}>
            <Box style={{padding: 20,display: 'flex', flexDirection:'column'}} >
                <Box style={{display:"flex", alignItems:"center",justifyContent:"center"}} >
                  <Typography variant="h4">
                    <Translate id="login.hello" />
                  </Typography>
                </Box>
                <Typography color="textSecondary" align="center">
                  <Translate id="login.welcome" />
                </Typography>
              </Box>
              <Box style={{marginTop: 20}}>
                <Translate>
                  {({ translate }) => (
                    <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      placeholder={translate("login.forms.hints.username")}
                      label={<Translate id="login.forms.labels.username" />}
                      fullWidth
                      onChange={onUsernameChange}
                      helperText={username.error}
                      error={username.error !== ""}
                    />
                  )}
                </Translate>
              </Box>
              <Box style={{marginTop: 20}}>
                <Translate>
                  {({ translate }) => (
                    <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      placeholder={translate("login.forms.hints.password")}
                      label={<Translate id="login.forms.labels.password" />}
                      type={passSecure ? "password" : "text"}
                      fullWidth
                      onChange={onPasswordChange}
                      helperText={password.error}
                      error={password.error !== ""}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={() => setPassSecure(!passSecure)}
                          >
                            <IconButton>
                              {" "}
                              {!passSecure ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </Translate>
              </Box>

              <Box style={{marginTop: 10,marginBottom: 10}}>
                {" "}
                <FormControlLabel
                  control={<Checkbox name="remember" />}
                  label={<Translate id="login.forms.remember_me" />}
                />
              </Box>

              <Box style={{marginTop: 10,marginBottom: 10}}>
                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  variant="contained"
                  disableElevation
                  disabled={logging}
                  onClick={onLoginClick}
                >
                  {logging ? (
                    <CircularProgress size={25} />
                  ) : (
                    <Translate id="login.forms.login" />
                  )}
                </Button>
              </Box>
              <Button fullWidth color='primary' onClick={()=>{

             if(username.value==''){
                notify("warning","Enter your username only to initiate password reset",403)
             }else{
             }
              
              }} className={classes.btn} disabled={confirming}> {confirming ? (
                    <CircularProgress size={25} />
                  ) : (
                    "Reset password?"
                  )}</Button>
            </Paper>
          </Grid>
        </Grid>
        
        {/* <form onSubmit={onLoginClick}>
          <Box className={classes.login_container}>
            <Paper className={classes.paper}>
              <Box style={{padding: 20,display: 'flex', flexDirection:'column'}} >
                <Box style={{display:"flex", alignItems:"center",justifyContent:"center"}} >
                  <Typography variant="h4">
                    <Translate id="login.hello" />
                  </Typography>
                </Box>
                <Typography color="textSecondary" align="center">
                  <Translate id="login.welcome" />
                </Typography>
              </Box>
              <Box style={{marginTop: 20}}>
                <Translate>
                  {({ translate }) => (
                    <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      placeholder={translate("login.forms.hints.username")}
                      label={<Translate id="login.forms.labels.username" />}
                      fullWidth
                      onChange={onUsernameChange}
                      helperText={username.error}
                      error={username.error !== ""}
                    />
                  )}
                </Translate>
              </Box>
              <Box style={{marginTop: 20}}>
                <Translate>
                  {({ translate }) => (
                    <TextField
                      size="small"
                      variant="outlined"
                      color="primary"
                      placeholder={translate("login.forms.hints.password")}
                      label={<Translate id="login.forms.labels.password" />}
                      type={passSecure ? "password" : "text"}
                      fullWidth
                      onChange={onPasswordChange}
                      helperText={password.error}
                      error={password.error !== ""}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={() => setPassSecure(!passSecure)}
                          >
                            <IconButton>
                              {" "}
                              {!passSecure ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </Translate>
              </Box>

              <Box style={{marginTop: 10,marginBottom: 10}}>
                {" "}
                <FormControlLabel
                  control={<Checkbox name="remember" />}
                  label={<Translate id="login.forms.remember_me" />}
                />
              </Box>

              <Box style={{marginTop: 10,marginBottom: 10}}>
                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  variant="contained"
                  disableElevation
                  disabled={logging}
                  onClick={onLoginClick}
                >
                  {logging ? (
                    <CircularProgress size={25} />
                  ) : (
                    <Translate id="login.forms.login" />
                  )}
                </Button>
              </Box>
              <Button fullWidth color='primary' onClick={()=>{

             if(username.value==''){
                notify("warning","Enter your username only to initiate password reset",403)
             }else{
             }
              
              }} className={classes.btn} disabled={confirming}> {confirming ? (
                    <CircularProgress size={25} />
                  ) : (
                    "Reset password?"
                  )}</Button>
            </Paper>
          </Box>
        </form> */}
      </Container>

    </div>
  );
}
export default withLocalize(Login);