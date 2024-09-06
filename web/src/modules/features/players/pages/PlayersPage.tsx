import Modal from "@/modules/core/components/ui/Modal";
import useFetch from "@/modules/core/hooks/useFetch";
import { useState } from "react";
import PlayerForm from "../components/PlayerForm";

const PlayersPage = () => {
  const { fetchData } = useFetch();
  const [open, setOpen] = useState(false);
  /* Es un estado, son las variaciones de la interfaz */
  const { data, setData } = fetchData(["players"], "GET /players");
  return (
    <>
      <div>Players</div>
      <button onClick={() => setOpen(true)}>Añadir jugador</button>
      {open && (
        <Modal closeModal={() => setOpen(false)} title="Registro de jugadores">
          <p>Ingrese todos los datos de los jugadores</p>
          <PlayerForm
            closeModal={() => setOpen(false)}
            modifyData={(data) => setData((prev) => [...prev, data])}
          />
        </Modal>
      )}
      <div>
        {data?.map((player) => (
          <div>
            <p key={player.id}>
              {player.name} {player.lastName}
            </p>
            <button>Eliminar jugador</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default PlayersPage;
