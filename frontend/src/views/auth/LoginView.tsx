import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query'
import ErrorMessage from "@/components/ErrorMessage";
import { UserLoginForm } from "@/types/index";
import { loginUser } from "@/api/auth/AuthAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoginView() {

  const initialValues: UserLoginForm = {
    username: '',
    password: '',
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
  const navigate = useNavigate()

  const { mutate } = useMutation({
    mutationFn: loginUser,
    onError: (error) => {
      //console.log(error)
      toast.error(error.message)
    },
    onSuccess: () => {
      navigate('/')
    }
  })

  const handleLogin = (formData: UserLoginForm) => mutate(formData)

  return (
    <>
      <h1 className="text-4xl font-black text-white text-center">EnviroSense</h1>
        <p className="text-xl font-light text-white mt-5 text-center mb-5">
            Control del clima en invernaderos {''}
        </p>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 bg-white"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-xl"
          >Nombre de usuario</label>

          <input
            id="username"
            type="username"
            placeholder="Nombre de usuario"
            className="w-full p-3  border-gray-300 border"
            {...register("username", {
              required: "El nombre de usuario es obligatorio",
            })}
          />
          {errors.username && (
            <ErrorMessage>{errors.username.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-xl"
          >Contraseña</label>

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              required: "La contraseña es obligatoria",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Iniciar Sesión'
          className="bg-gray-600 hover:bg-gray-700 w-full p-3  text-white font-black   cursor-pointer"
        />
      </form>
    </>
  )
}