import { createActuator, getEnvironments, getNutrientTypes, updateActuator } from "@/api/index";
import { Actuator } from "@/types/index";
import { Switch, TextField } from "@mui/material";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";


/* const useStyles = makeStyles({
    textField: {
        "& .MuiOutlinedInput-root": {
            borderRadius: 0, // Quita el borde redondeado
        },
    },
}); */

const ActuatorForm = (props: { handleClose: () => void; actuator?: Actuator }) => {
    const [id, setId] = useState("");
    const [environment_id, setEnvironmentId] = useState("");
    const [description, setDescription] = useState("");
    const [actuator_code, setActuatorCode] = useState("");
    const [channel_1_enabled, setChannel1Enabled] = useState(false);
    const [channel_1_name, setChannel1Name] = useState("");
    const [channel_1_time, setChannel1Time] = useState("");
    const [channel_2_enabled, setChannel2Enabled] = useState(false);
    const [channel_2_name, setChannel2Name] = useState("");
    const [channel_2_time, setChannel2Time] = useState("");
    const [channel_3_enabled, setChannel3Enabled] = useState(false);
    const [channel_3_name, setChannel3Name] = useState("");
    const [channel_3_time, setChannel3Time] = useState("");
    const [channel_4_enabled, setChannel4Enabled] = useState(false);
    const [channel_4_name, setChannel4Name] = useState("");
    const [channel_4_time, setChannel4Time] = useState("");
    const [channel_5_enabled, setChannel5Enabled] = useState(false);
    const [channel_5_name, setChannel5Name] = useState("");
    const [channel_5_time, setChannel5Time] = useState("");
    const [channel_6_enabled, setChannel6Enabled] = useState(false);
    const [channel_6_name, setChannel6Name] = useState("");
    const [channel_6_time, setChannel6Time] = useState("");
    const [minutes_to_report, setMinutesToReport] = useState("");
    const [enabled, setEnabled] = useState(false);

    // Estados para manejar errores de validación
    const [channel1Error, setChannel1Error] = useState("");
    const [channel2Error, setChannel2Error] = useState("");
    const [channel3Error, setChannel3Error] = useState("");
    const [channel4Error, setChannel4Error] = useState("");
    const [channel5Error, setChannel5Error] = useState("");
    const [channel6Error, setChannel6Error] = useState("");
    const [minutesError, setMinutesError] = useState("");

    const queryClient = useQueryClient();

    // Obtener la lista de tipos de ambientes
    const { data: environments } = useQuery({
        queryKey: ['environments'],
        queryFn: () => getEnvironments(),
    });

    useEffect(() => {
        if (props.actuator) { // Precargar si estamos editando
            setId(props.actuator.id);
            setEnvironmentId(props.actuator.environment_id);
            setDescription(props.actuator.description);
            setActuatorCode(props.actuator.actuator_code);
            setChannel1Enabled(props.actuator.channel_1_enabled);
            setChannel1Name(props.actuator.channel_1_name.toString());
            setChannel1Time(props.actuator.channel_1_time.toString());
            setChannel2Enabled(props.actuator.channel_2_enabled);
            setChannel2Name(props.actuator.channel_2_name.toString());
            setChannel2Time(props.actuator.channel_2_time.toString());
            setChannel3Enabled(props.actuator.channel_3_enabled);
            setChannel3Name(props.actuator.channel_3_name.toString());
            setChannel3Time(props.actuator.channel_3_time.toString());
            setChannel4Enabled(props.actuator.channel_4_enabled);
            setChannel4Name(props.actuator.channel_4_name.toString());
            setChannel4Time(props.actuator.channel_4_time.toString());
            setChannel5Enabled(props.actuator.channel_5_enabled);
            setChannel5Name(props.actuator.channel_5_name.toString());
            setChannel5Time(props.actuator.channel_5_time.toString());
            setChannel6Enabled(props.actuator.channel_6_enabled);
            setChannel6Name(props.actuator.channel_6_name.toString());
            setChannel6Time(props.actuator.channel_6_time.toString());
            setMinutesToReport(props.actuator.minutes_to_report.toString());
            setEnabled(props.actuator.enabled);
        }
    }, [props.actuator]);

    const { mutate } = useMutation({
        mutationFn: (formData: {
            id?: string; environment_id: string, description: string, actuator_code: string,
            channel_1_enabled: boolean, channel_1_name: string, channel_1_time: string,
            channel_2_enabled: boolean, channel_2_name: string, channel_2_time: string,
            channel_3_enabled: boolean, channel_3_name: string, channel_3_time: string,
            channel_4_enabled: boolean, channel_4_name: string, channel_4_time: string,
            channel_5_enabled: boolean, channel_5_name: string, channel_5_time: string,
            channel_6_enabled: boolean, channel_6_name: string, channel_6_time: string,
            minutes_to_report: string, enabled: boolean
        }) => {
            if (props.actuator) {
                // Si hay un actuador, actualizamos
                return updateActuator({ formData, actuatorId: props.actuator.id });
            } else {
                // Si no hay actuador, creamos uno nuevo
                return createActuator(formData);
            }
        },
        onError: (error: { message: string }) => {
            if (error.message.includes("Ya existe un actuador con ese código")) {
                toast.error("Ya existe un actuador con ese código");
            } else {
                toast.error(error.message);
            }
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Operación exitosa");
            queryClient.invalidateQueries({ queryKey: ["actuators"] });
            props.handleClose();
        },
    });

    const validateForm = () => {
        let isValid = true;


        // Validar canal 1 (0 a 1440)
        const channel_1 = parseFloat(channel_1_time);
        if (isNaN(channel_1) || channel_1 < 0 || channel_1 > 1440) {
            setChannel1Error("El tiempo debe estar entre 0 y 1440");
            isValid = false;
        } else {
            setChannel1Error("");
        }

        // Validar canal 2 (0 a 1440)
        const channel_2 = parseFloat(channel_2_time);
        if (isNaN(channel_2) || channel_2 < 0 || channel_2 > 1440) {
            setChannel2Error("El tiempo debe estar entre 0 y 1440");
            isValid = false;
        } else {
            setChannel1Error("");
        }

        // Validar canal 3 (0 a 1440)
        const channel_3 = parseFloat(channel_3_time);
        if (isNaN(channel_3) || channel_3 < 0 || channel_3 > 1440) {
            setChannel3Error("El tiempo debe estar entre 0 y 1440");
            isValid = false;
        } else {
            setChannel3Error("");
        }

        // Validar canal 4 (0 a 1440)
        const channel_4 = parseFloat(channel_4_time);
        if (isNaN(channel_4) || channel_4 < 0 || channel_4 > 1440) {
            setChannel4Error("El tiempo debe estar entre 0 y 1440");
            isValid = false;
        } else {
            setChannel4Error("");
        }

        // Validar canal 5 (0 a 1440)
        const channel_5 = parseFloat(channel_5_time);
        if (isNaN(channel_5) || channel_5 < 0 || channel_5 > 1440) {
            setChannel5Error("El tiempo debe estar entre 0 y 1440");
            isValid = false;
        } else {
            setChannel5Error("");
        }

        // Validar canal 6 (0 a 1440)
        const channel_6 = parseFloat(channel_6_time);
        if (isNaN(channel_6) || channel_6 < 0 || channel_6 > 1440) {
            setChannel6Error("El tiempo debe estar entre 0 y 1440");
            isValid = false;
        } else {
            setChannel6Error("");
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
            id, environment_id, description, actuator_code,
            channel_1_enabled, channel_1_name, channel_1_time,
            channel_2_enabled, channel_2_name, channel_2_time,
            channel_3_enabled, channel_3_name, channel_3_time,
            channel_4_enabled, channel_4_name, channel_4_time,
            channel_5_enabled, channel_5_name, channel_5_time,
            channel_6_enabled, channel_6_name, channel_6_time,
            minutes_to_report, enabled
        });
    };

    // const classes = useStyles();

    return (
        <form onSubmit={handleForm} className="space-y-2 mx-auto p-5 bg-white rounded-lg">
            <p className="text-2xl font-light text-gray-500 mb-6">
                {props.actuator ? "Editar Actuador" : "Crear Actuador"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="type_id" className="text-sm uppercase font-bold text-gray-700">
                        Ambiente
                    </label>
                    <select
                        id="type_id"
                        className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Descripción"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="actuator_code" className="text-sm uppercase font-bold text-gray-700">
                        Código del Actuador
                    </label>
                    <input
                        id="actuator_code"
                        className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Código"
                        required
                        value={actuator_code}
                        onChange={(e) => setActuatorCode(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    // className={classes.textField} // Aplica los estilos personalizados
                    />
                </div>
                <div>
                    <label htmlFor="enabled" className="text-sm uppercase font-bold text-gray-700">
                        Actuador activo
                    </label>
                    <Switch
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>
            </div>

            {[1, 2, 3, 4, 5, 6].map((channelNumber) => ( //Nutrientes
                <div key={channelNumber} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor={`channel_${channelNumber}_enabled`} className="text-sm uppercase font-bold text-gray-700">
                            Canal {channelNumber}
                        </label>
                        <Switch
                            checked={eval(`channel_${channelNumber}_enabled`)}
                            onChange={(e) => eval(`setChannel${channelNumber}Enabled(e.target.checked)`)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor={`channel_${channelNumber}_name`} className="text-sm uppercase font-bold text-gray-700">
                            Nombre {channelNumber}
                        </label>
                        <input
                            id={`channel_${channelNumber}_name`}
                            className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Nombre"
                            required
                            value={eval(`channel_${channelNumber}_name`) || "Canal inactivo"}
                            onChange={(e) => eval(`setChannel${channelNumber}Name(e.target.value)`)}
                        />
                    </div>
                    <div>
                        <label htmlFor={`channel_${channelNumber}_time`} className="text-sm uppercase font-bold text-gray-700">
                            Tiempo {channelNumber}
                        </label>
                        <TextField
                            id={`channel_${channelNumber}_time`}
                            type="number"
                            fullWidth
                            value={eval(`channel_${channelNumber}_time`)}
                            onChange={(e) => eval(`setChannel${channelNumber}Time(e.target.value)`)}
                            inputProps={{ min: 0, max: 1440 }}
                            error={!!eval(`channel${channelNumber}Error`)}
                            helperText={eval(`channel${channelNumber}Error`)}
                            variant="outlined"
                            size="small"
                        // className={classes.textField} // Aplica los estilos personalizados
                        />
                    </div>
                </div>
            ))}

            <div className="flex justify-end space-x-4 mt-6">
                <button
                    type="button"
                    onClick={props.handleClose}
                    className="bg-gray-500 px-6 py-2 text-white uppercase font-bold text-sm rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 px-6 py-2 text-white uppercase font-bold text-sm rounded-lg transition-colors"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
};

export default ActuatorForm;