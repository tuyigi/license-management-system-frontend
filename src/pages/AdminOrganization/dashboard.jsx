import React,{useState,useEffect,useMemo} from "react";
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
    usePaymentStatusContractDepartmentStats,
    useSystemToolStats,
    useTotalCertificateDepartmentStats,
    useTotalContractDepartmentStats,
    useVendorPaymentDeparmentsStats,
    useLicenseContractsData,
    useCertificatesData, useContractToolsOptimizationData
} from "../../hooks/use_dashboard";
import ReviewIcon from "../../assets/img/review.png";
import {Link, useHistory} from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, Cell
} from 'recharts';


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
    const [vendorPaymentDeparmentsStats, getVendorPaymentDeparmentsStats] = useVendorPaymentDeparmentsStats();


    useEffect(()=>{
        var accountData = new BackendService().accountData;
    },[]);

    // Call all hooks at the top level
    const [licenseContractsStats] = useLicenseContractsData();
    const [certificates] = useCertificatesData();
    const [toolsOptimization] = useContractToolsOptimizationData();
    const chartData = useMemo(() => {
        if (licenseContractsStats.status !== 'success') return [];
        const currentYear = new Date().getFullYear();
        const months = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString('default', { month: 'short' }),
            count: 0,
        }));
        licenseContractsStats.data.forEach(license => {
            const endDate = new Date(license.end_date);
            if (endDate.getFullYear() === currentYear) {
                const monthIndex = endDate.getMonth();
                months[monthIndex].count += 1;
            }
        });
        return months;
    }, [licenseContractsStats]);

    const chartDataCertificates = useMemo(() => {
        if (certificates.status !== 'success') return [];
        const currentYear = new Date().getFullYear();

        const months = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString('default', { month: 'short' }),
            count: 0,
        }));

        certificates.data.forEach(cert => {
            const expiryDate = new Date(cert.expiry_date); // <-- FIXED
            if (expiryDate.getFullYear() === currentYear) {
                const monthIndex = expiryDate.getMonth();
                months[monthIndex].count += 1;
            }
        });

        return months;
    }, [certificates]);

    //Chart for optimization
    const chartDataToolsOptimization = useMemo(() => {
        if (toolsOptimization.status !== "success") return [];

        const tools = toolsOptimization.data?.toolsMetrics || [];
/* return tools.map(tool => ({
                    name: tool.system_tool_name,
                    entitlement: tool.entitlement,
                    utilisation: tool.utilisation,
                    license_gap: tool.license_gap,
                }));*/
        return tools.map(tool => ({
            name: tool.system_tool_name,
            shortName: tool.system_tool_name.length > 10
                ? `${tool.system_tool_name.slice(0, 10)}...`
                : tool.system_tool_name,
            entitlement: tool.entitlement,
            utilisation: tool.utilisation,
            license_gap: tool.license_gap,
        }));
            }, [toolsOptimization]);


// Then handle early return after hooks
   if (licenseContractsStats.status === 'loading' || certificates.status === 'loading') {
        return <p>Loading chart...</p>;
    }
    if (licenseContractsStats.status === 'error' || certificates.status === 'error') {
        return <p>Error loading data.</p>;
    }
    if (licenseContractsStats.status === 'empty' || certificates.status === 'empty') {
        return <p>No licenses or certificates found.</p>;
    }


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

