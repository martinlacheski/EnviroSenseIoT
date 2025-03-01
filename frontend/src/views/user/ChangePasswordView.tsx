import { useForm } from "react-hook-form"
import ErrorMessage from "@/components/common/ErrorMessage"

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { UpdateCurrentUserPasswordForm } from "@/types/index";
import { changeCurrentPassword } from "@/api/current_user/CurrentUserAPI";


export default function ChangePasswordView() {
  const initialValues : UpdateCurrentUserPasswordForm = {
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  }

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({ defaultValues: initialValues })

  const { mutate } = useMutation({
      mutationFn: changeCurrentPassword,
      onError: (error) => {
        toast.error(error.message)
      },
      onSuccess: (data)  => {
        toast.success(data.message);
        // Reinicia los inputs al valor inicial
        reset(initialValues);
      }
  })

  const new_password = watch('new_password');
  const handleChangePassword = (formData : UpdateCurrentUserPasswordForm) => mutate(formData)

  return (
    <>
      <div className="mx-auto max-w-3xl">

        <h1 className="text-5xl font-black ">Cambiar Password</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Utiliza este formulario para cambiar tu password</p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className=" mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="current_password"
            >Password Actual</label>
            <input
              id="current_password"
              type="password"
              placeholder="Password Actual"
              className="w-full p-3  border border-gray-200"
              {...register("current_password", {
                required: "El password actual es obligatorio",
              })}
            />
            {errors.current_password && (
              <ErrorMessage>{errors.current_password.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="password"
            >Nuevo Password</label>
            <input
              id="new_password"
              type="password"
              placeholder="Nuevo Password"
              className="w-full p-3  border border-gray-200"
              {...register("new_password", {
                required: "El Nuevo Password es obligatorio",
                minLength: {
                  value: 4,
                  message: 'El Password debe ser mínimo de 4 caracteres'
                }
              })}
            />
            {errors.new_password && (
              <ErrorMessage>{errors.new_password.message}</ErrorMessage>
            )}
          </div>
          <div className="mb-5 space-y-3">
            <label
              htmlFor="password_confirmation"
              className="text-sm uppercase font-bold"
            >Repetir Password</label>

            <input
              id="new_password_confirmation"
              type="password"
              placeholder="Repetir Password"
              className="w-full p-3  border border-gray-200"
              {...register("new_password_confirmation", {
                required: "Este campo es obligatorio",
                validate: value => value === new_password || 'Los Passwords no son iguales'
              })}
            />
            {errors.new_password_confirmation && (
              <ErrorMessage>{errors.new_password_confirmation.message}</ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            value='Cambiar Password'
            className="bg-gray-800 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  )
}