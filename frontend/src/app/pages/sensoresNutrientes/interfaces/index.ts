import { Ambiente } from "../../ambientes/interfaces";

interface SensorNutriente {
    _id: string;
    description: string;
    sensor_code: string;

    temperature_alert: number;
    tds_alert: number;
    ph_alert: number;
    ce_alert: number;

    minutes_to_report: number;
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
    temperature_alert: 0,
    tds_alert: 0,
    ph_alert: 0,
    ce_alert: 0,
    minutes_to_report: 0,
    enabled: false,
};