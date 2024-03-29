import React, { useState, useEffect } from "react";
import { withLocalize, Translate } from "react-localize-redux";
import { makeStyles, useTheme } from "@material-ui/styles";

import { Container, Box } from "@material-ui/core";
import {
    Typography,
    AppBar,
    Toolbar,
    Link,
    CardActionArea,
    TextField,
    Button,
    Paper,
    FormControlLabel,
    Checkbox,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Switch,
    Popover,
    Divider,
    Menu
} from "@material-ui/core";
import {
    Grid,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText,
    LinearProgress,
    Select,
    FormHelperText,
    InputLabel,
    MenuItem,
    FormControl,
    CircularProgress,
    useMediaQuery
} from "@material-ui/core";

import {
    DesktopMac,
    Add,
    FilterList,
    Business,
    Assignment,
    Close,
    Search,
    Block,
    MoreVert,
    BusinessCenter,
    ChevronRight,
    SupervisedUserCircle,
    BusinessCenterOutlined,
    Apartment,
    BusinessCenterTwoTone,
    Store
} from "@material-ui/icons";

import { Skeleton, Pagination } from "@material-ui/lab";
import NoData from "../../assets/svg/no_data.svg";
import {BackendService} from "../../utils/web_config";
import axios from "axios";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";



const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      [theme.breakpoints.up("sm")]: {
        marginLeft: 250,
      },
    },
    title: {
      flexGrow: 1,
    },
    btn: {
      textTransform: "capitalize",
    },
    btn2: {
      borderRadius: 15,
    },
    paper: {
      padding: 15,
    },
    action: {
      borderRadius: 15,
    },
    card: {
      borderRadius: 15,
    },
  }));


function getSteps() {
    return ["Organization Info", "Representative Info", "Review"];
}

