import TournamentTableRow from "./TournamentTableRow";

const TournamentTable = () => {
  return (
    <div className="flex flex-col bg-gray-800 rounded-2xl overflow-hidden">
      <TournamentTableRow title="Premier League" />
      <TournamentTableRow title="Champions League" />
      <TournamentTableRow title="Libertadores" />
    </div>
  );
};

export default TournamentTable;
