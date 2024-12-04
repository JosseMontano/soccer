import { LoginDTO } from "../api/dtos";
import useFetch, { SetData } from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toast";
import { Login } from "../api/responses";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginDTOschema } from "../validations/LoginDTO.schema";
import useUserStore from "@/modules/core/store/userStore";

interface Props {}

const LoginForm = ({}: Props) => {
  const { postData } = useFetch();
  const postMutation = postData("POST /users/login");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>({
    defaultValues: {},
    resolver: yupResolver(LoginDTOschema),
  });
  /* en express enviar la foto = investigar*/
  const { login, logout, user } = useUserStore();
  const onSubmit = (form: LoginDTO) => {
    postMutation(
      {
        ...form,
      },
      {
        onSuccess: (res) => {
          toastSuccess(res.message);
          login(res.data.user);
        },
      }
    );
  };
  /* onSuccess me da una data*/
  return (
<>
{user?.email}
<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Ingrese el nombre del jugador"
        {...register("email")}
      />
      <p>{errors.email?.message}</p>
      <input
        type="text"
        placeholder="Ingrese el apellido del jugador"
        {...register("password")}
      />
      <p>{errors.password?.message}</p>

      <button type="submit">{"Iniciar sesion"}</button>
    </form>
    <button onClick={logout}>chao</button>
</>
  );
};

export default LoginForm;
