// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "reactflow/dist/style.css";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from "@mui/material";
import { ColorContext } from "./ColorContext";
import { darkTheme } from "./themes/dark";
import { lightTheme } from "./themes/light";
import "./Global.css";
import posthog from "posthog-js";
import { AppConfig } from "./constants";
import { ToastContainer } from "react-toastify";
import {
  ThemeProvider as MTThemeProvider,
  TooltipStylesType,
} from "@material-tailwind/react";
import config, {
  POSTHOG_KEY_KEY,
  POSTHOG_HOST_KEY,
  SENTRY_DSN_KEY,
} from "config";
import * as Sentry from "@sentry/react";

interface IApp {
  children: React.ReactNode;
}
const App = ({ children }: IApp) => {
  const [mode, setMode] = useState<PaletteMode>("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );

  const theme = useMemo(
    () => createTheme(mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  const MTTheme: { tooltip: TooltipStylesType } = {
    tooltip: {
      styles: {
        base: {
          bg: "bg-white",
          color: "text-black",
        },
      },
    },
  };

  posthog.init(config.get(POSTHOG_KEY_KEY) ? config.get(POSTHOG_KEY_KEY) : "", {
    api_host: config.get(POSTHOG_HOST_KEY)
      ? config.get(POSTHOG_HOST_KEY)
      : "https://app.posthog.com",
  });

  useEffect(() => {
    Sentry.init({
      dsn: config.get(SENTRY_DSN_KEY),
      integrations: [
        new Sentry.BrowserTracing({
          // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
          tracePropagationTargets: [
            "localhost",
            /^https:\/\/laudspeaker\.com\/api/,
          ],
        }),
        new Sentry.Replay(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  }, []);

  return (
    <ColorContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {/* @ts-ignore */}
        <MTThemeProvider value={MTTheme}>
          <CssBaseline enableColorScheme />
          <ToastContainer
            className={"z-[2147483647]"}
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          {children}
        </MTThemeProvider>
      </ThemeProvider>
    </ColorContext.Provider>
  );
};

export default App;
