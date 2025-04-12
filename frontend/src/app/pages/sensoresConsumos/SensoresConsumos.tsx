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
  SensorConsumoForm,
  SensorConsumoList as DataRow,
  initialForm,
  initialHelpers,
} from "./interfaces";
import { Ambiente } from "../ambientes/interfaces";

interface NutrientType {
  _id: string;
  name: string;
}

export const SensoresConsumos = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SensorConsumoForm>(initialForm);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<DataRow[]>([]);
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [tiposNutrientes, setTiposNutrientes] = useState<NutrientType[]>([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const endpoint = "/sensors/consumption";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      setLoading(true);
      const [res, res2, _] = await Promise.all([
        api.get("/environments/"),
        api.get("/nutrients/types/"),
        fetchSensores(),
      ]);
      setAmbientes(res.data);
      setTiposNutrientes(res2.data);
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
      min_voltage_alert: row.min_voltage_alert,
      max_voltage_alert: row.max_voltage_alert,
      nutrient_1_enabled: row.nutrient_1_enabled,
      nutrient_1_type: row.nutrient_1_type.id,
      nutrient_1_alert: row.nutrient_1_alert,
      nutrient_2_enabled: row.nutrient_2_enabled,
      nutrient_2_type: row.nutrient_2_type.id,
      nutrient_2_alert: row.nutrient_2_alert,
      nutrient_3_enabled: row.nutrient_3_enabled,
      nutrient_3_type: row.nutrient_3_type.id,
      nutrient_3_alert: row.nutrient_3_alert,
      nutrient_4_enabled: row.nutrient_4_enabled,
      nutrient_4_type: row.nutrient_4_type.id,
      nutrient_4_alert: row.nutrient_4_alert,
      nutrient_5_enabled: row.nutrient_5_enabled,
      nutrient_5_type: row.nutrient_5_type.id,
      nutrient_5_alert: row.nutrient_5_alert,
      nutrient_6_enabled: row.nutrient_6_enabled,
      nutrient_6_type: row.nutrient_6_type.id,
      nutrient_6_alert: row.nutrient_6_alert,
      seconds_to_report: row.seconds_to_report,
      enabled: row.enabled,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: SensorConsumoForm) => {
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
      const { data } = await api.delete(`${endpoint}${row._id}`);
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
      name: "VOLTAJE MÍN / MÁX",
      selector: (row: DataRow) =>
        `${row.min_voltage_alert}V / ${row.max_voltage_alert}V`,
      center: true,
    },
    {
      name: "AMBIENTE",
      selector: (row: DataRow) => row.environment.name,
    },
    {
      name: "SEGS. REPORTAR",
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
    navigate(`/dispositivos/sensores-consumo/${row._id}`);
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <BreadcrumbHeader
          section={"dispositivos"}
          paths={[{ label: "Sensores de consumo" }]}
        />
        <Button className="py-1" variant="success" onClick={handleCreate}>
          <i className="bi bi-plus-lg me-2"></i>
          <small>Nuevo</small>
        </Button>
      </div>

      <DatatableNoPagination
        columns={columns}
        data={items}
        title="Listado de sensores de consumo"
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
            min_voltage_alert: Yup.number().required(
              "El voltaje mínimo es requerido"
            ),
            max_voltage_alert: Yup.number().required(
              "El voltaje máximo es requerido"
            ),
            nutrient_1_enabled: Yup.boolean().required(
              "El estado del nutriente 1 es requerido"
            ),
            nutrient_1_type: Yup.string().required(
              "El tipo de nutriente 1 es requerido"
            ),
            nutrient_1_alert: Yup.number().required(
              "La alerta del nutriente 1 es requerida"
            ),
            nutrient_2_enabled: Yup.boolean().required(
              "El estado del nutriente 2 es requerido"
            ),
            nutrient_2_type: Yup.string().required(
              "El tipo de nutriente 2 es requerido"
            ),
            nutrient_2_alert: Yup.number().required(
              "La alerta del nutriente 2 es requerida"
            ),
            nutrient_3_enabled: Yup.boolean().required(
              "El estado del nutriente 3 es requerido"
            ),
            nutrient_3_type: Yup.string().required(
              "El tipo de nutriente 3 es requerido"
            ),
            nutrient_3_alert: Yup.number().required(
              "La alerta del nutriente 3 es requerida"
            ),
            nutrient_4_enabled: Yup.boolean().required(
              "El estado del nutriente 4 es requerido"
            ),
            nutrient_4_type: Yup.string().required(
              "El tipo de nutriente 4 es requerido"
            ),
            nutrient_4_alert: Yup.number().required(
              "La alerta del nutriente 4 es requerida"
            ),
            nutrient_5_enabled: Yup.boolean().required(
              "El estado del nutriente 5 es requerido"
            ),
            nutrient_5_type: Yup.string().required(
              "El tipo de nutriente 5 es requerido"
            ),
            nutrient_5_alert: Yup.number().required(
              "La alerta del nutriente 5 es requerida"
            ),
            nutrient_6_enabled: Yup.boolean().required(
              "El estado del nutriente 6 es requerido"
            ),
            nutrient_6_type: Yup.string().required(
              "El tipo de nutriente 6 es requerido"
            ),
            nutrient_6_alert: Yup.number().required(
              "La alerta del nutriente 6 es requerida"
            ),
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
                <Row xs={1} className="g-2 mt-1">
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
                    label="Voltaje mínimo"
                    name="min_voltage_alert"
                    type="text"
                    placeholder="Voltaje mínimo"
                    isInvalid={
                      !!errors.min_voltage_alert && touched.min_voltage_alert
                    }
                  />

                  <CustomInput.Number
                    isRequired
                    label="Voltaje máximo"
                    name="max_voltage_alert"
                    type="text"
                    placeholder="Voltaje máximo"
                    isInvalid={
                      !!errors.max_voltage_alert && touched.max_voltage_alert
                    }
                  />
                </Row>
                <Row xs={1} lg={4} className="g-2 mt-3">
                  {initialHelpers.map(({ enabled, type, alert }, index) => (
                    <Fragment key={index}>
                      <span>
                        <strong>Canal {index + 1}</strong>
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

                      <CustomInput.Select
                        name={type}
                        isInvalid={!!errors[type] && touched[type]}
                        isRequired
                      >
                        <option value="">Seleccionar tipo</option>
                        {tiposNutrientes.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name}
                          </option>
                        ))}
                      </CustomInput.Select>

                      <CustomInput.Number
                        isRequired
                        name={alert}
                        isInvalid={!!errors[alert] && touched[alert]}
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
