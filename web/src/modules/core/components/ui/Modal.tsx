import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

interface Props {
  children: React.ReactNode;
  /* children es una propiedad especial, es lo que pones dentro el modal*/
  /* children es un elemento react, por lo que se le puede agregar propiedades */
  title: string;
  description: string;
  button: React.ReactNode;
}

const Modal = ({ children, title, description, button }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogClose className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
          Cerrar
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
/* e=> e.stopPropagation() para que detenga la accion dada*/
/* el modal tiene que estar por fuera de la pagina (es como una pagina aparte), se realiza usando portales*/
/* el portal se realiza en el index.html */
/* w-[pones lo tamños que desees , no los predeterminados del elemento] max-w-full si el tamaño de la pantalla en mas pequeño se adaptara la tamaño */
/* fixed para que sobresalga sobre otros elementos, w-screen para que ocupe toda la pantalla flex ayuda a acomodoar los elementos que se encutran dentro de acuerdo a lo que se requiera, no se utiliza en textos*/
export default Modal;
