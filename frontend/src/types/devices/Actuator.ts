import { z } from "zod";


export const ActuatorSchema = z.object({
    id: z.string(),
    environment_id: z.string(),
    description: z.string(),
    actuator_code: z.string(),
    channel_1_enabled: z.boolean(),
    channel_1_name: z.string(),
    channel_1_time: z.number(),
    channel_2_enabled: z.boolean(),
    channel_2_name: z.string(),
    channel_2_time: z.number(),
    channel_3_enabled: z.boolean(),
    channel_3_name: z.string(),
    channel_3_time: z.number(),
    channel_4_enabled: z.boolean(),
    channel_4_name: z.string(),
    channel_4_time: z.number(),
    channel_5_enabled: z.boolean(),
    channel_5_name: z.string(),
    channel_5_time: z.number(),
    channel_6_enabled: z.boolean(),
    channel_6_name: z.string(),
    channel_6_time: z.number(),
    minutes_to_report: z.number(),
    enabled: z.boolean(),
})

export type Actuator = z.infer<typeof ActuatorSchema>

export type CreateActuatorr = Pick<Actuator, 'environment_id' | 'description' | 'actuator_code' 
    | 'channel_1_enabled' | 'channel_1_name' | 'channel_1_time' | 'channel_2_enabled'
    | 'channel_2_name' | 'channel_2_time' | 'channel_3_enabled' | 'channel_3_name'
    | 'channel_3_time' | 'channel_4_enabled' | 'channel_4_name' | 'channel_4_time'
    | 'channel_5_enabled' | 'channel_5_name' | 'channel_5_time' | 'channel_6_enabled'
    | 'channel_6_name' | 'channel_6_time' | 'minutes_to_report' | 'enabled'>

// Listar
export const ActuatorListSchema = z.array(ActuatorSchema)


