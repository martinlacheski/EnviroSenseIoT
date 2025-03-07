import { createEnvironmentalSensor, getEnvironments, updateEnvironmentalSensor } from "@/api/index";
import { EnvironmentalSensor } from "@/types/index";
import { Switch, TextField } from "@mui/material"; // Importar TextField de MUI
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EnvironmentalSensorForm = (props: { handleClose: () => void; sensor?: EnvironmentalSensor }) => {
    const [id, setId] = useState("");
    const [environment_id, setEnvironmentId] = useState("");
    const [description, setDescription] = useState("");
    const [sensor_code, setSensorCode] = useState("");
    const [temperature_alert, setTemperatureAlert] = useState("");
    const [humidity_alert, setHumidityAlert] = useState("");
    const [atmospheric_pressure_alert, setAtmosphericPressureAlert] = useState("");
    const [co2_alert, setCo2Alert] = useState("");
    const [minutes_to_report, setMinutesToReport] = useState("");
    const [enabled, setEnabled] = useState(false);

    // Estados para manejar errores de validación
    const [temperatureError, setTemperatureError] = useState("");
    const [humidityError, setHumidityError] = useState("");
    const [pressureError, setPressureError] = useState("");
    const [co2Error, setCo2Error] = useState("");
    const [minutesError, setMinutesError] = useState("");

    const queryClient = useQueryClient();

    // Obtener la lista de tipos de ambientes
    const { data: environments } = useQuery({
        queryKey: ['environments'],
        queryFn: () => getEnvironments(),
    });

    useEffect(() => {
        if (props.sensor) { // Precargar si estamos editando
            setId(props.sensor.id);
            setEnvironmentId(props.sensor.environment_id);
            setDescription(props.sensor.description);
            setSensorCode(props.sensor.sensor_code);
            setTemperatureAlert(props.sensor.temperature_alert.toString());
            setHumidityAlert(props.sensor.humidity_alert.toString());
            setAtmosphericPressureAlert(props.sensor.atmospheric_pressure_alert.toString());
            setCo2Alert(props.sensor.co2_alert.toString());
            setMinutesToReport(props.sensor.minutes_to_report.toString());
            setEnabled(props.sensor.enabled);
        }
    }, [props.sensor]);

    const { mutate } = useMutation({
        mutationFn: (formData: {
            id?: string; environment_id: string, description: string, sensor_code: string, temperature_alert: string,
            humidity_alert: string, atmospheric_pressure_alert: string, co2_alert: string, minutes_to_report: string, enabled: boolean
        }) => {
            if (props.sensor) {
                // Si hay un sensor, actualizamos
                return updateEnvironmentalSensor({ formData, sensorId: props.sensor.id });
            } else {
                // Si no hay sensor, creamos uno nuevo
                return createEnvironmentalSensor(formData);
            }
        },
        onError: (error: { message: string }) => {
            if (error.message.includes("Ya existe un sensor ambiental con ese código")) {
                toast.error("Ya existe un sensor ambiental con ese código");
            } else {
                toast.error(error.message);
            }
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Operación exitosa");
            queryClient.invalidateQueries({ queryKey: ["environmental_sensors"] });
            props.handleClose();
        },
    });

    const validateForm = () => {
        let isValid = true;

        // Validar temperatura (-25 a 100)
        const temp = parseFloat(temperature_alert);
        if (isNaN(temp) || temp < -25 || temp > 100) {
            setTemperatureError("La temperatura debe estar entre -25 y 100");
            isValid = false;
        } else {
            setTemperatureError("");
        }

        // Validar humedad (0 a 100)
        const humidity = parseFloat(humidity_alert);
        if (isNaN(humidity) || humidity < 0 || humidity > 100) {
            setHumidityError("La humedad debe estar entre 0 y 100");
            isValid = false;
        } else {
            setHumidityError("");
        }

        // Validar presión atmosférica (850 a 1150)
        const pressure = parseFloat(atmospheric_pressure_alert);
        if (isNaN(pressure) || pressure < 850 || pressure > 1150) {
            setPressureError("La presión atmosférica debe estar entre 850 y 1150");
            isValid = false;
        } else {
            setPressureError("");
        }

        // Validar CO2 (0 a 5000)
        const co2 = parseFloat(co2_alert);
        if (isNaN(co2) || co2 < 0 || co2 > 5000) {
            setCo2Error("El CO2 debe estar entre 0 y 5000");
            isValid = false;
        } else {
            setCo2Error("");
        }

        // Validar minutos para reportar (1 a 60)
        const minutes = parseInt(minutes_to_report);
        if (isNaN(minutes) || minutes < 1 || minutes > 60) {
            setMinutesError("Los minutos para reportar deben estar entre 1 y 60");
            isValid = false;
        } else {
            setMinutesError("");
        }

        return isValid;
    };

    const handleForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        // Validar el formulario antes de enviar
        if (!validateForm()) {
            return;
        }

        mutate({
            id, environment_id, description, sensor_code, temperature_alert, humidity_alert,
            atmospheric_pressure_alert, co2_alert, minutes_to_report, enabled
        });
    };

    return (
        <form onSubmit={handleForm}>
            <div className="mb-5 space-y-3">
                <p className="text-2xl font-light text-gray-500 mb-5">
                    {props.sensor ? "Editar Sensor Ambiental" : "Crear Sensor Ambiental"}
                </p>
                <label htmlFor="type_id" className="text-sm uppercase font-bold">
                    Ambiente
                </label>
                <select
                    id="type_id"
                    className="w-full p-3 border border-gray-200"
                    value={environment_id}
                    onChange={(e) => setEnvironmentId(e.target.value)}
                    required
                >
                    <option value="">Seleccione un ambiente</option>
                    {environments?.map((environment) => (
                        <option key={environment.id} value={environment.id}>
                            {environment.name}
                        </option>
                    ))}
                </select>
                <label htmlFor="description" className="text-sm uppercase font-bold">
                    Descripción
                </label>
                <input
                    id="description"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Descripción"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label htmlFor="sensor_code" className="text-sm uppercase font-bold">
                    Código del Sensor
                </label>
                <input
                    id="sensor_code"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Código"
                    required
                    value={sensor_code}
                    onChange={(e) => setSensorCode(e.target.value)}
                />
                <label htmlFor="temperature_alert" className="text-sm uppercase font-bold">
                    Alerta de temperatura
                </label>
                <TextField
                    id="temperature_alert"
                    type="number"
                    fullWidth
                    value={temperature_alert}
                    onChange={(e) => setTemperatureAlert(e.target.value)}
                    inputProps={{ min: -25, max: 100 }} // Rango de temperatura
                    error={!!temperatureError}
                    helperText={temperatureError}
                />
                <label htmlFor="humidity_alert" className="text-sm uppercase font-bold">
                    Alerta de humedad
                </label>
                <TextField
                    id="humidity_alert"
                    type="number"
                    fullWidth
                    value={humidity_alert}
                    onChange={(e) => setHumidityAlert(e.target.value)}
                    inputProps={{ min: 0, max: 100 }} // Rango de humedad
                    error={!!humidityError}
                    helperText={humidityError}
                />
                <label htmlFor="atmospheric_pressure_alert" className="text-sm uppercase font-bold">
                    Alerta de presión atmosférica
                </label>
                <TextField
                    id="atmospheric_pressure_alert"
                    type="number"
                    fullWidth
                    value={atmospheric_pressure_alert}
                    onChange={(e) => setAtmosphericPressureAlert(e.target.value)}
                    inputProps={{ min: 850, max: 1150 }} // Rango de presión atmosférica
                    error={!!pressureError}
                    helperText={pressureError}
                />
                <label htmlFor="co2_alert" className="text-sm uppercase font-bold">
                    Alerta de dióxido de carbono
                </label>
                <TextField
                    id="co2_alert"
                    type="number"
                    fullWidth
                    value={co2_alert}
                    onChange={(e) => setCo2Alert(e.target.value)}
                    inputProps={{ min: 0, max: 5000 }} // Rango de CO2
                    error={!!co2Error}
                    helperText={co2Error}
                />
                <label htmlFor="minutes_to_report" className="text-sm uppercase font-bold">
                    Minutos para reportar
                </label>
                <TextField
                    id="minutes_to_report"
                    type="number"
                    fullWidth
                    value={minutes_to_report}
                    onChange={(e) => setMinutesToReport(e.target.value)}
                    inputProps={{ min: 1, max: 60 }} // Rango de minutos
                    error={!!minutesError}
                    helperText={minutesError}
                />
                <div className="mb-5 space-y-3">
                    <label htmlFor="enabled" className="text-sm uppercase font-bold">
                        Sensor activo
                    </label>
                </div>
                <div>
                    <Switch
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>
            </div>
            <div className="flex w-full space-x-3">
                <button
                    type="button"
                    onClick={props.handleClose}
                    className="flex-1 bg-gray-500 px-6 py-3 text-white uppercase font-bold text-xs rounded-lg"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 px-6 py-3 text-white uppercase font-bold text-xs rounded-lg"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
};

export default EnvironmentalSensorForm;