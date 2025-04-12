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
  SensorAmbientalForm,
  SensorAmbientalList as DataRow,
  initialForm,
} from "./interfaces";
import { Ambiente } from "../ambientes/interfaces";

export const SensoresAmbientales = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SensorAmbientalForm>(initialForm);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<DataRow[]>([]);
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const endpoint = "/sensors/environmental";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      setLoading(true);
      const [res, _] = await Promise.all([
        api.get("/environments/"),
        fetchSensores(),
      ]);
      setAmbientes(res.data);
    } catch (error) {
      navigate("/");
      SweetAlert2.errorAlert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const fetchSensores = async () => {
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
      sensor_code: row.sensor_code,
      temperature_alert_min: row.temperature_alert_min,
      temperature_alert_max: row.temperature_alert_max,
      humidity_alert_min: row.humidity_alert_min,
      humidity_alert_max: row.humidity_alert_max,
      atmospheric_pressure_alert_min: row.atmospheric_pressure_alert_min,
      atmospheric_pressure_alert_max: row.atmospheric_pressure_alert_max,
      co2_alert_min: row.co2_alert_min,
      co2_alert_max: row.co2_alert_max,
      seconds_to_report: row.seconds_to_report,
      enabled: row.enabled,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: SensorAmbientalForm) => {
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
      fetchSensores();
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
      console.log(row._id);
      const { data } = await api.delete(`${endpoint}/${row._id}`);
      SweetAlert2.successToast(data.message || "¡Eliminación exitosa!");
      fetchSensores();
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
      selector: (row: DataRow) => row.sensor_code,
    },
    {
      name: "DESCRIPCIÓN",
      selector: (row: DataRow) => row.description,
      grow: 2,
    },
    {
      name: "AMBIENTE",
      selector: (row: DataRow) => row.environment.name || "No identificado",
    },
    // {
    //   name: "TEMPERATURA MIN",
    //   selector: (row: DataRow) => row.temperature_alert_min + "°C",
    //   center: true,
    // },

    {
      name: "TEMPERATURA MAX",
      selector: (row: DataRow) => row.temperature_alert_max + "°C",
      center: true,
    },

    {
      name: "HUMEDAD MIN",
      selector: (row: DataRow) => row.humidity_alert_min + "%",
      center: true,
    },
    // {
    //   name: "HUMEDAD MAX",
    //   selector: (row: DataRow) => row.humidity_alert_max + "%",
    //   center: true,
    // },
    // {
    //   name: "Pres. Atm. Mín.",
    //   selector: (row: DataRow) => row.atmospheric_pressure_alert_min + "hPa",
    //   center: true,
    // },
    // {
    //   name: "Pres. Atm. Max.",
    //   selector: (row: DataRow) => row.atmospheric_pressure_alert_max + "hPa",
    //   center: true,
    // },
    // {
    //   name: "CO2 MIN",
    //   selector: (row: DataRow) => row.co2_alert_min + "ppm",
    //   center: true,
    // },
    // {
    //   name: "CO2 MAX",
    //   selector: (row: DataRow) => row.co2_alert_max + "ppm",
    //   center: true,
    // },
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
    navigate(`/dispositivos/sensores-ambientales/${row._id}`);
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <BreadcrumbHeader
          section={"dispositivos"}
          paths={[{ label: "Sensores ambientales" }]}
        />
        <Button className="py-1" variant="success" onClick={handleCreate}>
          <i className="bi bi-plus-lg me-2"></i>
          <small>Nuevo</small>
        </Button>
      </div>

      <DatatableNoPagination
        columns={columns}
        data={items}
        title="Listado de sensores ambientales"
        loading={loading}
        clickableRows
        onRowClicked={handleNavigate}
      />

      <Modal show={isModalOpen} onHide={handleHide} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? `Modificar sensor` : `Crear sensor`}
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
            sensor_code: Yup.string().required("El código es requerido"),
            temperature_alert_min: Yup.number().required(
              "La alerta de temperatura mínima es requerida"
            ),
            temperature_alert_max: Yup.number().required(
              "La alerta de temperatura máxima es requerida"
            ),
            humidity_alert_min: Yup.number().required(
              "La alerta de humedad mínima es requerida"
            ),
            humidity_alert_max: Yup.number().required(
              "La alerta de humedad máxima es requerida"
            ),
            atmospheric_pressure_alert_min: Yup.number().required(
              "La alerta de presión atmosférica mínima es requerida"
            ),
            atmospheric_pressure_alert_max: Yup.number().required(
              "La alerta de presión atmosférica máxima es requerida"
            ),
            co2_alert_min: Yup.number().required("La alerta de CO2 mínima es requerida"),
            co2_alert_max: Yup.number().required("La alerta de CO2 máxima es requerida"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <Modal.Body>
                <Row xs={1} lg={2} className="g-2">
                  <CustomInput.Text
                    isRequired
                    label="Código"
                    name="sensor_code"
                    type="text"
                    placeholder="Código del sensor"
                    isInvalid={!!errors.sensor_code && touched.sensor_code}
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
                <Row xs={1} className="g-2 my-2">
                  <CustomInput.Text
                    isRequired
                    label="Descripción"
                    name="description"
                    type="text"
                    placeholder="Descripción del sensor"
                    isInvalid={!!errors.sensor_code && touched.sensor_code}
                  />
                </Row>

                <Row xs={1} lg={2} className="g-2">
                  <CustomInput.Number
                    isRequired
                    label="Alerta de temperatura mínima"
                    name="temperature_alert_min"
                    type="text"
                    placeholder="Alerta de temperatura mínima"
                    isInvalid={
                      !!errors.temperature_alert_min && touched.temperature_alert_min
                    }
                  />

                  <CustomInput.Number
                    isRequired
                    label="Alerta de temperatura máxima"
                    name="temperature_alert_max"
                    type="text"
                    placeholder="Alerta de temperatura máxima"
                    isInvalid={
                      !!errors.temperature_alert_max && touched.temperature_alert_max
                    }
                  />

                  <CustomInput.Number
                    isRequired
                    label="Alerta de humedad mínima"
                    name="humidity_alert_min"
                    type="text"
                    placeholder="Alerta de humedad mínima"
                    isInvalid={
                      !!errors.humidity_alert_min && touched.humidity_alert_min
                    }
                  />

                  <CustomInput.Number
                    isRequired
                    label="Alerta de humedad máxima"
                    name="humidity_alert_max"
                    type="text"
                    placeholder="Alerta de humedad máxima"
                    isInvalid={
                      !!errors.humidity_alert_max && touched.humidity_alert_max
                    }
                  />

                  <CustomInput.Number
                    isRequired
                    label="Alerta de presión atmosférica mínima"
                    name="atmospheric_pressure_alert_min"
                    type="text"
                    placeholder="Alerta de presión atmosférica mínima"
                    isInvalid={
                      !!errors.atmospheric_pressure_alert_min &&
                      touched.atmospheric_pressure_alert_min
                    }
                  />

                  <CustomInput.Number
                    isRequired
                    label="Alerta de presión atmosférica máxima"
                    name="atmospheric_pressure_alert_max"
                    type="text"
                    placeholder="Alerta de presión atmosférica máxima"
                    isInvalid={
                      !!errors.atmospheric_pressure_alert_max &&
                      touched.atmospheric_pressure_alert_max
                    }
                  />

                  <CustomInput.Number
                    isRequired
                    label="Alerta de CO2 mínima"
                    name="co2_alert_min"
                    type="text"
                    placeholder="Alerta de CO2 mínima"
                    isInvalid={!!errors.co2_alert_min && touched.co2_alert_min}
                  />

                  <CustomInput.Number
                    isRequired
                    label="Alerta de CO2 máxima"
                    name="co2_alert_max"
                    type="text"
                    placeholder="Alerta de CO2 máxima"
                    isInvalid={!!errors.co2_alert_max && touched.co2_alert_max}
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
                    {editingId ? `Modificar sensor` : `Crear sensor`}
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
