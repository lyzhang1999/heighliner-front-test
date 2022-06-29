import { createTheme } from "@mui/material/styles";
import JostLight from "../styles/fonts/Jost-Light.ttf";
import JostRegular from "../styles/fonts/Jost-Regular.ttf";
import JostMedium from "../styles/fonts/Jost-Medium.ttf";
import RobotoRegular from "../styles/fonts/Roboto-Regular.ttf";
import RobotoMedium from "../styles/fonts/Roboto-Medium.ttf";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1B51B9",
      light: "#1B51B9",
      dark: "#1B51B9",
    },
    secondary: {
      main: "#11cb5f",
    },
  },
  typography: {
    fontFamily: "Roboto",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Jost';
          font-style: normal;
          font-weight: 300;
          src: url(${JostLight}) format('truetype');
        }

        @font-face {
          font-family: 'Jost';
          font-style: normal;
          font-weight: 400;
          src: url(${JostRegular}) format('truetype');
        }

        @font-face {
          font-family: 'Jost';
          font-style: normal;
          font-weight: 500;
          src: url(${JostMedium}) format('truetype');
        }

        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 400;
          src: url(${RobotoRegular}) format('truetype');
        }

        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 500;
          src: url(${RobotoMedium}) format('truetype');
        }
      `,
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: "capitalize",
        },
      },
    },
  },
});

export default theme;
