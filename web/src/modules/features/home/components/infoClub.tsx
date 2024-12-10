import Icon from "@/modules/core/components/icons/Icon";
import Modal from "@/modules/core/components/ui/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { TeamHistoryGame } from "../../tournament/api/responses";
import { DataTable } from "@/components/ui/data-table";


type ParamsType = {
  game: any;
};
export const InfoClub = ({ game }: ParamsType) => {
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
      accessorKey: "goalsFirstTeam",
      header: "Goles del primer equipo",
    },
    {
      accessorKey: "goalsSecondTeam",
      header: "Goles del segundo equipo",
    },
    {
      accessorKey: "foulsFirstTeam",
      header: "Faltas del primer equipo",
    },
    {
      accessorKey: "foulsSecondTeam",
      header: "Faltas del segundo equipo",
    },
  ];

  return (
    <Modal
      title={"Informacion del equipo " + game.firstTeam.name}
      description="Informacion de los integrantes y historial de los ultimos 5 partidos"
      button={
        <span className="cursor-pointer">
          <Icon type={Icon.Types.INFO} />
        </span>
      }
    >
      <div>
        <h2 className="text-[22px] font-semibold">Jugadores</h2>
        {game.firstTeam.players.map((v) => (
          <p className="text-[13px]">
            {v.name} {v.lastName}
          </p>
        ))}
      </div>
      <div>
        <DataTable columns={columns} data={game.firstTeam.history} />
      </div>
    </Modal>
  );
};
