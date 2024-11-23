import Icon from "@/modules/core/components/icons/Icon";
import clsx from "clsx";
import { useState } from "react";

interface Props {
  open?: boolean;
  title: string;
}

const TournamentTableRow = ({ open, title }: Props) => {
  const [openState, setOpenState] = useState(open);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpenState((prev) => !prev)}
        className="flex justify-between items-center px-10 py-4 border-b border-b-gray-700"
      >
        <div className="flex items-center gap-4">
          <span className="w-10 p-2 aspect-square bg-white rounded-xl flex items-center justify-center text-primary-500">
            <Icon type={Icon.Types.TROPHY} />
          </span>
          <div className="flex flex-col items-start">
            <strong>
              {title} <span className="opacity-60">(2)</span>
            </strong>
            <small className="text-xs opacity-80">Cochabamba</small>
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
            <div className="flex items-center gap-8 py-3 justify-center">
              <div className="w-56 flex items-center gap-4">
                <div className="bg-gray-800 px-2 py-2 min-w-16 max-w-16 aspect-square rounded-xl">
                  <img
                    src="https://as01.epimg.net/img/comunes/fotos/fichas/equipos/large/65.png"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  Manchester City
                </p>
              </div>
              <div className="bg-gray-800 px-2 py-2 w-10 aspect-square rounded-full flex items-center justify-center">
                VS
              </div>
              <div className="w-56 flex items-center gap-4 justify-end">
                <p className="flex-1 text-end whitespace-nowrap overflow-hidden text-ellipsis">
                  Barcelona FC
                </p>
                <div className="bg-gray-800 px-2 py-2 min-w-16 max-w-16 aspect-square rounded-xl">
                  <img
                    className="w-full h-full object-contain"
                    src="https://img.icons8.com/?size=512&id=21578&format=png"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8 py-3 justify-center">
              <div className="w-56 flex items-center gap-4">
                <div className="bg-gray-800 px-2 py-2 min-w-16 max-w-16 aspect-square rounded-xl">
                  <img
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQYt0Q6XeOI2AzL-gVTQpsdJkZGF9iMmG5SExYzR0inS3mMWnbLLC-m23nTbF4QKmFx4dS_8gbiPY6uULWeJ9bakRE3oHbP5SOiqqCPuqq5F-WHHR_Cn_vvOZT5I_Lfm3TU5GnBlzeR6A/s512/Bolivia.png"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  Bolivia
                </p>
              </div>
              <div className="bg-gray-800 px-2 py-2 w-10 aspect-square rounded-full flex items-center justify-center">
                VS
              </div>
              <div className="w-56 flex items-center gap-4 justify-end">
                <p className="flex-1 text-end whitespace-nowrap overflow-hidden text-ellipsis">
                  Real Madrid
                </p>
                <div className="bg-gray-800 px-2 py-2 min-w-16 max-w-16 aspect-square rounded-xl">
                  <img
                    className="w-full h-full object-contain"
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8 py-3 justify-center">
              <div className="w-56 flex items-center gap-4">
                <div className="bg-gray-800 px-2 py-2 min-w-16 max-w-16 aspect-square rounded-xl">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Escudo_del_club_deportivo_y_cultural_real_tomayapo.png"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  Real Tomayapo
                </p>
              </div>
              <div className="bg-gray-800 px-2 py-2 w-10 aspect-square rounded-full flex items-center justify-center">
                VS
              </div>
              <div className="w-56 flex items-center gap-4 justify-end">
                <p className="flex-1 text-end whitespace-nowrap overflow-hidden text-ellipsis">
                  Argentina
                </p>
                <div className="bg-gray-800 px-2 py-2 min-w-16 max-w-16 aspect-square rounded-xl">
                  <img
                    className="w-full h-full object-contain"
                    src="https://upload.wikimedia.org/wikipedia/commons/0/06/Selecci%C3%B3n_de_f%C3%BAtbol_de_Argentina.png"
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TournamentTableRow;
