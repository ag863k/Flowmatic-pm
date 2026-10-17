import AppRoutes from "./routes";
import { ThemeProvider } from "./context/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="flowmatic-ui-theme">
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
