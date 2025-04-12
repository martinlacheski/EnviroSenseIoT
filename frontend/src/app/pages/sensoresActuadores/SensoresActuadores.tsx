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
import {
  SensorActuadorForm,
  SensorActuadorList as DataRow,
  initialForm,
  initialHelpers,
} from "./interfaces";
import { Ambiente } from "../ambientes/interfaces";

export const SensoresActuadores = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SensorActuadorForm>(initialForm);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<DataRow[]>([]);
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const endpoint = "/actuators/";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      setLoading(true);
      const [res, _] = await Promise.all([
        api.get("/environments/"),
        fetchActuadores(),
      ]);
      setAmbientes(res.data);
    } catch (error) {
      navigate("/");
      SweetAlert2.errorAlert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const fetchActuadores = async () => {
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
      _id: row._id,
      environment: row.environment.id,
      description: row.description,
      actuator_code: row.actuator_code,
      channel_1_enabled: row.channel_1_enabled,
      channel_1_name: row.channel_1_name,
      channel_1_time: row.channel_1_time,
      channel_2_enabled: row.channel_2_enabled,
      channel_2_name: row.channel_2_name,
      channel_2_time: row.channel_2_time,
      channel_3_enabled: row.channel_3_enabled,
      channel_3_name: row.channel_3_name,
      channel_3_time: row.channel_3_time,
      channel_4_enabled: row.channel_4_enabled,
      channel_4_name: row.channel_4_name,
      channel_4_time: row.channel_4_time,
      channel_5_enabled: row.channel_5_enabled,
      channel_5_name: row.channel_5_name,
      channel_5_time: row.channel_5_time,
      channel_6_enabled: row.channel_6_enabled,
      channel_6_name: row.channel_6_name,
      channel_6_time: row.channel_6_time,
      channel_7_enabled: row.channel_7_enabled,
      channel_7_name: row.channel_7_name,
      channel_7_time: row.channel_7_time,
      channel_8_enabled: row.channel_8_enabled,
      channel_8_name: row.channel_8_name,
      channel_8_time: row.channel_8_time,
      seconds_to_report: row.seconds_to_report,
      enabled: row.enabled,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: SensorActuadorForm) => {
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
      fetchActuadores();
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
      fetchActuadores();
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
      name: "CÓDIGO",
      selector: (row: DataRow) => row.actuator_code,
    },
    {
      name: "DESCRIPCIÓN",
      selector: (row: DataRow) => row.description,
      grow: 2,
    },
    {
      name: "AMBIENTE",
      selector: (row: DataRow) => row.environment.name,
    },
    {
      name: "SEGUNDOS PARA REPORTAR",
      selector: (row: DataRow) => row.seconds_to_report,
      center: true,
    },
    {
      name: "ESTADO",
      selector: (row: DataRow) => row.enabled,
      format: (row: DataRow) =>
        row.enabled ? (
          <span className="badge bg-success">Activo</span>
        ) : (
          <span className="badge bg-danger">Inactivo</span>
        ),
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

  const handleNavigate = (row: DataRow) => {
    navigate(`/dispositivos/actuadores/${row._id}`);
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <BreadcrumbHeader
          section={"dispositivos"}
          paths={[{ label: "Actuadores" }]}
        />
        <Button className="py-1" variant="success" onClick={handleCreate}>
          <i className="bi bi-plus-lg me-2"></i>
          <small>Nuevo</small>
        </Button>
      </div>

      <DatatableNoPagination
        columns={columns}
        data={items}
        title="Listado de actuadores"
        loading={loading}
        clickableRows
        onRowClicked={handleNavigate}
      />

      <Modal show={isModalOpen} onHide={handleHide} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? `Modificar actuador` : `Crear actuador`}
          </Modal.Title>
        </Modal.Header>

        <Formik
          initialValues={form}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validationSchema={Yup.object({
            enabled: Yup.boolean().required("El estado es requerido"),
            seconds_to_report: Yup.number().required(
              "Los segundos para reportar son requeridos"
            ),
            environment: Yup.string().required("El ambiente es requerido"),
            description: Yup.string().required("La descripción es requerida"),
            actuator_code: Yup.string().required("El código es requerido"),
            channel_1_enabled: Yup.boolean().required("El estado es requerido"),
            channel_1_name: Yup.string().required("El nombre es requerido"),
            channel_1_time: Yup.number().required("El tiempo es requerido"),
            channel_2_enabled: Yup.boolean().required("El estado es requerido"),
            channel_2_name: Yup.string().required("El nombre es requerido"),
            channel_2_time: Yup.number().required("El tiempo es requerido"),
            channel_3_enabled: Yup.boolean().required("El estado es requerido"),
            channel_3_name: Yup.string().required("El nombre es requerido"),
            channel_3_time: Yup.number().required("El tiempo es requerido"),
            channel_4_enabled: Yup.boolean().required("El estado es requerido"),
            channel_4_name: Yup.string().required("El nombre es requerido"),
            channel_4_time: Yup.number().required("El tiempo es requerido"),
            channel_5_enabled: Yup.boolean().required("El estado es requerido"),
            channel_5_name: Yup.string().required("El nombre es requerido"),
            channel_5_time: Yup.number().required("El tiempo es requerido"),
            channel_6_enabled: Yup.boolean().required("El estado es requerido"),
            channel_6_name: Yup.string().required("El nombre es requerido"),
            channel_6_time: Yup.number().required("El tiempo es requerido"),
            channel_7_enabled: Yup.boolean().required("El estado es requerido"),
            channel_7_name: Yup.string().required("El nombre es requerido"),
            channel_7_time: Yup.number().required("El tiempo es requerido"),
            channel_8_enabled: Yup.boolean().required("El estado es requerido"),
            channel_8_name: Yup.string().required("El nombre es requerido"),
            channel_8_time: Yup.number().required("El tiempo es requerido"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <Modal.Body>
                <Row xs={1} lg={2} className="g-2">
                  <CustomInput.Text
                    isRequired
                    label="Código"
                    name="actuator_code"
                    type="text"
                    placeholder="Código del actuador"
                    isInvalid={!!errors.actuator_code && touched.actuator_code}
                  />

                  <CustomInput.Select
                    label="Ambiente"
                    name="environment"
                    isInvalid={!!errors.environment && touched.environment}
                    isRequired
                  >
                    <option value="">Seleccionar ambiente</option>
                    {ambientes.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </CustomInput.Select>

                  <CustomInput.Number
                    isRequired
                    label="Segundos para reportar"
                    name="seconds_to_report"
                    type="text"
                    placeholder="Segundos para reportar"
                    isInvalid={
                      !!errors.seconds_to_report && touched.seconds_to_report
                    }
                  />

                  <CustomInput.Select
                    label="Estado"
                    name="enabled"
                    isInvalid={!!errors.enabled && touched.enabled}
                    isRequired
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </CustomInput.Select>
                </Row>
                <Row xs={1} className="g-2 mt-1">
                  <CustomInput.Text
                    isRequired
                    label="Descripción"
                    name="description"
                    type="text"
                    placeholder="Descripción del actuador"
                    isInvalid={!!errors.description && touched.description}
                  />
                </Row>
                <Row xs={1} lg={4} className="g-2 mt-3">
                  {initialHelpers.map(({ enabled, name, time }, index) => (
                    <Fragment key={index}>
                      <span>
                        <strong>{enabled}</strong>
                      </span>
                      <CustomInput.Select
                        name={enabled}
                        isInvalid={!!errors[enabled] && touched[enabled]}
                        isRequired
                      >
                        <option value="">Seleccionar estado</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                      </CustomInput.Select>

                      <CustomInput.Text
                        isRequired
                        name={name}
                        dasdas
                        type="text"
                        placeholder={`Nombre del canal`}
                        isInvalid={!!errors[name] && touched[name]}
                      />

                      <CustomInput.Number
                        isRequired
                        name={time}
                        isInvalid={!!errors[time] && touched[time]}
                      />
                    </Fragment>
                  ))}
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
                    {editingId ? `Modificar actuador` : `Crear actuador`}
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
