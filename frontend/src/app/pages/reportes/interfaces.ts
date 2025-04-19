export interface ActuadorDataRow {
    datetime: string;
    relay_water_count: number;
    relay_water_time: number;
    relay_light_count: number;
    relay_light_time: number;
    relay_aerator_count: number;
    relay_aerator_time: number;
    relay_vent_count: number;
    relay_vent_time: number;
    relay_ph_plus_count: number;
    relay_ph_plus_time: number;
    relay_ph_minus_count: number;
    relay_ph_minus_time: number;
    relay_nutri_1_count: number;
    relay_nutri_1_time: number;
    relay_nutri_2_count: number;
    relay_nutri_2_time: number;
    relay_nutri_3_count: number;
    relay_nutri_3_time: number;
    relay_nutri_4_count: number;
    relay_nutri_4_time: number;
    samples: number;
}

export interface EnvironmentalDataRow {
    datetime: string;
    temperature: number;
    humidity: number;
    atmospheric_pressure: number;
    co2: number;
    luminosity: number;
}

export interface ConsumptionDataRow {
    datetime: string;
    voltage: number;
    current: number;
    power: number;
    energy: number;
    frequency: number;
    power_factor: number;
    nutrient_1_level: number;
    nutrient_2_level: number;
    nutrient_3_level: number;
    nutrient_4_level: number;
    nutrient_5_level: number;
    nutrient_6_level: number;
}

export interface SolutionDataRow {
    datetime: string;
    temperature: number;
    level: number;
    tds: number;
    ph: number;
    ce: number;
}