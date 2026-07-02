import {z} from 'zod'


export const createOrganizationSchema=z.object({
    body:z.object({
        name:z.string().min(5, "Name must be at least 5 characters")
  .max(100, "Name must be less than 100 characters")
    })
})