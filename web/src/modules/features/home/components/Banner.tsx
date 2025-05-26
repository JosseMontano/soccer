import useFetch from "@/modules/core/hooks/useFetch";
import Fuchi from "@assets/fuchibol.png";
import Lewan from "@assets/lewan.png";
import { tiempoRelativo } from "../utils/getRelativeTime";
import { formatDate } from "../utils/formatDate";

const Banner = () => {
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /games/next/game");

  return (
    <div className="bg-skyblue-500 rounded-2xl h-80 flex justify-center flex-col relative overflow-hidden isolate">
      {data ? (
        <>
          <header className="flex gap-4 items-center px-10 py-4 z-10">
            <div className="bg-gray-950 px-2 py-2 w-12 aspect-square rounded-xl">
              <img src={data.firstTeam.logo} className="w-full h-full cover" />
            </div>
            <p>vs</p>
            <div className="bg-gray-950 px-2 py-2 w-12 aspect-square rounded-xl">
              <img src={data.secondTeam.logo} className="w-full h-full cover" />
            </div>
            <div className="h-12 bg-gray-950 px-2 py-2 rounded-xl flex items-center">
              <p>
                {formatDate(
                  new Date(new Date(data.date).getTime() - 4 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                )}
                {" a las "}
                {new Date(new Date(data.date).getTime() - 4 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[1]
                  .slice(0, 5)}{" "}
                ({tiempoRelativo(data.date)})
              </p>
            </div>
          </header>
          <main className="flex px-10 flex-col max-w-[560px] gap-2 py-4">
            <span className="font-medium">Torneo ida y vuelta</span>
            <strong className="font-extrabold text-3xl">
              {data?.firstTeam.name} vs {data?.secondTeam.name}
            </strong>
            <p className="text-sm opacity-90">
              Vive la emoción del fútbol con el enfrentamiento estelar de la
              jornada. ¡No te pierdas este gran partido lleno de pasión y
              talento!
            </p>
          </main>
        </>
      ) : (
        <p className="text-sm opacity-90 px-10">
          Cargando el próximo partido...
        </p>
      )}
      <img className="h-full absolute right-0 bottom-0 -z-10" src={Lewan} />
      <img
        className="h-full absolute -left-32 bottom-20 opacity-60 -z-10"
        src={Fuchi}
      />
    </div>
  );
};

export default Banner;
