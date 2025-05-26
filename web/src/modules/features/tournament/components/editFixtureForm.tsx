import useFetch from "@/modules/core/hooks/useFetch";
import { Tournament } from "../api/responses";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toastSuccess } from "@/modules/core/utils/toast";

interface Props {
  tournament: Tournament;
  onSuccess: (data: Tournament) => void;
}

const EditFixtureForm = ({ tournament, onSuccess }: Props) => {
  const phases = ["grupos", "octavos", "cuartos", "semis", "final", "1"];
  const lastPhase = tournament.games.reduce((acc, game) => {
    const phaseIndex = phases.indexOf(game.phase);
    return phaseIndex > acc ? phaseIndex : acc;
  }, 0);
  const lastPhaseName = phases[lastPhase];
  const games = tournament.games.filter((game) => game.phase === lastPhaseName);
  const [loading, setLoading] = useState(false);

  const { postData } = useFetch();
  const editFixtureMutation = postData("PUT /tournaments/:id/edit-fixture");
  const [form, setForm] = useState<
    {
      id: string;
      date: string;
    }[]
  >(
    games.map((game) => ({
      id: game.id,
      date: new Date(new Date(game.date).getTime() - 4 * 60 * 60 * 1000)
        .toISOString()
        .substring(0, 16),
    }))
  );

  const handleSubmit = () => {
    setLoading(true);
    editFixtureMutation(
      form.map((f) => ({
        id: f.id,
        date: new Date(f.date).toISOString(),
      })),
      {
        params: {
          id: tournament.id,
        },
        onSuccess({ data, message }) {
          toastSuccess(message);
          onSuccess(data);
        },
        onSettled() {
          setLoading(false);
        },
      }
    );
  };

  return (
    <form className="flex flex-col gap-4">
      {games.map((game) => (
        <div key={game.id} className="flex flex-col gap-2">
          <p>
            {game.firstTeam.name} vs {game.secondTeam.name} ({game.phase})
          </p>
          <div className="flex gap-8">
            <input
              className="text-black"
              type="datetime-local"
              placeholder="Fecha"
              value={form.find((f) => f.id === game.id)?.date || ""}
              onChange={(e) => {
                const newDate = e.target.value;
                setForm((prevForm) =>
                  prevForm.map((f) =>
                    f.id === game.id ? { ...f, date: newDate } : f
                  )
                );
              }}
            />
          </div>
        </div>
      ))}
      <Button
        disabled={loading}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        Actualizar
      </Button>
    </form>
  );
};

export default EditFixtureForm;
