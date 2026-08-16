# Backend Architecture & Plan: Room Details Price Retrieval

This document outlines the planning, design, and considerations for returning and displaying room prices in the room details drawer.

---

## 1. Context & Objective
In the room details drawer UI, we need to show the base price of a room. 
- The **Price** corresponds to the room's category/type (e.g. Standard, Deluxe, Executive, VIP).
- Currently, the frontend gets room data from the `GET /hotel/rooms` endpoint. This data does not contain pricing information directly.
- Pricing details are configured on a per-room-type basis and returned from the `GET /hotel/room-types` endpoint.

---

## 2. Frontend Client-Side Enrichment (Implemented)
Since the client application fetches both the list of rooms and the list of room types on mount, the client-side approach achieves this by:
1. Fetching all available room types configured for the active hotel (`GET /hotel/room-types`).
2. Fetching all rooms (`GET /hotel/rooms`).
3. Matching the room's `roomType` field to the corresponding room type configuration `name` field in a memoized React selector:
   ```typescript
   const enrichedSelectedRoom = React.useMemo(() => {
       if (!selectedRoom) return null;
       const rtConfig = availableRoomTypes.find(type => type.name === selectedRoom.roomType);
       return {
           ...selectedRoom,
           basePrice: rtConfig?.basePrice,
       };
   }, [selectedRoom, availableRoomTypes]);
   ```
4. Rendering the price row under the `Last Cleaned` information in the room details drawer.

### Why this is optimal:
- **Zero Backend Performance Overhead**: Avoids complex SQL joins on the database for bulk list queries.
- **Cache Friendly**: Room types change infrequently, allowing the frontend to load it once and lookup properties dynamically.
- **Reduced Payload Size**: Rooms API responses remain lightweight.

---

## 3. Backend Modification Plan (If API changes were required)
If we were to refactor the backend API so that the room price is returned directly in the room details payload, here is the design specification:

### A. Database Schema
The database contains two primary tables:
- `rooms` (fields: `id`, `number`, `floor`, `room_type_id`, `status`, `condition`, `last_cleaned`, `notes`, etc.)
- `room_types` (fields: `id`, `name`, `description`, `base_price`, `max_occupancy`, etc.)

### B. SQL Query Update
To join the pricing data directly in the query fetching the rooms:
```sql
SELECT 
    r.id, 
    r.number, 
    r.floor, 
    rt.name AS room_type, 
    rt.base_price, 
    r.status AS room_status, 
    r.condition AS room_state, 
    r.last_cleaned, 
    r.notes
FROM rooms r
LEFT JOIN room_types rt ON r.room_type_id = rt.id
WHERE r.hotel_id = :hotelId;
```

### C. Backend API Response Structure (DTO)
The backend model / DTO (e.g. in Java Spring Boot, Go, Node.js) representing a `Room` would be updated to include `basePrice`:

```json
{
  "id": "101",
  "number": "101",
  "floor": 1,
  "roomType": "Standard",
  "basePrice": 1800,
  "roomStatus": "Occupied",
  "roomState": "Clean",
  "lastCleaned": "2026-08-16T16:55:30+05:30",
  "notes": "Quiet room requested."
}
```

### D. Endpoint Changes
1. **`GET /hotel/rooms`**: Returns the list of rooms including `basePrice`.
2. **`GET /hotel/rooms/{id}`**: Returns details of a specific room, populated with `basePrice`.
