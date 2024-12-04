/*jsx es como un html que puedes poner javascript dentro*/
import { Toaster } from "sonner";
import PlayersPage from "./modules/features/players/pages/PlayersPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClubsPage from "./modules/features/clubs/pages/ClubsPage";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toastError } from "./modules/core/utils/toast";
import GamePage from "./modules/features/game/pages/GamePage";
import HomePage from "./modules/features/home/pages/HomePage";
import Dashboard from "./modules/layout/Dashboard";
import { ThemeProvider } from "./components/theme-provider";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(error.message);
      toastError(error.message);
    },
  }),
});
/*un componente de react es una funcion de javascrip y puede ser oh flecha o function*/
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route path="/" element={<PlayersPage />} />
              <Route path="/clubs" element={<ClubsPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/games" element={<GamePage />} />
            </Route>
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
export default App;
/*cunado pones export default se puede importar en otro archivo*/
/* el toaster es la libreria de los mensajes */
