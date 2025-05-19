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
    MoreVert, Inbox, Drafts, Payment, Assessment, MonetizationOn, Done, HourglassEmpty, ThumbUp, ThumbDown
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

function ContractsApproval(props) {
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
        setAccountData(accData);
        getContracts(accData.access_token);
    }, [])

    const [status, setStatus] = useState("No contracts requests available....");
    const getContracts = (token) => {
        const licenseInstance = axios.create(new BackendService().getHeaders(token));
        setContracts({...contracts, loading: true});
        licenseInstance
            .get(new BackendService().CONTRACT )
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
    const [contractNumber, setContractNumber] = useState({ value: "", error: ""});
    const [systemUsers, setSystemUsers] = useState({ value: 0, error: ""});
    const [department, setDepartment] = useState({ value: '', error: ''});

    const onLicenseIdChange = (event,v) => {
        if (v === null) {
            setLicenseId({
                value: "",
                error: "Please select license",
            });
        } else {
            setLicenseId({value: v.id, error: ""});
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



    const onLicensePeriodCountChange = (event) => {
        if (event.target.value === "") {
            setAnnualLicenseFees({
                value: "",
                error: "Please enter valid license period count",
            });
        } else {
            setAnnualLicenseFees({value: event.target.value, error: ""});
        }
    };

    const onDepartmentChange = (event,v) => {
        if (v === null) {
            setDepartment({
                value: "",
                error: "Please select department",
            });
        } else {
            console.log(`department ID:: ${v.id}`);
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
            console.log(`vendor ID:: ${v.id}`);
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
            console.log(`system tool ID:: ${v.id}`);
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
        if (event.target.value === "") {
            setContractNumber({
                value: "",
                error: "Please enter contract number",
            });
        } else {
            setContractNumber({value: event.target.value, error: ""});
        }
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

        const data = {
            "vendor": vendor.value,
            "contract_number": contractNumber.value,
            "annual_license_fees": parseFloat(annualLicenseFees.value),
            "start_date": startDate.value,
            "end_date": endDate.value,
            "description": description.value,
            "currency": currency.value,
            "payment_frequency": paymentFrequency.value,
            "system":systemTool.value,
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
                    const statusRaw = contracts.data[dataI]?.approval_status?.toLowerCase();
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
                customBodyRender: (value, tableMeta, updateValue) => {
                    const obj=contracts.data.find((s)=>s.id==value);
                    return (
                        <Box>
                            <IconButton aria-label="delete"
                                        onClick={(e)=>{
                                            const paymentBatches = obj['payments'];
                                            setPaymentPeriods(paymentBatches.filter((o)=> o.payment_status === 'PENDING'));
                                            setContractId({ value, error: ''});
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
                                    <List component="nav">
                                        <ListItem button onClick={()=>{
                                            setAction('Approve');
                                            setApprovalDialog(true);
                                            handleEditCloseStatus();
                                        }}>
                                            <ListItemIcon>
                                                <ThumbUp style={{color: 'green'}} />
                                            </ListItemIcon>
                                            <ListItemText primary="Approve" />
                                        </ListItem>
                                        <ListItem button onClick={()=>{
                                            setAction('Reject')
                                            setApprovalDialog(true);
                                            handleEditCloseStatus();
                                        }}>
                                            <ListItemIcon>
                                                <ThumbDown style={{color: 'red'}} />
                                            </ListItemIcon>
                                            <ListItemText primary="Reject" />
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
        selectableRowsOnClick: false,
        fixedHeader: true,

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
    const [statusRenewalReportOpen, setStatusRenewalReportOpen] = useState(false);
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
    };

    const [showReport, setShowReport] = useState(false);
    const [ paymentReports, setPaymentReports] = useState([]);

    /*
    Approve / Reject contract
     */

    const [approvalLoading,setApprovalLoading]=useState(false);
    const [comment, setComment]=useState({value: '',error: ''});
    const changeContractStatus = ()=>{
        const licenseInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        let status ='';
        if(action=='Approve'){
            status ='APPROVED';
        }else if(action=='Reject'){
            status ='REJECTED';
        }
        let data = {
            comment: comment.value
        };
        setContracts({...contracts, loading: true});
        setApprovalLoading(true);
        licenseInstance
            .put(`${new BackendService().CONTRACT}/approvalStatus/${contractId.value}/${status}`,data)
            .then(function (response) {
                setApprovalLoading(false);
                setContracts({...contracts, loading: false});
                setApprovalDialog(false);
                setComment({ value: '', error: ''});
                notify("success", response.data.message);
                getContracts(accountData.access_token);
            })
            .catch(function (error) {
                setApprovalLoading(false);
                setContracts({...contracts, loading: false});
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    }

    const [action,setAction]=useState('');
    const [approvalDialog,setApprovalDialog]=useState(false);

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
                                    required
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
                            defaultValue={departments[3]}
                            options={departments}
                            getOptionLabel={(option) => option.name}
                            onChange={onSystemToolsChange}
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
                                <MenuItem value="RWF">EURO</MenuItem>
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
                                if(v=="Invalid Date"){
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
                                if(v=="Invalid Date"){
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
                                        if(v=="Invalid Date"){
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
                                        if(v=="Invalid Date"){
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

            {/*approve dialog*/}
            <Dialog
                open={approvalDialog}
                maxWidth="sm"
                fullWidth
                onClose={() => {
                    setApprovalDialog(false);
                }}
            >
                <DialogTitle id="new-op">
                    Contract Approval Status
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
                                    value={comment.value}
                                    placeholder={"Comment"}
                                    label={"Comment"}
                                    multiline={true}
                                    minRows={5}
                                    fullWidth
                                    onChange={(v)=>{
                                        setComment({value: v.target.value, error: ''});
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
                            setApprovalDialog(false);
                        }}
                        variant="outlined"
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={approvalLoading}
                        variant="contained"
                        color="primary"
                        onClick={()=>{ changeContractStatus() }}
                        disableElevation
                    >
                        {approvalLoading? (
                            <CircularProgress size={23} />
                        ) : (
                            action
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Dialogs ends here */}
            <Box display="flex" style={{display: "flex"}}>
                <Box mr={2}>
                    {" "}
                    <ListAlt color="primary" fontSize="large" />
                </Box>
                <Typography variant="h5" className={classes.title}>
                    <b>License Contracts</b>
                </Typography>
                {/*<Button*/}
                {/*    className={classes.btn}*/}
                {/*    color="primary"*/}
                {/*    variant="contained"*/}
                {/*    size="medium"*/}
                {/*    startIcon={<Add />}*/}
                {/*    disableElevation*/}
                {/*    onClick={() => {*/}
                {/*        setAddNewOpen(true);*/}
                {/*    }}*/}
                {/*>*/}
                {/*    New Contract*/}
                {/*</Button>*/}
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

export default withLocalize(ContractsApproval);