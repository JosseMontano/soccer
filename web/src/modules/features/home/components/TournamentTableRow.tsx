import DefaulShield from "@/assets/defaultshield.png";
import Icon from "@/modules/core/components/icons/Icon";
import clsx from "clsx";
import { useState } from "react";
import {
  Tournament,
  TournamentFixture,
  TournamentFixtureGame,
} from "../../tournament/api/responses";

import Modal from "@/modules/core/components/ui/Modal";
import useFetch, { SetData } from "@/modules/core/hooks/useFetch";
import { toastError, toastSuccess } from "@/modules/core/utils/toast";
import { HistoryTable } from "./historyGames";
import { Prediction } from "./prediction";
import { Button } from "@/components/ui/button";
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
  const gameMutation = postData("PUT /games/events/:gameId/finish");
  const handleFinishGame = (gameId: string) => {
    gameMutation(null, {
      params: {
        gameId,
      },
      onSuccess: (res) => {
        toastSuccess(res.message);
        setData?.((prev) =>
          prev.map((s) => {
            return s.id === tournament.id
              ? {
                  ...s,
                  games: s.games.map((g) => {
                    return g.id === gameId ? (res.data as any) : g;
                  }),
                }
              : s;
          })
        );
      },
    });
  };

  //@ts-ignore
  const gamesByDate = Object.groupBy(
    tournament.games,
    (game: TournamentFixtureGame) => game.date.split("T")[0]
  ) as Record<string, TournamentFixtureGame[]>;

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
        <div
          className={clsx("transition-transform duration-300", {
            "rotate-180": openState,
          })}
        >
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
          {Object.keys(gamesByDate).map((date) => (
            <>
              <header className="h-10 flex justify-between px-10 items-center bg-gray-800">
                <div className="flex gap-3 items-center">
                  <p className="text-sm opacity-80">Partido</p>
                </div>

                <p className="opacity-80 flex items-center gap-2 text-xs">
                  <div className="h-5 aspect-square">
                    <Icon type={Icon.Types.CALENDAR} />
                  </div>
                  {new Date(
                    new Date(date).setDate(new Date(date).getDate() + 1)
                  ).toLocaleDateString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </header>
              <main className="flex flex-col bg-gray-900">
                {gamesByDate[date].map((game) => (
                  <div className="flex flex-col items-center w-full border-t py-2">
                    <div className="flex justify-between w-full px-10">
                      <small className="opacity-60">
                        Horario del partido:{" "}
                        {new Date(game.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        <span className="text-skyblue-500">
                          {game.phase !== "grupos" && game.phase !== "1"
                            ? ` (${game.phase})`
                            : ""}
                        </span>
                      </small>
                      <small>
                        {
                          {
                            pendiente: "proximo 🟡",
                            finalizado: "finalizado 🟢",
                          }[game.state]
                        }
                      </small>
                    </div>
                    <div className="flex items-center w-full  gap-8 py-3 justify-center">
                      <div
                        className={clsx("w-56 flex items-center gap-4", {
                          "opacity-20":
                            game.winnerId !== game.firstTeamId &&
                            game.winnerId !== null,
                        })}
                      >
                        {showInfo && (
                          <Modal
                            title={
                              "Informacion del equipo " + game.firstTeam.name
                            }
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
                              <h2 className="text-[22px] font-semibold">
                                Jugadores
                              </h2>
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
                                  amountVictories1={
                                    game.firstTeam.amountVictories
                                  }
                                  amountVictories2={
                                    game.secondTeam.amountVictories
                                  }
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
                        {editable && game.state === "pendiente" && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                handleGameGoal(
                                  game.id,
                                  "firstTeam",
                                  "decrement",
                                  game.goalsFirstTeam
                                )
                              }
                              className="text-xs"
                              variant={"ghost"}
                            >
                              -
                            </Button>
                            <Button
                              onClick={() =>
                                handleGameGoal(
                                  game.id,
                                  "firstTeam",
                                  "increment",
                                  game.goalsFirstTeam
                                )
                              }
                              className="text-xs"
                              variant={"ghost"}
                            >
                              +
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-800 px-2 py-2 w-10 aspect-square rounded-full flex items-center justify-center">
                        VS
                      </div>

                      <div className="flex flex-col items-center">
                        <span>{game.goalsSecondTeam}</span>
                        {editable && game.state === "pendiente" && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                handleGameGoal(
                                  game.id,
                                  "secondTeam",
                                  "decrement",
                                  game.goalsSecondTeam
                                )
                              }
                              className="text-xs"
                              variant={"ghost"}
                            >
                              -
                            </Button>
                            <Button
                              onClick={() =>
                                handleGameGoal(
                                  game.id,
                                  "secondTeam",
                                  "increment",
                                  game.goalsSecondTeam
                                )
                              }
                              className="text-xs"
                              variant={"ghost"}
                            >
                              +
                            </Button>
                          </div>
                        )}
                      </div>

                      <div
                        className={clsx(
                          "w-56 flex items-center gap-4 justify-end",
                          {
                            "opacity-20":
                              game.winnerId !== game.secondTeamId &&
                              game.winnerId !== null,
                          }
                        )}
                      >
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
                              title={
                                "Informacion del equipo " + game.secondTeam.name
                              }
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
                                amountVictories1={
                                  game.secondTeam.amountVictories
                                }
                                amountVictories2={
                                  game.firstTeam.amountVictories
                                }
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
                    {editable && game.state === "pendiente" && (
                      <Button
                        className="text-xs"
                        onClick={() => handleFinishGame(game.id)}
                      >
                        Finalizar partido
                      </Button>
                    )}
                  </div>
                ))}
              </main>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentTableRow;
