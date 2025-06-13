import React, { useState, useEffect, useCallback } from "react";
import {Container, Box, ThemeProvider, Avatar} from "@material-ui/core";
import {
    Typography,
    AppBar,
    Toolbar,
    Link,
    CardActionArea,
    TextField,
    Button,
    ButtonGroup,
    Paper,
    FormControlLabel,
    Checkbox,
    Popover,
} from "@material-ui/core";
import {
    Grid,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    CircularProgress,
    IconButton,
    Chip,
    Tooltip,
} from "@material-ui/core";
import {
    Add, Block, CheckCircle,
    Close,
    Edit,

} from "@material-ui/icons";
import { withLocalize, Translate } from "react-localize-redux";
import {useHistory, useLocation} from "react-router-dom";

import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider, TimePicker} from "@material-ui/pickers";
import { Skeleton, Autocomplete } from "@material-ui/lab";
import MUIDataTable from "mui-datatables";
import { makeStyles, useTheme } from "@material-ui/styles";
import ContractIcon from "../../assets/img/contract.jpg";
import { useSnackbar } from "notistack";
import {BackendService} from "../../utils/web_config";
import {format} from "date-fns/esm";
import {useMetric, useSystemTools} from "../../hooks/use_hooks";
import axios from "axios";
import {createTheme} from "@material-ui/core/styles";
import {Capitalize} from "../../helpers/capitalize";
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
    avatar: {
        height: 100,
        width: 100,
    },
}));

const groupArrayOfObjects=(list, key)=> {
    return list.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}


