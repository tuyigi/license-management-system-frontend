import React,{useState,useEffect} from "react";
import {withLocalize, Translate} from "react-localize-redux";
import {makeStyles} from "@material-ui/styles";
import {
    Typography,
    TextField,
    Button,
    Chip,
    FormControlLabel,
    Avatar,
    Switch,
    Box,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Grid,
    Popover,
    List,
    ListItem,
    ListItemIcon, ListItemText
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
    Receipt, Close, LocationCity, MoreVert, Assessment, Payment
  } from "@material-ui/icons";
  import MUIDataTable from "mui-datatables";
  import { Capitalize } from "../../helpers/capitalize";
  import axios from "axios";
  import {BackendService} from "../../utils/web_config";
  import {useSnackbar} from "notistack";
  import {useHistory} from "react-router-dom";
import {id} from "date-fns/locale";
import {Autocomplete} from "@material-ui/lab";
import {useDepartments, useEnabledVendors, useSystemTools, useVendorLicense} from "../../hooks/use_hooks";
import {format} from "date-fns/esm";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';


const useStyles = makeStyles((theme) => ({
    root: {flexGrow: 1, [theme.breakpoints.up("sm")]: {marginLeft: 250,},},
    title: {flexGrow: 1,},
    btn: {textTransform: "capitalize",},
    btn2: {textTransform: "capitalize", border: "dashed grey 1px",},
    paper: {padding: 15,},
    action: {borderRadius: 15,},
}));

