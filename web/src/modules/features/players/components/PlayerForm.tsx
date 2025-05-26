import { PlayerDTO } from "../api/dtos";
import useFetch, { SetData } from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toast";
import { Player } from "../api/responses";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PlayerDTOschema } from "../validations/PlayerDTO.schema";
import { Button } from "@/components/ui/button";
import { getAIResponseImage } from "../utils/AIResponseImage";
import * as z from "zod";
import { useState } from "react";

interface Props {
  player: Player | null;
  closeModal: () => void;
  setData: SetData<Player[]>;
}

const AIResponseImage = z.object({
  nombres: z.string(),
  apellidos: z.string(),
  fechaNacimiento: z.string(),
  nacionalidad: z.string(),
  genero: z.enum(["male", "female"]),
  numero_ci: z.string(),
});

const PlayerForm = ({ closeModal, setData, player }: Props) => {
  const { postData, fetchData } = useFetch();
  const postMutation = postData("POST /players");
  const putMutation = postData("PUT /players/:id");

  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [counter, setCounter] = useState(0);
  const [hasScanned, setHasScanned] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PlayerDTO>({
    defaultValues: {
      name: player?.name,
      lastName: player?.lastName,
      birthdate: player?.birthdate.split("T")[0],
      nationality: player?.nationality,
      commet: player?.commet,
      gender: player?.gender,
      clubId: player?.clubId,
      photo:
        "https://th.bing.com/th/id/OIP.peA5ILCfebCRr2LRch1BoAHaFj?rs=1&pid=ImgDetMain",
    },
    resolver: yupResolver(PlayerDTOschema),
  });
  /* en express enviar la foto = investigar*/
  const { data: clubs } = fetchData("GET /clubs/select");
  console.log(clubs);
  const onSubmit = (form: PlayerDTO) => {
    setLoading(true);
    if (player === null) {
      console.log(form);
      postMutation(
        {
          ...form,
          birthdate: form.birthdate + "T00:00:00.000Z",
        },
        {
          onSuccess: (res) => {
            toastSuccess(res.message);
            closeModal();
            setData((prev) => [...prev, res.data]);
          },
          onSettled: () => {
            setLoading(false);
          },
        }
      );
    } else {
      putMutation(
        {
          ...form,
          birthdate: form.birthdate + "T00:00:00.000Z",
        },
        {
          params: { id: player.id },
          onSuccess: (res) => {
            toastSuccess(res.message);
            closeModal();
            setData((prev) =>
              prev.map((v) => (v.id === res.data.id ? res.data : v))
            );
          },
          onSettled: () => {
            setLoading(false);
          },
        }
      );
    }
  };
  /* onSuccess me da una data*/

  const handleGetScanResult = async () => {
    const input = document.getElementById("InputEscanear") as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const formData = new FormData();
      const file = input.files[0];
      formData.append("file", file);

      setLoadingAI(true);
      getAIResponseImage(
        file,
        AIResponseImage,
        (objetoStr) => {
          const {
            apellidos,
            fechaNacimiento,
            genero,
            nacionalidad,
            nombres,
            numero_ci,
          } = JSON.parse(objetoStr) as z.infer<typeof AIResponseImage>;

          console.log(fechaNacimiento);

          if (nombres) {
            setValue("name", nombres);
          }
          if (apellidos) {
            setValue("lastName", apellidos);
          }
          if (fechaNacimiento) {
            const [dia, mes, anio] = fechaNacimiento.split("/");
            let valorValido = `${anio}-${mes}-${dia}`;
            valorValido = valorValido
              .split("-")
              .filter((v) => v !== "undefined")
              .join("-");
            setValue("birthdate", valorValido);
          }
          if (nacionalidad) {
            setValue("nationality", nacionalidad);
          }
          if (genero) {
            setValue("gender", genero);
          }
          if (numero_ci) {
            setValue("commet", numero_ci);
          }
        },
        {
          addedPrompt:
            "Aquí esta el archivo con la foto del carnet de identidad del jugador",
          onSuccess: () => {
            toastSuccess("Datos escaneados correctamente");
            setHasScanned(true);
          },
          onFinally: () => {
            setLoadingAI(false);
            setCounter((prev) => prev + 1);
          },
        }
      );

      /* try {
        const response = await fetch("http://localhost:5069/api/datos", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const { nombres, apellidos, fechaNacimiento } = result.data;
        if (nombres) {
          setValue("name", nombres);
        }
        if (apellidos) {
          setValue("lastName", apellidos);
        }
        if (fechaNacimiento) {
          setValue("birthdate", fechaNacimiento);
        }
      } catch (error) {
        console.error("Error:", error);
      } */
    } else {
      console.error("No file selected");
    }
  };

  return (
    <>
      {!player && (
        <>
          {!hasScanned ? (
            <>
              <Button
                disabled={loadingAI}
                variant="outline"
                onClick={() => {
                  const input = document.getElementById(
                    "InputEscanear"
                  ) as HTMLInputElement;
                  if (input) {
                    input.click();
                  }
                }}
              >
                {loadingAI ? "Escaneando CI..." : "Escanear datos"}
              </Button>
              <input
                key={counter}
                id="InputEscanear"
                type="file"
                placeholder="Escanear datos"
                className="hidden"
                onChange={handleGetScanResult}
              />
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setHasScanned(false);
                setValue("name", "");
                setValue("lastName", "");
                setValue("birthdate", "");
                setValue("nationality", "");
                setValue("gender", "");
                setValue("commet", "");
              }}
            >
              X
            </Button>
          )}
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Ingrese el nombre del jugador"
          {...register("name")}
        />
        <p className="text-rose-500 text-sm">{errors.name?.message}</p>

        <input
          type="text"
          placeholder="Ingrese el apellido del jugador"
          {...register("lastName")}
        />
        <p className="text-rose-500 text-sm">{errors.lastName?.message}</p>

        <input
          type="date"
          placeholder="ingrese la fecha de nacimiento del jugador"
          {...register("birthdate")}
          disabled={hasScanned}
        />
        <p className="text-rose-500 text-sm">{errors.birthdate?.message}</p>

        <input
          type="text"
          placeholder="Ingrese la nacionalidad del jugador"
          {...register("nationality")}
        />
        <p className="text-rose-500 text-sm">{errors.nationality?.message}</p>

        <select {...register("gender")}>
          <option value="">Seleccione genero</option>
          <option value="male">Hombre</option>
          <option value="female">Mujer</option>
        </select>
        <p className="text-rose-500 text-sm">{errors.gender?.message}</p>

        <input
          type="text"
          placeholder="Ingrese el CI del jugador"
          {...register("commet")}
        />
        <p className="text-rose-500 text-sm">{errors.commet?.message}</p>

        <select {...register("clubId")}>
          <option value="">Seleccione el club</option>
          {clubs?.map((c) => (
            <option key={c.clubId} value={c.clubId}>
              {c.value}
            </option>
          ))}
        </select>
        <p className="text-rose-500 text-sm">{errors.clubId?.message}</p>

        <Button disabled={loading} type="submit">
          {player ? "Editar Jugador" : "Registrar Jugador"}
        </Button>
      </form>
    </>
  );
};

export default PlayerForm;
