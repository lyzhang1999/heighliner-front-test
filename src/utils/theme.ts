import { createTheme } from "@mui/material/styles";
import JostLight from "../styles/fonts/Jost-Light.ttf";
import JostRegular from "../styles/fonts/Jost-Regular.ttf";
import JostMedium from "../styles/fonts/Jost-Medium.ttf";


const theme = createTheme({
  palette: {
    primary: {
      main: "#6002ee",
      light: "#6002ee",
      dark: "#6002ee",
    },
    secondary: {
      main: "#11cb5f",
    },
  },
  typography: {
    fontFamily: "Jost",
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
      `,
    },
  },
});

export default theme;
