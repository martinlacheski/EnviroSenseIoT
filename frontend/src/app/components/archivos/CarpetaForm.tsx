import * as Yup from "yup";
import { useState } from "react";
import { Form, Formik } from "formik";
import { Button, ButtonGroup, Modal } from "react-bootstrap";

import api from "../../../api/api";
import { CustomInput } from "../";
import { CarpetaInterface } from "./interfaces";
import { SweetAlert2 } from "../../utils";

interface CarpetaForm {
  id: string;
  nombre: string;
}

interface Props {
  instance: "personas" | "emprendimientos";
  id_instance: string;

  initialForm: CarpetaForm;
  editing: boolean;

  isModalOpen: boolean;
  handleCloseModal: () => void;

  setCarpetas: React.Dispatch<React.SetStateAction<CarpetaInterface[]>>;
}

export const CarpetaForm = ({
  instance,
  id_instance,

  initialForm,

  editing = false,
  isModalOpen,
  handleCloseModal,
  setCarpetas,
}: Props) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleCarpetaSubmit = async (values: CarpetaForm) => {
    const message = `¿Estás seguro de crear la carpeta "${values.nombre}"?`;
    const confirmation = await SweetAlert2.confirm(message);
    if (!confirmation.isConfirmed) return;
    try {
      setIsFormSubmitted(true);
      if (editing) {
        const { data } = await api.put(
          `/${instance}/carpetas/${initialForm.id}`,
          {
            id_instance,
            ...values,
          }
        );
        console.log(data);
        SweetAlert2.successToast(data.message || "¡Operación exitosa!");
        setCarpetas((prevCarpetas: CarpetaInterface[]) =>
          prevCarpetas.map((carpeta) =>
            carpeta.id === initialForm.id
              ? { ...carpeta, nombre: data.carpeta.nombre }
              : carpeta
          )
        );
      } else {
        const { data } = await api.post(`/${instance}/carpetas`, {
          id_instance,
          ...values,
        });
        SweetAlert2.successToast(data.message || "¡Operación exitosa!");
        setCarpetas((prevCarpetas: CarpetaInterface[]) => {
          const updatedCarpetas = [
            ...prevCarpetas,
            { ...data.carpeta, total_files: 0, total_size: 0 },
          ];
          return updatedCarpetas.sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          );
        });
      }
      handleCloseModal();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response?.data.message);
    } finally {
      setIsFormSubmitted(false);
    }
  };

  const handleCarpetaDelete = async () => {
    const message = `¿Estás seguro de eliminar la carpeta "${initialForm.nombre}"?`;
    const confirmation = await SweetAlert2.confirm(message);
    if (!confirmation.isConfirmed) return;

    try {
      setIsFormSubmitted(true);
      const { data } = await api.delete(
        `/${instance}/carpetas/${initialForm.id}`
      );
      SweetAlert2.successToast(data.message || "¡Operación exitosa!");
      setCarpetas((prevCarpetas: CarpetaInterface[]) =>
        prevCarpetas.filter((carpeta) => carpeta.id !== initialForm.id)
      );
      handleCloseModal();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response?.data.message);
    } finally {
      setIsFormSubmitted(false);
    }
  };

  return (
    <Modal show={isModalOpen} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editing ? "Gestionar carpeta" : "Crear carpeta"}
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={initialForm}
        onSubmit={handleCarpetaSubmit}
        validationSchema={Yup.object({
          nombre: Yup.string()
            .max(40, "El nombre no puede superar los 40 caracteres")
            .required("El nombre de la carpeta es requerido")
            .matches(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ0-9\s]+$/, {
              message: "Solamente puede contener letras, números y espacios",
            }),
        })}
      >
        {({ errors, touched }) => (
          <Form>
            <Modal.Body>
              <CustomInput.Text
                isRequired
                label="Nombre de la carpeta"
                name="nombre"
                placeholder="Proporciona un nombre para la carpeta (documentación, productos, etc.)"
                isInvalid={!!errors.nombre && touched.nombre}
                disabled={isFormSubmitted}
              />
            </Modal.Body>
            <Modal.Footer>
              <ButtonGroup>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCloseModal}
                  disabled={isFormSubmitted}
                >
                  Cancelar
                </Button>
                {editing && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={handleCarpetaDelete}
                    disabled={isFormSubmitted}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Eliminar carpeta
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="primary"
                  type="submit"
                  disabled={isFormSubmitted}
                >
                  <i className="bi bi-floppy me-2"></i>
                  {editing ? "Guardar cambios" : "Crear carpeta"}
                </Button>
              </ButtonGroup>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
