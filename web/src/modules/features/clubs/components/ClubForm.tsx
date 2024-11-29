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
  const { postData, fetchData } = useFetch();
  const { data: categories } = fetchData("GET /categories");
  const postMutation = postData("POST /clubs");
  const putMutation = postData("PUT /clubs/:id");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClubDTO>({
    defaultValues: {
      name: club?.name,
      logo: "",
    },
    resolver: yupResolver(ClubDTOschema),
  });

  const onSubmit = (form: ClubDTO) => {
    console.log(form)
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Ingrese el nombre del club"
        {...register("name")}
      />  
      <p>{errors.name?.message}</p>
      <select {...register("categoryId")}>
        <option value="">Seleccione una categoria</option>
        {
          categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))
        }
      </select>
      <button type="submit">{club ? "Editar Club" : "Registrar Club"}</button>
    </form>
  );
};

export default ClubForm;
