const {z} = require('zod');

// User registration validation schema
const registerSchema = z.object({
    name: z.string({required_error: "Name is required"}).min(3, "Name must be at least 3 characters"),
    email: z.string({required_error: "Email is required"}).email("Invalid email address"),
    password: z.string({required_error: "Password is required"}).min(6, "Password must be at least 6 characters")
  });

// Login validation schema
const loginSchema = z.object({
    email: z.string({required_error: "Email is required"}).email("Invalid email address"),
    password: z.string({required_error: "Password is required"})
  });


module.exports = {registerSchema, loginSchema};