function LicenseDetails(props) {
    const classes = useStyles();
    const history = useHistory();
    const Theme = useTheme();
    const systemTools = useSystemTools();
    const metrics = useMetric();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [accountData, setAccountData] = useState({});

    const [addNewOpen, setAddNewOpen] = useState(false);
    const [addNewOutletOpen, setAddNewOutletOpen] = useState(false);
    const [addNewAgentOpen, setAddNewAgentOpen] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState(null);
    const location = useLocation();
    const license = location.state;


    const [allOutlets, setAllOutlets] = useState({
        loading: false,
        saving: false,
        status: "No data available",
        data: [],
    });

    const [devices, setDevices] = useState({
        loading: false,
        saving: false,
        status: "No data available",
        toggling: false,
        data: [],
        allData: [],
    });

    const [agents, setAgents] = useState({
        page: 0,
        count: 1,
        rowsPerPage: 10,
        sortOrder: {},
        saving: false,
        loading: false,
        toggling: false,
        status: "No data available",
        data: [],
    });

    const [transactions, setStransactions] = useState({
        page: 0,
        count: 1,
        rowsPerPage: 10,
        sortOrder: {},
        saving: false,
        loading: false,
        toggling: false,
        status: "Loading agent transactions",
        data: [],
    });

    const [agentAccount, setAgentAccount] = useState({
        saving: false,
        loading: false,
        data: {},
    });
    const [choice, setChoice] = useState(0);

    useEffect(() => {
        var accData = new BackendService().accountData;
        const id = history.location.state?.id;

        if (!/^\d+$/.test(id)) {
            // Reject if id is not a number
            notify('','invalid',400);
            return;
        }

        setAccountData(accData);
        getLicenseDetails(accData.access_token, id);
    }, []);




    const [licenseDetails,setLicensedetails]= useState({});
    const  [groupTools, setGroupTools] = useState({});
    ///////////////////////
    const getLicenseDetails=(token,id) =>{
        const licenseInstance = axios.create(new BackendService().getHeaders(token));
        licenseInstance
            .get(`${new BackendService().LICENSES}/details/${id}`  )
            .then(function (response) {
                let d = response.data;
                const toolsMetric = [];
                d.data.toolsMetrics.map((o)=>{
                    toolsMetric.push({
                        license_system_tool_metric_id: o.license_system_tool_metric_id,
                        created_at: o.created_at,
                        updated_at: o.updated_at,
                        entitlement: o.entitlement || "-",
                        utilisation: o.utilisation || "-",
                        license_gap: o.license_gap || "-",
                        metric: o.metric || "-",
                        comment: o.comment || "-",
                        department: o.department,
                        name: o.name || "No Metric",
                        system_tool_name: o.system_tool_name,
                        approval_status: o.approval_status || "PENDING",

                    })
                });
                d.data.tools = toolsMetric;
                const groupDataTools = groupArrayOfObjects(
                    d.data.tools,
                    "comment"
                );
                console.log('groupDataTools',groupDataTools?.keys);
                setGroupTools(groupDataTools);

                console.log(groupTools);
                setLicensedetails(d.data);
            })
            .catch(function (error) {
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    }
    //////////
    const columns = [
        {
            name: "license_system_tool_metric_id",
            label: "Metric Id",
            options: {
                filter: false,
                sort: false,
                display: false,
            },
        },
        {
            name: "system_tool_name",
            label: "Tool",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "name",
            label: "Metric",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "entitlement",
            label: "Entitlement",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "utilisation",
            label: "Utilisation",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "license_gap",
            label: "License Gap",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    const color = value>=0?"#000000":"#BF0000";
                    return <span style={{color:`${color}`}}>{value}</span>
                }


            },
        },
        {
            name: "comment",
            label: "Comment",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "approval_status",
            label: "Approval Status",

            options: {
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    const statusRaw = value?.toLowerCase();
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
    ];


    const options = {
        filterType: "multiselect",
        elevation: 0,
        selectableRows: "single",
        searchPlaceholder: "Search device...",
        selectableRowsOnClick: true,
        fixedHeader: true,
        print: false,
        download: false,
        viewColumns: false,
        searchProps: {
            variant: "outlined",
            margin: "dense",
        },
        textLabels: {
            body: {
                noMatch: 'No data',
            },
        },

        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <CustomDevicesToolbar
                selectedRows={selectedRows}
                displayData={displayData}
                setSelectedRows={setSelectedRows}
                toggleDevice={()=>{}}
                setMetricType = {setMetricType}
                openEdit={openToolMetric}
                toggling={devices.toggling}
            />
        ),
    };

    const componentOptions = {
        filterType: "multiselect",
        elevation: 0,
        selectableRows: "single",
        searchPlaceholder: "Search outlet...",
        selectableRowsOnClick: true,
        fixedHeader: true,
        print: false,
        download: false,
        viewColumns: false,
        searchProps: {
            variant: "outlined",
            margin: "dense",
        },
        textLabels: {
            body: {
                noMatch: allOutlets.status,
            },
        },
    };

    ///////////////////


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



    // add tool/system

    const [toolDialog,setToolDialog] = useState(false);
    const [cost, setCost] = useState({value: "", error: ""});
    const [startDate, setStartDate] = useState({ value: format(new Date(),["yyyy-MM-dd"]) , error:""});
    const [endDate, setEndDate] = useState({ value: format(new Date(),["yyyy-MM-dd"]), error: ""});
    const [systemTool, setSystemTool] = useState( {value: "", error: ""});
    const [currency, setCurrency] = useState({value:"",error:""});
    const [loading,setLoading]=useState(false);
    const [metricsV, setMetricsV] = useState( {value: [], error: ""});
    const [systemToolNameV, setSystemToolNameV] = useState( {value: "", error: ""});

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

    const onSystemToolNameChange = (event,v) => {
        if (v === null) {
            setSystemToolNameV({
                value: "",
                error: "Please select system tool",
            });
        } else {
            setSystemToolNameV({value: v.system_tool_name, error: ""});
        }
    };

    const onMetricChange = (event,v) => {
        console.log('value',v);
        if(v.length>0){
            let ids = [];
            for(const id of v)
            {
                ids.push(id.id);
            }
            setMetricsV({ value: ids, error: ""});
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

    const addTool=()=>{
        setLoading(true);
        const addToolMetricInstance = axios.create(
            new BackendService().getHeaders(accountData.token));
        const data={
            "metrics": metricsV.value,
        }
        addToolMetricInstance
            .put(`${new BackendService().LICENSES}/addSystemTool/${licenseDetails.id}/${license?.system_tool.id}`, data)
            .then(function (response) {
                setLoading(false);
                setToolDialog(false);
                getLicenseDetails(accountData.token, licenseDetails.id);
                notify("success", response.data.message);
            })
            .catch(function (error) {
                setLoading(false);
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    }

/*    const clearToolInfo=()=>{
        setCost({value: "", error: ""});
        setStartDate({ value: format(new Date(),["yyyy-MM-dd"]) , error:""});
        setEndDate({ value: format(new Date(),["yyyy-MM-dd"]), error: ""});
        setSystemTool( {value: "", error: ""});
        setCurrency({value:"",error:""});
    }*/

    // set metric
    const [metricType,setMetricType]=useState("");
    const [metricDialog, setMetricDialog]=useState(false);
    const [utilisation,setUtilisation] = useState({value: 0, error: ""});
    const [entitlement,setEntitlement] = useState({value: 0, error: ""});
    const [comment,setComment] = useState({value: "", error: ""});
    const [metricId,setMetricId]=useState(0);
    const openToolMetric = (id)=>{
        setUtilisation({ value: 0, error: ""});
        setEntitlement({ value: 0, error: ""});
        setComment({ value: "", error: ""});
        const metricObj = licenseDetails.toolsMetrics.find((o)=>o.license_system_tool_metric_id===id);
        if(metricObj['license_tool_metric_id']=== null){
            return;
        }
        setMetricId(id);
        setUtilisation({ value: metricObj['utilisation'], error: ""});
        setEntitlement({ value: metricObj['entitlement'], error: ""});
        setComment({ value: metricObj['comment'] || "", error: ""});
        setMetricDialog(true);
    }

    const [metricLoad,setMetricLoad]=useState(false);
    const saveToolMetric=()=>{
        if(entitlement.value === undefined || entitlement.value === null){
            setEntitlement({value: 0, error: "Invalid value"});
            return;
        }else{
            setMetricLoad(true);
            const data = {
                entitlement: entitlement.value,
                utilisation: utilisation.value,
                comment: comment.value
            };
            const metricInstance = axios.create(
                new BackendService().getHeaders(accountData.token)
            );
            metricInstance
                .put(`${new BackendService().LICENSE_TOOL_METRIC}${metricId}`, data)
                .then(function (response) {
                    getLicenseDetails(accountData.token, licenseDetails.id);
                    setMetricLoad(false);
                    setMetricDialog(false);
                    notify("success", response.data.message);
                })
                .catch(function (error) {
                    setMetricLoad(false);
                    var e = error.message;
                    if (error.response) {
                        e = error.response.data.message;
                    }
                    notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
                });
        }
    }
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className={classes.root}>
                <Button
                    className={classes.btn}
                    color="primary"
                    size="medium"
                    variant="contained"
                    startIcon={<Add />}
                    disableElevation
                    onClick={() => setToolDialog(true)}
                >
                    Add Tool Metric
                </Button>{" "}
                <Dialog
                    open={toolDialog}
                    maxWidth="sm"
                    fullWidth
                    onClose={() => {
                        setToolDialog(false);
                    }}
                >
                    <DialogTitle id="new-op">
                        Add Tool Metric
                    </DialogTitle>
                    <DialogContent>

                        <Box style={{marginTop: 10}}>
                            <Translate>
                                {({ translate }) => (
                                    <TextField
                                        required
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        value={license?.system_tool.system_tool_name || ""}
                                        placeholder={license?.system_tool.system_tool_name}
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
                            <Autocomplete
                                multiple={true}
                                fullWidth
                                openOnFocus
                                options={metrics}
                                getOptionLabel={(option) => option.name}
                                onChange={onMetricChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label={"Metric"}
                                        variant="outlined"
                                        size="small"
                                        helperText={metricsV.error}
                                        error={metricsV.error !== ""}
                                    />
                                )}
                            />
                        </Box>


                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={() => {
                                setToolDialog(false);
                            }}
                            variant="outlined"
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={loading}
                            variant="contained"
                            color="primary"
                            onClick={()=>{addTool()}}
                            disableElevation
                        >
                            {loading? (
                                <CircularProgress size={23} />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Dialogs starts here */}
                <Dialog
                    open={metricDialog}
                    maxWidth="sm"
                    fullWidth
                    onClose={() => {
                        setMetricDialog(false);
                    }}
                >
                    <DialogTitle id="new-op">
                        Set Entitlements
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
                                        type={'number'}
                                        value={entitlement.value}
                                        placeholder={"Entitlement"}
                                        label={"Entitlement"}
                                        fullWidth
                                        onChange={(e)=>{
                                            if(e.target.value === undefined || e.target.value === null){
                                                setEntitlement({value: 0,error: 'Please enter valid number'});
                                            }else{
                                                setEntitlement({value: e.target.value, error: ''});
                                            }
                                        }}
                                        helperText={entitlement.error}
                                        error={entitlement.error !== ""}
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
                                        value={utilisation.value}
                                        placeholder={"Utilisation"}
                                        label={"Utilisation"}
                                        fullWidth
                                        onChange={(e)=>{
                                            if(e.target.value === 0){
                                                setUtilisation({value: 0,error: 'Please enter valid number'});
                                            }else{
                                                setUtilisation({value: e.target.value, error: ''});
                                                if((entitlement.value-e.target.value)<0){
                                                    setComment({value: "Over utilised",error:""});
                                                }else if((entitlement.value-e.target.value)>0){
                                                    setComment({value: "Under utilised",error:""});
                                                }else if((entitlement.value-e.target.value)===0){
                                                    setComment({value: "Optimised",error:""});
                                                }
                                            }
                                        }}
                                        helperText={utilisation.error}
                                        error={utilisation.error !== ""}
                                    />
                                )}
                            </Translate>
                        </Box>
                        <Box style={{marginTop:10}}>
                            <Translate>
                                {({ translate }) => (
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        multiline={true}
                                        rows={6}
                                        color="primary"
                                        type={'text'}
                                        value={comment.value}
                                        placeholder={"Comment"}
                                        label={"Comment"}
                                        fullWidth
                                        onChange={(e)=>{
                                            setComment({value: e.target.value, error: ''});
                                        }}
                                        helperText={comment.error}
                                        error={comment.error !== ""}
                                    />
                                )}
                            </Translate>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={() => {
                                setMetricDialog(false);
                            }}
                            variant="outlined"
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={loading}
                            variant="contained"
                            color="primary"
                            onClick={()=>{
                                if(metricType === "TOOL") {
                                    saveToolMetric();
                                }
                            }}
                            disableElevation
                        >
                            {metricLoad? (
                                <CircularProgress size={23} />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialogs ends here*/}

                <Box style={{marginTop: '20px'}}>

{/*                    <Grid container spacing={1} style={{marginBottom: '10px'}}>

                        {Object.keys(groupTools)?.map((tr) => (
                            <Grid item xs={12} sm={6} lg={6}>
                                <Paper elevation={0} className={classes.paper}>
                                    <Box width={1}>
                                        <Box display="flex" width={1}>
                                            <Box flexGrow={1}>
                                                <Typography color="textSecondary">{tr}</Typography>
                                            </Box>
                                        </Box>
                                        <Box
                                            mt={1}
                                            mb="4px"
                                            display="flex"
                                            alignItems="flex-end"
                                            justifyContent="space-between"
                                            width={1}
                                        >
                                            <Typography color="primary" align="right">
                                                <b>{groupTools[tr].length}</b>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}


                    </Grid>*/}

                    <MUIDataTable
                        title={"LICENSE TOOL METRICS"}
                        data={licenseDetails?.tools}
                        columns={columns}
                        options={options}
                    />
                </Box>


                <Box mt={3} />
            </div>
        </MuiPickersUtilsProvider>
    );
}
function CustomDevicesToolbar(props) {
    const { toggleDevice, displayData, selectedRows, openEdit,setMetricType } = props;

    // var check = displayData[selectedRows?.data[0]?.index].data[4] == "ENABLED";

    return (
        <div>
            <Box display="flex" alignItems="center">
                <Button
                    color="primary"
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() =>{
                        openEdit(displayData[selectedRows?.data[0]?.index]?.data[0])
                        setMetricType("TOOL");
                    }

                    }
                >
                    Set Entitlements
                </Button>
            </Box>
        </div>
    );
}
function CustomComponentToolbar(props) {
    const { toggleDevice, displayData, selectedRows, openEdit,setMetricType } = props;

    // var check = displayData[selectedRows?.data[0]?.index].data[4] == "ENABLED";

    return (
        <div>
            <Box display="flex" alignItems="center">
                <Button
                    color="primary"
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() =>{
                        openEdit(displayData[selectedRows?.data[0]?.index]?.data[0])
                        setMetricType("COMPONENT");
                    }

                    }
                >
                    Set Entitlement
                </Button>
            </Box>
        </div>
    );
}
export default withLocalize(LicenseDetails);
