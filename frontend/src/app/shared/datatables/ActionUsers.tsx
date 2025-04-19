import { ButtonGroup } from "react-bootstrap";

interface Props {
  row: any;
  handleChangePassword: (row: any) => void;
  handleEdit: (row: any) => void;
  handleDelete: (row: any) => void;
  
}

export const ActionUsers = ({
  row,
  handleChangePassword,
  handleEdit,
  handleDelete,  
}: Props) => {
  return (
    <ButtonGroup>
      <button
        title="Modificar contraseña"
        className="btn px-2 py-0 border-secondary"
        style={{ backgroundColor: "#E4E4E5" }}
        onClick={() => handleChangePassword(row)}
      >
        <i className="bi bi-person-lock"></i>
      </button>
      <button
        title="Modificar"
        className="btn px-2 py-0 border-secondary"
        style={{ backgroundColor: "#E4E4E5" }}
        onClick={() => handleEdit(row)}
      >
        <i className="bi bi-pencil-square text-secondary-emphasis"></i>
      </button>
      <button
        title="Eliminar"
        className="btn px-2 py-0 border-secondary"
        style={{ backgroundColor: "#E4E4E5" }}
        onClick={() => handleDelete(row)}
      >
        <i className="bi bi-trash2 text-danger"></i>
      </button>
      
    </ButtonGroup>
  );
};
