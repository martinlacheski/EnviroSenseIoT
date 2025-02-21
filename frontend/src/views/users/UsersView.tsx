import { Link } from "react-router-dom";

export default function UsersView() {
  return (
    <div>
      <h1 className="text-2xl font-black">Usuarios</h1>
      <p className="text-xl font-light text-gray-500">Administrar usuarios del sistema</p>

      <nav className="my-5">
        <Link
          className=" bg-gray-800 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          to='/users/create'
        >Nuevo Usuario</Link>
      </nav>
      <nav className="my-5">
        <Link
          className=" bg-gray-800 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          to='/'
        >Volver</Link>
      </nav>
    </div>
  )
}