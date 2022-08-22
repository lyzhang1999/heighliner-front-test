import { createTheme } from "@mui/material/styles";

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
          src: url("/fonts/Jost-Light.ttf") format('truetype');
        }

        @font-face {
          font-family: 'Jost';
          font-style: normal;
          font-weight: 400;
           src: url("/fonts/Jost-Regular.ttf") format('truetype');
        }

        @font-face {
          font-family: 'Jost';
          font-style: normal;
          font-weight: 500;
          src: url("/fonts/Jost-Medium.ttf") format('truetype');
        }

        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 400;
          src: url("/fonts/Roboto-Regular.ttf") format('truetype');
        }

        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 500;
          src: url("/fonts/Roboto-Medium.ttf") format('truetype');
        }

        @font-face {
          font-family: 'OpenSans';
          font-style: normal;
          font-weight: 400;
          src: url("/fonts/OpenSans-Regular.ttf") format('truetype');
        }

        @font-face {
          font-family: 'OpenSans';
          font-style: normal;
          font-weight: 600;
          src: url("/fonts/OpenSans-SemiBold.ttf") format('truetype');
        }

        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          src: url("/fonts/Inter-Regular.ttf") format('truetype');
        }

        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 500;
          src: url("/fonts/Inter-Medium.ttf") format('truetype');
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
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
          borderSpacing: "0 14px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: "Inter",
          fontSize: "15px",
          fontWeight: 500,
          borderBottom: "none",
        },
        head: {
          color: "#606479",
          textTransform: "uppercase"
        },
      },
    },
  },
});

export default theme;
