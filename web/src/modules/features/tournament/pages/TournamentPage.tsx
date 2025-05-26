import { Button } from "@/components/ui/button";
import Modal from "@/modules/core/components/ui/Modal";
import useFetch from "@/modules/core/hooks/useFetch";
import TournamentForm from "../components/tournamentForm";
import TournamentPageRow from "../components/tournamentPageRow";
import { useState } from "react";

const TournamentPage = () => {
  const { fetchData } = useFetch();
  const { data, setData } = fetchData("GET /tournaments");
  const [open, setOpen] = useState(false);

  return (
    <section className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
      <div>Torneos</div>
      <Modal
        title="Registro de Torneos"
        description="Ingrese todos los datos del torneo"
        open={open}
        onOpenChange={setOpen}
        button={<Button onClick={() => setOpen(true)}>Añadir Torneo</Button>}
      >
        <TournamentForm
          closeModal={() => setOpen(false)}
          setData={setData}
          tournament={null}
        />
      </Modal>
      <div className="flex-1 overflow-auto flex flex-col gap-4">
        {data?.map((tournament) => (
          <TournamentPageRow
            key={tournament.id}
            tournament={tournament}
            setData={setData}
          />
        ))}
      </div>
    </section>
  );
};

export default TournamentPage;
