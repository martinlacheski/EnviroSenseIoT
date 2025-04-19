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
import { ActuadorDataRow } from "./interfaces";
import api from "../../../api/api";
import { DateFormatter } from "../../helpers";
import { MultiAxisLineChartComponent } from "../dashboard/charts";

interface Series {
  name: string;
  dataKey: string;
  color?: string;
  yAxisId?: "left" | "right"; // por defecto será 'left'
}
const series: Series[] = [
  { name: "Veces", dataKey: "value", yAxisId: "left", color: "#ff7300" },
  { name: "Tiempo (s)", dataKey: "value2", yAxisId: "right", color: "#8884d8" },
];

type CombinedSeriesValue = { timestamp: string; value: number; value2: number };

export const Actuadores = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [perPage] = useState(20);
  const [state, dispatch] = useReducer(paginationReducer, {
    ...initialState,
    perPage,
  });
  const endpoint = "/actuators/data/";

  // PARÁMETROS
  const [actuadores, setActuadores] = useState([]);
  const [waterData, setWaterData] = useState<CombinedSeriesValue[]>([]);
  const [ventData, setVentData] = useState<CombinedSeriesValue[]>([]);
  const [lightData, setLightData] = useState<CombinedSeriesValue[]>([]);
  const [aeratorData, setAeratorData] = useState<CombinedSeriesValue[]>([]);
  const [phPlusData, setPhPlusData] = useState<CombinedSeriesValue[]>([]);
  const [phMinusData, setPhMinusData] = useState<CombinedSeriesValue[]>([]);
  const [nutri1Data, setNutri1Data] = useState<CombinedSeriesValue[]>([]);
  const [nutri2Data, setNutri2Data] = useState<CombinedSeriesValue[]>([]);
  const [nutri3Data, setNutri3Data] = useState<CombinedSeriesValue[]>([]);
  const [nutri4Data, setNutri4Data] = useState<CombinedSeriesValue[]>([]);
  const [view, setView] = useState<"table" | "chart">("table");

  // DATOS Y PAGINACIÓN
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/actuators/");
        setActuadores(data);
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
      const data: ActuadorDataRow[] = state.data as ActuadorDataRow[];
      const waterData: CombinedSeriesValue[] = [];
      const ventData: CombinedSeriesValue[] = [];
      const lightData: CombinedSeriesValue[] = [];
      const aeratorData: CombinedSeriesValue[] = [];
      const phPlusData: CombinedSeriesValue[] = [];
      const phMinusData: CombinedSeriesValue[] = [];
      const nutri1Data: CombinedSeriesValue[] = [];
      const nutri2Data: CombinedSeriesValue[] = [];
      const nutri3Data: CombinedSeriesValue[] = [];
      const nutri4Data: CombinedSeriesValue[] = [];

      data.forEach((row: ActuadorDataRow) => {
        waterData.push({
          timestamp: row.datetime,
          value: row.relay_water_count,
          value2: row.relay_water_time,
        });
        ventData.push({
          timestamp: row.datetime,
          value: row.relay_vent_count,
          value2: row.relay_vent_time,
        });
        lightData.push({
          timestamp: row.datetime,
          value: row.relay_light_count,
          value2: row.relay_light_time,
        });
        aeratorData.push({
          timestamp: row.datetime,
          value: row.relay_aerator_count,
          value2: row.relay_aerator_time,
        });
        phPlusData.push({
          timestamp: row.datetime,
          value: row.relay_ph_plus_count,
          value2: row.relay_ph_plus_time,
        });
        phMinusData.push({
          timestamp: row.datetime,
          value: row.relay_ph_minus_count,
          value2: row.relay_ph_minus_time,
        });
        nutri1Data.push({
          timestamp: row.datetime,
          value: row.relay_nutri_1_count,
          value2: row.relay_nutri_1_time,
        });
        nutri2Data.push({
          timestamp: row.datetime,
          value: row.relay_nutri_2_count,
          value2: row.relay_nutri_2_time,
        });
        nutri3Data.push({
          timestamp: row.datetime,
          value: row.relay_nutri_3_count,
          value2: row.relay_nutri_3_time,
        });
        nutri4Data.push({
          timestamp: row.datetime,
          value: row.relay_nutri_4_count,
          value2: row.relay_nutri_4_time,
        });
      });
      setWaterData(waterData);
      setVentData(ventData);
      setLightData(lightData);
      setAeratorData(aeratorData);
      setPhPlusData(phPlusData);
      setPhMinusData(phMinusData);
      setNutri1Data(nutri1Data);
      setNutri2Data(nutri2Data);
      setNutri3Data(nutri3Data);
      setNutri4Data(nutri4Data);
    } else {
      setWaterData([]);
      setVentData([]);
      setLightData([]);
      setAeratorData([]);
      setPhPlusData([]);
      setPhMinusData([]);
      setNutri1Data([]);
      setNutri2Data([]);
      setNutri3Data([]);
      setNutri4Data([]);
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

  const getSpan = (count: number, time: number) => {
    if (count > 0) {
      return (
        <span>
          Cant: {count} — {time}s
        </span>
      );
    } else {
      return <span className="text-secondary">—</span>;
    }
  };

  // COLUMNAS Y RENDERIZADO
  const columns: TableColumn<ActuadorDataRow>[] = useMemo(
    () => [
      {
        name: "FECHA",
        selector: (row: ActuadorDataRow) => row.datetime,
        format: (row: ActuadorDataRow) =>
          DateFormatter.toDDmmYYYYhhMM(row.datetime),
        width: "150px",
      },
      {
        name: "RELAY AGUA",
        selector: (row: ActuadorDataRow) => row.relay_water_count,
        format: (row: ActuadorDataRow) =>
          getSpan(row.relay_water_count, row.relay_water_time),
      },
      {
        name: "RELAY VENTILACIÓN",
        selector: (row: ActuadorDataRow) => row.relay_vent_count,
        format: (row: ActuadorDataRow) =>
          getSpan(row.relay_vent_count, row.relay_vent_time),
      },
      {
        name: "RELAY ILUMINACIÓN",
        selector: (row: ActuadorDataRow) => row.relay_light_count,
        format: (row: ActuadorDataRow) =>
          getSpan(row.relay_light_count, row.relay_light_time),
      },
      {
        name: "RELAY AIREACIÓN",
        selector: (row: ActuadorDataRow) => row.relay_aerator_count,
        format: (row: ActuadorDataRow) =>
          getSpan(row.relay_aerator_count, row.relay_aerator_time),
      },
      {
        name: "RELAY PH+",
        selector: (row: ActuadorDataRow) => row.relay_ph_plus_count,
        format: (row: ActuadorDataRow) =>
          getSpan(row.relay_ph_plus_count, row.relay_ph_plus_time),
      },
      {
        name: "RELAY PH-",
        selector: (row: ActuadorDataRow) => row.relay_ph_minus_count,
        format: (row: ActuadorDataRow) =>
          getSpan(row.relay_ph_minus_count, row.relay_ph_minus_time),
      },
      {
        name: "RELAY NUTR. 1",
        selector: (row: ActuadorDataRow) => row.relay_nutri_1_count,
        format: (row: ActuadorDataRow) =>
          getSpan(row.relay_nutri_1_count, row.relay_nutri_1_time),
      },
      {
        name: "RELAY NUTR. 2",
        selector: (row: ActuadorDataRow) => row.relay_nutri_2_count,
        format: (row: ActuadorDataRow) =>
          getSpan(row.relay_nutri_2_count, row.relay_nutri_2_time),
      },
      {
        name: "RELAY NUTR. 3",
        selector: (row: ActuadorDataRow) => row.relay_nutri_3_count,
        format: (row: ActuadorDataRow) =>
          getSpan(row.relay_nutri_3_count, row.relay_nutri_3_time),
      },
      {
        name: "RELAY NUTR. 4",
        selector: (row: ActuadorDataRow) => row.relay_nutri_4_count,
        format: (row: ActuadorDataRow) =>
          getSpan(row.relay_nutri_4_count, row.relay_nutri_4_time),
      },
    ],
    []
  );

  return (
    <div>
      <BreadcrumbHeader section="reportes" paths={[{ label: "Actuadores" }]} />

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
                        Actuador
                      </InputGroup.Text>
                      <Form.Select
                        name="actuator_code"
                        autoComplete="off"
                        size="sm"
                        value={state.filters.actuator_code || ""}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccione un actuador</option>
                        {actuadores.map((sensor: any) => (
                          <option key={sensor.id} value={sensor.actuator_code}>
                            {sensor.actuator_code} — {sensor.description}
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
              title="Reporte de actuadores"
              columns={columns as TableColumn<ActuadorDataRow>[]}
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
                Reporte de actuadores (gráficos)
              </p>
              <Col lg={6} xl={3}>
                <MultiAxisLineChartComponent
                  title="Relay Agua"
                  data={waterData}
                  series={series}               
                  height={200}
                />
              </Col>
              <Col lg={6} xl={3}>
                <MultiAxisLineChartComponent
                  title="Relay Ventilación"
                  data={ventData}
                  series={series}               
                  height={200}
                />
              </Col>
              <Col lg={6} xl={3}>
                <MultiAxisLineChartComponent
                  title="Relay Iluminación"
                  data={lightData}
                  series={series}               
                  height={200}
                />
              </Col>
              <Col lg={6} xl={3}>
                <MultiAxisLineChartComponent
                  title="Relay Aireación"
                  data={aeratorData}
                  series={series}               
                  height={200}
                />
              </Col>
              <Col lg={6}>
                <MultiAxisLineChartComponent
                  title="Relay PH+"
                  data={phPlusData}
                  series={series}               
                  height={200}
                />
              </Col>
              <Col lg={6}>
                <MultiAxisLineChartComponent
                  title="Relay PH-"
                  data={phMinusData}
                  series={series}               
                  height={200}
                />
              </Col>
              <Col lg={6} xl={3}>
                <MultiAxisLineChartComponent
                  title="Relay Nutriente 1"
                  data={nutri1Data}
                  series={series}               
                  height={200}
                />
              </Col>
              <Col lg={6} xl={3}>
                <MultiAxisLineChartComponent
                  title="Relay Nutriente 2"
                  data={nutri2Data}
                  series={series}               
                  height={200}
                />
              </Col>
              <Col lg={6} xl={3}>
                <MultiAxisLineChartComponent
                  title="Relay Nutriente 3"
                  data={nutri3Data}
                  series={series}               
                  height={200}
                />
              </Col>
              <Col lg={6} xl={3}>
                <MultiAxisLineChartComponent
                  title="Relay Nutriente 4"
                  data={nutri4Data}
                  series={series}               
                  height={200}
                />
              </Col>
            </Row>
          )}
        </Fragment>
      )}
    </div>
  );
};
