const router = require("express").Router();
const slotController = require("../controllers/slot.controller");
const validate = require("../middlewares/validation.middleware");
const { bookSlotValidator } = require("../validators/slot.validator");
/**
 * @swagger
 * /slots/{slotId}/book:
 *   post:
 *     summary: Book an appointment slot
 *     description: Allows a patient to book an available slot by providing their details and a reason.
 *     tags:
 *       - Appointments
 *     parameters:
 *       - in: path
 *         name: slotId
 *         required: true
 *         description: The ID of the slot to be booked
 *         schema:
 *           type: string
 *           example: 67e63e48488b85e9c660bc21
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - mobile_number
 *               - reason
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Babu"
 *               last_name:
 *                 type: string
 *                 example: "Sona"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "babu@gmail.com"
 *               mobile_number:
 *                 type: string
 *                 example: "7751996767"
 *               reason:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 example: "Suffering from fever"
 *     responses:
 *       200:
 *         description: Slot booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Slot booked successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     booking_id:
 *                       type: string
 *                       example: "67e67307e132576a5039c518"
 *                     booking_time:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-28T09:59:35.276Z"
 *                     patient:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Babu Sona"
 *                         email:
 *                           type: string
 *                           example: "babu@gmail.com"
 *                         mobile_number:
 *                           type: string
 *                           example: "7751996767"
 *                     slot:
 *                       type: object
 *                       properties:
 *                         start_time:
 *                           type: string
 *                           example: "11:00"
 *                         end_time:
 *                           type: string
 *                           example: "11:30"
 *                         date:
 *                           type: string
 *                           format: date
 *                           example: "2025-12-29T18:30:00.000Z"
 *                         status:
 *                           type: string
 *                           example: "booked"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "email"
 *                       message:
 *                         type: string
 *                         example: "Invalid email format"
 *       404:
 *         description: Slot not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Slot not found"
 */

router.post(
  "/:slotId/book",
  bookSlotValidator,
  validate,
  slotController.bookSlot
);
module.exports = router;
