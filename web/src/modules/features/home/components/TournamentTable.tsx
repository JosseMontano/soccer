import useFetch from "@/modules/core/hooks/useFetch";
import TournamentTableRow from "./TournamentTableRow";

const TournamentTable = () => {
  const { fetchData } = useFetch();
  const { data: tournament } = fetchData("GET /tournaments/tournamentsPublic");
  console.log(tournament);
  return (
    <div className="flex flex-col bg-gray-800 rounded-2xl overflow-hidden">
      {tournament?.map((t) => (
        <TournamentTableRow tournament={t} key={t.id} />
      ))}
    </div>
  );
};

export default TournamentTable;
