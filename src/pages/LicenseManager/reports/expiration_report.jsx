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
    Box, IconButton, FormControl, InputLabel, Select, MenuItem, FormHelperText
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
    AccessTime,
    Autorenew
} from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import {BackendService} from "../../../utils/web_config";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import {useLicenses} from "../../../hooks/use_hooks";
import { format } from 'date-fns';
import {Autocomplete} from "@material-ui/lab";


const useStyles = makeStyles((theme) => ({
    root: {flexGrow: 1, [theme.breakpoints.up("sm")]: {marginLeft: 250,},},
    title: {flexGrow: 1,},
    btn: {textTransform: "capitalize",},
    btn2: {textTransform: "capitalize", border: "dashed grey 1px",},
    paper: {padding: 15,},
    action: {borderRadius: 15,},
}));

function ExpirationReport(props) {
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
            .get(new BackendService().EXPIRE_LICENSE_REPORT + new Date().getFullYear())
            .then(function (response) {
                setLicenses({...licenses, loading: false});
                const d = response.data;
                if (d.data.length == 0) {
                    setStatus("There are no license requests available.");
                } else {
                    var lcs = d.data;
                    lcs.map((d)=>{
                        d['organization_licenses_expires_at'] = format(new Date(d['organization_licenses_expires_at']), 'yyyy/MM/dd')
                    })
                    setLicenses({
                        ...licenses,
                        data: lcs,
                    });
                    setStatus("Expire License Report Loaded")
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


    // clear data

    const clearLicenseInfo = () => {
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


    // start table config
    const columns = [
        {
            name: "organization_licenses_id",
            label: "id",
            options: {
                filter: false,
                sort: false,
                display: 'excluded',
            },
        },
        {
            name: "day_left",
            label: "Day(s) Left",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "license_license_category",
            label: "License Category",
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
            name: "organization_licenses_expires_at",
            label: "Expires At",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "organization_licenses_license_period",
            label: "License Period Type",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "organization_licenses_license_period_count",
            label: "License Period Count",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "license_description",
            label: "Description",
            options: {
                filter: true,
                sort: true,
            },
        }
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
                toggleUser={() => {
                }}
                openReview={reviewLicenseRequest}
                toggling={licenses.toggling}
            />
        ),
    };

    // end table config
    const [licenseRequest,setLicenseRequest] = useState(null);

    const reviewLicenseRequest = (id) => {
        const request = licenses.data.filter((d) => d.organization_licenses_id == id)[0]
        setLicenseRequest(request);
        console.log('request',request);
        // open dialog
        setDescionOpen(true);
    }

    const addLicense = () => {
        if (description.value === "'") {
            setDescription({
                value: '',
                error: 'Please fulfill description'
            })
        }else if (licensePeriod.value === "'") {
            setLicensePeriod({
                value: '',
                error: 'Please select license period'
            })
        } else if (licensePeriodCount.value === "'") {
            setLicensePeriod({
                value: '',
                error: 'Please enter license period count'
            })
        } else {
            requestLicense();
        }
    }

    /*
    Request Renewal of license
     */
    const requestLicense = () => {
        const licenseInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        setLicenses({...licenses, saving: true});

        const data = {
            license_id: licenseRequest.license_id,
            organization_id:accountData.user.organization_id.id,
            license_period:licensePeriod.value,
            license_period_count:parseInt(licensePeriodCount.value),
            requested_by:accountData.user.id,
            request_type:"RENEWAL",
            description: description.value
        }
        licenseInstance
            .post(new BackendService().LICENSE_REQUEST, data)
            .then(function (response) {
                setLicenses({...licenses, saving: false});
                // var d = response.data;
                // var lcs = licenses.data;
                // const newLicense = d.data;
                // newLicense['license_name'] = newLicense.license_id.name
                // lcs.unshift(newLicense);
                // setLicenses({
                //     ...licenses,
                //     data: lcs,
                // });
                clearLicenseInfo()
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
                <DialogTitle id="new-op">
                    Renewal License Request
                </DialogTitle>
                <DialogContent>

                    <Box style={{marginTop: 10}}>
                        <FormControl
                            className={classes.formControl}
                            fullWidth
                            variant="outlined"
                            size="small"
                            error={requestType.error !== ""}
                        >
                            <InputLabel id="type">
                                License Period
                            </InputLabel>
                            <Select
                                label={"License Period"}
                                value={licensePeriod.value}
                                onChange={onLicensePeriodChange}
                            >
                                <MenuItem value="MONTH">MONTH</MenuItem>
                                <MenuItem value="YEAR">YEAR</MenuItem>
                            </Select>
                            <FormHelperText>{requestType.error}</FormHelperText>
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
                                    value={licensePeriodCount.value}
                                    placeholder={"License Period Count"}
                                    label={"License Period Count"}
                                    fullWidth
                                    onChange={onLicensePeriodCountChange}
                                    helperText={licensePeriodCount.error}
                                    error={licensePeriodCount.error !== ""}
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
                            setDescionOpen(false);
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
                            "Request"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialogs ends here */}
            <Box display="flex" style={{display: "flex"}}>
                <Box mr={2}>
                    {" "}
                    <AccessTime color="primary" fontSize="large"/>
                </Box>
                <Typography variant="h5" className={classes.title}>
                    <b>License Expiration Reports</b>
                </Typography>

            </Box>
            <Box style={{marginTop: 20}}/>
            {licenses.loading && <LinearProgress/>}
            <MUIDataTable
                title={"License Expiration Reports"}
                data={licenses.data}
                columns={columns}
                options={options}
            />
        </div>
    );
}

function CustomLicenseToolbar(props) {
    const {toggleUser, displayData, selectedRows, openReview} = props;
    var check = displayData[selectedRows?.data[0]?.index].data[5] == "ENABLED";
    console.log('check',check);
    console.log(displayData[selectedRows?.data[0]?.index].data[6])
    return (
        <Box display="flex" alignItems="center">
            <Button
                color="primary"
                variant="outlined"
                size="small"
                startIcon={<Autorenew/>}
                onClick={() =>
                    openReview(displayData[selectedRows?.data[0]?.index]?.data[0])
                }
            >
                Renewal License
            </Button>


        </Box>
    );
}

export default withLocalize(ExpirationReport);