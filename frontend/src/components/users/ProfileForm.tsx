import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import { UserProfileForm } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile } from "@/api/current_user/CurrentUserAPI"
import { toast } from "react-toastify"

type ProfileFormProps = {
    data: UserProfileForm
}

export default function ProfileForm({ data } : ProfileFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<UserProfileForm>({ defaultValues: data })

    const queryClient = useQueryClient()
    
    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
          toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Usuario actualizado correctamente")
            queryClient.invalidateQueries({queryKey: ['username']})
        }
      })

    const handleEditProfile = (formData: UserProfileForm) => mutate(formData)

    return (
        <>
            <div className="mx-auto max-w-3xl g">
                <h1 className="text-5xl font-black ">Mi Perfil</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Aquí puedes actualizar tu información</p>

                <form
                    onSubmit={handleSubmit(handleEditProfile)}
                    className=" mt-14 space-y-5  bg-white shadow-lg p-10 rounded-l"
                    noValidate
                >
                    

                    <div className="mb-5 space-y-3">
                        <label htmlFor="name" className="text-sm uppercase font-bold">
                            Nombres
                        </label>
                        <input
                            id="name"
                            className="w-full p-3  border border-gray-200"
                            type="text"
                            placeholder="Nombres"
                            {...register("name", {
                                required: "El nombre es obligatorio",
                            })}
                        />

                        {errors.name && (
                            <ErrorMessage>{errors.name.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="mb-5 space-y-3">
                        <label htmlFor="surname" className="text-sm uppercase font-bold">
                            Apellido
                        </label>
                        <input
                            id="surname"
                            className="w-full p-3  border border-gray-200"
                            type="text"
                            placeholder="Apellido"
                            {...register("surname", {
                                required: "El apellido es obligatorio",
                            })}
                        />

                        {errors.name && (
                            <ErrorMessage>{errors.surname.message}</ErrorMessage>
                        )}
                    </div>

                    <input
                        type="submit"
                        value='Guardar Cambios'
                        className="bg-gray-800 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    />
                </form>
            </div>
        </>
    )
}