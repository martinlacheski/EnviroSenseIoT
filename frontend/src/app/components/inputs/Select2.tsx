import Select from "react-select";

import "./styles.css";

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

export const Select2 = ({ label, isRequired, ...props }: Props) => {
  return (
    <div>
      <label htmlFor={props.name} className="form-label" hidden>
        {props.name}
      </label>
      <Select
        id={props.name}
        placeholder="Seleccione una opción"
        styles={{
          control: (_provided, _state) => ({
            height: "34px",
            minHeight: "34px",
            border: "1px solid #ced4da",
            borderRadius: "0.25rem",
            fontSize: "0.9rem",
            display: "flex",
          }),
          menu: (provided, _state) => ({
            ...provided,
            fontSize: "0.9rem",
          }),
        }}
        getOptionValue={(option) => option.id}
        {...props}
      />
    </div>
  );
};
