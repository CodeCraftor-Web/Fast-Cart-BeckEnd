const {z} = require('zod');


const postOrderSchema = z.object({
  customerName: z.string({required_error: "Customer name is required"}),
  customerEmail: z.string({required_error: "Email is required"}).email("Invalid email address"),
  customerId: z.string({required_error: "ID is required"}),
  phone:z.string({required_error: "Phone number is required"}).phone(),
  items: z.array(),
  totalPrice: z.number(),
  paymentMethod: z.string(),
  paymentNumber: z.string(),
  deliveryAddress: z.object(),
});



module.exports = {postOrderSchema};