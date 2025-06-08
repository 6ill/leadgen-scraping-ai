import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import HomePage from "./pages/HomePage";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#dc004e",
        },
    },
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HomePage />
        </ThemeProvider>
    );
}

export default App;
