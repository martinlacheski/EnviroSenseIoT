import { Button, Form, ButtonGroup, Row, Col } from "react-bootstrap";
import { StateReducer, ActionReducer } from "../";

interface FilterByNameProps {
  state: StateReducer<any>;
  dispatch: React.Dispatch<ActionReducer<any>>;
  placeholder: string;
  handleFiltersChange: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleResetFilters: () => Promise<void>;
  handleCreate: () => void;
}

export const FilterByName = ({
  state,
  dispatch,
  placeholder,
  handleFiltersChange,
  handleResetFilters,
  handleCreate,
}: FilterByNameProps) => {
  return (
    <Form onSubmit={(e) => handleFiltersChange(e)} autoComplete="off">
      <Row>
        <Col xl={9} className="mb-3">
          <Form.Control
            name="name"
            autoComplete="off"
            size="sm"
            type="text"
            placeholder={placeholder}
            value={state.filters.name || ""}
            onChange={(e) =>
              dispatch({
                type: "FILTERS_CHANGE",
                newFilters: { ...state.filters, name: e.target.value },
              })
            }
          />
        </Col>
        <Col xl={3} className="mb-3">
          <ButtonGroup size="sm" className="d-flex">
            <Button variant="primary" type="submit">
              Buscar
            </Button>
            <Button variant="secondary" onClick={handleResetFilters}>
              Limpiar
            </Button>
            <Button variant="success" onClick={handleCreate}>
              Nuevo
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form>
  );
};
