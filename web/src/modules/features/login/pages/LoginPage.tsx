import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { LoginDTOschema } from "../validations/LoginDTO.schema";
import useFetch from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toast";
import useUserStore from "@/modules/core/store/userStore";

const LoginPage = () => {
  const { postData } = useFetch();
  const navigate = useNavigate();
  const postMutation = postData("POST /users/login");
  const { login } = useUserStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginDTOschema),
  });

  const onSubmit = (data: any) => {
    postMutation(data, {
      onSuccess: (res) => {
        toastSuccess(res.message);
        login(res.data.user);
        navigate("/home"); // Redirigir al inicio
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Correo electrónico"
        {...register("email")}
      />
      <p>{errors.email?.message}</p>
      <input
        type="password"
        placeholder="Contraseña"
        {...register("password")}
      />
      <p>{errors.password?.message}</p>
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default LoginPage;
