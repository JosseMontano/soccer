import Modal from "@/modules/core/components/ui/Modal";
import useFetch from "@/modules/core/hooks/useFetch";
import { useState } from "react";
import PlayerForm from "../components/PlayerForm";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toast";
import { Player } from "../api/responses";

const PlayersPage = () => {
  const { fetchData, postData } = useFetch();
  const [open, setOpen] = useState(false);
  /* Es un estado, son las variaciones de la interfaz */
  const { data, setData } = fetchData("GET /players");
  const deleteMutation = postData("DELETE /players/:id");
  const [playerSelected, setPlayerSelected] = useState<Player | null>(null);
  const handleDelete = (id: string) => {
    toastConfirm("Seguro que quieres eliminar el registro del jugador?", () => {
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
      <div>Players</div>
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
          <PlayerForm
            closeModal={() => setOpen(false)}
            setData={setData}
            player={playerSelected}
          />
        </Modal>
      )}
      <div>
        {data?.map((player) => (
          <div key={player.id}>
            <p>
              {player.name} {player.lastName}
            </p>
            <button onClick={() => handleDelete(player.id)}>
              Eliminar jugador
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

export default PlayersPage;
