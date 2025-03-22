import Select, { SingleValue } from "react-select";
import styles from './Select2Formik.module.css';
import { ErrorMessage, useField, useFormikContext } from "formik";

interface OptionType {
  id: string;
  label: string;
}

interface Props {
  label?: string;
  name: string;
  placeholder?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  options: OptionType[];
  [x: string]: any;
}

export const Select2Formik = ({
  label,
  isRequired,
  options,
  ...props
}: Props) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(props);

  const customStyles = {
    control: (provided: any, _state: any) => ({
      ...provided,
      height: "31.2px",
      minHeight: "31.2px",
      border:
        meta.touched && meta.error ? "1px solid #dc3545" : "1px solid #ced4da",
      borderRadius: "0.25rem",
      fontSize: "0.85rem",
      display: "flex",
    }),
    menu: (provided: any, _state: any) => ({
      ...provided,
      fontSize: "0.85rem",
    }),
  };

  return (
    <div>
      {label && (
        <span className="small mb-1">
          {label} {isRequired && <span className="text-danger">*</span>}
        </span>
      )}

      <Select
        id={props.name}
        className={styles.customSelect2}
        options={options}
        styles={customStyles}
        getOptionValue={(option) => option.id}
        getOptionLabel={(option) => option.label}
        onChange={(option: SingleValue<OptionType>) => {
          setFieldValue(field.name, option ? option.id : "");
          setFieldTouched(field.name, true); // Marcar el campo como tocado
        }}
        onBlur={() => field.onBlur(props.name)}
        placeholder="Seleccione una opción"
        value={options.find((option) => option.id === field.value) || null}
        {...props}
      />

      <ErrorMessage
        name={props.name}
        component="span"
        className="error-message"
      />
    </div>
  );
};