function Licenses(props) {
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();
    const vendors =useEnabledVendors();
    const systemTools = useSystemTools();
    const departments = useDepartments();
    const [paymentFrequency, setPaymentFrequency] = useState({value: "", error: ""});
    const [annualLicenseFees, setAnnualLicenseFees] = useState({value: "", error: ""});
    const [startDate, setStartDate] = useState({ value: format(new Date(),["yyyy-MM-dd"]) , error:""});
    const [endDate, setEndDate] = useState({ value: format(new Date(),["yyyy-MM-dd"]), error: ""});
    const [currency, setCurrency] = useState({value:"",error:""});
    const [systemTool, setSystemTool] = useState( {value: "", error: ""});
    const [systemUsers, setSystemUsers] = useState({ value: 0, error: ""});
    const [vendor, setVendor] = useState({ value: "", error: ""});
    const [department, setDepartment] = useState({ value: '', error: ''});
    const [addNewOpen, setAddNewOpen] = useState(false);
    const [licenseId,setLicenseId]= useState(null);
    const [selectedLicense, setSelectedLicense] = useState(null);
    const [popoverAnchor, setPopoverAnchor] = useState(null);
    const [rejectedComment, setRejectedComment] = useState("");
    const [statusRenewalOpen, setStatusRenewalOpen] = useState(false);
    const [licenses, setLicenses] = useState({
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
    useEffect(() => {
        var accData = new BackendService().accountData;
        setAccountData(accData);
        setDepartment({ value: accData.user.department.id, error: ''});
        getLicenses(accData.access_token,accData?.user?.department?.id);
    }, [])

    const [status, setStatus] = useState("No licenses available....");
    const getLicenses = (token,id) => {
        const licenseInstance = axios.create(new BackendService().getHeaders(token));
        setLicenses({...licenses, loading: true});
        licenseInstance
            .get(`${new BackendService().LICENSES}/department/${id}`)
            .then(function (response) {
                setLicenses({...licenses, loading: false});
                const d = response.data;
                if (d.data.length == 0) {
                    setStatus("There are no licenses available.");
                } else {
                    var lcs = d.data;

                    setLicenses({
                        ...licenses,
                        data: lcs,
                    });
                    //set status
                    setStatus("Licenses loaded")
                }
            })
            .catch(function (error) {
                setLicenses({...licenses, loading: false});
                var e = error.message;

                if (error.response) {
                    e = error.response.data.message;
                }
                setStatus(e);
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    };


    const [name, setName] = useState({value: "", error: ""});
    const [code, setCode] = useState({value: "", error: ""});
    const [description, setDescription] = useState({value: "", error: ""});
    const onNameChange = (event) => {
        if (event.target.value === "") {
            setName({
                value: "",
                error: "Please enter valid license name",
            });
        } else {
            setName({value: event.target.value, error: ""});
        }
    };
    const onCodeChange = (event) => {
        if (event.target.value === "") {
            setCode({
                value: "",
                error: "Please enter valid license code",
            });
        } else {
            setCode({value: event.target.value, error: ""});
        }
    };
    const onDescriptionChange = (event) => {
        if (event.target.value === "") {
            setDescription({
                value: "",
                error: "Please enter valid description",
            });
        } else {
            setDescription({value: event.target.value, error: ""});
        }
    };
    const onLicensePeriodChange = (event) => {
        if (event.target.value === "") {
            setPaymentFrequency({
                value: "",
                error: "Please select license period",
            });
        } else {
            setPaymentFrequency({value: event.target.value, error: ""});
        }
    };


    const onCurrencyChange = (event) => {
        if (event.target.value === "") {
            setCurrency({
                value: "",
                error: "Please select currency",
            });
        } else {
            setCurrency({value: event.target.value, error: ""});
        }
    };
    const onVendorChange = (event,v) => {
        if (v === null) {
            setVendor({
                value: "",
                error: "Please select vendor",
            });
        } else {
            setVendor({value: v.id, error: ""});
        }
    };

    const onSystemUsersChange= (event)=>{
        if (event.target.value === "") {
            setSystemUsers({
                value: "",
                error: "Please specify users, or 0(not applicable)",
            });
        } else {
            setSystemUsers({value: event.target.value, error: ""});
        }
    }
    const onSystemToolsChange = (event,v) => {
        if (v === null) {
            setSystemTool({
                value: "",
                error: "Please select system tool",
            });
        } else {
            setSystemTool({value: v.id, error: ""});
        }
    };



    const onAnnualLicenseFeeChange = (event) => {
        if (event.target.value === "") {
            setAnnualLicenseFees({
                value: "",
                error: "Please enter annual fees",
            });
        } else {
            setAnnualLicenseFees({value: event.target.value, error: ""});
        }
    };

    const addLicense = () => {
        if (name.value === "") {
            setName({
                value: "",
                error: "Please provide valid name",
            });
        } else if (code.value === "") {
            setCode({
                value: '',
                error: 'Please provide valid code'
            });
        } else if (description.value === "'") {
            setDescription({
                value: '',
                error: 'Please fulfill description'
            })
        }
        else if (paymentFrequency.value === "") {
            setPaymentFrequency({
                value: '',
                error: 'Please select license period'
            })
        } else if (annualLicenseFees.value === "") {
            setPaymentFrequency({
                value: '',
                error: 'Please enter license period count'
            })
        }else {
            createLicense();
        }
    }

    const createLicense = () => {
        const licenseInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        setLicenses({...licenses, saving: true});

        const data = {
            name: name.value,
            code: code.value,
            description: description.value,
            "vendor": vendor.value,
            "license_fees": parseFloat(annualLicenseFees.value),
            "start_date": startDate.value,
            "end_date": endDate.value,
            "currency": currency.value,
            "payment_frequency": paymentFrequency.value,
            "system_tool":systemTool.value,
            "number_system_users": parseInt(systemUsers.value),
            "department": parseInt(department.value),
        }

    licenseInstance
        .post(new BackendService().LICENSES, data)
        .then(function (response) {
            setLicenses({...licenses, saving: false});
            var d = response.data;
            var lcs = licenses.data;
            const newLicense = d.data;
            lcs.unshift(newLicense);
            setLicenses({
                ...licenses,
                data: lcs,
            });
            clearLicenseInfo()
            notify("success", response.data.message);
            setAddNewOpen(false);
        })
        .catch(function (error) {
            setLicenses({...licenses, saving: false});
            var e = error.message;
            if (error.response) {
                e = error.response.data.message;
            }
            notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
        });

}

    // clear data

    const clearLicenseInfo = () => {
        setName({ value: "", error: "" });
        setDescription({ value: "", error: "" });
        setCode({ value: "", error: "" });
    };
    const [anchorElStatus, setAnchorElStatus] = useState(null);
    const handleEditOpenStatus = (event) => {
        setAnchorElStatus(event.currentTarget);
    };
    const openEditStatus = Boolean(anchorElStatus);
    const idStatus = openEditStatus ? 'simple-popover' : undefined;
    const handleEditCloseStatus = () => {
        setAnchorElStatus(null);
    };

    // notify

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
        {
          name: "name",
          label: "Name",
          options: {
            filter: false,
            sort: true,
          },
        },
        {
          name: "code",
          label: "Code",
          options: {
            filter: false,
            sort: false,
          },
        },
          {
              name: "system_tool",
              label: "Tool",
              options: {
                  filter: false,
                  sort: true,
                  customBodyRender: (value) => value?.system_tool_name || "N/A",
              },
          },
/*        {
          name: "description",
          label: "Description",
          options: {
            filter: false,
            sort: false,
          },
        },*/
/*        {
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
                      {licenses.data[dataI].status.toLowerCase() == "enabled" ? (
                        <CheckCircle fontSize="small" />
                      ) : (
                          <Block fontSize="small" />
                        )}
                    </Avatar>
                  }
                  variant="outlined"
                  color={
                    licenses.data[dataI].status.toLowerCase() == "enabled"
                      ? "primary"
                      : "default"
                  }
                  size="small"
                  label={Capitalize(licenses.data[dataI]?.status)}
                />
              );
            },
          },
        },*/

          {
              name: "vendor",
              label: "Vendor",
              options: {
                  filter: false,
                  sort: true,
                  customBodyRender: (value) => value?.vendor_name || "N/A",
              },
          },
          {
              name: "payment_frequency",
              label: "Payment Frequency",
              options: {
                  filter: false,
                  sort: false,

              },
          },
          {
              name: "license_fees",
              label: "Fees",
              options: {
                  filter: false,
                  sort: false,
              },
          },
          {
              name: "approval_status",
              label: "Approval",

              options: {
                  filter: true,
                  sort: false,
                  customBodyRenderLite: function (dataI, rowI) {
                      const statusRaw = licenses.data[dataI]?.approval_status?.toLowerCase();
                      const status = statusRaw === "rejected" ? "Rejected" : Capitalize(statusRaw);

                      let avatarColor = "#ccc";
                      if (statusRaw === "approved") avatarColor = "#55c266";
                      else if (statusRaw === "pending") avatarColor = "#F8BF00";
                      else if (statusRaw === "rejected") avatarColor = "#E53835";

                      return (
                          <Chip
                              avatar={
                                  <Avatar style={{ backgroundColor: avatarColor ,color: "white" }}>
                                      {statusRaw === "approved" ? (
                                          <CheckCircle fontSize="small" />
                                      ) : (
                                          <Block fontSize="small" />
                                      )}
                                  </Avatar>
                              }
                              style={{backgroundColor:"white"}}
                              size="small"
                              label={status}
                          />
                      );
                  }

              },

          },
          {
              name: "number_system_users",
              label: "Users",
              options: {
                  filter: true,
                  sort: true,
              },
          },
          {
              name: "start_date",
              label: "Issued on",
              options: {
                  filter: false,
                  sort: false,
                  customBodyRender: (value) => {
                      if (!value) return "";
                      const date = new Date(value);
                      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                  }
              },
          },
          {
              name: "end_date",
              label: "Expiring on",
              options: {
                  filter: false,
                  sort: false,
                  customBodyRender: (value) => {
                      if (!value) return "";
                      const date = new Date(value);
                      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                  }
              },
          },
          {
              name: "end_date",
              label: "Expiration",
              options: {
                  filter: false,
                  sort: false,
                  customBodyRender: (value, tableMeta) => {
                      if (!value) return "";
                      const endDate = new Date(value);
                      if (isNaN(endDate.getTime())) return "";
                      const Today = new Date();

                      const diffTime = endDate.getTime() - Today.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      let status = "";
                      let dotColor = "";

                      if (diffDays > 15) {
                          status = "Updated";
                          dotColor = "#55c266"; // green
                      } else if (diffDays >= 1 && diffDays <= 15) {
                          status = "Expiring Soon";
                          dotColor = "#F8BF00"; // yellow
                      } else {
                          status = "Expired";
                          dotColor = "#E53835"; // red
                      }

                      return (
                          <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
            <span
                style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: dotColor,
                    display: "inline-block"
                }}
            ></span>
                              <span style={{color: "#333", fontWeight: 600}}>{status}</span>
                          </div>
                      );
                  }

              }
          },


          {
              name: "id",
              label: "Actions",
              options: {
                  filter: false,
                  sort: false,
                  empty: true,
                  customBodyRenderLite: (dataIndex) => {
                      const obj = licenses.data[dataIndex];
                      return (
                          <Box
                              onClick={(e) => e.stopPropagation()}
                              sx={{ display: "flex", alignItems: "center" }}
                          >
                              <IconButton
                                  aria-label="actions"
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      setLicenseId(obj?.id);
                                      setSelectedLicense(obj);
                                      handleEditOpenStatus(e);
                                  }}
                              >
                                  <MoreVert />
                              </IconButton>

                              <Popover
                                  anchorEl={anchorElStatus}
                                  open={openEditStatus}
                                  onClose={handleEditCloseStatus}
                                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                  transformOrigin={{ vertical: "top", horizontal: "center" }}
                                  onClick={(e) => e.stopPropagation()}
                              >
                                  <Box p={2}>
                                      <List>
                                          <ListItem
                                              button
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  setStatusRenewalOpen(true);
                                                  handleEditCloseStatus();
                                              }}
                                          >
                                              <ListItemIcon>
                                                  <Payment />
                                              </ListItemIcon>
                                              <ListItemText primary="Renewal" />
                                          </ListItem>
                                      </List>
                                  </Box>
                              </Popover>
                          </Box>
                      );
                  },
              },
          }

      ];


          const options = {
              filterType: "multiselect",
              elevation: 0,
              selectableRows: false,
              searchPlaceholder: "Search user...",
              selectableRowsOnClick: true,
              customBodyRender: undefined,
              fixedHeader: true,

              onCellClick: (cellData, cellMeta) => {
                  var license = licenses.data[cellMeta.dataIndex];
                  if (license['approval_status'] === "REJECTED") {
                      setPopoverAnchor(cellMeta.event.currentTarget);
                      setRejectedComment(license.approval_comment || "No comment provided.");
                      return;
                  }
                  if(license['approval_status'] === "PENDING") {
                      history.push('LicenseDetails', license);
                  }
                  else {
                      notify("error", 'Contract is still pending...', 400);
                  }
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
              }
          };
