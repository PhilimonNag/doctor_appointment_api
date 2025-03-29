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
 *               - userName
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "drjohn"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
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
 *                     userName:
 *                       type: string
 *                       example: "drjohn"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "dr.john@example.com"
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
 *               - startTime
 *               - endTime
 *               - slotDuration
 *               - recurrenceType
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: dateTime
 *                 example: "2025-04-01T10:00:00Z"
 *                 description: Start time of the slot (ISO 8601 format)
 *               endTime:
 *                 type: string
 *                 format: dateTime
 *                 example: "2025-04-01T12:00:00Z"
 *                 description: End time of the slot (ISO 8601 format). Must be after startTime.
 *               slotDuration:
 *                 type: integer
 *                 enum: [15, 30]
 *                 example: 30
 *                 description: Duration of each slot in minutes. Allowed values are 15 or 30.
 *               recurrenceType:
 *                 type: string
 *                 enum: ["daily", "weekly", "oneTime"]
 *                 example: "weekly"
 *                 description: Type of recurrence for the slots.
 *               repeatUntil:
 *                 type: string
 *                 format: dateTime
 *                 example: "2025-05-01T00:00:00Z"
 *                 description: The date until which the slots should repeat (only required for "daily" and "weekly").
 *               weekDays:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]
 *                 example: ["MO", "WE", "FR"]
 *                 description: Required for "weekly" recurrence. Days on which the slots should be created.
 *               oneTimeDate:
 *                 type: string
 *                 format: dateTime
 *                 example: "2025-04-15T10:00:00Z"
 *                 description: Required for "oneTime" recurrence. The exact date and time for the slot.
 *           examples:
 *             dailyExample:
 *               summary: Daily recurring slots
 *               value:
 *                 startTime: "2025-04-01T08:00:00Z"
 *                 endTime: "2025-04-01T12:00:00Z"
 *                 slotDuration: 30
 *                 recurrenceType: "daily"
 *                 repeatUntil: "2025-04-10T23:59:59Z"
 *             weeklyExample:
 *               summary: Weekly recurring slots (Mon, Wed, Fri)
 *               value:
 *                 startTime: "2025-04-01T08:00:00Z"
 *                 endTime: "2025-04-01T12:00:00Z"
 *                 slotDuration: 30
 *                 recurrenceType: "weekly"
 *                 repeatUntil: "2025-04-30T23:59:59Z"
 *                 weekDays: ["MO", "WE", "FR"]
 *             oneTimeExample:
 *               summary: One-time slot
 *               value:
 *                 startTime: "2025-04-15T10:00:00Z"
 *                 endTime: "2025-04-15T12:00:00Z"
 *                 slotDuration: 30
 *                 recurrenceType: "oneTime"
 *                 oneTimeDate: "2025-04-15T10:00:00Z"
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
 *                       recurrenceId:
 *                         type: string
 *                         example: "67e66cbf2915e54656b2fc7a"
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
 *                           startTime:
 *                             type: string
 *                             example: "10:00"
 *                           endTime:
 *                             type: string
 *                             example: "10:30"
 *                       patient:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "67e64c817a6d7d5a5634d242"
 *                           firstName:
 *                             type: string
 *                             example: "PatientFirstName"
 *                           lastName:
 *                             type: string
 *                             example: "PatientLastName"
 *                           email:
 *                             type: string
 *                             example: "Patient@gmail.com"
 *                           mobileNumber:
 *                             type: string
 *                             example: "7751996767"
 *                       reason:
 *                         type: string
 *                         example: "suffering from fever"
 *                       bookingTime:
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
 */
router.get("/:doctorId/bookings", doctorController.getBookedAppointments);
/**
 * @swagger
 * /api/v1/doctors/{doctorId}/availableSlots:
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
 *                       startTime:
 *                         type: string
 *                         example: "10:30"
 *                       endTime:
 *                         type: string
 *                         example: "11:00"
 */
router.get("/:doctorId/availableSlots", doctorController.getAvailableSlots);
module.exports = router;
