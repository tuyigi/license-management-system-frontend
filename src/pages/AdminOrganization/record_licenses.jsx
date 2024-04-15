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
    Box, IconButton, FormControl, InputLabel, Select, MenuItem, FormHelperText, Grid
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
    CheckCircle,
    Block,
    Close,
    Computer,
    Save
} from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import { Capitalize } from "../../helpers/capitalize";
import axios from "axios";
import {BackendService} from "../../utils/web_config";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import {Autocomplete} from "@material-ui/lab";
import {useContracts } from "../../hooks/use_hooks";
import {format} from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
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

function RecordLicense(props) {
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();
    const contracts = useContracts();
    const [addNewOpen, setAddNewOpen] = useState(false);
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
        const accData = new BackendService().accountData;
        setAccountData(accData);
        getLicenses(accData.access_token,accData.user.id);
    }, [])

    const [status, setStatus] = useState("No licenses requests available....");
    const getLicenses = (token,id) => {
        const licenseInstance = axios.create(new BackendService().getHeaders(token));
        setLicenses({...licenses, loading: true});
        licenseInstance
            .get(new BackendService().RECORD_LICENSE )
            .then(function (response) {
                setLicenses({...licenses, loading: false});
                const d = response.data;
                if (d.data.length === 0) {
                    setStatus("There are no license  available.");
                } else {
                    let lcs = d.data;
                    lcs.map((da)=>{
                        da['system']=da.payment_period?.contract?.system_tool?.system_tool_name;
                        da['vendor']=da.payment_period?.contract?.vendor?.vendor_name;
                        da['license_description']=da.description;
                        da['annual_license_fees']=da.period_cost;
                        da['contract_no']=da.payment_period?.contract?.contract_number;
                        da['start_date']=format(new Date(da.start_date),["yyyy-MM-dd"]);
                        da['end_date']=format(new Date(da.end_date),["yyyy-MM-dd"]);
                    });
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


    const [contractId, setContractId] = useState({value: "", error: ""});
    const [cost, setCost] = useState({value: "", error: ""});
    const [description, setDescription] = useState({value: "", error: ""});
    const [paymentPeriods,setPaymentPeriods] = useState([]);
    const [paymentPeriodId,setPaymentPeriodId] = useState({value: "",error:""});
    const [startDate,setStartDate] = useState({ value: "", error:""});
    const [endDate, setEndDate]= useState({ value: "", error:""});
    const [isPaid, setIsPaid] = useState(false);
    const [paymentReference, setPaymentReference] = useState({ value: "", error: ""});

    const onPaymentReferenceChanged=(v)=>{
        setPaymentReference({ value: v.target.value, error: ""});
    }
    const onContractIdChange = (event,v) => {
        setPaymentPeriods([]);
        if (v === null) {
            setContractId({
                value: "",
                error: "Please select contract",
            });
        } else {
            const paymentBatches = contracts.filter((o)=>o.id===v.id)[0]['payments'];
            setPaymentPeriods(paymentBatches.filter((o)=> o.payment_status === 'PENDING'));
            setContractId({value: v.id, error: ""});
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
                getLicenses(accountData.access_token,accountData.user.id);
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
        setContractId({value: "", error: ""});
        setCost({value: "", error: ""});
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
            name: "system",
            label: "System/Tool",
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
            name: "license_description",
            label: "Description",
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
            name: "contract_no",
            label: "Contract No",
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
            name: "payment_status",
            label: "Payment Status",
            options: {
                filter: true,
                sort: false,
                customBodyRenderLite: function (dataI, rowI) {
                    return (
                        <Chip
                            avatar={
                                <Avatar>
                                    {licenses.data[dataI].payment_status.toLowerCase() === "paid" ? (
                                        <CheckCircle fontSize="small" />
                                    ) : (
                                        <Block fontSize="small" />
                                    )}
                                </Avatar>
                            }
                            variant="outlined"
                            color={
                                licenses.data[dataI].payment_status.toLowerCase() === "paid"
                                    ? "primary"
                                    : "default"
                            }
                            size="small"
                            label={Capitalize(licenses.data[dataI]?.payment_status)}
                        />
                    );
                },
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
                    License Renewal
                </DialogTitle>
                <DialogContent>
                    <Box style={{marginTop: 10}}>
                        <Autocomplete
                            fullWidth
                            openOnFocus
                            options={contracts}
                            getOptionLabel={(option) => `${option.system_tool.system_tool_name} - ${option.vendor.vendor_name}`}
                            onChange={onContractIdChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    label={"Contract"}
                                    variant="outlined"
                                    size="small"
                                    helperText={contractId.error}
                                    error={contractId.error !== ""}
                                />
                            )}
                        />
                    </Box>

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
                                        setStartDate({value: format(v,["yyyy-MM-dd"]),error:""});
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
                                        setEndDate({value: format(v,["yyyy-MM-dd"]),error:""});
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

            {/* Dialogs ends here */}
            <Box display="flex" style={{display: "flex"}}>
                <Box mr={2}>
                    {" "}
                    <Computer color="primary" fontSize="large" />
                </Box>
                <Typography variant="h5" className={classes.title}>
                    <b>License Status Renewal</b>
                </Typography>
                <Button
                    className={classes.btn}
                    color="primary"
                    variant="contained"
                    size="medium"
                    startIcon={<Save />}
                    disableElevation
                    onClick={() => {
                        setAddNewOpen(true);
                    }}
                >
                    Record License
                </Button>
            </Box>
            <Box style={{marginTop: 20}} />
            {licenses.loading && <LinearProgress />}
            <MUIDataTable
                title={"List of Recorded Licenses"}
                data={licenses.data}
                columns={columns}
                options={options}
            />
        </div>
        </MuiPickersUtilsProvider>
    );
}
export default withLocalize(RecordLicense);