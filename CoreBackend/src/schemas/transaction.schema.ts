import {z} from 'zod'

  const flowSchema = z
  .enum(["IN", "OUT"])

  const typeSchema = z
  .enum(["CASH", "QR","CREDIT"])


  const orgSchema =z
  .coerce.number()

  const amountSchema=z.number().positive("Amount must be greater than 0")

  export const createTransSchema=z.object({
    body:z.object({
        flow:flowSchema,
      amount: amountSchema,
        type:typeSchema,
        partyId: z.coerce.number(),
        organizationId:orgSchema,
        note:z.string().optional()

    })
  })

  export const getTransactionsSchema = z.object({
  query: z.object({
    organizationId: orgSchema
  })
});

export const getTransByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number()
  })
});