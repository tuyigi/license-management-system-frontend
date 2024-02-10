import React,{useState,useEffect} from "react";
import {withLocalize} from "react-localize-redux";
import {makeStyles} from "@material-ui/styles";


const useStyles = makeStyles((theme) => ({
    root: {flexGrow: 1, [theme.breakpoints.up("sm")]: {marginLeft: 250,},},
    title: {flexGrow: 1,},
    btn: {textTransform: "capitalize",},
    btn2: {textTransform: "capitalize", border: "dashed grey 1px",},
    paper: {padding: 15,},
    action: {borderRadius: 15,},
}));

function LicenseTracking(props){
    const classes = useStyles();
    return(
        <div className={classes.root}>

        </div>
    );
}
export default withLocalize(LicenseTracking);