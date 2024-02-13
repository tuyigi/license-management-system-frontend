import React, { useState, useEffect, useCallback } from "react";
import { Container, Box } from "@material-ui/core";
import {
  Typography,
  AppBar,
  Toolbar,
  Link,
  CardActionArea,
  TextField,
  Button,
  Chip,
  Paper,
  FormControlLabel,
  IconButton,
  Avatar,
  Tooltip,
  Switch,Input
} from "@material-ui/core";
import {
  CircularProgress,
  Grid,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  LinearProgress,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  FormControl,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,Popover,Checkbox,Divider
} from "@material-ui/core";
import {
  DesktopMac,
  Add,
  FilterList,
  CheckCircle,
  Block,
  AccountCircle,
  Close,
  Edit,
  Delete,BusinessCenter,
  SubdirectoryArrowLeftOutlined,
} from "@material-ui/icons";
import { withLocalize, Translate } from "react-localize-redux";
import { useHistory } from "react-router-dom";
import { useRoles, useOrganizations,useOperators } from "../hooks/use_hooks";

import MUIDataTable from "mui-datatables";
import MaskedInput from "react-text-mask";

import { makeStyles } from "@material-ui/styles";
import { AdminService, Validator ,ReportingService} from "./../../../utils/web_config";
import { useSnackbar } from "notistack";
import Empty from "../../../assets/svg/empty.svg";
import { Skeleton, Autocomplete, Pagination } from "@material-ui/lab";

const axios = require("axios");

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

function MaskedNID(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        /\d/,
        " ",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        " ",
        /\d/,
        " ",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        " ",
        /\d/,
        " ",
        /\d/,
        /\d/,
      ]}
      placeholderChar={"\u2000"}
      showMask={false}
      keepCharPositions={true}
    />
  );
}


