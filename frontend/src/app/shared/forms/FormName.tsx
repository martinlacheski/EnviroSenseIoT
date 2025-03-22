import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { CustomInput } from "../../components";

interface NameInterface {
  name: string;
}

interface FormProps {
  show: boolean;
  onHide: () => void;
  editingId: number | null;
  form: NameInterface;
  onSubmit: (values: any) => void;
  prefix: string;
  title: string;
}

export const ParamForm = ({
  show,
  onHide,
  form,
  editingId,
  onSubmit,
  prefix,
  title,
}: FormProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <div className="p-4">
        <h1 className="fs-5">
          {editingId ? `Modificar ${title}` : `Crear ${title}`}
        </h1>
        <hr className="my-2" />

        <Formik
          initialValues={form}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("El nombre es requerido"),
          })}
        >
          {({ errors, touched }) => (
            <Form id="form">
              <CustomInput.Text
                label={`Nombre ${prefix} ${title}`}
                name="name"
                type="text"
                placeholder={`Ingrese el nombre ${prefix} ${title}`}
                isInvalid={!!errors.name && touched.name}
                isRequired
              />

              <Button
                type="submit"
                variant="primary"
                className="mt-3 float-end"
                size="sm"
              >
                Guardar
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
