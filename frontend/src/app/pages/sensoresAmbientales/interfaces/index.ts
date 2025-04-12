import { Ambiente } from "../../ambientes/interfaces";

interface SensorAmbiental {
    _id: string;
    description: string;
    sensor_code: string;

    temperature_alert_min: number;
    temperature_alert_max: number;
    humidity_alert_min: number;
    humidity_alert_max: number;
    atmospheric_pressure_alert_min: number;
    atmospheric_pressure_alert_max: number;
    co2_alert_min: number;
    co2_alert_max: number;

    seconds_to_report: number;
    enabled: boolean;
}

export interface SensorAmbientalForm extends SensorAmbiental {
    environment: string;
}

export interface SensorAmbientalList extends SensorAmbiental {
    environment: Ambiente;
}

export const initialForm: SensorAmbientalForm = {
    _id: '',
    environment: '',
    description: '',
    sensor_code: '',
    temperature_alert_min: 0,
    temperature_alert_max: 0,
    humidity_alert_min: 0,
    humidity_alert_max: 0,
    atmospheric_pressure_alert_min: 0,
    atmospheric_pressure_alert_max: 0,
    co2_alert_min: 0,
    co2_alert_max: 0,
    seconds_to_report: 0,
    enabled: false,
};