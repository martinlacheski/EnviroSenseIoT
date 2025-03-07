import { z } from "zod";


export const NutrientSolutionSensorSchema = z.object({
    id: z.string(),
    environment_id: z.string(),
    description: z.string(),
    sensor_code: z.string(),
    temperature_alert: z.number(),
    tds_alert: z.number(),
    ph_alert: z.number(),
    ce_alert: z.number(),
    minutes_to_report: z.number(),
    enabled: z.boolean(),
})

export type NutrientSolutionSensor = z.infer<typeof NutrientSolutionSensorSchema>

export type CreateNutrientSolutionSensor = Pick<NutrientSolutionSensor, 'environment_id' | 'description' | 'sensor_code'
    | 'temperature_alert' | 'tds_alert' | 'ph_alert' | 'ce_alert' | 'minutes_to_report' | 'enabled'>

// Listar
export const NutrientSolutionSensorListSchema = z.array(NutrientSolutionSensorSchema)


