import useFetch, { SetData } from "@/modules/core/hooks/useFetch";
import TournamentTableRow from "../../home/components/TournamentTableRow";
import { Tournament } from "../api/responses";
import Modal from "@/modules/core/components/ui/Modal";
import { Button } from "@/components/ui/button";
import TournamentForm from "./tournamentForm";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toast";
import EditFixtureForm from "./editFixtureForm";
import { useState } from "react";

interface Props {
  tournament: Tournament;
  setData: SetData<Tournament[]>;
}

const TournamentPageRow = ({ tournament, setData }: Props) => {
  const [open, setOpen] = useState(false);
  const { postData } = useFetch();
  const deleteMutation = postData("DELETE /tournaments/:id");
  const generateFixtureMutation = postData(
    "POST /tournaments/:id/generate-fixture"
  );

  const handleDelete = () => {
    toastConfirm("¿Seguro que quieres eliminar el registro del torneo?", () => {
      deleteMutation(null, {
        params: {
          id: tournament.id,
        },
        onSuccess: (response) => {
          setData((prev) => prev.filter((item) => item.id !== tournament.id));
          toastSuccess(response.message);
        },
      });
    });
  };

  const handleFitxure = () => {
    toastConfirm("¿Quieres crear el fixture para este torneo?", () => {
      generateFixtureMutation(null, {
        params: {
          id: tournament.id,
        },
        onSuccess: (response) => {
          setData((prev) =>
            prev.map((t) => (t.id === response.data.id ? response.data : t))
          );
          setOpen(true);
          toastSuccess(response.message);
        },
      });
    });
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <TournamentTableRow
          showInfo={false}
          tournament={tournament}
          editable
          setData={setData}
        />
        <div className="flex justify-center mt-2">
          {tournament.games.every((game) => game.state === "finalizado") &&
            !tournament.games.some((game) => game.phase === "final") &&
            tournament.games.length > 0 && (
              <Button variant="secondary" onClick={() => handleFitxure()}>
                Siguiente fase
              </Button>
            )}
        </div>
      </div>
      <Modal
        title="Editar Torneo"
        description="Modifique los datos del torneo"
        button={<Button variant="secondary">Editar</Button>}
      >
        <TournamentForm
          closeModal={() => {}}
          setData={setData}
          tournament={tournament}
        />
      </Modal>
      <Button variant="destructive" onClick={() => handleDelete()}>
        Eliminar
      </Button>
      {tournament.games.length === 0 ? (
        <Button variant="secondary" onClick={() => handleFitxure()}>
          Generar fixture
        </Button>
      ) : (
        <Modal
          title="Edición de fechas del fixture"
          description="Ingrese fechas"
          button={<Button variant="secondary">Editar fase</Button>}
          open={open}
          onOpenChange={setOpen}
        >
          <EditFixtureForm
            key={JSON.stringify(tournament.games.map((g) => g.id))}
            tournament={tournament}
            onSuccess={(data) => {
              setData((prev) => prev.map((t) => (t.id === data.id ? data : t)));
              setOpen(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default TournamentPageRow;
