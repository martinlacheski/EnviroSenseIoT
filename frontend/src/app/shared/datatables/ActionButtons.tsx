import { ButtonGroup } from "react-bootstrap";

interface FiltersParamsProps {
  row: any;
  handleEdit: (row: any) => void;
  handleDelete: (row: any) => void;
}

export const ActionButtons = ({
  row,
  handleEdit,
  handleDelete,
}: FiltersParamsProps) => {
  return (
    <ButtonGroup>
      <button
        title="Modificar"
        className="btn px-2 py-0 border-secondary"
        style={{ backgroundColor: "#E4E4E5" }}
        onClick={() => handleEdit(row)}
      >
        <i className="bi bi-pencil"></i>
      </button>
      <button
        title="Eliminar"
        className="btn px-2 py-0 border-secondary"
        style={{ backgroundColor: "#E4E4E5" }}
        onClick={() => handleDelete(row)}
      >
        <i className="bi bi-trash"></i>
      </button>
    </ButtonGroup>
  );
};
