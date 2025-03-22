interface Props {
  row: any;
  handleEdit: (row: any) => void;
  handleDelete: (row: any) => void;
  handleView: (row: any) => void;
}

export const ActionThreeButtons = ({
  row,
  handleEdit,
  handleDelete,
  handleView,
}: Props) => {
  return (
    <div className="d-flex justify-content-center">
      <button
        title="Modificar"
        className="btn btn-transparent py-0 px-1"
        onClick={() => handleEdit(row)}
      >
        <i className="bi bi-pencil-square text-secondary-emphasis"></i>
      </button>
      <button
        title="Eliminar"
        className="btn btn-transparent py-0 px-1"
        onClick={() => handleDelete(row)}
      >
        <i className="bi bi-trash2 text-danger"></i>
      </button>
      <button
        title="Ver"
        className="btn btn-transparent py-0 px-1"
        onClick={() => handleView(row)}
      >
        <i className="bi bi-eye text-primary"></i>
      </button>
    </div>
  );
};
