import React, {useState, useEffect} from "react";
import {withLocalize, Translate} from "react-localize-redux";
import {makeStyles} from "@material-ui/styles";
import {
    Typography,
    TextField,
    Button,
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
    Close,
    AccessTime,
    Autorenew, Book, LibraryBooks
} from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import {BackendService} from "../../../utils/web_config";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import { format } from 'date-fns';
import {Autocomplete} from "@material-ui/lab";


const useStyles = makeStyles((theme) => ({
    root: {flexGrow: 1, [theme.breakpoints.up("sm")]: {marginLeft: 250,},},
    title: {flexGrow: 1,marginLeft: '10px'},
    btn: {textTransform: "capitalize",},
    btn2: {textTransform: "capitalize", border: "dashed grey 1px",},
    paper: {padding: 15,},
    action: {borderRadius: 15,},
}));

function SystemToolReport(props) {
    const classes = useStyles();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const history = useHistory();
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
    const [ year , setYear] = useState(new Date().getFullYear());
    useEffect(() => {
        var accData = new BackendService().accountData;
        console.log('accData',accData);
        setAccountData(accData);
        getLicenses(accData.access_token, new Date().getFullYear(),accData.user.department.id);
    }, [])

    const [status, setStatus] = useState("No reports available....");
    const getLicenses = (token,yearValue,id) => {
        const licenseInstance = axios.create(new BackendService().getHeaders(token));
        setLicenses({...licenses, loading: true});
        licenseInstance
            .get(`${new BackendService().SYSTEM_TOOL_REPORT}?year=${yearValue}&department=${id}`)
            .then(function (response) {
                setLicenses({...licenses, loading: false});
                const d = response.data;
                if (d.data.length == 0) {
                    setStatus("There are no reports available.");
                    setLicenses({
                        ...licenses,
                        data: [],
                    });
                } else {
                    var lcs = d.data;
                    setLicenses({
                        ...licenses,
                        data: lcs,
                    });
                    setStatus("Report Loaded");
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
            name: "day_left",
            label: "Day(s) Left",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "system_tool_name",
            label: "Tool",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "issue_date",
            label: "Start Date",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "expire_date",
            label: "Expiry Date",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "contract_system_tools_price",
            label: "Price",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "contract_system_tools_currency",
            label: "Currency",
            options: {
                filter: false,
                sort: false,
            },
        },
    ];

    const options = {
        filterType: "multiselect",
        elevation: 0,
        selectableRows: false,
        searchPlaceholder: "Search Report...",
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

    const years= [ '2020','2021','2022','2023','2024', '2025', '2026', '2027', '2028', '2029', '2030' ];

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
                    <LibraryBooks color="primary" fontSize="large"/>
                </Box>
                <Typography variant="h5" className={classes.title}>
                    <b>System Tool Report</b>
                </Typography>
                <Box style={{marginTop: 10}}>
                    <Autocomplete
                        style={{width: '150px'}}
                        openOnFocus
                        options={years}
                        getOptionLabel={(option) => option}
                        onChange={(ve, v)=>{
                            setYear(v);
                            getLicenses(accountData.access_token,v,accountData.user.department.id);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label={"Year"}
                                variant="outlined"
                                size="small"
                            />
                        )}
                    />
                </Box>
            </Box>
            <Box style={{marginTop: 20}}/>
            {licenses.loading && <LinearProgress/>}
            <MUIDataTable
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

export default withLocalize(SystemToolReport);