import {IconButton} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import React from "react";
import {useHistory} from "react-router-dom";
import {useSnackbar} from "notistack";


const Notify = (variant, msg, status) => {
    const history = useHistory();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
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


export {Notify}