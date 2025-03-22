import { Fragment, useEffect } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Image,
  Container,
  InputGroup,
} from "react-bootstrap";
import { useForm } from "../hooks/useForm";
import { useAuthStore } from "../../hooks";

import "./LoginPage.css";
import { SweetAlert2 } from "../../app/utils";

export const LoginPage = () => {
  const { startLogin, errorMessage } = useAuthStore();

  const initialForm = { username: "", password: "" };
  const { username, password, onChange } = useForm(initialForm);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === "" || password === "") return;
    startLogin({ username, password });
  };

  useEffect(() => {
    if (errorMessage) {
      SweetAlert2.customDialog("info", errorMessage);
    }
  }, [errorMessage]);

  return (
    <Fragment>
      <Row className="div-centered div-100h mx-0 bg-melamina">
        <Col xs={12} md={6} xl={6} className="rounded">
          <Container>
            {/* LOGO */}
            <Container className="div-centered">
              <div className="text-center">
                <Image
                  src="/logo-pc-texto.png"
                  fluid
                  style={{ maxHeight: "200px" }}
                />
                <h1 className="fs-5 fw-bold text-center my-4 text-uppercase">
                  Control del clima en invernaderos
                </h1>
              </div>
            </Container>

            {/* FORM */}
            <Container fluid className="px-4 mt-4">
              <Form onSubmit={handleSubmit} autoComplete="off">
                <Row>
                  <Col xs={0} xl={2} />
                  <Col xs={12} xl={8}>
                    <Row className="g-3">
                      <Col xs={12}>
                        <InputGroup>
                          <InputGroup.Text>
                            <i className="bi bi-person"></i>
                          </InputGroup.Text>
                          <Form.Control
                            size="sm"
                            name="username"
                            type="text"
                            placeholder="Ingrese su usuario"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.6)",
                            }}
                            value={username}
                            onChange={onChange}
                            autoComplete="off"
                          />
                        </InputGroup>
                      </Col>
                      <Col xs={12}>
                        <InputGroup>
                          <InputGroup.Text>
                            <i className="bi bi-key"></i>
                          </InputGroup.Text>
                          <Form.Control
                            size="sm"
                            name="password"
                            type="password"
                            placeholder="Ingrese su contraseña"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.6)",
                            }}
                            value={password}
                            onChange={onChange}
                            autoComplete="off"
                          />
                        </InputGroup>
                      </Col>
                      <Col xs={12}>
                        <Button
                          type="submit"
                          className="w-100 border-0 text-uppercase"
                          title="Ingresar al sistema"
                          variant="dark"
                        >
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Ingresar
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={0} xl={2} />
                </Row>
              </Form>
            </Container>
          </Container>
        </Col>
      </Row>
    </Fragment>
  );
};
