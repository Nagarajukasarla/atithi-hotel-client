# Entity Specification: Room

## Overview

The `Room` entity represents an actual physical room inside a hotel property (e.g., Room 101, Room 205A, Penthouse 501). Every physical room belongs to a specific `RoomType` (category) and maintains two distinct operational states: `status` (system operational status) and `occupancyStatus` (real-time guest occupancy & housekeeping state).

---

## Database Fields & Specifications

| Field Name        | Data Type              | Constraints                        | Description & Expected Values                                                                                                    |
| :---------------- | :--------------------- | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | `String` (UUID / CUID) | `PRIMARY KEY`, `NOT NULL`          | Unique identifier for the physical room record. Example: `"rm_101_01"`.                                                          |
| `hotelId`         | `String` (UUID / CUID) | `FOREIGN KEY`, `NOT NULL`          | References `Hotel.id`. Identifies the property to which this room belongs. Example: `"ht_001"`.                                  |
| `roomTypeId`      | `String` (UUID / CUID) | `FOREIGN KEY`, `NOT NULL`          | References `RoomType.id`. Determines room category, pricing, capacity, and bed configuration. Example: `"rt_std_01"`.            |
| `roomNumber`      | `String`               | `NOT NULL`, `UNIQUE per hotel`     | Unique identifier label assigned to the room door. Example: `"101"`, `"205A"`, `"PH-1"`.                                         |
| `floorNumber`     | `Integer`              | `NOT NULL`                         | Numeric floor level where the room is located. Example: `1`, `2`, `5`.                                                           |
| `status`          | `Enum`                 | `NOT NULL`, `DEFAULT: 'ACTIVE'`    | System operational status of the physical asset. Allowed values: `"ACTIVE"`, `"INACTIVE"`, `"OUT_OF_SERVICE"`.                   |
| `occupancyStatus` | `Enum`                 | `NOT NULL`, `DEFAULT: 'AVAILABLE'` | Real-time housekeeping & guest status. Allowed values: `"AVAILABLE"`, `"OCCUPIED"`, `"RESERVED"`, `"CLEANING"`, `"MAINTENANCE"`. |
| `description`     | `Text`                 | `NULLABLE`                         | Specific notes or room-level features (e.g. proximity to elevator, specific view, accessibility features).                       |
| `createdAt`       | `Timestamp` (ISO 8601) | `NOT NULL`                         | System timestamp when the physical room record was created. Example: `"2026-08-01T08:00:00Z"`.                                   |
| `updatedAt`       | `Timestamp` (ISO 8601) | `NOT NULL`                         | System timestamp when the room record or status was last updated. Example: `"2026-08-12T10:15:00Z"`.                             |

---

## Operational Status Distinctions

A key architectural feature of the system is the distinction between **Asset Status (`status`)** and **Live Housekeeping/Guest State (`occupancyStatus`)**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Physical Room                                  │
├──────────────────────────────────────┬──────────────────────────────────────┤
│            System Status             │           Occupancy Status           │
│              (status)                │          (occupancyStatus)           │
├──────────────────────────────────────┼──────────────────────────────────────┤
│  ACTIVE                              │  AVAILABLE  (Clean & Ready)          │
│  (Operational in hotel inventory)    │  OCCUPIED   (Guest checked in)       │
│                                      │  RESERVED   (Check-in today)         │
│  INACTIVE                            │  CLEANING   (Housekeeping active)    │
│  (Disabled from listings)            │  MAINTENANCE(Minor touch-up inside)  │
│                                      │                                      │
│  OUT_OF_SERVICE                      │                                      │
│  (Major renovation / structural work)│                                      │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### 1. System Status (`status`)

- `ACTIVE`: The room physically exists, is operational, and is part of active hotel inventory.
- `INACTIVE`: The room is soft-disabled (not available for public booking).
- `OUT_OF_SERVICE`: The room is undergoing major construction, renovation, or long-term structural repair.

### 2. Occupancy Status (`occupancyStatus`)

- `AVAILABLE`: Room is inspected, clean, vacant, and ready for immediate guest check-in.
- `OCCUPIED`: Guest is currently checked in and staying in the room.
- `RESERVED`: Room is assigned for a guest scheduled to check in today.
- `CLEANING`: Housekeeping staff is currently cleaning or inspecting the room after checkout.
- `MAINTENANCE`: Minor quick maintenance/repair work in progress inside an active room.

_Example scenario_: **Room 205** has `status = ACTIVE` and `occupancyStatus = CLEANING`. The room is operational and part of hotel inventory, but currently undergoing turn-down/cleaning before it can be marked `AVAILABLE`.

---

## Example Database Records (Data Payloads)

### JSON Format

```json
[
    {
        "id": "rm_101_01",
        "hotelId": "ht_001",
        "roomTypeId": "rt_std_01",
        "roomNumber": "101",
        "floorNumber": 1,
        "status": "ACTIVE",
        "occupancyStatus": "AVAILABLE",
        "description": "Ground floor standard room, accessible entrance, courtyard view.",
        "createdAt": "2026-08-01T08:00:00Z",
        "updatedAt": "2026-08-12T09:00:00Z"
    },
    {
        "id": "rm_102_02",
        "hotelId": "ht_001",
        "roomTypeId": "rt_dlx_02",
        "roomNumber": "102",
        "floorNumber": 1,
        "status": "ACTIVE",
        "occupancyStatus": "OCCUPIED",
        "description": "Ground floor deluxe room with pool access.",
        "createdAt": "2026-08-01T08:00:00Z",
        "updatedAt": "2026-08-11T14:00:00Z"
    },
    {
        "id": "rm_205_03",
        "hotelId": "ht_001",
        "roomTypeId": "rt_std_01",
        "roomNumber": "205",
        "floorNumber": 2,
        "status": "ACTIVE",
        "occupancyStatus": "CLEANING",
        "description": "Second floor quiet corner room near elevator.",
        "createdAt": "2026-08-01T08:00:00Z",
        "updatedAt": "2026-08-12T10:15:00Z"
    },
    {
        "id": "rm_305_04",
        "hotelId": "ht_001",
        "roomTypeId": "rt_ste_03",
        "roomNumber": "305",
        "floorNumber": 3,
        "status": "OUT_OF_SERVICE",
        "occupancyStatus": "MAINTENANCE",
        "description": "Penthouse suite undergoing bathroom plumbing renovation.",
        "createdAt": "2026-08-01T08:00:00Z",
        "updatedAt": "2026-08-08T16:00:00Z"
    }
]
```
