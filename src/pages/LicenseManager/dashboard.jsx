import React,{useState,useEffect} from "react";
import { withLocalize, Translate } from 'react-localize-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {Button,Paper,Grid, Typography,Box,Chip,List,ListItem,ListItemText,LinearProgress,ListItemIcon,ListItemSecondaryAction,Avatar,ListItemAvatar,IconButton,Divider,CircularProgress } from '@material-ui/core';
import {ArrowDropDown,Dashboard as DDashboard,AccountCircle,DirectionsBus,ArrowDropUp,Today,CancelPresentation,Event,CallSplit,DevicesOther,PhoneAndroid,AccountBalanceWallet} from '@material-ui/icons';
import Chart from 'react-apexcharts'
import { format } from "date-fns/esm";
import ReviewIcon from "../../assets/img/review.png";
import PendingIcon from "../../assets/img/pending.png";
import RejectIcon from "../../assets/img/reject.png";
import ApproveIcon from "../../assets/img/approve.png";
import { useSnackbar } from 'notistack';
import Format from "date-fns/format";
import {useGlobalOrganizationLicenseRequest, useOrganizationLicenseRequest} from "../../hooks/use_hooks";
import {
    allocatedLicenseChart,
    licenseRequestStatusChart,
    organizationLicenseRequestStats
} from "../../hooks/dashboard_data";
import {
    useApprovedLicenseTypeStats,
    useLicenseRequestStatusStats,
    useOrganizationLicenseRequestStatusStats
} from "../../hooks/use_dashboard";

const useStyles = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        flexFlow:1,
        [theme.breakpoints.up('sm')]:{
            marginLeft:250,
        }
    },
    paper: {
        padding: theme.spacing(2),
        height:200,
        elevation:0
    },
    paper3: {
        padding: theme.spacing(2),
        height:"100px",
        elevation:0
    },
    paper1: {
        padding: theme.spacing(2),
        height:380,
        elevation:0
    },
    paper2: {
        padding: theme.spacing(2),
        elevation:0
    },
    title:{
        [theme.breakpoints.down('sm')]: {
            fontSize:"12px",
        }
    },
    formTitle:{
        flexGrow:1,
    },
}));


function Dashboard(){
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const licenseStats = useGlobalOrganizationLicenseRequest();
    const [licenseRequestStatusStats, getLicenseRequestStatusStats] = useLicenseRequestStatusStats()
    const [approvedLicenseRequestStats, getApprovedLicenseTypeStats] = useApprovedLicenseTypeStats()
    useEffect(()=>{

    },[]);


    return(
        <div className={classes.root}>
            <Box  style={{display: "flex"}}>
                <Box style = {{display: "flex", }} className={classes.formTitle}><DDashboard color="primary" fontSize="medium"/><Typography variant="h6">Dashboard</Typography></Box>
                <Event fontSize="large" color="primary"/><Typography  variant="h6">{format(new Date(), ["yyyy-MM-dd"])}</Typography>
            </Box>
            <Box style={{marginTop: 10}}>
                <Grid container spacing={1}>
                    {/* overview  */}
                    <Grid item xs={12} md={3} >
                        <Paper className={classes.paper3} elevation={0}>
                            <Grid container>
                                <Grid item xs={8} md={8}>
                                    <Box style={{display: "flex",justifyContent:"center"}} ><Typography variant="h8"><b>Pending</b></Typography></Box>
                                    <Box style={{display: "flex",justifyContent:"center", marginTop: 10}}><Typography variant="h6">{licenseStats.find((d)=>d.request_status==="PENDING")?.total===undefined?0:licenseStats.find((d)=>d.request_status==="PENDING")?.total}</Typography></Box>
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    <Box style={{padding: 5}}>
                                        <img src={PendingIcon} width="50px" height="50px" />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={3} >
                        <Paper className={classes.paper3} elevation={0}>
                            <Grid container>
                                <Grid item xs={8} md={8}>
                                    <Box style={{display: "flex",justifyContent:"center"}}><Typography variant="h8" ><b>Reviewed</b></Typography></Box>
                                    <Box style={{display: "flex",justifyContent:"center", marginTop: 10}}><Typography variant="h6">{licenseStats.find((d)=>d.request_status==="REVIEWED")?.total===undefined?0:licenseStats.find((d)=>d.request_status==="REVIEWED")?.total}</Typography></Box>
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    <Box style={{padding: 5}}>
                                        <img src={ReviewIcon}  width="50px" height="50px"  />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={3} lg={3} sm={3}>
                        <Paper className={classes.paper3} elevation={0}>
                            <Grid container>
                                <Grid item xs={8} md={8}>
                                    <Box style={{display: "flex",justifyContent:"center"}}><Typography variant="h8" ><b>Approved</b></Typography></Box>
                                    <Box style={{display: "flex",justifyContent:"center", marginTop: 10}}><Typography variant="h6">{licenseStats.find((d)=>d.request_status==="APPROVED")?.total===undefined?0:licenseStats.find((d)=>d.request_status==="APPROVED")?.total}</Typography></Box>
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    <Box style={{padding: 5}}>
                                        <img src={ApproveIcon}  width="50px" height="50px"  />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={3} lg={3} sm={3}>
                        <Paper className={classes.paper3} elevation={0}>
                            <Grid container>
                                <Grid item xs={8} md={8}>
                                    <Box style={{display: "flex",justifyContent:"center"}}><Typography variant="h8" ><b>Rejected</b></Typography></Box>
                                    <Box style={{display: "flex",justifyContent:"center", marginTop: 10}}><Typography variant="h6">{licenseStats.find((d)=>d.request_status==="REJECTED")?.total===undefined?0:licenseStats.find((d)=>d.request_status==="REJECTED")?.total}</Typography></Box>
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    <Box style={{padding: 5}}>
                                        <img src={RejectIcon}  width="50px" height="50px"  />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>


                    <Grid item xs={12} md={4} lg={4} sm={4}>
                        <Paper style={{minHeight: 380,}} elevation={0}>
                            <Typography style={{marginLeft: 20}}><b>Licenses Status</b></Typography>
                            {/*<Chart type="donut" options={licenseRequestStatusChart(licenseRequestStatusStats).options}*/}
                            {/*       series={licenseRequestStatusChart(licenseRequestStatusStats).series}  width={380}/>*/}
                            <Chart type="pie" options={licenseRequestStatusChart(licenseRequestStatusStats).options}
                                   series={licenseRequestStatusChart(licenseRequestStatusStats).series}  width={380}/>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8} lg={8} sm={8}>
                        <Paper style={{minHeight: 380,}} elevation={0}>
                            <Typography style={{marginLeft: 20}}><b>Licenses Allocated</b></Typography>
                            <Chart options={allocatedLicenseChart(approvedLicenseRequestStats).options} series={allocatedLicenseChart(approvedLicenseRequestStats).series} type="bar" height={350} />
                        </Paper>
                    </Grid>

                </Grid>
            </Box>
        </div>
    );
}

export default withLocalize(Dashboard);
