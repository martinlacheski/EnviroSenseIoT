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
import { EnvironmentalDataRow } from "./interfaces";
import api from "../../../api/api";
import { DateFormatter } from "../../helpers";
import { LineChartComponent } from "../dashboard/charts";

type TimeSeriesValue = { timestamp: string; value: number };

export const Ambientales = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [perPage] = useState(20);
  const [state, dispatch] = useReducer(paginationReducer, {
    ...initialState,
    perPage,
  });
  const endpoint = "/sensors/environmental/data/";

  // PARÁMETROS
  const [sensores, setSensores] = useState([]);
  const [valsTemperatura, setValsTemperatura] = useState<TimeSeriesValue[]>([]);
  const [valsHumedad, setValsHumedad] = useState<TimeSeriesValue[]>([]);
  const [valsPresion, setValsPresion] = useState<TimeSeriesValue[]>([]);
  const [valsCo2, setValsCo2] = useState<TimeSeriesValue[]>([]);
  const [valsLuminosidad, setValsLuminosidad] = useState<TimeSeriesValue[]>([]);
  const [view, setView] = useState<"table" | "chart">("table");

  // DATOS Y PAGINACIÓN
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/sensors/environmental");
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
      const data: EnvironmentalDataRow[] = state.data as EnvironmentalDataRow[];
      setValsTemperatura(
        data.map((item) => ({
          timestamp: item.datetime,
          value: item.temperature,
        }))
      );
      setValsHumedad(
        data.map((item) => ({
          timestamp: item.datetime,
          value: item.humidity,
        }))
      );
      setValsPresion(
        data.map((item) => ({
          timestamp: item.datetime,
          value: item.atmospheric_pressure,
        }))
      );
      setValsCo2(
        data.map((item) => ({
          timestamp: item.datetime,
          value: item.co2,
        }))
      );
      setValsLuminosidad(
        data.map((item) => ({
          timestamp: item.datetime,
          value: item.luminosity,
        }))
      );
    } else {
      setValsTemperatura([]);
      setValsHumedad([]);
      setValsPresion([]);
      setValsCo2([]);
      setValsLuminosidad([]);
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
  const columns: TableColumn<EnvironmentalDataRow>[] = useMemo(
    () => [
      {
        name: "FECHA",
        selector: (row: EnvironmentalDataRow) => row.datetime,
        format: (row: EnvironmentalDataRow) =>
          DateFormatter.toDDmmYYYYhhMM(row.datetime),
        width: "150px",
      },
      {
        name: "TEMPERATURA",
        selector: (row: EnvironmentalDataRow) => `${row.temperature} °C`,
      },
      {
        name: "HUMEDAD",
        selector: (row: EnvironmentalDataRow) => `${row.humidity} %`,
      },
      {
        name: "PRESIÓN ATMOSFÉRICA",
        selector: (row: EnvironmentalDataRow) =>
          `${row.atmospheric_pressure} hPa`,
      },
      {
        name: "CO2",
        selector: (row: EnvironmentalDataRow) => `${row.co2} ppm`,
      },
      {
        name: "LUMINOSIDAD",
        selector: (row: EnvironmentalDataRow) => `${row.luminosity} lux`,
      },
    ],
    []
  );

  return (
    <div>
      <BreadcrumbHeader
        section="reportes"
        paths={[{ label: "Sensores ambientales" }]}
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
                        <option value="">Agregación</option>
                        <option value="1m">1 minuto</option>
                        <option value="5m">5 minutos</option>
                        <option value="15m">15 minutos</option>
                        <option value="30m">30 minutos</option>
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
              title="Reporte de sensores ambientales"
              columns={columns as TableColumn<EnvironmentalDataRow>[]}
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
                Reporte de sensores ambientales (gráficos)
              </p>
              <Col lg={6}>
                <LineChartComponent
                  name="Temperatura (°C)"
                  data={valsTemperatura}
                  domain={[0, 50]}
                  unit="°C"
                  height={300}
                />
              </Col>
              <Col lg={6}>
                <LineChartComponent
                  name="Humedad (%)"
                  data={valsHumedad}
                  domain={[0, 100]}
                  unit="%"
                  height={300}
                />
              </Col>
              <Col lg={6} xl={4}>
                <LineChartComponent
                  name="Presión atmosférica (hPa)"
                  data={valsPresion}
                  domain={[900, 1100]}
                  height={300}
                />
              </Col>
              <Col lg={6} xl={4}>
                <LineChartComponent
                  name="CO2 (ppm)"
                  data={valsCo2}
                  height={300}
                />
              </Col>
              <Col lg={6} xl={4}>
                <LineChartComponent
                  name="Luminosidad (lux)"
                  data={valsLuminosidad}
                  height={300}
                />
              </Col>
            </Row>
          )}
        </Fragment>
      )}
    </div>
  );
};
