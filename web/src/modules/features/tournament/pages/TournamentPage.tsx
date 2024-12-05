import Modal from "@/modules/core/components/ui/Modal";
import useFetch from "@/modules/core/hooks/useFetch";
import { useState } from "react";
import TournamentForm from "../components/tournamentForm";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toast";
import { Tournament } from "../api/responses";

const TournamentPage = () => {
  const { fetchData, postData } = useFetch();
  const [open, setOpen] = useState(false);
  /* Es un estado, son las variaciones de la interfaz */
  const { data, setData } = fetchData("GET /tournaments");
  const deleteMutation = postData("DELETE /tournaments/:id");
  const [tournamentSelected, setTournamentSelected] =
    useState<Tournament | null>(null);
  const handleDelete = (id: string) => {
    toastConfirm("Seguro que quieres eliminar el registro del torneo?", () => {
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
      <div>Tournament</div>
      <button
        onClick={() => {
          setOpen(true);
          setTournamentSelected(null);
        }}
      >
        Añadir Torneo
      </button>
      {open && (
        <Modal closeModal={() => setOpen(false)} title="Registro de partidos">
          <p>Ingrese todos los datos del juego</p>
          <TournamentForm
            closeModal={() => setOpen(false)}
            setData={setData}
            tournament={tournamentSelected}
          />
        </Modal>
      )}
      <div>
        {data?.map((v) => (
          <div key={v.id}>
            <p>{v.name}</p>
            <button onClick={() => handleDelete(v.id)}>Eliminar juego</button>
            <button
              onClick={() => {
                setOpen(true);
                setTournamentSelected(v);
              }}
            >
              Editar torneos
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default TournamentPage;
