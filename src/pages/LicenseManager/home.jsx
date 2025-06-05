import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import BnrIcon from "../../assets/img/bnr_logo.png";
import {
    Button,
    Drawer,
    ListItemText,
    IconButton,
    ListItemIcon,
    ListItem,
    Divider,
    List,
    Grid,
    Paper,
    Typography,
    Toolbar,
    AppBar,
    Container,
    Box,
    Hidden,
    Menu,
    MenuItem,
    Avatar,
    useMediaQuery,
    Badge,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Popover,
} from "@material-ui/core";

import {
    Menu as MenuIcon,
    Home,
    Settings as SettingsIcon,
    ExitToApp,
    Email,
    ExpandLess,
    ExpandMore,
    ArrowRight,
    Receipt,
    Business,
    AccountTree,
    PeopleAltOutlined,
    AssessmentOutlined,
    Computer,
    Note,
    ListAlt, Notifications
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/styles";
import { withLocalize } from "react-localize-redux";
import { Switch, Route, useHistory } from "react-router-dom";
import  Dashboard  from "./dashboard";
import LicenseRequest from "./license_requests";
import Settings from "../shared/settings";
import SoftwareLicenseRequest from "../LicenseManager/software_license_requests";
import ExpirationReport from "./reports/expiration_report";
import Vendors from "./vendors"
import ContractsApproval from "./contracts_approval";
import {BackendService} from "../../utils/web_config";
import dayjs from "dayjs";
import axios from "axios";
import {useLicenseRequestStatusStats} from "../../hooks/use_dashboard";
import LicensesApproval from "./licenses_approval";
// import Contracts from "./contracts";




const routes = [
    {
      path: "/licenseManager",
      exact: true,
      permission: "CAN_VIEW_HOME",
      main: () =>  <Dashboard/>,
    },
    {
        path: "/licenseManager/home",
        exact: true,
        permission: "CAN_VIEW_HOME",
        main: () =>  <Dashboard/>,
    },
    {
        path: "/licenseManager/softwareLicenseRequest",
        exact: true,
        permission: "CAN_VIEW_SOFTWARE_LICENSE_REQUEST",
        main: () =>  <SoftwareLicenseRequest/>,
    },
    {
        path: "/licenseManager/licenses",
        exact: true,
        permission: "CAN_VIEW_LICENSE",
        main: () =>  <LicensesApproval/>,
    },
    {
        path: "/licenseManager/settings",
        exact: true,
        permission: "CAN_VIEW_SETTINGS",
        main: () =>  <Settings/>,
    },
    {
        path: "/licenseManager/expirationReport",
        exact: true,
        permission: "CAN_VIEW_REPORTS",
        main: () =>  <ExpirationReport/>,
    },
    {
        path: "/licenseManager/contracts",
        exact: true,
        permission: "CAN_VIEW_CONTRACT",
        main: () =>  <ContractsApproval/>,
    },
    {
        path: "/licenseManager/vendors",
        exact: true,
        permission: "CAN_VIEW_VENDOR",
        main: () =>  <Vendors/>,
    },
    {
      main: () => <></>,
    },
  ];

const menus = [
    { name: "Home", icon: <Home color="primary" />, path: "/licenseManager/home",permission: "CAN_VIEW_HOME", },
    { name: "Vendors", icon: <Business color={"primary"}/>, path: "/licenseManager/vendors", permission: "CAN_VIEW_VENDOR"},
    { name: "Contracts", icon: <ListAlt color={"primary"}/>, path: "/licenseManager/contracts", permission: "CAN_VIEW_CONTRACT"},
    {  name: "Licenses", icon: <Note color={"primary"}/>, path: "/licenseManager/licenses", permission: "CAN_VIEW_LICENSE"},
    // { name: "Institution License Requests", icon: <Receipt color={"primary"}/>, path: "/licenseManager/license", permission: "CAN_VIEW_LICENSE_REQUEST"},
    // { name: "Reports", icon: <AssessmentOutlined color={"primary"}/>, path: "/licenseManager/reports", permission: "CAN_VIEW_REPORT",
    //     submenu:[
    //         { name: "License Expiration Report", path: "/licenseManager/expirationReport"},
    //         // { name: "Audit Trail Report", path: "/licenseManager/licenseRequests"}
    //     ]
    // }
];

const menus2 = [
/*
    { name: "Settings", icon: <SettingsIcon color="primary" />, path: "/licenseManager/settings" ,permission:"CAN_VIEW_SETTINGS",},
*/
    { name: "Logout", icon: <ExitToApp  color = "primary" />, path: "/licenseManager/logout" },
  ];

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    border: 0,
  },
  btn: {
    textTransform: "capitalize",
  },
  paper: {
    padding: 15,
  },
  icon: {
    height: 45,
    marginRight: 10,
    display: "block",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  icon2: {
    height: 35,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function LicenseManagerHome(props) {
    const { window } = props;
    const classes = useStyles();
    const Theme = useTheme();
    const history = useHistory();
    const { themer } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [incomingRequestsCount, setIncomingRequestsCount] = useState(0);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const open = Boolean(anchorEl);
    const id = open ? 'reminders-popover' : undefined;
    const [openMenu, setOpenMenu] = useState("none");
    const [accountData, setAccountData] = useState(null);
    useEffect(() => {
        var accData = new BackendService().accountData;
        setAccountData(accData);
        getIncomingLicenseContractRequests(accData);
    }, []);
    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleClickPendingPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };
  
    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {menus.map((menu, index) => (
            <>
                <ListItem
                  button
                  key={menu.name}
                  onClick={() => {
                    if (menu.submenu) {
                      if (openMenu == index) {
                        setOpenMenu("none");
                      } else {
                        setOpenMenu(index);
                      }
                    } else {
                      history.push(menu.path);
                      setMobileOpen(false);
                    }
                  }}
                  selected={
                    menu.path == history.location.pathname && !menu.submenu
                  }
                >
                  <ListItemIcon>{menu.icon}</ListItemIcon>
                  <ListItemText primary={menu.name} />
                  {menu.submenu ? (
                    openMenu == index ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )
                  ) : (
                    <div />
                  )}
                </ListItem>
                {menu.submenu && (
                  <Collapse in={openMenu == index} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {menu.submenu.map((sub, i) => (

                        <ListItem
                          button
                          className={classes.nested}
                          onClick={() => {
                            history.push(sub.path);
                            setMobileOpen(false);
                          }}
                          selected={sub.path == history.location.pathname}
                        >
                          <ListItemIcon>
                            <ArrowRight />
                          </ListItemIcon>
                          <ListItemText primary={sub.name} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
            </>
          ))}
        </List>
        <Divider />
        <List>
          {menus2.map((menu, index) => (
            <ListItem
              button
              key={menu.name}
              onClick={() => {
                if (menu.path === "/licenseManager/logout") {
                  setLogoutOpen(true);
                } else {
                  history.push(menu.path);
                }
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{menu.icon}</ListItemIcon>
              <ListItemText primary={menu.name} />
            </ListItem>
          ))}
        </List>
      </div>
    );

    //Get pending requests
    const getIncomingLicenseContractRequests = (token) => {
        const dInstance = axios.create(new BackendService().getHeaders(token));
        const url = new BackendService().LICENSE_REQUEST_TYPE_STATS;
        dInstance
            .get(url)
            .then(function (response) {
                const data = response.data.data;
                const pendingItem = data.find(item => item.approval_status === "PENDING");
                const pendingTotal = pendingItem ? parseInt(pendingItem.total) : 0;
                setIncomingRequestsCount(pendingTotal);
                setIncomingRequests(pendingItem ?? []);
            })
            .catch((err) => {
                console.error('Error loading reminders:', err);
                setIncomingRequestsCount(0);
                setIncomingRequests([]);
            });
    }
    const container =
      window !== undefined ? () => window().document.body : undefined;
    const matches = useMediaQuery(Theme.breakpoints.up("sm"));


  
    return (
      <div className={classes.root}>
        <CssBaseline />
        {/* Logout dialog hereeeeeeeeee */}
        <Dialog
          open={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Logout"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to logout of your account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogoutOpen(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem("LMIS");
                history.replace("/");
              }}
              color="primary"
              autoFocus
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
  
        <AppBar
          position="fixed"
          color={themer === 0 ? "primary" : "default"}
          elevation={0}
          className={classes.appBar}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <img src={BnrIcon} alt="icon" className={classes.icon} />
            <Box className={classes.title}>
              <Typography variant="h5" noWrap>
                Licence MIS
              </Typography>
            </Box>

              <Box mr={matches && 2}>
                  <IconButton
                      sx={{fontSize:'20pt'}}
                      color="inherit"
                      onClick={handleClickPendingPopover}
                  >
                      <Badge
                          badgeContent={incomingRequestsCount}
                          showZero={false}
                          variant="standard"
                          color="secondary"
                      >
                          <Notifications htmlColor="#f9f1db" />
                      </Badge>
                  </IconButton>
  {/*                <Popover

                      anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                      }}
                      transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                      }}
                      sx={{ mt: 1 }}
                  >
                  </Popover>*/}

              </Box>

  
{/*
            <div>
              <Button
                onClick={handleMenu}
                color="inherit"
                variant={matches && "outlined"}
                size="small"
                className={classes.btn}
                startIcon={
                  matches && (
                    <img
                      src={BnrIcon}
                      className={classes.icon2}
                      alt="Safaribus"
                    />
                  )
                }
              >
                  {<Avatar>{`${accountData?.user?.first_name?.substr(0,1)}${accountData?.user?.last_name?.substr(0,1)}`}</Avatar>}
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                open={menuOpen}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    history.push("/brn/users/system");
                  }}
                >
                  System users
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    history.push("/bnr/settings");
                  }}
                >
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    setLogoutOpen(true);
                  }}
                >
                  Logout
                </MenuItem>
                
              </Menu>
            </div>
*/}
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={Theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              elevation={0}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            {routes.map((route, i) => (
               
              <Route
                key={i}
                exact={route.exact}
                path={route.path}
                component={route.main}
              />
            
            ))}
          </Switch>
        </main>
      </div>
    );
  }
  
  export default withLocalize(LicenseManagerHome);
