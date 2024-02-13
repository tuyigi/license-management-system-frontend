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
    Box
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
    Receipt
  } from "@material-ui/icons";

  import MUIDataTable from "mui-datatables";

  import { Capitalize } from "../../helpers/capitalize"


const useStyles = makeStyles((theme) => ({
    root: {flexGrow: 1, [theme.breakpoints.up("sm")]: {marginLeft: 250,},},
    title: {flexGrow: 1,},
    btn: {textTransform: "capitalize",},
    btn2: {textTransform: "capitalize", border: "dashed grey 1px",},
    paper: {padding: 15,},
    action: {borderRadius: 15,},
}));

function Licenses(props){
    const classes = useStyles();


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

    const [status, setStatus] = useState("No licenses available....");
    const [name, setName] = useState({ value: "", error: "" });
    const [code, setCode] = useState({ value: "", error: "" });
    const [description, setDescription] = useState({ value: "", error: "" });
    const onNameChange = (event) => {
        if (event.target.value === "") {
          setName({
            value: "",
            error: "Please enter valid license name",
          });
        } else {
          setName({ value: event.target.value, error: "" });
        }
    };
    const onCodeChange = (event) => {
        if (event.target.value === "") {
          setCode({
            value: "",
            error: "Please enter valid license code",
          });
        } else {
          setCode({ value: event.target.value, error: "" });
        }
      };
      const onDescriptionChange = (event) => {
        if (event.target.value === "") {
            setDescription({
            value: "",
            error: "Please enter valid description",
          });
        } else {
            setDescription({ value: event.target.value, error: "" });
        }
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
          name: "name",
          label: "License Name",
          options: {
            filter: false,
            sort: true,
          },
        },
        {
          name: "code",
          label: "License Code",
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
          },
        },
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
                      {licenses.data[dataI].status.toLowerCase() == "enabled" ? (
                        <CheckCircle fontSize="small" />
                      ) : (
                          <Block fontSize="small" />
                        )}
                    </Avatar>
                  }
                  variant="outlined"
                  color={
                    licenses.data[dataI].status.toLowerCase() == "enabled"
                      ? "primary"
                      : "default"
                  }
                  size="small"
                  label={Capitalize(licenses.data[dataI]?.status)}
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
        searchPlaceholder: "Search user...",
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
            openEdit={()=>{}}
            toggling={licenses.toggling}
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
            Add New License Type
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
                    label={"License Name"}
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
                    required
                    size="small"
                    variant="outlined"
                    color="primary"
                    value={code.value}
                    placeholder={"Code"}
                    label={"License Code"}
                    fullWidth
                    onChange={onCodeChange}
                    helperText={code.error}
                    error={code.error !== ""}
                  />
                )}
              </Translate>
            </Box>



            <Box style={{marginTop:10}}>
              <Translate>
                {({ translate }) => (
                  <TextField
                    required
                    size="small"
                    variant="outlined"
                    color="primary"
                    value={description.value}
                    placeholder={"Code"}
                    label={"License Code"}
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
              disabled={licenses.saving}
              variant="contained"
              color="primary"
              onClick={()=>{}}
              disableElevation
            >
              {licenses.saving ? (
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
            <Receipt color="primary" fontSize="large" />
          </Box>
          <Typography variant="h5" className={classes.title}>
            <b>License Types</b>
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
            New License Type
          </Button>
        </Box>
        <Box style={{marginTop: 20}} />
  
        {licenses.loading && <LinearProgress />}
        <MUIDataTable
          title={"List of License Types"}
          data={licenses.data}
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
        <FormControlLabel
          control={
            <Switch
              disabled={props.toggling}
              checked={check}
              onChange={() => {
                toggleUser(displayData[selectedRows?.data[0]?.index]?.data[0]);
              }}
              value="vertical"
              color="primary"
            />
          }
          label={check ? "Deactivate License" : "Activate License"}
        />
  
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

export default withLocalize(Licenses);