/*
      };
*/

      // end table config

    /*
    License renewal
     */

    const LicenseRenewal=()=>{
        const licenseRenewalInstance = axios.create(new BackendService().getHeaders(accountData.access_token));
        const data = {
                "name": name.value,
                "code": code.value,
                "description": description.value,
                "vendor": vendor.value,
                "license_fees": parseFloat(annualLicenseFees.value),
                "start_date": startDate.value,
                "end_date": endDate.value,
                "currency": currency.value,
                "payment_frequency": paymentFrequency.value,
                "system_tool":systemTool.value,
                "number_system_users": parseInt(systemUsers.value),
                "department": parseInt(accountData?.user?.department?.id),
            }
        licenseRenewalInstance
            .put( `${new BackendService().LICENSES}/${licenseId}`, data )
            .then(function (response) {
                notify("success", response.data.message);
                setStatusRenewalOpen(false);
                getLicenses(accountData.access_token, accountData.user.department.id);
            })
            .catch(function (error) {
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    }
    useEffect(() => {
        if (statusRenewalOpen && selectedLicense) {
            setName({ value: selectedLicense.name || "", error: "" });
            setCode({ value: selectedLicense.code || "", error: "" });
            setDescription({ value: selectedLicense.description || "", error: "" });
            setVendor({ value: selectedLicense.vendor?.id || "", error: "" });
            setSystemTool({ value: selectedLicense.system_tool?.id || "", error: "" });
            setAnnualLicenseFees({ value: selectedLicense.license_fees || "", error: "" });
            setStartDate({ value: selectedLicense.start_date || "", error: "" });
            setEndDate({ value: selectedLicense.end_date || "", error: "" });
            setCurrency({ value: selectedLicense.currency || "", error: "" });
            setPaymentFrequency({ value: selectedLicense.payment_frequency || "", error: "" });
            setSystemUsers({ value: selectedLicense.number_system_users || "", error: "" });
        }
    }, [statusRenewalOpen, selectedLicense]);



    return(
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
            Add New License
          </DialogTitle>
          <DialogContent>
            <Box style={{marginTop:10}}>
              <Translate>
                {({ translate }) => (
                  <TextField
                    required
                    size="small"
                    variant="outlined"
                    color="primary"
                    value={name.value}
                    placeholder={"Name"}
                    label={"License Name"}
                    fullWidth
                    onChange={onNameChange}
                    helperText={name.error}
                    error={name.error !== ""}
                  />
                )}
              </Translate>
            </Box>

            <Box style={{marginTop:10}}>
              <Translate>
                {({ translate }) => (
                  <TextField
                    required
                    size="small"
                    variant="outlined"
                    color="primary"
                    value={code.value}
                    placeholder={"Code"}
                    label={"License Code"}
                    fullWidth
                    onChange={onCodeChange}
                    helperText={code.error}
                    error={code.error !== ""}
                  />
                )}
              </Translate>
            </Box>
              <Box style={{marginTop: 10}}>
                  <Autocomplete
                      fullWidth
                      openOnFocus
                      options={vendors}
                      getOptionLabel={(option) => option.vendor_name}
                      onChange={onVendorChange}
                      renderInput={(params) => (
                          <TextField
                              {...params}
                              fullWidth
                              label={"Vendor"}
                              variant="outlined"
                              size="small"
                            helperText={vendor.error}
                              error={vendor.error !== ""}
                          />
                      )}
                  />
              </Box>
              <Box style={{marginTop: 10}}>
                  <Autocomplete
                      fullWidth
                      openOnFocus
                      options={systemTools}
                      getOptionLabel={(option) => option.system_tool_name}
                      onChange={onSystemToolsChange}
                      renderInput={(params) => (
                          <TextField
                              {...params}
                              fullWidth
                              label={"System/Tool"}
                              variant="outlined"
                              size="small"
                               small helperText={systemTool.error}
                              error={systemTool.error !== ""}
                          />
                      )}
                  />
              </Box>
              <Box style={{marginTop: 10}}>
                  <FormControl
                      className={classes.formControl}
                      fullWidth
                      variant="outlined"
                      size="small"
                      error={paymentFrequency.error !== ""}
                  >
                      <InputLabel id="type">
                          Payment Frequency
                      </InputLabel>
                      <Select
                          label={"Payment Frequency"}
                          value={paymentFrequency.value}
                          onChange={onLicensePeriodChange}
                      >
                          <MenuItem value="MONTH">Monthly</MenuItem>
                          <MenuItem value="YEAR">Yearly</MenuItem>
                          <MenuItem value="QUARTER">Quarterly</MenuItem>
                          <MenuItem value="MIDYEAR">Mid-Year</MenuItem>
                      </Select>
                      <FormHelperText>{paymentFrequency.error}</FormHelperText>
                  </FormControl>
              </Box>
              <Box style={{marginTop:10}}>
                  <Translate>
                      {({ translate }) => (
                          <TextField
                              required
                              size="small"
                              variant="outlined"
                              color="primary"
                              type={'number'}
                              value={annualLicenseFees.value}
                              placeholder={"License Fees"}
                              label={"License Fees"}
                              fullWidth
                              onChange={onAnnualLicenseFeeChange}
                              helperText={annualLicenseFees.error}
                              error={annualLicenseFees.error !== ""}
                          />
                      )}
                  </Translate>
              </Box>
              <Box style={{marginTop:10}}>
                  <Translate>
                      {({ translate }) => (
                          <TextField
                              required
                              size="small"
                              variant="outlined"
                              color="primary"
                              type={'number'}
                              value={systemUsers.value}
                              placeholder={"Users"}
                              label={"Users"}
                              fullWidth
                              onChange={onSystemUsersChange}
                              helperText={systemUsers.error}
                              error={systemUsers.error !== ""}
                          />
                      )}
                  </Translate>
              </Box>
              <Box style={{marginTop: 10}}>
                  <FormControl
                      className={currency.formControl}
                      fullWidth
                      variant="outlined"
                      size="small"
                      error={currency.error !== ""}
                  >
                      <InputLabel id="type">
                          Currency
                      </InputLabel>
                      <Select
                          label={"Currency"}
                          value={currency.value}
                          onChange={onCurrencyChange}
                          >
                          <MenuItem value="USD">USD</MenuItem>
                          <MenuItem value="RWF">RWF</MenuItem>
                          <MenuItem value="EURO">EURO</MenuItem>

                      </Select>
                      <FormHelperText>{currency.error}</FormHelperText>
                  </FormControl>
              </Box>

              <Box style={{marginTop:10}}>
                  <KeyboardDatePicker
                      fullWidth
                      disableToolbar
                      variant="outlined"
                      format="MM/dd/yyyy"
                      margin="normal"
                      label="Start Date"
                      value={startDate.value}
                      onChange={(v)=>{
                          if(v=="Invalid Date" || v==null){
                              setStartDate({value: '',error:v});
                          }else{
                              setStartDate({value: format(v,["yyyy-MM-dd"]),error:""});
                          }

                      }}
                      KeyboardButtonProps={{
                          'aria-label': 'change date',
                      }}
                  />
              </Box>
              <Box style={{marginTop:10}}>
                  <KeyboardDatePicker
                      fullWidth
                      disableToolbar
                      variant="outlined"
                      format="MM/dd/yyyy"
                      margin="normal"
                      label="End Date"
                      value={endDate.value}
                      onChange={(v)=>{
                          if(v=="Invalid Date" || v==null){
                              setEndDate({value: '',error:v});
                          }else{
                              setEndDate({value: format(v,["yyyy-MM-dd"]),error:""});
                          }
                      }}
                      KeyboardButtonProps={{
                          'aria-label': 'change date',
                      }}
                  />
              </Box>
              <Box style={{marginTop:10}}>
                  <Translate>
                      {({ translate }) => (
                          <TextField
                              required
                              size="small"
                              variant="outlined"
                              color="primary"
                              value={description.value}
                              placeholder={"Description"}
                              label={"Description"}
                              multiline={true}
                              minRows={5}
                              fullWidth
                              onChange={onDescriptionChange}
                              helperText={description.error}
                              error={description.error !== ""}
                          />
                      )}
                  </Translate>
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
              disabled={licenses.saving}
              variant="contained"
              color="primary"
              onClick={()=>{ addLicense() }}
              disableElevation
            >
              {licenses.saving ? (
                <CircularProgress size={23} />
              ) : (
                "Save"
              )}
            </Button>
          </DialogActions>
        </Dialog>
  
        {/* Dialogs starts here */}

            {/* License Renewal starts here*/}
            <Dialog
                open={statusRenewalOpen}
                maxWidth="sm"
                fullWidth
                onClose={() => {
                    setStatusRenewalOpen(false)
                }}
            >
                <DialogTitle id="new-op">
                    License Renewal
                </DialogTitle>
                <DialogContent>

                    <Box style={{ marginTop: 10 }}>
                        <Translate>
                            {({ translate }) => (
                                <TextField
                                    required
                                    size="small"
                                    disabled
                                    variant="outlined"
                                    color="primary"
                                    value={selectedLicense?.name || ""}
                                    placeholder={selectedLicense?.name}
                                    label={"License Name"}
                                    fullWidth
                                    helperText={name.error}
                                    error={name.error !== ""}
                                />
                            )}
                        </Translate>
                    </Box>


                    <Box style={{marginTop:10}}>
                        <Translate>
                            {({ translate }) => (
                                <TextField
                                    required
                                    disabled
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    value={selectedLicense?.code || ""}
                                    placeholder={selectedLicense?.code}
                                    label={"License Code"}
                                    fullWidth
                                    onChange={onCodeChange}
                                    helperText={code.error}
                                    error={code.error !== ""}
                                />
                            )}
                        </Translate>
                    </Box>
                    <Box style={{marginTop: 10}}>
                        <Translate>
                            {({ translate }) => (
                                <TextField
                                    required
                                    disabled
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    value={selectedLicense?.vendor.vendor_name || ""}
                                    placeholder={selectedLicense?.vendor.vendor_name}
                                    label={"Vendor"}
                                    fullWidth
                                    onChange={onVendorChange}
                                    helperText={vendor.error}
                                    error={vendor.error !== ""}
                                />
                            )}
                        </Translate>
                    </Box>
                    <Box style={{marginTop: 10}}>
                        <Translate>
                            {({ translate }) => (
                                <TextField
                                    required
                                    disabled
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    value={selectedLicense?.system_tool.system_tool_name || ""}
                                    placeholder={selectedLicense?.system_tool.system_tool_name}
                                    label={"System/Tool"}
                                    fullWidth
                                    onChange={onSystemToolsChange}
                                    helperText={systemTool.error}
                                    error={systemTool.error !== ""}
                                />
                            )}
                        </Translate>
                    </Box>
                    <Box style={{marginTop: 10}}>
                        <FormControl
                            className={classes.formControl}
                            fullWidth
                            variant="outlined"
                            size="small"
                            error={paymentFrequency.error !== ""}
                        >
                            <InputLabel id="type">
                                Payment Frequency
                            </InputLabel>
                            <Select
                                label={"Payment Frequency"}
                                value={paymentFrequency.value}
                                onChange={onLicensePeriodChange}
                            >
                                <MenuItem value="MONTH">Monthly</MenuItem>
                                <MenuItem value="YEAR">Yearly</MenuItem>
                                <MenuItem value="QUARTER">Quarterly</MenuItem>
                                <MenuItem value="MIDYEAR">Mid-Year</MenuItem>
                            </Select>
                            <FormHelperText>{paymentFrequency.error}</FormHelperText>
                        </FormControl>
                    </Box>
                    <Box style={{marginTop:10}}>
                        <Translate>
                            {({ translate }) => (
                                <TextField
                                    required
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    type={'number'}
                                    value={annualLicenseFees.value}
                                    placeholder={"License Fees"}
                                    label={"License Fees"}
                                    fullWidth
                                    onChange={onAnnualLicenseFeeChange}
                                    helperText={annualLicenseFees.error}
                                    error={annualLicenseFees.error !== ""}
                                />
                            )}
                        </Translate>
                    </Box>
                    <Box style={{marginTop:10}}>
                        <Translate>
                            {({ translate }) => (
                                <TextField
                                    required
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    type={'number'}
                                    value={systemUsers.value}
                                    placeholder={"Users"}
                                    label={"Users"}
                                    fullWidth
                                    onChange={onSystemUsersChange}
                                    helperText={systemUsers.error}
                                    error={systemUsers.error !== ""}
                                />
                            )}
                        </Translate>
                    </Box>
                    <Box style={{marginTop: 10}}>
                        <FormControl
                            className={currency.formControl}
                            fullWidth
                            variant="outlined"
                            size="small"
                            error={currency.error !== ""}
                        >
                            <InputLabel id="type">
                                Currency
                            </InputLabel>
                            <Select
                                label={"Currency"}
                                value={currency.value}
                                onChange={onCurrencyChange}
                            >
                                <MenuItem value="USD">USD</MenuItem>
                                <MenuItem value="RWF">RWF</MenuItem>
                                <MenuItem value="EURO">EURO</MenuItem>

                            </Select>
                            <FormHelperText>{currency.error}</FormHelperText>
                        </FormControl>
                    </Box>

                    <Box style={{marginTop:10}}>
                        <KeyboardDatePicker
                            fullWidth
                            disableToolbar
                            variant="outlined"
                            format="MM/dd/yyyy"
                            margin="normal"
                            label="Start Date"
                            value={startDate.value}
                            onChange={(v)=>{
                                if(v=="Invalid Date" || v==null){
                                    setStartDate({value: '',error:v});
                                }else{
                                    setStartDate({value: format(v,["yyyy-MM-dd"]),error:""});
                                }

                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Box>
                    <Box style={{marginTop:10}}>
                        <KeyboardDatePicker
                            fullWidth
                            disableToolbar
                            variant="outlined"
                            format="MM/dd/yyyy"
                            margin="normal"
                            label="End Date"
                            value={endDate.value}
                            onChange={(v)=>{
                                if(v=="Invalid Date" || v==null){
                                    setEndDate({value: '',error:v});
                                }else{
                                    setEndDate({value: format(v,["yyyy-MM-dd"]),error:""});
                                }
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Box>
                    <Box style={{marginTop:10}}>
                        <Translate>
                            {({ translate }) => (
                                <TextField
                                    required
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    value={description.value}
                                    placeholder={"Description"}
                                    label={"Description"}
                                    multiline={true}
                                    minRows={5}
                                    fullWidth
                                    onChange={onDescriptionChange}
                                    helperText={description.error}
                                    error={description.error !== ""}
                                />
                            )}
                        </Translate>
                    </Box>

                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setStatusRenewalOpen(false);
                            handleEditCloseStatus();
                            setLicenseId(null);
                            setSelectedLicense(null);
                        }}
                        variant="outlined"
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={licenses.saving}
                        variant="contained"
                        color="primary"
                        onClick={()=>{ LicenseRenewal() }}
                        disableElevation
                    >
                        {licenses.saving ? (
                            <CircularProgress size={23} />
                        ) : (
                            "Save"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* License Renewal Dialog ends here*/}

        <Box display="flex" style={{display: "flex"}}>
          <Box mr={2}>
            {" "}
            <LocationCity color="primary" fontSize="large" />
          </Box>
          <Typography variant="h5" className={classes.title}>
            <b>Licenses</b>
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
            New License
          </Button>
        </Box>

        <Box style={{marginTop: 20}} />
  
        {licenses.loading && <LinearProgress />}
{/*        <MUIDataTable
          title={"List of Licenses"}
          data={licenses.data}
          columns={columns}

          options={options}

        />*/}
            <Box style={{ width: "100%", overflowX: "auto" }}>
                <MUIDataTable
                    title={"Licenses"}
                    data={licenses.data}
                    columns={columns}
                    options={options}

                />
            </Box>
      </div>
        </MuiPickersUtilsProvider>

    );
}



export default withLocalize(Licenses);