import { z } from "zod";


export const ConsumptionSensorSchema = z.object({
    id: z.string(),
    environment_id: z.string(),
    description: z.string(),
    sensor_code: z.string(),
    min_voltage_alert: z.number(),
    max_voltage_alert: z.number(),
    solution_level_alert: z.number(),
    nutrient_1_enabled: z.boolean(),
    nutrient_1_type_id: z.string(),
    nutrient_1_alert: z.number(),
    nutrient_2_enabled: z.boolean(),
    nutrient_2_type_id: z.string(),
    nutrient_2_alert: z.number(),
    nutrient_3_enabled: z.boolean(),
    nutrient_3_type_id: z.string(),
    nutrient_3_alert: z.number(),
    nutrient_4_enabled: z.boolean(),
    nutrient_4_type_id: z.string(),
    nutrient_4_alert: z.number(),
    nutrient_5_enabled: z.boolean(),
    nutrient_5_type_id: z.string(),
    nutrient_5_alert: z.number(),
    nutrient_6_enabled: z.boolean(),
    nutrient_6_type_id: z.string(),
    nutrient_6_alert: z.number(),
    minutes_to_report: z.number(),
    enabled: z.boolean(),
})

export type ConsumptionSensor = z.infer<typeof ConsumptionSensorSchema>

export type CreateConsumptionSensor = Pick<ConsumptionSensor, 'environment_id' | 'description'
    | 'sensor_code' | 'min_voltage_alert' | 'max_voltage_alert' | 'solution_level_alert'
    | 'nutrient_1_enabled' | 'nutrient_1_type_id' | 'nutrient_1_alert' | 'nutrient_2_enabled'
    | 'nutrient_2_type_id' | 'nutrient_2_alert' | 'nutrient_3_enabled' | 'nutrient_3_type_id'
    | 'nutrient_3_alert' | 'nutrient_4_enabled' | 'nutrient_4_type_id' | 'nutrient_4_alert'
    | 'nutrient_5_enabled' | 'nutrient_5_type_id' | 'nutrient_5_alert' | 'nutrient_6_enabled'
    | 'nutrient_6_type_id' | 'nutrient_6_alert' | 'minutes_to_report' | 'enabled'>

// Listar
export const ConsumptionSensorListSchema = z.array(ConsumptionSensorSchema)


