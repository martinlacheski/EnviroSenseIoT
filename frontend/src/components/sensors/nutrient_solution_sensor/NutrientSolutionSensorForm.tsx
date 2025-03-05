import { createNutrientSolutionSensor, getEnvironments, updateNutrientSolutionSensor } from "@/api/index";
import { NutrientSolutionSensor } from "@/types/index";
import { Switch, TextField } from "@mui/material"; // Importar TextField de MUI
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const NutrientSolutionSensorForm = (props: { handleClose: () => void; sensor?: NutrientSolutionSensor }) => {
    const [id, setId] = useState("");
    const [environment_id, setEnvironmentId] = useState("");
    const [description, setDescription] = useState("");
    const [sensor_code, setSensorCode] = useState("");
    const [temperature_alert, setTemperatureAlert] = useState("");
    const [tds_alert, setTdsAlert] = useState("");
    const [ph_alert, setPhAlert] = useState("");
    const [ce_alert, setCeAlert] = useState("");
    const [minutes_to_report, setMinutesToReport] = useState("");
    const [enabled, setEnabled] = useState(false);

    // Estados para manejar errores de validación
    const [temperatureError, setTemperatureError] = useState("");
    const [tdsError, setTdsError] = useState("");
    const [phError, setPhError] = useState("");
    const [ceError, setCeError] = useState("");
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
            setTdsAlert(props.sensor.tds_alert.toString());
            setPhAlert(props.sensor.ph_alert.toString());
            setCeAlert(props.sensor.ce_alert.toString());
            setMinutesToReport(props.sensor.minutes_to_report.toString());
            setEnabled(props.sensor.enabled);
        }
    }, [props.sensor]);

    const { mutate } = useMutation({
        mutationFn: (formData: {
            id?: string; environment_id: string, description: string, sensor_code: string, temperature_alert: string,
            tds_alert: string, ph_alert: string, ce_alert: string, minutes_to_report: string, enabled: boolean
        }) => {
            if (props.sensor) {
                // Si hay un sensor, actualizamos
                return updateNutrientSolutionSensor({ formData, sensorId: props.sensor.id });
            } else {
                // Si no hay sensor, creamos uno nuevo
                return createNutrientSolutionSensor(formData);
            }
        },
        onError: (error: { message: string }) => {
            if (error.message.includes("Ya existe un sensor de solución nutritiva con ese código")) {
                toast.error("Ya existe un sensor de solución nutritiva con ese código");
            } else {
                toast.error(error.message);
            }
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Operación exitosa");
            queryClient.invalidateQueries({ queryKey: ["nutrient_solution_sensors"] });
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

        // Validar tds (0 a 4000)
        const tds = parseFloat(tds_alert);
        if (isNaN(tds) || tds < 0 || tds > 4000) {
            setTdsError("TDS debe estar entre 0 y 4000");
            isValid = false;
        } else {
            setTdsError("");
        }

        // Validar pH (4 a 9)
        const ph = parseFloat(ph_alert);
        if (isNaN(ph) || ph < 4 || ph > 9) {
            setPhError("El pH debe estar entre 4 y 9");
            isValid = false;
        } else {
            setPhError("");
        }

        // Validar CE (0 a 5000)
        const ce = parseFloat(ce_alert);
        if (isNaN(ce) || ce < 0 || ce > 5000) {
            setCeError("La CE debe estar entre 0 y 5000");
            isValid = false;
        } else {
            setCeError("");
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
            id, environment_id, description, sensor_code, temperature_alert, tds_alert,
            ph_alert, ce_alert, minutes_to_report, enabled
        });
    };

    return (
        <form onSubmit={handleForm}>
            <div className="mb-5 space-y-3">
                <p className="text-2xl font-light text-gray-500 mb-5">
                    {props.sensor ? "Editar Sensor de Solución Nutritiva" : "Crear Sensor de Solución Nutritiva"}
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
                <label htmlFor="tds_alert" className="text-sm uppercase font-bold">
                    Alerta de TDS
                </label>
                <TextField
                    id="tds_alert"
                    type="number"
                    fullWidth
                    value={tds_alert}
                    onChange={(e) => setTdsAlert(e.target.value)}
                    inputProps={{ min: 0, max: 4000 }} // Rango de TDS
                    error={!!tdsError}
                    helperText={tdsError}
                />
                <label htmlFor="ph_alert" className="text-sm uppercase font-bold">
                    Alerta de pH
                </label>
                <TextField
                    id="ph_alert"
                    type="number"
                    fullWidth
                    value={ph_alert}
                    onChange={(e) => setPhAlert(e.target.value)}
                    inputProps={{ min: 4, max: 9 }} // Rango de pH
                    error={!!phError}
                    helperText={phError}
                />
                <label htmlFor="ce_alert" className="text-sm uppercase font-bold">
                    Alerta de CE
                </label>
                <TextField
                    id="ce_alert"
                    type="number"
                    fullWidth
                    value={ce_alert}
                    onChange={(e) => setCeAlert(e.target.value)}
                    inputProps={{ min: 0, max: 5000 }} // Rango de CE
                    error={!!ceError}
                    helperText={ceError}
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

export default NutrientSolutionSensorForm;