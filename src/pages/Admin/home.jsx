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
    Computer,
    LocationCity,
    WorkOutlineOutlined
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/styles";
import { withLocalize } from "react-localize-redux";
import { Link, Switch, Route, useHistory } from "react-router-dom";

import Dashboard from "./dashboard"
import Licenses from "./licenses";
import Organizations from "./organizations";
import RolePermission from "./role_permission";
import Settings from "./settings";
import Users from "./users";
import LicenseTracking from "./reports/license_tracking";
import OrganizationLicenses from "./reports/organization_licenses";
import SoftwareLicenses from "./sofwate_licenses";
import Vendors from "./vendors";

const routes = [
    {
      path: "/bnr",
      exact: true,
      permission: "CAN_VIEW_HOME",
      main: () =>  <Dashboard/>,
    },
    {
        path: "/bnr/home",
        exact: true,
        permission: "CAN_VIEW_HOME",
        main: () =>  <Dashboard/>,
    },
    {
        path: "/bnr/license",
        exact: true,
        permission: "CAN_VIEW_LICENSE",
        main: () =>  <Licenses/>,
    },
    {
        path: "/bnr/vendors",
        exact: true,
        permission: "CAN_VIEW_VENDOR",
        main: () =>  <Vendors/>,
    },
    {
        path: "/bnr/softwareLicense",
        exact: true,
        permission: "CAN_VIEW_SOFTWARE_LICENSE",
        main: () =>  <SoftwareLicenses/>,
    },
    {
        path: "/bnr/organization",
        exact: true,
        permission: "CAN_VIEW_ORGANIZATION",
        main: () =>  <Organizations/>,
    },
    {
        path: "/bnr/rolePermission",
        exact: true,
        permission: "CAN_VIEW_ROLE_PERMISSION",
        main: () =>  <RolePermission/>,
    },
    {
        path: "/bnr/user",
        exact: true,
        permission: "CAN_VIEW_ROLE_USER",
        main: () =>  <Users/>,
    },
    {
        path: "/bnr/licenseTracking",
        exact: true,
        main: () =>  <LicenseTracking/>,
    },
    {
        path: "/bnr/licenseOrganization",
        exact: true,
        main: () =>  <OrganizationLicenses/>,
    },
    {
        path: "/bnr/settings",
        permission:"CAN_VIEW_SETTINGS",
        exact: true,
        main: () =>  <Settings/>,
    },
    {
      main: () => <></>,
    },
  ];

const menus = [
    { name: "Home", icon: <Home color="primary" />, path: "/bnr/home",permission: "CAN_VIEW_HOME", },
    { name: "Vendors", icon: <WorkOutlineOutlined color={"primary"}/>, path: "/bnr/vendors", permission: "CAN_VIEW_VENDOR"},
    { name: "Software Licenses", icon: <Computer color={"primary"}/>, path: "/bnr/softwareLicense", permission: "CAN_VIEW_SOFTWARE_LICENSE"},
    { name: "Institution Licenses", icon: <LocationCity color={"primary"}/>, path: "/bnr/license", permission: "CAN_VIEW_LICENSE"},
    { name: "Organizations", icon: <Business color={"primary"}/>, path: "/bnr/organization", permission: "CAN_VIEW_ORGANIZATION"},
    { name: "Roles & Permissions", icon: <AccountTree color={"primary"}/>, path: "/bnr/rolePermission", permission: "CAN_VIEW_ROLE_PERMISSION"},
    { name: "Users", icon: <PeopleAltOutlined color={"primary"}/>, path: "/bnr/user", permission: "CAN_VIEW_ROLE_USER"},
    { name: "Reports", icon: <AssessmentOutlined color={"primary"}/>, path: "/bnr/reports", permission: "CAN_VIEW_REPORT",
        submenu:[
            { name: "License Tracking", path: "/bnr/licenseTracking"},
            { name: "Organization Licenses", path: "/bnr/licenseOrganization"}
        ]
    },
    ];

const menus2 = [
    { name: "Settings", icon: <SettingsIcon color="primary" />, path: "/bnr/settings" ,permission:"CAN_VIEW_SETTINGS",},
    { name: "Logout", icon: <ExitToApp  color = "primary" />, path: "/bnr/logout" },
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

function BnrHome(props) {
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
  
    useEffect(() => {
  
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
                if (menu.path === "/bnr/logout") {
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
                  history.push("/bnr/");
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
                {<Avatar>GT</Avatar>}
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
  
  export default withLocalize(BnrHome);
