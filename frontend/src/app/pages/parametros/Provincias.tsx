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
  country: {
    id: string;
    name: string;
  };
}

interface FormInterface {
  id: string;
  name: string;
  country: string;
}

const initialForm: FormInterface = { id: "", name: "", country: "" };

export const Provincias = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormInterface>(initialForm);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<DataRow[]>([]);
  const [countries, setCountries] = useState<any[]>([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const endpoint = "/provinces/";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        api.get("/countries"),
        api.get("/provinces"),
      ]);
      setCountries(res1.data);
      setItems(res2.data);
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
      id: row._id,
      name: row.name,
      country: row.country.id,
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
        const { id, ...rest } = values;
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
      name: "NOMBRE DE LA PROVINCIA",
      selector: (row: DataRow) => row.name,
    },
    {
      name: "PAÍS",
      selector: (row: DataRow) => row.country.name,
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
          paths={[{ label: "provincias" }]}
        />
        <Button className="py-1" variant="success" onClick={handleCreate}>
          <i className="bi bi-plus-lg me-2"></i>
          <small>Nuevo</small>
        </Button>
      </div>

      <DatatableNoPagination
        columns={columns}
        data={items}
        title="Listado de provincias"
        loading={loading}
      />

      <Modal show={isModalOpen} onHide={handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? `Modificar provincia` : `Crear provincia`}
          </Modal.Title>
        </Modal.Header>

        <Formik
          initialValues={form}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Este campo es obligatorio"),
            country: Yup.string().required("Este campo es obligatorio"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <Modal.Body className="d-flex flex-column gap-2">
                <CustomInput.Select
                  label="País"
                  name="country"
                  isInvalid={!!errors.country && touched.country}
                  isRequired
                >
                  <option value="">Seleccione un país</option>
                  {countries.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </CustomInput.Select>

                <CustomInput.Text
                  isRequired
                  label="Provincia"
                  name="name"
                  type="text"
                  placeholder="Nombre de la provincia"
                  isInvalid={!!errors.name && touched.name}
                />
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
                    {editingId ? `Modificar provincia` : `Crear provincia`}
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
