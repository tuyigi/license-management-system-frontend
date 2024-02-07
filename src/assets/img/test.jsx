import Skeleton from '@material-ui/lab/Skeleton';
import { Map, Marker, Popup, TileLayer } from "react-leaflet";import { Icon } from "leaflet";import L from 'leaflet';
import {TransportService,ReportingService,AdminService,FinanceService,groupBy} from "./../../utils/web_config_2";import axios from 'axios';import MUIDataTable from "mui-datatables";import UserInfo from "./login_info.js";import { format } from "date-fns/esm";import { Link } from "react-router-dom";
import Iticket from "../../assets/svg/ticket.svg"; import Imoney from "../../assets/svg/money.svg";import Iposuser from "../../assets/svg/posuser.svg";import Iroad from "../../assets/svg/road1.svg";
import { useSnackbar } from 'notistack';import Format from "date-fns/format";
import passenger from "../../assets/svg/passenger.svg";
const useStyles = makeStyles((theme) => ({ root: { flexShrink: 0, flexFlow:1, [theme.breakpoints.up('sm')]:{ marginLeft:250, } }, paper: { padding: theme.spacing(2), height:200, elevation:0 }, paper3: { padding: theme.spacing(2), height:"100px", elevation:0 }, paper1: { padding: theme.spacing(2), height:380, elevation:0 }, paper2: { padding: theme.spacing(2), elevation:0 }, title:{ [theme.breakpoints.down('sm')]: { fontSize:"12px", } }, formTitle:{ flexGrow:1, }, }));

