import { z } from "zod";


export const EnvironmentalSensorSchema = z.object({
    id: z.string(),
    environment_id: z.string(),
    description: z.string(),
    sensor_code: z.string(),
    temperature_alert: z.number(),
    humidity_alert: z.number(),
    atmospheric_pressure_alert: z.number(),
    co2_alert: z.number(),
    minutes_to_report: z.number(),
    enabled: z.boolean(),
})

export type EnvironmentalSensor = z.infer<typeof EnvironmentalSensorSchema>

export type CreateEnvironmentalSensor = Pick<EnvironmentalSensor, 'environment_id' | 'description' | 'sensor_code'
    | 'temperature_alert' | 'humidity_alert' | 'atmospheric_pressure_alert' | 'co2_alert' | 'minutes_to_report' | 'enabled'>

// Listar
export const EnvironmentalSensorListSchema = z.array(EnvironmentalSensorSchema)


