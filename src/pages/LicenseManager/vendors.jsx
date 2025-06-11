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
    Receipt, Close, LocationCity, WorkOutlineOutlined, Business, Publish
  } from "@material-ui/icons";
  import MUIDataTable from "mui-datatables";
  import { Capitalize } from "../../helpers/capitalize";
  import axios from "axios";
  import {BackendService} from "../../utils/web_config";
  import {useSnackbar} from "notistack";
  import {useHistory} from "react-router-dom";
import * as XLSX from "xlsx";
import ToggleSwitch from "./toggle_switch";



const useStyles = makeStyles((theme) => ({
    root: {flexGrow: 1, [theme.breakpoints.up("sm")]: {marginLeft: 250,},},
    title: {flexGrow: 1,},
    btn: {textTransform: "capitalize",marginRight:'16px'},
    btn2: {textTransform: "capitalize", border: "dashed grey 1px",},
    paper: {padding: 15,},
    action: {borderRadius: 15,},
}));

function Vendors(props) {
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();
    const [addNewOpen, setAddNewOpen] = useState(false);
    const [vendors, setVendors] = useState({
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
        getVendors(accData.access_token);
    }, [])

    const [status, setStatus] = useState("No vendors available....");
    const getVendors = (token) => {
        const vendorInstance = axios.create(new BackendService().getHeaders(token));
        setVendors({...vendors, loading: true});
        vendorInstance
            .get(new BackendService().VENDOR)
            .then(function (response) {
                setVendors({...vendors, loading: false});
                const d = response.data;
                if (d.data.length == 0) {
                    setStatus("There are no vendors available.");
                } else {
                    var lcs = d.data;

                    setVendors({
                        ...vendors,
                        data: lcs,
                    });
                    //set status
                    setStatus("Licenses loaded")
                }
            })
            .catch(function (error) {
                setVendors({...vendors, loading: false});
                var e = error.message;

                if (error.response) {
                    e = error.response.data.message;
                }
                setStatus(e);
                notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
            });
    };


    const [name, setName] = useState({value: "", error: ""});
    const [website, setWebsite] = useState({value: "", error: ""});
    const [description, setDescription] = useState({value: "", error: ""});
    const onNameChange = (event) => {
        if (event.target.value === "") {
            setName({
                value: "",
                error: "Please enter valid vendor name",
            });
        } else {
            setName({value: event.target.value, error: ""});
        }
    };
    const onWebsiteChange = (event) => {
            setWebsite({value: event.target.value, error: ""});
    };
    const onDescriptionChange = (event) => {
            setDescription({value: event.target.value, error: ""});
    };


    const addLicense = () => {
        if (name.value === "") {
            setName({
                value: "",
                error: "Please provide valid name",
            });
        } else {
            createVendor();
        }
    }

    const createVendor = () => {
        const licenseInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        setVendors({...vendors, saving: true});
        const data = {
            name: name.value,
            website: website.value,
            description: description.value
        }
    licenseInstance
        .post(new BackendService().VENDOR, data)
        .then(function (response) {
            setVendors({...vendors, saving: false});
            var d = response.data;
            var lcs = vendors.data;
            const newLicense = d.data;
            lcs.unshift(newLicense);
            setVendors({
                ...vendors,
                data: lcs,
            });
            clearVendorInfo()
            notify("success", response.data.message);
            setAddNewOpen(false);
        })
        .catch(function (error) {
            setVendors({...vendors, saving: false});
            var e = error.message;
            if (error.response) {
                e = error.response.data.message;
            }
            notify(error?.response?.status == 404 ? "info" : "error", e, error?.response?.status);
        });

}

    // clear data

    const clearVendorInfo = () => {
        setName({ value: "", error: "" });
        setDescription({ value: "", error: "" });
        setWebsite({ value: "", error: "" });
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


    const handleToggleVendorStatus = (vendor) => {
        const updatedStatus = vendor.status === "ENABLED" ? "DISABLED" : "ENABLED";
        const vendorInstance = axios.create(new BackendService().getHeaders(accountData.token));
        vendorInstance
            .put(`${new BackendService().VENDOR}/status/${vendor.id}`, { status: updatedStatus })
            .then((response) => {
                notify("success", `Vendor ${updatedStatus}`);
                const updatedData = vendors.data.map((v) =>
                    v.id === vendor.id ? { ...v, status: updatedStatus } : v
                );
                setVendors({ ...vendors, data: updatedData });
            })
            .catch((error) => {
                notify("error", "Failed to update vendor status");
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
          name: "vendor_name",
          label: "Name",
          options: {
            filter: false,
            sort: true,
          },
        },
        {
          name: "vendor_website",
          label: "Website",
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
              name: "created_at",
              label: "Created At",
              options: {
                  filter: true,
                  sort: true,
                  customBodyRender: (value) => {
                      if (!value) return "";
                      const date = new Date(value);
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = (date.getMonth() + 1).toString().padStart(2, '0');
                      const year = date.getFullYear();
                      const hours = date.getHours().toString().padStart(2, '0');
                      const minutes = date.getMinutes().toString().padStart(2, '0');
                      return `${day}-${month}-${year} ${hours}:${minutes}`;
                  }
              }
          }
          ,
/*
          {
          name: "status",
          label: "Status",
          options: {
            filter: true,
            sort: false,
            customBodyRenderLite: function (dataI, rowI) {
              return (
                <Chip
                  avatar={
                    <Avatar>
                      {vendors.data[dataI].status.toLowerCase() == "enabled" ? (
                        <CheckCircle fontSize="small" />
                      ) : (
                          <Block fontSize="small" />
                        )}
                    </Avatar>
                  }
                  variant="outlined"
                  color={
                    vendors.data[dataI].status.toLowerCase() == "enabled"
                      ? "primary"
                      : "default"
                  }
                  size="small"
                  label={Capitalize(vendors.data[dataI]?.status)}
                />
              );
            },
          },
        },
*/
          {
              name: "status",
              label: "Status",
              options: {
                  filter: true,
                  sort: false,
                  customBodyRenderLite: (dataI) => {
                      const vendor = vendors.data[dataI];
                      const isEnabled = vendor.status?.toLowerCase() === "enabled";

                      return (
                          <ToggleSwitch
                              checked={isEnabled}
                              onChange={() => handleToggleVendorStatus(vendor)}
                          />
                      );
                  },
              },
          }

      ];
    
      const options = {
        filterType: "multiselect",
        elevation: 0,
        selectableRows: "single",
        searchPlaceholder: "Search vendor...",
        selectableRowsOnClick: true,
        fixedHeader: true,
        onCellClick: (cellData, cellMeta) => {
          var license = vendors.data[cellMeta.dataIndex];

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
/*        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
          <CustomLicenseToolbar
            selectedRows={selectedRows}
            displayData={displayData}
            setSelectedRows={setSelectedRows}
            toggleUser={()=>{}}
            openEdit={()=>{}}
            toggling={vendors.toggling}
          />
        ),*/
      };

      // end table config

    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setFileName(file.name);
        try {
            const data = await readExcelFile(file);
            await uploadDataToApi(data);
            setFileName('');
        } catch (error) {
            console.error('Upload failed:', error);
            setLoading(false);
        }
    };

    const readExcelFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error('Failed to parse Excel file'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    };
    const uploadDataToApi = async (data) => {
        setLoading(true);
        const uploadInstance = axios.create(
            new BackendService().getHeaders(accountData.token)
        );
        const fileInput = document.getElementById('upload-vendor-file');
        if (fileInput) {
            fileInput.value = '';
        }
        uploadInstance
            .post(new BackendService().VENDOR_UPLOADS , data)
            .then((response) => {
                console.log('Upload successful:', response.data);
                notify("success", response.data.message || "Upload successful");
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            })
            .catch((error) => {
                let errorMessage = error.message;
                if (error.response) {
                    errorMessage = error.response.data.message;
                }
                console.log('Upload failed:', errorMessage);
                notify(error?.response?.status === 404 ? "info" : "error", errorMessage, error?.response?.status);
            })
            .finally(() => {
                setLoading(false);
            });
    }
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
            Add New Vendor
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
                    placeholder={"Name"}
                    label={"Vendor Name"}
                    fullWidth
                    onChange={onNameChange}
                    helperText={name.error}
                    error={name.error !== ""}
                  />
                )}
              </Translate>
            </Box>

            <Box style={{marginTop:10}}>
              <Translate>
                {({ translate }) => (
                  <TextField
                    size="small"
                    variant="outlined"
                    color="primary"
                    value={website.value}
                    placeholder={"Website"}
                    label={"Website"}
                    fullWidth
                    onChange={onWebsiteChange}
                    helperText={website.error}
                    error={website.error !== ""}
                  />
                )}
              </Translate>
            </Box>



            <Box style={{marginTop:10}}>
              <Translate>
                {({ translate }) => (
                  <TextField
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
              disabled={vendors.saving}
              variant="contained"
              color="primary"
              onClick={()=>{ addLicense() }}
              disableElevation
            >
              {vendors.saving ? (
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
                    <Business color="primary" fontSize="large"/>
                </Box>
                <Typography variant="h5" className={classes.title}>
                    <b>Vendors</b>
                </Typography>
                <Box sx={{ textAlign: 'center', my: 2, position: 'relative' }}>
                <input
                    accept=".xlsx,.xls"
                    style={{display: 'none'}}
                    id="upload-vendor-file"
                    type="file"
                    onChange={handleFileChange}
                    disabled={loading}
                />
                <label htmlFor="upload-vendor-file">
                    <Button
                        color="primary"
                        size={"medium"}
                        className={classes.btn}
                        variant="contained"
                        component="span"
                        disabled={loading}
                        startIcon={<Publish/>}

                    >

                        {loading ? 'Uploading...' : 'Upload Vendors'}
                    </Button>
                </label>
                <Button
                    className={classes.btn}
                    color="primary"
                    variant="contained"
                    size="medium"
                    startIcon={<Add/>}
                    disableElevation
                    onClick={() => {
                        setAddNewOpen(true);
                    }}
                >
                    New Vendor
                </Button>
                </Box>
            </Box>
            <Box style={{marginTop: 20}}/>

            {vendors.loading && <LinearProgress/>}
            <MUIDataTable
                title={"List of vendors"}
                data={vendors.data}
                columns={columns}
                options={options}
            />
        </div>
    );
}


function CustomLicenseToolbar(props) {
    const {displayData, selectedRows, openEdit} = props;
    return (
        <Box display="flex" alignItems="center">
            <Button
                color="primary"
                variant="outlined"
                size="small"
                startIcon={<Edit/>}
                onClick={() =>
                    openEdit(displayData[selectedRows?.data[0]?.index]?.data[0])
                }
            >
                Edit
            </Button>
        </Box>
    );
}

export default withLocalize(Vendors);