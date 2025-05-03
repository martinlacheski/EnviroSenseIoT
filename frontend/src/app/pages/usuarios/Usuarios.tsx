import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import { SweetAlert2 } from "../../utils";
import api from "../../../api/api";
import { Button, Modal, ButtonGroup, Row } from "react-bootstrap";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { BreadcrumbHeader, CustomInput } from "../../components";
import { DatatableNoPagination } from "../../shared";
import { Usuario as DataRow } from "./interfaces";
import { ActionUsers } from "../../shared/datatables/ActionUsers";

interface FormInterface {
  id: string;
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
  email: string;
  enabled: boolean;
  is_admin: boolean;
}

const initialForm: FormInterface = {
  id: "",
  username: "",
  password: "",
  confirmPassword: "",
  name: "",
  surname: "",
  email: "",
  enabled: true,
  is_admin: false,
};

interface ChangePasswordForm {
  id: string;
  username: string;
  new_password: string; 
  new_password_confirmation: string; 
}

const initialChangePasswordForm: ChangePasswordForm = {
  id: "",
  username: "",
  new_password: "", 
  new_password_confirmation: "", 
};

export const Usuarios = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormInterface>(initialForm);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [changePasswordForm, setChangePasswordForm] = useState<ChangePasswordForm>(initialChangePasswordForm);  

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<DataRow[]>([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isPasswordFormSubmitted, setIsPasswordFormSubmitted] = useState(false);
  const endpoint = "/users/";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
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
      username: row.username,
      password: row.password,
      confirmPassword: row.password,
      name: row.name,
      surname: row.surname,
      email: row.email,
      enabled: row.enabled,
      is_admin: row.is_admin,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: FormInterface) => {
    try {
      const confirmation = await SweetAlert2.confirm("¿Confirmar operación?");
      if (!confirmation.isConfirmed) return;
      setIsFormSubmitted(true);
      
      // Eliminar confirmPassword antes de enviar
      const { confirmPassword, ...dataToSend } = values;
      
      if (editingId) {
        const { data } = await api.put(`${endpoint}`, { ...dataToSend });
        SweetAlert2.successToast(data.message || "¡Actualización exitosa!");
      } else {
        const { id, ...rest } = dataToSend;
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

  const handleChangePassword = (row: DataRow) => {
    setChangePasswordForm({
      id: row._id,
      username: row.username,
      new_password: "",
      new_password_confirmation: "",
    });
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async (values: ChangePasswordForm) => {
    try {
      const confirmation = await SweetAlert2.confirm("¿Confirmar cambio de contraseña?");
      if (!confirmation.isConfirmed) return;
      setIsPasswordFormSubmitted(true);
      
      const payload = {
        id: values.id,
        new_password: values.new_password, 
        new_password_confirmation: values.new_password_confirmation
      };
      
      const { data } = await api.patch(`${endpoint}password`, payload);
      
      SweetAlert2.successToast(data.message || "¡Contraseña actualizada exitosamente!");
      fetch();
      handlePasswordHide();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message || "Error al cambiar contraseña");
    } finally {
      setIsPasswordFormSubmitted(false);
    }
  };

  // CAMBIAR CONTRASEÑA
  const handlePasswordHide = () => {
    setIsPasswordModalOpen(false);
    setChangePasswordForm(initialChangePasswordForm);
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
      name: "NOMBRE DE USUARIO",
      selector: (row: DataRow) => row.username,
    },
    {
      name: "NOMBRE",
      selector: (row: DataRow) => row.name,
    },
    {
      name: "APELLIDO",
      selector: (row: DataRow) => row.surname,
    },
    {
      name: "CORREO ELECTRÓNICO",
      selector: (row: DataRow) => row.email,
    },
    {
          name: "ES ADMIN",
          selector: (row: DataRow) => row.enabled,
          format: (row: DataRow) =>
            row.is_admin ? (
              <span className="badge bg-success">Si</span>
            ) : (
              <span className="badge bg-danger">No</span>
            ),
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
        <ActionUsers
          row={row}
          handleChangePassword={handleChangePassword} 
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ),
    },
  ];

  const handleHide = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleRedirect = (row: DataRow) => {
    navigate(`/usuarios/${row._id}`);
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <BreadcrumbHeader
          section={"usuarios"}
          paths={[{ label: "Listado de usuarios" }]}
        />
        <Button className="py-1" variant="success" onClick={handleCreate}>
          <i className="bi bi-plus-lg me-2"></i>
          <small>Nuevo</small>
        </Button>
      </div>

      <DatatableNoPagination
        columns={columns}
        data={items}
        title="Listado de usuarios"
        loading={loading}
        clickableRows
        onRowClicked={handleRedirect}
      />

      <Modal show={isModalOpen} onHide={handleHide} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? `Modificar usuario` : `Crear usuario`}
          </Modal.Title>
        </Modal.Header>

        <Formik
          // initialValues={{
          //   ...form,
          //   enabled: form.enabled === true ? "true" : form.enabled === false ? "false" : "",
          //   is_admin: form.is_admin === true ? "true" : form.is_admin === false ? "false" : ""
          // }}
          initialValues={{
            ...form,
            enabled: !!form.enabled,
            is_admin: !!form.is_admin
          }}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validationSchema={Yup.object({
            username: Yup.string().required("Este campo es requerido"),
            password: Yup.string()
              .when('_', {
                is: () => !editingId, // Solo validar en creación
                then: schema => schema
                  .required("Este campo es requerido")
                  .min(6, 'La contraseña debe tener al menos 6 caracteres'),
                otherwise: schema => schema.notRequired()
              }),
            confirmPassword: Yup.string()
              .when('_', {
                is: () => !editingId, // Solo validar en creación
                then: schema => schema
                  .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
                  .required('Debe confirmar la contraseña'),
                otherwise: schema => schema.notRequired()
              }),
            name: Yup.string().required("Este campo es requerido"),
            surname: Yup.string().required("Este campo es requerido"),
            email: Yup.string()
              .email("Formato de correo inválido")
              .required("Este campo es requerido"),
            enabled: Yup.boolean(),
            is_admin: Yup.boolean(),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <Modal.Body>
                <Row xs={1} lg={2} className="g-2">
                  <CustomInput.Text
                    isRequired
                    label="Nombre de usuario"
                    name="username"
                    type="text"
                    placeholder="Nombre de usuario"
                    isInvalid={!!errors.username && touched.username}
                  />

                  <CustomInput.Text
                    isRequired
                    label="Nombres"
                    name="name"
                    type="text"
                    placeholder="Nombres"
                    isInvalid={!!errors.name && touched.name}
                  />

                  <CustomInput.Text
                    isRequired
                    label="Apellido"
                    name="surname"
                    type="text"
                    placeholder="Apellido"
                    isInvalid={!!errors.surname && touched.surname}

                  />
                  <CustomInput.Text
                    isRequired
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    placeholder="Correo electrónico"
                    isInvalid={!!errors.email && touched.email}   
                  />
                  {!editingId && (
                    <>
                      <CustomInput.Text
                        isRequired
                        label="Contraseña"
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        isInvalid={!!errors.password && touched.password}
                      />
                      
                      <CustomInput.Text
                        isRequired
                        label="Confirmar contraseña"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirmar contraseña"
                        isInvalid={!!errors.confirmPassword && touched.confirmPassword}
                      />
                    </>
                  )}
                  <CustomInput.Select
                    label="Estado"
                    name="enabled"
                    isInvalid={!!errors.enabled && touched.enabled}
                    isRequired
                  >
                    <option value="">Seleccionar opción</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </CustomInput.Select>
                  <CustomInput.Select
                    label="Es administrador"
                    name="is_admin"
                    isInvalid={!!errors.is_admin && touched.is_admin}
                    isRequired
                  >
                    <option value="">Seleccionar opción</option>
                    <option value="true">Si</option>
                    <option value="false">No</option>
                  </CustomInput.Select>
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
                    {editingId ? `Modificar usuario` : `Crear usuario`}
                  </Button>
                </ButtonGroup>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      
      <Modal show={isPasswordModalOpen} onHide={handlePasswordHide}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar contraseña</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={changePasswordForm}
          onSubmit={(values) => {
            handlePasswordSubmit(values);
          }}
          validationSchema={Yup.object({
            new_password: Yup.string()  // Cambiado de newPassword
              .required("Este campo es requerido")
              .min(6, 'La contraseña debe tener al menos 6 caracteres'),
            new_password_confirmation: Yup.string()  // Cambiado de confirmNewPassword
              .oneOf([Yup.ref('new_password')], 'Las contraseñas no coinciden')
              .required('Debe confirmar la contraseña'),
          })}
        >
          {({ errors, touched, values }) => (
            <Form>
              <Modal.Body>
                <div className="mb-3">
                  <label className="form-label">Usuario</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={values.username} 
                    readOnly 
                  />
                </div>
                <CustomInput.Text
                  isRequired
                  label="Nueva contraseña"
                  name="new_password"
                  type="password"
                  placeholder="Nueva contraseña"
                  isInvalid={!!errors.new_password && touched.new_password}
                />
                <CustomInput.Text
                  isRequired
                  label="Confirmar nueva contraseña"
                  name="new_password_confirmation"
                  type="password"
                  placeholder="Confirmar nueva contraseña"
                  isInvalid={!!errors.new_password_confirmation && touched.new_password_confirmation}
                />
              </Modal.Body>
              <Modal.Footer>
                <ButtonGroup className="d-flex">
                  <Button size="sm" variant="secondary" onClick={handlePasswordHide}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isPasswordFormSubmitted}
                  >
                    <i className="bi bi-person-lock"></i>
                    Cambiar contraseña
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
