import React,{useState,useEffect} from "react";
import {withLocalize, Translate} from "react-localize-redux";
import {makeStyles} from "@material-ui/styles";
import {
    Typography,
    TextField,
    Button,
    Box,
    IconButton,
    Popover,
    ListItemText,
    ListItemIcon,
    ListItem,
    List,
    ListItemAvatar,
    ListItemSecondaryAction,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
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
    Receipt,
    Close,
    MoreVert, Payment, Assessment, LibraryBooks
} from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import {BackendService} from "../../utils/web_config";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import {format} from "date-fns/esm";
import DateFnsUtils from '@date-io/date-fns';
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
function Certificates(props) {
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();
    const [addNewOpen, setAddNewOpen] = useState(false);
    const [certificates, setCertificates] = useState({
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
        console.log('accData',accData)
        getCertificates(accData.access_token,accData?.user?.department?.id);
    }, [])

    const [status, setStatus] = useState("No certificates requests available....");
    const getCertificates = (token,id) => {
        const certificateInstance = axios.create(new BackendService().getHeaders(token));
        setCertificates({...certificates, loading: true});
        certificateInstance
            .get( `${new BackendService().CERTIFICATES}/department/${id}` )
            .then(function (response) {
                setCertificates({...certificates, loading: false});
                const d = response.data;
                if (d.data.length == 0) {
                    setStatus("There are no certificates available.");
                } else {
                    setCertificates({
                        ...certificates,
                        data: d.data,
                    });
                    //set status
                    setStatus("Certificates loaded")
                }
            })
            .catch(function (error) {
                setCertificates({...certificates, loading: false});
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                setStatus(e);
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    };

    const [description, setDescription] = useState({value: "", error: ""});
    const [startDate, setStartDate] = useState({ value: format(new Date(),["yyyy-MM-dd"]) , error:""});
    const [endDate, setEndDate] = useState({ value: format(new Date(),["yyyy-MM-dd"]), error: ""});
    const [certificateName, setCertificateName] = useState({ value: '' , error: ''});
    const [userOrganization,setUserOrganization] =useState({ value: '', error: ''});
    const [certificateType,setCertificatType]=useState({value: '', error: ''});

    const onCertificateTypeChange = (event)=> {
        if (event.target.value === "") {
            setCertificatType({
                value: "",
                error: "Please select certificate type",
            });
        } else {
            setCertificatType({value: event.target.value, error: ""});

        }
    }
    const onUserOrganizationChange = (event) => {
        if (event.target.value === "") {
            setUserOrganization({
                value: "",
                error: "Please specify user or organization",
            });
        } else {
            setUserOrganization({value: event.target.value, error: ""});
        }
    };



    const onCertificateNameChange = (event) => {
        if (event.target.value === "") {
            setCertificateName({
                value: "",
                error: "Please enter certificate name",
            });
        } else {
            setCertificateName({value: event.target.value, error: ""});
        }
    };

    const addCertificate = () => {
        if (description.value === "") {
            setDescription({
                value: '',
                error: 'Please fulfill description'
            })
        }else if (certificateName.value === "") {
            setCertificateName({
                value: '',
                error: 'Please enter certificate name'
            })
        }else if (userOrganization.value === "") {
            setUserOrganization({
                value: '',
                error: 'Please enter user/organization certificate'
            })
        }
        else {
            recordCertificate();
        }
    }

    const recordCertificate = () => {
        const contractInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        setCertificates({...certificates, saving: true});
        const data = {
            certificate_name: certificateName.value,
            user_organization: userOrganization.value,
            description: description.value,
            department_id: parseInt(accountData?.user?.department?.id),
            issue_date: startDate.value,
            expiration_date: endDate.value,
            certificate_type: certificateType.value
            }
        contractInstance
            .post(new BackendService().CERTIFICATES, data)
            .then(function (response) {
                setCertificates({...certificates, saving: false});
                var d = response.data;
                var cs = certificates.data;
                cs.unshift(d.data);
                setCertificates({
                    ...certificates,
                    data: cs,
                });
                clearContractInfo()
                notify("success", response.data.message);
                setAddNewOpen(false);
            })
            .catch(function (error) {
                setCertificates({...certificates, saving: false});
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    }

    // clear data

    const clearContractInfo = () => {
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
            name: "certificate",
            label: "Certificate",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "certificate_type",
            label: "Certificate Type",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "user_organization",
            label: "User / Organization",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "description",
            label: "Description",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "created_at",
            label: "Created At",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "id",
            label: "Actions",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const obj=certificates.data.find((s)=>s.id==value);
                    console.log('obj', obj);
                    console.log('value',value);
                    return (
                        <Box>
                            <IconButton aria-label="delete"
                                        onClick={(e)=>{
                                            setCertificateId(obj?.id);
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
                                            setShowReport(true);
                                            viewCertificateReports(certificateId);
                                            handleEditCloseStatus();
                                        }}>
                                            <ListItemIcon>
                                                <Assessment />
                                            </ListItemIcon>
                                            <ListItemText primary="Reports" />
                                        </ListItem>
                                        <ListItem button onClick={()=>{
                                            setStatusRenewalOpen(true);
                                            handleEditCloseStatus();
                                        }} >
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
    const [statusRenewalOpen, setStatusRenewalOpen] = useState(false);
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

    const [showReport, setShowReport] = useState(false);
    const [certificateReports,setCertificateReports] = useState([]);
    const [certificateId,setCertificateId]= useState(null);
    const viewCertificateReports=(id)=>{
        const certificateInstance = axios.create(new BackendService().getHeaders(accountData.access_token));
        setCertificateReports([]);
        certificateInstance
            .get( `${new BackendService().CERTIFICATES}/report/certificate/${id}` )
            .then(function (response) {
                const d = response.data;
                if (d.data.length == 0) {
                    // setStatus("There are no certificates repo available.");
                } else {
                    setCertificateReports(d.data);
                }
            })
            .catch(function (error) {
                setCertificateReports([]);
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    }

    /*
    Certificate Renewal
     */
    const certificateRenewal=()=>{
        const certificateInstance = axios.create(new BackendService().getHeaders(accountData.access_token));
        const data ={
            certificate_id: parseInt(certificateId),
            issue_date: startDate.value,
            expiry_date: endDate.value,
            responsible: parseInt(accountData?.user?.id)
        };
        certificateInstance
            .post( `${new BackendService().CERTIFICATES}/report`, data )
            .then(function (response) {
                notify("success", response.data.message);
                setStatusRenewalOpen(false);
            })
            .catch(function (error) {
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
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
                    New Certificate
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
                                    type={'text'}
                                    value={certificateName.value}
                                    placeholder={"Certificate Name"}
                                    label={"Certificate Name"}
                                    fullWidth
                                    onChange={onCertificateNameChange}
                                    helperText={certificateName.error}
                                    error={certificateName.error !== ""}
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
                                    type={'text'}
                                    value={userOrganization.value}
                                    placeholder={"User / Organization"}
                                    label={"User / Organization"}
                                    fullWidth
                                    onChange={onUserOrganizationChange}
                                    helperText={userOrganization.error}
                                    error={userOrganization.error !== ""}
                                />
                            )}
                        </Translate>
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
                                if(v == "Invalid Date" || v == null){
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
                            label="Expiry Date"
                            value={endDate.value}
                            onChange={(v)=>{
                                if(v == "Invalid Date" || v == null){
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

                    <Box style={{marginTop: 10}}>
                        <FormControl
                            className={classes.formControl}
                            fullWidth
                            variant="outlined"
                            size="small"
                            error={certificateType.error !== ""}
                        >
                            <InputLabel id="type">
                                Certificate Type
                            </InputLabel>
                            <Select
                                label={"Certificate Type"}
                                value={certificateType.value}
                                onChange={onCertificateTypeChange}
                            >
                                <MenuItem value="SSL_CERTIFICATE">SSL CERTIFICATE</MenuItem>
                                <MenuItem value="RIPPS_CERTIFICATE">RIPPS CERTIFICATE</MenuItem>
                            </Select>
                            <FormHelperText>{certificateType.error}</FormHelperText>
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
                        disabled={certificates.saving}
                        variant="contained"
                        color="primary"
                        onClick={()=>{ addCertificate() }}
                        disableElevation
                    >
                        {certificates.saving ? (
                            <CircularProgress size={23} />
                        ) : (
                            "Add"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/*start renewal certificate status dialog*/}
            <Dialog
                open={statusRenewalOpen}
                maxWidth="sm"
                fullWidth
                onClose={() => {
                    setStatusRenewalOpen(false)
                }}
            >
                <DialogTitle id="new-op">
                    Certificate Renewal
                </DialogTitle>
                <DialogContent>
                    <Box style={{marginTop:10}}>
                        <KeyboardDatePicker
                            fullWidth
                            disableToolbar
                            variant="outlined"
                            format="MM/dd/yyyy"
                            margin="normal"
                            label="Issue Date"
                            value={startDate.value}
                            onChange={(v)=>{
                                console.log('vv',v);
                                if(v=="Invalid Date" || v=="Invalid time value" || v==null){
                                    setStartDate({value:'',error:v});
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
                            label="Expiry Date"
                            value={endDate.value}
                            onChange={(v)=>{
                                if(v=="Invalid Date" || v=="Invalid time value" || v==null){
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
                        }}
                        variant="outlined"
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={certificates.saving}
                        variant="contained"
                        color="primary"
                        onClick={()=>{ certificateRenewal() }}
                        disableElevation
                    >
                        {certificates.saving ? (
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
                    Certificate Renewals Report
                </DialogTitle>
                <DialogContent>
                    <Box style={{marginTop:10}}>

                        <List>
                            {certificateReports.map((o)=>
                                <ListItem>
                                <ListItemAvatar>
                                    {/*<Avatar>*/}
                                        <Receipt fontSize={'large'} />
                                    {/*</Avatar>*/}
                                </ListItemAvatar>
                                <ListItemText primary={format(new Date(o['issue_date']), 'yyyy/MM/dd')+' To '+format(new Date(o['expiry_date']), 'yyyy/MM/dd')} secondary={`${o['certificate_id']['certificate']} ::  ${o['certificate_id']['user_organization']}`} />
                            </ListItem>)}
                            {certificateReports.length ===0 && <ListItem><ListItemText>No Certificate Reports Available!</ListItemText></ListItem>}
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

            {/* Dialogs ends here */}
            <Box display="flex" style={{display: "flex"}}>
                <Box mr={2}>
                    {" "}
                    <LibraryBooks color="primary" fontSize="large" />
                </Box>
                <Typography variant="h5" className={classes.title}>
                    <b>Certificates</b>
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
                    New Certificate
                </Button>
            </Box>
            <Box style={{marginTop: 20}} />
            {certificates.loading && <LinearProgress />}
            <MUIDataTable
                title={"List of Certificates"}
                data={certificates.data}
                columns={columns}
                options={options}
            />
        </div>
        </MuiPickersUtilsProvider>
    );
}

export default withLocalize(Certificates);