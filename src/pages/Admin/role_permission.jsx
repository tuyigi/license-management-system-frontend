import React,{useState,useEffect} from "react";
import {withLocalize, Translate} from "react-localize-redux";
import {makeStyles, useTheme} from "@material-ui/styles";
import { Container, Box } from "@material-ui/core";
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
  IconButton,
  Popover,
  FormControl,
  InputLabel,
  FormHelperText,
  MenuItem,
  Select,
 
} from "@material-ui/core";
import {
  Grid,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  LinearProgress,
  List,
  CircularProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  InputAdornment,
  Menu,
  useMediaQuery
} from "@material-ui/core";
import {
  MoreVert,
  Filter,
  Delete,
  Edit,
  Add,
  Close,
  Block,
  CheckCircle,
  Search,
  Security,
  BookmarkBorder,
  Assignment,
  AccountTree
} from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { Skeleton, Autocomplete, Pagination } from "@material-ui/lab";
import NoData from "../../assets/svg/no_data.svg";
import SelectRole from "../../assets/svg/select_role.svg";
import axios from "axios";
import {BackendService, Validator} from "../../utils/web_config";
import {useHistory} from "react-router-dom";


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
      marginLeft: 10,
    },
    btn2: {
      textTransform: "capitalize",
    },
    paper: {
      padding: 15,
    },
    action: {
      borderRadius: 15,
    },
  }));

