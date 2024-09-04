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
    Popover,
    ListItemText,
    ListItemIcon,
    ListItem, List, Grid, ListItemAvatar, ListItemSecondaryAction
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
    Close,
    VisibilityOutlined,
    ListAlt,
    MoreHoriz,
    MoreVert,
    Inbox,
    Drafts,
    Payment,
    Assessment,
    MonetizationOn,
    Done,
    HourglassEmpty,
    AccountTree,
    SettingsInputComponent, LibraryAdd
} from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import { Capitalize } from "../../helpers/capitalize";
import axios from "axios";
import {BackendService} from "../../utils/web_config";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import {Autocomplete} from "@material-ui/lab";
import {useDepartments, useLicenses, useSystemTools, useVendorLicense} from "../../hooks/use_hooks";
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

function Contracts(props) {
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();
    const vendors = useVendorLicense();
    const departments = useDepartments();
    const systemTools = useSystemTools();
    const [addNewOpen, setAddNewOpen] = useState(false);
    const [contracts, setContracts] = useState({
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
        console.log('accData',accData.user.department.id);
        setAccountData(accData);
        setDepartment({ value: accData.user.department.id, error: ''});
        getContracts(accData.access_token, accData.user.department.id);
    }, [])

    const [status, setStatus] = useState("No contracts requests available....");
    const getContracts = (token,id) => {
        const licenseInstance = axios.create(new BackendService().getHeaders(token));
        setContracts({...contracts, loading: true});
        licenseInstance
            .get(`${new BackendService().CONTRACT}/department/${id}`  )
            .then(function (response) {
                setContracts({...contracts, loading: false});
                const d = response.data;
                if (d.data.length == 0) {
                    setStatus("There are no license requests available.");
                } else {
                    var lcs = d.data;
                    lcs.map((da)=>{
                        da['start_date'] = `${format(new Date(da['start_date']), 'yyyy/MM/dd')}`
                        da['end_date']= `${format(new Date(da['end_date']), 'yyyy/MM/dd')}`
                        da['vendor']=da.vendor.vendor_name;
                        da['department_name']=`${da['department']['name']}`
                        da['annual_license_fees'] = `${da['currency']} ${da['annual_license_fees']}`
                    })
                    setContracts({
                        ...contracts,
                        data: lcs,
                    });
                    //set status
                    setStatus("Licenses loaded")
                }
            })
            .catch(function (error) {
                setContracts({...contracts, loading: false});
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                setStatus(e);
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    };


    const [licenseId, setLicenseId] = useState({value: "", error: ""});
    const [paymentFrequency, setPaymentFrequency] = useState({value: "", error: ""});
    const [annualLicenseFees, setAnnualLicenseFees] = useState({value: "", error: ""});
    const [description, setDescription] = useState({value: "", error: ""});
    const [vendor, setVendor] = useState({ value: "", error: ""});
    const [startDate, setStartDate] = useState({ value: format(new Date(),["yyyy-MM-dd"]) , error:""});
    const [endDate, setEndDate] = useState({ value: format(new Date(),["yyyy-MM-dd"]), error: ""});
    const [currency, setCurrency] = useState({value:"",error:""});
    const [systemTool, setSystemTool] = useState( {value: "", error: ""});
    const [documentLink, setDocumentLink] = useState({value: "", error:""});
    const [contractNumber, setContractNumber] = useState({ value: null, error: ""});
    const [systemUsers, setSystemUsers] = useState({ value: 0, error: ""});
    const [department, setDepartment] = useState({ value: '', error: ''});


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

    const onContractNumberChange = (event) => {
            setContractNumber({value: event.target.value, error: ""});
    };


    const addContract = () => {
        if (description.value === "") {
            setDescription({
                value: '',
                error: 'Please fulfill description'
            })
        }else if (paymentFrequency.value === "") {
            setPaymentFrequency({
                value: '',
                error: 'Please select license period'
            })
        } else if (annualLicenseFees.value === "") {
            setPaymentFrequency({
                value: '',
                error: 'Please enter license period count'
            })
        }else if (department.value === "") {
            setDepartment({
                value: '',
                error: 'Please select department'
            })
        }
        else {
            recordContract();
        }
    }

    const recordContract = () => {
        const contractInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        setContracts({...contracts, saving: true});
        const arr = [];
        arr.push(systemTool.value);
        const data = {
            "vendor": vendor.value,
            "contract_number": contractNumber.value,
            "annual_license_fees": parseFloat(annualLicenseFees.value),
            "start_date": startDate.value,
            "end_date": endDate.value,
            "description": description.value,
            "currency": currency.value,
            "payment_frequency": paymentFrequency.value,
            "system_tools":arr,
            "department": parseInt(department.value),
            "number_system_users": parseInt(systemUsers.value)
            }
        contractInstance
            .post(new BackendService().CONTRACT, data)
            .then(function (response) {
                setContracts({...contracts, saving: false});
                var d = response.data;
                var lcs = contracts.data;
                const newLicense = d.data;
                newLicense['start_date'] = `${format(new Date(newLicense['start_date']), 'yyyy/MM/dd')}`
                newLicense['end_date']= `${format(new Date(newLicense['end_date']), 'yyyy/MM/dd')}`
                newLicense['vendor']=newLicense.vendor.vendor_name;

                newLicense['department_name']=`${newLicense['department']['name']}`
                newLicense['annual_license_fees'] = `${newLicense['currency']} ${newLicense['annual_license_fees']}`
                // newLicense['department_name']=`${newLicense['department']['name']}`
                lcs.unshift(newLicense);
                setContracts({
                    ...contracts,
                    data: lcs,
                });
                clearContractInfo()
                notify("success", response.data.message);
                setAddNewOpen(false);
            })
            .catch(function (error) {
                setContracts({...contracts, saving: false});
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    }

    // clear data

    const clearContractInfo = () => {
        setLicenseId({value: "", error: ""});
        setPaymentFrequency({value: "", error: ""});
        setAnnualLicenseFees({value: "", error: ""});
        setDescription({value: "", error: ""});
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


    const [anchorElStatus, setAnchorElStatus] = useState(null);
    const handleEditOpenStatus = (event) => {
        setAnchorElStatus(event.currentTarget);
    };
    const openEditStatus = Boolean(anchorElStatus);
    const idStatus = openEditStatus ? 'simple-popover' : undefined;
    const [contractId, setContractId] = useState({ value: '', error: ''});
    const handleEditCloseStatus = () => {
        setAnchorElStatus(null);
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
            name: "department_name",
            label: "Department",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "contract_number",
            label: "Contract No",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "vendor",
            label: "Vendor",
            options: {
                filter: false,
                sort: true,
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
            name: "annual_license_fees",
            label: "Annual License Fees",
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
                customBodyRenderLite: function (dataI, rowI) {
                    return (
                        <Chip
                            avatar={
                                <Avatar>
                                    {contracts.data[dataI].approval_status.toLowerCase() === "approved" ? (
                                        <CheckCircle fontSize="small" />
                                    ) : (
                                        <Block fontSize="small" />
                                    )}
                                </Avatar>
                            }
                            variant="outlined"
                            color={
                                contracts.data[dataI].approval_status.toLowerCase() === "approved"
                                    ? "primary"
                                    : "default"
                            }
                            size="small"
                            label={Capitalize(contracts.data[dataI]?.approval_status)}
                        />
                    );
                },
            },
        },
        {
            name: "number_system_users",
            label: "No of Users",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "start_date",
            label: "Start Date",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "end_date",
            label: "End Date",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "id",
            label: "Actions",
            options: {
                filter: true,
                sort: true,
                customBodyRenderLite: function (dataI, rowI) {
                    return (
                        <Box>
                            <IconButton aria-label="delete"
                                        onClick={(e)=>{
                                            const obj=contracts.data[dataI];
                                            const paymentBatches = obj['payments'];
                                            setPaymentPeriods(paymentBatches.filter((o)=> o.payment_status === 'PENDING'));
                                            setContractId({ value: obj['id'], error: ''});
                                            setPaymentReports(paymentBatches.sort((n1,n2) => n1.order_number - n2.order_number));
                                            handleEditOpenStatus(e);
                                        }}>
                                <MoreVert />
                            </IconButton>
                            <Popover
                                id={idStatus}
                                open={openEditStatus}
                                variant={'outlined'}
                                anchorEl={anchorElStatus}
                                onClose={handleEditCloseStatus}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                elevation={1}
                            >

                                <Box p={2}>
                                    <List component="nav" aria-label="main mailbox folders">
                                        <ListItem button onClick={()=>{
                                            const obj = contracts.data.find((o)=>o['id']===contractId.value);
                                            if(obj['approval_status'].toLowerCase() === 'APPROVED'.toLowerCase()) {
                                                console.log('check approval status',contracts.data[dataI]['approval_status'].toLowerCase())
                                                setShowReport(true);
                                            }else {
                                                notify("info", 'Contract not yet approved', 400);
                                            }
                                            handleEditCloseStatus();
                                        }}>
                                            <ListItemIcon>
                                                <Assessment />
                                            </ListItemIcon>
                                            <ListItemText primary="View Report" />
                                        </ListItem>
                                        <ListItem button onClick={()=>{
                                            const obj = contracts.data.find((o)=>o['id']===contractId.value);
                                            if(obj['approval_status'].toLowerCase() === 'APPROVED'.toLowerCase()) {
                                                setStatusRenewalOpen(true);
                                            }else{
                                                notify("info", 'Contract not yet approved', 400);
                                            }
                                            handleEditCloseStatus();
                                        }} >
                                            <ListItemIcon>
                                                <Payment />
                                            </ListItemIcon>
                                            <ListItemText primary="Status Renewal" />
                                        </ListItem>
                                        <ListItem button onClick={(e)=>{
                                            const obj = contracts.data.find((o)=>o['id']===contractId.value);
                                            if(obj['approval_status'].toLowerCase() === 'APPROVED'.toLowerCase()) {
                                                setShowContractComponents(true);
                                                getContractComponents();
                                            }else{
                                                notify("info", 'Contract not yet approved', 400);
                                            }
                                            handleEditCloseStatus();
                                        }} >
                                            <ListItemIcon>
                                                <AccountTree />
                                            </ListItemIcon>
                                            <ListItemText primary="Components" />
                                        </ListItem>
                                    </List>
                                </Box>
                            </Popover>
                        </Box>
                    );
                }
            },
        },
    ];

    const options = {
        filterType: "multiselect",
        elevation: 0,
        selectableRows: false,
        searchPlaceholder: "Search user...",
        selectableRowsOnClick: true,
        fixedHeader: true,
        onCellClick: (cellData, cellMeta) => {
            var contract = contracts.data[cellMeta.dataIndex];
            history.push('contractDetails',contract)
            console.log('contract',contract)
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

    // end table config

    // renewal license status
    const [statusRenewalOpen, setStatusRenewalOpen] = useState(false);
    const [cost, setCost] = useState({value: "", error: ""});
    const [paymentPeriods,setPaymentPeriods] = useState([]);
    const [paymentPeriodId,setPaymentPeriodId] = useState({value: "",error:""});
    const [isPaid, setIsPaid] = useState(false);
    const [paymentReference, setPaymentReference] = useState({ value: "", error: ""});

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
    const onPaymentReferenceChanged=(v)=>{
        setPaymentReference({ value: v.target.value, error: ""});
    }


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


    const onPaymentPeriodIdChange = (event,v) => {
        if (v === null) {
            setPaymentPeriodId({
                value: "",
                error: "Please select payment period",
            });
        } else {
            // set start and end data, cost period
            const batch = paymentPeriods.filter((o)=>o.id===v.id)[0];
            setCost({ value: batch['payment_fee'], error: ""});
            setStartDate({ value: format(new Date(batch["start_period"]),["yyyy-MM-dd"]),error: ""})
            setEndDate({ value: format(new Date(batch["end_period"]),["yyyy-MM-dd"]), error: ""})
            setPaymentPeriodId({value: v.id, error: ""});
        }
    };

    const addLicense = () => {
        if (contractId.value === "") {
            setContractId({
                value: "",
                error: "Please select contract",
            });
        } else if (paymentPeriodId.value === "") {
            setPaymentPeriodId({
                value: '',
                error: 'Please select period'
            });
        } else if (description.value === "") {
            setDescription({
                value: '',
                error: 'Please fulfill description'
            })
        } else if(isPaid&& paymentReference.value===""){
            setPaymentReference({
                value: "",
                error: "Please enter payment reference",
            });
        }else {
            requestLicense();
        }
    }
    const requestLicense = () => {
        const licenseInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        setLicenses({...licenses, saving: true});

        const data =
            {
                "description": description.value,
                "start_date": startDate.value,
                "end_date": endDate.value,
                "payment_reference": paymentReference.value,
                "period_cost": cost.value,
                "payment_status": isPaid?'PAID':'PENDING',
                "payment_period": paymentPeriodId.value,
                "user": accountData?.user?.id
            };

        licenseInstance
            .post(new BackendService().RECORD_LICENSE, data)
            .then(function (response) {
                setLicenses({...licenses, saving: false});
                // setAccountData(accData);
                clearLicenseInfo()
                notify("success", response.data.message);
                getContracts(accountData.access_token);
                setStatusRenewalOpen(false);
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
        setContractId({value: "", error: ""});
        setCost({value: "", error: ""});
        setDescription({value: "", error: ""});
        setName({ value: "", error: ""});
    };
    const [showReport, setShowReport] = useState(false);
    const [ paymentReports, setPaymentReports] = useState([]);
    const [showContractComponents, setShowContractComponents] = useState(false);
    const [contractComponents, setContractComponents] = useState([]);
    const getContractComponents=()=>{
        const componentInstance = axios.create(new BackendService().getHeaders(accountData.access_token));
        setContractComponents([]);
        componentInstance
            .get(`${new BackendService().CONTRACT }/component/${contractId.value}`)
            .then(function (response) {
                const d = response.data;
                const comps = d.data;
                setContractComponents(comps);
            })
            .catch(function (error) {
                setContractComponents([]);
                let e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                setStatus(e);
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    }
    const [anchorElComponent, setAnchorElComponent] = useState(null);
    const handleEditOpenComponent = (event) => {
        setAnchorElComponent(event.currentTarget);
    };
    const handleEditCloseComponent = () => {
        setAnchorElComponent(null);
    };
    const openEditComponent = Boolean(anchorElComponent);
    const idComponent = openEditComponent ? 'simple-popover' : undefined;
    const [name, setName]= useState({ value: '', error:''});
    const [loadingComponent, setLoadingComponent]=useState(false);
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
                    "contract_id":contractId.value,
                    "description": description.value,
                    "start_date": startDate.value,
                    "expiry_date": endDate.value,
                };
            componentInstance
                .post(`${new BackendService().CONTRACT}/component`, data)
                .then(function (response) {
                    const comps = contractComponents;
                    comps.unshift(response?.data?.data);
                    setContractComponents(comps);
                    setLoadingComponent(false);
                    handleEditCloseComponent();
                    clearLicenseInfo();
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
                    New Contract
                </DialogTitle>
                <DialogContent>
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

                    <Box style={{marginTop:10}}>
                        <Translate>
                            {({ translate }) => (
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    type={'text'}
                                    value={contractNumber.value}
                                    placeholder={"Contract Number"}
                                    label={"Contract Number"}
                                    fullWidth
                                    onChange={onContractNumberChange}
                                    helperText={contractNumber.error}
                                    error={contractNumber.error !== ""}
                                />
                            )}
                        </Translate>
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
                                    helperText={systemTool.error}
                                    error={systemTool.error !== ""}
                                />
                            )}
                        />
                    </Box>

                    <Box style={{marginTop: 10}}>
                        <Autocomplete
                            fullWidth
                            disabled={true}
                            openOnFocus
                            defaultValue={departments[departments.findIndex((o)=>o.id==accountData.user.department.id)]}
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
                                    placeholder={"Annual License Fees"}
                                    label={"Annual License Fees"}
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
                                    placeholder={"System Users"}
                                    label={"System Users"}
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
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    type={'text'}
                                    value={documentLink.value}
                                    placeholder={"Document Link"}
                                    label={"Document Link"}
                                    fullWidth
                                    onChange={(v)=>{
                                        setDocumentLink({ value: v.target.value, error: ""});
                                    }}
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
                        disabled={contracts.saving}
                        variant="contained"
                        color="primary"
                        onClick={()=>{ addContract() }}
                        disableElevation
                    >
                        {contracts.saving ? (
                            <CircularProgress size={23} />
                        ) : (
                            "Save"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>


            {/*start renewal license status dialog*/}
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

                    <Box style={{marginTop: 10}}>
                        <Autocomplete
                            fullWidth
                            openOnFocus
                            options={paymentPeriods}
                            getOptionLabel={(option) => `${format(new Date(option.start_period),["yyyy-MM-dd"])} - ${format(new Date(option.end_period),["yyyy-MM-dd"])}`}
                            onChange={onPaymentPeriodIdChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    label={"Period"}
                                    variant="outlined"
                                    size="small"
                                    helperText={paymentPeriodId.error}
                                    error={paymentPeriodId.error !== ""}
                                />
                            )}
                        />
                    </Box>

                    <Box style={{marginTop:10}}>
                        <Translate>
                            {({ translate }) => (
                                <TextField
                                    required
                                    disabled={true}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    type={'number'}
                                    value={cost.value}
                                    placeholder={"Cost"}
                                    label={"Cost"}
                                    fullWidth
                                    // onChange={onLicensePeriodCountChange}
                                    helperText={cost.error}
                                    error={cost.error !== ""}
                                />
                            )}
                        </Translate>
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
                    <Box style={{marginTop:10}}>
                        <FormControlLabel
                            control={<Switch   checked={isPaid} onChange={(v) => {
                                setIsPaid(v.target.checked);
                            }} value="vertical" color="primary"/>} label={"Is payment paid?"}/>
                    </Box>
                    {isPaid&&<Box style={{marginTop:10}}>
                        <Translate>
                            {({ translate }) => (
                                <TextField
                                    required
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    type={'text'}
                                    value={paymentReference.value}
                                    placeholder={"Payment Reference"}
                                    label={"Payment Reference"}
                                    fullWidth
                                    onChange={onPaymentReferenceChanged}
                                    helperText={paymentReference.error}
                                    error={paymentReference.error !== ""}
                                />
                            )}
                        </Translate>
                    </Box>}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setStatusRenewalOpen(false);
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
            {/*end renewal license status dialog*/}

            {/*start show payment contract report*/}

            <Dialog
                open={showReport}
                maxWidth="sm"
                fullWidth
                onClose={() => {
                    setShowReport(false)
                }}
            >
                <DialogTitle id="new-op">
                    Payment Reports
                </DialogTitle>
                <DialogContent>
                    <Box style={{marginTop:10}}>

                        <List>
                            {paymentReports.map((o)=>
                                <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <MonetizationOn />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={format(new Date(o['start_period']), 'yyyy/MM/dd')+' To '+format(new Date(o['end_period']), 'yyyy/MM/dd')} secondary={'$'+o['payment_fee']} />
                                <ListItemSecondaryAction>
                                    <Chip
                                        label={o['payment_status']}
                                        color={o['payment_status']==='PAID'?'primary':'secondary'}
                                        onDelete={()=>{}}
                                        deleteIcon={o['payment_status']==='PAID'?<Done />:<HourglassEmpty fontSize={'small'} />}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>)}
                        </List>

                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setShowReport(false);
                        }}
                        variant="outlined"
                        color="primary"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/*end show payment contract report*/}


            {/*start show payment contract report*/}

            <Dialog
                open={showContractComponents}
                maxWidth="sm"
                fullWidth
                onClose={() => {
                    setShowContractComponents(false)
                }}
            >
                <DialogTitle id="new-op">
                    <Box style={{display: 'flex'}}><Typography variant={'h6'} style={{flexGrow: 1}}>Contract Components</Typography>
                        <Button
                            variant="contained"
                            disableElevation
                            style={{textTransform: 'capitalize'}}
                            color="primary"
                            startIcon={<LibraryAdd />}
                            onClick={(e)=>{
                                console.log('clicked');
                                handleEditOpenComponent(e);
                            }}
                        >
                            Add
                        </Button>
                        <Popover
                            id={idComponent}
                            open={openEditComponent}
                            variant={'outlined'}
                            anchorEl={anchorElComponent}
                            onClose={handleEditCloseComponent}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            elevation={1}
                        >
                            <Box style={{padding: 5}}>
                                <Box style={{marginTop:10}}>
                                    <Typography>Add Contract Component</Typography>
                                </Box>
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
                                <Grid spacing={1} container>
                                    <Grid item>
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
                                                    if(v === "Invalid Date" || v === null){
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
                                                margin="normal"
                                                label="Expiry Date"
                                                value={endDate.value}
                                                onChange={(v)=>{
                                                    if(v === "Invalid Date" || v === null){
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


                                <Box style={{marginTop:10}}>
                                    <Button
                                        variant="contained"
                                        disableElevation
                                        style={{textTransform: 'capitalize'}}
                                        color="primary"
                                        onClick={(e)=>{
                                            addComponent();
                                        }}
                                    >
                                        {loadingComponent?<CircularProgress/>:'Save'}
                                    </Button>
                                </Box>
                            </Box>
                        </Popover>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box style={{marginTop:10}}>
                        <List>
                            {contractComponents.map((o)=>
                                <ListItem>
                                    <ListItemAvatar>
                                        <SettingsInputComponent />
                                    </ListItemAvatar>
                                    <ListItemText primary={o['name']} secondary={format(new Date(o['start_date']), 'yyyy/MM/dd')+' To '+format(new Date(o['expiry_date']), 'yyyy/MM/dd')} />
                                    <ListItemSecondaryAction>
                                    </ListItemSecondaryAction>
                                </ListItem>)}
                            {contractComponents.length===0&&<Typography>No contract components available</Typography>}
                        </List>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setShowContractComponents(false);
                        }}
                        variant="outlined"
                        color="primary"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/*end show payment contract report*/}

            {/* Dialogs ends here */}
            <Box display="flex" style={{display: "flex"}}>
                <Box mr={2}>
                    {" "}
                    <ListAlt color="primary" fontSize="large" />
                </Box>
                <Typography variant="h5" className={classes.title}>
                    <b>License Contracts</b>
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
                    New Contract
                </Button>
            </Box>
            <Box style={{marginTop: 20}} />
            {contracts.loading && <LinearProgress />}
            <MUIDataTable
                title={"List of License Contracts"}
                data={contracts.data}
                columns={columns}
                options={options}
            />
        </div>
        </MuiPickersUtilsProvider>
    );
}

export default withLocalize(Contracts);