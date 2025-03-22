import { Ambiente } from "../../ambientes/interfaces";

interface SensorActuador {
    _id: string;
    description: string;
    actuator_code: string;
    channel_1_enabled: boolean;
    channel_1_name: string;
    channel_1_time: number;
    channel_2_enabled: boolean;
    channel_2_name: string;
    channel_2_time: number;
    channel_3_enabled: boolean;
    channel_3_name: string;
    channel_3_time: number;
    channel_4_enabled: boolean;
    channel_4_name: string;
    channel_4_time: number;
    channel_5_enabled: boolean;
    channel_5_name: string;
    channel_5_time: number;
    channel_6_enabled: boolean;
    channel_6_name: string;
    channel_6_time: number;
    channel_7_enabled: boolean;
    channel_7_name: string;
    channel_7_time: number;
    channel_8_enabled: boolean;
    channel_8_name: string;
    channel_8_time: number;
    minutes_to_report: number;
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
    channel_1_enabled: false,
    channel_1_name: '',
    channel_1_time: 0,
    channel_2_enabled: false,
    channel_2_name: '',
    channel_2_time: 0,
    channel_3_enabled: false,
    channel_3_name: '',
    channel_3_time: 0,
    channel_4_enabled: false,
    channel_4_name: '',
    channel_4_time: 0,
    channel_5_enabled: false,
    channel_5_name: '',
    channel_5_time: 0,
    channel_6_enabled: false,
    channel_6_name: '',
    channel_6_time: 0,
    channel_7_enabled: false,
    channel_7_name: '',
    channel_7_time: 0,
    channel_8_enabled: false,
    channel_8_name: '',
    channel_8_time: 0,
    minutes_to_report: 0,
    enabled: false,
};

interface Helper {
    enabled: keyof SensorActuador;
    name: keyof SensorActuador;
    time: keyof SensorActuador;
}

export const initialHelpers: Helper[] = [
    {
        enabled: 'channel_1_enabled',
        name: 'channel_1_name',
        time: 'channel_1_time',
    },
    {
        enabled: 'channel_2_enabled',
        name: 'channel_2_name',
        time: 'channel_2_time',
    },
    {
        enabled: 'channel_3_enabled',
        name: 'channel_3_name',
        time: 'channel_3_time',
    },
    {
        enabled: 'channel_4_enabled',
        name: 'channel_4_name',
        time: 'channel_4_time',
    },
    {
        enabled: 'channel_5_enabled',
        name: 'channel_5_name',
        time: 'channel_5_time',
    },
    {
        enabled: 'channel_6_enabled',
        name: 'channel_6_name',
        time: 'channel_6_time',
    },
    {
        enabled: 'channel_7_enabled',
        name: 'channel_7_name',
        time: 'channel_7_time',
    },
    {
        enabled: 'channel_8_enabled',
        name: 'channel_8_name',
        time: 'channel_8_time',
    },
];