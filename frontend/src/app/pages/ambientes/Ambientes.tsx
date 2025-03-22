import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import { SweetAlert2 } from "../../utils";
import api from "../../../api/api";
import { Button, Modal, ButtonGroup, Row } from "react-bootstrap";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { BreadcrumbHeader, CustomInput } from "../../components";
import { ActionButtons, DatatableNoPagination } from "../../shared";
import { Ambiente as DataRow } from "./interfaces";

interface ParamInterface {
  _id: string;
  name: string;
}

interface FormInterface {
  id: string;
  company: string;
  city: string;
  type: string;
  name: string;
  address: string;
  gps_location: string;
  description: string;
}

const initialForm: FormInterface = {
  id: "",
  company: "",
  city: "",
  type: "",
  name: "",
  address: "",
  gps_location: "",
  description: "",
};

export const Ambientes = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormInterface>(initialForm);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<DataRow[]>([]);
  const [cities, setCities] = useState<ParamInterface[]>([]);
  const [envTypes, setEnvTypes] = useState<ParamInterface[]>([]);
  const [companies, setCompanies] = useState<ParamInterface[]>([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const endpoint = "/environments/";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      setLoading(true);
      const [res1, res2, res3, _] = await Promise.all([
        api.get("/cities"),
        api.get("/environments/types/"),
        api.get("/company/"),
        fetchAmbientes(),
      ]);
      setCities(res1.data);
      setEnvTypes(res2.data);
      setCompanies(res3.data);
    } catch (error) {
      navigate("/");
      SweetAlert2.errorAlert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const fetchAmbientes = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(endpoint);
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
      id: row._id,
      company: row.company.id,
      city: row.city.id,
      type: row.type.id,
      name: row.name,
      address: row.address,
      gps_location: row.gps_location,
      description: row.description,
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
      fetchAmbientes();
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
      fetchAmbientes();
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
      name: "EMPRESA",
      selector: (row: DataRow) => row.company.name,
    },
    {
      name: "TIPO",
      selector: (row: DataRow) => row.type.name,
    },
    {
      name: "NOMBRE",
      selector: (row: DataRow) => row.name,
    },
    {
      name: "DIRECCIÓN",
      selector: (row: DataRow) => row.city.name,
      format: (row: DataRow) => `${row.address} - ${row.city.name}`,
    },
    {
      name: "UBICACIÓN",
      width: "130px",
      center: true,
      selector: (row: DataRow) => row.gps_location,
      format: (row: DataRow) => {
        const [lat, lng] = row.gps_location.split(",");
        return (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi bi-geo-alt-fill text-danger"></i>
          </a>
        );
      },
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

  const handleRedirect = (row: DataRow) => {
    navigate(`/ambientes/${row._id}`);
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <BreadcrumbHeader
          section={"ambientes"}
          paths={[{ label: "Listado de ambientes" }]}
        />
        <Button className="py-1" variant="success" onClick={handleCreate}>
          <i className="bi bi-plus-lg me-2"></i>
          <small>Nuevo</small>
        </Button>
      </div>

      <DatatableNoPagination
        columns={columns}
        data={items}
        title="Listado de ambientes"
        loading={loading}
        clickableRows
        onRowClicked={handleRedirect}
      />

      <Modal show={isModalOpen} onHide={handleHide} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? `Modificar ambiente` : `Crear ambiente`}
          </Modal.Title>
        </Modal.Header>

        <Formik
          initialValues={form}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validationSchema={Yup.object({
            company: Yup.string().required("Este campo es requerido"),
            city: Yup.string().required("Este campo es requerido"),
            type: Yup.string().required("Este campo es requerido"),
            name: Yup.string().required("Este campo es requerido"),
            address: Yup.string().required("Este campo es requerido"),
            gps_location: Yup.string().required("Este campo es requerido"),
            description: Yup.string().required("Este campo es requerido"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <Modal.Body>
                <Row xs={1} lg={2} className="g-2">
                  <CustomInput.Select
                    label="Empresa"
                    name="company"
                    isInvalid={!!errors.company && touched.company}
                    isRequired
                  >
                    <option value="">Seleccionar empresa</option>
                    {companies.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </CustomInput.Select>

                  <CustomInput.Select
                    label="Ciudad"
                    name="city"
                    isInvalid={!!errors.city && touched.city}
                    isRequired
                  >
                    <option value="">Seleccionar ciudad</option>
                    {cities.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </CustomInput.Select>

                  <CustomInput.Select
                    label="Tipo de ambiente"
                    name="type"
                    isInvalid={!!errors.type && touched.type}
                    isRequired
                  >
                    <option value="">Seleccionar tipo de ambiente</option>
                    {envTypes.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </CustomInput.Select>

                  <CustomInput.Text
                    isRequired
                    label="Nombre"
                    name="name"
                    type="text"
                    placeholder="Nombre del ambiente"
                    isInvalid={!!errors.name && touched.name}
                  />

                  <CustomInput.Text
                    isRequired
                    label="Dirección"
                    name="address"
                    type="text"
                    placeholder="Dirección del ambiente"
                    isInvalid={!!errors.address && touched.address}
                  />

                  <CustomInput.Text
                    isRequired
                    label="Ubicación GPS"
                    name="gps_location"
                    type="text"
                    placeholder="Latitud, Longitud"
                    isInvalid={!!errors.gps_location && touched.gps_location}
                  />
                </Row>

                <Row xs={1} className="mt-3">
                  <CustomInput.TextArea
                    isRequired
                    label="Descripción"
                    name="description"
                    type="text"
                    placeholder="Descripción del ambiente"
                    isInvalid={!!errors.description && touched.description}
                  />
                </Row>
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
                    {editingId ? `Modificar ambiente` : `Crear ambiente`}
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
