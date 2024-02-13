import React,{useState,useEffect} from "react";
import {withLocalize, Translate} from "react-localize-redux";
import {makeStyles,} from "@material-ui/styles";
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
    Receipt,
    PeopleAltOutlined
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


function Users(props){
    const classes = useStyles();


    const [addNewOpen, setAddNewOpen] = useState(false);
    const [users, setUsers] = useState({
      page: 0,
      count: 1,
      rowsPerPage: 10,
      sortOrder: {},
      saving: false,
      loading: false,
      toggling: false,
      data: [],
    });

    const [status, setStatus] = useState("No users available....");
    const [name, setName] = useState({ value: "", error: "" });
    const [code, setCode] = useState({ value: "", error: "" });
    const [description, setDescription] = useState({ value: "", error: "" });
    const onNameChange = (event) => {
        if (event.target.value === "") {
          setName({
            value: "",
            error: "Please enter valid name",
          });
        } else {
          setName({ value: event.target.value, error: "" });
        }
    };
    const onCodeChange = (event) => {
        if (event.target.value === "") {
          setCode({
            value: "",
            error: "Please enter valid code",
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
                  name: "first_name",
                  label: "First Name",
                  options: {
                    filter: false,
                    sort: true,
                  },
                },
                {
                  name: "last_name",
                  label: "Last Name",
                  options: {
                    filter: false,
                    sort: false,
                  },
                },
                {
                  name: "username",
                  label: "Username",
                  options: {
                    filter: false,
                    sort: false,
                  },
                },
                {
                  name: "email",
                  label: "Email",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },
                {
                    name: "phone_number",
                    label: "Phone Number",
                    options: {
                      filter: true,
                      sort: true,
                    },
                  },
                  {
                    name: "role",
                    label: "Role",
                    options: {
                      filter: true,
                      sort: true,
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
                              {users.data[dataI].status.toLowerCase() == "enabled" ? (
                                <CheckCircle fontSize="small" />
                              ) : (
                                  <Block fontSize="small" />
                                )}
                            </Avatar>
                          }
                          variant="outlined"
                          color={
                            users.data[dataI].status.toLowerCase() == "enabled"
                              ? "primary"
                              : "default"
                          }
                          size="small"
                          label={Capitalize(users.data[dataI]?.status)}
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
                  var user = users.data[cellMeta.dataIndex];
        
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
                  <CustomUserToolbar
                    selectedRows={selectedRows}
                    displayData={displayData}
                    setSelectedRows={setSelectedRows}
                    toggleUser={()=>{}}
                    openEdit={()=>{}}
                    toggling={users.toggling}
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
            Add New User
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
                    label={"Name"}
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
                    label={"Code"}
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
                    label={"Code"}
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
              disabled={users.saving}
              variant="contained"
              color="primary"
              onClick={()=>{}}
              disableElevation
            >
              {users.saving ? (
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
            <PeopleAltOutlined color="primary" fontSize="large" />
          </Box>
          <Typography variant="h5" className={classes.title}>
            <b>Users</b>
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
            New User
          </Button>
        </Box>
        <Box style={{marginTop: 20}} />
  
        {users.loading && <LinearProgress />}
        <MUIDataTable
          title={"List of users"}
          data={users.data}
          columns={columns}
          options={options}
        />
      </div>
    );
}

function CustomUserToolbar(props) {
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
          label={check ? "Deactivate User" : "Activate User"}
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

export default withLocalize(Users);