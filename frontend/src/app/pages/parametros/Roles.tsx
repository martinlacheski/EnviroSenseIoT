import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import { SweetAlert2 } from "../../utils";
import api from "../../../api/api";
import { Button, Modal, ButtonGroup } from "react-bootstrap";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { BreadcrumbHeader, CustomInput } from "../../components";
import { ActionButtons, DatatableNoPagination } from "../../shared";

interface DataRow {
  _id: string;
  name: string;
  is_admin: boolean;
}

interface FormInterface {
  _id: string;
  name: string;
  is_admin: boolean;
}

const initialForm: FormInterface = {
  _id: "",
  name: "",
  is_admin: false,
};

export const Roles = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormInterface>(initialForm);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<DataRow[]>([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const endpoint = "/roles/";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/roles");
      setItems(data);
    } catch (error) {
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

  const handleEdit = (row: DataRow) => {
    setEditingId(row._id);
    setForm({
      _id: row._id,
      name: row.name,
      is_admin: row.is_admin,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: FormInterface) => {
    try {
      const confirmation = await SweetAlert2.confirm("¿Confirmar operación?");
      if (!confirmation.isConfirmed) return;
      setIsFormSubmitted(true);
      if (editingId) {
        const { data } = await api.put(`${endpoint}`, { ...values });
        SweetAlert2.successToast(data.message || "¡Actualización exitosa!");
      } else {
        const { _id, ...rest } = values;
        const { data } = await api.post(endpoint, { ...rest });
        SweetAlert2.successToast(data.message || "¡Creación exitosa!");
      }
      fetch();
      handleHide();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setIsFormSubmitted(false);
    }
  };

  const handleDelete = async (row: DataRow) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Está seguro de eliminar este registro?"
    );
    if (!confirmation.isConfirmed) return;
    try {
      const { data } = await api.delete(`${endpoint}${row._id}`);
      SweetAlert2.successToast(data.message || "¡Eliminación exitosa!");
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  // COLUMNAS Y RENDERIZADO
  const columns: TableColumn<DataRow>[] = [
    {
      name: "ID",
      selector: (row: DataRow) => row._id,
      width: "130px",
      center: true,
    },
    {
      name: "NOMBRE ROL",
      selector: (row: DataRow) => row.name,
    },
    {
      name: "ADMINISTRADOR",
      selector: (row: DataRow) => (row.is_admin ? "Sí" : "No"),
      center: true,
    },
    {
      name: "ACCIONES",
      center: true,
      maxWidth: "130px",
      cell: (row: DataRow) => (
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
    <Fragment>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <BreadcrumbHeader
          section={"parametros"}
          paths={[{ label: "roles" }]}
        />
        <Button className="py-1" variant="success" onClick={handleCreate}>
          <i className="bi bi-plus-lg me-2"></i>
          <small>Nuevo</small>
        </Button>
      </div>

      <DatatableNoPagination
        columns={columns}
        data={items}
        title="Listado de roles"
        loading={loading}
      />

      <Modal show={isModalOpen} onHide={handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? `Modificar rol` : `Crear rol`}</Modal.Title>
        </Modal.Header>

        <Formik
          initialValues={form}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Este campo es obligatorio"),
            is_admin: Yup.boolean().required("Este campo es obligatorio"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <Modal.Body className="d-flex flex-column gap-2">
                <CustomInput.Text
                  isRequired
                  label="Rol"
                  name="name"
                  type="text"
                  placeholder="Nombre del rol"
                  isInvalid={!!errors.name && touched.name}
                />

                <CustomInput.Select
                  label="¿Es administrador?"
                  name="is_admin"
                  isInvalid={!!errors.is_admin && touched.is_admin}
                  isRequired
                >
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </CustomInput.Select>
              </Modal.Body>

              <Modal.Footer>
                <ButtonGroup className="d-flex">
                  <Button size="sm" variant="secondary" onClick={handleHide}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isFormSubmitted}
                  >
                    <i className="bi bi-floppy me-2"></i>
                    {editingId ? `Modificar rol` : `Crear rol`}
                  </Button>
                </ButtonGroup>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </Fragment>
  );
};
