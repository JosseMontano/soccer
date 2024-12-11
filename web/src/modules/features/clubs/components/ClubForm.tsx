import { ClubDTO } from "../api/dtos";
import useFetch, { SetData } from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toast";
import { Club } from "../api/responses";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClubDTOschema } from "../validations/ClubDTO.schema";
import { sendCloudinary } from "@/modules/core/utils/cloudinary";
import { useState } from "react";

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

  const [progress, setProgress] = useState(0);
  console.log(progress);
  const onSubmit = async (form: ClubDTO) => {
    let url: string | null = null;
    if (form.logo.length > 0) {
      url = await sendCloudinary(form.logo[0], setProgress);
    }

    if (club === null) {
      postMutation(
        {
          ...form,
          logo: url,
        },
        {
          onSuccess: (res) => {
            toastSuccess(res.message);
            closeModal();
            //@ts-expect-error the back is returning other property
            setData((prev) => [...prev, res.data.club]);
          },
        }
      );
    } else {
      putMutation(
        {
          ...form,
          logo: url,
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
        {categories?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input type="file" {...register("logo")} />
      <button type="submit">{club ? "Editar Club" : "Registrar Club"}</button>
    </form>
  );
};

export default ClubForm;
