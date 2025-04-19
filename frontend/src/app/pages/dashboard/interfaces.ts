export interface EnvironmentSensors {
    environment: Environment;
    environmentalSensors: EnvironmentSensor[];
    consumptionSensors: EnvironmentSensor[];
    nutrientSolutionSensors: EnvironmentSensor[];
    actuators: EnvironmentActuator[];
}

export interface Environment {
    _id: string;
    company: {
        id: string;
        name: string;
    }
    city: {
        id: string;
        province: {
            id: string;
            country: {
                id: string;
                name: string;
            }
            name: string;
        }
        name: string;
        postal_code: string;
    }
    type: {
        id: string;
        name: string;
    }
    name: string;
    address: string;
    gps_location: string;
    description: string;
};

export interface EnvironmentSensor {
    sensor_code: string;
    description: string;
}

export interface EnvironmentActuator {
    actuator_code: string;
    description: string;
}

export interface WSMessage {
    type: 'actuators' | 'environmental' | 'consumption' | 'nutrient_solution';
    data: ActuatorData | EnvironmentalData | ConsumptionData | NutrientSolutionData;
    timestamp: string;
}

export interface ActuatorData {
    relay_ph_plus: number,
    relay_ph_minus: number,

    relay_nutri_1: number,
    relay_nutri_2: number,
    relay_nutri_3: number,
    relay_nutri_4: number,
    
    relay_water: number,
    relay_vent: number,
    relay_aerator: number,
    relay_light: number
    
    actuator_code: string,
    datetime: string,
}

export interface ConsumptionData {
    nutrient_1_level: number;
    nutrient_2_level: number;
    nutrient_3_level: number;
    nutrient_4_level: number;
    nutrient_5_level: number;
    nutrient_6_level: number;
    
    current: number;
    energy: number;
    power: number;
    voltage: number;
    
    frecuency: number;
    power_factor: number;
    
    sensor_code: string;
    datetime: string;
}

export interface NutrientSolutionData {
    ph: number;
    ce: number;
    level: number;

    tds: number;
    temperature: number;

    ec_mS: number;
    ec_uS: number;
    sensor_code: string;
    datetime: string;
}

export interface EnvironmentalData {
    temperature: number;
    co2: number;
    humidity: number;
    datetime: string;
    atmospheric_pressure: number;
    luminosity: number;
    sensor_code: string;
}
