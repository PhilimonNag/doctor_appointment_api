const router = require("express").Router();
const doctorController = require("../controllers/doctor.controller");
const validate = require("../middlewares/validation.middleware");
const { doctorCreateValidator } = require("../validators/doctor.validator");
const slotController = require("../controllers/slot.controller");
const { createSlotValidator } = require("../validators/slot.validator");

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: APIs for managing doctors and their slots
 */

/**
 * @swagger
 * /api/v1/doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - first_name
 *               - last_name
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: "drjohn"
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "dr.john@example.com"
 *     responses:
 *       201:
 *         description: Doctor created successfully
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
 *                   example: "Doctor created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "67e66cbf2915e54656b2fc7a"
 *                     username:
 *                       type: string
 *                       example: "drjohn"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "dr.john@example.com"
 *       400:
 *         description: Validation error / Duplicate username
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
 *                   example: "The username 'drjohn' is already taken. Please use a different username."
 *                 error:
 *                   type: string
 *                   example: "MongoServerError: E11000 duplicate key error collection..."
 */
router.post(
  "/",
  doctorCreateValidator,
  validate,
  doctorController.createDoctor
);
/**
 * @swagger
 * /api/v1/doctors/{doctorId}/slots:
 *   post:
 *     summary: Create recurring slots for a doctor
 *     tags: [Slots]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - start_time
 *               - end_time
 *               - slot_duration
 *               - recurrence_type
 *             properties:
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-01T10:00:00Z"
 *                 description: Start time of the slot (ISO 8601 format)
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-01T12:00:00Z"
 *                 description: End time of the slot (ISO 8601 format). Must be after start_time.
 *               slot_duration:
 *                 type: integer
 *                 enum: [15, 30]
 *                 example: 30
 *                 description: Duration of each slot in minutes. Allowed values are 15 or 30.
 *               recurrence_type:
 *                 type: string
 *                 enum: ["daily", "weekly", "one-time"]
 *                 example: "weekly"
 *                 description: Type of recurrence for the slots.
 *               repeat_until:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-01T00:00:00Z"
 *                 description: The date until which the slots should repeat (only required for "daily" and "weekly").
 *               weekdays:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]
 *                 example: ["MO", "WE", "FR"]
 *                 description: Required for "weekly" recurrence. Days on which the slots should be created.
 *               one_time_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-15T10:00:00Z"
 *                 description: Required for "one-time" recurrence. The exact date and time for the slot.
 *     responses:
 *       201:
 *         description: Slots created successfully
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
 *                   example: "Slots created successfully"
 *                 data:
 *                    type: object
 *                    properties:
 *                       recurrence_id:
 *                         type: string
 *                         example: "67e66cbf2915e54656b2fc7a"
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
 *                   example: "slot_duration must be 15 or 30 minutes"
 *                 error:
 *                   type: string
 *                   example: "ValidationError: start_time is required"
 */
router.post(
  "/:doctorId/slots",
  createSlotValidator,
  validate,
  slotController.createRecurringSlots
);

/**
 * @swagger
 * /api/v1/doctors/{doctorId}/bookings:
 *   get:
 *     summary: Get all booked appointments for a doctor
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the doctor
 *     responses:
 *       200:
 *         description: List of booked appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "67e64c817a6d7d5a5634d244"
 *                       slot:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "67e63e48488b85e9c660bc1f"
 *                           start_time:
 *                             type: string
 *                             example: "10:00"
 *                           end_time:
 *                             type: string
 *                             example: "10:30"
 *                       patient:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "67e64c817a6d7d5a5634d242"
 *                           first_name:
 *                             type: string
 *                             example: "Babu"
 *                           last_name:
 *                             type: string
 *                             example: "Sona"
 *                           email:
 *                             type: string
 *                             example: "babu@gmail.com"
 *                           mobile_number:
 *                             type: string
 *                             example: "7751996767"
 *                       reason:
 *                         type: string
 *                         example: "suffering from fever"
 *                       booking_time:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-28T07:15:13.888Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-28T07:15:13.889Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-28T07:15:13.889Z"
 *                       __v:
 *                         type: integer
 *                         example: 0
 *       404:
 *         description: No bookings found
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
 *                   example: "No bookings found for this doctor."
 */
router.get("/:doctorId/bookings", doctorController.getBookedAppointments);
/**
 * @swagger
 * /api/v1/doctors/{doctorId}/available_slots:
 *   get:
 *     summary: Get available slots for a doctor
 *     tags: [Slots]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the doctor
 *     responses:
 *       200:
 *         description: List of available slots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "67e63e48488b85e9c660bc23"
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-12-29T18:30:00.000Z"
 *                       start_time:
 *                         type: string
 *                         example: "10:30"
 *                       end_time:
 *                         type: string
 *                         example: "11:00"
 *       404:
 *         description: No available slots found
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
 *                   example: "No available slots found for this doctor."
 */
router.get("/:doctorId/available_slots", doctorController.getAvailableSlots);
module.exports = router;
