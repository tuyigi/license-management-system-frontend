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
    NoteOutlined,
    VisibilityOutlined, HelpOutline, Business, AvTimer, MergeType, DescriptionOutlined
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
                    var lcs = d.data.filter((d)=>d.request_status=="APPROVED");
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

    // dialog for displaying software license details
    const [currentApprovedLicense, setCurrentApprovedLicense] = useState(null);
    const [detailsDialog,setDetailsDialog] = useState(false);

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
                openEdit={(id)=>{
                    const approvedLicense = licenses.data.filter((d)=>d.id===id)[0];
                    console.log(approvedLicense);
                    if(approvedLicense['license_id']['license_category']=='SOFTWARE_LICENSE'){
                        setCurrentApprovedLicense(approvedLicense);
                        setDetailsDialog(true);
                    }else{
                        window.open("http://localhost:8000/api/v1/licenseRequest/download/"+id, "_blank");
                    }
                }}
                toggling={licenses.toggling}
            />
        ),
    };

    // end table config

    return(
        <div className={classes.root}>
            {/*start details dialog*/}
            <Dialog
                open={detailsDialog}
                maxWidth="sm"
                fullWidth
                onClose={() => {
                    setDetailsDialog(false);
                }}
            >
                <DialogContent>
                        <Box style={{display:'flex',justifyContent:'center'}}>
                            <Typography variant={"h5"}>License Details</Typography>
                        </Box>
                        <Box style={{display:'flex',justifyContent:'center',alignContent:'center',alignItems:'center',justifyItems:'center'}}>
                            <List dense={true}>
                                <ListItem>
                                    <ListItemIcon>
                                        <Receipt />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="License"
                                        secondary={currentApprovedLicense?.license_name}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <AvTimer />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Duration"
                                        secondary={`${currentApprovedLicense?.license_period_count} ${currentApprovedLicense?.license_period}`}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MergeType />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Request Type"
                                        secondary={`${currentApprovedLicense?.request_type}`}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <DescriptionOutlined />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Description"
                                        secondary={`${currentApprovedLicense?.description}`}
                                    />
                                </ListItem>
                            </List>
                        </Box>

                </DialogContent>

                <DialogActions>
                        <Button
                            onClick={() => {
                                setDetailsDialog(false)
                            }}
                            variant="outlined"
                            color="primary"
                        >
                            Close
                        </Button>
                </DialogActions>
            </Dialog>
            {/*end details dialog*/}
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
    return (
        <Box display="flex" alignItems="center">
            <Button
                color="primary"
                variant="outlined"
                size="small"
                startIcon={<VisibilityOutlined />}
                onClick={() =>{
                    openEdit(displayData[selectedRows?.data[0]?.index]?.data[0])
                }
            }
            >
                View License
            </Button>


        </Box>
    );
}

export default withLocalize(LicenseRequestReport);