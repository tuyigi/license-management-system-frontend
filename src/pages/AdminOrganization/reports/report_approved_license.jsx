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
    NoteOutlined,
    VisibilityOutlined
} from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import { Capitalize } from "../../../helpers/capitalize";
import axios from "axios";
import {BackendService} from "../../../utils/web_config";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import {Autocomplete} from "@material-ui/lab";
import {useLicenses} from "../../../hooks/use_hooks";



const useStyles = makeStyles((theme) => ({
    root: {flexGrow: 1, [theme.breakpoints.up("sm")]: {marginLeft: 250,},},
    title: {flexGrow: 1,},
    btn: {textTransform: "capitalize",},
    btn2: {textTransform: "capitalize", border: "dashed grey 1px",},
    paper: {padding: 15,},
    action: {borderRadius: 15,},
}));

function LicenseRequestReport(props) {
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();
    const licensess = useLicenses();
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
        var accData = new BackendService().accountData;
        setAccountData(accData);
        getLicenses(accData.access_token,accData.user.organization_id.id);
    }, [])

    const [status, setStatus] = useState("No licenses requests available....");
    const getLicenses = (token,id) => {
        const licenseInstance = axios.create(new BackendService().getHeaders(token));
        setLicenses({...licenses, loading: true});
        licenseInstance
            .get(new BackendService().ORGANIZATION_LICENSE_REQUEST + id)
            .then(function (response) {
                setLicenses({...licenses, loading: false});
                const d = response.data;
                if (d.data.length == 0) {
                    setStatus("There are no license requests available.");
                } else {
                    var lcs = d.data;
                    lcs.map((da)=>{
                        console.log(da);
                        da['license_name']=da.license_id.name;
                    })
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


    const addLicense = () => {
        if (licenseId.value === "") {
            setLicenseId({
                value: "",
                error: "Please select license type",
            });
        } else if (requestType.value === "") {
            setRequestType({
                value: '',
                error: 'Please select request type'
            });
        } else if (description.value === "'") {
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

    const requestLicense = () => {
        const licenseInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        setLicenses({...licenses, saving: true});

        const data = {
            license_id:licenseId.value,
            organization_id:accountData.user.organization_id.id,
            license_period:licensePeriod.value,
            license_period_count:parseInt(licensePeriodCount.value),
            requested_by:accountData.user.id,
            request_type:requestType.value,
            description: description.value
        }
        licenseInstance
            .post(new BackendService().LICENSE_REQUEST, data)
            .then(function (response) {
                setLicenses({...licenses, saving: false});
                var d = response.data;
                var lcs = licenses.data;
                const newLicense = d.data;
                newLicense['license_name'] = newLicense.license_id.name
                lcs.unshift(newLicense);
                setLicenses({
                    ...licenses,
                    data: lcs,
                });
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
        setLicenseId({value: "", error: ""});
        setLicensePeriod({value: "", error: ""});
        setLicensePeriodCount({value: "", error: ""});
        setRequestType({value: "", error: ""});
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
                                        <CheckCircle fontSize="small" />
                                    ) : (
                                        <Block fontSize="small" />
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
        searchPlaceholder: "Search License...",
        selectableRowsOnClick: true,
        fixedHeader: true,
        onCellClick: (cellData, cellMeta) => {
            var license = licenses.data[cellMeta.dataIndex];

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
        },
        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <CustomLicenseToolbar
                selectedRows={selectedRows}
                displayData={displayData}
                setSelectedRows={setSelectedRows}
                toggleUser={()=>{}}
                openEdit={()=>{}}
                toggling={licenses.toggling}
            />
        ),
    };

    // end table config

    return(
        <div className={classes.root}>
            {/* Dialogs ends here */}
            <Box display="flex" style={{display: "flex"}}>
                <Box mr={2}>
                    {" "}
                    <NoteOutlined color="primary" fontSize="large" />
                </Box>
                <Typography variant="h5" className={classes.title}>
                    <b>Approved Licenses</b>
                </Typography>

            </Box>
            <Box style={{marginTop: 20}} />

            {licenses.loading && <LinearProgress />}
            <MUIDataTable
                title={"List of Approved License"}
                data={licenses.data}
                columns={columns}
                options={options}
            />
        </div>
    );
}


function CustomLicenseToolbar(props) {
    const { toggleUser, displayData, selectedRows, openEdit } = props;
    var check = displayData[selectedRows?.data[0]?.index].data[5] == "ENABLED";
    return (
        <Box display="flex" alignItems="center">
            <Button
                color="primary"
                variant="outlined"
                size="small"
                startIcon={<VisibilityOutlined />}
                onClick={() =>
                    openEdit(displayData[selectedRows?.data[0]?.index]?.data[0])
                }
            >
                View License
            </Button>


        </Box>
    );
}

export default withLocalize(LicenseRequestReport);