import React,{useState,useEffect} from "react";
import { withLocalize, Translate } from 'react-localize-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {Button,Paper,Grid, Typography,Box,Chip,List,ListItem,ListItemText,LinearProgress,ListItemIcon,ListItemSecondaryAction,Avatar,ListItemAvatar,IconButton,Divider,CircularProgress } from '@material-ui/core';
import {
    Dashboard as DDashboard,
    Event,
    VisibilityOutlined
} from '@material-ui/icons';
import Chart from 'react-apexcharts'
import { format } from "date-fns/esm";
import PendingIcon from "../../assets/img/pending.png";
import RejectIcon from "../../assets/img/reject.png";
import ApproveIcon from "../../assets/img/approve.png";
import ToolsIcon from "../../assets/img/tools.png";
import { useSnackbar } from 'notistack';
import {useOrganizationLicenseRequest, useOrganizationMyLicense} from "../../hooks/use_hooks";
import {BackendService} from "../../utils/web_config";
import {
    allocatedLicenseChart,
    licenseRequestStats,
    organizationLicenseRequestStats,
    vendorPaymentDeparmentsChart
} from "../../hooks/dashboard_data";
import {
    useApprovedLicenseTypeStats,
    useOrganizationLicenseRequestStatusStats,
    usePaymentStatusContractDepartmentStats, useSystemToolStats,
    useTotalCertificateDepartmentStats, useTotalContractDepartmentStats, useVendorPaymentDeparmentsStats
} from "../../hooks/use_dashboard";
import ReviewIcon from "../../assets/img/review.png";
import {Link, useHistory} from "react-router-dom";


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
        elevation:0,
        cursor: 'pointer'
    },
    paper1: {
        padding: theme.spacing(2),
        height:380,
        elevation:0,
        cursor: 'pointer'
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
    const history = useHistory()
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [licenseRequestStatusStats, getLicenseRequestStatusStats] = useOrganizationLicenseRequestStatusStats();
    const [certificateStats, getCertificateStats] = useTotalCertificateDepartmentStats();
    const [paymentStatusStats, getPaymentStatusStats] = usePaymentStatusContractDepartmentStats();
    const [contractStats, getContractStats] = useTotalContractDepartmentStats();
    const [systemStats, getSystemStats] = useSystemToolStats();
    const [vendorPaymentDeparmentsStats, getVendorPaymentDeparmentsStats] = useVendorPaymentDeparmentsStats()
    useEffect(()=>{
        var accountData = new BackendService().accountData;
    },[]);


    return(
        <div className={classes.root}>
            <Box  style={{display: "flex"}}>
                <Box style = {{display: "flex", }} className={classes.formTitle}><DDashboard color="primary" fontSize="medium"/><Typography variant="h6">Dashboard</Typography></Box>
                <Event fontSize="large" color="primary"/><Typography  variant="h6">{format(new Date(), ["yyyy-MM-dd"])||0}</Typography>
            </Box>
            <Box style={{marginTop: 10}}>
                <Grid container spacing={1}>
                    {/* overview  */}
                    <Grid item xs={12} md={3} >
                        <Paper className={classes.paper3} elevation={0} onClick={()=>{
                            history.push("/orgAdmin/certificates")
                        }}>
                            <Grid container>
                                <Grid item xs={8} md={8}>
                                    <Box style={{display: "flex",justifyContent:"center"}} ><Typography variant="h8"><b>Certificates</b></Typography></Box>
                                    <Box style={{display: "flex",justifyContent:"center", marginTop: 10}}><Typography variant="h6">{certificateStats?.data?.total_certificates||0}</Typography></Box>
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    <Box style={{padding: 5}}>
                                        <img src={ReviewIcon} width="50px" height="50px" />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                    </Grid>
                    <Grid item xs={12} md={3} lg={3} sm={3} >
                    <Paper className={classes.paper3} elevation={0} onClick={()=>{
                        history.push("/orgAdmin/systemTool");
                    }}>
                        <Grid container>
                            <Grid item xs={8} md={8}>
                                <Box style={{display: "flex",justifyContent:"center"}} ><Typography variant="h8"><b>System/Tools</b></Typography></Box>
                                <Box style={{display: "flex",justifyContent:"center", marginTop: 10}}><Typography variant="h6">{systemStats?.data?.total||0}</Typography></Box>
                            </Grid>
                            <Grid item xs={4} md={4}>
                                <Box style={{padding: 5}}>
                                    <img src={ToolsIcon} width="50px" height="50px" />
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                    </Grid>

                    <Grid item xs={12} md={3} lg={3} sm={3} >
                        <Paper className={classes.paper3} elevation={0}>
                            <Grid container>
                                <Grid item xs={8} md={8}>
                                    <Box style={{display: "flex",justifyContent:"center"}}><Typography variant="h8" ><b>Paid Payment Periods</b></Typography></Box>
                                    <Box style={{display: "flex",justifyContent:"center", marginTop: 10}}><Typography variant="h6">{paymentStatusStats?.data?.find((d)=>d.payment_status==="PAID")?.count||0}</Typography></Box>
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
                        <Paper className={classes.paper3} elevation={0} onClick={()=>{
                            history.push("/orgAdmin/contracts");
                        }}>
                            <Grid container>
                                <Grid item xs={8} md={8}>
                                    <Box style={{display: "flex",justifyContent:"center"}}><Typography variant="h8" ><b>Contracts</b></Typography></Box>
                                    <Box style={{display: "flex",justifyContent:"center", marginTop: 10}}><Typography variant="h6">{contractStats?.data?.total_contracts||0}</Typography></Box>
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
                        <Paper style={{minHeight: 400,display:"flex",flexDirection:"column"}} elevation={0}>
                            <Typography style={{marginLeft:10,marginTop:10}}><b>License Requests Summary</b></Typography>
                            <Chart style={{marginTop:50}} type="donut" options={organizationLicenseRequestStats(licenseRequestStatusStats).options}
                                   series={organizationLicenseRequestStats(licenseRequestStatusStats).series}  width={380}/>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8} lg={8} sm={8}>
                        <Paper style={{minHeight: 300,display:"flex",flexDirection:"column"}} elevation={0}>
                            <Typography style={{marginLeft:10,marginTop:10}}><b>Certificate Expiration Summary</b></Typography>
                            <Box>
                                <Chart options={vendorPaymentDeparmentsChart(vendorPaymentDeparmentsStats).options} series={vendorPaymentDeparmentsChart(vendorPaymentDeparmentsStats).series} type="area" height={350} />
                                {/*<List>*/}
                                {/*    {myLicense?.map((data,i)=>{*/}
                                {/*        console.log(data);*/}
                                {/*        console.log(i);*/}
                                {/*        return (<ListItem*/}
                                {/*            key={i}*/}
                                {/*            dense*/}
                                {/*        >*/}
                                {/*            <ListItemText*/}
                                {/*                primary={`${data.license_id.name} | ${data.license_period_count} ${data.license_period} `}*/}
                                {/*                secondary={data.license_id.description}*/}
                                {/*            />*/}
                                {/*            <ListItemSecondaryAction>*/}
                                {/*                {data.license_id.license_category!='SOFTWARE_LICENSE'&&<IconButton*/}
                                {/*                    onClick={()=>{*/}
                                {/*                        window.open("http://localhost:8000/api/v1/licenseRequest/download/"+data.id, "_blank");*/}
                                {/*                    }}*/}
                                {/*                >*/}
                                {/*                    <VisibilityOutlined fontSize="small" />*/}
                                {/*                </IconButton>*/}
                                {/*                }*/}
                                {/*            </ListItemSecondaryAction>*/}
                                {/*        </ListItem>);*/}
                                {/*    })}*/}
                                {/*</List>*/}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default withLocalize(Dashboard);
