import { GameDTO } from "../api/dtos";
import useFetch, { SetData } from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toast";
import { Game } from "../api/responses";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { GameDTOschema } from "../validations/GameDTO.schema";

interface Props {
  game: Game | null;
  closeModal: () => void;
  setData: SetData<Game[]>;
}

const GameForm = ({ closeModal, setData, game }: Props) => {
  const { postData } = useFetch();
  const postMutation = postData("POST /game");
  const putMutation = postData("PUT /game/:id");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GameDTO>({
    defaultValues: {
      firstTeam: game?.firstTeam,
      secondTeam: game?.secondTeam,
      firstDate: game?.firstDate,
      secondDate: game?.secondDate,
      cardsYellow: game?.cardsYellow,
      cardsRed: game?.cardsRed,
      faults: game?.faults,
      amountGoalsFirstTeam:game?.amountGoalsFirstTeam,
      amountGoalsSecondTeam: game?.amountGoalsSecondTeam,
      winner: game?.winner,
    },
    resolver: yupResolver(GameDTOschema),
  });
  /* en express enviar la foto = investigar*/

  const onSubmit = (form: GameDTO) => {
    if (game === null) {
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
          params: { id: game.id },
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
        placeholder="Ingrese el nombre del primer equipo"
        {...register("firstTeam")}
      />
      <p>{errors.firstTeam?.message}</p>
      <input
        type="text"
        placeholder="Ingrese el nombre del segundo equipo"
        {...register("secondTeam")}
      />
      <p>{errors.secondTeam?.message}</p>
      <input
        type="number"
        placeholder="Ingrese el tiempo de la primera parte"
        {...register("firstDate")}
      />
      <p>{errors.secondDate?.message}</p>
      <input
        type="number"
        placeholder="Ingrese el tiempo de la segunda parte"
        {...register("secondDate")}
      />
      <p>{errors.secondDate?.message}</p>
      <input
        type="number"
        placeholder="Ingrese las tarjetas amarrillas"
        {...register("cardsYellow")}
      />
      <p>{errors.cardsYellow?.message}</p>
      <input
        type="number"
        placeholder="Ingrese las tarjetas rojas"
        {...register("cardsRed")}
      />
      <p>{errors.cardsRed?.message}</p>
      <input
        type="number"
        placeholder="Ingrese las faltas del partido"
        {...register("faults")}
      />
      <p>{errors.faults?.message}</p>
      <input
        type="number"
        placeholder="Ingrese los goles del primer equipo"
        {...register("amountGoalsFirstTeam")}
      />
      <p>{errors.amountGoalsFirstTeam?.message}</p>
      <input
        type="number"
        placeholder="Ingrese los goles del segundo equipo"
        {...register("amountGoalsSecondTeam")}
      />
      <p>{errors.amountGoalsSecondTeam?.message}</p>
      <input
        type="text"
        placeholder="Ingrese el ganador del partido"
        {...register("winner")}
      />
      <p>{errors.winner?.message}</p>
      <button type="submit">
        {game ? "Editar Juego" : "Publicar Juego"}
      </button>
    </form>
  );
};

export default GameForm;
