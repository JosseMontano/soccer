import Icon from "@/modules/core/components/icons/Icon";
import clsx from "clsx";
import { useState } from "react";
import { TournamentFixture } from "../../tournament/api/responses";
import DefaulShield from "@/assets/defaultshield.png";
interface Props {
  open?: boolean;
  tournament: TournamentFixture;
}

const TournamentTableRow = ({ open, tournament }: Props) => {
  const [openState, setOpenState] = useState(open);

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
            <p className="text-sm opacity-80">Partido</p>
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
                  <div className="bg-gray-800 px-2 py-2 min-w-16 max-w-16 aspect-square rounded-xl">
                    <img
                      src={game.firstTeam.logo || DefaulShield}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {game.firstTeam.name}
                    <div>
                      {game.firstTeam.players.map((v) => (
                        <p>{v.name}</p>
                      ))}
                    </div>
                  </p>
                </div>

                <span>{game.goalsFirstTeam}</span>

                <div className="bg-gray-800 px-2 py-2 w-10 aspect-square rounded-full flex items-center justify-center">
                  VS
                </div>

                <span>{game.goalsSecondTeam}</span>

                <div className="w-56 flex items-center gap-4 justify-end">
                  <p className="flex-1 text-end whitespace-nowrap overflow-hidden text-ellipsis">
                    {game.secondTeam.name}
                    <div>
                      {game.secondTeam.players.map((v) => (
                        <p>{v.name}</p>
                      ))}
                    </div>
                  </p>
                  <div className="bg-gray-800 px-2 py-2 min-w-16 max-w-16 aspect-square rounded-xl">
                    <img
                      className="w-full h-full object-contain"
                      src={game.secondTeam.logo || DefaulShield}
                    />
                  </div>
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
