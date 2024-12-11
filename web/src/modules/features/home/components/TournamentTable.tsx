import useFetch from "@/modules/core/hooks/useFetch";
import TournamentTableRow from "./TournamentTableRow";
import { TournamentFixture } from "../../tournament/api/responses";
import { useEffect, useState } from "react";
import { channel } from "@/lib/pusher";

interface Props {
  date: string;
}

const TournamentTable = ({ date }: Props) => {
  const { fetchData } = useFetch();
  const { data } = fetchData(
    `GET /tournaments/tournamentsPublic?date=${date}` as any
  );
  const [tournament, setTournament] = useState<TournamentFixture[]>([]);

  useEffect(() => {
    if (data) {
      setTournament(data);
    }
  }, [data]);

  useEffect(() => {
    const eventName = "new-goal";
    channel.bind(
      eventName,
      (res: {
        tournamentId: string;
        gameId: string;
        team: "firstTeam" | "secondTeam";
        action: "increment" | "decrement";
        newGoals: number;
      }) => {
        setTournament((prev) => {
          return prev.map((t) => {
            if (t.id === res.tournamentId) {
              return {
                ...t,
                games: t.games.map((g) => {
                  if (g.id === res.gameId) {
                    return {
                      ...g,
                      goalsFirstTeam:
                        res.team === "firstTeam"
                          ? res.newGoals
                          : g.goalsFirstTeam,
                      goalsSecondTeam:
                        res.team === "secondTeam"
                          ? res.newGoals
                          : g.goalsSecondTeam,
                    };
                  }
                  return g;
                }),
              };
            }
            return t;
          });
        });
      }
    );
  }, []);

  return (
    <div className="flex flex-col bg-gray-800 rounded-2xl overflow-hidden">
      {tournament.map((t) => (
        <TournamentTableRow tournament={t} key={t.id} />
      ))}
    </div>
  );
};

export default TournamentTable;
