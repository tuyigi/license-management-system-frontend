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
  DialogTitle,
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
    Computer, ListAlt, LibraryBooks, Equalizer
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/styles";
import { withLocalize } from "react-localize-redux";
import { Link, Switch, Route, useHistory } from "react-router-dom";
import Dashboard from "./dashboard";
import LicenseRequest from "./license_requests";
import LicenseRequestReport from "./reports/report_approved_license";
import Settings from "./../shared/settings";
import SoftwareLicenseRequest from "./software_license_requests";
import ExpirationReport from "./reports/expiration_report";
import RecordLicense from "./record_licenses";
import Contracts from "./contracts";
import Certificates from "./certificates";
import SystemTool from "../Admin/system_tool";
import {BackendService} from "../../utils/web_config";
import ContractDetails from "./contract_details";

import ToolsIcon from "../../assets/img/tools.png";
import CertificateReport from "./reports/certificate_report";
import ComponentReport from "./reports/component_report";
import SystemToolReport from "./reports/system_tool_report";
import Metric from "./metric";




const routes = [
    {
      path: "/orgAdmin",
      exact: true,
      permission: "CAN_VIEW_HOME",
      main: () => <Dashboard/>,
    },
    {
        path: "/orgAdmin/home",
        exact: true,
        permission: "CAN_VIEW_HOME",
        main: () => <Dashboard/>,
    },
    {
        path: "/orgAdmin/requests",
        exact: true,
        permission: "CAN_VIEW_REQUEST",
        main: () => <LicenseRequest/>,
    },
    {
        path: "/orgAdmin/softwareRequests",
        exact: true,
        permission: "CAN_VIEW_SOFTWARE_LICENSE_REQUEST",
        main: () => <SoftwareLicenseRequest/>,
    },
    {
        path: "/orgAdmin/reports",
        exact: true,
        permission: "CAN_VIEW_REPORT",
        main: () => <LicenseRequestReport/>,
    },
    {
        path: "/orgAdmin/reports/certificate",
        exact: true,
        permission: "CAN_VIEW_REPORT",
        main: () => <CertificateReport/>,
    },
    {
        path: "/orgAdmin/reports/component",
        exact: true,
        permission: "CAN_VIEW_REPORT",
        main: () => <ComponentReport/>,
    },
    {
        path: "/orgAdmin/reports/systemTool",
        exact: true,
        permission: "CAN_VIEW_REPORT",
        main: () => <SystemToolReport/>,
    },
    {
        path: "/orgAdmin/settings",
        exact: true,
        permission: "CAN_VIEW_SETTINGS",
        main: () => <Settings/>,
    },
    {
        path: "/orgAdmin/expirationReport",
        exact: true,
        permission: "CAN_VIEW_REPORT",
        main: () => <ExpirationReport/>,
    },
    {
        path: "/orgAdmin/recordedLicense",
        exact: true,
        permission: "CAN_VIEW_RECORDED_LICENSE",
        main: () => <RecordLicense/>,
    },
    {
        path: "/orgAdmin/contracts",
        exact: true,
        permission: "CAN_VIEW_CONTRACT",
        main: () =>  <Contracts/>,
    },
    {
        path: "/orgAdmin/contractDetails",
        exact: true,
        permission: "CAN_VIEW_CONTRACT_DETAILS",
        main: () =>  <ContractDetails/>,
    },
    {
        path: "/orgAdmin/certificates",
        exact: true,
        permission: "CAN_VIEW_CERTIFICATES",
        main: () =>  <Certificates/>,
    },
    {
        path: "/orgAdmin/systemTool",
        exact: true,
        permission: "CAN_VIEW_SYSTEM_TOOL",
        main: () => <SystemTool/>
    },
    {
        path: "/orgAdmin/metric",
        exact: true,
        permission: "CAN_VIEW_METRIC",
        main: () => <Metric/>
    },
    {
      main: () => <></>,
    },
  ];

const menus = [
    { name: "Home", icon: <Home color="primary" />, path: "/orgAdmin/home",permission: "CAN_VIEW_HOME", },
    { name: "System Tools/Products", icon: <img src={ToolsIcon} width={25} />, path: "/orgAdmin/systemTool", permission: "CAN_VIEW_SYSTEM_TOOL"},
    { name: "Metrics", icon: <Equalizer color={"primary"} />, path: "/orgAdmin/metric", permission: "CAN_VIEW_METRIC"},
    { name: "License Contracts", icon: <ListAlt color={"primary"}/>, path: "/orgAdmin/contracts", permission: "CAN_VIEW_CONTRACT"},
    // { name: "Institution License Requests", icon: <Receipt color={"primary"}/>, path: "/orgAdmin/requests", permission: "CAN_VIEW_REQUEST"},
    // { name: "Software License Requests", icon: <Computer color={"primary"}/>, path: "/orgAdmin/softwareRequests", permission: "CAN_VIEW_SOFTWARE_LICENSE_REQUEST"},
    { name: "License Status Renewal", icon: <Computer color={"primary"}/>, path: "/orgAdmin/recordedLicense", permission: "CAN_VIEW_RECORDED_LICENSE"},
    { name: "Certificates", icon: <LibraryBooks color={"primary"}/>, path: "/orgAdmin/certificates", permission: "CAN_VIEW_CERTIFICATES"},
    { name: "Reports", icon: <AssessmentOutlined color={"primary"}/>, path: "/orgAdmin/reports", permission: "CAN_VIEW_REPORT",
        submenu:[
            { name: 'Certificate', path: '/orgAdmin/reports/certificate'},
            { name: 'Component', path: '/orgAdmin/reports/component'},
            { name: 'System Tool', path: '/orgAdmin/reports/systemTool'},

            // { name: "Approved Licenses ", path: "/orgAdmin/reports"},
            // { name: "Expiration Report", path: "/orgAdmin/expirationReport"}
        ]
    }
];

const menus2 = [
    { name: "Settings", icon: <SettingsIcon color="primary" />, path: "/orgAdmin/settings" ,permission:"CAN_VIEW_SETTINGS",},
    { name: "Logout", icon: <ExitToApp  color = "primary" />, path: "/orgAdmin/logout" },
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

function OrgAdminHome(props) {
    const { window } = props;
    const classes = useStyles();
    const Theme = useTheme();
    const history = useHistory();
    const { themer } = props;
  
  
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [logoutOpen, setLogoutOpen] = useState(false);
  
    const [openMenu, setOpenMenu] = useState("none");
    const [accountData, setAccountData] = useState(null);
    useEffect(() => {
        var accData = new BackendService().accountData;
        setAccountData(accData);
    }, []);
    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
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
                if (menu.path === "/orgAdmin/logout") {
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
          color={themer == 0 ? "primary" : "default"}
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
                color="inherit"
                onClick={() => {

                }}
              >
                <Badge
                  badgeContent={0}
                  showZero={false}
                  variant="standard"
                  color="secondary"
                >
                  <Email />
                </Badge>
              </IconButton>
            </Box>
  
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
  
  export default withLocalize(OrgAdminHome);