function Dashboard(){ const classes = useStyles(); const [activePark, setActivePark] =useState(null); const [pos1,setPos1]=useState(null); const [pos2,setPos2]=useState(null); const [message,setMessage]=useState("");
 const { enqueueSnackbar, closeSnackbar } = useSnackbar();
 const [operatorData, setOperatorData] = useState({});
 // bus report revenue const [busLebals,setBusLebals]=useState([]); const [busTotal,setBusTotal]=useState([]);
 // route report revenue const [routeLebals,setRouteLebals]=useState([]); const [routeTotal,setRouteTotal]=useState([]); const [token,setToken] = useState(""); useEffect(()=>{ var data = {}; const data1 = localStorage.getItem("nx_op"); if (data1 != null) { data = JSON.parse(data1); }
 setOperatorData(data); setToken(data.token); axios.defaults.baseURL = new ReportingService().BASE_URL;
 // get_bus_report(data.token); // get_route_report(data.token); // get_route_report2(data.token); // get_branch_report(data.token); // get_user_report(data.token); // get_year_report(data.token); // get_channel_report(data.token);


 // get_week_report(data.token); // get_fines_report(data.token); // get_coordinates(data.token); },[]);
 const view_report=()=>{ axios.defaults.baseURL = new ReportingService().BASE_URL;
  get_bus_report(token); get_route_report(token); get_route_report2(token); get_branch_report(token); get_user_report(token); get_year_report(token); get_channel_report(token); }
// overview summary
 const [nTicket,setNticket]=useState(0);const [nAmount,setNamount]=useState(0);const [nPosuser,setNposuser]=useState(0);const [currency,setCurrency]=useState("");
 // format money
 function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") { try { decimalCount = Math.abs(decimalCount); decimalCount = isNaN(decimalCount) ? 2 : decimalCount; const negativeSign = amount < 0 ? "-" : ""; let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString(); let j = (i.length > 3) ? i.length % 3 : 0; return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : ""); } catch (e) { console.log(e) } };

 // daily report per bus
 const [revenue_bus,setRevenue_bus]=useState( { options:{ series: [{ name: 'Revenue', data: [] }], chart: { height: 350, type: 'bar', tools:{ download: false, selection:false, pan:false, reset:false, } },
   noData: { text: "No data yet", align: "center", verticalAlign: "middle", offsetX: 0, offsetY: 0, }, plotOptions: { bar: { columnWidth: '40%', } }, dataLabels: { enabled: false, formatter: function (val) { return formatMoney(val,0) + " FRW"; }, offsetY: -20, style: { fontSize: '12px', colors: ["#304758"] } }, xaxis: { categories:[], position: 'bottom', axisBorder: { show: false }, axisTicks: { show: false }, crosshairs: { fill: { type: 'gradient', gradient: { colorFrom: '#D8E3F0', colorTo: '#BED1E6', stops: [0, 100], opacityFrom: 0.4, opacityTo: 0.5, } } }, tooltip: { custom: function({series, seriesIndex, dataPointIndex, w}) { return '<div class="arrow_box" style="padding:10">' + '<span>' + formatMoney(parseInt(series[seriesIndex][dataPointIndex]),0) + ' FRW </span>' + '</div>' } }, }, yaxis: { axisBorder: { show: false }, axisTicks: { show: false, }, labels: { show: false, formatter: function (val) { return formatMoney(parseInt(val),0)+ " "; } } }, } });
 const [busLoad,setBusLoad]=useState(false); const get_bus_report=(token)=>{ setBusLoad(false); axios.defaults.baseURL = new ReportingService().BASE_URL; const busInstance = axios.create(new ReportingService().setHeaders(token)); busInstance.post('/pos-report/bus-detail-report?page=0&size=10000000', // { // "bus":"", // "day": Format(new Date(), ["yyyy-MM-dd"]) // // "organization_id":new UserInfo().ORG_ID // }, { "day": Format(new Date(), ["yyyy-MM-dd"]), "organization_id": new UserInfo().ORG_ID, "route": "" } ) .then(res=>{ setBusLoad(false); // console.log("== report ==",res.data.data); var objs=res.data.data.content; var performance=[]; var lebals=[]; // total amount var total=objs.reduce((a, b)=>{ return a + parseInt(b.total_amount); }, 0);
     objs.sort((a,b)=>parseInt(b.total_amount)-parseInt(a.total_amount)); objs.map((o,i)=>{ if(i<9){ o['amount']=o.total_amount+" "+o.currency; var percentage=(parseInt(o.total_amount)/total)*100; performance.push(percentage); lebals.push(o['plate_nbr']); } }); let unique_bus =lebals.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]); let unique_percentage=[]; let unique_revenue=[]; // calculate revenue for(var i=0;i<unique_bus.length;i++){ var to=0; var r=0; for(var a=0;a<objs.length;a++){ if(objs[a]['plate_nbr']==unique_bus[i]){ r=r+parseInt(objs[a]['total_amount']); to=to+parseInt(objs[a]['total_tickets']); } } unique_revenue.push(r) unique_percentage.push(to); } setRevenue_bus( { options:{ series: [{ name: 'Revenue', data:unique_revenue }], chart: { height: 350, type: 'bar', tools:{ download: false, selection:false, pan:false, reset:false, } }, plotOptions: { bar: { columnWidth: '40%', } }, dataLabels: { enabled: false, formatter: function (val) { return formatMoney(val,0) + " FRW"; }, offsetY: -20, style: { fontSize: '12px', colors: ["#304758"] } }, xaxis: { categories:unique_bus, position: 'bottom', axisBorder: { show: false }, axisTicks: { show: false }, crosshairs: { fill: { type: 'gradient', gradient: { colorFrom: '#D8E3F0', colorTo: '#BED1E6', stops: [0, 100], opacityFrom: 0.4, opacityTo: 0.5, } } }, tooltip: { custom: function({series, seriesIndex, dataPointIndex, w}) { return '<div class="arrow_box" style="padding:10">' + '<span>' + formatMoney(parseInt(series[seriesIndex][dataPointIndex]),0) + ' FRW </span>' + '</div>' } }, }, yaxis: { axisBorder: { show: false }, axisTicks: { show: false, }, labels: { show: false, formatter: function (val) { return formatMoney(parseInt(val),0)+ " "; } } }, } });
  // setBusLebals(unique_bus); // setBusTotal(unique_revenue);
 }) .catch(err=>{ setBusLoad(false); if(err.message){ enqueueSnackbar(err.message, { variant: 'error' }); // console.log("err message:"+err.message); }
  if(err.response){ enqueueSnackbar(err.response.data.message, { variant: 'error' }); // console.log("err response:"+err.response.data.message); }
  });
 }

  // daily report per route
  // chart route performance (tickets,revenue)


  const [routePercentage,setRoutePercentage]=useState([]); const [routeRPercentage,setRouteRPercentage]=useState([]); const [routeLabels,setRouteLabels]=useState([]); const [topRoute,setTopRoute]=useState([]);

  const route_performance_revenue= { series: [{ name: 'Percentage', data: routeRPercentage }], options: { chart: { height: 350, type: 'area' }, noData: { text: "No data yet", align: "center", verticalAlign: "middle", offsetX: 0, offsetY: 0, }, dataLabels: { enabled: false }, stroke: { curve: 'smooth' }, xaxis: { categories: topRoute }, tooltip: { y: { formatter: function (val) { return val + "%" } } }, }, };


  const [route_performance_passenger,setRoute_performance_passenger]=useState({ series: [{ name: 'Percentage', data: [] }], options: { chart: { type: 'bar', height: 350 }, noData: { text: "No data yet", align: "center", verticalAlign: "middle", offsetX: 0, offsetY: 0, }, plotOptions: { bar: { horizontal: true, distributed: false, startingShape: "flat", barHeight: "40%", endingShape: "rounded", dataLabels: { position: "top", }, }, }, colors:['#B578EF','#26E59F','#92D7BB','#FFEC42','#FDD8B5'], dataLabels: { enabled: false }, xaxis: { categories: [], }, tooltip: { y: { formatter: function (val) { return val + "%" } } }, }, });


  const get_route_report2=(token)=>{ axios.defaults.baseURL = new ReportingService().BASE_URL; const routeInstance = axios.create(new ReportingService().setHeaders(token)); routeInstance.post('/pos-report/route-daily-ticket',{ "organization_id": new UserInfo().ORG_ID, "day": Format(new Date(), ["yyyy-MM-dd",]) }) .then(res=>{ var objs=res.data.data; var r=[]; // uniques route var t=[]; // unique total amount var p=[]; // unique percentage per tickets var pR=[] // unique percentage per revenue var tot_tickets=objs.reduce((a,b)=>a+b.total_tickets,0); var tot_revs=objs.reduce((a,b)=>a+parseInt(b.total_amount),0);
   objs.map((o)=>{ r.push(o['route']); t.push(o['total_amount']); // calculate route ticket var cal=Math.round((o['total_tickets']/tot_tickets)*100); // var obj={route:o['route'],percentage:cal}; // calculate route revenue var Rcal=Math.round((parseInt(o['total_amount'])/tot_revs)*100); pR.push(Rcal); p.push(cal); });
    setTopRoute(r); setRouteTotal(t); // setRoutePercentage(p); setRouteRPercentage(pR); // console.log("pR",pR); // console.log("p",p);
    setRoute_performance_passenger({ series: [{ name: 'Percentage', data: p }], options: { chart: { type: 'bar', height: 350 }, plotOptions: { bar: { horizontal: true, columnWidth: '10%', endingShape: 'rounded' }, }, colors:['#B578EF','#26E59F','#92D7BB','#FFEC42','#FDD8B5'], dataLabels: { enabled: false }, xaxis: { categories: r, }, tooltip: { y: { formatter: function (val) { return val + "%" } } }, }, });


   }) .catch(err=>{ if(err.message){ enqueueSnackbar(err.message, { variant: 'error' }); // console.log("err message:"+err.message); }
    if(err.response){ enqueueSnackbar(err.response.data.message, { variant: 'error' }); // console.log("err response:"+err.response.data.message); }
    }); }
    // branch performance /////////////////////////////////////////////
    const [branchLabels,setBranchLabels]=useState([]); const [branchSeries,setBranchSeries]=useState([]);
    const branchChart={options:{ series: branchSeries, chart: { type: 'donut', width:300, height:300 }, labels: branchLabels, noData: { text: "No data yet", align: "center", verticalAlign: "middle", offsetX: 0, offsetY: 0, }, legend: { position: 'right', itemMargin:{ horizontal:0 } }, responsive: [{ breakpoint: 1000, options: { chart: { width: 250, height:250 }, legend: { position: 'right' } } }] } };
    const columns = [ { name: "branche_name", label: "Branch Name", options: { filter: true, sort: true, } } , { name: "total_tickets", label: "Tickets", options: { filter: true, sort: true, } }, { name: "amount", label: "Total Amount", options: { filter: true, sort: true, } } ];
    const [branchMessage,setBranchMessage]=useState("Loading...");
    const options = {textLabels: { body: { noMatch: branchMessage }, }, filterType: 'checkbox', download:true, responsive:"standard", selectableRows:false, rowsPerPage:10, elevation:0, customToolbarSelect: (selectedRows, displayData, setSelectedRows) => ( <Box> {/* <Chip className={classes.chip} icon={ <Visibility/>} color="primary" variant="outlined" label="View details" onClick={()=>{ var name=displayData[selectedRows.data[0]['index']]['data'][0]; console.log("ticket id",id); }} /> */} </Box> ), };
    const [branchReports,setBranchReports]=useState([]); const [branchLoad,setBranchLoad]=useState(false); const get_branch_report=(token)=>{ setBranchLoad(true); setBranchMessage("Loading..."); axios.defaults.baseURL = new ReportingService().BASE_URL; const routeInstance = axios.create(new ReportingService().setHeaders(token)); routeInstance.post('/pos-report/branch-detail-report', { "company_id": new UserInfo().ORG_ID, "end_date": Format(new Date(), ["yyyy-MM-dd",]), "start_date": Format(new Date(), ["yyyy-MM-dd",]) } // { // "branch": "", // "organization_id":new UserInfo().ORG_ID // } ) .then(res=>{ var objs=res.data.data; // console.log("===== branch report =====",objs); if(objs.length==0){ setBranchMessage("No branch report available"); // setReportsMessage("No Branch report available today"); }else{ var performance=[]; var lebals=[]; var total=objs.reduce((a, b)=>{ return a + parseInt(b.total_income); }, 0);

     objs.map((o)=>{ o['amount']=formatMoney(o.total_income,0)+" RWF"; var a=parseInt(o.total_income); // var am=formatMoney(a,0)+" RWF"; // o['total_income']=am; var percentage=(parseInt(o.total_income)/total)*100; performance.push(percentage); if(o['branch_name']==null){ lebals.push("null"); o['branch_name']="null"; }else{ lebals.push(o['branch_name']); } });
      console.log("objs") console.log(objs);

      let unique_branch =lebals.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]); let unique_percentage=[]; let unique_revenue=[]; var grouped=[]; for(var i=0;i<unique_branch.length;i++){ var to=0; var r=0; var curr=""; for(var a=0;a<objs.length;a++){ if(objs[a]['branch_name']==unique_branch[i]){ r=r+parseInt(objs[a]['total_income']); to=to+parseInt(objs[a]['total_tickets']); curr="RWF"; } } var obj={branche_name:unique_branch[i],total_tickets:to,amount:formatMoney(r,0)+" "+curr}; grouped.push(obj); unique_revenue.push(r); unique_percentage.push(to); }
      setBranchSeries(unique_percentage); setBranchLabels(unique_branch);
      console.log("grouped"); console.log(grouped);
      setBranchReports(grouped); } setBranchLoad(false); }) .catch(err=>{ setBranchLoad(false);
     if(err.message){ enqueueSnackbar(err.message, { variant: 'error' }); // console.log("err message:"+err.message); }
      if(err.response){ enqueueSnackbar(err.response.data.message, { variant: 'error' }); // console.log("err response:"+err.response.data.message); }
      }); }

     // channel performance //////////////////////////////////

     const [channelLabels,setChannelLabels]=useState([]); const [channelSeries,setChannelSeries]=useState([]);
     const columnsChannel = [ { name: "channel_type", label: "Channel", options: { filter: true, sort: true, customBodyRender: (value, tableMeta, updateValue) => { return ( <Typography color="primary"><Link color="primary" href="#" onClick={()=>{ get_channel_details_report(value); }}>{value}</Link></Typography> ); } } }, { name: "total_tickets", label: "Total Tickets", options: { filter: true, sort: true, } }, { name: "total_amount", label: "Total Amount", options: { filter: true, sort: true, } }, { name: "currency", label: "Currency", options: { filter: true, sort: true, } } ];
     const [channelMessage,setChannelMessage]=useState("No report available");
     const optionsChannel = {textLabels: { body: { noMatch: channelMessage }, }, filterType: 'checkbox', download:true, responsive:"standard", selectableRows:false, rowsPerPage: 10, elevation:0, };
     const channelChart={options:{ series: channelSeries, chart: { type: 'donut', width:300, height:300 }, labels:channelLabels, noData: { text: "No data yet", align: "center", verticalAlign: "middle", offsetX: 0, offsetY: 0, }, legend: { position: 'right', itemMargin:{ horizontal:0 } }, responsive: [{ breakpoint: 1000, options: { chart: { width: 250, height:250 }, legend: { position: 'right' } } }] } };
     const [channelLoad,setChannelLoad]=useState(false); const [channelReports,setChannelReports]=useState();const get_channel_report=(token)=>{ setChannelMessage("Loading..."); setChannelLoad(true); axios.defaults.baseURL = new ReportingService().BASE_URL; const channelInstance = axios.create(new ReportingService().setHeaders(token)); channelInstance.post('/traffic-report/daily-sales-report', { "organization_id":new UserInfo().ORG_ID, "chanel_type":""} ) .then(res=>{ var objs=res.data.data; if(objs.length==0){ setChannelMessage("No channel report available"); } var l=[]; var s=[];
      objs.map((o)=>{ l.push(o['channel_type']); s.push(parseInt(o['total_amount'])); o['total_amount']=formatMoney(parseInt(o['total_amount']),0)+" "+o['currency']; });
      setChannelLabels(l); setChannelSeries(s); setChannelReports(objs); setChannelLoad(false); }) .catch(err=>{
      setChannelLoad(false);
      if(err.message){ enqueueSnackbar(err.message, { variant: 'error' }); // console.log("err message:"+err.message); }
       if(err.response){ enqueueSnackbar(err.response.data.message, { variant: 'error' }); // console.log("err response:"+err.response.data.message); } });
       }


/// top 5 routes performance

       const [routeSeries,setRouteSeries]=useState([]); const routeChart={options:{ series: routeSeries, chart: { type: 'donut', width:300, height:300 }, labels: routeLabels, noData: { text: "No data yet", align: "center", verticalAlign: "middle", offsetX: 0, offsetY: 0, }, legend: { position: 'right', itemMargin:{ horizontal:0 } }, responsive: [{ breakpoint: 1000, options: { chart: { width: 250, height:250 }, legend: { position: 'right' } } }] } };

       const columnsRoute = [ { name: "route", label: "Route", options: { filter: true, sort: true, customBodyRender: (value, tableMeta, updateValue) => { return ( <Typography color="primary"><Link color="primary" href="#" onClick={()=>{ get_route_details_report(value); }}>{value}</Link></Typography> ); } } } , { name: "total_tickets", label: "Tickets", options: { filter: true, sort: true, } }, { name: "amount", label: "Total Amount", options: { filter: true, sort: true, } } ];
       const [routeMessage,setRouteMessage]=useState("Loading...");
       const optionsRoute = {textLabels: { body: { noMatch: routeMessage }, }, filterType: 'checkbox', download:true, responsive:"standard", selectableRows:false, rowsPerPage: 10, elevation:0, };
       const [routeReports,setRouteReports]=useState([]); const [routeLoad,setRouteLoad]=useState(false);
       const get_route_report=(token)=>{ setRouteLoad(true); setRouteMessage("Loading..."); axios.defaults.baseURL = new ReportingService().BASE_URL; const routeInstance = axios.create(new ReportingService().setHeaders(token)); routeInstance.post('/pos-report/route-daily-ticket', // { // "organization_id":new UserInfo().ORG_ID // }, { "day": Format(new Date(), ["yyyy-MM-dd",]), "organization_id": new UserInfo().ORG_ID, "route": "" }) .then(res=>{ var objs=res.data.data; let ta=0; let tt=0; if(objs.length==0){ setRouteMessage("No route report available"); }else{ var l=[]; var s=[]; var top_objs=[]; var curr=""; objs.sort((a,b)=>parseInt(b.total_amount)-parseInt(a.total_amount)); objs.map((o,i)=>{ tt=tt+parseInt(o['total_tickets']); ta=ta+parseInt(o['total_amount']); if(i<5){ l.push(o['route']); s.push(parseInt(o['total_amount'])); o['amount']=formatMoney(parseInt(o['total_amount']),0)+" "+o['currency']; curr=o['currency']; top_objs.push(o); } }); setRouteLabels(l); setRouteSeries(s); setRouteReports(top_objs); setCurrency(curr); } setNticket(tt); setNamount(formatMoney(ta,0)); setRouteLoad(false); }) .catch(err=>{ setRouteLoad(false); if(err.message){ enqueueSnackbar(err.message, { variant: 'error' }); // console.log("err message:"+err.message); }
        if(err.response){ enqueueSnackbar(err.response.data.message, { variant: 'error' }); // console.log("err response:"+err.response.data.message); } }); }

         // top 5 pos user
         const [userLabels,setUserLabels]=useState([]); const [userSeries,setUserSeries]=useState([]); const userChart={options:{ series: userSeries, chart: { type: 'donut', width:300, height:300 }, labels: userLabels, noData: { text: "No data yet", align: "center", verticalAlign: "middle", offsetX: 0, offsetY: 0, }, legend: { position: 'right', itemMargin:{ horizontal:0 } }, responsive: [{ breakpoint: 1000, options: { chart: { width: 250, height:250 }, legend: { position: 'right' } } }] } };

         const columnsUser = [ { name: "user_name", label: "Username", options: { filter: true, sort: true, customBodyRender: (value, tableMeta, updateValue) => { return ( <Typography color="primary"><Link color="primary" href="#" onClick={()=>{ get_user_details_report(value); }}>{value}</Link></Typography> ); } } } , { name: "passengr_cash", label: "CASH", options: { filter: true, sort: true, } }, { name: "passenger_card", label: "CARD", options: { filter: true, sort: true, } }, { name: "luggage_cash", label: "Luggage", options: { filter: true, sort: true, } }, { name: "total_tickets", label: "Tickets", options: { filter: true, sort: true, } }, { name: "amount", label: "Total Amount", options: { filter: true, sort: true, } } ];
         const [userMessage,setUserMessage]=useState("Loading...");
         const optionsUser = {textLabels: { body: { noMatch: userMessage }, }, filterType: 'checkbox', download:true, responsive:"standard", selectableRows:false, rowsPerPage: 10, elevation:0, };

         const [userReports,setUserReports]=useState([]); const [userLoad,setUserLoad]=useState(false); const get_user_report=(token)=>{ setUserLoad(true); setUserMessage("Loading..."); axios.defaults.baseURL = new ReportingService().BASE_URL; const userInstance = axios.create(new ReportingService().setHeaders(token)); userInstance.post('/pos-report/user-daily-ticket?page=0&size=10000000', { "company_id":new UserInfo().ORG_ID, "end_date": Format(new Date(), ["yyyy-MM-dd",]), "start_date": Format(new Date(), ["yyyy-MM-dd",]) } ) .then(res=>{ var objs=res.data.data.content; console.log("user report",objs); if(objs.length==0){ setUserMessage("No report available!") } let sortedreport = objs.slice().sort((a, b) => parseInt(b.total_amount) - parseInt(a.total_amount)); // console.log("sorted report",sortedreport);
          var l=[]; var s=[]; var n_objs=[];
          let count_pos_user=0; sortedreport.map((o,i)=>{ o['user_name']=o['cashier'];
           // count users
           if(o['cashier']!=null){ count_pos_user++; }
           if(i<5){ if(o['cashier']!=null){ o['amount']=formatMoney(parseInt(o['total_amount']),0)+" RWF"; o['passengr_cash']=formatMoney(parseInt(o['passengr_cash']),0)+" RWF"; o['passenger_card']=formatMoney(parseInt(o['passenger_card']),0)+" RWF"; o['luggage_cash']=formatMoney(parseInt(o['luggage_cash']),0)+" RWF"; l.push(o['cashier']); s.push(parseInt(o['total_amount'])); n_objs.push(o); } }
          });
          setNposuser(count_pos_user);
          if(n_objs.length==0){ setUserMessage("No report available!") }
          setUserLabels(l); setUserSeries(s);
          setUserReports(n_objs);
          setUserLoad(false); }) .catch(err=>{ setUserLoad(false); if(err.message){ enqueueSnackbar(err.message, { variant: 'error' }); // console.log("err message:"+err.message); }
          if(err.response){ enqueueSnackbar(err.response.data.message, { variant: 'error' }); // console.log("err response:"+err.response.data.message); } }); }
// weekly report
           const [weekLabels,setWeekLabels]=useState([]);const [weekSeries,setWeekSeries]=useState([]);
           const colors=["#3BA2F9","#45E6A8","#FDBB51","#FD637B","#8B79D5","#6E848D","#4EB3A9","#D647E9"];
           const weekChart= { series: [{ name:"Sales", data: weekSeries
            }], options: { chart: { height: 350, type: 'bar', events: { click: function(chart, w, e) { // console.log(chart, w, e) } } }, colors: colors, plotOptions: { bar: { columnWidth: '45%', distributed: true } }, tooltip: { custom: function({series, seriesIndex, dataPointIndex, w}) { return '<div class="arrow_box" style="padding:10">' + '<span>' + formatMoney(parseInt(series[seriesIndex][dataPointIndex]),0) + ' </span>' + '</div>' } }, dataLabels: { enabled: false, formatter: function(val, opt) { return formatMoney(parseInt(val),0)+" "; } }, legend: { show: false }, xaxis: { categories: weekLabels, labels: { style: { colors: colors, fontSize: '12px' } } } },};


                const [weekLoad,setWeekLoad]=useState(false); const get_week_report=(token)=>{ setWeekLoad(true); axios.defaults.baseURL = new ReportingService().BASE_URL; const weekInstance = axios.create(new ReportingService().setHeaders(token)); weekInstance.post('/traffic-report/weekly-sales',{ "organization_id": new UserInfo().ORG_ID}) .then(res=>{ var objs=res.data.data; var weekday = new Array(7); weekday[0] = "Monday"; weekday[1] = "Tuesday"; weekday[2] = "Wednesday"; weekday[3] = "Thursday"; weekday[4] = "Friday"; weekday[5] = "Saturday"; weekday[6] = "Sunday"; var l=[]; var s=[];
                 weekday.map((o)=>{ var obj=objs.find((f)=>f.day==o); if(obj!=null){ l.push(o); s.push(obj['total_amount']); }else{ l.push(o); s.push(0); } });
                 setWeekLabels(l); setWeekSeries(s); setWeekLoad(false); }) .catch(err=>{ setWeekLoad(false); if(err.message){ enqueueSnackbar(err.message, { variant: 'error' }); // console.log("err message:"+err.message); }
                 if(err.response){ enqueueSnackbar(err.response.data.message, { variant: 'error' }); // console.log("err response:"+err.response.data.message); } }); }

// yearly report

                  const [yearReport,setYearReport]=useState({});const [yearLoad,setYearLoad]=useState(false);const [foundYear,setFoundYear]=useState(false);const get_year_report=(token)=>{ var d = new Date(); var n = d.getFullYear(); setYearLoad(true); axios.defaults.baseURL = new ReportingService().BASE_URL; const yearInstance = axios.create(new ReportingService().setHeaders(token)); yearInstance.post('/traffic-report/annual-sales',{ "organization_id": new UserInfo().ORG_ID, "year": n+""}) .then(res=>{ var objs=res.data.data;
                   if(objs.length==0){ setFoundYear(false); console.log("empty yearly report"); }else{ // console.log("yearly report",objs); // console.log("year report ",objs); setFoundYear(true); setYearReport(objs[0]); }
                    setYearLoad(false); }) .catch(err=>{ setYearLoad(false);
                    if(err.message){ enqueueSnackbar(err.message, { variant: 'error' }); // console.log("err message:"+err.message); }
                     if(err.response){ enqueueSnackbar(err.response.data.message, { variant: 'error' }); // console.log("err response:"+err.response.data.message); }
                     });}



// daily fines report
                    const [fineMessage,setFineMessage]=useState("Loading...");const [fineLoad,setFineLoad]=useState();const [fineReports,setFineReports]=useState([]);const get_fines_report=(token)=>{ setFineMessage("Loading..."); axios.defaults.baseURL = new TransportService().BASE_URL; const finesInstance = axios.create(new TransportService().setHeaders(token)); finesInstance.put('/api/v1/fines/getAllFineTicketsByOperatorAndDate', { "from_date": format(new Date(), ["yyyy-MM-dd"]), "operator_id": new UserInfo().ID, "to_date": format(new Date(), ["yyyy-MM-dd"]), "organization_id":new UserInfo().ORG_ID } ) .then(res=>{ var objs=res.data; if(objs.length==0){ setFineMessage("No fines report available"); }else{ setFineReports(objs); }
                     setFineLoad(false); }) .catch(err=>{ setFineLoad(false); });}

///////////////////////////////////// details report ///////////////////////////////////




                    const [detailsLoad,setDetailsLoad]=useState(false);const [openD,setOpenD]=useState("dashboard");const [reportType,setReportType]=useState("");const [messageDetails,setMessageDetails]=useState("Loading...");

// channel details reort


                    const columnsChannelDetails = [ { name: "route", label: "Route", options: { filter: true, sort: true } }, { name: "departure_time", label: "Departure Time", options: { filter: true, sort: true, } }, { name: "plate_number", label: "Plate Number", options: { filter: true, sort: true, } }, { name: "total_tickets", label: "Total Tickets", options: { filter: true, sort: true, } }, { name: "total_amount", label: "Total Amount", options: { filter: true, sort: true, } }, { name: "currency", label: "Currency", options: { filter: true, sort: true, } } ];

                    const [channelDetailsReport,setChannelDetailsReport]=useState([]);
                    const get_channel_details_report=(ch)=>{ setChannelDetailsReport([]); setOpenD("channelDetails"); setReportType(ch); setMessageDetails("Loading..."); setDetailsLoad(true); axios.defaults.baseURL = new ReportingService().BASE_URL; const channelDetailsInstance = axios.create(new ReportingService().setHeaders(operatorData.token)); channelDetailsInstance.post('/traffic-report/detailed-daily-sales-report',{ "organization_id":new UserInfo().ORG_ID, "chanel_type":ch}) .then(res=>{ var objs=res.data.data; // console.log("objs",objs); if(objs.length==0){ setMessageDetails("No channel details report availale"); }else{ objs.map((o)=>{ o['total_amount']=formatMoney(parseInt(o['total_amount']),0); }); } setChannelDetailsReport(objs); setDetailsLoad(false); }) .catch(err=>{ // console.log(err.message); setDetailsLoad(false); setMessageDetails(err.message);
                     if(err.message){ enqueueSnackbar(err.message, { variant: 'error' }); console.log("err message:"+err.message); }
                     if(err.response){ enqueueSnackbar(err.response.data.message, { variant: 'error' }); console.log("err response:"+err.response.data.message); } });
                    }


/// /// route details report

                    const columnsRouteDetails = [ { name: "user_name", label: "Cashier", options: { filter: true, sort: true } }, { name: "source", label: "Source", options: { filter: true, sort: true, } }, { name: "destination", label: "Destination", options: { filter: true, sort: true, } }, { name: "total_tickets", label: "Total Tickets", options: { filter: true, sort: true, } }, { name: "total_amount", label: "Total Amount", options: { filter: true, sort: true, } }, { name: "currency", label: "Currency", options: { filter: true, sort: true, } } ];


                    const [routeDetailsReport,setRouteDetailsReport]=useState([]);
                    const get_route_details_report=(r)=>{ setReportType(r); setMessageDetails("Laoding..."); setRouteDetailsReport([]); setOpenD("routeDetails"); setDetailsLoad(true); axios.defaults.baseURL = new ReportingService().BASE_URL; const routeDetailsInstance = axios.create(new ReportingService().setHeaders(operatorData.token)); routeDetailsInstance.post('/pos-report/user-detail-report',{ "route":r, "organization_id":new UserInfo().ORG_ID }) .then((res)=>{ var objs=res.data.data; if(objs.length==0){ setMessageDetails("No reports available") }else{ objs.map((o)=>{ o['total_amount']=formatMoney(parseInt(o['total_amount']),0); }); } setRouteDetailsReport(objs);
                     setDetailsLoad(false); }) .catch(err=>{
                     setDetailsLoad(false); });}


/// /// user details report
                    const columnsUserDetails = [ { name: "source", label: "Source", options: { filter: true, sort: true, } }, { name: "destination", label: "Destination", options: { filter: true, sort: true, } }, { name: "total_tickets", label: "Total Tickets", options: { filter: true, sort: true, } }, { name: "total_amount", label: "Total Amount", options: { filter: true, sort: true, } }, { name: "currency", label: "Currency", options: { filter: true, sort: true, } } ];

                    const [userDetailsReport,setUserDetailsReport]=useState([]);
                    const get_user_details_report=(u)=>{ setReportType(u); setMessageDetails("Loading..."); setUserDetailsReport([]); setOpenD("userDetails"); setDetailsLoad(true); axios.defaults.baseURL = new ReportingService().BASE_URL; const userDetailsInstance = axios.create(new ReportingService().setHeaders(operatorData.token)); userDetailsInstance.post('/pos-report/user-detail-report',{ "user":u, "organization_id":new UserInfo().ORG_ID }) .then((res)=>{ var objs=res.data.data; if(objs.length==0){ setMessageDetails("No report available"); }else{ objs.map((o)=>{ o['total_amount']=formatMoney(parseInt(o['total_amount']),0); }); } setUserDetailsReport(objs); setDetailsLoad(false);
                    }) .catch((err)=>{
                     setDetailsLoad(false); }); }

                    /// bus live track

                    const [coordinates,setCoordinates]=useState([]);
                    const [coordinateLoad,setCoordinateLoad]=useState(false);

                    const get_coordinates=(token)=>{
                     setCoordinateLoad(true);
                     axios.defaults.baseURL = new ReportingService().BASE_URL; const coordinateInstance = axios.create(new ReportingService().setHeaders(token)); coordinateInstance.post('/traffic-report/bus-locations',{ "organization_id": new UserInfo().ORG_ID, "day": format(new Date(), ["yyyy-MM-dd"]), "vehicle": ""})

                         .then(res=>{ var objs=res.data.data; console.log("coordinates",objs); var data=[]; var groupByPlate = groupBy(objs, function(item) { return [item.vehicle];});

                          groupByPlate.map((o)=>{var len=o.length;data.push(o[len-1]);});
                          setCoordinates(data);
                          setCoordinateLoad(false); }) .catch(err=>{ setCoordinateLoad(false); });
                    }


                    const L = require('leaflet');const myIcon = L.icon({ iconUrl: require('../../assets/svg/icon-bus.svg'), iconSize: [30,30], iconAnchor: [15, 30], popupAnchor: null, shadowUrl: null, shadowSize: null, shadowAnchor: null});

                    const getYear=()=>{ var d = new Date(); var n = d.getFullYear(); return n;}




                    return(<div className={classes.root}> <Box display="flex"> <Box display="flex" className={classes.formTitle}><DDashboard color="primary" fontSize="medium"/><Typography variant="h6">Dashboard</Typography></Box>
                     <Event fontSize="large" color="primary"/><Typography variant="h6">{format(new Date(), ["yyyy-MM-dd"])}</Typography> <Box ml={1} mb={1}><Button variant="outlined" color="primary" onClick={()=>{ view_report(); }}> View Report </Button> </Box>
                    </Box><Box>
                     {/* dashboard */}{openD=="dashboard"&&
                        <Grid container spacing={1}>

                         {/* overview */}

                         {/* total tickets */}
                         <Grid item xs={12} md={4} > <Paper className={classes.paper3} elevation={0}> <Grid container> <Grid item xs={8} md={8}> <Box display="flex" justifyContent="center"><Typography variant="h8">Total tickets</Typography></Box> <Box mt={2} display="flex" justifyContent="center"><Typography variant="h6">{nTicket}</Typography></Box> </Grid>
                          <Grid item xs={4} md={4}> <Box p={1}> <img src={Iticket} width="80px" height="60px"/> </Box> </Grid>
                         </Grid> </Paper> </Grid>


                         {/* total amount */}
                         <Grid item xs={12} md={4} > <Paper className={classes.paper3} elevation={0}> <Grid container> <Grid item xs={8} md={8}> <Box display="flex" justifyContent="center"><Typography variant="h8" >Total amount</Typography></Box> <Box mt={2} display="flex" justifyContent="center"><Typography variant="h6">{nAmount+" "+currency} </Typography></Box> </Grid> <Grid item xs={4} md={4}> <Box p={1}> <img src={Imoney} width="80px" height="60px"/> </Box> </Grid>
                         </Grid> </Paper> </Grid>



                         {/* pos users */}
                         <Grid item xs={12} md={4} lg={4} sm={4} > <Paper className={classes.paper3} elevation={0}> <Grid container> <Grid item xs={8} md={8}> <Box display="flex" justifyContent="center"><Typography variant="h8" >POS Users</Typography></Box> <Box mt={2} display="flex" justifyContent="center"><Typography variant="h6">{nPosuser}</Typography></Box> </Grid> <Grid item xs={4} md={4}> <Box p={1}> <img src={Iposuser} width="80px" height="60px"/> </Box> </Grid>
                         </Grid> </Paper> </Grid>
                         <Grid item xs={12} md={12} sm={12} lg={12}> <Typography variant="h6">Route Performance</Typography> </Grid>
                         <Grid item xs={12} md={7} sm={7} lg={7}> <Paper elevation={0}><Box m={1} display="flex"><Typography style={{flexGrow:1}} >Per revenue</Typography><AccountBalanceWallet color="secondary"/></Box>
                          <Chart options={route_performance_revenue.options} series={route_performance_revenue.series} type="area" height={250} />


                         </Paper></Grid>
                         {/* Route performance per passenger */}
                         <Grid item xs={12} md={5} sm={4} lg={5}><Paper elevation={0}>
                          <Box m={1} display="flex"><Typography style={{flexGrow:1}}>Per passenger</Typography><img style={{margin:5}} src={passenger} width="30px" height="30px" /></Box>
                          <Chart options={route_performance_passenger.options} series={route_performance_passenger.series} type="bar" height={250}/></Paper></Grid>
                         <Grid item xs={12} md={12} sm={12} lg={12}> <Typography variant="h6">Route & POS Users</Typography> </Grid>
                         {/* top five routes */}
                         <Grid item xs={12} md={6} lg={6} sm={6}> <Paper elevation={0}> <Grid container>
                          <Grid item xs={12} md={12}> <Box> <Box m={1} display="flex" ><Typography style={{flexGrow:1}} variant="h6" className={classes.title}>Top 5 routes</Typography><img src={Iroad} width="30px" height="30px" /></Box></Box> </Grid>
                          <Grid item xs={12} md={12}>
                           {/* {routeLoad&&<Box display="flex" justifyContent="center"><Skeleton variant="circle" width={200} height={200} /></Box>} */} {routeLoad==false&& <Chart options={routeChart.options} series={routeChart.options.series} type="donut" height="200" />}
                          </Grid>
                         </Grid>
                          <MUIDataTable title={"Top 5 routes"} data={routeReports} columns={columnsRoute} options={optionsRoute} />
                         </Paper> </Grid>
                         {/* top five pos user */}
                         <Grid item xs={12} md={6} lg={6} sm={6}> <Paper elevation={0}> <Grid container>
                          <Grid item xs={12} md={12}> <Box> <Box m={1} display="flex" ><Typography style={{flexGrow:1}} variant="h6" className={classes.title}>Top 5 POS Users</Typography><PhoneAndroid fontSize="secondary" fontSize="large" /></Box></Box> </Grid>
                          <Grid item xs={12} md={12}>
                           {/* {userLoad&&<Box display="flex" justifyContent="center"><Skeleton variant="circle" width={300} height={300} /></Box>} */} {userLoad==false&& <Chart options={userChart.options} series={userChart.options.series} type="donut" height="200" />} </Grid>
                         </Grid>
                          <MUIDataTable title={"Top 5 POS users"} data={userReports} columns={columnsUser} options={optionsUser} />
                         </Paper> </Grid> <Grid item xs={12} md={12} sm={12} lg={12}> <Typography variant="h6">Branches & Channel</Typography> </Grid>

                         {/* branch performance */}
                         <Grid item xs={12} md={6} lg={6} sm={6}> <Paper elevation={0}> <Grid container>
                          <Grid item xs={12} md={12}> <Box> <Box m={1} display="flex"><Typography style={{flexGrow:1}} variant="h6" className={classes.title}>Top 5 Branches</Typography><CallSplit fontSize="large" color="secondary"/></Box></Box> </Grid>
                          <Grid item xs={12} md={12}> {/* {branchLoad&&<Box display="flex" justifyContent="center"><Skeleton variant="circle" width={300} height={300} /></Box> } */} {branchLoad==false&&<Chart options={branchChart.options} series={branchChart.options.series} type="donut" height="200"/>}
                          </Grid>
                         </Grid>
                          <MUIDataTable title={"Branch Performance"} data={branchReports} columns={columns} options={options} />
                         </Paper> </Grid>

                         <Grid item xs={12} md={6} lg={6} sm={6}> <Paper elevation={0}> <Grid container>
                          <Grid item xs={12} md={12}> <Box> <Box m={1} display="flex"><Typography variant="h6" style={{flexGrow:1}} className={classes.title}>Channel Performance</Typography><DevicesOther fontSize="large" color="secondary" /></Box></Box> </Grid>
                          <Grid item xs={12} md={12}>
                           {/* {channelLoad&&<Box display="flex" justifyContent="center"><Skeleton variant="circle" width={300} height={300} /></Box>} */} {channelLoad==false&&<Chart options={channelChart.options} series={channelChart.options.series} type="donut" height="200" />}
                          </Grid>
                         </Grid>
                          <MUIDataTable title={"Channel Performance"} data={channelReports} columns={columnsChannel} options={optionsChannel} />
                         </Paper> </Grid>


                         {/* <Grid item xs={12} md={12} sm={12} lg={12}> <Typography variant="h6">Weekly & Driver report</Typography> </Grid> */}

                         {/* dail fines per bus */}{/* <Grid item xs={12} md={7}> <Paper className={classes.paper1} elevation={0}> <Grid container> <Grid item xs={12} md={12}> <Typography variant={"h6"} className={classes.title}>Weekly Report</Typography> </Grid> <Grid item xs={12} md={12} > <Chart options={weekChart.options} series={weekChart.series} type="bar" height="300px" /> </Grid> </Grid> </Paper> </Grid> */}{/* daily fines per driver */} {/* <Grid item xs={12} md={5}> <Paper className={classes.paper1} elevation={0}> <Grid container> <Grid item xs={12} md={12}> <Typography variant={"h6"} className={classes.title}>Daily fines per driver</Typography> </Grid> <Grid item xs={12} md={12}> {fineReports.length==0&&<Typography>{fineMessage}</Typography>} {fineLoad?<Box display="flex" justifyContent="center"> <Typography>Loading...</Typography> </Box>: <List dense={true}> {fineReports.map((f)=>{ return( <Box> <ListItem> <ListItemAvatar> <DirectionsBus/> </ListItemAvatar> <ListItemText primary={f['driver']['first_name']+" "+f['driver']['last_name']} secondary={formatMoney(f['totalAmount'],0)+" FRW"} /> <ListItemSecondaryAction> <IconButton edge="end" aria-label="delete"> <Chip label={f['offences'].length} color="primary" icon={<ArrowDropUp />} /> </IconButton> </ListItemSecondaryAction> </ListItem>
 <Divider /> </Box>
 ); })} </List> }
 </Grid> </Grid> </Paper> </Grid> */}
                         <Grid item xs={12} md={8}> <Paper className={classes.paper1} elevation={0}> <Grid container> <Grid item xs={12} md={12}> <Typography variant="h6">Top 10 buses revenue</Typography> </Grid> <Grid item xs={12} md={12}> <Chart options={revenue_bus.options} series={revenue_bus.options.series} type="bar" height="300px" /> </Grid> </Grid> </Paper> </Grid>

                         {/* revenue split */}
                         <Grid item xs={12} md={4}> <Paper className={classes.paper1} elevation={0}> <Grid container>
                          <Grid item xs={12} md={12}> <Box> <Typography variant="h6" className={classes.title}>Revenue per year</Typography></Box> </Grid> <Grid item xs={12} md={12} lg={12}> <Grid container> <Grid item xs={12} md={12} lg={12}> <Box mt={3} display="flex" flexDirection="row" justifyContent="center" > <Box ><Today fontSize="large" style={{width:"100px",height:"100px"}} color="primary"/></Box> </Box> </Grid> <Grid item xs={12} sm={12} md={12} lg={12}> <Box mt={1} display="flex" flexDirection="row" justifyContent="center" > <Box><Typography variant="h5">{getYear()}</Typography></Box> </Box> </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12}> <Box mt={1} display="flex" flexDirection="row" justifyContent="center" > <Box><Typography variant="h6">{yearLoad?"0 "+yearReport['currency']:foundYear==true?formatMoney(parseInt(yearReport['total_amount']),0)+" "+yearReport['currency']:"0 "+yearReport['currency']}</Typography></Box> </Box> </Grid> </Grid> </Grid>
                          <Grid item xs={12} md={12}>
                           {/* <Chart options={report.revenue_split.options} series={report.revenue_split.options.series} type="donut" height="350" /> */}
                          </Grid>
                         </Grid>
                         </Paper> </Grid>
                         {/* end revenue split */}
                         {/* <Grid item xs={12} sm={12} md={12} lg={12}> <Paper className={classes.paper2} elevation={0}> <Box> <Typography color="textSecondary">Bus Location Tracking</Typography> </Box> <Box mt={2}> <Map center={[-1.992819,30.044063]} zoom={12}>
 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />

 {coordinates.map((c)=>{ return (<Marker position={[c.latitude,c.longitude]} onClick={() => { setMessage("Bus : "+c.vehicle+" Validator : "+c.validator); setPos1(c.latitude); setPos2(c.longitude); setActivePark(true); }}
 icon={myIcon}
 />); })}
 {activePark && ( <Popup position={[pos1,pos2]} onClose={() => { setActivePark(null); }} > <div> <h2>Bus Details</h2> <p>{message}</p> </div> </Popup> )} </Map> </Box> </Paper> </Grid> */}
                        </Grid>
                    }
                     {openD=="channelDetails"&&<Box ><Box width="100%" display="flex" justifyContent="flex-end"><IconButton><CancelPresentation style={{color:"#EC3C39"}} onClick={()=>{ setOpenD("dashboard");}} /></IconButton></Box><Grid container> <Grid item xs={12} md={12} sm={12} lg={12}>
                      <MUIDataTable title={"Channel details report > "+reportType} data={channelDetailsReport} columns={columnsChannelDetails} options={options}/>
                     </Grid> </Grid></Box>}


                     {openD=="routeDetails"&&<Box ><Box width="100%" display="flex" justifyContent="flex-end"><IconButton><CancelPresentation style={{color:"#EC3C39"}} onClick={()=>{ setOpenD("dashboard");}} /></IconButton></Box><Grid container> <Grid item xs={12} md={12} sm={12} lg={12}>
                      <MUIDataTable title={"Route details report > "+reportType} data={routeDetailsReport} columns={columnsRouteDetails} options={options}/>
                     </Grid> </Grid></Box>}
                     {openD=="userDetails"&&<Box ><Box width="100%" display="flex" justifyContent="flex-end"><IconButton><CancelPresentation style={{color:"#EC3C39"}} onClick={()=>{ setOpenD("dashboard");}} /></IconButton></Box><Grid container> <Grid item xs={12} md={12} sm={12} lg={12}>
                      <MUIDataTable title={"User details report > "+reportType} data={userDetailsReport} columns={columnsUserDetails} options={options}/>
                     </Grid> </Grid></Box>}

                     {/* details */}
                    </Box>

                    </div> );}
                   export default withLocalize(Dashboard);