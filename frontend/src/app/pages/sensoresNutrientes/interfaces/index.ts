import { Ambiente } from "../../ambientes/interfaces";

interface SensorNutriente {
    _id: string;
    description: string;
    sensor_code: string;

    temperature_alert_min: number;
    temperature_alert_max: number;
    tds_alert_min: number;
    tds_alert_max: number;
    ph_alert_min: number;
    ph_alert_max: number;
    ce_alert_min: number;
    ce_alert_max: number;

    seconds_to_report: number;
    enabled: boolean;
}

export interface SensorNutrienteForm extends SensorNutriente {
    environment: string;
}

export interface SensorNutrienteList extends SensorNutriente {
    environment: Ambiente;
}

export const initialForm: SensorNutrienteForm = {
    _id: '',
    environment: '',
    description: '',
    sensor_code: '',
    temperature_alert_min: 0,
    temperature_alert_max: 0,
    tds_alert_min: 0,
    tds_alert_max: 0,
    ph_alert_min: 0,
    ph_alert_max: 0,
    ce_alert_min: 0,
    ce_alert_max: 0,
    seconds_to_report: 0,
    enabled: false,
};