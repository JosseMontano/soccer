import { Button } from "@/components/ui/button";
import Modal from "@/modules/core/components/ui/Modal";
import useFetch from "@/modules/core/hooks/useFetch";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toast";
import { useState } from "react";
import { Tournament } from "../api/responses";
import TournamentForm from "../components/tournamentForm";

const TournamentPage = () => {
  const { fetchData, postData } = useFetch();
  const { data, setData } = fetchData("GET /tournaments");
  const deleteMutation = postData("DELETE /tournaments/:id");
  const generateFixtureMutation = postData("POST /tournaments/:id/generate-fixture");
  const [tournamentSelected, setTournamentSelected] =
    useState<Tournament | null>(null);

  const handleDelete = (id: string) => {
    toastConfirm("¿Seguro que quieres eliminar el registro del torneo?", () => {
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
  const handleFitxure = (id: string) => {
    toastConfirm("¿Quieres crear el fixture para este torneo?", () => {
      generateFixtureMutation(null, {
        params: {
          id,
        },
        onSuccess: (response) => {
          toastSuccess(response.message);
        },
      });
    });
  };
  return (
    <section className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
      <div>Torneos</div>
      <Modal
        title="Registro de Torneos"
        description="Ingrese todos los datos del torneo"
        button={
          <Button
            onClick={() => {
              setTournamentSelected(null); // Limpia el formulario
            }}
          >
            Añadir Torneo
          </Button>
        }
      >
        <TournamentForm
          closeModal={() => {}}
          setData={setData}
          tournament={tournamentSelected}
        />
      </Modal>
      <div className="flex-1 overflow-auto flex flex-col gap-4">
        {data?.map((tournament) => (
          <div
            key={tournament.id}
            className="p-4 border rounded-md flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Nombre:</strong> {tournament.name}
              </p>
              <p>
                <strong>Fecha:</strong> {tournament.dateStart}
              </p>
            </div>
            <div className="flex gap-2">
              <Modal
                title="Editar Torneo"
                description="Modifique los datos del torneo"
                button={
                  <Button
                    variant="secondary"
                    onClick={() => setTournamentSelected(tournament)}
                  >
                    Editar
                  </Button>
                }
              >
                <TournamentForm
                  closeModal={() => {}}
                  setData={setData}
                  tournament={tournamentSelected}
                />
              </Modal>
              <Button
                variant="destructive"
                onClick={() => handleDelete(tournament.id)}
              >
                Eliminar
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleFitxure(tournament.id)}
              >
                Generar fixture
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TournamentPage;
