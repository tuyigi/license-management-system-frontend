import { createMuiTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

function MyTheme(t) {
  let theme = createMuiTheme({
    palette: {
      type: t == 0 ? "light" : "dark",
      background: { default: t == 0 ? "#faf1dc" : "#303030" },
      primary: { main: "#a47d30", contrastText: "#fff" }, // Primary color
      secondary: { main: "#ebcf8a" }, // secondary color
    },
    typography: {
      useNextVariants: true,
      fontFamily: "lato",
    },
  });

  return theme;
}

function createStyled(styles, options) {
  function Styled(props) {
    const { children, ...other } = props;
    return children(other);
  }
  Styled.propTypes = {
    children: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  };
  return withStyles(styles, options)(Styled);
}

const Styled = createStyled({
  root: {
    background: "linear-gradient(45deg, #f8a774 30%, #f6567e 90%)",
    borderRadius: 25,
    border: 0,
    color: "white",
    height: 40,
    padding: "0 30px",
    boxShadow: "0 1px 1px 2px rgba(255, 105, 135, .3)",
  },
});

export { MyTheme, Styled };
