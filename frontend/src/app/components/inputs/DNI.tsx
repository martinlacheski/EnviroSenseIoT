import { NumericFormat } from "react-number-format";
import { ErrorMessage } from "formik";
import "./styles.css";
import { Form } from "react-bootstrap";

interface Props {
  label?: string;
  name: string;
  prefix?: string;
  placeholder?: string;
  invalid: 0 | 1;
  isRequired?: boolean;
  align?: "start" | "center" | "end";
  onValueChange?: (value: any) => void;
  [x: string]: any;
}

export const DNI = ({ label, isRequired, onValueChange, ...props }: Props) => {
  return (
    <div>
      {label && (
        <Form.Label htmlFor={props.id || props.name} className="small mb-1">
          {label} {isRequired && <span className="text-danger">*</span>}
        </Form.Label>
      )}

      <NumericFormat
        id={props.name}
        thousandSeparator="."
        decimalSeparator=","
        // decimalScale={0}
        fixedDecimalScale={true}
        className={`form-control form-control-sm text-${props.align || "end"}`}
        autoComplete="off"
        placeholder={props.placeholder}
        prefix={props.prefix}
        {...props}
        onValueChange={onValueChange}
        style={{ border: props.invalid ? "1px solid red" : "" }}
      />

      <ErrorMessage
        name={props.name}
        component="span"
        className="error-message"
      />
    </div>
  );
};
