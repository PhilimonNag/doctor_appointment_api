# Doctor Appointment API

## Project Description

The **Doctor Appointment API** is a backend API designed to facilitate doctor appointments. It allows doctors to manage their availability, patients to book slots, and provides real-time scheduling. The system ensures efficient appointment management using Node.js, Express, and MongoDB.

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v22)(if not using Docker)
- **Docker** & **Docker Compose**
- **MongoDB** (if not using Docker)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/PhilimonNag/doctor_appointment_api.git
   cd doctor_appointment_api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Copy `.env.example` to `.env`
   - Configure your database and application settings

   **Example `.env.example` file:**

   ```env
   NODE_ENV=development
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/doctor_appointment_db
   ```

4. **Run the application**

   - **Using Node.js:**
     ```bash
     npm start
     ```
   - **Using Docker:**
     ```bash
     docker-compose up -d --build
     ```

## API Documentation

### **1. Create a Doctor**

**Endpoint:** `POST /api/v1/doctors`

**Request Body:**

```json
{
  "userName": "drjohn",
  "firstName": "John",
  "lastName": "Doe",
  "email": "dr.john@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Doctor created successfully",
  "data": {
    "_id": "67e66cbf2915e54656b2fc7a",
    "userName": "drjohn",
    "firstName": "John",
    "lastName": "Doe",
    "email": "dr.john@example.com"
  }
}
```

### **2.Create Recurring Slots**

**Endpoint:** `GET /api/v1/doctors/:doctorId/slots`

**Request Body:**
**_Daily Recurrence_**

```json
{
  "startTime": "2025-04-01T08:00:00Z",
  "endTime": "2025-04-01T12:00:00Z",
  "slotDuration": 30,
  "recurrenceType": "daily",
  "repeatUntil": "2025-04-07T23:59:59Z"
}
```

**_One-Time Recurrence_**

```json
{
  "startTime": "2025-04-01T08:00:00Z",
  "endTime": "2025-04-01T12:00:00Z",
  "slotDuration": 30,
  "recurrenceType": "oneTime",
  "oneTimeDate": "2025-04-05T00:00:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Slots created successfully",
  "data": {
    "recurrenceId": "67e66cbf2915e54656b2fc7a"
  }
}
```

### **3. Get Available Slots**

**Endpoint:** `GET /api/v1/doctors/:doctorId/availableSlots`

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "67e63e48488b85e9c660bc23",
      "date": "2025-12-29T18:30:00.000Z",
      "startTime": "10:30",
      "endTime": "11:00"
    }
  ]
}
```

### **4. Get Booked Appointments**

**Endpoint:** `GET /api/v1/doctors/:doctorId/bookings`

**Response:**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "67e64c817a6d7d5a5634d244",
      "slot": {
        "_id": "67e63e48488b85e9c660bc1f",
        "startTime": "10:00",
        "endTime": "10:30"
      },
      "patient": {
        "_id": "67e64c817a6d7d5a5634d242",
        "firstName": "PatientFirstName",
        "lastName": "PatientLastName",
        "email": "Patient@gmail.com",
        "mobileNumber": "7751996767"
      },
      "reason": "suffering from fever",
      "bookingTime": "2025-03-28T07:15:13.888Z",
      "createdAt": "2025-03-28T07:15:13.889Z",
      "updatedAt": "2025-03-28T07:15:13.889Z",
      "__v": 0
    }
  ]
}
```

### **5. Book a Slot**

**Endpoint:** `POST /api/v1/slots/:slotId/book`

**Request Body:**

```json
{
  "firstName": "patientfirstname",
  "lastName": "patientlastname",
  "email": "patient@gmail.com",
  "mobileNumber": "7751996767",
  "reason": "suffering from fever"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Slot booked successfully",
  "data": {
    "bookingId": "67e67307e132576a5039c518",
    "bookingTime": "2025-03-28T09:59:35.276Z",
    "patient": {
      "name": "Patient Name",
      "email": "Patient@gmail.com",
      "mobileNumber": "7751996767"
    },
    "slot": {
      "startTime": "11:00",
      "endTime": "11:30",
      "date": "2025-12-29T18:30:00.000Z",
      "status": "booked"
    }
  }
}
```

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Validation:** Express-validator
- **API Documentation:** Swagger
- **Containerization:** Docker, Docker Compose
- **Testing:** Jest (if applicable)

## Live API

- 🔗 **[API Documentation](https://doctor-api.philimonnag.com/api-docs)**
- 🔗 **[Base API URL](https://doctor-api.philimonnag.com/)**

## License

This project is licensed under the MIT License. Feel free to modify and use it as needed.

## Contributors

- [Philimon Nag](https://github.com/PhilimonNag)
