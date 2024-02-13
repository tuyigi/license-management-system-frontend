import React, { useState, useEffect, useCallback } from "react";

import { Typography, Box, Paper, Button, CssBaseline } from "@material-ui/core";

import { withLocalize, Translate } from "react-localize-redux";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";
import NFound from "./../../../assets/svg/404.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    [theme.breakpoints.up("sm")]: {
      marginLeft: 250,
    },
  },

  btn: {
    textTransform: "lowercase",
  },

  paper: {
    padding: 30,
  },
  action: {
    borderRadius: 15,
  },
}));

function NotFound(props) {
  const classes = useStyles();
  const history = useHistory();

  const { full } = props;

  return (
    <div className={full ? classes.root2 : classes.root}>
      <CssBaseline />
      <Paper elevation={0} className={classes.paper}>
        <Box
          m={7}
          p={7}
          border={0}
          borderRadius="borderRadius"
          classname={"root"}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <img src={NFound} height={100} alt="Not found" />
          <Box p={2} />
          <Typography variant="h4">
            The page you're looking for is not found.
          </Typography>
          <Box p={1} />
          <Typography align="center" color="textSecondary" gutterBottom>
            Make sure the address is correct and that the page hasn't moved. If
            you think this is a mistake, contact us.
          </Typography>
          <Button color="primary" onClick={() => history.goBack()}>
            Go back {process.env.REACT_APP_PROTOCAL}
          </Button>
        </Box>
      </Paper>
    </div>
  );
}

export default withLocalize(NotFound);
