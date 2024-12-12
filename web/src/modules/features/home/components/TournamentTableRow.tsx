import DefaulShield from "@/assets/defaultshield.png";
import Icon from "@/modules/core/components/icons/Icon";
import clsx from "clsx";
import { useState } from "react";
import {
  TeamHistoryGame,
  Tournament,
  TournamentFixture,
} from "../../tournament/api/responses";

import { DataTable } from "@/components/ui/data-table";
import Modal from "@/modules/core/components/ui/Modal";
import useFetch, { SetData } from "@/modules/core/hooks/useFetch";
import { ColumnDef } from "@tanstack/react-table";
import { Prediction } from "./prediction";
import { toastError, toastSuccess } from "@/modules/core/utils/toast";
import { HistoryTable } from "./historyGames";
interface Props {
  open?: boolean;
  showInfo?: boolean;
  editable?: boolean;
  tournament: TournamentFixture;
  setData?: SetData<Tournament[]>;
}

const TournamentTableRow = ({
  open,
  tournament,
  showInfo = true,
  editable = false,
  setData,
}: Props) => {
  const [openState, setOpenState] = useState(open);
  const [prediction, setPrediction] = useState("");

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

  const { postData } = useFetch();
  const postMutation = postData("POST /games/events/prediction");

  const onSubmit = async (
    amountVictoriesTeam1: number,
    amountVictoriesTeam2: number
  ) => {
    const form = {
      amountVictoriesTeam1,
      amountVictoriesTeam2,
    };
    await postMutation(
      {
        ...form,
      },
      {
        onSuccess: (res) => {
          setPrediction(res.data);
        },
      }
    );
  };

  const goalMutation = postData("PUT /games/events/:gameId/goals");
  const handleGameGoal = (
    gameId: string,
    team: "firstTeam" | "secondTeam",
    action: "increment" | "decrement",
    actualGoals: number
  ) => {
    if (action === "decrement" && actualGoals === 0) {
      return toastError("No puede haber goles negativos");
    }
    goalMutation(
      {
        action,
        team,
      },
      {
        params: {
          gameId,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          setData?.((prev) =>
            prev.map((t) => {
              return t.id === tournament.id
                ? {
                    ...t,
                    games: t.games.map((g) => {
                      return g.id === gameId ? (res.data as any) : g;
                    }),
                  }
                : t;
            })
          );
        },
      }
    );
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpenState((prev) => !prev)}
        className="flex justify-between items-center px-10 py-4 border-b border-b-gray-700"
      >
        <div className="flex items-center gap-4">
          <span className="w-10 p-2 aspect-square bg-white rounded-xl flex items-center justify-center text-skyblue-500">
            <Icon type={Icon.Types.TROPHY} />
          </span>
          <div className="flex flex-col items-start">
            <strong>
              {tournament.name}{" "}
              <span className="opacity-60">({tournament.games.length})</span>
            </strong>
            <small className="text-xs opacity-80">
              {tournament.description}
            </small>
          </div>
        </div>
        <div>
          <Icon type={Icon.Types.CHEVRON_DOWN} />
        </div>
      </button>
      <div
        className={clsx(
          "grid overflow-hidden transition-[grid-template-rows] duration-300",
          {
            "grid-rows-[0fr]": !openState,
            "grid-rows-[1fr]": openState,
          }
        )}
      >
        <div className="overflow-hidden">
          <header className="h-10 flex justify-between px-10 items-center">
            <div className="flex gap-3 items-center">
              <p className="text-sm opacity-80">Partido</p>
            </div>

            <p className="opacity-80 flex items-center gap-2 text-xs">
              <div className="h-5 aspect-square">
                <Icon type={Icon.Types.CALENDAR} />
              </div>
              Noviembre 23, 2024
            </p>
          </header>
          <main className="flex flex-col bg-gray-900">
            {tournament.games.map((game) => (
              <div className="flex items-center gap-8 py-3 justify-center">
                <div className="w-56 flex items-center gap-4">
                  {showInfo && (
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
                        <img
                          src={game.firstTeam.logo}
                          className="object-cover rounded-2xl"
                          width={85}
                          height={85}
                        />
                        <h2 className="text-[22px] font-semibold">Jugadores</h2>
                        {game.firstTeam.players.map((v) => (
                          <p className="text-[13px]">
                            {v.name} {v.lastName}
                          </p>
                        ))}
                      </div>

                      <div>
                        {" "}
                        <span
                          className="cursor-pointer"
                          onClick={() =>
                            onSubmit(
                              game.firstTeam.amountVictories,
                              game.secondTeam.amountVictories
                            )
                          }
                        >
                          <Prediction
                            amountVictories1={game.firstTeam.amountVictories}
                            amountVictories2={game.secondTeam.amountVictories}
                            prediction={prediction}
                            onSubmit={onSubmit}
                            game={game}
                            setPrediction={setPrediction}
                          />
                        </span>
                      </div>

                      <HistoryTable
                        clubId={game.firstTeam.id}
                        tournamentId={game.tournamentId}
                      />
                    </Modal>
                  )}

                  <div className="bg-gray-800 px-2 py-2 min-w-16 max-w-16 aspect-square rounded-xl">
                    <img
                      src={game.firstTeam.logo || DefaulShield}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {game.firstTeam.name}
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <span>{game.goalsFirstTeam}</span>
                  {editable && (
                    <>
                      <button
                        onClick={() =>
                          handleGameGoal(
                            game.id,
                            "firstTeam",
                            "increment",
                            game.goalsFirstTeam
                          )
                        }
                        className="text-xs"
                      >
                        Aumentar
                      </button>
                      <button
                        onClick={() =>
                          handleGameGoal(
                            game.id,
                            "firstTeam",
                            "decrement",
                            game.goalsFirstTeam
                          )
                        }
                        className="text-xs"
                      >
                        Disminuir
                      </button>
                    </>
                  )}
                </div>

                <div className="bg-gray-800 px-2 py-2 w-10 aspect-square rounded-full flex items-center justify-center">
                  VS
                </div>

                <div className="flex flex-col items-center">
                  <span>{game.goalsSecondTeam}</span>
                  {editable && (
                    <>
                      <button
                        onClick={() =>
                          handleGameGoal(
                            game.id,
                            "secondTeam",
                            "increment",
                            game.goalsSecondTeam
                          )
                        }
                        className="text-xs"
                      >
                        Aumentar
                      </button>
                      <button
                        onClick={() =>
                          handleGameGoal(
                            game.id,
                            "secondTeam",
                            "decrement",
                            game.goalsSecondTeam
                          )
                        }
                        className="text-xs"
                      >
                        Disminuir
                      </button>
                    </>
                  )}
                </div>

                <div className="w-56 flex items-center gap-4 justify-end">
                  <p className="flex-1 text-end whitespace-nowrap overflow-hidden text-ellipsis">
                    {game.secondTeam.name}
                  </p>
                  <div className="bg-gray-800 px-2 py-2 min-w-16 max-w-16 aspect-square rounded-xl">
                    <img
                      className="w-full h-full object-contain"
                      src={game.secondTeam.logo || DefaulShield}
                    />
                  </div>

                  {showInfo && (
                    <span className="cursor-pointer">
                      <Modal
                        title={"Informacion del equipo " + game.secondTeam.name}
                        description="Informacion de los integrantes y historial de los ultimos 5 partidos"
                        button={
                          <span className="cursor-pointer">
                            <Icon type={Icon.Types.INFO} />
                          </span>
                        }
                      >
                        <div>
                          <img
                            src={game.secondTeam.logo}
                            className="object-cover rounded-2xl"
                            width={85}
                            height={85}
                          />
                          <h2 className="text-[22px] font-semibold">
                            Jugadores
                          </h2>
                          {game.secondTeam.players.map((v) => (
                            <p>
                              {v.name} {v.lastName}
                            </p>
                          ))}
                        </div>

                        <Prediction
                          amountVictories1={game.secondTeam.amountVictories}
                          amountVictories2={game.firstTeam.amountVictories}
                          prediction={prediction}
                          onSubmit={onSubmit}
                          game={game}
                          setPrediction={setPrediction}
                        />

                        <HistoryTable
                          clubId={game.secondTeam.id}
                          tournamentId={game.tournamentId}
                        />
                      </Modal>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TournamentTableRow;
