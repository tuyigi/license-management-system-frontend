import React, { useState, useEffect, useCallback } from "react";
import { Container, Box, Avatar } from "@material-ui/core";
import {
  Typography,
  AppBar,
  Toolbar,
  Link,
  CardActionArea,
  TextField,
  Button,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import {
  Grid,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  LinearProgress,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import {
  DesktopMac,
  Add,
  FilterList,
  Settings as SettingsIcon,
  AccountCircle,
  Storage,
  ColorLens,
  Business,
  Close,
  KeyboardArrowRight,
  InvertColors, Translate as TranslateIcon,
  VpnKey
} from "@material-ui/icons";
import { withLocalize, Translate } from "react-localize-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { useSnackbar } from "notistack";
import LanguageToggle from "../../utils/languagetoggle";
import {BackendService} from "../../utils/web_config";


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      [theme.breakpoints.up("sm")]: {
        marginLeft: 250,
      },
    },
    title: {
      flexGrow: 1,
    },
    btn: {
      textTransform: "capitalize",
    },
    btn2: {
      textTransform: "capitalize",
      border: "dashed grey 1px",
    },
    paper: {
      padding: 15,
    },
    action: {
      borderRadius: 15,
    },
  }));

function Settings(props){
    const classes = useStyles();
    const [passwordData, setPasswordData] = useState({
        open: false,
        loading: false,
        saving: false,
      })
    
      const [languageData, setLanguageData] = useState({
        open: false,
        loading: false,
        saving: false,
      })
    
      const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    
      const [passwordOld, setOld] = useState({ value: "", error: "" })
      const [passwordNew, setNew] = useState({ value: "", error: "" })
      const [passwordConfirmNew, setConfirmNew] = useState({ value: "", error: "" })
      const handleLanguageClose = (code) => {

      };

      const [accountData,setAccountData] = useState(null)
      useEffect(()=>{
        var accData = new BackendService().accountData;
        setAccountData(accData);
      },[])

    return(
        <div className={classes.root}>
        {/* Dialogs ends here */}
  
        <Dialog
          open={passwordData.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth
          onClose={() => setPasswordData({ ...passwordData, open: false })}
        >
          <DialogTitle id="alert-dialog-title">Change your password</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Box style={{marginTop: 10}}>
                <Translate>
                  {({ translate }) => (
                    <TextField
                      size='small'
                      variant='outlined'
                      color='primary'
                      type='password'
                      value={passwordOld.value}
                      placeholder={"Old Password"}
                      label={"Old Password"}
                      fullWidth
                      onChange={()=>{}}
                      helperText={passwordOld.error}
                      error={passwordOld.error !== ""}
                    />
                  )}
                </Translate>
              </Box>
              <Box style={{marginTop: 10}}>
                <Translate>
                  {({ translate }) => (
                    <TextField
                      size='small'
                      variant='outlined'
                      color='primary'
                      type='password'
                      value={passwordNew.value}
                      placeholder={"New Password"}
                      label={"New Password"}
                      fullWidth
                      onChange={()=>{}}
                      helperText={passwordNew.error}
                      error={passwordNew.error !== ""}
                    />
                  )}
                </Translate>
              </Box>
              <Box style={{marginTop: 10}}>
                <Translate>
                  {({ translate }) => (
                    <TextField
                      size='small'
                      variant='outlined'
                      color='primary'
                      type='password'
                      value={passwordConfirmNew.value}
                      placeholder={"Confirm Password"}
                      label={"Confirm Password"}
                      fullWidth
                      onChange={()=>{}}
                      helperText={passwordConfirmNew.error}
                      error={passwordConfirmNew.error !== ""}
                    />
                  )}
                </Translate>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setPasswordData({ ...passwordData, open: false });
              }}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              disabled={passwordData.saving}
              variant="contained"
              color="primary"
              onClick={()=>{}}
              disableElevation
            >
              {passwordData.saving ? (
                <CircularProgress size={23} />
              ) : "Change"}
            </Button>
          </DialogActions>
        </Dialog>
        {/* ///////////////////////////////////// */}
  
        <Dialog
          open={languageData.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth
          onClose={() => setLanguageData({ ...languageData, open: false })}
        >
          <DialogTitle id="alert-dialog-title">Choose preffered language</DialogTitle>
          <DialogContent>
  
            <LanguageToggle close={handleLanguageClose} />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setLanguageData({ ...languageData, open: false });
              }}
            
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
  
        {/* //////////////////////////////// */}
        <Box style={{display:"flex"}}>
          <Box mr={2}>
            {" "}
            <SettingsIcon color="primary" fontSize="large" />
          </Box>
          <Typography variant="h5" className={classes.title}>
            <b>Settings</b>
          </Typography>
        </Box>
        <Grid container spacing={1} justify="center">
          <Grid item xs={12}>
            <Box m={2}>
              <Typography>You can change system settings here</Typography>
            </Box>
          </Grid>
         
          <Grid item xs={12} md={6}>
            <Box  
            style={{margin:10,display:'flex',width:"100%",justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
              <Avatar  style={{height:120,width:120}}/>
              <Box mt={2}>
            <Typography gutterBottom variant='h5' align='center'>{`${accountData?.user?.first_name} ${accountData?.user?.last_name}`}</Typography>
              <Typography color='textSecondary' align='center' >{`${accountData?.user?.organization_id?.name} :: ${accountData?.user?.role_id?.name}`}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <CardActionArea
              onClick={() => {
                setPasswordData({ ...passwordData, open: true })
              }}
            >
              <Paper className={classes.paper} elevation={0}>
                <Box style={{display:"flex", alignItems:"center"}} width={1}>
                  <Box mr={2}>
                    <VpnKey fontSize="large" />
                  </Box>
                  <Box flexGrow={1}>
                    <Typography>Change your password</Typography>
                  </Box>
                  <KeyboardArrowRight />
                </Box>
              </Paper>
            </CardActionArea>
          </Grid>    
          <Grid item xs={12} md={7}>
            <CardActionArea
              onClick={() => {
                setLanguageData({ ...languageData, open: true })
              }}
            >
              <Paper className={classes.paper} elevation={0}>
                <Box style={{display:"flex", alignItems:"center"}}>
                  <Box mr={2}>
                    <TranslateIcon fontSize="large" />
                  </Box>
                  <Box flexGrow={1}>
                    <Typography>System language</Typography>
                  </Box>
                  <KeyboardArrowRight />
                </Box>
              </Paper>
            </CardActionArea>
          </Grid>
        </Grid>
      </div>
    );
}
export default withLocalize(Settings);