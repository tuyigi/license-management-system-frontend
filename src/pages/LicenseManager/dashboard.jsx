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
    useEffect(()=>{

    },[]);

    // metric organization  by type
    const [ allocatedLicenseChart, setAllocatedLicenseChart ] = useState(
        {

            series: [{
                data: [21, 22, 10, 28, 16, 21]
            }],
            options: {
                chart: {
                    height: 350,
                    type: 'bar',
                    events: {
                        click: function(chart, w, e) {
                            // console.log(chart, w, e)
                        }
                    }
                },
                colors: [],
                plotOptions: {
                    bar: {
                        columnWidth: '45%',
                        distributed: true,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                xaxis: {
                    categories: [
                        'E-Money',
                        'Remittance',
                        'Payment aggregation',
                        'Payment System Operator',
                        'Cheque Printing',
                        'CSD Stock Broker',
                    ],
                    labels: {
                        style: {
                            colors: [],
                            fontSize: '12px'
                        }
                    }
                }
            },


        }
    );


    // metric license request by status
    const [ licenseRequestStatusChart, setLicenseRequestStatusChart ] = useState(
        {
            options: {
                series: [44, 55, 41, 17],
                labels: ['PENDING', 'REVIEWED', 'APPROVED', 'REJECTED']},
        }
    );


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
                                    <Box style={{display: "flex",justifyContent:"center", marginTop: 10}}><Typography variant="h6">0</Typography></Box>
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
                                    <Box style={{display: "flex",justifyContent:"center", marginTop: 10}}><Typography variant="h6">0</Typography></Box>
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    <Box style={{padding: 5}}>
                                        <img src={ReviewIcon}  width="50px" height="50px"  />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={3} lg={3} sm={3} >
                        <Paper className={classes.paper3} elevation={0}>
                            <Grid container>
                                <Grid item xs={8} md={8}>
                                    <Box style={{display: "flex",justifyContent:"center"}}><Typography variant="h8" ><b>Approved</b></Typography></Box>
                                    <Box style={{display: "flex",justifyContent:"center", marginTop: 10}}><Typography variant="h6">0</Typography></Box>
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    <Box style={{padding: 5}}>
                                        <img src={ApproveIcon}  width="50px" height="50px"  />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={3} lg={3} sm={3} >
                        <Paper className={classes.paper3} elevation={0}>
                            <Grid container>
                                <Grid item xs={8} md={8}>
                                    <Box style={{display: "flex",justifyContent:"center"}}><Typography variant="h8" ><b>Rejected</b></Typography></Box>
                                    <Box style={{display: "flex",justifyContent:"center", marginTop: 10}}><Typography variant="h6">0</Typography></Box>
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
                            <Typography style={{marginLeft: 20}}> Licenses Status </Typography>
                            <Chart options={licenseRequestStatusChart.options} series={licenseRequestStatusChart.options.series} type="pie" height={350} />
                        </Paper>
                    </Grid>


                    <Grid item xs={12} md={8} lg={8} sm={8}>
                        <Paper style={{minHeight: 380,}} elevation={0}>
                            <Typography style={{marginLeft: 20}}> Licenses Allocated </Typography>
                            <Chart options={allocatedLicenseChart.options} series={allocatedLicenseChart.series} type="bar" height={350} />
                        </Paper>
                    </Grid>

                </Grid>
            </Box>
        </div>
    );
}

export default withLocalize(Dashboard);
