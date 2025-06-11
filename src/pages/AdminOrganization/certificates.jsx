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
    MoreVert, Payment, Assessment, LibraryBooks, Publish
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
import * as XLSX from "xlsx";

const useStyles = makeStyles((theme) => ({
    root: {flexGrow: 1, [theme.breakpoints.up("sm")]: {marginLeft: 250,},},
    title: {flexGrow: 1,},
    btn: {textTransform: "capitalize",marginRight:'16px'},
    btn2: {textTransform: "capitalize", border: "dashed grey 1px",},
    paper: {padding: 15,},
    action: {borderRadius: 15,},
    tableHeader: {
        fontWeight: 'bold !important',
    },

}));
function Certificates(props) {
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();
    const [addNewOpen, setAddNewOpen] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
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
        setDepartment({ value: accData?.user?.department?.id, error: ''});
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
    const [department, setDepartment] = useState({value: "", error: ""});


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
            console.log('records', data);
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
        console.log('****notify', variant, msg, status);
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
            label: "Organization",
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
            name: "issue_date",
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
            name: "expiry_date",
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
            name: "expiry_date",
            label: "Status",
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
                        dotColor = "#55c266";
                    } else if (diffDays >= 1 && diffDays <= 15) {
                        status = "Expiring Soon";
                        dotColor = "#F8BF00";
                    } else {
                        status = "Expired";
                        dotColor = "#E53835";
                    }

                    return (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
                style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: dotColor,
                    display: "inline-block"
                }}
            ></span>
                            <span style={{ color: "#333", fontWeight: 600 }}>{status}</span>
                        </div>
                    );
                }
            }
        }
,
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
                                            setSelectedCertificate(obj);
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
                                        {/*<ListItem button onClick={()=>{
                                            setShowReport(true);
                                            viewCertificateReports(certificateId);
                                            handleEditCloseStatus();
                                        }}>
                                            <ListItemIcon>
                                                <Assessment />
                                            </ListItemIcon>
                                            <ListItemText primary="Reports" />
                                        </ListItem>*/}
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
           /* certificate_id: parseInt(certificateId),
            issue_date: startDate.value,
            expiry_date: endDate.value,
            responsible: parseInt(accountData?.user?.id)*/
            "certificate_name": certificateName.value,
            "description": description.value,
            "user_organization": userOrganization.value,
            "issue_date": startDate.value,
            "expiry_date": endDate.value,
            "certificate_type": certificateType.value,
            "department_id": department.value,
        };
        console.log('record++++++',data, certificateId)
        certificateInstance
            .put( `${new BackendService().CERTIFICATES}/${certificateId}`, data )
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

    useEffect(() => {
        if (statusRenewalOpen && selectedCertificate) {
            setCertificateName({ value: selectedCertificate.certificate || "", error: "" });
            setDescription({ value: selectedCertificate.description || "", error: "" });
            setUserOrganization({ value: selectedCertificate.user_organization || "", error: "" });
            setStartDate({ value: selectedCertificate.start_date || "", error: "" });
            setEndDate({ value: selectedCertificate.end_date || "", error: "" });
            setCertificatType({ value: selectedCertificate.certificate_type || "", error: "" });

        }
    }, [statusRenewalOpen, selectedCertificate]);

    /*Upload Certificates
     */
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setFileName(file.name);

        try {
            const data = await readExcelFile(file);
            await uploadDataToApi(data);
            setFileName('');
        } catch (error) {
            console.error('Upload failed:', error);
            setLoading(false);

            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'An unexpected error occurred';

            notify(
                error?.response?.status === 404 ? 'info' : 'error',
                errorMessage,
                error?.response?.status
            );
        }
    };


    const readExcelFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet);
                    const excelDateToJSDate = (serial) => {
                        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
                        const resultDate = new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
                        return resultDate.toISOString().split('T')[0];
                    };

                    const parsedData = jsonData.map((item) => ({
                        ...item,
                        issue_date: excelDateToJSDate(item.issue_date),
                        expiration_date: excelDateToJSDate(item.expiration_date),
                    }));

                    resolve(parsedData);
                } catch (error) {
                    reject(new Error('Failed to parse Excel file'));
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    };

    const uploadDataToApi = async (data) => {
        setLoading(true);
        const uploadInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        const fileInput = document.getElementById('upload-certificate-file');
        if (fileInput) {
            fileInput.value = '';
        }
        uploadInstance
            .post(new BackendService().CERTIFICATES_UPLOADS , data)
            .then((response) => {
                console.log('Upload successful:', response.data);
                notify("success", response.data.message || "Upload successful");
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            })
            .catch((error) => {
                let errorMessage = error.message;
                if (error.response) {
                    errorMessage = error.response.data.message;
                }
                console.log('Upload failed:', errorMessage);
                notify(error?.response?.status === 404 ? "info" : "error", errorMessage, error?.response?.status);
            })
            .finally(() => {
                setLoading(false);
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
                                    placeholder={"Organization"}
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
                                <MenuItem value="NORMAL_CERTIFICATE">NORMAL CERTIFICATE</MenuItem>
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
                        <Translate>
                            {({ translate }) => (
                                <TextField
                                    required
                                    size="small"
                                    disabled
                                    variant="outlined"
                                    color="primary"
                                    type={'text'}
                                    value={selectedCertificate?.certificate || ""}
                                    placeholder={"Certificate Name"}
                                    label={"Certificate Name"}
                                    fullWidth
                                    helperText={certificateName.error}
                                    error={certificateName.error !== ""}
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
                                    value={selectedCertificate?.certificate_type || ""}
                                    placeholder={selectedCertificate?.certificate_type || ""}
                                    label={"Certificate Type"}
                                    fullWidth
                                    helperText={certificateType.error}
                                    error={certificateType.error !== ""}
                                />
                            )}
                        </Translate>
                    </Box>
                    <Box style={{marginTop:10}}>
                        <Box style={{marginTop:10}}>
                            <Translate>
                                {({ translate }) => (
                                    <TextField
                                        required
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        type={'text'}
                                        value={selectedCertificate.user_organization || ""}
                                        placeholder={"Organization"}
                                        label={"Organization"}
                                        fullWidth
                                        helperText={userOrganization.error}
                                        error={userOrganization.error !== ""}
                                    />
                                )}
                            </Translate>
                        </Box>
                    </Box>
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
                                if(v=="Invalid Date" || v==null){
                                    setStartDate({value:'',error:v});
                                }else{
                                    setStartDate({value: format(v,["yyyy-MM-dd"]),error:""});
                                }
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />

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
                <Box sx={{ textAlign: 'center', my: 2, position: 'relative' }}>
                    <input
                        accept=".xlsx,.xls"
                        style={{ display: 'none' }}
                        id="upload-certificate-file"
                        type="file"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                    <label htmlFor="upload-certificate-file">
                        <Button
                            color="primary"
                            size={"medium"}
                            className={classes.btn}
                            variant="contained"
                            component="span"
                            disabled={loading}
                            startIcon={<Publish />}

                        >

                            {loading ? 'Uploading...' : 'Upload Certificates'}
                        </Button>
                    </label>
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