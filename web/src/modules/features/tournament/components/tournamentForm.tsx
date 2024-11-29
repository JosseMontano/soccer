import { TournamentDTO } from "../api/dtos";
import useFetch, { SetData } from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toast";
import { Tournament } from "../api/responses";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TournamentDTOschema } from "../validations/TournamentDTO.schema";

interface Props {
  tournament: Tournament | null;
  closeModal: () => void;
  setData: SetData<Tournament[]>;
}

const GameForm = ({ closeModal, setData, tournament }: Props) => {
  const { postData } = useFetch();
  const postMutation = postData("POST /tournament");
  const putMutation = postData("PUT /tournament/:id");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TournamentDTO>({
    defaultValues: {
      name: tournament?.name,
      dateStart: tournament?.dateStart,
      dateEnd: tournament?.dateEnd,
      format: tournament?.format,
    },
    resolver: yupResolver(TournamentDTOschema),
  });
  /* en express enviar la foto = investigar*/

  const onSubmit = (form: TournamentDTO) => {
    if (tournament === null) {
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
          params: { id: tournament.id },
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
        placeholder="Ingrese el nombre del torneo"
        {...register("name")}
      />
      <p>{errors.name?.message}</p>
      <input
        type="date"
        placeholder="Ingrese la fecha de inicio del torneo"
        {...register("dateStart")}
      />
      <p>{errors.dateStart?.message}</p>
      <input
        type="date"
        placeholder="Ingrese la fecha que termina el torneo"
        {...register("dateEnd")}
      />
      <p>{errors.dateEnd?.message}</p>
      <input
        type="text"
        placeholder="Ingrese el formato del torneo"
        {...register("format")}
      />
      <p>{errors.format?.message}</p>
      <button type="submit">
        {tournament ? "Editar torneo" : "Publicar torneo"}
      </button>
    </form>
  );
};

export default GameForm;