function SystemUsers(props) {
  const classes = useStyles();
  const history = useHistory();

  const orgs = useOrganizations();
  const ops = useOperators();

  const allRoles = useRoles();
  const [accountData, setAccountData] = useState({});

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

  const [status, setStatus] = useState("Loading users....");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [roles, setRoles] = useState([]);

  const [agentEditMode, setAgentEditMode] = useState({
    status: false,
    suspend: false,
  });

  const [id, setId] = useState({ value: "", error: "" });
  const [idData, setIdData] = useState({
    loading: false,
    saving: false,
    open: false,
  });

  const [operators, setOperators] = useState({
    saving: false,
    loadfing: false,
    open:false,
    page: 0,
    pages: 1,
    count: 20,
    per_page: 20,
    data: [],
  });

  const [firstName, setFirstName] = useState({ value: "", error: "" });
  const [lastName, setLastName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [username, setUsername] = useState({ value: "", error: "" });
  const [phone, setPhone] = useState({ value: "", error: "" });
  const [NID, setNid] = useState({ value: "", error: "" });
  const [gender, setGender] = useState({ value: "", error: "" });
  const [type, setType] = useState({ value: "", error: "" });
  //const [password, setPassword] = useState({ value: "", error: "" });

  const [organization, setOrganization] = useState({ value: {}, error: "" });
  const [role, setRole] = useState({
    value: "",
    error: "",
  });

  const [selectedAgent, setSelectedAgent] = useState({
    saving: false,
    loading: false,
    data: {},
  });

  const [warning, setWarning] = useState({ open: false });
  const [anchorAssign, setAnchorAssign] = useState(null);
  const [tempAssign, setTempAssign] = useState({ data: [] });


  useEffect(() => {
    var accountData = new AdminService().accountData;
    setAccountData(accountData);

    getUsers(accountData.token, accountData.organization?.organization_id);
   
  }, []);

  const onIdChange = (event) => {
    if (event.target.value === "") {
      setId({ value: "", error: "Enter ID number to continue" });
    } else {
      setId({ value: event.target.value, error: "" });
    }
  };


  const onSearchClick = () => {
    if (id.value === "") {
      setId({ value: "", error: "Enter ID number to continue." });
    } else {
      getIDInfo();
    }
  };

   ///////////////////////////////////

   const getIDInfo = () => {
    const createInstance = axios.create(
      new AdminService().getHeaders(accountData.token)
    );

    setIdData({ ...idData, loading: true });
    const data = {
      document_number: id.value,
    };

    createInstance
      .post(new ReportingService().NIDA_DOCUMENT, data)
      .then(function (response) {
        setIdData({ ...idData, loading: false });

        const d = response.data;

        if (d.data?.applicationNumber == null) {
          notify("error", "Your ID number is not found");
        } else {
          setFirstName({ value: d.data.foreName, error: "" });
          setLastName({ value: d.data.surnames, error: "" });
          setNid({value:d.data.documentNumber,error:''})
          
          setIdData({ ...idData, loading: false, data: d.data, open: false});
          setAddNewOpen(true)
        }
      })
      .catch(function (error) {
        setIdData({ ...idData, loading: false });

        var e = error.message;
        if (error.response) {
          e = error.response.data.message;
        }

        notify(error?.response?.status==404?"info":"error", e, error?.response?.status);
      });
  };

  ///////////////////////////////////


  const onFirstNameChange = (event) => {
    if (event.target.value === "") {
      setFirstName({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_first_name")}
          </Translate>
        ),
      });
    } else {
      setFirstName({ value: event.target.value, error: "" });
    }
  };
  const onLastNameChange = (event) => {
    if (event.target.value === "") {
      setLastName({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_last_name")}
          </Translate>
        ),
      });
    } else {
      setLastName({ value: event.target.value, error: "" });
    }
  };
  const onEmailChange = (event) => {
    if (event.target.value === "") {
      setEmail({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_email")}
          </Translate>
        ),
      });
    } else {
      setEmail({ value: event.target.value, error: "" });
    }
  };
  const onUsernameChange = (event) => {
    if (event.target.value === "") {
      setUsername({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_username")}
          </Translate>
        ),
      });
    } else {
      var u = event.target.value;

      setUsername({ value: u, error: "" });
    }
  };
  const onPhoneChange = (event) => {
    if (event.target.value === "") {
      setPhone({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_phone")}
          </Translate>
        ),
      });
    } else {
      setPhone({ value: event.target.value, error: "" });
    }
  };
  const onNidChange = (event) => {
    if (event.target.value === "") {
      setNid({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_nid")}
          </Translate>
        ),
      });
    } else {
      setNid({ value: event.target.value, error: "" });
    }
  };
  const onGenderChange = (event) => {
    if (event.target.value === "") {
      setGender({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_gender")}
          </Translate>
        ),
      });
    } else {
      setGender({ value: event.target.value, error: "" });
    }
  };
  const onTypeChange = (event) => {
    if (event.target.value === "") {
      setType({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_type")}
          </Translate>
        ),
      });
    } else {
      setType({ value: event.target.value, error: "" });
    }
  };
  // const onPasswordChange = (event) => {
  //   if (event.target.value === "") {
  //     setPassword({
  //       value: "",
  //       error: (
  //         <Translate>
  //           {({ translate }) => translate("users.forms.hints.user_password")}
  //         </Translate>
  //       ),
  //     });
  //   } else {
  //     setPassword({ value: event.target.value, error: "" });
  //   }
  // };


  const onOrganizationChange = (event, v) => {
    if (v.organization_id == null) {
      setOrganization({
        value: {},
        error: (
          <Translate>
            {({ translate }) =>
              translate("roles.forms.hints.role_organization")
            }
          </Translate>
        ),
      });
    } else {
      const temp = allRoles.filter(
        (obj) => obj.organization_id == v.organization_id
      );

      setOrganization({ value: v, error: "" });

      if (temp.length == 0) {
        setRoles([]);
        setOrganization({
          value: v,
          error:
            "This organization does not have any role,create one in roles privileges",
        });
      } else {
        setRoles(temp);
      }
    }
  };

  const onRoleChange = (event) => {
    if (event.target.value === "") {
      setRole({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_role")}
          </Translate>
        ),
      });
    } else {
      setRole({ value: event.target.value, error: "" });
    }
  };

  ////////

  const onRegisterClick = () => {
    if (firstName.value === "") {
      setFirstName({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_first_name")}
          </Translate>
        ),
      });
    } else if (new Validator().tooShort(firstName.value)) {
      setFirstName({
        value: firstName.value,
        error: (
          <Translate>
            {({ translate }) =>
              translate("users.forms.hints.user_first_name_short")
            }
          </Translate>
        ),
      });
    } else if (lastName.value === "") {
      setLastName({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_last_name")}
          </Translate>
        ),
      });
    } else if (new Validator().tooShort(lastName.value)) {
      setLastName({
        value: lastName.value,
        error: (
          <Translate>
            {({ translate }) =>
              translate("users.forms.hints.user_last_name_short")
            }
          </Translate>
        ),
      });
    } else if (email.value === "") {
      setEmail({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_email")}
          </Translate>
        ),
      });
    } else if (!new Validator().validEmail(email.value)) {
      setEmail({
        value: email.value,
        error: (
          <Translate>
            {({ translate }) =>
              translate("users.forms.hints.user_email_invalid")
            }
          </Translate>
        ),
      });
    } else if (username.value === "" && !agentEditMode.status) {
      setUsername({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_username")}
          </Translate>
        ),
      });
    } else if (
      new Validator().tooShort(username.value) &&
      !agentEditMode.status
    ) {
      setUsername({
        value: username.value,
        error: (
          <Translate>
            {({ translate }) =>
              translate("users.forms.hints.user_username_short")
            }
          </Translate>
        ),
      });
    } else if (
      !new Validator().validUsername(username.value) &&
      !agentEditMode.status
    ) {
      setUsername({
        value: username.value,
        error: (
          <Translate>
            {({ translate }) =>
              translate("users.forms.hints.user_username_invalid")
            }
          </Translate>
        ),
      });
    } else if (phone.value === "") {
      setPhone({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_phone")}
          </Translate>
        ),
      });
    } else if (NID.value === "") {
      setNid({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_nid")}
          </Translate>
        ),
      });
    } else if (gender.value === "") {
      setGender({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_gender")}
          </Translate>
        ),
      });
    } else if (type.value === "" && !agentEditMode.status) {
      setType({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_type")}
          </Translate>
        ),
      });
    }
    //  else if (password.value === "" && !agentEditMode.status) {
    //   setPassword({
    //     value: "",
    //     error: (
    //       <Translate>
    //         {({ translate }) => translate("users.forms.hints.user_password")}
    //       </Translate>
    //     ),
    //   });
    // } 
    else if (organization.value.organization_id == null && !agentEditMode.status) {
      setOrganization({
        value: "",
        error: (
          <Translate>
            {({ translate }) =>
              translate("roles.forms.hints.role_organization")
            }
          </Translate>
        ),
      });
    } else if (role.value === "") {
      setRole({
        value: "",
        error: (
          <Translate>
            {({ translate }) => translate("users.forms.hints.user_role")}
          </Translate>
        ),
      });
    }

    else {
      createUser();
    }
  };

  ////////////////////////

  /////////////
  const toggleUser = (id) => {
    const assInstance = axios.create(
      new AdminService().getHeaders(accountData.token)
    );

    const user = users.data.filter((obj) => obj.user_id == id)[0];
    const i = users.data.indexOf(user);

    var url =
      user.user_status == "ENABLED"
        ? new AdminService().DEACTIVATE_USER + id
        : new AdminService().REACTIVATE_USER + id;

    user["user_status"] =
      user.user_status == "ENABLED" ? "DISABLED" : "ENABLED";

    console.log("togglinguser.....");

    setUsers({ ...users, toggling: true });

    assInstance
      .put(url)
      .then(function (response) {
        const d = response.data;

        user["status2"] = user.user_status;

        const usrs = users.data;
        usrs[i] = user;
        setUsers({ ...users, data: usrs, toggling: false });

        notify("success", d.data);
      })
      .catch(function (error) {
        user["user_status"] =
          user.user_status == "ENABLED" ? "DISABLED" : "ENABLED";

        user["status2"] = user.user_status;

        const usrs = users.data;
        users[i] = user;
        setUsers({ ...users, data: usrs, toggling: false });

        var e = error.message;

        if (error.response) {
          e = error.response.data.message;
        }
        notify(error?.response?.status==404?"info":"error", e, error?.response?.status);
      });
  };
  ////////////////////////////////
  //////////////
  const showUserEdit = (id) => {
    setAddNewOpen(true);
    setAgentEditMode({ ...agentEditMode, status: true, id: id });

    const user = users.data.filter((obj) => obj.user_id == id)[0];
    const i = users.data.indexOf(user);

    setRoles(allRoles.filter((obj) => obj.organization_id == user.role_id));

    setFirstName({ ...firstName, value: user.user_first_name });
    setLastName({ ...lastName, value: user.user_last_name });
    setEmail({ ...email, value: user.user_email });
    setGender({ ...gender, value: user.user_gender });
    setPhone({ ...phone, value: user.user_phone });
    setNid({ ...NID, value: user.user_nid });
    setType({ ...type, value: user.user_type });
    setOrganization({ ...organization, value: orgs?.filter((obj) => obj.organization_id == user.organization_id)[0] });

    setRole({ ...role, value: user.role_id });

  
  };

  const updateUser = (data) => {
    const updateInstance = axios.create(
      new AdminService().getHeaders(accountData.token)
    );

    setUsers({ ...users, saving: true });

    updateInstance
      .put(new AdminService().UPDATE_USER + agentEditMode.id, data)
      .then(function (response) {
        setUsers({ ...users, saving: false });
        var d = response.data;

        var usrs = users.data;

        const user = users.data.filter(
          (obj) => obj.user_id == agentEditMode.id
        )[0];
        const j = users.data.indexOf(user);

        const newUser = d.data;

        newUser["status2"] = newUser.user_status;
        newUser["user_name"] =
          newUser.user_first_name + " " + newUser.user_last_name;

        usrs[j] = newUser;

        setUsers({
          ...users,
          data: usrs,
        });

        clearUserInfo();
        notify("success", response.data.message);

        setAgentEditMode({ status: false });
        setAddNewOpen(false);
      })
      .catch(function (error) {
        setUsers({ ...users, saving: false });
        var e = error.message;

        if (error.response) {
          e = error.response.data.message;
        }
        notify(error?.response?.status==404?"info":"error", e, error?.response?.status);
      });
  };

  const columns = [
    {
      name: "user_id",
      label: "User id",
      options: {
        filter: false,
        sort: false,
        display: 'excluded',
      },
    },
    {
      name: "user_names",
      label: "User name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "user_phone",
      label: "Phone",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "user_email",
      label: "Email",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "user_gender",
      label: "Gender",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "user_type",
      label: "User type",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "user_name",
      label: "Username",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "status2",
      label: "Status2",
      options: {
        filter: false,
        sort: false,
        display: 'excluded',
      },
    },
    {
      name: "user_status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        customBodyRenderLite: function (dataI, rowI) {
          return (
            <Chip
              avatar={
                <Avatar>
                  {users.data[dataI].user_status.toLowerCase() == "enabled" ? (
                    <CheckCircle fontSize="small" />
                  ) : (
                      <Block fontSize="small" />
                    )}
                </Avatar>
              }
              variant="outlined"
              color={
                users.data[dataI].user_status.toLowerCase() == "enabled"
                  ? "primary"
                  : "default"
              }
              size="small"
              label={capitalize(users.data[dataI]?.user_status)}
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
    // serverSide:true,
    // count:20,
    // rowsPerPage:10,
    onCellClick: (cellData, cellMeta) => {
      var user = users.data[cellMeta.dataIndex];

      if(user==null){
        return
      }
      getOperators(accountData.token,user.user_id)
      setSelectedAgent({...selectedAgent,data:user,open:true})
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
      <CustomUsersToolbar
        selectedRows={selectedRows}
        displayData={displayData}
        setSelectedRows={setSelectedRows}
        toggleUser={toggleUser}
        openEdit={showUserEdit}
        toggling={users.toggling}
      />
    ),
  };

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

  const capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };
  ///////////////////////////////////

  const getUsers = (token, id) => {
    const usersInstance = axios.create(new AdminService().getHeaders(token));

    setUsers({ ...users, loading: true });

    usersInstance
      .get(new AdminService().GET_USERS_BY_TYPE+'ORG_USER?size=10000')
      .then(function (response) {
        setUsers({ ...users, loading: false });

        const d = response.data;

        if (d.data.length == 0) {
          setStatus("There are no users available.");
        } else {
          var usrs = [];

          d.data.forEach((u, i) => {
            const newUser = u;
            newUser["status2"] = u.user_status;
            newUser["user_names"] = u.user_first_name + " " + u.user_last_name;

            usrs.push(u);
          });

          setUsers({
            ...users,
            data: usrs,
          });
          //set status
          setStatus("Users loaded")
        }
      })
      .catch(function (error) {
        setUsers({ ...users, loading: false });
        var e = error.message;

        if (error.response) {
          e = error.response.data.message;
        }
        setStatus(e);

        notify(error?.response?.status==404?"info":"error", e, error?.response?.status);
      });
  };

  ////////////////

  const clearUserInfo = () => {
    setRole({ value: "", error: "" });
    setEmail({ value: "", error: "" });
    setFirstName({ value: "", error: "" });
    setLastName({ value: "", error: "" });
    setUsername({ value: "", error: "" });
    setNid({ value: "", error: "" });
   //setPassword({ value: "", error: "" });
    setPhone({ value: "", error: "" });
    setType({ value: "", error: "" });
  };

  const createUser = () => {
    const createInstance = axios.create(
      new AdminService().getHeaders(accountData.token)
    );
    setUsers({ ...users, saving: true });

    const data = {
      organization_id: organization.value.organization_id,
      role_id: role.value,
      user_email: email.value,
      user_first_name: firstName.value,
      user_gender: gender.value,
      user_last_name: lastName.value,
      user_name: username.value,
      user_nid: NID.value,
     // user_password: password.value,
      user_phone: phone.value,

      user_type: type.value,
    };

    if (agentEditMode.status) {
      updateUser(data);
      return;
    }

    createInstance
      .post(new AdminService().CREATE_USER, data)
      .then(function (response) {
        setUsers({ ...users, saving: false });
        var d = response.data;

        var usrs = users.data;

        const newUser = d.data;
        newUser["status2"] = newUser.user_status;
        newUser["user_name"] =
          d.data.user_first_name + " " + d.data.user_last_name;

        usrs.unshift(newUser);
        
        setUsers({
          ...users,
          data: usrs,
        });

        clearUserInfo();
        notify("success", response.data.message);

        setAddNewOpen(false);
      })
      .catch(function (error) {
        setUsers({ ...users, saving: false });
        var e = error.message;

        if (error.response) {
          e = error.response.data.message;
        }

        notify(error?.response?.status==404?"info":"error", e, error?.response?.status);
      });
  };


     ////////////

     const getOperators = (token,id, p = 0) => {
      const usersInstance = axios.create(new AdminService().getHeaders(token));
      setOperators({ ...operators, loading: true, page: p });
  
      console.log("getting operators.....");
  
      usersInstance
        .get(
          new AdminService().GET_USER_ALLOWED_OPERATORS+
          id+
          "?page=" +
          p +
          "&size=" +
          operators.per_page
        )
        .then(function (response) {
          setOperators({ ...operators, loading: false });
  
          const d = response.data;
  
          setOperators({
            ...operators,
            data: d.data,
            page: d.current_page,
            count: d.total_items,
            pages: d.total_pages,
          });
        })
        .catch(function (error) {
          setOperators({ ...operators, loading: false });
  
          var e = error.message;
          if (error.response) {
            e = error.response.data.message;
          }
  
          notify(error?.response?.status==404?"info":"error", e, error?.response?.status);
        });
    };

     ////////////////////////////

     const assignOperator = (ogs) => {
      const privInstance = axios.create(
        new AdminService().getHeaders(accountData.token)
      );
  
      setOperators({...operators,loading:true})
  
      console.log("Assigning privilege .....");
      setAnchorAssign(null);
  
      const data = {
        "organization_id": ogs,
        "user_id": selectedAgent.data.user_id
      }
  
      const url = new AdminService().ASSIGN_OPERATORS_TO_USER;
      privInstance
        .post(url, data)
        .then(function (response) {
          setOperators({...operators,loading:false})
  
          const d = response.data;
  
          getOperators(accountData.token, selectedAgent.data.user_id);
         
          notify("success", d.message);
        })
        .catch(function (error) {
          setOperators({...operators,loading:false})
          var e = error.message;
  
          if (error.response) {
            e = error.response.data.message;
          }
  
          notify(error?.response?.status==404?"info":"error", e, error?.response?.status);
        });
    };


      //////////////////////////
  const removeOperator = () => {
    const roleInstance = axios.create(
      new AdminService().getHeaders(accountData.token)
    );

    console.log("Removing.....");

    const url = new AdminService().REMOVE_ONE_USER_ALLOWED_OPERATOR_RECORD + warning.allowed;
    roleInstance
      .delete(url)
      .then(function (response) {
        const d = response.data;

        operators.data.splice(warning.index, 1);
        setOperators({...operators});
      
        notify("success", d.message);
      })
      .catch(function (error) {
        var e = error.message;

        if (error.response) {
          e = error.response.data.message;
        }
        notify(error?.response?.status==404?"info":"error", e, error?.response?.status);
      });
  };

  return (
    <div className={classes.root}>
      {/* Dialogs starts here */}
 {/* Dialogs starts here */}
 <Dialog
        open={warning.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Warning"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to remove this operator from this global agent, he won't transact for this operator anymore.
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
              removeOperator();
              setWarning({ ...warning, open: false });
            }}
            color="primary"
            autoFocus
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
      {/* /////////////////// */}
      <Popover
        id={"pop-id-2"}
        style={{minWidth:200}}
        open={anchorAssign != null}
        anchorEl={anchorAssign}
        onClose={() => {
          setAnchorAssign(null);
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

        {tempAssign.data.length != 0 && (
          <Box
            display="flex"
            justifyContent="center"
            p={2}
            mb={4}
            width={"250px"}
            style={{ position: "fixed", zIndex: 100, bottom: 0 }}
          >
            <Button
              color="primary"
              size="large"
              variant="contained"
              onClick={() => assignOperator(tempAssign.data)}
            >
              Assign all {"(" + tempAssign.data.length + ")"}
            </Button>
          </Box>
        )}

        <List>
          <ListItem key="987hh">
            <ListItemIcon>
              <Checkbox
              disabled={ops?.data==null}
                color="primary"
                checked={tempAssign.all}
                onChange={(e) => {
                  var d = tempAssign.data;

                  if (e.target.checked) {
                    ops.data.forEach((o, i) => {
                      d.push(o.organization_id);
                    });

                    setTempAssign({
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
          {ops?.data!=null!=null
            ? ops?.data?.map((org, i) => (
              <>
                {i != 0 && i != ops?.data.length && (
                  <Divider variant="middle" />
                )}
                <ListItem
                  key={i}
                  dense
                  selected={tempAssign.data.includes(org.organization_id)}
                >
                  <ListItemIcon>
                    <Checkbox
                      color="primary"
                      checked={tempAssign.data.includes(org.organization_id)}
                      onChange={(e) => {
                        var d = tempAssign.data;

                        if (e.target.checked) {
                          d.push(org.organization_id);
                          setTempAssign({
                            
                            data: d,
                          });
                        } else {
                          const i2 = d.indexOf(org.organization_id);

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
                    primary={org.name}
                    secondary={org.organization_type}
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
                <img src={Empty} alt="Empty data" height={200} />
              </Box>
              <Typography color="textSecondary">
                There are no operators at the moment.
                </Typography>
            </Box>}
        </List>
      </Popover>
    {/* //////////////////////// */}
          {/* ////////////////////////// */}

          <Dialog
        open={selectedAgent.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={() => setSelectedAgent({ ...selectedAgent, open: false })}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">
          {selectedAgent.data.user_first_name +
            " " +
            selectedAgent.data.user_last_name}{" "}
          
        </DialogTitle>
        <DialogContent>
          
              <Box display="flex" justifyContent="center" mt={2}>
                <Button color='primary' variant='outlined' onClick={(e)=>setAnchorAssign(e.currentTarget)}> Assign operators</Button>
              </Box>
              {!operators.loading && operators.data.length == 0 && <Box
              p={2}
              mt={3}
              height={1}
              display="flex"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
            >
              <Box mt={2}>
                <img src={Empty} alt="Empty data" height={100} />
              </Box>
              <Typography color="textSecondary">
                There are no assigned oparators to this agent at the moment.
                </Typography>
            </Box>}
           <Box p={2}> <Typography gutterBottom>
                List of assigned operators to this agent.
                </Typography>
                </Box>
            <List>
              {!operators.loading
                ? operators.data.map((op, i) => (
                  <ListItem
                    key={i}
                    button
                    // selected={selectedRole.index == i}
                    // onClick={() => {
                    //   setSelectedRole({ index: i, role: role });
                    //   getPrivileges(accountData.token, role.role_id);
                    // }}
                  >
                    <ListItemIcon>
                      <BusinessCenter />
                    </ListItemIcon>
                    <ListItemText primary={op.organization.name} />
                    <ListItemSecondaryAction>
                              <IconButton
                                  onClick={(e) =>
                                    setWarning({
                                      op: op,
                                      allowed: op.user_allowed_operator_id,
                                      open: true,
                                      index: i,
                                    })
                                 }
                                  size="small"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
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

        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedAgent({ ...selectedAgent, open: false });
            }}
            color="primary"
          >
            Close dialog
          </Button>
        </DialogActions>
      </Dialog>
       {/* //////////////////////// */}

      <Dialog
        open={idData.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='sm'
        fullWidth
        onClose={()=>setIdData({...idData,open:false})}
      >
        <DialogTitle id="alert-dialog-title">{"User ID number"}</DialogTitle>
        <DialogContent>
        <Box
              mb={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
            <Typography color="textSecondary" align="center">
              Enter user national identification number for verification
            </Typography>
          </Box>
          <Box mt={2}>
            <FormControl fullWidth error={id.error != ""}>
              <InputLabel htmlFor="formatted-code" size="small">
                National ID number
              </InputLabel>
              <Input
                onChange={onIdChange}
                value={id.value}
                color="primary"
                varient="outlined"
                inputComponent={MaskedNID}
                placeholder="Enter your ID number here"
              />
              <FormHelperText id="code">{id.error}</FormHelperText>
            </FormControl>
          </Box>
          <Box mt={2} width={1} diaplay='flex' justifyContent='center'><Button color='primary' className={classes.btn} onClick={()=>{
            setIdData({loading:false,saving:false,Open:false})
            setAddNewOpen(true)
          }}>Continue manually?</Button></Box>
        </DialogContent>
        <DialogActions>
          <Button 
           variant='outlined'
          onClick={() => {
            setIdData({...idData,open:false})
           
          }} color="primary">
            Cancel
          </Button>
          <Button 
          variant='contained'
          disableElevation
          disabled={idData.loading}
          onClick={() => {
            onSearchClick()
          }} color="primary" autoFocus>
            {idData.loading ? <CircularProgress size={23} /> : "Continue"}
          </Button>
        </DialogActions>
      </Dialog>

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
          <Translate id="users.forms.dialog_title" />
        </DialogTitle>
        <DialogContent>
          {idData.data!=null&&
            <Box display="flex" width={1} justifyContent="center">
            <img
              style={{ height: 110, width: 90 }}
              src={"data:image/jpg;base64," + idData?.data?.photo}
              alt="Person"
            />
          </Box>
          }
          <Box mt={2}>
            <Translate>
              {({ translate }) => (
                <TextField
                  required
                  size="small"
                  variant="outlined"
                  color="primary"
                  value={firstName.value}
                  placeholder={translate("users.forms.hints.user_first_name")}
                  label={<Translate id="users.forms.labels.user_first_name" />}
                  fullWidth
                  onChange={onFirstNameChange}
                  helperText={firstName.error}
                  error={firstName.error !== ""}
                />
              )}
            </Translate>
          </Box>
          <Box mt={2}>
            <Translate>
              {({ translate }) => (
                <TextField
                  size="small"
                  variant="outlined"
                  color="primary"
                  value={lastName.value}
                  placeholder={translate("users.forms.hints.user_last_name")}
                  label={<Translate id="users.forms.labels.user_last_name" />}
                  fullWidth
                  onChange={onLastNameChange}
                  helperText={lastName.error}
                  error={lastName.error !== ""}
                />
              )}
            </Translate>
          </Box>
          <Box mt={2}>
            <Translate>
              {({ translate }) => (
                <TextField
                  size="small"
                  variant="outlined"
                  color="primary"
                  value={email.value}
                  placeholder={translate("users.forms.hints.user_email")}
                  label={<Translate id="users.forms.labels.user_email" />}
                  fullWidth
                  onChange={onEmailChange}
                  helperText={email.error}
                  error={email.error !== ""}
                />
              )}
            </Translate>
          </Box>
          {!agentEditMode.status && <Box mt={2}>
            <Translate>
              {({ translate }) => (
                <TextField
                  size="small"
                  variant="outlined"
                  color="primary"
                  value={username.value}
                  placeholder={translate("users.forms.hints.user_username")}
                  label={<Translate id="users.forms.labels.user_username" />}
                  fullWidth
                  disabled={agentEditMode.status}
                  onChange={onUsernameChange}
                  helperText={username.error}
                  error={username.error !== ""}
                />
              )}
            </Translate>
          </Box>}
          <Box mt={2}>
            <Translate>
              {({ translate }) => (
                <TextField
                  size="small"
                  variant="outlined"
                  color="primary"
                  value={phone.value}
                  placeholder={translate("users.forms.hints.user_phone")}
                  label={<Translate id="users.forms.labels.user_phone" />}
                  fullWidth
                  onChange={onPhoneChange}
                  helperText={phone.error}
                  error={phone.error !== ""}
                />
              )}
            </Translate>
          </Box>
          <Box mt={2}>
            <Translate>
              {({ translate }) => (
                <TextField
                  size="small"
                  variant="outlined"
                  color="primary"
                  value={NID.value}
                  placeholder={translate("users.forms.hints.user_nid")}
                  label={<Translate id="users.forms.labels.user_nid" />}
                  fullWidth
                  onChange={onNidChange}
                  helperText={NID.error}
                  error={NID.error !== ""}
                />
              )}
            </Translate>
          </Box>

          <Box mt={2}>
            <FormControl
              className={classes.formControl}
              fullWidth
              variant="outlined"
              size="small"
              error={type.error !== ""}
            >
              <InputLabel id="type">
                <Translate id="users.forms.labels.user_gender" />
              </InputLabel>
              <Select
                label={<Translate id="users.forms.labels.user_gender" />}
                value={gender.value}
                onChange={onGenderChange}
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
              </Select>
              <FormHelperText>{gender.error}</FormHelperText>
            </FormControl>
          </Box>

          <Box mt={2}>
            <FormControl
              className={classes.formControl}
              fullWidth
              variant="outlined"
              size="small"
              disabled={agentEditMode.status}
              error={type.error !== ""}
            >
              <InputLabel id="type">
                <Translate id="users.forms.labels.user_type" />
              </InputLabel>
              <Select
                label={<Translate id="users.forms.labels.user_type" />}
                value={type.value}
                onChange={onTypeChange}
              >
                <MenuItem value="ORG_USER">Organization user</MenuItem>
                <MenuItem value="POS_USER">POS user</MenuItem>
                <MenuItem value="WALLET_USER">Wallet user</MenuItem>
                <MenuItem value="INTEGRATION_USER">Integration user</MenuItem>
                <MenuItem value="INTEGRATION_AGENT">Integration agent</MenuItem>
                <MenuItem value="POS_AGENT">POS Agent</MenuItem>
                <MenuItem value="VEHICLE_OWNER">Vehicle owner</MenuItem>
              </Select>
              <FormHelperText>{type.error}</FormHelperText>
            </FormControl>
          </Box>
          {/* {
            !agentEditMode.status && <Box mt={2}>
              <Translate>
                {({ translate }) => (
                  <TextField
                    type="password"
                    size="small"
                    variant="outlined"
                    color="primary"
                    value={password.value}
                    placeholder={translate("users.forms.hints.user_password")}
                    label={<Translate id="users.forms.labels.user_password" />}
                    fullWidth
                    disabled={agentEditMode.status}
                    onChange={onPasswordChange}
                    helperText={password.error}
                    error={password.error !== ""}
                  />
                )}
              </Translate>
            </Box>} */}

          {/* <Box mt={2}>
            <FormControl
              className={classes.formControl}
              fullWidth
              variant="outlined"
              size="small"
              error={organization.error !== ""}
            >
              <InputLabel id="type">
                <Translate id="roles.forms.labels.role_organization" />
              </InputLabel>
              <Select
                label={<Translate id="roles.forms.labels.role_organization" />}
                value={organization.value}
                onChange={onOrganizationChange}
              >
                {orgs.map((org, i) => (
                  <MenuItem value={org.organization_id}>{org.name}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{organization.error}</FormHelperText>
            </FormControl>
          </Box> */}

          {!agentEditMode.status && <Box mt={2}>
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
                  label={
                    <Translate id="roles.forms.labels.role_organization" />
                  }
                  variant="outlined"
                  size="small"
                  helperText={organization.error}
                  error={organization.error !== ""}
                />
              )}
            />
          </Box>}

          {!agentEditMode.status && <Box mt={2}>
            <FormControl
              className={classes.formControl}
              fullWidth
              variant="outlined"
              size="small"
              error={role.error !== ""}
              disabled={organization?.value?.organization_id == null}
            >
              <InputLabel id="type">
                <Translate id="users.forms.labels.user_role" />
              </InputLabel>
              <Select
                label={<Translate id="users.forms.labels.user_role" />}
                value={role.value}
                onChange={onRoleChange}
              >
                {roles.map((rl, i) => (
                  <MenuItem value={rl.role_id}>{rl.name}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{role.error}</FormHelperText>
            </FormControl>
          </Box>}


        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              clearUserInfo();
              setAddNewOpen(false);
              setIdData({loading:false,saving:false,Open:false})
              setAgentEditMode({ ...agentEditMode, status: false })
            }}
            variant="outlined"
            color="primary"
          >
            <Translate id="users.forms.buttons.cancel" />
          </Button>
          <Button
            disabled={users.saving}
            variant="contained"
            color="primary"
            onClick={onRegisterClick}
            disableElevation
          >
            {users.saving ? (
              <CircularProgress size={23} />
            ) : agentEditMode.status ? (
              "Save"
            ) : (
                  <Translate id="users.forms.buttons.register" />
                )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogs ends here */}
      <Box display="flex">
        <Box mr={2}>
          {" "}
          <AccountCircle color="primary" fontSize="large" />
        </Box>
        <Typography variant="h5" className={classes.title}>
          <b>System users</b>
        </Typography>
        <Button
          className={classes.btn}
          color="primary"
          variant="contained"
          size="medium"
          startIcon={<Add />}
          disableElevation
          onClick={() => {
            setIdData({...idData,open:true})
          }}
        >
          New user
        </Button>
      </Box>
      <Box mt={3} />

      {users.loading && <LinearProgress />}
      <MUIDataTable
        title={"List of system users"}
        data={users.data}
        columns={columns}
        options={options}
      />
    </div>
  );
}

function CustomUsersToolbar(props) {
  const { toggleUser, displayData, selectedRows, openEdit } = props;

  var check = displayData[selectedRows?.data[0]?.index].data[5] == "ENABLED";

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
        label={check ? "Deactivate user" : "Activate user"}
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

      <Box mr={2} ml={2}>
        <Button
          color="primary"
          variant="outlined"
          size="small"
          startIcon={<Delete />}
        // onClick={() =>
        //   openEdit(displayData[selectedRows?.data[0]?.index]?.data[0])
        // }
        >
          Suspend
        </Button>
      </Box>
    </Box>
  );
}
export default withLocalize(SystemUsers);
