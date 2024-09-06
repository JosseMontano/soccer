import React, { useState } from "react";
import { PlayerDTO } from "../api/dtos";
import { Stringify } from "@/modules/core/types/Stringify";
import useFetch from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toast";
import { Player } from "../api/responses";

interface Props {
  closeModal: () => void;
  modifyData: (data:Player) => void;
}


const PlayerForm = ({ closeModal,modifyData }: Props) => {
  const { postData } = useFetch();
  const mutation = postData("POST /players");
  const [form, setForm] = useState<Stringify<PlayerDTO>>({
    name: "",
    lastName: "",
    Ci: "",
    birthdate: "",
    age: "",
    nationality: "",
    commet: "",
    photo:
      "https://th.bing.com/th/id/OIP.peA5ILCfebCRr2LRch1BoAHaFj?rs=1&pid=ImgDetMain",
  });
  /* en express enviar la foto = investigar*/

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log(form);
    mutation.mutate(
      {
        name: form.name,
        lastName: form.lastName,
        Ci: Number(form.Ci),
        birthdate: form.birthdate+"T00:00:00.000Z",
        age: Number(form.age),
        nationality: form.nationality,
        commet: Number(form.commet),
        photo: form.photo,
      },
      {
        onSuccess: (res) => {
          toastSuccess(res.message);
          closeModal();
          modifyData(res.data);
        },
      }
    );
  };
  /* onSuccess me da una data*/
  return (
    <form className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Ingrese el nombre del jugador"
        value={form.name}
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Ingrese el apellido del jugador"
        value={form.lastName}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, lastName: e.target.value }))
        }
      />
      <input
        type="number"
        placeholder="Ingrese el carnet del jugador"
        value={form.Ci}
        onChange={(e) => setForm((prev) => ({ ...prev, Ci: e.target.value }))}
      />

      <input
        type="date"
        placeholder="ingrese la fecha de nacimiento del jugador"
        value={form.birthdate}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, birthdate: e.target.value }))
        }
      />
      <input
        type="number"
        placeholder="Ingrese la edad del jugador"
        value={form.age}
        onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Ingrese la nacionalidad del jugador"
        value={form.nationality}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, nationality: e.target.value }))
        }
      />
      <input
        type="number"
        placeholder="Ingrese el commet del jugador"
        value={form.commet}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, commet: e.target.value }))
        }
      />

      <button onClick={handleSubmit}>Registrar Jugador</button>
    </form>
  );
};

export default PlayerForm;
