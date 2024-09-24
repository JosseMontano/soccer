import { ClubDTO } from "../api/dtos";
import useFetch, { SetData } from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toast";
import { Club } from "../api/responses";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClubDTOschema } from "../validations/ClubDTO.schema";

interface Props {
  club: Club | null;
  closeModal: () => void;
  setData: SetData<Club[]>;
}

const ClubForm = ({ closeModal, setData, club }: Props) => {
  const { postData } = useFetch();
  const postMutation = postData("POST /clubs");
  const putMutation = postData("PUT /clubs/:id");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClubDTO>({
    defaultValues: {
      name: club?.name,
    },
    resolver: yupResolver(ClubDTOschema),
  });
  /* en express enviar la foto = investigar*/

  const onSubmit = (form: ClubDTO) => {
    if (club === null) {
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
          params: { id: club.id },
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
        placeholder="Ingrese el nombre del jugador"
        {...register("name")}
      />
      <p>{errors.name?.message}</p>
     
      <button type="submit">
        {club ? "Editar Club" : "Registrar Club"}
      </button>
    </form>
  );
};

export default ClubForm;
