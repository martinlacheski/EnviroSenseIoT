import { Ambiente } from "../../ambientes/interfaces";

interface NutrientType {
    id: string;
    name: string;
}

interface SensorConsumo {
    _id: string;
    description: string;
    sensor_code: string;

    min_voltage_alert: number;
    max_voltage_alert: number;
    solution_level_alert: number;

    nutrient_1_enabled: boolean;
    nutrient_1_alert: number;
    nutrient_2_enabled: boolean;
    nutrient_2_alert: number;
    nutrient_3_enabled: boolean;
    nutrient_3_alert: number;
    nutrient_4_enabled: boolean;
    nutrient_4_alert: number;
    nutrient_5_enabled: boolean;
    nutrient_5_alert: number;
    nutrient_6_enabled: boolean;
    nutrient_6_alert: number;

    seconds_to_report: number;
    enabled: boolean;
}

export interface SensorConsumoForm extends SensorConsumo {
    environment: string;
    nutrient_1_type: string;
    nutrient_2_type: string;
    nutrient_3_type: string;
    nutrient_4_type: string;
    nutrient_5_type: string;
    nutrient_6_type: string;
}

export interface SensorConsumoList extends SensorConsumo {
    environment: Ambiente;
    nutrient_1_type: NutrientType;
    nutrient_2_type: NutrientType;
    nutrient_3_type: NutrientType;
    nutrient_4_type: NutrientType;
    nutrient_5_type: NutrientType;
    nutrient_6_type: NutrientType;
}

export const initialForm: SensorConsumoForm = {
    _id: '',
    environment: '',
    description: '',
    sensor_code: '',
    min_voltage_alert: 0,
    max_voltage_alert: 0,
    solution_level_alert: 0,
    nutrient_1_enabled: false,
    nutrient_1_type: '',
    nutrient_1_alert: 0,
    nutrient_2_enabled: false,
    nutrient_2_type: '',
    nutrient_2_alert: 0,
    nutrient_3_enabled: false,
    nutrient_3_type: '',
    nutrient_3_alert: 0,
    nutrient_4_enabled: false,
    nutrient_4_type: '',
    nutrient_4_alert: 0,
    nutrient_5_enabled: false,
    nutrient_5_type: '',
    nutrient_5_alert: 0,
    nutrient_6_enabled: false,
    nutrient_6_type: '',
    nutrient_6_alert: 0,


    seconds_to_report: 0,
    enabled: false,
};

interface Helper {
    enabled: keyof SensorConsumoForm;
    type: keyof SensorConsumoForm;
    alert: keyof SensorConsumoForm;
}

export const initialHelpers: Helper[] = [
    {
        enabled: 'nutrient_1_enabled',
        type: 'nutrient_1_type',
        alert: 'nutrient_1_alert',
    },
    {
        enabled: 'nutrient_2_enabled',
        type: 'nutrient_2_type',
        alert: 'nutrient_2_alert',
    },
    {
        enabled: 'nutrient_3_enabled',
        type: 'nutrient_3_type',
        alert: 'nutrient_3_alert',
    },
    {
        enabled: 'nutrient_4_enabled',
        type: 'nutrient_4_type',
        alert: 'nutrient_4_alert',
    },
    {
        enabled: 'nutrient_5_enabled',
        type: 'nutrient_5_type',
        alert: 'nutrient_5_alert',
    },
    {
        enabled: 'nutrient_6_enabled',
        type: 'nutrient_6_type',
        alert: 'nutrient_6_alert',
    },
];