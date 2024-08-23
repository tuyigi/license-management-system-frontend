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
    DialogContentText,
    LinearProgress,
    Avatar,
    List,
    CircularProgress,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Switch,
    Divider,
    InputAdornment,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    FormHelperText,
    IconButton,
    Chip,
    Tooltip,
} from "@material-ui/core";
import {
    DesktopMac,
    Add,
    FilterList,
    SupervisedUserCircle,
    ArrowForwardIos,
    AssistantPhoto,
    Close,
    CheckCircle,
    Block,
    Edit,
    Delete,
    AccountBalance,
    Schedule,
    Person,
    Money,
    VpnLock,
    AccountCircle,
    Settings,
    CallMade,
    CallReceived,
    AcUnit,
    InfoOutlined,
    Attachment,
    Timelapse,
    MonetizationOn,
    Today,
    Event,
    AssignmentTurnedIn,
    PeopleOutline,
    Business,
    AlarmAdd,
} from "@material-ui/icons";
import { withLocalize, Translate } from "react-localize-redux";
import { useHistory } from "react-router-dom";

import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider, TimePicker} from "@material-ui/pickers";

import Format from "date-fns/format";

import { Skeleton, Autocomplete } from "@material-ui/lab";
import MUIDataTable from "mui-datatables";
import { makeStyles, useTheme } from "@material-ui/styles";
import ContractIcon from "../../assets/img/contract.jpg";
import { useSnackbar } from "notistack";
import {BackendService} from "../../utils/web_config";
import {format} from "date-fns/esm";
import {useSystemTools} from "../../hooks/use_hooks";
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
    avatar: {
        height: 100,
        width: 100,
    },
}));

