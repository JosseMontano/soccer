/*jsx es como un html que puedes poner javascript dentro*/
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { AdminPermissos } from "./modules/core/constants/ROLES";
import useUserStore from "./modules/core/store/userStore";
import { toastError } from "./modules/core/utils/toast";
import ClubsPage from "./modules/features/clubs/pages/ClubsPage";
import GamePage from "./modules/features/game/pages/GamePage";
import HomePage from "./modules/features/home/pages/HomePage";
import LoginPage from "./modules/features/login/pages/LoginPage";
import PlayersPage from "./modules/features/players/pages/PlayersPage";
import RegisterPage from "./modules/features/register/pages/RegisterPage";
import Dashboard from "./modules/layout/Dashboard";
import TournamentPage from "./modules/features/tournament/pages/TournamentPage";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(error.message);
      toastError(error.message);
    },
  }),
});

function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return <p>Redirecting to the home page...</p>;
}

function App() {
  const { user } = useUserStore();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Dashboard />}>
              <Route path="/" element={<PlayersPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/tournament" element={<TournamentPage />} />
              {AdminPermissos(user) && (
                <>
                  <Route path="/clubs" element={<ClubsPage />} />

                  <Route path="/games" element={<GamePage />} />
                </>
              )}
            </Route>
             <Route path="*" element={<NotFoundPage />} /> 
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
