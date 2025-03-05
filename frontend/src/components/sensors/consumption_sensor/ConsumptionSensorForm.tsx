import { createConsumptionSensor, getEnvironments, getNutrientTypes, updateConsumptionSensor } from "@/api/index";
import { ConsumptionSensor } from "@/types/index";
import { Switch, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ConsumptionSensorForm = (props: { handleClose: () => void; sensor?: ConsumptionSensor }) => {
    const [id, setId] = useState("");
    const [environment_id, setEnvironmentId] = useState("");
    const [description, setDescription] = useState("");
    const [sensor_code, setSensorCode] = useState("");
    const [min_voltage_alert, setMinVoltageAlert] = useState("");
    const [max_voltage_alert, setMaxVoltageAlert] = useState("");
    const [solution_level_alert, setSolutionLevelAlert] = useState("");
    const [nutrient_1_enabled, setNutrient1Enabled] = useState(false);
    const [nutrient_1_type_id, setNutrient1TypeId] = useState("");
    const [nutrient_1_alert, setNutrient1Alert] = useState("");
    const [nutrient_2_enabled, setNutrient2Enabled] = useState(false);
    const [nutrient_2_type_id, setNutrient2TypeId] = useState("");
    const [nutrient_2_alert, setNutrient2Alert] = useState("");
    const [nutrient_3_enabled, setNutrient3Enabled] = useState(false);
    const [nutrient_3_type_id, setNutrient3TypeId] = useState("");
    const [nutrient_3_alert, setNutrient3Alert] = useState("");
    const [nutrient_4_enabled, setNutrient4Enabled] = useState(false);
    const [nutrient_4_type_id, setNutrient4TypeId] = useState("");
    const [nutrient_4_alert, setNutrient4Alert] = useState("");
    const [nutrient_5_enabled, setNutrient5Enabled] = useState(false);
    const [nutrient_5_type_id, setNutrient5TypeId] = useState("");
    const [nutrient_5_alert, setNutrient5Alert] = useState("");
    const [nutrient_6_enabled, setNutrient6Enabled] = useState(false);
    const [nutrient_6_type_id, setNutrient6TypeId] = useState("");
    const [nutrient_6_alert, setNutrient6Alert] = useState("");
    const [minutes_to_report, setMinutesToReport] = useState("");
    const [enabled, setEnabled] = useState(false);

    // Estados para manejar errores de validación
    const [minVoltageError, setMinVoltageError] = useState("");
    const [maxVoltageError, setMaxVoltageError] = useState("");
    const [solutionLevelError, setSolutionLevelError] = useState("");
    const [nutrient1Error, setNutrient1Error] = useState("");
    const [nutrient2Error, setNutrient2Error] = useState("");
    const [nutrient3Error, setNutrient3Error] = useState("");
    const [nutrient4Error, setNutrient4Error] = useState("");
    const [nutrient5Error, setNutrient5Error] = useState("");
    const [nutrient6Error, setNutrient6Error] = useState("");
    const [minutesError, setMinutesError] = useState("");

    const queryClient = useQueryClient();

    // Obtener la lista de tipos de ambientes
    const { data: environments } = useQuery({
        queryKey: ['environments'],
        queryFn: () => getEnvironments(),
    });

    // Obtener la lista de tipos de nutrientes
    const { data: nutrients } = useQuery({
        queryKey: ['nutrients'],
        queryFn: () => getNutrientTypes(),
    });

    useEffect(() => {
        if (props.sensor) { // Precargar si estamos editando
            setId(props.sensor.id);
            setEnvironmentId(props.sensor.environment_id);
            setDescription(props.sensor.description);
            setSensorCode(props.sensor.sensor_code);
            setMinVoltageAlert(props.sensor.min_voltage_alert.toString());
            setMaxVoltageAlert(props.sensor.max_voltage_alert.toString());
            setSolutionLevelAlert(props.sensor.solution_level_alert.toString());
            setNutrient1Enabled(props.sensor.nutrient_1_enabled);
            setNutrient1TypeId(props.sensor.nutrient_1_type_id.toString());
            setNutrient1Alert(props.sensor.nutrient_1_alert.toString());
            setNutrient2Enabled(props.sensor.nutrient_2_enabled);
            setNutrient2TypeId(props.sensor.nutrient_2_type_id.toString());
            setNutrient2Alert(props.sensor.nutrient_2_alert.toString());
            setNutrient3Enabled(props.sensor.nutrient_3_enabled);
            setNutrient3TypeId(props.sensor.nutrient_3_type_id.toString());
            setNutrient3Alert(props.sensor.nutrient_3_alert.toString());
            setNutrient4Enabled(props.sensor.nutrient_4_enabled);
            setNutrient4TypeId(props.sensor.nutrient_4_type_id.toString());
            setNutrient4Alert(props.sensor.nutrient_4_alert.toString());
            setNutrient5Enabled(props.sensor.nutrient_5_enabled);
            setNutrient5TypeId(props.sensor.nutrient_5_type_id.toString());
            setNutrient5Alert(props.sensor.nutrient_5_alert.toString());
            setNutrient6Enabled(props.sensor.nutrient_6_enabled);
            setNutrient6TypeId(props.sensor.nutrient_6_type_id.toString());
            setNutrient6Alert(props.sensor.nutrient_6_alert.toString());
            setMinutesToReport(props.sensor.minutes_to_report.toString());
            setEnabled(props.sensor.enabled);
        }
    }, [props.sensor]);

    const { mutate } = useMutation({
        mutationFn: (formData: {
            id?: string; environment_id: string, description: string, sensor_code: string,
            min_voltage_alert: string, max_voltage_alert: string, solution_level_alert: string,
            nutrient_1_enabled: boolean, nutrient_1_type_id: string, nutrient_1_alert: string,
            nutrient_2_enabled: boolean, nutrient_2_type_id: string, nutrient_2_alert: string,
            nutrient_3_enabled: boolean, nutrient_3_type_id: string, nutrient_3_alert: string,
            nutrient_4_enabled: boolean, nutrient_4_type_id: string, nutrient_4_alert: string,
            nutrient_5_enabled: boolean, nutrient_5_type_id: string, nutrient_5_alert: string,
            nutrient_6_enabled: boolean, nutrient_6_type_id: string, nutrient_6_alert: string,
            minutes_to_report: string, enabled: boolean
        }) => {
            if (props.sensor) {
                // Si hay un sensor, actualizamos
                return updateConsumptionSensor({ formData, sensorId: props.sensor.id });
            } else {
                // Si no hay sensor, creamos uno nuevo
                return createConsumptionSensor(formData);
            }
        },
        onError: (error: { message: string }) => {
            if (error.message.includes("Ya existe un sensor de consumos con ese código")) {
                toast.error("Ya existe un sensor de consumos con ese código");
            } else {
                toast.error(error.message);
            }
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Operación exitosa");
            queryClient.invalidateQueries({ queryKey: ["consumption_sensors"] });
            props.handleClose();
        },
    });

    const validateForm = () => {
        let isValid = true;

        // Validar voltaje mínimo (0 a 250)
        const min_vol = parseFloat(min_voltage_alert);
        if (isNaN(min_vol) || min_vol < 0 || min_vol > 250) {
            setMinVoltageError("El voltaje debe estar entre 0 y 250");
            isValid = false;
        } else {
            setMinVoltageError("");
        }

        // Validar voltaje máximo (0 a 250)
        const max_vol = parseFloat(max_voltage_alert);
        if (isNaN(max_vol) || max_vol < 0 || max_vol > 250) {
            setMaxVoltageError("El voltaje debe estar entre 0 y 250");
            isValid = false;
        } else {
            setMaxVoltageError("");
        }

        // Validar nivel de solución nutritiva (0 a 3500)
        const solution_level = parseFloat(solution_level_alert);
        if (isNaN(solution_level) || solution_level < 0 || solution_level > 3500) {
            setSolutionLevelError("El nivel de la solución debe estar entre 0 y 3500");
            isValid = false;
        } else {
            setSolutionLevelError("");
        }

        // Validar nivel de nutriente 1 (0 a 3500)
        const nutrient_1 = parseFloat(nutrient_1_alert);
        if (isNaN(nutrient_1) || nutrient_1 < 0 || nutrient_1 > 3500) {
            setNutrient1Error("El nivel del nutriente debe estar entre 0 y 3500");
            isValid = false;
        } else {
            setNutrient1Error("");
        }

        // Validar nivel de nutriente 2 (0 a 3500)
        const nutrient_2 = parseFloat(nutrient_2_alert);
        if (isNaN(nutrient_2) || nutrient_2 < 0 || nutrient_2 > 3500) {
            setNutrient2Error("El nivel del nutriente debe estar entre 0 y 3500");
            isValid = false;
        } else {
            setNutrient2Error("");
        }

        // Validar nivel de nutriente 3 (0 a 3500)
        const nutrient_3 = parseFloat(nutrient_3_alert);
        if (isNaN(nutrient_3) || nutrient_3 < 0 || nutrient_3 > 3500) {
            setNutrient3Error("El nivel del nutriente debe estar entre 0 y 3500");
            isValid = false;
        } else {
            setNutrient3Error("");
        }

        // Validar nivel de nutriente 4 (0 a 3500)
        const nutrient_4 = parseFloat(nutrient_4_alert);
        if (isNaN(nutrient_4) || nutrient_4 < 0 || nutrient_4 > 3500) {
            setNutrient4Error("El nivel del nutriente debe estar entre 0 y 3500");
            isValid = false;
        } else {
            setNutrient4Error("");
        }

        // Validar nivel de nutriente 5 (0 a 3500)
        const nutrient_5 = parseFloat(nutrient_5_alert);
        if (isNaN(nutrient_5) || nutrient_5 < 0 || nutrient_5 > 3500) {
            setNutrient5Error("El nivel del nutriente debe estar entre 0 y 3500");
            isValid = false;
        } else {
            setNutrient5Error("");
        }

        // Validar nivel de nutriente 6 (0 a 3500)
        const nutrient_6 = parseFloat(nutrient_6_alert);
        if (isNaN(nutrient_6) || nutrient_6 < 0 || nutrient_6 > 3500) {
            setNutrient6Error("El nivel del nutriente debe estar entre 0 y 3500");
            isValid = false;
        } else {
            setNutrient6Error("");
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
            id, environment_id, description, sensor_code, min_voltage_alert,
            max_voltage_alert, solution_level_alert,
            nutrient_1_enabled, nutrient_1_type_id, nutrient_1_alert,
            nutrient_2_enabled, nutrient_2_type_id, nutrient_2_alert,
            nutrient_3_enabled, nutrient_3_type_id, nutrient_3_alert,
            nutrient_4_enabled, nutrient_4_type_id, nutrient_4_alert,
            nutrient_5_enabled, nutrient_5_type_id, nutrient_5_alert,
            nutrient_6_enabled, nutrient_6_type_id, nutrient_6_alert,
            minutes_to_report, enabled
        });
    };

    return (
        <form onSubmit={handleForm} className="space-y-3 max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <p className="text-2xl font-light text-gray-500 mb-6">
                {props.sensor ? "Editar Sensor de Consumos" : "Crear Sensor de Consumos"}
            </p>

            {/* Campos principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="type_id" className="text-sm uppercase font-bold text-gray-700">
                        Ambiente
                    </label>
                    <select
                        id="type_id"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                </div>
                <div>
                    <label htmlFor="description" className="text-sm uppercase font-bold text-gray-700">
                        Descripción
                    </label>
                    <input
                        id="description"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Descripción"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="sensor_code" className="text-sm uppercase font-bold text-gray-700">
                        Código del Sensor
                    </label>
                    <input
                        id="sensor_code"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Código"
                        required
                        value={sensor_code}
                        onChange={(e) => setSensorCode(e.target.value)}
                    />
                </div>
            </div>

            {/* Voltaje y solución nutritiva */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                <div>
                    <label htmlFor="min_voltage_alert" className="text-sm uppercase font-bold text-gray-700">
                        Voltaje mínimo
                    </label>
                    <TextField
                        id="min_voltage_alert"
                        type="number"
                        fullWidth
                        value={min_voltage_alert}
                        onChange={(e) => setMinVoltageAlert(e.target.value)}
                        inputProps={{ min: 0, max: 250 }}
                        error={!!minVoltageError}
                        helperText={minVoltageError}
                        variant="outlined"
                        size="small"
                    />
                </div>
                <div>
                    <label htmlFor="max_voltage_alert" className="text-sm uppercase font-bold text-gray-700">
                        Voltaje máximo
                    </label>
                    <TextField
                        id="max_voltage_alert"
                        type="number"
                        fullWidth
                        value={max_voltage_alert}
                        onChange={(e) => setMaxVoltageAlert(e.target.value)}
                        inputProps={{ min: 0, max: 250 }}
                        error={!!maxVoltageError}
                        helperText={maxVoltageError}
                        variant="outlined"
                        size="small"
                    />
                </div>
                <div>
                    <label htmlFor="solution_level_alert" className="text-sm uppercase font-bold text-gray-700">
                        Nivel de la solución
                    </label>
                    <TextField
                        id="solution_level_alert"
                        type="number"
                        fullWidth
                        value={solution_level_alert}
                        onChange={(e) => setSolutionLevelAlert(e.target.value)}
                        inputProps={{ min: 0, max: 3500 }}
                        error={!!solutionLevelError}
                        helperText={solutionLevelError}
                        variant="outlined"
                        size="small"
                    />
                </div>
                <div>
                    <label htmlFor="minutes_to_report" className="text-sm uppercase font-bold text-gray-700">
                        Minutos para reportar
                    </label>
                    <TextField
                        id="minutes_to_report"
                        type="number"
                        fullWidth
                        value={minutes_to_report}
                        onChange={(e) => setMinutesToReport(e.target.value)}
                        inputProps={{ min: 1, max: 60 }}
                        error={!!minutesError}
                        helperText={minutesError}
                        variant="outlined"
                        size="small"
                    />
                </div>
                <div>
                    <label htmlFor="enabled" className="text-sm uppercase font-bold text-gray-700">
                        Sensor activo
                    </label>
                    <Switch
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>
            </div>

            {/* Nutrientes */}
            {[1, 2, 3, 4, 5, 6].map((nutrientNumber) => (
                <div key={nutrientNumber} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor={`nutrient_${nutrientNumber}_enabled`} className="text-sm uppercase font-bold text-gray-700">
                            Nutriente {nutrientNumber}
                        </label>
                        <Switch
                            checked={eval(`nutrient_${nutrientNumber}_enabled`)}
                            onChange={(e) => eval(`setNutrient${nutrientNumber}Enabled(e.target.checked)`)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </div>
                    <div>
                        <label htmlFor={`nutrient_${nutrientNumber}_type_id`} className="text-sm uppercase font-bold text-gray-700">
                            Tipo {nutrientNumber}
                        </label>
                        <select
                            id={`nutrient_${nutrientNumber}_type_id`}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={eval(`nutrient_${nutrientNumber}_type_id`)}
                            onChange={(e) => eval(`setNutrient${nutrientNumber}TypeId(e.target.value)`)}
                            required
                        >
                            <option value="">Seleccione un tipo de nutriente</option>
                            {nutrients?.map((nutrient) => (
                                <option key={nutrient.id} value={nutrient.id}>
                                    {nutrient.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor={`nutrient_${nutrientNumber}_alert`} className="text-sm uppercase font-bold text-gray-700">
                            Nivel {nutrientNumber}
                        </label>
                        <TextField
                            id={`nutrient_${nutrientNumber}_alert`}
                            type="number"
                            fullWidth
                            value={eval(`nutrient_${nutrientNumber}_alert`)}
                            onChange={(e) => eval(`setNutrient${nutrientNumber}Alert(e.target.value)`)}
                            inputProps={{ min: 0, max: 3500 }}
                            error={!!eval(`nutrient${nutrientNumber}Error`)}
                            helperText={eval(`nutrient${nutrientNumber}Error`)}
                            variant="outlined"
                            size="small"
                        />
                    </div>
                </div>
            ))}

            {/* Minutos para reportar y estado del sensor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 mt-6">
                <button
                    type="button"
                    onClick={props.handleClose}
                    className="bg-gray-500 px-6 py-2 text-white uppercase font-bold text-sm rounded-lg hover:bg-gray-600 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 px-6 py-2 text-white uppercase font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
};

export default ConsumptionSensorForm;