import { ErrorMessage, useField } from "formik";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import "./styles.css";
import { InputGroup } from "react-bootstrap";

interface Props {
  label?: string;
  name: string;
  placeholder?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  [x: string]: any;
}

export const Password = ({ label, isRequired, ...props }: Props) => {
  const [field] = useField(props);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="mb-2">
      {label && (
        <Form.Label htmlFor={props.id || props.name} className="small mb-1">
          {label} {isRequired && <span className="text-danger">*</span>}
        </Form.Label>
      )}

      <InputGroup size="sm">
        <Form.Control
          id={props.name}
          autoComplete="off"
          {...field}
          {...props}
          type={showPassword ? "text" : "password"}
          isInvalid={props.isInvalid}
          size="sm"
        />
        <InputGroup.Text
          onClick={togglePasswordVisibility}
          style={{ cursor: "pointer" }}
        >
          {showPassword ? (
            <i className="bi bi-eye-slash"></i>
          ) : (
            <i className="bi bi-eye"></i>
          )}
        </InputGroup.Text>
      </InputGroup>

      <ErrorMessage
        name={props.name}
        component="span"
        className="error-message"
      />
    </div>
  );
};
