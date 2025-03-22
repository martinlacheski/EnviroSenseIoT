import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import { SweetAlert2 } from "../../utils";
import api from "../../../api/api";
import { Button } from "react-bootstrap";
import { ActionButtons, DatatableNoPagination } from "../../shared";
import { ParamForm } from "./components";
import { BreadcrumbHeader } from "../../components";

interface ItemInterface {
  _id: string;
  name: string;
}

const initialForm: ItemInterface = {
  _id: "",
  name: "",
};

export const Paises = () => {
  const endpoint = "/countries";
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ItemInterface[]>([]);

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(endpoint);
      setItems(data);
    } catch (error: any) {
      navigate("/");
      SweetAlert2.errorAlert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  // CREAR, EDITAR Y ELIMINAR
  const handleCreate = () => {
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleEdit = (row: ItemInterface) => {
    setEditingId(row._id);
    setForm(row);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: ItemInterface) => {
    try {
      const confirmation = await SweetAlert2.confirm("¿Confirmar operación?");
      if (!confirmation.isConfirmed) return;
      setIsFormSubmitted(true);

      if (editingId) {
        const { data } = await api.put(`${endpoint}`, { ...values });
        SweetAlert2.successToast(data.message || "¡Actualización exitosa!");
      } else {
        const { data } = await api.post(endpoint, { name: values.name });
        SweetAlert2.successToast(data.message || "¡Creación exitosa!");
      }

      handleHide();
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitted(false);
    }
  };
  const handleDelete = async (row: ItemInterface) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de eliminar este registro?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      const { data } = await api.delete(`${endpoint}/${row._id}`);
      SweetAlert2.successToast(data.message || "¡Eliminación exitosa!");
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  // COLUMNAS Y RENDERIZADO
  const columns: TableColumn<ItemInterface>[] = [
    {
      name: "ID",
      selector: (row: ItemInterface) => row._id,
      width: "130px",
      center: true,
    },
    {
      name: "NOMBRE",
      selector: (row: ItemInterface) => row.name,
    },
    {
      name: "ACCIONES",
      center: true,
      maxWidth: "130px",
      cell: (row: any) => (
        <ActionButtons
          row={row}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ),
    },
  ];

  // MODAL
  const handleHide = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <BreadcrumbHeader
          section={"parametros"}
          paths={[{ label: "países" }]}
        />
        <Button className="py-1" variant="success" onClick={handleCreate}>
          <i className="bi bi-plus-lg me-2"></i>
          <small>Nuevo</small>
        </Button>
      </div>

      <DatatableNoPagination
        columns={columns}
        data={items}
        title="Listado de países"
        loading={loading}
      />

      <ParamForm
        show={isModalOpen}
        onHide={handleHide}
        form={form}
        editingId={editingId}
        onSubmit={handleSubmit}
        prefix="del"
        title="país"
        isFormSubmitted={isFormSubmitted}
      />
    </div>
  );
};
