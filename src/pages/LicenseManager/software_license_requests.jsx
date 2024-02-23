import React, {useState, useEffect} from "react";
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
    List,
    ListItem,
    ListItemIcon,
    ListItemText
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
    RateReviewOutlined,
    HelpOutline,
    Computer,
    Business,
    AvTimer,
    MergeType,
    DescriptionOutlined,
    Cached
} from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import {Capitalize} from "../../helpers/capitalize";
import axios from "axios";
import {BackendService} from "../../utils/web_config";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import {Autocomplete} from "@material-ui/lab";
import {useLicenses} from "../../hooks/use_hooks";


const useStyles = makeStyles((theme) => ({
    root: {flexGrow: 1, [theme.breakpoints.up("sm")]: {marginLeft: 250,},},
    title: {flexGrow: 1,},
    btn: {textTransform: "capitalize",},
    btn2: {textTransform: "capitalize", border: "dashed grey 1px",},
    paper: {padding: 15,},
    action: {borderRadius: 15,},
}));

function SoftwareLicenseRequest(props) {
    const classes = useStyles();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const history = useHistory();
    const licensess = useLicenses();
    const [decisionOpen, setDescionOpen] = useState(false);
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
        getLicenses(accData.access_token);
    }, [])

    const [status, setStatus] = useState("No licenses requests available....");
    const getLicenses = (token) => {
        const licenseInstance = axios.create(new BackendService().getHeaders(token));
        setLicenses({...licenses, loading: true});
        licenseInstance
            .get(new BackendService().LICENSE_REQUEST)
            .then(function (response) {
                setLicenses({...licenses, loading: false});
                const d = response.data;
                if (d.data.length == 0) {
                    setStatus("There are no license requests available.");
                } else {
                    var lcs = d.data;
                    lcs.map((da) => {
                        da['license_name'] = da.license_id.name;
                        da['organization_name'] = da.organization_id.name;
                        da['vendor_name'] = da.license_id?.vendor?.vendor_name;
                    })
                    lcs = lcs.filter((l)=>l['license_id']['license_category']==='SOFTWARE_LICENSE');
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


    const [licenseId, setLicenseId] = useState({value: "", error: ""});
    const [licensePeriod, setLicensePeriod] = useState({value: "", error: ""});
    const [licensePeriodCount, setLicensePeriodCount] = useState({value: "", error: ""});
    const [requestType, setRequestType] = useState({value: "", error: ""});
    const [description, setDescription] = useState({value: "", error: ""});

    const onLicenseIdChange = (event, v) => {
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
            setLicensePeriod({
                value: "",
                error: "Please select license period",
            });
        } else {
            setLicensePeriod({value: event.target.value, error: ""});
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

    const onLicensePeriodCountChange = (event) => {
        if (event.target.value === "") {
            setLicensePeriodCount({
                value: "",
                error: "Please enter valid license period count",
            });
        } else {
            setLicensePeriodCount({value: event.target.value, error: ""});
        }
    };

    const onRequstTypeChange = (event) => {
        if (event.target.value === "") {
            setRequestType({
                value: "",
                error: "Please select request type",
            });
        } else {
            setRequestType({value: event.target.value, error: ""});
        }
    };


    // clear data

    const clearLicenseInfo = () => {
        setLicenseId({value: "", error: ""});
        setLicensePeriod({value: "", error: ""});
        setLicensePeriodCount({value: "", error: ""});
        setRequestType({value: "", error: ""});
        setDescription({value: "", error: ""});
    };

    // notify

    const notify = (variant, msg, status) => {
        if (status == 401) {
            history.push("/", {expired: true});
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
                    <Close fontSize="small"/>
                </IconButton>
            ),
        });
    };

    // set current license request
    const [licenseRequestOne,setLicenseRequestOne] = useState(null);


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
            name: "vendor_name",
            label: "Vendor Name",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "request_type",
            label: "Request Type",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "license_name",
            label: "License",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "description",
            label: "Description",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "license_period",
            label: "Period Type",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "license_period_count",
            label: "Period Count",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "created_at",
            label: "Requested At",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "request_status",
            label: "Status",
            options: {
                filter: true,
                sort: false,
                customBodyRenderLite: function (dataI, rowI) {
                    return (
                        <Chip
                            avatar={
                                <Avatar>
                                    {licenses.data[dataI].request_status.toLowerCase() == "approved" ? (
                                        <CheckCircle fontSize="small"/>
                                    ) : (
                                        <Cached fontSize="small"/>
                                    )}
                                </Avatar>
                            }
                            variant="outlined"
                            color={
                                licenses.data[dataI].request_status.toLowerCase() == "approved"
                                    ? "primary"
                                    : "default"
                            }
                            size="small"
                            label={Capitalize(licenses.data[dataI]?.request_status)}
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
        searchPlaceholder: "Search License Request...",
        selectableRowsOnClick: true,
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
        },
        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <CustomLicenseToolbar
                selectedRows={selectedRows}
                displayData={displayData}
                setSelectedRows={setSelectedRows}
                setCurrentRequest={setCurrentRequest}
                openReview={reviewLicenseRequest}
                toggling={licenses.toggling}
            />
        ),
    };

    const setCurrentRequest = (id) =>{
        const obj = licenses.filter((d)=> d.id===id);
        setLicenseRequestOne(obj);
    }

    // end table config
    const [licenseRequest,setLicenseRequest] = useState(null);

    const reviewLicenseRequest = (id) => {
        const request = licenses.data.filter((d) => d.id === id)[0]
        setLicenseRequest(request);
        console.log('request',request);
        if (request['request_status'] === "PENDING") {
            sendReviewLicenseRequest(id)
        }
        // open dialog
        setDescionOpen(true);
    }

    const sendReviewLicenseRequest = (id) => {
            const licenseInstance = axios.create(
                new BackendService().getHeaders(accountData.token)
            );
            setLicenses({...licenses, saving: true});

            const data = {
                user_id: accountData.user.id,
            }
            licenseInstance
                .put(new BackendService().REVIEW_LICENSE_REQUEST+id, data)
                .then(function (response) {
                    setLicenses({...licenses, saving: false});
                    var index = licenses.data.findIndex((d)=>d.id==id)
                    var lcs = licenses.data;
                    lcs[index]['request_status'] = "REVIEWED";
                    setLicenses({
                        ...licenses,
                        data: lcs,
                    });
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

    const sendDecisionLicenseRequest = (decision) => {
        const licenseInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        setLicenses({...licenses, saving: true});
        const data = {
            user_id:accountData.user.id,
            decision,
        }
        licenseInstance
            .put(new BackendService().DECISION_LICENSE_REQUEST+licenseRequest.id, data)
            .then(function (response) {
                setLicenses({...licenses, saving: false});
                var index = licenses.data.findIndex((d)=>d.id==licenseRequest.id)
                var lcs = licenses.data;
                lcs[index]['request_status'] = decision;
                setLicenses({
                    ...licenses,
                    data: lcs,
                });
                setLicenses({
                    ...licenses,
                    data: lcs,
                });
                notify("success", response.data.message);
                setDescionOpen(false);
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

    return (
        <div className={classes.root}>
            {/* Dialogs starts here */}

            {/* ////////////////////////// */}

            <Dialog
                open={decisionOpen}
                maxWidth="sm"
                fullWidth
                onClose={() => {
                    setDescionOpen(false)
                }}
            >

                <DialogContent>
                    {licenseRequest?.request_status!="APPROVED"&&<>
                        <Box style={{display:'flex',justifyContent:'center'}} >
                        <HelpOutline style={{fontSize:'60'}}/>
                    </Box>
                        <Box style={{display:'flex',justifyContent:'center'}}>
                            Please review and decide whether license request is approved or reject
                        </Box>
                        <Box style={{display:'flex',justifyContent:'center',alignContent:'center',alignItems:'center',justifyItems:'center'}}>
                            <List dense={true}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Business />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Vendor"
                                            secondary={licenseRequest?.vendor_name}
                                        />
                                    </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Receipt />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="License"
                                        secondary={licenseRequest?.license_name}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <AvTimer />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Duration"
                                        secondary={`${licenseRequest?.license_period_count} ${licenseRequest?.license_period}`}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MergeType />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Request Type"
                                        secondary={licenseRequest?.request_type}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <DescriptionOutlined />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Description"
                                        secondary={licenseRequest?.description}
                                    />
                                </ListItem>
                            </List>
                        </Box>

                    </>}
                    {licenseRequest?.request_status=="APPROVED"&&<Box style={{display:'flex',justifyContent:'center'}}>
                        Decision already taken!
                    </Box>}

                </DialogContent>

                <DialogActions>
                    {licenseRequest?.request_status!="APPROVED"&&<>
                        <Button
                            onClick={() => {
                                sendDecisionLicenseRequest("REJECTED")
                            }}
                            variant="outlined"
                            color="primary"
                        >
                            Reject
                        </Button>
                        <Button
                            disabled={licenses.saving}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                sendDecisionLicenseRequest("APPROVED")
                            }}
                            disableElevation
                        >
                            {licenses.saving ? (
                                <CircularProgress size={23}/>
                            ) : (
                                "Approve"
                            )}
                        </Button></>}

                </DialogActions>
            </Dialog>

            {/* Dialogs ends here */}
            <Box display="flex" style={{display: "flex"}}>
                <Box mr={2}>
                    {" "}
                    <Computer color="primary" fontSize="large"/>
                </Box>
                <Typography variant="h5" className={classes.title}>
                    <b>Software License Requests</b>
                </Typography>
            </Box>
            <Box style={{marginTop: 20}}/>
            {licenses.loading && <LinearProgress/>}
            <MUIDataTable
                title={"List of Requested Licenses"}
                data={licenses.data}
                columns={columns}
                options={options}
            />
        </div>
    );
}

function CustomLicenseToolbar(props) {
    const {setCurrentRequest, displayData, selectedRows, openReview} = props;
    var check = displayData[selectedRows?.data[0]?.index].data[5] == "ENABLED";
    console.log('check',check);
    console.log(displayData[selectedRows?.data[0]?.index].data[6])
    return (
        <Box display="flex" alignItems="center">
            <Button
                color="primary"
                variant="outlined"
                size="small"
                startIcon={<RateReviewOutlined/>}
                onClick={() => {
                    openReview(displayData[selectedRows?.data[0]?.index]?.data[0])
                    // setCurrentRequest(displayData[selectedRows?.data[0]?.index]?.data[0]);
                    console.log(displayData[selectedRows?.data[0]?.index]?.data[0]);
                    console.log(displayData[selectedRows?.data[0]?.index]?.data);

                }
             }
            >
                Review Request
            </Button>
        </Box>
    );
}

export default withLocalize(SoftwareLicenseRequest);