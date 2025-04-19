import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, ButtonGroup, Card, Col, Modal, Row } from "react-bootstrap";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { RootState } from "../../store";
import api from "../../api/api";
import { SweetAlert2 } from "../utils";
import { BreadcrumbHeader, CustomInput, Loading } from "../components";

interface PasswordFormInterface {
  password: string;
  new_password: string;
  new_password_confirm: string;
}

const initialPasswordForm: PasswordFormInterface = {
  password: "",
  new_password: "",
  new_password_confirm: "",
};

export interface UserProfileInterface {
  _id: string;
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
  enabled: boolean;
  is_admin: boolean;
}

const MyAccount = () => {
  const navigate = useNavigate();

  const { user: logged_user } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfileInterface | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      if (!logged_user) return navigate("/");
      const { data } = await api.get("/users/me/");
      setUser(data); // Los datos vienen directamente, no en data.user
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [logged_user]);

  const submitPasswordForm = async (
    values: PasswordFormInterface,
    resetForm: () => void
  ) => {
    if (!user) return;
    const confirmation = await SweetAlert2.confirm("¿Actualizar contraseña?");
    if (!confirmation.isConfirmed) return;
    try {
      setFormSubmitted(true);
      // Adaptar los nombres de campo para que coincidan con el backend
      const requestData = {
        current_password: values.password,
        new_password: values.new_password,
        new_password_confirmation: values.new_password_confirm
      };
      const { data } = await api.patch("/users/change/password", requestData);
      SweetAlert2.successToast(data.message);
      resetForm();
      setShowModal(false);
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    } finally {
      setFormSubmitted(false);
    }
  };

  return (
    <div>
      <BreadcrumbHeader section="cuenta" />

      {loading && <Loading />}
      {!loading && user && (
        <>
          <Card>
            <Card.Header>
              <i className="bi bi-person me-2"></i>
              <span>Información personal</span>
              {user.is_admin && (
                <span className="badge bg-danger ms-2">Administrador</span>
              )}
            </Card.Header>
            <Card.Body className="small py-2">
              <Row className="g-2">
                <Col xs={12} lg={4}>
                  <b>NOMBRES</b>
                </Col>
                <Col xs={12} lg={8}>
                  {user.name}
                </Col>
                <Col xs={12} lg={4}>
                  <b>APELLIDO</b>
                </Col>
                <Col xs={12} lg={8}>
                  {user.surname}
                </Col>
                <Col xs={12} lg={4}>
                  <b>NOMBRE DE USUARIO</b>
                </Col>
                <Col xs={12} lg={8}>
                  {user.username}
                </Col>
                <Col xs={12} lg={4}>
                  <b>CORREO ELECTRÓNICO</b>
                </Col>
                <Col xs={12} lg={8}>
                  {user.email}
                </Col>
                <Col xs={12} lg={4}>
                  <b>ESTADO</b>
                </Col>
                <Col xs={12} lg={8}>
                  {user.enabled ? (
                    <span className="badge bg-success">Activo</span>
                  ) : (
                    <span className="badge bg-danger">Inactivo</span>
                  )}
                </Col>
                <p className="text-muted mb-0">
                  ¿Deseas modificar tu contraseña? Puedes generar una nueva
                  haciendo{" "}
                  <Button
                    variant="link"
                    className="p-0"
                    size="sm"
                    onClick={() => setShowModal(true)}
                  >
                    click aquí.
                  </Button>
                </p>
              </Row>
            </Card.Body>
          </Card>
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            enforceFocus={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Actualizar contraseña</Modal.Title>
            </Modal.Header>
            <Formik
              initialValues={initialPasswordForm}
              onSubmit={(values, { resetForm }) => {
                submitPasswordForm(values, resetForm);
              }}
              validationSchema={Yup.object({
                password: Yup.string().required("La contraseña es requerida"),
                new_password: Yup.string()
                  .required("La nueva contraseña es requerida")
                  .min(6, "Mínimo 6 caracteres"),
                new_password_confirm: Yup.string()
                  .required("Confirmar la nueva contraseña")
                  .oneOf(
                    [Yup.ref("new_password")],
                    "Las contraseñas no coinciden"
                  ),
              })}
            >
              {({ errors, touched }) => (
                <Form id="form">
                  <Modal.Body>
                    <CustomInput.Text
                      type="password"
                      label="Contraseña actual"
                      isRequired
                      isInvalid={!!errors.password && touched.password}
                      name="password"
                      placeholder="Ingrese su contraseña actual"
                      disabled={formSubmitted}
                    />
                    <CustomInput.Text
                      type="password"
                      label="Nueva contraseña"
                      isRequired
                      isInvalid={!!errors.new_password && touched.new_password}
                      name="new_password"
                      placeholder="Ingrese su nueva contraseña"
                      disabled={formSubmitted}
                    />
                    <CustomInput.Text
                      type="password"
                      label="Confirmar nueva contraseña"
                      isRequired
                      isInvalid={
                        !!errors.new_password_confirm &&
                        touched.new_password_confirm
                      }
                      name="new_password_confirm"
                      placeholder="Confirme su nueva contraseña"
                      disabled={formSubmitted}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <ButtonGroup size="sm">
                      <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                        disabled={formSubmitted}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={formSubmitted}
                      >
                        <i className="bi bi-floppy me-2"></i>
                        Actualizar contraseña
                      </Button>
                    </ButtonGroup>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal>
        </>
      )}
    </div>
  );
};

export default MyAccount;