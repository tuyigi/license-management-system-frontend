import React, {useState, useEffect} from "react";

import {withLocalize, Translate} from 'react-localize-redux';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {
    OrganizationTypeStats, useApprovedLicenseTypeStats,
    useGeneralStats,
    useLicenseRequestStatusStats,
    useOrganizationTypeStats
} from "../../hooks/use_dashboard";

import {
    Button,
    Paper,
    Grid,
    Typography,
    Box,
    Chip,
    List,
    ListItem,
    ListItemText,
    LinearProgress,
    ListItemIcon,
    ListItemSecondaryAction,
    Avatar,
    ListItemAvatar,
    IconButton,
    Divider,
    CircularProgress
} from '@material-ui/core';

import {
    ArrowDropDown,
    Dashboard as DDashboard,
    AccountCircle,
    DirectionsBus,
    ArrowDropUp,
    Today,
    CancelPresentation,
    Event,
    CallSplit,
    DevicesOther,
    PhoneAndroid,
    AccountBalanceWallet
} from '@material-ui/icons';

import Chart from 'react-apexcharts'

import MUIDataTable from "mui-datatables";
import {format} from "date-fns/esm";
import LicenseRequestsIcon from "../../assets/img/license requests.png";
import CompanyIcon from "../../assets/img/company.png";
import UsersIcon from "../../assets/img/users.png";


import {useSnackbar} from 'notistack';
import {allocatedLicenseChart, licenseRequestStats, organizationStats} from "../../hooks/dashboard_data";
import Format from "date-fns/format";

const useStyles = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        flexFlow: 1,
        [theme.breakpoints.up('sm')]: {
            marginLeft: 250,
        }
    },
    paper: {
        padding: theme.spacing(2),
        height: 200,
        elevation: 0
    },
    paper3: {
        padding: theme.spacing(2),
        height: "100px",
        elevation: 0
    },
    paper1: {
        padding: theme.spacing(2),
        height: 380,
        elevation: 0
    },
    paper2: {
        padding: theme.spacing(2),
        elevation: 0
    },
    title: {
        [theme.breakpoints.down('sm')]: {
            fontSize: "12px",
        }
    },
    formTitle: {
        flexGrow: 1,
    },
}));


function Dashboard() {
    const classes = useStyles();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [generalStatsData, getGeneralStats] = useGeneralStats();
    const [organizationTypeStats, getOrganizationTypeStats] = useOrganizationTypeStats();
    const [licenseRequestStatusStats, getLicenseRequestStatusStats] = useLicenseRequestStatusStats();

    const [approvedLicenseRequestStats, getApprovedLicenseTypeStats] = useApprovedLicenseTypeStats()

    useEffect(() => {

    }, []);

    return (
        <div className={classes.root}>
            <Box style={{display: "flex"}}>
                <Box style={{display: "flex",}} className={classes.formTitle}><DDashboard color="primary" fontSize="medium"/><Typography
                    variant="h6">Dashboard</Typography></Box>
                <Event fontSize="large" color="primary"/><Typography
                variant="h6">{format(new Date(), ["yyyy-MM-dd"])}</Typography>
            </Box>
            <Box style={{marginTop: 10}}>
                <Grid container spacing={1}>
                    {/* overview  */}
                    <Grid item xs={12} md={4}>
                        <Paper className={classes.paper3} elevation={0}>
                            <Grid container>
                                <Grid item xs={8} md={8}>
                                    <Box style={{display: "flex", justifyContent: "center"}}><Typography
                                        variant="h8"><b>License Requests</b></Typography></Box>
                                    <Box style={{display: "flex", justifyContent: "center", marginTop: 10}}><Typography
                                        variant="h6">{generalStatsData?.data?.license_requests}</Typography></Box>
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    <Box style={{padding: 5}}>
                                        <img src={LicenseRequestsIcon} width="80px" height="60px"/>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper className={classes.paper3} elevation={0}>
                            <Grid container>
                                <Grid item xs={8} md={8}>
                                    <Box style={{display: "flex", justifyContent: "center"}}><Typography
                                        variant="h8"><b>Organizations</b></Typography></Box>
                                    <Box style={{display: "flex", justifyContent: "center", marginTop: 10}}><Typography
                                        variant="h6">{generalStatsData?.data?.organizations}</Typography></Box>
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    <Box style={{padding: 5}}>
                                        <img src={CompanyIcon}/>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4} lg={4} sm={4}>
                        <Paper className={classes.paper3} elevation={0}>
                            <Grid container>
                                <Grid item xs={8} md={8}>
                                    <Box style={{display: "flex", justifyContent: "center"}}><Typography
                                        variant="h8"><b>Users</b></Typography></Box>
                                    <Box style={{display: "flex", justifyContent: "center", marginTop: 10}}><Typography
                                        variant="h6">{generalStatsData?.data?.users}</Typography></Box>
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    <Box style={{padding: 5}}>
                                        <img src={UsersIcon}/>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} sm={6}>
                        <Paper style={{minHeight: 380,}} elevation={0}>
                            <Typography style={{marginLeft: 20}}> License Usage Statistics  </Typography>
                            <Chart options={allocatedLicenseChart(approvedLicenseRequestStats).options} series={allocatedLicenseChart(approvedLicenseRequestStats).series}
                                   type="bar" height={350}/>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} sm={6}>
                        <Paper style={{minHeight: 380, display: 'flex'}} elevation={0}>
                            <Typography style={{marginLeft: 20}}> License Requests </Typography>
                            <Chart style={{marginTop: 50}} type="donut" options={licenseRequestStats(licenseRequestStatusStats).options}
                                   series={licenseRequestStats(licenseRequestStatusStats).series}  width={380}/>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default withLocalize(Dashboard);
