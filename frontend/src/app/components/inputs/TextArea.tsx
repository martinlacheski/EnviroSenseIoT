import { ErrorMessage, useField } from "formik";
import Form from "react-bootstrap/Form";
import "./styles.css";

interface Props {
  label?: string;
  name: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  isInvalid?: boolean;
  isRequired?: boolean;
  [x: string]: any;
}

export const TextArea = ({ label, isRequired, ...props }: Props) => {
  const [field] = useField(props);

  return (
    <div>
      {label && (
        <Form.Label htmlFor={props.id || props.name} className="small mb-1">
          {label} {isRequired && <span className="text-danger">*</span>}
        </Form.Label>
      )}

      <Form.Control
        id={props.name}
        as="textarea"
        autoComplete="off"
        {...field}
        {...props}
        isInvalid={props.isInvalid}
        size="sm"
      />

      <ErrorMessage
        name={props.name}
        component="span"
        className="error-message"
      />
    </div>
  );
};
