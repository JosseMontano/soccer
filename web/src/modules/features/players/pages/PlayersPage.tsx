import useFetch from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toast";
import React from "react";

const PlayersPage = () => {
  const { fetchData } = useFetch();
  const {data} = fetchData(["players"], "GET /players");
  return (
    <>
      <div>Players</div>
      <button>Añadir jugador</button>
      <div>
        {data?.map((player) => (
          <p key={player.id}>{player.name} {player.lastName}</p>
        ))}
      </div>
    </>
  );
};

export default PlayersPage;
