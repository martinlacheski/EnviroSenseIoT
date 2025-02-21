import { createUser } from "@/api/users/UserAPI";
import UserForm from "@/components/users/UserForm";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { UserFormData } from "types";

export default function CreateUser() {

    const initialValues : UserFormData = {
            username: "",
            password: "",
            name: "",
            surname: "",
            email: "",
            enabled: false,
            is_admin: false,
        }
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { initialValues } })

    const handleForm = (data: UserFormData) => {
        // Enviamos la data al metodo de la API para crear un Usuario
        createUser(data)
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-black">Crear usuario</h1>
            <p className="text-xl font-light text-gray-500">Completa el siguiente formulario para crear un usuario</p>

            <nav className="my-5">
                <Link
                    className=" bg-gray-800 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                    to='/users/'
                >Volver</Link>
            </nav>

            <form
                className="bg-white shadow-lg px-3 rounded-lg py-3"
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >
                <UserForm
                    register={register}
                    errors={errors}
                />
                <input
                    type="submit"
                    value='Crear Usuario'
                    className=" bg-gray-800 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors py-3"
                />
            </form>
        </div>
    )
}