# Walk-in Booking Feature & Database Schema Implementation Plan

This file contains the planned database schema and API definitions to implement the "Book Now" (Walk-in Booking) feature in the hotel management bookings page.

---

## 1. Database Schema Design

We need two database tables to store a walk-in booking order: a `bookings` parent table and a `booking_guests` child details table.

### A. `bookings` Table
Tracks the room allocation, duration, pricing, and general reservation status.
- `id`: VARCHAR/UUID (Primary Key)
- `room_id`: VARCHAR/UUID (Foreign Key referencing `rooms.id`)
- `check_in`: TIMESTAMP (Mandatory)
- `check_out`: TIMESTAMP (Mandatory)
- `is_hourly`: BOOLEAN (Default: false)
- `total_price`: DECIMAL(10,2) (Calculated dynamically or recorded at booking time)
- `status`: VARCHAR(20) (e.g. "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED")
- `created_at`: TIMESTAMP (Default: Current Timestamp)

### B. `booking_guests` Table
Tracks details of all guests staying in the room under this booking.
- `id`: VARCHAR/UUID (Primary Key)
- `booking_id`: VARCHAR/UUID (Foreign Key referencing `bookings.id` ON DELETE CASCADE)
- `name`: VARCHAR(100) (Mandatory)
- `aadhaar_number`: VARCHAR(12) (Mandatory)
- `mobile_number`: VARCHAR(15) (Mandatory)
- `age`: INT (Optional)
- `address`: TEXT (Optional)

---

## 2. API Endpoints

### POST `/api/v1/bookings`
Creates a walk-in booking and updates the status of the associated room.

- **Request Headers**:
  - `Content-Type: application/json`

- **Request Body (JSON)**:
  ```json
  {
    "roomId": "room-101",
    "isHourly": false,
    "checkIn": "2026-08-16T14:00:00Z",
    "checkOut": "2026-08-20T11:00:00Z",
    "guests": [
      {
        "name": "Yudhishthira Pandava",
        "aadhaarNumber": "123456789012",
        "mobileNumber": "9876543210",
        "age": 38,
        "address": "Indraprastha"
      },
      {
        "name": "Draupadi Devi",
        "aadhaarNumber": "987654321098",
        "mobileNumber": "9876543210",
        "age": 32,
        "address": "Panchala"
      }
    ]
  }
  ```

- **Response Body (Success - 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Booking created successfully.",
    "data": {
      "bookingId": "bk-99823",
      "roomId": "room-101",
      "status": "CONFIRMED",
      "totalPrice": 7200
    }
  }
  ```

---

## 3. Frontend Booking Service Methods

In the frontend API client (`booking-service.ts`), the following API method is implemented:
```typescript
createBooking(payload: CreateBookingPayload) {
    return request<ApiResponse<any>>("/hotel/bookings", {
        method: "POST",
        body: payload,
    });
}
```
This method will make a POST request to `/api/v1/hotel/bookings` to create a walk-in booking order on the server.
