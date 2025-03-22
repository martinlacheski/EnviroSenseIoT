import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SweetAlert2 } from "../../utils";
import api from "../../../api/api";
import { Button, Modal, ButtonGroup, Card } from "react-bootstrap";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { BreadcrumbHeader, CustomInput } from "../../components";

interface FormInterface {
  id: string;
  name: string;
  address: string;
  city: string;
  email: string;
  phone: string;
  webpage: string;
  logo: string;
}

const initialForm: FormInterface = {
  id: "",
  name: "",
  address: "",
  city: "",
  email: "",
  phone: "",
  webpage: "",
  logo: "",
};

interface CityInterface {
  _id: string;
  name: string;
  postal_code: string;
  province: {
    id: string;
    name: string;
    country: {
      id: string;
      name: string;
    };
  };
}

export const Empresa = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormInterface>(initialForm);
  const [cities, setCities] = useState<CityInterface[]>([]);
  const [disabledFields, setDisabledFields] = useState(true);
  const endpoint = "/company/";

  // DATOS Y PAGINACIÓN
  const fetch = async () => {
    try {
      const [res1, res2] = await Promise.all([
        api.get("/cities"),
        api.get("/company/"),
      ]);
      setCities(res1.data);
      if (res2.data.length)
        setForm({
          id: res2.data[0]._id,
          name: res2.data[0].name,
          address: res2.data[0].address,
          city: res2.data[0].city.id,
          email: res2.data[0].email,
          phone: res2.data[0].phone,
          webpage: res2.data[0].webpage,
          logo: res2.data[0].logo,
        });
    } catch (error) {
      navigate("/");
      SweetAlert2.errorAlert("Error al cargar los datos");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSubmit = async (values: FormInterface) => {
    try {
      const confirmation = await SweetAlert2.confirm("¿Confirmar operación?");
      if (!confirmation.isConfirmed) return;

      if (values.id) {
        const { data } = await api.put(`${endpoint}`, { ...values });
        SweetAlert2.successToast(data.message || "¡Actualización exitosa!");
      } else {
        const { id, ...rest } = values;
        const { data } = await api.post(endpoint, { ...rest });
        SweetAlert2.successToast(data.message || "¡Creación exitosa!");
      }
      setDisabledFields(true);
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };
  //     const confirmation = await SweetAlert2.confirm(
  //       "¿Está seguro de eliminar este registro?"
  //     );
  //     if (!confirmation.isConfirmed) return;
  //     try {
  //       const { data } = await api.delete(`${endpoint}${row._id}`);
  //       SweetAlert2.successToast(data.message || "¡Eliminación exitosa!");
  //       fetch();
  //     } catch (error: any) {
  //       SweetAlert2.errorAlert(error.response.data.message);
  //     }
  //   };

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <BreadcrumbHeader
          section={"parametros"}
          paths={[{ label: "empresa" }]}
        />
      </div>

      <Card>
        <Card.Header>
          <i className="bi bi-building me-2"></i>
          Información de la empresa
        </Card.Header>
        <Card.Body>
          <Formik
            enableReinitialize
            initialValues={form}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("Este campo es obligatorio"),
              address: Yup.string().required("Este campo es obligatorio"),
              city: Yup.string().required("Este campo es obligatorio"),
              email: Yup.string().email("Correo electrónico inválido"),
              phone: Yup.string().required("Este campo es obligatorio"),
              webpage: Yup.string().url("URL inválida"),
            })}
          >
            {({ errors, touched }) => (
              <Form id="form">
                <Modal.Body className="d-flex flex-column gap-2">
                  <CustomInput.Text
                    isRequired
                    label="Nombre de la empresa"
                    name="name"
                    type="text"
                    placeholder="Ingrese el nombre de la empresa"
                    isInvalid={!!errors.name && touched.name}
                    disabled={disabledFields}
                  />

                  <CustomInput.Text
                    isRequired
                    label="Dirección"
                    name="address"
                    type="text"
                    placeholder="Ingrese la dirección de la empresa"
                    isInvalid={!!errors.address && touched.address}
                    disabled={disabledFields}
                  />

                  <CustomInput.Select
                    label="Ciudad"
                    name="city"
                    isInvalid={!!errors.city && touched.city}
                    isRequired
                    disabled={disabledFields}
                  >
                    <option value="">Seleccione una ciudad</option>
                    {cities.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </CustomInput.Select>

                  <CustomInput.Text
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    placeholder="Ingrese el correo electrónico de la empresa"
                    isInvalid={!!errors.email && touched.email}
                    disabled={disabledFields}
                  />

                  <CustomInput.Text
                    isRequired
                    label="Teléfono"
                    name="phone"
                    type="text"
                    placeholder="Ingrese el teléfono de la empresa"
                    isInvalid={!!errors.phone && touched.phone}
                    disabled={disabledFields}
                  />

                  <CustomInput.Text
                    label="Página web"
                    name="webpage"
                    type="text"
                    placeholder="Ingrese la página web de la empresa"
                    isInvalid={!!errors.webpage && touched.webpage}
                    disabled={disabledFields}
                  />
                </Modal.Body>

                <Modal.Footer>
                  <ButtonGroup className="d-flex">
                    {disabledFields ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="mt-3"
                        onClick={() => setDisabledFields(false)}
                      >
                        <i className="bi bi-pencil me-2"></i>
                        Editar
                      </Button>
                    ) : (
                      <ButtonGroup className="d-flex mt-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setDisabledFields(true);
                            // setForm(initialForm);
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" variant="primary" size="sm">
                          Guardar
                        </Button>
                      </ButtonGroup>
                    )}
                  </ButtonGroup>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Fragment>
  );
};
