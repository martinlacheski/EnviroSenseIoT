import { Ambiente } from "../../ambientes/interfaces";

interface SensorAmbiental {
    _id: string;
    description: string;
    sensor_code: string;

    temperature_alert: number;
    humidity_alert: number;
    atmospheric_pressure_alert: number;
    co2_alert: number;

    minutes_to_report: number;
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
    temperature_alert: 0,
    humidity_alert: 0,
    atmospheric_pressure_alert: 0,
    co2_alert: 0,
    minutes_to_report: 0,
    enabled: false,
};