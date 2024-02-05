import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withLocalize } from "react-localize-redux";
import {
  Menu,
  ButtonGroup,
  MenuItem,
  Button,
  Snackbar,
} from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";

import Uk from "../assets/svg/gb.svg";
import France from "../assets/svg/fr.svg";
import Rwanda from "../assets/svg/rw.svg";

const useStyles = makeStyles((theme) => ({
  img: {
    height: 20,
  },
}));

function getFlag(ln) {
  var f;

  if (ln != null) {
    if (ln.code === "rw") {
      f = Rwanda;
    } else if (ln.code === "en") {
      f = Uk;
    } else {
      f = France;
    }
  }

  return f;
}

const LanguageToggleMenu = ({
  languages,
  activeLanguage,
  setActiveLanguage,
  close,
}) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const doClose = (code) => {
    if (code == "fr" || code == "rw") {
      handleUnavailable();
      return;
    }
    close(code);
    setActiveLanguage(code);
    handleMenuClose();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUnavailable = () => {
    setOpen(!open);
  };

  const ln = activeLanguage;

  return (
    <div>
      <Snackbar
        onClose={handleUnavailable}
        action={
          <Button color="secondary" onClick={handleUnavailable}>
            Close
          </Button>
        }
        open={open}
        autoHideDuration={3000}
        message="This language is not currently available in this version"
      />

      <ButtonGroup
        variant="text"
        size="small"
        color="secondary"
        ref={anchorEl}
        aria-label="split button"
      >
        <Button
          startIcon={
            <img src={getFlag(ln)} className={classes.img} alt="flag" />
          }
          endIcon={<ArrowDropDown />}
          onClick={handleMenuClick}
          size="small"
        >
          {ln == null ? "Language" : ln.name}
        </Button>
      </ButtonGroup>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {languages.map((lang, i) => (
          <MenuItem
            key={i}
            selected={lang.code === ln.code}
            onClick={() => doClose(lang.code)}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default withLocalize(LanguageToggleMenu);
