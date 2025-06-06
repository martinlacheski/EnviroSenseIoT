import { Card, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { BinaryLineChartComponent, DoubleBarChartComponent, DoubleLineChartComponent, LineChartComponent, MultiLineChartComponent, SimpleAreaChartComponent, } from "./charts";
import { Environment, WSMessage, EnvironmentalData, ConsumptionData, NutrientSolutionData, ActuatorData, } from "./interfaces";
import { ConnectionIndicator } from "../../components";
import { DateFormatter } from "../../helpers";
import { useWebSocket } from "../../../hooks";
import { SweetAlert2 } from "../../utils";
import api from "../../../api/api";

const SOCKET_BASE_URL = import.meta.env.VITE_BACKEND_SOCKET_URL;

type ConsumptionsLevelSeriesValue = {
  timestamp: string;
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
  value6: number;
};
type CombinedSeriesValue = { timestamp: string; value: number; value2: number };
type TimeSeriesValue = { timestamp: string; value: number };

type TimeSeriesMap<T> = {
  [K in keyof T]?: TimeSeriesValue[];
};

type MessageState = {
  actuators: TimeSeriesMap<ActuatorData>;
  environmental: TimeSeriesMap<EnvironmentalData> & {
    temp_hum?: CombinedSeriesValue[];
  };
  consumption: TimeSeriesMap<ConsumptionData> & {
    levels?: ConsumptionsLevelSeriesValue[];
    current_power?: CombinedSeriesValue[];
  };
  nutrient_solution: TimeSeriesMap<NutrientSolutionData> & {
    ce_ph?: CombinedSeriesValue[];
  };
};

export const Dashboard = () => {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const [lastLux, setLastLux] = useState<number>(0);
  const [ambientalCode, setAmbientalCode] = useState<string>("");
  const [consumptionCode, setConsumptionCode] = useState<string>("");
  const [nutrientSolutionCode, setNutrientSolutionCode] = useState<string>("");
  const [actuatorCode, setActuatorCode] = useState<string>("");

  const [messages, setMessages] = useState<MessageState>({
    actuators: {},
    environmental: {},
    consumption: {},
    nutrient_solution: {},
  });

  const MAX_LENGTH = 10;

  const token = localStorage.getItem("token");
  if (!token) return <p>Token no encontrado. Por favor, inicia sesión.</p>;

  useEffect(() => {
    const fetchEnvironments = async () => {
      try {
        const { data } = await api.get<Environment[]>("/environments");
        setEnvironments(data);
        if (data.length > 0) setSelectedEnv(data[0]._id);
      } catch (error) {
        console.error("Error fetching environments:", error);
      }
    };
    fetchEnvironments();
  }, []);

  const addMessage = (msg: WSMessage) => {
    const { type, data } = msg;
    // Actualizar códigos solo si el mensaje contiene el código correspondiente
    if (type === "environmental") {
      const { sensor_code } = data as EnvironmentalData;
      if (sensor_code && sensor_code !== ambientalCode) {
        setAmbientalCode(sensor_code);
      }
    }

    if (type === "consumption") {
      const { sensor_code } = data as ConsumptionData;
      if (sensor_code && sensor_code !== consumptionCode) {
        setConsumptionCode(sensor_code);
      }
    }

    if (type === "nutrient_solution") {
      const { sensor_code } = data as NutrientSolutionData;
      if (sensor_code && sensor_code !== nutrientSolutionCode) {
        setNutrientSolutionCode(sensor_code);
      }
    }

    if (type === "actuators") {
      const { actuator_code } = data as ActuatorData;
      if (actuator_code && actuator_code !== actuatorCode) {
        setActuatorCode(actuator_code);
      }
    }

    setMessages((prev) => {
      const currentTypeData = prev[type] || {};
      const updatedTypeData: any = { ...currentTypeData };

      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "number") {
          const series =
            currentTypeData[key as keyof typeof currentTypeData] || [];
          updatedTypeData[key] = [
            ...series,
            { timestamp: DateFormatter.toHHMMString((data as EnvironmentalData).datetime), value },
          ].slice(-MAX_LENGTH);
        }
      });

      // Combinados para environmental
      if (type === "environmental") {
        const ts = DateFormatter.toHHMMString((data as EnvironmentalData).datetime);
        const temp = (data as EnvironmentalData).temperature;
        const hum = (data as EnvironmentalData).humidity;

        const tempHumSeries = prev.environmental.temp_hum || [];

        if (typeof temp === "number" && typeof hum === "number") {
          updatedTypeData.temp_hum = [
            ...tempHumSeries,
            { timestamp: ts, value: temp, value2: hum },
          ].slice(-MAX_LENGTH);
        }
      }

      // Combinados para nutrient_solution
      if (type === "nutrient_solution") {
        const ts = DateFormatter.toHHMMString((data as EnvironmentalData).datetime);
        const ce = (data as NutrientSolutionData).ce;
        const ph = (data as NutrientSolutionData).ph;

        const cePhSeries = prev.nutrient_solution.ce_ph || [];

        if (typeof ce === "number" && typeof ph === "number") {
          updatedTypeData.ce_ph = [
            ...cePhSeries,
            { timestamp: ts, value: ce, value2: ph },
          ].slice(-MAX_LENGTH);
        }

        const lux = (data as EnvironmentalData).luminosity;
        if (typeof lux === "number") {
          setLastLux(lux);
        }
      }

      // Combinados para consumption
      if (type === "consumption") {
        const {
          nutrient_1_level,
          nutrient_2_level,
          nutrient_3_level,
          nutrient_4_level,
          nutrient_5_level,
          nutrient_6_level,
        } = data as ConsumptionData;
        const levelsSeries = prev.consumption.levels || [];

        const allNutrients = [
          nutrient_1_level,
          nutrient_2_level,
          nutrient_3_level,
          nutrient_4_level,
          nutrient_5_level,
          nutrient_6_level,
        ];

        const allAreNumbers = allNutrients.every((n) => typeof n === "number");

        if (allAreNumbers) {
          const ts = DateFormatter.toHHMMString((data as EnvironmentalData).datetime);

          updatedTypeData.levels = [
            ...levelsSeries,
            {
              timestamp: ts,
              value1: nutrient_1_level,
              value2: nutrient_2_level,
              value3: nutrient_3_level,
              value4: nutrient_4_level,
              value5: nutrient_5_level,
              value6: nutrient_6_level,
            },
          ].slice(-MAX_LENGTH);
        }
        const ts = DateFormatter.toHHMMString((data as EnvironmentalData).datetime);
        const current = (data as ConsumptionData).current;
        const power = (data as ConsumptionData).power;
        const currentPowerSeries = prev.consumption.current_power || [];
        if (typeof current === "number" && typeof power === "number") {
          updatedTypeData.current_power = [
            ...currentPowerSeries,
            {
              timestamp: ts,
              value: current,
              value2: power,
            },
          ].slice(-MAX_LENGTH);
        }
      }

      return {
        ...prev,
        [type]: updatedTypeData,
      };
    });
  };

  // Resetear mensajes cada vez que cambia el ambiente
  useEffect(() => {
    setMessages({
      actuators: {},
      environmental: {},
      consumption: {},
      nutrient_solution: {},
    });
    setAmbientalCode("");
    setConsumptionCode("");
    setNutrientSolutionCode("");
    setActuatorCode("");
  }, [selectedEnv]);

  const { isConnected } = useWebSocket({
    url: selectedEnv
      ? `${SOCKET_BASE_URL}?authorization=${token}&environment_id=${selectedEnv}`
      : "",
    onMessage: (msg) => {
      addMessage(msg);
    },
  });

  const [syncStatus, setSyncStatus] = useState({
    environmental: false,
    nutrientSolution: false,
    consumption: false,
    actuator: false
  });

  const handleSync = async (
    type: "sensor" | "actuador",
    topic: string,
    sensorCode: string
  ) => {
    if (!sensorCode || sensorCode === "") {
      SweetAlert2.errorAlert("No se ha podido obtener el código del sensor");
      return;
    }

    // Determinar qué estado de loading actualizar según el topic
    let loadingKey: keyof typeof syncStatus;

    if (topic === "environmental") loadingKey = "environmental";
    else if (topic === "nutrient/solution") loadingKey = "nutrientSolution";
    else if (topic === "consumption") loadingKey = "consumption";
    else if (topic === "actuators") loadingKey = "actuator";
    else {
      console.error("Tópico no reconocido:", topic);
      return;
    }

    // Configurar el body según el tipo
    let body = {};
    if (type === "sensor") {
      body = {
        topic: `${topic}/sensor/sub`,
        message: { sensor_code: sensorCode, command: "read_now" },
      };
    } else if (type === "actuador") {
      body = {
        topic: "actuators/sub",
        message: { actuator_code: sensorCode, command: "read_now" },
      };
    }

    // Activar el loading específico
    setSyncStatus(prev => ({ ...prev, [loadingKey]: true }));

    try {
      await api.post("/mqtt/publish", body);
    } catch (error) {
      console.error("Error al sincronizar:", error);
      SweetAlert2.errorAlert("Error al sincronizar");
    } finally {
      // Desactivar el loading específico
      setSyncStatus(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
        <h1 className="fs-5 fw-bold d-flex flex-column flex-md-row align-items-center gap-2 gap-md-4 mb-2 mb-md-0">
          {environments.length > 0
            ? `${environments.find((env) => env._id === selectedEnv)?.name}`
            : "Ambiente no identificado"}
          <ConnectionIndicator isConnected={isConnected} />
        </h1>

        <Form.Select
          size="sm"
          className="w-auto"
          value={selectedEnv || ""}
          onChange={(e) => setSelectedEnv(e.target.value)}
        >
          {environments.map((env) => (
            <option key={env._id} value={env._id}>
              {env.name} ({env.city.name}, {env.city.province.name})
            </option>
          ))}
        </Form.Select>
      </div>

      <Row className="g-3">
        {/* SENSOR AMBIENTAL */}
        <Col xs={12} lg={6}>
          <Card>
            {/* Ejemplo para Sensor Ambiental */}
            <Card.Header className="py-1 d-flex justify-content-between align-items-center">
              <span className="small mb-0">
                <i className="bi bi-cloud me-1"></i> Sensor ambiental{" "}
                {ambientalCode && <strong className="mx-1">{ambientalCode}</strong>}
              </span>
              {ambientalCode && (
                <button
                  className="btn btn-sm py-0 px-1"
                  onClick={() => handleSync("sensor", "environmental", ambientalCode)}
                  disabled={syncStatus.environmental}
                >
                  {syncStatus.environmental ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <i className="bi bi-arrow-clockwise"></i>
                  )}
                </button>
              )}
            </Card.Header>
            <Card.Body className="p-0">
              <Row className="g-2 p-2">
                <Col xs={12} xl={6}>
                  <DoubleLineChartComponent
                    name="Temperatura"
                    unit="ºC"
                    name2="Humedad"
                    unit2="%"
                    data={messages.environmental.temp_hum || []}
                    domain={[0, 50]}
                    domain2={[0, 100]}
                  />
                </Col>
                <Col xs={12} xl={6}>
                  <LineChartComponent
                    name="Presión (hPa)"
                    data={messages.environmental.atmospheric_pressure || []}
                    domain={[900, 1100]}
                  />
                </Col>
                <Col xs={12} xl={6}>
                  <SimpleAreaChartComponent
                    name="CO2 (ppm)"
                    data={messages.environmental.co2 || []}
                  />
                </Col>
                <Col xs={12} xl={6}>
                  <LineChartComponent
                    name="Luminosidad (lux)"
                    data={messages.environmental.luminosity || []}
                    domain={[0, lastLux * 2]}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* SENSOR DE SOLUCIÓN NUTRITIVA */}
        <Col xs={12} lg={6}>
          <Card>
            <Card.Header className="py-1 d-flex justify-content-between align-items-center">
              <span className="small mb-0">
                <i className="bi bi-water me-1"></i> Sensor de solución
                nutritiva{" "}
                <strong className="mx-1">{nutrientSolutionCode}</strong>
              </span>
              <button
                className="btn btn-sm py-0 px-1"
                onClick={() => handleSync("sensor", "nutrient/solution", nutrientSolutionCode)}
                disabled={syncStatus.nutrientSolution}
              >
                {syncStatus.nutrientSolution ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-arrow-clockwise"></i>
                )}
              </button>
            </Card.Header>
            <Card.Body className="p-0">
              <Row className="g-2 p-2">
                <Col xs={12} xl={6}>
                  <SimpleAreaChartComponent
                    name="Nivel (cm)"
                    unit="cm"
                    data={messages.nutrient_solution.level || []}
                    domain={[0, 200]}
                  />
                </Col>
                <Col xs={12} xl={6}>
                  <DoubleBarChartComponent
                    name="Conductividad (mS/cm)"
                    name2="pH"
                    data={messages.nutrient_solution.ce_ph || []}
                    domain={[0, 20]}
                  />
                </Col>

                <Col xs={12} xl={6}>
                  <LineChartComponent
                    name="TDS (ppm)"
                    data={messages.nutrient_solution.tds || []}
                    domain={[0, 5000]}
                  />
                </Col>
                <Col xs={12} xl={6}>
                  <LineChartComponent
                    name="Temperatura (ºC)"
                    unit="ºC"
                    data={messages.nutrient_solution.temperature || []}
                    domain={[0, 100]}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* SENSOR DE CONSUMO */}
        <Col xs={12} lg={6}>
          <Card>
            <Card.Header className="py-1 d-flex justify-content-between align-items-center">
              <span className="small mb-0">
                <i className="bi bi-sort-down me-1"></i> Sensor de consumo
                <strong className="mx-1">{consumptionCode}</strong>
              </span>
              <button
                className="btn btn-sm py-0 px-1"
                onClick={() => handleSync("sensor", "consumption", consumptionCode)}
                disabled={syncStatus.consumption}
              >
                {syncStatus.consumption ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-arrow-clockwise"></i>
                )}
              </button>
            </Card.Header>
            <Card.Body className="p-0">
              <Row className="g-2 p-2">
                <Col xs={12}>
                  <MultiLineChartComponent
                    data={messages.consumption.levels || []}
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
                  />
                </Col>

                <Col xs={12} xl={6}>
                  <LineChartComponent
                    name="Voltaje (V)"
                    data={messages.consumption.voltage || []}
                    domain={[80, 260]}
                  />
                </Col>
                <Col xs={12} xl={6}>
                  <DoubleLineChartComponent
                    name="Corriente (A)"
                    unit="A"
                    name2="Potencia (W)"
                    unit2="W"
                    data={messages.consumption.current_power || []}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* ACTUADOR */}
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Header className="py-1 d-flex justify-content-between align-items-center">
              <span className="small mb-0">
                <i className="bi bi-lightning me-1"></i> Actuador
                <strong className="mx-1">{actuatorCode}</strong>
              </span>
              <button
                className="btn btn-sm py-0 px-1"
                onClick={() => handleSync("actuador", "actuators", actuatorCode)}
                disabled={syncStatus.actuator}
              >
                {syncStatus.actuator ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-arrow-clockwise"></i>
                )}
              </button>
            </Card.Header>
            <Card.Body className="p-0">
              <Row className="p-2">
                <Col xs={12}>
                  <BinaryLineChartComponent
                    name="Relé Agua"
                    data={messages.actuators.relay_water || []}
                  />
                  <BinaryLineChartComponent
                    name="Relé Vent."
                    data={messages.actuators.relay_vent || []}
                  />
                  <BinaryLineChartComponent
                    name="Relé Ilum."
                    data={messages.actuators.relay_light || []}
                  />
                  <BinaryLineChartComponent
                    name="Relé Air."
                    data={messages.actuators.relay_aerator || []}
                  />
                  <BinaryLineChartComponent
                    name="Relé pH +"
                    data={messages.actuators.relay_ph_plus || []}
                  />
                  <BinaryLineChartComponent
                    name="Relé pH -"
                    data={messages.actuators.relay_ph_minus || []}
                  />
                  <BinaryLineChartComponent
                    name="Relé Nu. 1"
                    data={messages.actuators.relay_nutri_1 || []}
                  />
                  <BinaryLineChartComponent
                    name="Relé Nu. 2"
                    data={messages.actuators.relay_nutri_2 || []}
                  />
                  <BinaryLineChartComponent
                    name="Relé Nu. 3"
                    data={messages.actuators.relay_nutri_3 || []}
                  />
                  <BinaryLineChartComponent
                    name="Relé Nu. 4"
                    data={messages.actuators.relay_nutri_4 || []}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};