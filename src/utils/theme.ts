import { createTheme } from "@mui/material/styles";
import JostLight from "../styles/fonts/Jost-Light.ttf";
import JostRegular from "../styles/fonts/Jost-Regular.ttf";
import JostMedium from "../styles/fonts/Jost-Medium.ttf";
import RobotoRegular from "../styles/fonts/Roboto-Regular.ttf";
import RobotoMedium from "../styles/fonts/Roboto-Medium.ttf";
import OpenSansRegular from "../styles/fonts/OpenSans-Regular.ttf";
import OpenSansSemiBold from "../styles/fonts/OpenSans-SemiBold.ttf";
import InterRegular from "../styles/fonts/Inter-Regular.ttf";
import InterMedium from "../styles/fonts/Inter-Medium.ttf";

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

        @font-face {
          font-family: 'OpenSans';
          font-style: normal;
          font-weight: 400;
          src: url(${OpenSansRegular}) format('truetype');
        }

        @font-face {
          font-family: 'OpenSans';
          font-style: normal;
          font-weight: 600;
          src: url(${OpenSansSemiBold}) format('truetype');
        }

        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          src: url(${InterRegular}) format('truetype');
        }

        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 500;
          src: url(${InterMedium}) format('truetype');
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
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: "Inter"
        }
      }
    },
  },
});

export default theme;
