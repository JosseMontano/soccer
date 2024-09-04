/*jsx es como un html que puedes poner javascript dentro*/
import { Toaster } from "sonner";
import PlayersPage from "./modules/features/players/pages/PlayersPage";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toastError } from "./modules/core/utils/toast";

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
    <QueryClientProvider client={queryClient}>
      <PlayersPage />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
export default App;
/*cunado pones export default se puede importar en otro archivo*/
/* el toaster es la libreria de los mensajes */
