import Lewan from "@assets/lewan.png";
import Fuchi from "@assets/fuchibol.png";

const Banner = () => {
  return (
    <div className="bg-skyblue-500 rounded-2xl h-80 flex justify-center flex-col relative overflow-hidden isolate">
      <header className="flex gap-4 items-center px-10 py-4 z-10">
        <div className="bg-gray-950 px-2 py-2 w-12 aspect-square rounded-xl">
          <img
            src="https://as01.epimg.net/img/comunes/fotos/fichas/equipos/large/65.png"
            className="w-full h-full"
          />
        </div>
        <p>vs</p>
        <div className="bg-gray-950 px-2 py-2 w-12 aspect-square rounded-xl">
          <img
            src="https://img.icons8.com/?size=512&id=21578&format=png"
            className="w-full h-full"
          />
        </div>
        <div className="h-12 bg-gray-950 px-2 py-2 rounded-xl flex items-center">
          <p>Hoy, 8:30 PM</p>
        </div>
      </header>
      <main className="flex px-10 flex-col max-w-[560px] gap-2 py-4">
        <span className="font-medium">Premier League</span>
        <strong className="font-extrabold text-3xl">
          Liverpool FC vs Barcelona FC
        </strong>
        <p className="text-sm opacity-90">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
          enim tenetur sequi et unde facere?
        </p>
      </main>
      <img className="h-full absolute right-0 bottom-0 -z-10" src={Lewan} />
      <img className="h-full absolute -left-32 bottom-20 opacity-60 -z-10" src={Fuchi} />
    </div>
  );
};

export default Banner;