function ContractDetails(props) {
    const classes = useStyles();
    const history = useHistory();
    const Theme = useTheme();
    const systemTools = useSystemTools();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [accountData, setAccountData] = useState({});

    const [addNewOpen, setAddNewOpen] = useState(false);
    const [addNewOutletOpen, setAddNewOutletOpen] = useState(false);
    const [addNewAgentOpen, setAddNewAgentOpen] = useState(false);



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



    ////////////////


    useEffect(() => {
        var accData = new BackendService().accountData;
        setAccountData(accData);
        getContractDetails(accData.access_token, history.location.state.id);
    }, []);
    const [contractDetails,setContractDetails]= useState({});
    ///////////////////////
    const getContractDetails=(token,id) =>{
        const contractInstance = axios.create(new BackendService().getHeaders(token));
        contractInstance
            .get(`${new BackendService().CONTRACT}/${id}`  )
            .then(function (response) {
                let d = response.data;
                const tools = [];
                d.data.tools.map((o)=>{
                    tools.push({...o,system_name:o?.system_tool?.system_tool_name})
                })
                d.data.tools = tools
                setContractDetails(d.data);

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
    const remindersColums = [
        {
            name: "reminder_date",
            label: "Reminder Date",
            options: {
                filter: false,
                sort: true,
                customBodyRender: (value) => (
                    <span>{format(new Date(value),["yyyy-MM-dd"])}</span>
                ),
            },
        },
        {
            name: "description",
            label: "Description",
            options: {
                filter: false,
                sort: false,
            },
        }
    ];

    //////////
    const transactionsColums = [
        {
            name: "tx_type_name",
            label: "Transaction type",
            options: {
                filter: true,
                sort: false,
            },
        },
        {
            name: "channel_type",
            label: "Channel",
            options: {
                filter: true,
                sort: false,
            },
        },
        {
            name: "credited_account",
            label: "Account",
            options: {
                filter: true,
                sort: false,
            },
        },
        {
            name: "amount",
            label: "Amount",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => (
                    <span>{value}</span>
                ),
            },
        },
        {
            name: "total_commission_amount",
            label: "Commission",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "tx_date",
            label: "Date",
            options: {
                filter: true,
                sort: false,
            },
        },
        {
            name: "tx_time",
            label: "Time",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "mine",
            label: "Dr/Cr",
            options: {
                filter: true,
                sort: false,
                customBodyRenderLite: function (dataI, rowI) {
                    return (
                        <>
                            {transactions.data[dataI].debited_account ===
                            agentAccount.data.account_number ? (
                                <CallMade color="inherit" />
                            ) : (
                                <CallReceived color="primary" />
                            )}
                        </>
                    );
                },
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
                                    {["completed", "confirmed"].includes(
                                        transactions.data[dataI].status.toLowerCase()
                                    ) ? (
                                        <CheckCircle fontSize="small" />
                                    ) : (
                                        <Block fontSize="small" />
                                    )}
                                </Avatar>
                            }
                            variant="outlined"
                            color={
                                transactions.data[dataI].status.toLowerCase() == "completed"
                                    ? "primary"
                                    : "default"
                            }
                            size="small"
                            label={capitalize(transactions.data[dataI].status)}
                        />
                    );
                },
            },
        },
    ];

    //////

    const columns = [
        {
            name: "id",
            label: "Tool id",
            options: {
                filter: false,
                sort: false,
                display: false,
            },
        },
        {
            name: "system_name",
            label: "System Tool Name",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "price",
            label: "Price",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "issue_date",
            label: "Issue Date",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => (
                    <span>{format(new Date(value),["yyyy-MM-dd"])}</span>
                ),
            },
        },
        {
            name: "expire_date",
            label: "Expire Date",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => (
                    <span>{format(new Date(value),["yyyy-MM-dd"])}</span>
                ),
            },
        }
    ];

    //////

    const componentColumns = [
        {
            name: "name",
            label: "Component Name",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "start_date",
            label: "Start Date",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => (
                    <span>{format(new Date(value),["yyyy-MM-dd"])}</span>
                ),
            },
        },
        {
            name: "expiry_date",
            label: "Expiry Date",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => (
                    <span>{format(new Date(value),["yyyy-MM-dd"])}</span>
                ),
            },
        },
        {
            name: "description",
            label: "Description",
            options: {
                filter: false,
                sort: false,
            },
        }
    ];

    ///////////

    const transactionsOptions = {
        filterType: "multiselect",
        elevation: 0,
        selectableRows: "none",
        searchPlaceholder: "Search transaction...",
        selectableRowsOnClick: true,
        fixedHeader: true,
        onCellClick: (cellData, cellMeta) => {
            var tr = transactions.data[cellMeta.dataIndex];
            history.push("/", tr);
        },
        searchProps: {
            variant: "outlined",
            margin: "dense",
        },
        textLabels: {
            body: {
                noMatch: transactions.status,
            },
        },
    };

    const remindersOptions = {
        filterType: "multiselect",
        elevation: 0,
        selectableRows: false,
        searchPlaceholder: "Search agent...",
        selectableRowsOnClick: false,
        fixedHeader: true,
        searchProps: {
            variant: "outlined",
            margin: "dense",
        },
        textLabels: {
            body: {
                noMatch: agents.status,
            },
        },
        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <CustomAgentsToolbar
                selectedRows={selectedRows}
                displayData={displayData}
                setSelectedRows={setSelectedRows}
                toggleAssistant={()=>{}}
                openEdit={()=>{}}
                toggling={agents.toggling}
            />
        ),
    };

    const options = {
        filterType: "multiselect",
        elevation: 0,
        selectableRows: false,
        searchPlaceholder: "Search device...",
        selectableRowsOnClick: false,
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
                toggling={devices.toggling}
            />
        ),
    };

    const componentOptions = {
        filterType: "multiselect",
        elevation: 0,
        selectableRows: false,
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
        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <>

            </>
        ),
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
        if (cost.value <=0) {
            setCost({
                value: 0,
                error: 'Please enter valid amount'
            })
        }else if(systemTool.value==""){
            setSystemTool({
                value: '',
                error: 'Please select tool/system'
            });
        }else{
            setLoading(true);
            const contractInstance = axios.create(
                new BackendService().getHeaders(accountData.token)
            );
            const data={
                "price" : parseInt(cost.value),
                "currency" : currency.value,
                "issue_date" : startDate.value,
                "expire_date" : endDate.value
            }

            contractInstance
                .put(`${new BackendService().CONTRACT}/addSystemTool/${contractDetails.id}/${systemTool.value}`, data)
                .then(function (response) {
                    setLoading(false);
                    setToolDialog(false);
                    clearToolInfo();
                    getContractDetails(accountData.token, contractDetails.id);
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
    }

    const clearToolInfo=()=>{
        setCost({value: "", error: ""});
        setStartDate({ value: format(new Date(),["yyyy-MM-dd"]) , error:""});
        setEndDate({ value: format(new Date(),["yyyy-MM-dd"]), error: ""});
        setSystemTool( {value: "", error: ""});
        setCurrency({value:"",error:""});
    }


    // add contract component
    const [componentDialog, setComponentDialog] = useState(false);
    const [name, setName]= useState({ value: '', error:''});
    const [loadingComponent, setLoadingComponent]=useState(false);
    const [description, setDescription] = useState({value: "", error: ""});

    const addComponent=()=>{
        if (name.value === "") {
            setName({
                value: "",
                error: "Please enter valid email",
            });
        } else if (description.value === "") {
            setDescription({
                value: '',
                error: 'Please fulfill description'
            })
        }else{
            setLoadingComponent(true);
            const componentInstance = axios.create(
                new BackendService().getHeaders(accountData.token)
            );
            const data =
                {
                    "name": name.value,
                    "contract_id": contractDetails.id,
                    "description": description.value,
                    "start_date": startDate.value,
                    "expiry_date": endDate.value,
                };
            componentInstance
                .post(`${new BackendService().CONTRACT}/component`, data)
                .then(function (response) {
                    setComponentDialog(false);
                    setLoadingComponent(false);
                    clearComponentInfo();
                    getContractDetails(accountData.token, contractDetails.id);
                    notify("success", response.data.message);
                })
                .catch(function (error) {
                    var e = error.message;
                    if (error.response) {
                        e = error.response.data.message;
                    }
                    notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
                });
        }
    }

    const onNameChange = (event) => {
        if (event.target.value === "") {
            setName({
                value: "",
                error: "Please enter valid name",
            });
        } else {
            setName({value: event.target.value, error: ""});
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

    const clearComponentInfo=()=>{
        setName({value: '',error: ''});
        setDescription({ value: '',error: ''});
        setStartDate({ value: format(new Date(),["yyyy-MM-dd"]) , error:""});
        setEndDate({ value: format(new Date(),["yyyy-MM-dd"]), error: ""});
    }

    // add contract reminder
    const [reminderDialog,setReminderDialog] = useState(false);
    const [reminderLoading,setReminderLoading]=useState(false);
    const [reminderDate,setReminderDate]=useState({ value: format(new Date(),["yyyy-MM-dd"]), error: ""});
    const addReminder=()=>{
        const data = {
            "reminder_date": reminderDate.value,
            "description": description.value,
            "user": accountData?.user?.id
        }
        setReminderLoading(true);
        const reminderInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        reminderInstance
            .put(`${new BackendService().CONTRACT}/reminder/${contractDetails.id}`, data)
            .then(function (response) {
                setReminderDialog(false);
                setReminderLoading(false);
                clearComponentInfo();
                getContractDetails(accountData.token, contractDetails.id);
                notify("success", response.data.message);
            })
            .catch(function (error) {
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    }


    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className={classes.root}>
                {/* Dialogs starts here */}
                <Dialog
                    open={toolDialog}
                    maxWidth="sm"
                    fullWidth
                    onClose={() => {
                        setToolDialog(false);
                    }}
                >
                    <DialogTitle id="new-op">
                        Add Tool/System
                    </DialogTitle>
                    <DialogContent>

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
                                        label={"Tool/System"}
                                        variant="outlined"
                                        size="small"
                                        helperText={systemTool.error}
                                        error={systemTool.error !== ""}
                                    />
                                )}
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
                                        type={'number'}
                                        value={cost.value}
                                        placeholder={"Cost"}
                                        label={"Cost"}
                                        fullWidth
                                        onChange={(e)=>{
                                            if(e.target.value === 0){
                                                setCost({value: 0,error: 'Please enter valid amount'});
                                            }else{
                                                setCost({value: e.target.value, error: ''});
                                            }
                                        }}
                                        helperText={cost.error}
                                        error={cost.error !== ""}
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
                        <Grid container spacing={2}>
                            <Grid item lg={6} sm={6} xs={6}>
                                <Box style={{marginTop:10}}>
                                    <KeyboardDatePicker
                                        fullWidth
                                        disableToolbar
                                        variant="outlined"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        // label="Start Date"
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
                            </Grid>
                            <Grid item lg={6} sm={6} xs={6}>
                                <Box style={{marginTop:10}}>
                                    <KeyboardDatePicker
                                        fullWidth
                                        disableToolbar
                                        variant="outlined"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        // label="End Date"
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
                            </Grid>
                        </Grid>

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

                <Dialog
                    open={componentDialog}
                    maxWidth="sm"
                    fullWidth
                    onClose={() => {
                        setComponentDialog(false);
                    }}
                >
                    <DialogTitle id="new-op">
                        Add Component
                    </DialogTitle>
                    <DialogContent>
                        <Box>
                            <Box style={{marginTop:10}}>
                                <Translate>
                                    {({ translate }) => (
                                        <TextField
                                            required
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            type={'text'}
                                            value={name.value}
                                            placeholder={"Name"}
                                            label={"Name"}
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
                                            multiline={true}
                                            rows={6}
                                            color="primary"
                                            type={'text'}
                                            value={description.value}
                                            placeholder={"Description"}
                                            label={"Description"}
                                            fullWidth
                                            onChange={onDescriptionChange}
                                            helperText={description.error}
                                            error={description.error !== ""}
                                        />
                                    )}
                                </Translate>
                            </Box>
                            <Box>
                                <Grid spacing={1} container>
                                    <Grid item>
                                        <Box style={{marginTop:10}}>
                                            <KeyboardDatePicker
                                                fullWidth
                                                disableToolbar
                                                variant="outlined"
                                                format="MM/dd/yyyy"
                                                label="Start Date"
                                                value={startDate.value}
                                                onChange={(v)=>{
                                                    if(v == "Invalid Date" || v === null){
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
                                    </Grid>
                                    <Grid item>
                                        <Box style={{marginTop:10}}>
                                            <KeyboardDatePicker
                                                fullWidth
                                                disableToolbar
                                                variant="outlined"
                                                format="MM/dd/yyyy"
                                                label="Expiry Date"
                                                value={endDate.value}
                                                onChange={(v)=>{
                                                    if(v == "Invalid Date" || v === null){
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
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            style={{textTransform: 'capitalize'}}
                            onClick={() => {
                                setComponentDialog(false);
                            }}
                            variant="outlined"
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            disabled={loadingComponent}
                            disableElevation
                            style={{textTransform: 'capitalize'}}
                            color="primary"
                            onClick={(e)=>{
                                addComponent();
                            }}
                        >
                            {loadingComponent?<CircularProgress/>:'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={reminderDialog}
                    maxWidth="sm"
                    fullWidth
                    onClose={() => {
                        setReminderDialog(false);
                    }}
                >
                    <DialogTitle id="new-op">
                        Add Reminder
                    </DialogTitle>
                    <DialogContent>
                        <Box>
                            <Box style={{marginTop:10}}>
                                <KeyboardDatePicker
                                    fullWidth
                                    disableToolbar
                                    variant="outlined"
                                    format="MM/dd/yyyy"
                                    label="Reminder Date"
                                    value={reminderDate.value}
                                    onChange={(v)=>{
                                        if(v == "Invalid Date" || v === null){
                                            setReminderDate({value: '',error:v});
                                        }else{
                                            setReminderDate({value: format(v,["yyyy-MM-dd"]),error:""});
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
                                            multiline={true}
                                            rows={6}
                                            color="primary"
                                            type={'text'}
                                            value={description.value}
                                            placeholder={"Description"}
                                            label={"Description"}
                                            fullWidth
                                            onChange={onDescriptionChange}
                                            helperText={description.error}
                                            error={description.error !== ""}
                                        />
                                    )}
                                </Translate>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            style={{textTransform: 'capitalize'}}
                            onClick={() => {
                                setReminderDialog(false);
                            }}
                            variant="outlined"
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            disabled={reminderLoading}
                            disableElevation
                            style={{textTransform: 'capitalize'}}
                            color="primary"
                            onClick={(e)=>{
                                addReminder();
                            }}
                        >
                            {reminderLoading?<CircularProgress/>:'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialogs ends here*/}

                {/* //////////////////////////////////// */}

                {/* /////////////////////////////////////// */}
                
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Box p={3}>
                            <Box style={{display: 'flex'}}><img src={ContractIcon} className={classes.avatar}/>
                                <Box style={{flexGrow:1}}/>
                                <Box ml={2}>
                                    {/*<IconButton aria-label="delete">*/}
                                    {/*    <Edit />*/}
                                    {/*</IconButton>*/}

                                </Box>
                            </Box>

                            <Box display="flex" mt={1}>
                                <Box>
                                    <Typography variant="h5">
                                        {contractDetails?.vendor?.vendor_name}'s Contract
                                    </Typography>

                                    <Box mt={2}>

                                        <Button
                                            className={classes.btn}
                                            color="inherit"
                                            size="medium"
                                            startIcon={<Add />}
                                            disableElevation
                                            onClick={() => setToolDialog(true)}
                                        >
                                            Add Tool/System
                                        </Button>{" "}
                                        <Box pt={2} />
                                        <Button
                                            className={classes.btn}
                                            color="inherit"
                                            size="medium"
                                            startIcon={<Add />}
                                            disableElevation
                                            onClick={() => setComponentDialog(true)}
                                        >
                                            Add Component
                                        </Button>
                                        <Box pt={2} />
                                        <Button
                                            className={classes.btn}
                                            color="inherit"
                                            size="medium"
                                            startIcon={<AlarmAdd />}
                                            disableElevation
                                            onClick={() => setReminderDialog(true)}
                                            >
                                                New Reminder
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        <List>
                            {agentAccount.loading ? (
                                [1, 2, 3, 4, 5].map((item, i) => (
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
                                ))
                            ) : (
                                <>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Attachment />
                                        </ListItemIcon>
                                        <ListItemText primary="Contract Number:" />
                                        <ListItemSecondaryAction>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                {contractDetails?.contract_number}
                                            </Typography>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                        <>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <MonetizationOn />
                                                </ListItemIcon>
                                                <ListItemText primary="Total Fees:" />
                                                <ListItemSecondaryAction>
                                                    <Typography color="primary">
                                                        <b>
                                                            {contractDetails?.annual_license_fees} {contractDetails?.currency}
                                                        </b>
                                                    </Typography>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Timelapse />
                                                </ListItemIcon>
                                                <ListItemText primary="Frequency:" />
                                                <ListItemSecondaryAction>
                                                    <Typography color="primary">
                                                        <b>
                                                            {contractDetails?.payment_frequency}
                                                        </b>
                                                    </Typography>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Today />
                                                </ListItemIcon>
                                                <ListItemText primary="Start Date:" />
                                                <ListItemSecondaryAction>
                                                    <Typography color="primary">
                                                        <b>
                                                            {contractDetails?.start_date?.split('T')[0]}
                                                        </b>
                                                    </Typography>
                                                </ListItemSecondaryAction>
                                            </ListItem>

                                            <ListItem>
                                                <ListItemIcon>
                                                    <Event />
                                                </ListItemIcon>
                                                <ListItemText primary="End Date:" />
                                                <ListItemSecondaryAction>
                                                    <Typography color="primary">
                                                        <b>
                                                            {contractDetails?.end_date?.split('T')[0]}
                                                        </b>
                                                    </Typography>
                                                </ListItemSecondaryAction>
                                            </ListItem>

                                            <ListItem>
                                                <ListItemIcon>
                                                    <AssignmentTurnedIn />
                                                </ListItemIcon>
                                                <ListItemText primary="Contract Status:" />
                                                <ListItemSecondaryAction>
                                                    <Typography color="primary">
                                                        <b>
                                                            {contractDetails?.contract_status}
                                                        </b>
                                                    </Typography>
                                                </ListItemSecondaryAction>
                                            </ListItem>

                                            <ListItem>
                                                <ListItemIcon>
                                                    <PeopleOutline />
                                                </ListItemIcon>
                                                <ListItemText primary="System Users:" />
                                                <ListItemSecondaryAction>
                                                    <Typography color="primary">
                                                        <b>
                                                            {contractDetails?.number_system_users}
                                                        </b>
                                                    </Typography>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </>
                                </>
                            )}

                        </List>

                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Box style={{paddingTop:10,display:'flex',justifyContent:'center'}}>
                            <ButtonGroup color="primary">
                                <Button
                                    className={classes.btn}
                                    size="medium"
                                    variant={choice == 0 ? "contained" : "outlined"}
                                    disableElevation
                                    onClick={() => setChoice(0)}
                                >
                                    Tools/Systems
                                </Button>

                                <Button
                                    className={classes.btn}
                                    variant={choice == 1 ? "contained" : "outlined"}
                                    size="medium"
                                    disableElevation
                                    onClick={() => setChoice(1)}
                                >
                                    Components
                                </Button>

                                <Button
                                    className={classes.btn}
                                    variant={choice == 2 ? "contained" : "outlined"}
                                    size="medium"
                                    disableElevation
                                    onClick={() => setChoice(2)}
                                >
                                    Reminders
                                </Button>
                            </ButtonGroup>
                        </Box>

                        {choice == 0 ? (
                            <Box style={{marginTop: '20px'}}>
                                <MUIDataTable
                                    title={"List of Tools"}
                                    data={contractDetails?.tools}
                                    columns={columns}
                                    options={options}
                                />
                            </Box>
                        ) : choice == 1 ? (
                            <Box>
                                <Box  style={{marginTop: '20px'}}>
                                    <MUIDataTable
                                        title={"List of Components"}
                                        data={contractDetails?.components}
                                        columns={componentColumns}
                                        options={componentOptions}
                                    />
                                </Box>
                            </Box>
                        ) : choice == 2 ? (
                            <Box  style={{marginTop: '20px'}}>
                                {agents.loading && <LinearProgress />}
                                <MUIDataTable
                                    title={"List of Reminders"}
                                    data={contractDetails?.reminders}
                                    columns={remindersColums}
                                    options={remindersOptions}
                                />
                            </Box>
                        ) : (
                            <Box  style={{marginTop: '20px'}}>
                                <Grid container spacing={2}>
                                    {transactions?.keys?.map((tr, i) => (
                                        <Grid item xs={12} sm={6} lg={6}>
                                            <Paper elevation={0} className={classes.paper}>
                                                <Box width={1}>
                                                    <Box display="flex" width={1}>
                                                        <Box flexGrow={1}>
                                                            <Typography color="textSecondary">
                                                                {tr}
                                                            </Typography>
                                                        </Box>
                                                        {<AcUnit />}
                                                    </Box>
                                                    <Box
                                                        mt={1}
                                                        mb="4px"
                                                        display="flex"
                                                        alignItems="flex-end"
                                                        justifyContent="space-between"
                                                        width={1}
                                                    >
                                                        <Tooltip
                                                            title={transactions?.groups[tr].length}
                                                            arrow
                                                            placement="top"
                                                        >
                                                            <Typography variant="h5">
                                                              okkkkkkk
                                                            </Typography>
                                                        </Tooltip>

                                                        <Typography color="primary" align="right">
                                                           okkkkk
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box mt={2} />
                                {transactions.loading && <LinearProgress />}
                                <MUIDataTable
                                    title={"Agent transactions"}
                                    data={transactions.data}
                                    columns={transactionsColums}
                                    options={transactionsOptions}
                                />
                            </Box>
                        )}
                    </Grid>
                </Grid>

                <Box mt={3} />
            </div>
        </MuiPickersUtilsProvider>
    );
}

function CustomDevicesToolbar(props) {
    const { toggleDevice, displayData, selectedRows } = props;

    var check = displayData[selectedRows?.data[0]?.index].data[4] == "ENABLED";

    return (
        <div>
            <FormControlLabel
                control={
                    <Switch
                        disabled={props.toggling}
                        checked={check}
                        onChange={() =>
                            // alert(JSON.stringify(displayData[selectedRows?.data[0]?.index]))
                            toggleDevice(
                                displayData[selectedRows?.data[0]?.index]?.data[0],
                                selectedRows?.data[0]?.dataIndex
                            )
                        }
                        value="vertical"
                        color="primary"
                    />
                }
                label={check ? "Deactivate device" : "Activate device"}
            />
        </div>
    );
}

function CustomAgentsToolbar(props) {
    const { toggleAssistant, displayData, selectedRows, openEdit } = props;

    var check = displayData[selectedRows?.data[0]?.index].data[4] == "ENABLED";

    return (
        <Box display="flex" alignItems="center">
            <FormControlLabel
                control={
                    <Switch
                        disabled={props.toggling}
                        checked={check}
                        onChange={() => {
                            toggleAssistant(
                                displayData[selectedRows?.data[0]?.index]?.data[0],
                                selectedRows?.data[0]?.dataIndex
                            );
                        }}
                        value="vertical"
                        color="primary"
                    />
                }
                label={check ? "Deactivate agent" : "Activate agent"}
            />

            <Box mr={2} ml={2}>
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
        </Box>
    );
}
export default withLocalize(ContractDetails);
