import useFetch from "@/modules/core/hooks/useFetch";
import { ColumnDef } from "@tanstack/react-table";
import { TeamHistoryGame } from "../../tournament/api/responses";
import { DataTable } from "@/components/ui/data-table";

type ParamsType = {
  clubId: string;
  tournamentId: string;
};
export const HistoryTable = ({ clubId, tournamentId }: ParamsType) => {
  const { fetchData } = useFetch();
  const { data } = fetchData(
    `GET /tournaments/info-club?clubId=${clubId}&tournamentId=${tournamentId}` as any
  );

  const columns: ColumnDef<TeamHistoryGame>[] = [
    {
      accessorKey: "firstTeam.name",
      header: "Local",
    },
    {
      accessorKey: "secondTeam.name",
      header: "Visitante",
    },
    {
      accessorKey: "date",
      header: "Fecha",
      accessorFn: (row) => row.date.split("T")[0],
    },
    {
      accessorKey: "goalsFirstTeam",
      header: "Goles del primer equipo",
    },
    {
      accessorKey: "goalsSecondTeam",
      header: "Goles del segundo equipo",
    },
  ];

  if (!data) {
    return <>cargando</>;
  }

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};