{/*                    <Grid item xs={12} md={4} lg={4} sm={4}>
                        <Paper style={{minHeight: 400,display:"flex",flexDirection:"column"}} elevation={0}>
                            <Typography style={{marginLeft:10,marginTop:10}}><b>License Requests Summary</b></Typography>
                            <Chart style={{marginTop:50}} type="donut" options={organizationLicenseRequestStats(licenseRequestStatusStats).options}
                                   series={organizationLicenseRequestStats(licenseRequestStatusStats).series}  width={380}/>
                        </Paper>
                    </Grid>*/}

                   {/* <Grid item xs={12} md={8} lg={8} sm={8}>
                        <Paper style={{minHeight: 300,display:"flex",flexDirection:"column"}} elevation={0}>
                            <Typography style={{marginLeft:10,marginTop:10}}><b>Certificate Expiration Summary</b></Typography>
                            <Box>
                                <Chart options={vendorPaymentDeparmentsChart(vendorPaymentDeparmentsStats).options} series={vendorPaymentDeparmentsChart(vendorPaymentDeparmentsStats).series} type="area" height={350} />
                                <List>
                                    {myLicense?.map((data,i)=>{
                                        console.log(data);
                                        console.log(i);
                                        return (<ListItem
                                            key={i}
                                            dense
                                        >
                                            <ListItemText
                                                primary={`${data.license_id.name} | ${data.license_period_count} ${data.license_period} `}
                                                secondary={data.license_id.description}
                                            />
                                            <ListItemSecondaryAction>
                                                {data.license_id.license_category!='SOFTWARE_LICENSE'&&<IconButton
                                                    onClick={()=>{
                                                        window.open("http://localhost:8000/api/v1/licenseRequest/download/"+data.id, "_blank");
                                                    }}
                                                >
                                                    <VisibilityOutlined fontSize="small" />
                                                </IconButton>
                                                }
                                            </ListItemSecondaryAction>
                                        </ListItem>);
                                    })}
                                </List>
                            </Box>
                        </Paper>
                    </Grid>*/}

{/*
                    Summaries
*/}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Paper style={{ width: '100%', display: "flex", flexDirection: "column" }} elevation={0}>
                                <Typography style={{ marginLeft: 10, marginTop: 10 }}>
                                    <b>License Expiration Summary</b>
                                </Typography>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#a47d2f" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Paper style={{ width: '100%', display: "flex", flexDirection: "column" }} elevation={0}>
                                <Typography style={{ marginLeft: 10, marginTop: 10 }}>
                                    <b>Certificates Expiration Summary</b>
                                </Typography>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={chartDataCertificates}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#a47d2f" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <br></br>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Paper style={{ width: '100%', display: "flex", flexDirection: "column" }} elevation={0}>
                            <Typography style={{ marginLeft: 10, marginTop: 10 }}>
                                <b>Tools/Product Optimization</b>
                            </Typography>
                           <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartDataToolsOptimization} margin={{ right: 120 ,bottom: 50 }} >
                                    <XAxis
                                        dataKey="name"
                                        angle={-25}
                                        textAnchor="end"
                                        interval={0}
                                        dy={10}
                                        tickFormatter={(name) =>
                                            name.length > 10 ? `${name.slice(0, 10)}...` : name
                                        }
                                    />

                                    <YAxis allowDecimals={false} />
                                    <Tooltip
                                        formatter={(value, name, props) => [value, name]}
                                        labelFormatter={(label) => `Tool: ${label}`}
                                    />

                                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                                    <Bar dataKey="entitlement" stackId="a" fill="#DBA628" name="Entitlement" />
                                    <Bar dataKey="utilisation" stackId="a" fill="#763a18" name="Utilisation" />
                                    <Bar dataKey="license_gap" stackId="a" fill="#81632d" name="License Gap" />

                                </BarChart>
                            </ResponsiveContainer>

  {/*                          <ResponsiveContainer width="100%" height={400}>
                                <BarChart
                                    data={chartDataToolsOptimization}
                                    layout="vertical"
                                    margin={{ left: 5, right: 120 }}
                                >
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis type="category" dataKey="name" width={150} />
                                    <Tooltip />
                                    <Legend layout="vertical" align="right" verticalAlign="middle" />

                                    <Bar dataKey="entitlement" stackId="a" fill="#DBA628" name="Entitlement" />
                                    <Bar dataKey="utilisation" stackId="a" fill="#763a18" name="Utilisation" />
                                    <Bar dataKey="license_gap" stackId="a" fill="#81632d" name="License Gap" />

                                </BarChart>
                            </ResponsiveContainer>*/}





                        </Paper>
                    </Grid>

               {/*     <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Paper style={{ width: '100%', display: "flex", flexDirection: "column" }} elevation={0}>
                            <Typography style={{ marginLeft: 10, marginTop: 10 }}>
                                <b>Certificates Expiration Summary</b>
                            </Typography>


                        </Paper>
                    </Grid>*/}
                </Grid>
            </Box>
        </div>
    );
}

export default withLocalize(Dashboard);
