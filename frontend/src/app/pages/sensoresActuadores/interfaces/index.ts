import { Ambiente } from "../../ambientes/interfaces";

interface SensorActuador {
    _id: string;
    description: string;
    actuator_code: string;
    relay_water_enabled: boolean;
    relay_water_time: number;
    relay_aerator_enabled: boolean;
    relay_aerator_time: number;
    relay_vent_enabled: boolean;
    relay_vent_time: number;
    relay_light_enabled: boolean;
    relay_light_time: number;
    relay_ph_plus_enabled: boolean;
    relay_ph_plus_time: number;
    relay_ph_minus_enabled: boolean;
    relay_ph_minus_time: number;
    relay_nutri_1_enabled: boolean;
    relay_nutri_1_time: number;
    relay_nutri_2_enabled: boolean;
    relay_nutri_2_time: number;
    relay_nutri_3_enabled: boolean;
    relay_nutri_3_time: number;
    relay_nutri_4_enabled: boolean;
    relay_nutri_4_time: number;
    seconds_to_report: number;
    enabled: boolean;
}

export interface SensorActuadorForm extends SensorActuador {
    environment: string;
}

export interface SensorActuadorList extends SensorActuador {
    environment: Ambiente;
}

export const initialForm: SensorActuadorForm = {
    _id: '',
    environment: '',
    description: '',
    actuator_code: '',
    relay_water_enabled: false,
    relay_water_time: 0,
    relay_aerator_enabled: false,
    relay_aerator_time: 0,
    relay_vent_enabled: false,
    relay_vent_time: 0,
    relay_light_enabled: false,
    relay_light_time: 0,
    relay_ph_plus_enabled: false,
    relay_ph_plus_time: 0,
    relay_ph_minus_enabled: false,
    relay_ph_minus_time: 0,
    relay_nutri_1_enabled: false,
    relay_nutri_1_time: 0,
    relay_nutri_2_enabled: false,
    relay_nutri_2_time: 0,
    relay_nutri_3_enabled: false,
    relay_nutri_3_time: 0,
    relay_nutri_4_enabled: false,
    relay_nutri_4_time: 0,
    seconds_to_report: 0,
    enabled: false,
};

interface Helper {
    enabled: keyof SensorActuador;
    name: string;
    time: keyof SensorActuador;
}

export const initialHelpers: Helper[] = [
    {
        enabled: 'relay_water_enabled',
        name: 'Relay de agua',
        time: 'relay_water_time',
    },
    {
        enabled: 'relay_aerator_enabled',
        name: 'Relay de aireador',
        time: 'relay_aerator_time',
    },
    {
        enabled: 'relay_vent_enabled',
        name: 'Relay de ventilación',
        time: 'relay_vent_time',
    },
    {
        enabled: 'relay_light_enabled',
        name: 'Relay de iluminación',
        time: 'relay_light_time',
    },
    {
        enabled: 'relay_ph_plus_enabled',
        name: 'Relay de pH +',
        time: 'relay_ph_plus_time',
    },
    {
        enabled: 'relay_ph_minus_enabled',
        name: 'Relay de pH -',
        time: 'relay_ph_minus_time',
    },
    {
        enabled: 'relay_nutri_1_enabled',
        name: 'Relay de nutriente 1',
        time: 'relay_nutri_1_time',
    },
    {
        enabled: 'relay_nutri_2_enabled',
        name: 'Relay de nutriente 2',
        time: 'relay_nutri_2_time',
    },
    {
        enabled: 'relay_nutri_3_enabled',
        name: 'Relay de nutriente 3',
        time: 'relay_nutri_3_time',
    },
    {
        enabled: 'relay_nutri_4_enabled',
        name: 'Relay de nutriente 4',
        time: 'relay_nutri_4_time',
    },
];