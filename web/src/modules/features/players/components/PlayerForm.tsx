import { PlayerDTO } from "../api/dtos";
import useFetch, { SetData } from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toast";
import { Player } from "../api/responses";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PlayerDTOschema } from "../validations/PlayerDTO.schema";

interface Props {
  player: Player | null;
  closeModal: () => void;
  setData: SetData<Player[]>;
}

const PlayerForm = ({ closeModal, setData, player }: Props) => {
  const { postData, fetchData } = useFetch();
  const postMutation = postData("POST /players");
  const putMutation = postData("PUT /players/:id");
  const {
    register,
    handleSubmit,
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
        }
      );
    }
  };
  /* onSuccess me da una data*/
  console.log(clubs);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Ingrese el nombre del jugador"
        {...register("name")}
      />
      <p>{errors.name?.message}</p>
      <input
        type="text"
        placeholder="Ingrese el apellido del jugador"
        {...register("lastName")}
      />
      <p>{errors.lastName?.message}</p>
      <input
        type="date"
        placeholder="ingrese la fecha de nacimiento del jugador"
        {...register("birthdate")}
      />
      <p>{errors.birthdate?.message}</p>
      <input
        type="text"
        placeholder="Ingrese la nacionalidad del jugador"
        {...register("nationality")}
      />
      <p>{errors.nationality?.message}</p>
      <input
        type="text"
        placeholder="Ingrese el commet del jugador"
        {...register("commet")}
      />
      <p>{errors.commet?.message}</p>
      <select {...register("gender")}>
        <option value="">Seleccione genero</option>
        <option value="male">Hombre</option>
        <option value="female">Mujer</option>
      </select>
      <p>{errors.gender?.message}</p>

      <select {...register("clubId")}>
        <option value="">Seleccione el club</option>
        {clubs?.map((c) => (
          <option key={c.clubId} value={c.clubId}>
            {c.value}
          </option>
        ))}
      </select>
      <p>{errors.gender?.message}</p>

      <button type="submit">
        {player ? "Editar Jugador" : "Registrar Jugador"}
      </button>
    </form>
  );
};

export default PlayerForm;