function RolePermission(props){
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    const history = useHistory();

    const [loadingPriv, setLoadingPriv] = useState(false);
    const [savingPriv, setSavingPriv] = useState(false);
    const [editRoleMode, setEditRoleMode] = useState(false);
  
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [menuOpen, setMenuOpen] = useState(null);
  
    const [roles, setRoles] = useState({
      saving: false,
      loading: false,
      toggling: "none",
      page: 0,
      pages: 1,
      count: 20,
      per_page: 20,
      data: [],
      data2: [],
    });

    const [accountData,setAccountData] = useState(null);

    useEffect(()=>{
        const accData = new BackendService().accountData;
        setAccountData(accData);
        getRoles(accData.access_token)
        getPrivileges(accData.access_token,0,true)
    },[])




    const [privileges, setPrivileges] = useState([]);
    const [privileges2, setPrivileges2] = useState([]);
  
    const [allPrivileges, setAllPrivileges] = useState([]);
    const [allPrivileges2, setAllPrivileges2] = useState([]);
  
    const [warning, setWarning] = useState({ open: false });
  
    const [selectedRole, setSelectedRole] = useState("none");
    const [itemOver, setItemOver] = useState("none");
  
    const [anchorEditPriv, setAnchorEditPriv] = useState(null);
    const [anchorAssignPriv, setAnchorAssignPriv] = useState(null);
    const [tempAssign, setTempAssign] = useState({ data: [] });
  
    const [newRoleOpen, setNewRoleOpen] = useState(false);
    const [privOpen, setPrivOpen] = useState(false);
    const [name, setName] = useState({ value: "", error: "" });
    const [description, setDescription] = useState({ value: "", error: "" });
  
    const [privDescription, setPrivDescription] = useState({
      value: "",
      error: "",
    });

    const assignPrivilege = (role, privs) => {
        // const privInstance = axios.create(
        //   new AdminService().getHeaders(accountData.token)
        // );
    
        // setLoadingPriv(true);
    
        // console.log("Assigning privilege .....");
        // setAnchorAssignPriv(null);
    
        // const data = {
        //   privilege_id: privs,
        //   role_id: role,
        // };
    
        // const url = new AdminService().ASSIGN_PRIVILEGE;
        // privInstance
        //   .post(url, data)
        //   .then(function (response) {
        //     setLoadingPriv(false);
        //     const d = response.data;
    
        //     getPrivileges(accountData.token, role);
        //     setItemOver("none");
        //     notify("success", d.message);
        //   })
        //   .catch(function (error) {
        //     setLoadingPriv(false);
    
        //     var e = error.message;
    
        //     if (error.response) {
        //       e = error.response.data.message;
        //     }
    
        //     notify(error?.response?.status==404?"info":"error", e, error?.response?.status);
        //   });
      };

      const onRoleSearchChange = (event) => {
        const v = event.target.value;
        const rls = roles.data2
        if (v == "") {
          setRoles({ ...roles, data: rls });
        } else {
          const rls2 = rls.filter((obj) =>
            obj.name.toLowerCase().split("_").join(" ").includes(v.toLowerCase())
          );
          setRoles({ ...roles, data: rls2 });
        }
      };

      const toggleRoleStatus = (id, index, status) => {
        // const roleInstance = axios.create(
        //   new AdminService().getHeaders(accountData.token)
        // );
    
        // setRoles({ ...roles, toggling: index });
    
        // var role = roles.data[index];
        // var role2 = role;
    
        // console.log("toggling role .....");
    
        // var url;
        // if (status == "ENABLED") {
        //   url = new AdminService().DEACTIVATE_ROLE + id;
        //   role["role_status"] = "DISABLED";
        // } else {
        //   url = new AdminService().REACTIVATE_ROLE + id;
        //   role["role_status"] = "ENABLED";
        // }
    
        // roles.data[index] = role;
    
        // roleInstance
        //   .put(url)
        //   .then(function (response) {
        //     const d = response.data;
        //     setRoles({ ...roles, toggling: "none" });
    
        //     notify("success", d.data);
        //   })
        //   .catch(function (error) {
        //     setRoles({ ...roles, toggling: "none" });
        //     roles.data[index] = role2;
        //     var e = error.message;
    
        //     if (error.response) {
        //       e = error.response.data.message;
        //     }
        //     notify(error?.response?.status==404?"info":"error", e, error?.response?.status);
        //   });
      };

      const onAssignedPrivSearchChange = (event) => {
        const v = event.target.value;
    
        if (v == "") {
          setPrivileges(privileges2);
        } else {
          const priv2 = privileges2.filter((obj) =>
            obj.privilege.name.toLowerCase().split("_").join(" ").includes(v.toLowerCase())
          );
          setPrivileges(priv2);
        }
      };

    // get roles
    const getRoles = (token) => {
        const usersInstance = axios.create(new BackendService().getHeaders(token));
        setRoles({ ...roles, loading: true });
        setSelectedRole("none");
        console.log("getting roles .....");

        usersInstance
            .get(
                new BackendService().ROLES
            )
            .then(function (response) {

                setRoles({ ...roles, loading: false });
                const d = response.data;

                setRoles({
                    ...roles,
                    data: d.data,
                    data2: d.data
                });
            })
            .catch(function (error) {
                setRoles({ ...roles, loading: false });

                var e = error.message;

                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status==404?"info":"error", e, error?.response?.status);
            });
    };

    // get privileges
    const getPrivileges = (token,role_id,all = false) => {
        const privilegeInstance = axios.create(new BackendService().getHeaders(token));
        setLoadingPriv(true);
        setPrivileges([]);
        setPrivileges2([]);
        console.log("getting privileges .....");

        const url =all
                ? new BackendService().PRIVILEGE
            : new BackendService().GET_ROLE_PRIVILEGE + role_id;

        privilegeInstance
            .get(url)
            .then(function (response) {
                setLoadingPriv(false);
                const d = response.data;

                if (all) {
                    setAllPrivileges(d.data);
                    setAllPrivileges2(d.data);
                } else {
                    setPrivileges(d.data);
                    setPrivileges2(d.data);

                    var diff = new Validator().difference(d.data, allPrivileges);
                    console.log(diff.length);
                }
            })
            .catch(function (error) {
                setLoadingPriv(false);

                var e = error.message;

                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status==404?"info":"error", e, error?.response?.status);
            });
    };

    const createRole = () => {
        const roleInstance = axios.create(
            new BackendService().getHeaders()
        );
        setRoles({ ...roles, saving: true });
        console.log("Create role .....");
        const data = {
            description: description.value,
            name: name.value,
        };
        const url = new BackendService().ROLES;
        roleInstance
            .post(url, data)
            .then(function (response) {
                setRoles({ ...roles, saving: false });
                const d = response.data;

                const rls = roles.data;
                rls.push(d.data);
                setRoles({ ...roles, data: rls, data2: rls });
                setSelectedRole({ index: selectedRole.index, role: d.data });

                notify("success", d.message);

                clearRoleForm();
                setEditRoleMode(false);
                setNewRoleOpen(false);
            })
            .catch(function (error) {
                setRoles({ ...roles, saving: false });

                var e = error.message;

                if (error.response) {
                    e = error.response.data.message;
                }

                notify(error?.response?.status==404?"info":"error", e, error?.response?.status);
            });
    };

    const clearRoleForm=()=>{
        setName({ value: "", error: ""});
        setDescription({ value: "", error: ""});
    }




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



    return(
        <div className={classes.root}>
        <Dialog
          open={newRoleOpen}
          maxWidth="sm"
          fullWidth
          onClose={() => setNewRoleOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Add new role"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Create new role and adjust privileges later.
            </DialogContentText>
  
            <Box style={{marginTop: 10}}>
              <Translate>
                {({ translate }) => (
                  <TextField
                    size="small"
                    variant="outlined"
                    color="primary"
                    value={name.value}
                    placeholder={"Name"}
                    label={"Name"}
                    fullWidth
                    onChange={(v)=>{
                        if(v.target.value===""){
                            setName({value: "", error: "Name is required"});
                        }else{
                            setName({value: v.target.value, error: ""})
                        }
                    }
                  }
                    helperText={name.error}
                    error={name.error !== ""}
                  />
                )}
              </Translate>
            </Box>
            <Box style={{marginTop: 10}}>
              <Translate>
                {({ translate }) => (
                  <TextField
                    size="small"
                    variant="outlined"
                    color="primary"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={description.value}
                    placeholder={"Description"}
                    label={"Description"}
                    fullWidth
                    onChange={(v)=>{
                        if(v.target.value === ""){
                            setDescription({ value: "", error: "Description is required"})
                        }else{
                            setDescription({ value: v.target.value, error: ""})
                        }
                    }}
                    helperText={description.error}
                    error={description.error !== ""}
                  />
                )}
              </Translate>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                setNewRoleOpen(false);
                clearRoleForm();
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              autoFocus
              disabled={roles.saving}
              onClick={()=>{
                  createRole();
              }}
              disableElevation
            >
              {roles.saving ? <CircularProgress size={23} /> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
        {/* ///////////////////////////// */}
        <Dialog
          open={privOpen}
          onClose={() => setPrivOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">{"All privileges"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              List of all available privileges
            </DialogContentText>
  
            <Box>
              <TextField
                size="small"
                variant="outlined"
              
                placeholder="Search privilege"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                onChange={()=>{}}
              />
            </Box>
            <List>
              {true
                ? allPrivileges.map((priv, i) => (
                  <>
                    {i != 0 && i != allPrivileges.length && (
                      <Divider variant="middle" />
                    )}
                    <ListItem
                      key={i}
                      dense
                      onMouseEnter={() =>
                        setItemOver({ index: i, priv: priv, role: false })
                      }
                      onMouseLeave={() => setItemOver("none")}
                      selected={itemOver.index == i}
                    >
                      <ListItemText
                        primary={priv.name.split("_").join(" ")}
                        secondary={priv.description}
                      />
                      <ListItemSecondaryAction>
                        {itemOver.index == i && (
                          <IconButton
                            onMouseEnter={() =>
                              setItemOver({ index: i, priv: priv, role: false })
                            }
                            onClick={(e) => setAnchorEditPriv(e?.currentTarget)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  </>
                ))
                : [1, 2, 3, 4, 5].map((item, i) => (
                  <ListItem key={i}>
                    <ListItemText
                      primary={
                        <Skeleton
                          variant="text"
                          width={"100%"}
                          style={{ borderRadius: 7 }}
                        />
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPrivOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* ////////////////////////////// */}
  
        <Popover
          id={"pop-id"}
          open={anchorEditPriv != null}
          anchorEl={anchorEditPriv}
          onClose={() => setAnchorEditPriv(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          elevation={4}
        >
          <Box  style={{padding: 10}}>
            <Typography color="textSecondary">
              Edit priviledge detailed description here
            </Typography>
            <Box style={{marginTop:10, marginBottom: 10}}>
              <TextField
                label="Description"
                placeholder="Priviledge description"
                multiline
                fullWidth
                variant="outlined"
                rows={2}
                rowsMax={5}
                defaultValue={itemOver.priv?.description}
                onChange={()=>{}}
                error={privDescription.error != ""}
                helperText={privDescription.error}
              />
            </Box>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              className={classes.btn2}
              onClick={() => setAnchorEditPriv(null)}
            >
              Close
            </Button>
            <Button
              disabled={savingPriv}
              variant="contained"
              size="small"
              color="primary"
              className={classes.btn}
              disableElevation
              onClick={()=>{
                // onEditPrivClick(itemOver.priv, itemOver.index, itemOver.role)
            }
              }
            >
              {savingPriv ? <CircularProgress size={23} /> : "Save"}
            </Button>
          </Box>
        </Popover>
  
        {/* //////////////////////////////////////// */}
  
        <Popover
          id={"pop-id-2"}
          style={{minWidth:200}}
          open={anchorAssignPriv != null}
          anchorEl={anchorAssignPriv}
          onClose={() => {
            setAnchorAssignPriv(null);
            setTempAssign({ data: [] });
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          elevation={4}
        >
          <Box style={{margin: 10}}>
            <TextField
              size="small"
              variant="outlined"
            
              placeholder="Search privilege"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              onChange={()=>{}}
            />
          </Box>
  
          {tempAssign.data.length != 0 && (
            <Box
              style={{ display:"flex",justifyContent:"center",width:"250px",marginBottom:20,padding:10,position: "fixed", zIndex: 100, bottom: 0 }}
            >
              <Button
                color="primary"
                size="large"
                variant="contained"
                onClick={() => assignPrivilege(tempAssign.role, tempAssign.data)}
              >
                Add all {"(" + tempAssign.data.length + ")"}
              </Button>
            </Box>
          )}
  
          <List>
            <ListItem key="987hh">
              <ListItemIcon>
                <Checkbox
                disabled={allPrivileges.length==0}
                  color="primary"
                  checked={tempAssign.all}
                  onChange={(e) => {
                    var d = tempAssign.data;
  
                    if (e.target.checked) {
                      allPrivileges.forEach((p, i) => {
                        d.push(p.privilege_id);
                      });
  
                      setTempAssign({
                        role: selectedRole.role.role_id,
                        data: d,
                        all: true,
                      });
                    } else {
                      setTempAssign({
                        ...tempAssign,
                        data: [],
                        all: false,
                      });
                    }
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Select all" />
            </ListItem>
            {allPrivileges.length!=0
              ? allPrivileges.map((priv, i) => (
                <>
                  {i != 0 && i != allPrivileges.length && (
                    <Divider variant="middle" />
                  )}
                  <ListItem
                    key={i}
                    dense
                    selected={tempAssign.data.includes(priv.privilege_id)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        color="primary"
                        checked={tempAssign.data.includes(priv.privilege_id)}
                        onChange={(e) => {
                          var d = tempAssign.data;
  
                          if (e.target.checked) {
                            d.push(priv.privilege_id);
                            setTempAssign({
                              role: selectedRole.role.role_id,
                              data: d,
                            });
                          } else {
                            const i2 = d.indexOf(priv.privilege_id);
  
                            d.splice(i2, 1);
                            setTempAssign({
                              ...tempAssign,
                              data: d,
                            });
                          }
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={priv.name.split("_").join(" ")}
                      secondary={priv.description}
                    />
                  </ListItem>
                </>
              ))
              :  <Box
                p={2}
                mt={3}
                mb={3}
                height={1}
                display="flex"
                alignItems="center"
                flexDirection="column"
                justifyContent="center"
              >
                <Box mt={2}>
                  <img src={NoData} alt="Empty data" height={200} />
                </Box>
                <Typography color="textSecondary">
                  There are no privilegesfor your search.
                  </Typography>
              </Box>}
          </List>
        </Popover>
  
        <Dialog
          open={warning.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Warning"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You are about to remove this privilege to all users who have this
              role.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setWarning({ ...warning, open: false });
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // removeRolePriv();
                // setWarning({ ...warning, open: false });
              }}
              color="primary"
              autoFocus
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>
  
        {/* Dialogs ends here */}
  
        <Box  style={{display: "flex"}}>
          <Box mr={2}>
            {" "}
            <AccountTree color="primary" fontSize="large" />
          </Box>
          <Typography variant="h5" className={classes.title}>
            <b>Roles and privileges</b>
          </Typography>
  
           {!matches ? (
                  <>
                    <IconButton onClick={(e) => setMenuOpen(e.currentTarget)}>
                      <MoreVert />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={menuOpen}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      open={menuOpen != null}
                      onClose={() => setMenuOpen(null)}
                    >
                      <MenuItem
                          onClick={() => {
              setPrivOpen(true);
              setAllPrivileges(allPrivileges2);
            }}
                      >
                       All privileges
                      </MenuItem>
                      
                 <MenuItem
                        // disabled={orgs.length == 0}
                        onClick={() => setNewRoleOpen(true)}
                      >
                       Create role
                 </MenuItem>
                 </Menu>
                  </>
                ) : (
            <Box style={{display: "flex"}}>
                <Button
                className={classes.btn2}
                color="primary"
                size="medium"
                variant="outlined"
                startIcon={<Assignment />}
                onClick={() => {
                    setPrivOpen(true);
                    setAllPrivileges(allPrivileges2);
                }}
                >
            All priviledges
          </Button>
  
          <Button
            className={classes.btn}
            color="primary"
            variant="contained"
            size="medium"
            startIcon={<Add />}
            disableElevation
            onClick={() => setNewRoleOpen(true)}
          >
            Create role
          </Button>
          </Box>
        )}
  
          
        </Box>
  
        <Box style={{marginTop: 20}} />
  
        <Grid container spacing={1}>
          <Grid xs={12}>
            <Box style={{margin: 10}}>
              <Typography color="textSecondary">
                A role is a group of permissions that you can assign to users. You
                can create a role and add priviledge to it, or copy an existing
                role and adjust its privileges
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={5}>
            <Paper elevation={0} style={{ minHeight: 500 }}>
              <Box style={{paddingTop: 10, paddingRight: 5, paddingLeft: 5}}>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Search role"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  onChange={onRoleSearchChange}
                />
              </Box>
  
              {!roles.loading && roles.data.length == 0 && <Box
              style={{padding:10,
              marginTop:10,
              height:"100%",
              display:"flex",
              alignItems:"center",
              flexDirection:"column",
              justifyContent:"center"}}
              >
                <Box style={{marginTop:10}}>
                  <img src={NoData} alt="Empty data" height={100} />
                </Box>
                <Typography color="textSecondary">
                  There are no roles found at the moment.
                  </Typography>
              </Box>}
              <List>
                {!roles.loading
                  ? roles.data.map((role, i) => (
                    <ListItem
                      key={i}
                      button
                      selected={selectedRole.index == i}
                      onClick={() => {
                        setSelectedRole({ index: i, role: role });
                        getPrivileges(accountData.token, role.id, false);
                      }}
                    >
                      <ListItemIcon>
                        <BookmarkBorder />
                      </ListItemIcon>
                      <ListItemText primary={role.name} />
                      <ListItemSecondaryAction>
                        <Switch
                          color="primary"
                          checked={role.role_status == "ENABLED"}
                          value={i}
                          disabled={roles.toggling == i}
                          onChange={() => {
                            toggleRoleStatus(role.id, i, role.status);
                          }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                  : [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    0,
                    0,
                  ].map((item, i) => (
                    <ListItem key={i}>
                      <ListItemIcon>
                        <Skeleton variant="circle" width={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Skeleton
                            variant="text"
                            width={"100%"}
                            style={{ borderRadius: 7 }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
              </List>
              {/*<Box  style={{width:"100%",pb:10,display:"flex",justifyContent:"center"}} >*/}
              {/*  <Pagination*/}
              {/*    disabled={roles.loading}*/}
              {/*    count={roles.pages}*/}
              {/*    page={roles.page + 1}*/}
              {/*    onChange={(e, v) => {*/}
              {/*      // getRoles(accountData.token, v - 1);*/}
              {/*    }}*/}
              {/*    size="large"*/}
              {/*  />*/}
              {/*</Box>*/}
            </Paper>
          </Grid>
  
          <Grid item xs={12} sm={12} md={7}>
            {selectedRole == "none" ? (
              <Box
                height={1}
                style={{display:"flex",
                alignItems:"center",
                justifyContent:"flex-start",
                marginTop:30,
                flexDirection:"column"}}
              >
                <img src={SelectRole} alt="select item" height={250} />
                <Box mt={2}> <Typography color="textSecondary" align="center">
                  Select one role to adjust priviledges
                </Typography>
                </Box>
              </Box>
            ) : (
                <Box  >
                  <Box style={{display:"flex",justifyContent:"space-between"}}>
                    <Typography variant="h5">{selectedRole.role.name}</Typography>
                    <IconButton
                      color="primary"
                      onClick={() => setSelectedRole("none")}
                    >
                      <Close />
                    </IconButton>
                  </Box>
  
                  <Typography color="textSecondary" gutterBottom>
                    {selectedRole.role.description}
                  </Typography>
  
                  <Button disabled>
                    <Typography
                      color={
                        selectedRole.role.role_status == "DISABLED"
                          ? "error"
                          : "primary"
                      }
                    >
                      {selectedRole.role.role_status}
                    </Typography>
                  </Button>

                    <Box style={{display: "flex"}}>
                        <Button
                        color="primary"
                        variant="outlined"
                        className={classes.btn}
                        disableElevation
                        onClick={(e) => {
                            setAnchorAssignPriv(e?.currentTarget);
                            setAllPrivileges(allPrivileges2);
                        }}
                        startIcon={<Add />}
                    >
                        Assign privileges
                    </Button>

                        {/*<Button*/}
                        {/*    variant="outlined"*/}
                        {/*    color="primary"*/}
                        {/*    className={classes.btn}*/}
                        {/*    disableElevation*/}
                        {/*    onClick={() => {*/}
                        {/*        setEditRoleMode(true);*/}
                        {/*        setNewRoleOpen(true);*/}
                        {/*        setName({ value: selectedRole.role.name, error: "" });*/}
                        {/*        setDescription({*/}
                        {/*            value: selectedRole.role.description,*/}
                        {/*            error: "",*/}
                        {/*        });*/}
                        {/*        setOrganization({*/}
                        {/*            value: selectedRole.role.organization_id,*/}
                        {/*            error: "",*/}
                        {/*        });*/}
                        {/*    }}*/}
                        {/*    startIcon={<Edit />}*/}
                        {/*>*/}
                        {/*    Edit*/}
                        {/*</Button>*/}
                    </Box>

  

  
                  {/* <Button
                  variant="text"
                  color=""
                  className={classes.btn}
                  disableElevation
                  onClick={() => {
                    removeRole();
                  }}
                >
                  <Typography color="error">Delete role</Typography>
                </Button> */}
  
                  <Box mt={2}>
                    <Typography variant="h5">Priviledges assigned to this role</Typography>
  
                    <Box mt={2} ml={2} mr={2}>
                      <TextField
                        size="small"
                        variant="outlined"
                       
                        placeholder="Search in assigned privileges"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                        onChange={onAssignedPrivSearchChange}
                      />
                    </Box>
  
                    {!loadingPriv && privileges.length == 0 && 
                    <Box
                      style={{
                          marginTop:15,padding:10,height:"100%",display:"flex",alignItems:"center",flexDirection:"column",justifyContent:"center"
                      }}

                    >
                      <Box style={{marginTop: 10}}>
                        <img src={NoData} alt="Empty data" height={200} />
                      </Box>
                      <Typography color="textSecondary">
                        There are no privileges found.
                  </Typography>
                    </Box>}
                    <List>
                      {!loadingPriv
                        ? privileges.map((priv, i) => (
                          <>
                            {i != 0 && i != privileges.length && (
                              <Divider variant="middle" />
                            )}
                            <ListItem
                              key={i}
                              dense
                              onMouseEnter={() =>
                                setItemOver({
                                  index: i,
                                  priv: priv.privilege_id,
                                  role: true,
                                })
                              }
                              onMouseLeave={() => setItemOver("none")}
                              selected={itemOver.index == i}
                            >
                              <ListItemText
                                primary={priv.privilege_id.name.split("_").join(" ")}
                                secondary={priv.privilege_id?.description}
                              />
                              <ListItemSecondaryAction>
                                <Box>
                                  {" "}
                                  {itemOver.index == i && (
                                    <IconButton
                                      onMouseEnter={() =>
                                        setItemOver({
                                          index: i,
                                          priv: priv.privilege_id,
                                          role: true,
                                        })
                                      }
                                      onClick={(e) =>{
                                          console.log(priv);
                                          setAnchorEditPriv(e.currentTarget);
                                      }
                                      }
                                      size="small"
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  )}
                                  <IconButton
                                    onClick={(e) =>
                                      setWarning({
                                        role: selectedRole.role.id,
                                        priv: priv.role_privilege_id,
                                        open: true,
                                        index: i,
                                      })
                                    }
                                    size="small"
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </ListItemSecondaryAction>
                            </ListItem>
                          </>
                        ))
                        : [1, 2, 3, 4, 5].map((item, i) => (
                          <ListItem key={i}>
                            <ListItemText
                              primary={
                                <Skeleton
                                  variant="text"
                                  width={"100%"}
                                  style={{ borderRadius: 7 }}
                                />
                              }
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Box>
                </Box>
              )}
          </Grid>
        </Grid>
      </div>
    );
}
export default withLocalize(RolePermission);