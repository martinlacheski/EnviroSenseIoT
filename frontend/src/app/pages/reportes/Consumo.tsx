import {
  Button,
  ButtonGroup,
  Col,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { Fragment, useEffect, useMemo, useReducer, useState } from "react";
import { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";

import {
  Datatable,
  initialState,
  paginationReducer,
  fetchData,
  resetData,
} from "../../shared";
import { BreadcrumbHeader, Loading } from "../../components";
import { ConsumptionDataRow } from "./interfaces";
import api from "../../../api/api";
import { DateFormatter } from "../../helpers";
import {
  LineChartComponent,
  MultiLineChartComponent,
} from "../dashboard/charts";

type TimeSeriesValue = { timestamp: string; value: number };
type ConsumptionsLevelSeriesValue = {
  timestamp: string;
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
  value6: number;
};

export const Consumo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [perPage] = useState(20);
  const [state, dispatch] = useReducer(paginationReducer, {
    ...initialState,
    perPage,
  });
  const endpoint = "/sensors/consumption/data/";

  // PARÁMETROS
  const [sensores, setSensores] = useState([]);
  const [valVoltage, setValVoltage] = useState<TimeSeriesValue[]>([]);
  const [valCurrent, setValCurrent] = useState<TimeSeriesValue[]>([]);
  const [valPower, setValPower] = useState<TimeSeriesValue[]>([]);
  const [valEnergy, setValEnergy] = useState<TimeSeriesValue[]>([]);
  const [valNutrients, setValNutrients] = useState<
    ConsumptionsLevelSeriesValue[]
  >([]);
  const [view, setView] = useState<"table" | "chart">("table");

  // DATOS Y PAGINACIÓN
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/sensors/consumption");
        setSensores(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        navigate("/");
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (state.data.length > 0 && state.data.length <= 50) {
      const data: ConsumptionDataRow[] = state.data as ConsumptionDataRow[];
      const voltage = data.map((item: ConsumptionDataRow) => ({
        timestamp: item.datetime,
        value: item.voltage,
      }));
      const current = data.map((item: ConsumptionDataRow) => ({
        timestamp: item.datetime,
        value: item.current,
      }));
      const power = data.map((item: ConsumptionDataRow) => ({
        timestamp: item.datetime,
        value: item.power,
      }));
      const energy = data.map((item: ConsumptionDataRow) => ({
        timestamp: item.datetime,
        value: item.energy,
      }));
      const nutrients = data.map((item: ConsumptionDataRow) => ({
        timestamp: item.datetime,
        value1: item.nutrient_1_level,
        value2: item.nutrient_2_level,
        value3: item.nutrient_3_level,
        value4: item.nutrient_4_level,
        value5: item.nutrient_5_level,
        value6: item.nutrient_6_level,
      }));
      setValVoltage(voltage);
      setValCurrent(current);
      setValPower(power);
      setValEnergy(energy);
      setValNutrients(nutrients);
    } else {
      setValVoltage([]);
      setValCurrent([]);
      setValPower([]);
      setValEnergy([]);
      setValNutrients([]);
    }
  }, [state.data]);

  const handlePageChange = async (page: number) => {
    dispatch({ type: "PAGE_CHANGE", page });
    fetchData(endpoint, page, state, dispatch);
  };

  const handleRowsPerPageChange = async (newPerPage: number, page: number) => {
    dispatch({ type: "ROWS_PER_PAGE_CHANGE", newPerPage, page });
    fetchData(endpoint, page, { ...state, perPage: newPerPage }, dispatch);
  };

  const handleFiltersChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "FILTERS_CHANGE", newFilters: state.filters });
    fetchData(endpoint, 1, state, dispatch);
  };

  const handleResetFilters = async () => {
    dispatch({ type: "RESET_FILTERS" });
    resetData(dispatch);
  };

  useEffect(() => {
    if (state.error) {
      navigate("/");
    }
  }, [state.error]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    dispatch({
      type: "FILTERS_CHANGE",
      newFilters: { ...state.filters, [e.target.name]: e.target.value },
    });
  };

  // COLUMNAS Y RENDERIZADO
  const columns: TableColumn<ConsumptionDataRow>[] = useMemo(
    () => [
      {
        name: "FECHA",
        selector: (row: ConsumptionDataRow) => row.datetime,
        format: (row: ConsumptionDataRow) =>
          DateFormatter.toDDmmYYYYhhMM(row.datetime),
        width: "150px",
      },
      {
        name: "VOLTAJE",
        selector: (row: ConsumptionDataRow) => `${row.voltage} V`,
      },
      {
        name: "CORRIENTE",
        selector: (row: ConsumptionDataRow) => `${row.current} A`,
      },
      {
        name: "POTENCIA",
        selector: (row: ConsumptionDataRow) => `${row.power} W`,
      },
      {
        name: "ENERGÍA",
        selector: (row: ConsumptionDataRow) => `${row.energy} kWh`,
      },
      {
        name: "NIVEL NUT. 1",
        selector: (row: ConsumptionDataRow) => `${row.nutrient_1_level} cm`,
      },
      {
        name: "NIVEL NUT. 2",
        selector: (row: ConsumptionDataRow) => `${row.nutrient_2_level} cm`,
      },
      {
        name: "NIVEL NUT. 3",
        selector: (row: ConsumptionDataRow) => `${row.nutrient_3_level} cm`,
      },
      {
        name: "NIVEL NUT. 4",
        selector: (row: ConsumptionDataRow) => `${row.nutrient_4_level} cm`,
      },
      {
        name: "NIVEL NUT. 5",
        selector: (row: ConsumptionDataRow) => `${row.nutrient_5_level} cm`,
      },
      {
        name: "NIVEL NUT. 6",
        selector: (row: ConsumptionDataRow) => `${row.nutrient_6_level} cm`,
      },
    ],
    []
  );

  return (
    <div>
      <BreadcrumbHeader
        section="reportes"
        paths={[{ label: "Sensores de consumo" }]}
      />

      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <Form onSubmit={(e) => handleFiltersChange(e)} className="my-3">
            <Row className="g-3">
              <Col xl={9}>
                <Row className="g-3">
                  <Col xl={5}>
                    <InputGroup size="sm">
                      <InputGroup.Text>
                        <i className="bi bi-cpu me-2"></i>
                        Sensor
                      </InputGroup.Text>
                      <Form.Select
                        name="sensor_code"
                        autoComplete="off"
                        size="sm"
                        value={state.filters.sensor_code || ""}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccione un sensor</option>
                        {sensores.map((sensor: any) => (
                          <option key={sensor.id} value={sensor.sensor_code}>
                            {sensor.sensor_code} — {sensor.description}
                          </option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                  </Col>
                  <Col xl={5}>
                    <InputGroup size="sm">
                      <InputGroup.Text title="Fecha desde">
                        <i className="bi bi-calendar me-2"></i>
                        Rango
                      </InputGroup.Text>
                      <Form.Control
                        title="Fecha desde"
                        name="start_date"
                        type="datetime-local"
                        value={state.filters.start_date || ""}
                        onChange={handleInputChange}
                        required
                      />

                      <Form.Control
                        title="Fecha hasta"
                        name="end_date"
                        type="datetime-local"
                        value={state.filters.end_date || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </InputGroup>
                  </Col>

                  <Col xl={2}>
                    <InputGroup size="sm">
                      <InputGroup.Text>
                        <i className="bi bi-filter"></i>
                      </InputGroup.Text>
                      <Form.Select
                        name="aggregation"
                        autoComplete="off"
                        size="sm"
                        value={state.filters.aggregation || ""}
                        onChange={handleInputChange}
                        required
                      >
                        {/* <option value="">Agregación</option> */}
                        <option value="1m">1 minuto</option>
                        <option value="5m">5 minutos</option>
                        <option value="15m">15 minutos</option>
                        <option value="1h">1 hora</option>
                        <option value="2h">2 horas</option>
                      </Form.Select>
                    </InputGroup>
                  </Col>
                </Row>
              </Col>

              <Col xl={3}>
                <ButtonGroup size="sm" className="d-flex">
                  <Button variant="primary" type="submit">
                    Buscar
                  </Button>
                  <Button variant="secondary" onClick={handleResetFilters}>
                    Limpiar
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() =>
                      setView(view === "table" ? "chart" : "table")
                    }
                  >
                    {view === "table" ? (
                      <i className="bi bi-graph-up-arrow"></i>
                    ) : (
                      <i className="bi bi-table"></i>
                    )}
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Form>

          {view === "table" ? (
            <Datatable
              title="Reporte de sensores de consumo"
              columns={columns as TableColumn<ConsumptionDataRow>[]}
              data={state.data}
              loading={state.loading}
              totalRows={state.totalRows}
              handleRowsPerPageChange={handleRowsPerPageChange}
              handlePageChange={handlePageChange}
              perPage={perPage}
            />
          ) : (
            <Row className="g-3 border mx-0 mt-3 rounded">
              <p className="mx-3 mb-0 fw-bold fs-5">
                Reporte de sensores de consumo (gráficos)
              </p>
              <Col lg={6} xl={3}>
                <LineChartComponent
                  name="Voltaje (V)"
                  data={valVoltage}
                  domain={[80, 260]}
                  height={300}
                  unit="V"
                />
              </Col>
              <Col lg={6} xl={3}>
                <LineChartComponent
                  name="Corriente (A)"
                  data={valCurrent}
                  domain={[0, 20]}
                  height={300}
                  unit="A"
                />
              </Col>
              <Col lg={6} xl={3}>
                <LineChartComponent
                  name="Potencia (W)"
                  data={valPower}
                  domain={[0, 5000]}
                  height={300}
                  unit="W"
                />
              </Col>
              <Col lg={6} xl={3}>
                <LineChartComponent
                  name="Energía (kWh)"
                  data={valEnergy}
                  domain={[0, 10000]}
                  height={300}
                />
              </Col>
              <Col>
                <MultiLineChartComponent
                  data={valNutrients || []}
                  unit="cm"
                  series={[
                    { name: "Nutr. 1", dataKey: "value1" },
                    { name: "Nutr. 2", dataKey: "value2" },
                    { name: "Nutr. 3", dataKey: "value3" },
                    { name: "Nutr. 4", dataKey: "value4" },
                    { name: "Nutr. 5", dataKey: "value5" },
                    { name: "Nutr. 6", dataKey: "value6" },
                  ]}
                  tickCount={10}
                  domain={[0, 200]}
                  height={350}
                />
              </Col>
            </Row>
          )}
        </Fragment>
      )}
    </div>
  );
};
