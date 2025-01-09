import { z } from "zod"; // zod is a validation library used to validate the data sent to the server

//VERY SIMILAR TO A DTO

// They just use validation

// This is how we call a zod schema
export const loginSchema = z.object({
  username: z //<-- Define the name with :z 
    .string()
    .min(1, "Username is required"), //<-- Define the error message 1, is needed
  password: z
    .string() //<-- Define the datatype
    .min(1, "Password is required") //<-- Define the error message
});

export type LoginSchema = z.infer<typeof loginSchema>;  //Type GUARD
// Generates a TypeScript type based on a zod schema
// By using z.infer, your TypeScript types always match your Zod schema.