function Organizations(props) {
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();
    const [addNewOpen, setAddNewOpen] = useState(false);
    const [organizations, setOrganizations] = useState({
        saving: false,
        loading: false,
        page: 0,
        pages: 1,
        count: 20,
        per_page: 20,
        data: [],
    });

    // get organizations

    const getOrganizations = (token) => {
        const organizationInstance = axios.create(new BackendService().getHeaders(token));
        setOrganizations({...organizations, loading: true});
        organizationInstance
            .get(new BackendService().ORGANIZATIONS)
            .then(function (response) {
                setOrganizations({...organizations, loading: false});
                const d = response.data;
                var orgs = d.data;
                setOrganizations({
                        ...organizations,
                        data: orgs,
                    });

            })
            .catch(function (error) {
                setOrganizations({...organizations, loading: false});
                var e = error.message;

                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    };

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




    //// 
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const [accountData,setAccountData] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [organizationName, setOrganizationName] = useState({ value: "", error: "" });
    const [organizationTin, setOrganizationTin] = useState({ value: "", error: "" });
    const [province, setProvince] = useState({ value: "", error: "" });
    const [representativeName, setRepresentativeName] = useState({ value: "", error: "" });
    const [representativePhoneNumber, setRepresentativePhoneNumber] = useState({ value: "", error: "" });
    const [organizationType, setOrganizationType] = useState({ value: "", error: "" });

    useEffect(()=>{
        const accData = new BackendService().accountData;
        setAccountData(accData);
        getOrganizations(accData.access_token)

    },[])

    const onOrgNameChange = (event) => {
        if (event.target.value === "") {
            setOrganizationName({
                value: "",
                error: "Please enter valid name",
            });
        } else {
            setOrganizationName({value: event.target.value, error: ""});
        }
    };
    const onOrgTinChange = (event) => {
        if (event.target.value === "") {
            setOrganizationTin({
                value: "",
                error: "Please enter valid name",
            });
        } else {
            setOrganizationTin({value: event.target.value, error: ""});
        }
    };
    const onOrgTypeChange = (event) => {
        if (event.target.value === "") {
            setOrganizationType({
                value: "",
                error: "Please select organization type",
            });
        } else {
            setOrganizationType({value: event.target.value, error: ""});
        }
    };
    const onOrgProvChange= (event) =>{
        if (event.target.value === "") {
            setProvince({
                value: "",
                error: "Please select province",
            });
        } else {
            setProvince({value: event.target.value, error: ""});
        }
    }
    const onRepNameChange= (event)=>{
        if (event.target.value === "") {
            setRepresentativeName({
                value: "",
                error: "Please enter representative name",
            });
        } else {
            setRepresentativeName({value: event.target.value, error: ""});
        }
    }
    const onRepPhoneChange = (event) => {
        if (event.target.value === "") {
            setRepresentativePhoneNumber({
                value: "",
                error: "Please enter representative phone",
            });
        } else {
            setRepresentativePhoneNumber({value: event.target.value, error: ""});
        }
    }

    const registerOrganization = ()=>{
        if(activeStep != steps.length - 1){
            setActiveStep(activeStep+1);
            return;
        }
        if (representativePhoneNumber.value === "") {
            setRepresentativePhoneNumber({
                value: "",
                error: "Please enter representative phone",
            });
        }else if (representativeName.value === "") {
            setRepresentativeName({
                value: "",
                error: "Please enter representative name",
            });
        }else if (province.value === "") {
            setProvince({
                value: "",
                error: "Please select province",
            });
        }else if (organizationType.value === "") {
            setOrganizationType({
                value: "",
                error: "Please select organization type",
            });
        }else if (organizationTin.value === "") {
            setOrganizationTin({
                value: "",
                error: "Please enter valid name",
            });
        }else if (organizationName.value === "") {
            setOrganizationName({
                value: "",
                error: "Please enter valid name",
            });
        }else {
            createOrganization();
        }
    }

    const createOrganization = () =>{
        const organizationInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        setOrganizations({...organizations, saving: true});

        const data = {
            name: organizationName.value,
            tin: organizationTin.value,
            province: province.value,
            representative_name: representativeName.value,
            representative_phone_number: representativePhoneNumber.value,
            organization_type : organizationType.value
        }

        organizationInstance
            .post(new BackendService().ORGANIZATIONS, data)
            .then(function (response) {
                setOrganizations({...organizations, saving: false});
                var d = response.data;
                var lcs = organizations.data;
                const newOrganization = d.data;
                lcs.unshift(newOrganization);
                setOrganizations({
                    ...organizations,
                    data: lcs,
                });
                clearLicenseInfo()
                notify("success", response.data.message);
                setAddNewOpen(false);
            })
            .catch(function (error) {
                setOrganizations({...organizations, saving: false});
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    }

    const clearLicenseInfo=()=>{
        setActiveStep(0);
        setOrganizationName({ value: "", error: "" });
        setOrganizationTin({ value: "", error: "" });
        setProvince({ value: "", error: "" });
        setRepresentativeName({ value: "", error: "" });
        setRepresentativePhoneNumber({ value: "", error: "" });
        setOrganizationType({ value: "", error: "" });
    }


    return (
        <div className={classes.root}>
            {/* //////////////////////// */}

            {/* New organization dialog */}
            <Dialog
                open={addNewOpen}
                maxWidth="sm"
                fullWidth
                onClose={() => setAddNewOpen(false)}
            >
                <DialogTitle id="new-op">
                    New Organization
                </DialogTitle>
                <DialogContent>
                    <Box width={1}>
                        <Stepper
                            activeStep={activeStep}
                            alternativeLabel
                            style={{ padding: 0 }}
                        >
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <div>
                            {activeStep === steps.length ? (
                                <div>
                                    <Typography className={classes.instructions}>
                                        All steps completed
                                    </Typography>
                                    <Button>Reset</Button>
                                </div>
                            ) : (
                                <div>
                                    {activeStep == 0 ? (
                                        <Box>
                                            <Box style={{marginTop: 10}}>
                                                <Translate>
                                                    {({ translate }) => (
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                            type="text"
                                                            value={organizationName.value}
                                                            placeholder={"Organization Name"}
                                                            label={"Organization Name"}
                                                            fullWidth
                                                            onChange={onOrgNameChange}
                                                            helperText={organizationName.error}
                                                            error={organizationName.error !== ""}
                                                        />
                                                    )}
                                                </Translate>
                                            </Box>
                                            <Box style={{marginTop: 10}}>
                                                <Translate>
                                                    {({ translate }) => (
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                            type="text"
                                                            value={organizationTin.value}
                                                            placeholder={"Organization TIN"}
                                                            label={"Organization TIN"}
                                                            fullWidth
                                                            onChange={onOrgTinChange}
                                                            helperText={organizationTin.error}
                                                            error={organizationTin.error !== ""}
                                                        />
                                                    )}
                                                </Translate>
                                            </Box>

                                            <Box style={{marginTop: 10}}>
                                                    <FormControl
                                                        className={classes.formControl}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        error={organizationType.error !== ""}
                                                    >
                                                        <InputLabel id="type">
                                                            Organization Type
                                                        </InputLabel>
                                                        <Select
                                                            label={"Organization Type"}
                                                            value={organizationType.value}
                                                            onChange={onOrgTypeChange}
                                                        >
                                                            <MenuItem value="EMONEY">EMONEY</MenuItem>
                                                            <MenuItem value="REMITTANCE">REMITTANCE</MenuItem>
                                                            <MenuItem value="PAYMENT_AGGREGATOR">
                                                                PAYMENT_AGGREGATOR
                                                            </MenuItem>
                                                            <MenuItem value="PAYMENT_SYSTEM_OPERATOR">PAYMENT SYSTEM OPERATOR</MenuItem>
                                                            <MenuItem value="CHEQUE_PRINTING_COMPANY">CHEQUE PRINTING COMPANY</MenuItem>
                                                            <MenuItem value="CSD_STOCK_BROKER">CSD STOCK BROKER</MenuItem>
                                                        </Select>
                                                        <FormHelperText>{organizationType.error}</FormHelperText>
                                                    </FormControl>
                                                </Box>
                                         

                                            <Box style={{marginTop: 10}}>
                                                
                                                    <FormControl
                                                        className={classes.formControl}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        error={province.error !== ""}
                                                    >
                                                        <InputLabel id="type">
                                                            Province
                                                        </InputLabel>
                                                        <Select
                                                            label={"Province"}
                                                            value={province.value}
                                                            onChange={onOrgProvChange}
                                                        >
                                                            <MenuItem value="Kigali">Kigali</MenuItem>
                                                            <MenuItem value="Western">Western</MenuItem>
                                                            <MenuItem value="Northern">Northern</MenuItem>
                                                            <MenuItem value="Eastern">Eastern</MenuItem>
                                                            <MenuItem value="Sourthern">Sourthern</MenuItem>
                                                        </Select>
                                                        <FormHelperText>{province.error}</FormHelperText>
                                                    </FormControl>
                                           
                                            </Box>


                                        </Box>
                                    ) : activeStep === 1 ? (
                                        <Box>
                                            <Box style={{marginTop: 10}}>
                                                <Translate>
                                                    {({ translate }) => (
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                            type="text"
                                                            value={representativeName.value}
                                                            placeholder={"Representative Name"}
                                                            label={"Representative Name"}
                                                            fullWidth
                                                            onChange={onRepNameChange}
                                                            helperText={representativeName.error}
                                                            error={representativeName.error !== ""}
                                                        />
                                                    )}
                                                </Translate>
                                            </Box>

                                            <Box style={{marginTop: 10}}>
                                                <Translate>
                                                    {({ translate }) => (
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                            type="text"
                                                            value={representativePhoneNumber.value}
                                                            placeholder={"Representative Phone"}
                                                            label={"Representative Phone"}
                                                            fullWidth
                                                            onChange={onRepPhoneChange}
                                                            helperText={representativePhoneNumber.error}
                                                            error={representativePhoneNumber.error !== ""}
                                                        />
                                                    )}
                                                </Translate>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Box m={4}>
                                            <Typography align="center">
                                                DONE
                                            </Typography>
                                        </Box>
                                    )}
                                </div>
                            )}
                        </div>

                        <Box mt={3} />
                        <DialogActions>
                            <Button
                                variant="outlined"
                                color="primary"
                                disableElevation
                                onClick={() => {
                                    activeStep === 0 ? setAddNewOpen(false) : handleBack();
                                }}
                            >
                                {activeStep === 0 ? (
                                    "Cancel"
                                ) : (
                                    "Back"
                                )}
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                disableElevation
                                disabled={organizations.saving}
                                onClick={() => {
                                        registerOrganization();
                                }}
                            >
                                {organizations.saving ? (
                                    <CircularProgress size={25} />
                                ) : activeStep === steps.length - 1 ? (
                                    "Save"
                                ) : (
                                    "Continue"
                                )}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
            {/* //////////////////////////// */}

            {/* Dialogs ends here */}

            <Box style={{display: "flex"}}>
                <Box mr={2}>
                    {" "}
                    <Business color="primary" fontSize="large" />
                </Box>
                <Typography variant="h5" className={classes.title}>
                    <b>Organizations</b>
                </Typography>
                <IconButton color="primary">
                    <Search />
                </IconButton>


                {!matches ? (
                    <>
                        <IconButton onClick={(e) => setMenuOpen(e.currentTarget)}>
                            <MoreVert />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={menuOpen}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            open={menuOpen != null}
                            onClose={() => setMenuOpen(null)}
                        >
                            <MenuItem
                                onClick={() => {

                                }}
                            >
                                Filter
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Box ml={2} display="flex" height={40}>
                        <Button
                            className={classes.btn}
                            color="primary"
                            variant="outlined"
                            size="medium"
                            startIcon={<FilterList />}
                            disableElevation
                        >
                            Filter
                        </Button>
                    </Box>
                )}

            </Box>
            <Box mt={3} style={{marginTop: 10}} />

            <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={4} lg={2}>
                    <Box
                        style={{ display:"flex",
                        justifyContent:"center",
                        alignItems:"center",
                        flexDirection:"column"}}
                    >
                        <CardActionArea
                            className={classes.action}
                            onClick={() => {
                                setAddNewOpen(true);

                            }}
                        >
                            <Box
                            width={1}

                                style={{height:"150px",
                                display:"flex",
                                justifyContent:"center",
                                alignItems:"center",
                                flexDirection:"column",
                                border:1,
                                borderStyle:"dotted",
                                borderRadius:"borderRadius",
                                borderColor:"grey.300"}}
                                className={classes.btn2}
                            >
                                <Add fontSize="large" />
                            </Box>
                        </CardActionArea>
                        <Box  style={{marginTop: 10}}>
                            <Typography color="inherit">Add new</Typography>
                            <Typography color="textSecondary" variant="caption">
                                New Organization
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {organizations.data.length == 0 && !organizations.loading && (
                    <Box
                        p={2}
                        style={{display:"flex",
                        alignItems:"center",
                        flexDirection:"column",
                        justifyContent:"center",
                        height:500}}
                    >
                        <Box style={{marginTop: 10, marginLeft: 200}}>
                            <img src={NoData} alt="Empty data" height={200} />
                        </Box>
                        <br/>
                        <Box style={{marginTop: 10, marginLeft: 200}}>
                        <Typography color="textSecondary">
                            There are no organization available yet, create one first
                        </Typography>
                        </Box>
                    </Box>
                )}
                {organizations.loading
                    ? [1, 2, 3, 4, 5].map((o, i) => (
                        <Grid item xs={6} sm={4} md={4} lg={2}>
                            <Box
                           
                                width={1}
                                style={{display:"flex",
                                flexDirection:"column",
                                justifyContent:"center",
                                alignItems:"center",
                                borderRadius:15}}
                            >
                                <Skeleton
                                    variant="rect"
                                    height={150}
                                    width={"100%"}
                                    style={{ borderRadius: 15 }}
                                />

                                <Skeleton
                                    variant="text"
                                    width={"68%"}
                                    style={{ borderRadius: 7 }}
                                />
                            </Box>
                        </Grid>
                    ))
                    : organizations.data.map((org, i) => (
                        <Grid item xs={6} sm={4} md={4} lg={2}>
                            <Box
                                style={{ display:"flex",
                                justifyContent:"center",
                                alignItems:"center",
                                flexDirection:"column"}}
                            >
                                <CardActionArea
                                    className={classes.action}
                                    onClick={() => {


                                    }}
                                >
                                    <Paper className={classes.card} elevation={0}>
                                        <Box
                                            width={1}
                                            style={{
                                                height:"150px",
                                                display:"flex",
                                            justifyContent:"center",
                                            alignItems:"center",
                                            flexDirection:"column",
                                            border:0,
                                            borderRadius:"borderRadius",
                                            borderColor:"grey.300"}}
                                        >
                                            {org.status == "DISABLED" && (
                                                <Box
                                                    height={1}
                                                    width={1}
                                                    p={1}
                                 
                                                    style={{ position: "absolute",display:"flex",
                                                    justifyContent:"flex-end",
                                                    alignItems:"flex-start" }}
                                                >
                                                    <Block color="secondary" />
                                                </Box>
                                            )}
                                            <Business fontSize="large" />
                                        </Box>
                                    </Paper>
                                </CardActionArea>
                                <Box mt={1}>
                                    <Typography color="inherit">{org.name}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
            </Grid>
            <Box width={1} style={{display: "flex", justifyContent:"center", marginTop: 10}} >
                <Pagination
                    disabled={organizations.loading || organizations.pages == null}
                    count={organizations.pages}
                    page={organizations.page + 1}
                    onChange={(e, v) => {
                        // getOrganization(accountData.token, v - 1, { has: accountData.user_has_allowed_operator, id: accountData.user_id });
                    }}
                    size="large"
                />
            </Box>
        </div>
    );
}
export default withLocalize(Organizations);