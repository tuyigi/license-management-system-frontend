import React,{useState,useEffect} from "react";
import {withLocalize, Translate} from "react-localize-redux";
import {makeStyles,} from "@material-ui/styles";
import {
    Typography,
    TextField,
    Button,
    Chip,
    FormControlLabel,
    Avatar,
    Switch,
    Box, IconButton, FormControl, InputLabel, Select, MenuItem, FormHelperText
} from "@material-ui/core";
  import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    LinearProgress,
  } from "@material-ui/core";
  import {
    Add,
    CheckCircle,
    Block,
    Edit,
    Receipt,
    PeopleAltOutlined, Close
} from "@material-ui/icons";

  import MUIDataTable from "mui-datatables";

  import { Capitalize } from "../../helpers/capitalize"
import {BackendService} from "../../utils/web_config";
import axios from "axios";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import {useDepartments, useOrganizations, useRoles} from "../../hooks/use_hooks";
import {Autocomplete} from "@material-ui/lab";


const useStyles = makeStyles((theme) => ({
    root: {flexGrow: 1, [theme.breakpoints.up("sm")]: {marginLeft: 250,},},
    title: {flexGrow: 1,},
    btn: {textTransform: "capitalize",},
    btn2: {textTransform: "capitalize", border: "dashed grey 1px",},
    paper: {padding: 15,},
    action: {borderRadius: 15,},
}));


