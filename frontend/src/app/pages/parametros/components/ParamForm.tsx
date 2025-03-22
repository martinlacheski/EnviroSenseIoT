import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { CustomInput } from "../../../components";

interface ParamFormInterface {
  name: string;
}

interface FormProps {
  show: boolean;
  onHide: () => void;
  editingId: string | null;
  form: ParamFormInterface;
  onSubmit: (values: any) => void;
  prefix: string;
  title: string;
  isFormSubmitted: boolean;
}

export const ParamForm = ({
  show,
  onHide,
  form,
  editingId,
  onSubmit,
  prefix,
  title,
  isFormSubmitted,
}: FormProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingId ? `Modificar ${title}` : `Crear ${title}`}
        </Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={form}
        onSubmit={(values) => {
          onSubmit(values);
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .min(3, "El nombre debe tener como mínimo 3 caracteres")
            .required("El nombre es requerido"),
        })}
      >
        {({ errors, touched }) => (
          <Form id="form">
            <Modal.Body>
              <CustomInput.Text
                type="text"
                name="name"
                label={`Nombre ${prefix} ${title}`}
                placeholder={`Ingrese el nombre ${prefix} ${title}`}
                isInvalid={!!errors.name && touched.name}
                isRequired
                disabled={isFormSubmitted}
              />
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="submit"
                variant="primary"
                className=" float-end"
                size="sm"
                disabled={isFormSubmitted}
              >
                <i className="bi bi-floppy me-2"></i>
                {editingId ? `Modificar ${title}` : `Crear ${title}`}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
