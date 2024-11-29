import Modal from "@/modules/core/components/ui/Modal";
import useFetch from "@/modules/core/hooks/useFetch";
import { useState } from "react";
import HistoryplayerForm from "../components/HistoryplayerForm";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toast";
import { Historyplayer } from "../api/responses";

const HistoryplayersPage = () => {
  const { fetchData, postData } = useFetch();
  const [open, setOpen] = useState(false);
  /* Es un estado, son las variaciones de la interfaz */
  const { data, setData } = fetchData("GET /historyplayers");
  const deleteMutation = postData("DELETE /historyplayers/:id");
  const [playerSelected, setPlayerSelected] = useState<Historyplayer | null>(null);
  const handleDelete = (id: string) => {
    toastConfirm("Seguro que quieres eliminar el historial del jugador?", () => {
      deleteMutation(null, {
        params: {
          id,
        },
        onSuccess: (response) => {
          setData((prev) => prev.filter((item) => item.id !== id));
          toastSuccess(response.message);
        },
      });
    });
  };
  return (
    <>
      <div>History Players</div>
      <button
        onClick={() => {
          setOpen(true);
          setPlayerSelected(null);
        }}
      >
        Añadir jugador
      </button>
      {open && (
        <Modal closeModal={() => setOpen(false)} title="Registro de jugadores">
          <p>Ingrese todos los datos de los jugadores</p>
          <HistoryplayerForm
            closeModal={() => setOpen(false)}
            setData={setData}
            historyplayer={playerSelected}
          />
        </Modal>
      )}
      <div>
        {data?.map((player) => (
          <div key={player.id}>
            <p>
            </p>
            <button onClick={() => handleDelete(player.id)}>
              Eliminar historial del jugador
            </button>
            <button
              onClick={() => {
                setOpen(true);
                setPlayerSelected(player);
              }}
            >
              Editar Jugador
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default HistoryplayersPage;
