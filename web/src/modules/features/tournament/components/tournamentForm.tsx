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

const TournamentForm = ({ closeModal, setData, tournament }: Props) => {
  const { postData, fetchData } = useFetch();
  const { data: formats } = fetchData("GET /formats");
  const { data: categories } = fetchData("GET /categories");
  const postMutation = postData("POST /tournaments");
  const putMutation = postData("PUT /tournaments/:id");
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TournamentDTO>({
    defaultValues: {
      name: tournament?.name,
      dateStart: tournament?.dateStart,
      dateEnd: tournament?.dateEnd,
      formatId: tournament?.formatId,
      description: tournament?.description,
      categoryId: tournament?.categoryId,
      finalFormatId: tournament?.finalFormatId,
      clubIds: [],
    },
    resolver: yupResolver(TournamentDTOschema),
  });
  //hacer un endpoint que me traiga todos los club de esa categoria
  /* en express enviar la foto = investigar*/
  const categoryId = watch("categoryId");
  const { data: clubs } = fetchData([
    "GET /clubs/category/:idCategory",
    {
      idCategory: categoryId,
    },
  ]);
  const onSubmit = (form: TournamentDTO) => {
    console.log(form);
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
        type="text"
        placeholder="Ingrese la descripcion del torneo"
        {...register("description")}
      />
      <p>{errors.description?.message}</p>
      <input
        type="date"
        placeholder="Ingrese la fecha que inicia el torneo"
        {...register("dateStart")}
      />
      <p>{errors.dateStart?.message}</p>
      <input
        type="date"
        placeholder="Ingrese la fecha que termina el torneo"
        {...register("dateEnd")}
      />
      <p>{errors.dateEnd?.message}</p>
      <select {...register("formatId")}>
        <option value="">Seleccione un formato</option>
        {formats?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <p>{errors.formatId?.message}</p>
      <select {...register("finalFormatId")}>
        <option value="">Seleccione el formato final</option>
        {formats?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <p>{errors.finalFormatId?.message}</p>
      <select {...register("categoryId")}>
        <option value="">Seleccione la categoria del torneo</option>
        {categories?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <p>{errors.categoryId?.message}</p>
      <div>
        {clubs?.map((c) => (
          <div className="flex">
            <input {...register("clubIds")} value={c.id} type="checkbox" />{" "}
            <p>{c.name}</p>
          </div>
        ))}
      </div>
      <p>{errors.clubIds?.message}</p>
      <button type="submit">
        {tournament ? "Editar torneo" : "Publicar torneo"}
      </button>
    </form>
  );
};

export default TournamentForm;