function Users(props){
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();
    const orgs = useOrganizations();
    const allRoles = useRoles();
    const departments = useDepartments();
    const [addNewOpen, setAddNewOpen] = useState(false);
    const [users, setUsers] = useState({
      page: 0,
      count: 1,
      rowsPerPage: 10,
      sortOrder: {},
      saving: false,
      loading: false,
      toggling: false,
      data: [],
    });

    const [accountData, setAccountData] = useState(null);
    useEffect(()=>{
        var accData = new BackendService().accountData;
        setAccountData(accData);
        getUsers(accData.access_token,accData?.user?.department.id);
    },[])
    // get Users
    const getUsers = (token)=>{
        const usersInstance = axios.create(new BackendService().getHeaders(token));
        setUsers({...users, loading: true});
        usersInstance
            .get(new BackendService().USERS)
            .then(function (response) {
                console.log('entering', response);
                setUsers({...users, loading: false});

                const d = response.data;
                console.log('GETTING USERS', d);
                if (d.data.length === 0) {
                    setStatus("There are no users available.");
                } else
                {
                    // var lcs = d.data;
                    // lcs.map((d)=>{
                    //     d['role'] = d.role_id?.name;
                    //     d['organization'] = d.organization_id.name
                    // })
                    var lcs = d.data;
                    lcs = lcs.map((d) => ({
                        ...d,
                        role: d.role_id?.name,
                        organization: d.organization_id?.name,
                    }));

                    setUsers({
                        ...users,
                        data: lcs,
                    });
                    //set status
                    setStatus("Licenses loaded");
                }
            })
            .catch(function (error) {
                setUsers({...users, loading: false});
                var e = error.message;

                if (error.response) {
                    e = error.response.data.message;
                }
                setStatus(e);
                notify(error?.response?.status === 404 ? "info" : "error", e, error?.response?.status);
            });
    }

    const notify = (variant, msg, status) => {
        if (status === 401) {
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

    const [status, setStatus] = useState("No users available....");
    /*const [firstName, setFirstName] = useState({ value: "", error: "" });
    const [lastName, setLastName] = useState({ value: "", error: "" });
    const [userName, setUserName] = useState({ value: "", error: "" });
    const [password, setPassword] = useState({ value: "", error: "" });*/
    const [email, setEmail] = useState({ value: "", error: "" });
  /*  const [phoneNumber, setPhoneNumber] = useState({ value: "", error: "" });*/
    const [roleId, setRoleId] = useState({ value: "", error: "" });
    const [organizationId, setOrganizationId] = useState({ value: "", error: "" });
    const [userType, setUserType] = useState({ value: "", error: "" });
    const [department, setDepartment] = useState({ value: '', error: ''});


/*    const onFirstNameChange = (event) => {
        if (event.target.value === "") {
          setFirstName({
            value: "",
            error: "Please enter first name",
          });
        } else {
          setFirstName({ value: event.target.value, error: "" });
        }
    };*/
    const onDepartmentChange = (event,v) => {
        if (v === null) {
            setDepartment({
                value: "",
                error: "Please select department",
            });
        } else {
            setDepartment({value: v.id, error: ""});
        }
    };
  /*  const onLastNameChange = (event) => {
        if (event.target.value === "") {
          setLastName({
            value: "",
            error: "Please enter last name",
          });
        } else {
          setLastName({ value: event.target.value, error: "" });
        }
      };
    const onUsernameChange = (event) => {
        if (event.target.value === "") {
            setUserName({
            value: "",
            error: "Please enter username",
          });
        } else {
            setUserName({ value: event.target.value, error: "" });
        }
      };*/
    /*const onPasswordChange = (event) => {
        if (event.target.value === "") {
            setPassword({
                value: "",
                error: "Please enter password",
            });
        } else {
            setPassword({ value: event.target.value, error: "" });
        }
    };*/
    const onEmailChange = (event) => {
        if (event.target.value === "") {
            setEmail({
                value: "",
                error: "Please enter email",
            });
        } else {
            setEmail({ value: event.target.value, error: "" });
        }
    };
/*    const onPhoneChange = (event) => {
        if (event.target.value === "") {
            setPhoneNumber({
                value: "",
                error: "Please enter phone number",
            });
        } else {
            setPhoneNumber({ value: event.target.value, error: "" });
        }
    };*/
    const onRoleChange = (event, v) => {
        if (v == null) {
            setRoleId({
                value: '',
                error: 'Please select role',
            });
        } else {
            setRoleId({ value: v.id, error: "" });
        }
    };
    const onOrganizationChange = (event, v) => {
        console.log('event',event);
        console.log('v',v);
        if (v == null) {
            setOrganizationId({
                value: '',
                error: 'Please select organization',
            });
        } else {
            setOrganizationId({ value: v.id, error: "" });
        }
    };
    const onUserTypeChange = (event) => {
        if (event.target.value === "") {
            setUserType({
                value: "",
                error: "Please select user type",
            });
        } else {
            setUserType({ value: event.target.value, error: "" });
        }
    };

    const registerUser = () =>{
 /*       if (firstName.value === "") {
            setFirstName({
                value: "",
                error: "Please enter first name",
            });
        } else if (lastName.value === "") {
            setLastName({
                value: "",
                error: "Please enter last name",
            });
        } else if (userName.value === "") {
            setUserName({
                value: "",
                error: "Please enter valid username",
            });
        } else if (password.value === "") {
            setPassword({
                value: "",
                error: "Please enter  password",
            });
        } */
        if (email.value === "") {
            setEmail({
                value: "",
                error: "Please enter valid email",
            });
        }
      /*  else if (phoneNumber.value === "") {
            setPhoneNumber({
                value: "",
                error: "Please enter valid phone number",
            });
        } */
        else if (roleId.value === "") {
            setRoleId({
                value: "",
                error: "Please Select Role",
            });
        } else if (organizationId.value === "") {
            setOrganizationId({
                value: "",
                error: "Please select organization",
            });
        } else if (userType.value === "") {
            setUserType({
                value: "",
                error: "Please select user type",
            });
        } else{
            createUser()
        }
    }

    const createUser = () =>{
        const userInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        setUsers({...users, saving: true});
        const data = {
           /* first_name: firstName.value,
            last_name: lastName.value,
            username: userName.value,
            password: password.value,*/
            email: email.value,
           /* phone_number: phoneNumber.value,*/
            role_id: roleId.value,
            organization_id: organizationId.value,
            user_type: userType.value,
            department_id: department.value
        };
        userInstance
            .post(new BackendService().USERS, data)
            .then(function (response) {

                setUsers({...users, saving: false});
                var d = response.data;
                var lcss = users.data;
                var lcs = d.data;
                lcs['role'] = lcs['role_id']['name']
                lcs['organization'] = lcs['organization_id']['name']
                lcss.unshift(lcs);
                setUsers({
                    ...users,
                    data: lcss,
                });
                clearLicenseInfo()
                notify("success", response.data.message);

                setAddNewOpen(false);
            })
            .catch(function (error) {
                setUsers({...users, saving: false});
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status === 404 ? "info" : "error", e, error?.response?.status);
            });

    }

    const clearLicenseInfo = () =>{
 /*       setFirstName({ value: "", error: "" });
        setLastName({ value: "", error: "" });
        setUserName({ value: "", error: "" });
        setPassword({ value: "", error: "" });*/
        setEmail({ value: "", error: "" });
       /* setPhoneNumber({ value: "", error: "" });*/
        setRoleId({ value: "", error: "" });
        setOrganizationId({ value: "", error: "" });
        setUserType({ value: "", error: "" });
        setDepartment({ value: "", error: ""});
    }


    // start table config
    const columns = [
               {
                  name: "id",
                  label: "id",
                  options: {
                    filter: false,
                    sort: false,
                    display: 'excluded',
                  },
                },
/*                {
                  name: "first_name",
                  label: "First Name",
                  options: {
                    filter: false,
                    sort: true,
                  },
                },
                {
                  name: "last_name",
                  label: "Last Name",
                  options: {
                    filter: false,
                    sort: false,
                  },
                },

 */
                {

                  name: "username",
                  label: "Username",
                  options: {
                    filter: false,
                    sort: false,
                  },
                },
                {
                  name: "email",
                  label: "Email",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },
                /*{
                    name: "phone_number",
                    label: "Phone Number",
                    options: {
                      filter: true,
                      sort: true,
                    },
                  },*/
                  {
                    name: "role",
                    label: "Role",
                    options: {
                      filter: true,
                      sort: true,
                    },
                  },
                {
                    name: "organization",
                    label: "Organization",
                    options: {
                        filter: true,
                        sort: true,
                    },
                },
                  {
                    name: "created_at",
                    label: "Created At",
                    options: {
                      filter: true,
                      sort: true,
                    },
                  },
                {
                  name: "status",
                  label: "Status",
                  options: {
                    filter: true,
                    sort: false,
                    customBodyRenderLite: function (dataI, rowI) {
                      return (
                        <Chip
                          avatar={
                            <Avatar>
                              {users.data[dataI].status.toLowerCase() === "enabled" ? (
                                <CheckCircle fontSize="small" />
                              ) : (
                                  <Block fontSize="small" />
                                )}
                            </Avatar>
                          }
                          variant="outlined"
                          color={
                            users.data[dataI].status.toLowerCase() === "enabled"
                              ? "primary"
                              : "default"
                          }
                          size="small"
                          label={Capitalize(users.data[dataI]?.status)}
                        />
                      );
                    },
                  },
                },
              ];
            
              const options = {
                filterType: "multiselect",
                elevation: 0,
                selectableRows: "single",
                searchPlaceholder: "Search user...",
                selectableRowsOnClick: true,
                fixedHeader: true,
                onCellClick: (cellData, cellMeta) => {
                  var user = users.data[cellMeta.dataIndex];
        
                },
                searchProps: {
                  variant: "outlined",
                  margin: "dense",
                },
                customSearch: (searchQuery, currentRow, columns) => {
            
                  console.log(searchQuery)
                  console.log(JSON.stringify(currentRow))
            
                },
                textLabels: {
                  body: {
                    noMatch: status,
                  },
                },
                customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                  <CustomUserToolbar
                    selectedRows={selectedRows}
                    displayData={displayData}
                    setSelectedRows={setSelectedRows}
                    toggleUser={()=>{}}
                    openEdit={()=>{}}
                    toggling={users.toggling}
                  />
                ),
              };
        
              // end table config

    return(
        <div className={classes.root}>
        {/* Dialogs starts here */}

        {/* ////////////////////////// */}
  
        <Dialog
          open={addNewOpen}
          maxWidth="sm"
          fullWidth
          onClose={() => {
            setAddNewOpen(false)
          }}
        >
          <DialogTitle id="new-op">
            Add New User
          </DialogTitle>
          <DialogContent>
              <Box>

              {/*    <Box style={{marginTop:10}}>
                      <TextField
                          required
                          size="small"
                          variant="outlined"
                          color="primary"
                          value={firstName.value}
                          placeholder={"First Name"}
                          label={"First Name"}
                          fullWidth
                          onChange={onFirstNameChange}
                          helperText={firstName.error}
                          error={firstName.error !== ""}
                      />
                  </Box>

                  <Box style={{marginTop:10}}>
                      <TextField
                          required
                          size="small"
                          variant="outlined"
                          color="primary"
                          value={lastName.value}
                          placeholder={"Last Name"}
                          label={"Last Name"}
                          fullWidth
                          onChange={onLastNameChange}
                          helperText={lastName.error}
                          error={lastName.error !== ""}
                      />
                  </Box>*/}

                  <Box style={{marginTop:10}}>
                      <TextField
                          required
                          size="small"
                          variant="outlined"
                          color="primary"
                          value={email.value}
                          placeholder={"Email"}
                          label={"Email Name"}
                          fullWidth
                          onChange={onEmailChange}
                          helperText={email.error}
                          error={email.error !== ""}
                      />
                  </Box>
           {/*       <Box style={{marginTop:10}}>
                      <TextField
                          required
                          size="small"
                          variant="outlined"
                          color="primary"
                          type={'text'}
                          value={phoneNumber.value}
                          placeholder={"Phone Number"}
                          label={"Phone Number"}
                          fullWidth
                          onChange={onPhoneChange}
                          helperText={phoneNumber.error}
                          error={phoneNumber.error !== ""}
                      />
                  </Box>*/}

              {/*    <Box style={{marginTop:10}}>
                      <TextField
                          required
                          size="small"
                          variant="outlined"
                          color="primary"
                          value={userName.value}
                          placeholder={"Username"}
                          label={"Username"}
                          fullWidth
                          onChange={onUsernameChange}
                          helperText={userName.error}
                          error={userName.error !== ""}
                      />
                  </Box>*/}

                {/*  <Box style={{marginTop:10}}>
                      <TextField
                          required
                          size="small"
                          variant="outlined"
                          color="primary"
                          type={'password'}
                          value={password.value}
                          placeholder={"Password"}
                          label={"Password"}
                          fullWidth
                          onChange={onPasswordChange}
                          helperText={password.error}
                          error={password.error !== ""}
                      />
                  </Box>*/}

                  <Box style={{marginTop: 10}}>
                      <FormControl
                          className={classes.formControl}
                          fullWidth
                          variant="outlined"
                          size="small"
                          error={userType.error !== ""}
                      >
                          <InputLabel id="type">
                              User Type
                          </InputLabel>
                          <Select
                              label={"User Type"}
                              value={userType.value}
                              onChange={onUserTypeChange}
                          >
                              <MenuItem value="SUPER_ADMIN">SUPER ADMIN</MenuItem>
                              {/*<MenuItem value="ORG_ADMIN">ORG ADMIN</MenuItem>*/}
                              {/*<MenuItem value="LICENSE_MANAGER">LICENSE MANAGER</MenuItem>*/}
                              {/*<MenuItem value="END_USER">END USER</MenuItem>*/}
                              <MenuItem value="CONTRACT_MANAGER">CONTRACT MANAGER</MenuItem>
                              <MenuItem value="LICENSE_OWNER">LICENSE OWNER</MenuItem>
                          </Select>
                          <FormHelperText>{userType.error}</FormHelperText>
                      </FormControl>
                  </Box>
                  {userType.value ==='LICENSE_OWNER'&&
                      <Box style={{marginTop: 10}}>
                          <Autocomplete
                              fullWidth
                              openOnFocus
                              options={departments}
                              getOptionLabel={(option) => option.name}
                              onChange={onDepartmentChange}
                              renderInput={(params) => (
                                  <TextField
                                      {...params}
                                      fullWidth
                                      label={"Department"}
                                      variant="outlined"
                                      size="small"
                                      helperText={department.error}
                                      error={department.error !== ""}
                                  />
                              )}
                          />
                      </Box>
                  }

                  <Box style={{marginTop: 10}}>
                      <Autocomplete
                          fullWidth
                          openOnFocus
                          options={allRoles}
                          getOptionLabel={(option) => option.name}
                          onChange={onRoleChange}
                          renderInput={(params) => (
                              <TextField
                                  {...params}
                                  fullWidth
                                  label={"Role"}
                                  variant="outlined"
                                  size="small"
                                  helperText={roleId.error}
                                  error={roleId.error !== ""}
                              />
                          )}
                      />
                  </Box>

                  <Box style={{marginTop: 10}}>
                      <Autocomplete
                          fullWidth
                          openOnFocus
                          options={orgs}
                          getOptionLabel={(option) => option.name}
                          onChange={onOrganizationChange}
                          renderInput={(params) => (
                              <TextField
                                  {...params}
                                  fullWidth
                                  label={"Organization"}
                                  variant="outlined"
                                  size="small"
                                  helperText={organizationId.error}
                                  error={organizationId.error !== ""}
                              />
                          )}
                      />
                  </Box>


              </Box>

          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                setAddNewOpen(false);
              }}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              disabled={users.saving}
              variant="contained"
              color="primary"
              onClick={()=>{
                  registerUser();
              }}
              disableElevation
            >
              {users.saving ? (
                <CircularProgress size={23} />
              ) : (
                "Save"
              )}
            </Button>
          </DialogActions>
        </Dialog>
  
        {/* Dialogs ends here */}
        <Box display="flex" style={{display: "flex"}}>
          <Box mr={2}>
            {" "}
            <PeopleAltOutlined color="primary" fontSize="large" />
          </Box>
          <Typography variant="h5" className={classes.title}>
            <b>Users</b>
          </Typography>
          <Button
            className={classes.btn}
            color="primary"
            variant="contained"
            size="medium"
            startIcon={<Add />}
            disableElevation
            onClick={() => {
             setAddNewOpen(true);
            }}
          >
            New User
          </Button>
        </Box>
        <Box style={{marginTop: 20}} />
  
        {users.loading && <LinearProgress />}
        <MUIDataTable
          title={"List of users"}
          data={users.data}
          columns={columns}
          options={options}
        />
      </div>
    );
}

function CustomUserToolbar(props) {
    const { toggleUser, displayData, selectedRows, openEdit } = props;
  
    var check = displayData[selectedRows?.data[0]?.index].data[5] === "ENABLED";
  
    return (
      <Box display="flex" alignItems="center">
        <FormControlLabel
          control={
            <Switch
              disabled={props.toggling}
              checked={check}
              onChange={() => {
                toggleUser(displayData[selectedRows?.data[0]?.index]?.data[0]);
              }}
              value="vertical"
              color="primary"
            />
          }
          label={check ? "Deactivate User" : "Activate User"}
        />
  
        <Button
          color="primary"
          variant="outlined"
          size="small"
          startIcon={<Edit />}
          onClick={() =>
            openEdit(displayData[selectedRows?.data[0]?.index]?.data[0])
          }
        >
          Edit
        </Button>
  

      </Box>
    );
  }

export default withLocalize(Users);