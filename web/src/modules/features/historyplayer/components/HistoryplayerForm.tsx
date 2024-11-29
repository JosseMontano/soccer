import { HistoryplayerDTO } from "../api/dtos";
import useFetch, { SetData } from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toast";
import { Historyplayer } from "../api/responses";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { HistoryplayerDTOschema } from "../validations/HistoryplayerDTO.schema";

interface Props {
  historyplayer: Historyplayer | null;
  closeModal: () => void;
  setData: SetData<Historyplayer[]>;
}

const PlayerForm = ({ closeModal, setData, historyplayer }: Props) => {
  const { postData } = useFetch();
  const postMutation = postData("POST /historyplayers");
  const putMutation = postData("PUT /historyplayers/:id");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HistoryplayerDTO>({
    defaultValues: {
      club: historyplayer?.club,
      allGoals: historyplayer?.allGoals,
      allFaults: historyplayer?.allFaults,
      allYellowCard: historyplayer?.allYellowCard,
      allRedCard: historyplayer?.allRedCard,
    },
    resolver: yupResolver(HistoryplayerDTOschema),
  });
  /* en express enviar la foto = investigar*/

  const onSubmit = (form: HistoryplayerDTO) => {
    if (historyplayer === null) {
      postMutation(
        {
          ...form,
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
        },
        {
          params: { id: historyplayer.id },
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
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Ingrese el club del jugador"
        {...register("club")}
      />
      <p>{errors.club?.message}</p>
      <input
        type="number"
        placeholder="Ingrese todos los goles del jugador"
        {...register("allGoals")}
      />
      <p>{errors.allGoals?.message}</p>
      <input
        type="number"
        placeholder="Ingrese todas las faltas del jugador"
        {...register("allFaults")}
      />
      <p>{errors.allFaults?.message}</p>
      <input
        type="number"
        placeholder="ingrese todas las tarjetas amarillas del jugador"
        {...register("allYellowCard")}
      />
      <p>{errors.allYellowCard?.message}</p>
      <input
        type="number"
        placeholder="Ingrese todas las tarjetas rojas del jugador"
        {...register("allRedCard")}
      />
      <p>{errors.allRedCard?.message}</p>
      <button type="submit">
        {historyplayer ? "Editar datos del jugador" : "Registrar el historial del Jugador"}
      </button>
    </form>
  );
};

export default PlayerForm;
