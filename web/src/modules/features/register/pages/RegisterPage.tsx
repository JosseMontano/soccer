import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-md">
        <h2 className="text-2xl font-bold text-center mb-4">Registro</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
