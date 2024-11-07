import Modal from "@/modules/core/components/ui/Modal";
import useFetch from "@/modules/core/hooks/useFetch";
import { useState } from "react";
import GameForm from "../components/GameForm";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toast";
import { Game } from "../api/responses";

const GamePage = () => {
  const { fetchData, postData } = useFetch();
  const [open, setOpen] = useState(false);
  /* Es un estado, son las variaciones de la interfaz */
  const { data, setData } = fetchData("GET /game");
  const deleteMutation = postData("DELETE /game/:id");
  const [gameSelected, setGameSelected] = useState<Game | null>(null);
  const handleDelete = (id: string) => {
    toastConfirm("Seguro que quieres eliminar el registro del juego?", () => {
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
      <div>Game</div>
      <button
        onClick={() => {
          setOpen(true);
          setGameSelected(null);
        }}
      >
        Añadir Juego
      </button>
      {open && (
        <Modal closeModal={() => setOpen(false)} title="Registro de partidos">
          <p>Ingrese todos los datos del juego</p>
          <GameForm
            closeModal={() => setOpen(false)}
            setData={setData}
            game={gameSelected}
          />
        </Modal>
      )}
      <div>
        {data?.map((v) => (
          <div key={v.id}>
            <p>
              {v.winner} 
            </p>
            <button onClick={() => handleDelete(v.id)}>
              Eliminar juego
            </button>
            <button
              onClick={() => {
                setOpen(true);
                setGameSelected(v);
              }}
            >
              Editar juego
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default GamePage;
