import {z} from 'zod'

const nameSchema = z
  .string()
  .min(5, "Name must be at least 5  characters")
  .max(100, "Name must be less than 100 characters");


  const typeSchema = z
  .enum(["CUSTOMER", "SUPPLIER"])

  const orgSchema =z
  .coerce.number()

  export const createPartySchema =z.object({
    body:z.object({
        name:nameSchema,
      phoneNumber: z.string().regex(/^\d{10}$/, "Phone must be 10 digits").optional(),
        type:typeSchema,
        organizationId:orgSchema

    })
  })
export const getPartiesSchema = z.object({
  query: z.object({
    organizationId: z.coerce.number()
  })
});

export const getPartyByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number()
  })
});

export const updatePartySchema = z.object({
  params: z.object({
    id: z.coerce.number()
  }),
  body: z.object({
    name: nameSchema.optional(),
    phone: z.string().regex(/^\d{10}$/).optional(),
    type: typeSchema.optional()
  })
});