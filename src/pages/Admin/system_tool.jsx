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
    Box, IconButton
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
    Receipt, Close, LocationCity, ImportantDevices
  } from "@material-ui/icons";
  import MUIDataTable from "mui-datatables";
  import { Capitalize } from "../../helpers/capitalize";
  import axios from "axios";
  import {BackendService} from "../../utils/web_config";
  import {useSnackbar} from "notistack";
  import {useHistory} from "react-router-dom";
import {useFunctions} from "../../hooks/use_hooks";
import {Autocomplete} from "@material-ui/lab";



const useStyles = makeStyles((theme) => ({
    root: {flexGrow: 1, [theme.breakpoints.up("sm")]: {marginLeft: 250,},},
    title: {flexGrow: 1,},
    btn: {textTransform: "capitalize",},
    btn2: {textTransform: "capitalize", border: "dashed grey 1px",},
    paper: {padding: 15,},
    action: {borderRadius: 15,},
}));

function SystemTool(props) {
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();
    const functions = useFunctions();
    const [addNewOpen, setAddNewOpen] = useState(false);
    const [systemTools, setSystemTools] = useState({
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
    const [department, setDepartment] = useState({ value: '', error: ''});
    useEffect(() => {
        var accData = new BackendService().accountData;
        console.log('accData',accData.user.department.id);
        setAccountData(accData);
        setDepartment({ value: accData.user.department.id, error: ''});
        getSystemTools(accData.access_token);
    }, [])

    const [status, setStatus] = useState("No systemTools available....");
    const getSystemTools = (token) => {
        const licenseInstance = axios.create(new BackendService().getHeaders(token));
        setSystemTools({...systemTools, loading: true});
        licenseInstance
            .get(new BackendService().SYSTME_TOOLS)
            .then(function (response) {
                setSystemTools({...systemTools, loading: false});
                const d = response.data;
                if (d.data.length == 0) {
                    setStatus("There are no system tools available.");
                } else {
                    var lcs = d.data;

                    setSystemTools({
                        ...systemTools,
                        data: lcs,
                    });
                    //set status
                    setStatus("System Tools loaded")
                }
            })
            .catch(function (error) {
                setSystemTools({...systemTools, loading: false});
                var e = error.message;

                if (error.response) {
                    e = error.response.data.message;
                }
                setStatus(e);
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    };


    const [name, setName] = useState({value: "", error: ""});
    const [description, setDescription] = useState({value: "", error: ""});
    const [functionIds, setFunctionIds] = useState({ value: [], error: ''});
    const onNameChange = (event) => {
        if (event.target.value === "") {
            setName({
                value: "",
                error: "Please enter valid license name",
            });
        } else {
            setName({value: event.target.value, error: ""});
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
    const onFunctionChange = (event,v) => {
        console.log(v);
        setFunctionIds([]);
        if (v === null) {
            setFunctionIds({
                value: [],
                error: "Please select at least one function",
            });
        } else {
            const ids = v.map((o)=>o.id);
            console.log('ids',ids);
            checkFunctions(ids);
            setFunctionIds({value: ids, error: ""});
        }
    };

    const addSystemTool = () => {
        if (name.value === "") {
            setName({
                value: "",
                error: "Please provide valid System/Tool name",
            });
        } else if (description.value === "'") {
            setDescription({
                value: '',
                error: 'Please fulfill description'
            })
        } else {
            createSystemTool();
        }
    }
    const [similarFunctions, setSimilarFunctions] = useState([]);
    const checkFunctions = (functionsId) =>{
        setSimilarFunctions([]);
        const checkFunctionInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        checkFunctionInstance
            .put(new BackendService().CHECK_FUNCTION,functionsId)
            .then(function (response) {
                const d = response.data.data;
                setSimilarFunctions(d);
            })
            .catch(function (error) {
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });

    }

    const assignFunctions = (system_id,functionsId,message) =>{
        const assignFunctionInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        assignFunctionInstance
            .put(new BackendService().ASSIGN_FUNCTION+system_id,functionsId)
            .then(function (response) {
                const d = response.data.data;
                setSimilarFunctions([]);
                setSystemTools({...systemTools, saving: false});
                notify("success", message);
                setAddNewOpen(false);
            })
            .catch(function (error) {
                var e = error.message;
                if (error.response) {
                    e = error.response.data.message;
                }
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });

    }

    const createSystemTool = () => {
        const systemInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        setSystemTools({...systemTools, saving: true});

        const data = {
            name: name.value,
            description: description.value,
            department: department.value
        }

        systemInstance
        .post(new BackendService().SYSTME_TOOLS, data)
        .then(function (response) {
            var d = response.data;
            var lcs = systemTools.data;
            const newSystemTool = d.data;
            lcs.unshift(newSystemTool);
            setSystemTools({
                ...systemTools,
                data: lcs,
            });
            clearSystemInfo()
            assignFunctions(newSystemTool.id,functionIds.value,response.data.message)
        })
        .catch(function (error) {
            setSystemTools({...systemTools, saving: false});
            var e = error.message;
            if (error.response) {
                e = error.response.data.message;
            }
            notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
        });

}

    // clear data

    const clearSystemInfo = () => {
        setName({ value: "", error: "" });
        setDescription({ value: "", error: "" });
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
          name: "system_tool_name",
          label: "System / Tool",
          options: {
            filter: false,
            sort: true,
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
          name: "created_at",
          label: "Created At",
          options: {
            filter: true,
            sort: true,
          },
        }
      ];
    
      const options = {
        filterType: "multiselect",
        elevation: 0,
        selectableRows: "single",
        searchPlaceholder: "Search System Tool...",
        selectableRowsOnClick: true,
        fixedHeader: true,
        onCellClick: (cellData, cellMeta) => {
          var license = systemTools.data[cellMeta.dataIndex];

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
            toggling={systemTools.toggling}
          />
        ),
      };

      // end table config

    return(
        <div className={classes.root}>
        {/* Dialogs starts here */}

        {/* ////////////////////////// */}
  
        <Dialog
          open={addNewOpen}
          maxWidth="sm"
          fullWidth
          onClose={() => {
            setAddNewOpen(false)
          }}
        >
          <DialogTitle id="new-op">
            Add New System/Tool
          </DialogTitle>
          <DialogContent>
            <Box style={{marginTop:10}}>
              <Translate>
                {({ translate }) => (
                  <TextField
                    required
                    size="small"
                    variant="outlined"
                    color="primary"
                    value={name.value}
                    placeholder={"System/Tool"}
                    label={"System/tool Name"}
                    fullWidth
                    onChange={onNameChange}
                    helperText={name.error}
                    error={name.error !== ""}
                  />
                )}
              </Translate>
            </Box>
              <Box style={{marginTop: 10}}>
                  <Autocomplete
                      fullWidth
                      multiple
                      openOnFocus
                      options={functions}
                      getOptionLabel={(option) => `${option.name}`}
                      onChange={onFunctionChange}
                      renderInput={(params) => (
                          <TextField
                              {...params}
                              fullWidth
                              label={"Functions/Roles"}
                              variant="outlined"
                              size="small"
                              helperText={functionIds.error}
                              error={functionIds.error !== ""}
                          />
                      )}
                  />
              </Box>
              <Box><Typography style={{fontSize: '12px'}}>{similarFunctions.map((v)=>`${v.system_tool_name}(${v.total})`)}</Typography></Box>

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
                setAddNewOpen(false);
              }}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              disabled={systemTools.saving}
              variant="contained"
              color="primary"
              onClick={()=>{ addSystemTool() }}
              disableElevation
            >
              {systemTools.saving ? (
                <CircularProgress size={23} />
              ) : (
                "Save"
              )}
            </Button>
          </DialogActions>
        </Dialog>
  
        {/* Dialogs ends here */}
        <Box display="flex" style={{display: "flex"}}>
          <Box mr={2}>
            {" "}
            <ImportantDevices color="primary" fontSize="large" />
          </Box>
          <Typography variant="h5" className={classes.title}>
            <b> Systems / Tools</b>
          </Typography>
          <Button
            className={classes.btn}
            color="primary"
            variant="contained"
            size="medium"
            startIcon={<Add />}
            disableElevation
            onClick={() => {
             setAddNewOpen(true);
            }}
          >
            New System/Tool
          </Button>
        </Box>
        <Box style={{marginTop: 20}} />
  
        {systemTools.loading && <LinearProgress />}
        <MUIDataTable
          title={"List of Systems/Tools"}
          data={systemTools.data}
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
          startIcon={<Edit />}
          onClick={() =>
            openEdit(displayData[selectedRows?.data[0]?.index]?.data[0])
          }
        >
          Edit
        </Button>
      </Box>
    );
  }

export default withLocalize(SystemTool);