import React from "react";
import { createPortal } from "react-dom";

interface Props {
  children: React.ReactNode;
  /* children es una propiedad especial, es lo que pones dentro el modal*/
  /* children es un elemento react, por lo que se le puede agregar propiedades */
  title: string;
  closeModal: () => void;
}

const Modal = ({children ,title, closeModal}:Props) => {
  return createPortal(
    <div onClick={closeModal} className="fixed left-0 top-0 w-screen h-screen flex items-center justify-center bg-black/30">
      <div onClick={e=>e.stopPropagation()} className="w-[560px] max-w-full bg-white flex flex-col p-4">
        <header className="flex justify-between">
          <h1 className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">{title}</h1>
          <button onClick={closeModal} className="border bg-red-400 text-white p-1 rounded-md">x</button>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>,
    document.getElementById("modal") || document.body
  );
};
/* e=> e.stopPropagation() para que detenga la accion dada*/ 
/* el modal tiene que estar por fuera de la pagina (es como una pagina aparte), se realiza usando portales*/
/* el portal se realiza en el index.html */
/* w-[pones lo tamños que desees , no los predeterminados del elemento] max-w-full si el tamaño de la pantalla en mas pequeño se adaptara la tamaño */
/* fixed para que sobresalga sobre otros elementos, w-screen para que ocupe toda la pantalla flex ayuda a acomodoar los elementos que se encutran dentro de acuerdo a lo que se requiera, no se utiliza en textos*/
export default Modal;
