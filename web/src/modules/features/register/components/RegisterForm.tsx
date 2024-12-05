import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterDTO } from "../apis/dtos";
import { RegisterDTOschema } from "../validations/RegisterDTO.schema";
import useFetch from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toast";

const RegisterForm = () => {
  const { postData } = useFetch();
  const postMutation = postData("POST /users/register");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDTO>({
    defaultValues: {},
    resolver: yupResolver(RegisterDTOschema),
  });

  const onSubmit = (form: RegisterDTO) => {
    postMutation(
      { ...form },
      {
        onSuccess: (res) => {
          toastSuccess(res.message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="Ingrese su email"
        {...register("email")}
      />
      <p>{errors.email?.message}</p>
      <input
        type="password"
        placeholder="Ingrese su contraseña"
        {...register("password")}
      />
      <p>{errors.password?.message}</p>
      <button type="submit">{"Registrarse"}</button>
    </form>
  );
};

export default RegisterForm;
