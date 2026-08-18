# Implementation Plan - Checkout Marking Feature

Introduce a comprehensive checkout marking flow, checking in/out guest bookings, and a notification popover listing bookings that are checking out within the next hour.

## User Review Required

> [!IMPORTANT]
> The implementation involves adding a **"Manage Bookings"** page to separate the booking creation process (Front Desk tab) from the active booking lifecycle management (Check-in, Checkout, Payment updates, Status tracking). This keeps the booking creation clean and highly scalable.

> [!NOTE]
> When checking out, the associated Room Status will transition to `Vacant` and its Condition (Room State) will automatically transition to `Dirty` so housekeeping staff knows it requires attention.

---

## Proposed Changes

### Back-end (Spring Boot Server)

#### [MODIFY] [BookingRepository.java](file:///d:/resource/Projects/Hotel%20Management/atithi-server/src/main/java/com/nag/atithi/repositories/BookingRepository.java)
- Add query method `findByHotelIdAndStatusInAndCheckOutBetween` to fetch active bookings checking out in a given range:
```java
List<Booking> findByHotelIdAndStatusInAndCheckOutBetween(
    Long hotelId,
    List<BookingStatus> statuses,
    LocalDateTime start,
    LocalDateTime end
);
```

#### [MODIFY] [BookingService.java](file:///d:/resource/Projects/Hotel%20Management/atithi-server/src/main/java/com/nag/atithi/services/BookingService.java)
- Add declarations for:
  - `BookingResponse checkInBooking(Long hotelId, Long bookingId);`
  - `BookingResponse checkOutBooking(Long hotelId, Long bookingId);`
  - `List<BookingResponse> getBookingsCheckingOutSoon(Long hotelId);`

#### [MODIFY] [BookingServiceImpl.java](file:///d:/resource/Projects/Hotel%20Management/atithi-server/src/main/java/com/nag/atithi/implementations/BookingServiceImpl.java)
- Implement `checkInBooking`:
  - Verify booking ownership by `hotelId`.
  - Update status to `BookingStatus.CHECKED_IN`.
  - Update room status to `RoomStatus.OCCUPIED`.
- Implement `checkOutBooking`:
  - Verify booking ownership by `hotelId`.
  - Update status to `BookingStatus.CHECKED_OUT`.
  - Update associated room status to `RoomStatus.VACANT`.
  - Update room state to `RoomState.DIRTY` (so housekeeping cleans the room).
- Implement `getBookingsCheckingOutSoon`:
  - Query database for bookings with status `CONFIRMED` or `CHECKED_IN` where checkout time is between `now()` and `now() + 1 hour`.

#### [MODIFY] [HotelBookingsController.java](file:///d:/resource/Projects/Hotel%20Management/atithi-server/src/main/java/com/nag/atithi/controllers/HotelBookingsController.java)
- Expose the following endpoints:
  - `POST /api/v1/hotel/bookings/{bookingId}/check-in`
  - `POST /api/v1/hotel/bookings/{bookingId}/checkout`
  - `GET /api/v1/hotel/bookings/checking-out-soon`

---

### Front-end (React Client)

#### [MODIFY] [booking-service.ts](file:///d:/resource/Projects/Hotel%20Management/Atithi-client/src/api/booking-service.ts)
- Add client wrapper calls:
  - `checkInBooking(bookingId: string)` calling `POST /hotel/bookings/${bookingId}/check-in`
  - `checkOutBooking(bookingId: string)` calling `POST /hotel/bookings/${bookingId}/checkout`
  - `getUpcomingCheckouts()` calling `GET /hotel/bookings/checking-out-soon`

#### [MODIFY] [SidebarNavigation.tsx](file:///d:/resource/Projects/Hotel%20Management/Atithi-client/src/components/layout/SidebarNavigation.tsx)
- Insert a navigation item for **Manage Bookings**:
  ```typescript
  { to: "/manage-bookings", label: "Manage Bookings", icon: Sliders }
  ```

#### [MODIFY] [App.tsx](file:///d:/resource/Projects/Hotel%20Management/Atithi-client/src/App.tsx)
- Register route:
  ```tsx
  <Route element={<ManageBookingsPage />} path="/manage-bookings" />
  ```

#### [NEW] [ManageBookingsPage.tsx](file:///d:/resource/Projects/Hotel%20Management/Atithi-client/src/pages/bookings/manage-bookings-page.tsx)
- Create a beautiful, premium page listing all bookings.
- Features:
  - Search by guest name / room number, and filter by booking status tabs (All, Confirmed, Checked In, Checked Out, Cancelled).
  - Quick action buttons: "Check In" (if Confirmed), "Check Out" (if Checked In), and "Record Payment" (if booking payment is pending/unpaid).
  - Displays guest Aadhaar, phone number, duration, total price, and payment status indicators.

#### [NEW] [UpcomingCheckoutsPopover.tsx](file:///d:/resource/Projects/Hotel%20Management/Atithi-client/src/components/layout/UpcomingCheckoutsPopover.tsx)
- Add a dropdown panel for the bell icon:
  - Fetches and displays rooms checking out in the next 1 hour.
  - Lists rooms, guest names, check-out time, and adds a quick "Check Out" action button.
  - Show a small badge counter on the notification bell indicating how many bookings are checking out soon.

---

## Verification Plan

### Automated Tests
- Write test cases in `HotelBookingsControllerTestNGTest.java` and `BookingServiceImplTestNGTest.java` to verify success and error flows for checkout/check-in operations.
- Run the server test suite using Maven:
  ```powershell
  mvn test -Dtest=HotelBookingsControllerTestNGTest,BookingServiceImplTestNGTest
  ```

### Manual Verification
- Deploy local dev servers.
- Book a room via the **Bookings** page.
- Navigate to the **Manage Bookings** page and check in the guest.
- Change checkout time to be within 1 hour, and click the **Notification Bell** to verify it shows the room checking out soon.
- Click **Check Out** from the popover or the Manage Bookings page, then check that the Room's status resets to `Vacant` and condition becomes `Dirty` on the **Rooms** dashboard.
