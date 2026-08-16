# Entity Specification: RoomType

## Overview

The `RoomType` entity represents a category or classification of rooms in a hotel (e.g., Standard Room, Deluxe Room, Executive Suite, Presidential Suite). It defines the pricing, maximum guest capacities, bed configuration, room dimensions, and category-level amenities shared by physical rooms belonging to this category.

---

## Database Fields & Specifications

| Field Name     | Data Type                 | Constraints                     | Description & Expected Values                                                                           |
| :------------- | :------------------------ | :------------------------------ | :------------------------------------------------------------------------------------------------------ |
| `id`           | `String` (UUID / CUID)    | `PRIMARY KEY`, `NOT NULL`       | Unique identifier for the room type record. Example: `"rt_std_01"`.                                     |
| `hotelId`      | `String` (UUID / CUID)    | `FOREIGN KEY`, `NOT NULL`       | References `Hotel.id`. Associates this room type with a specific property. Example: `"ht_001"`.         |
| `name`         | `String`                  | `NOT NULL`                      | Name of the room category. Example: `"Deluxe Room"`, `"Presidential Suite"`.                            |
| `description`  | `Text`                    | `NULLABLE`                      | Detailed description of the room category features, decor, view, and included amenities.                |
| `basePrice`    | `Decimal(10,2)` / `Float` | `NOT NULL`, `>= 0`              | Standard base rate charged per night for this room type in currency units. Example: `250.00`.           |
| `maxAdults`    | `Integer`                 | `NOT NULL`, `>= 1`              | Maximum number of adult guests permitted in rooms of this type. Example: `2`.                           |
| `maxChildren`  | `Integer`                 | `NOT NULL`, `>= 0`              | Maximum number of child guests permitted. Example: `2`.                                                 |
| `maxOccupancy` | `Integer`                 | `NOT NULL`, `>= 1`              | Maximum total guest count (Adults + Children) allowed. Example: `4`.                                    |
| `bedType`      | `Enum` / `String`         | `NOT NULL`                      | Primary bed configuration. Allowed values: `"SINGLE"`, `"DOUBLE"`, `"TWIN"`, `"QUEEN"`, `"KING"`.       |
| `size`         | `String` / `Decimal`      | `NULLABLE`                      | Floor area of the room type, usually specified with unit. Example: `"350 sq ft"` or `32.5` (m²).        |
| `status`       | `Enum`                    | `NOT NULL`, `DEFAULT: 'ACTIVE'` | Operational availability of this room category. Allowed values: `"ACTIVE"`, `"INACTIVE"`, `"ARCHIVED"`. |
| `createdAt`    | `Timestamp` (ISO 8601)    | `NOT NULL`                      | System timestamp when the record was created. Example: `"2026-08-01T10:00:00Z"`.                        |
| `updatedAt`    | `Timestamp` (ISO 8601)    | `NOT NULL`                      | System timestamp when the record was last modified. Example: `"2026-08-12T14:30:00Z"`.                  |

---

## Allowed Enum Values

### 1. Bed Type (`bedType`)

- `SINGLE`: One single bed (ideal for solo travelers).
- `DOUBLE`: One double bed.
- `TWIN`: Two separate single beds in one room.
- `QUEEN`: One queen-size bed.
- `KING`: One king-size bed.

### 2. Category Status (`status`)

- `ACTIVE`: Category is live and available for assigning physical rooms and booking.
- `INACTIVE`: Category is temporarily disabled/hidden from booking channels.
- `ARCHIVED`: Category is soft-deleted and no longer in active use.

---

## Example Database Records (Data Payloads)

### JSON Format

```json
[
    {
        "id": "rt_std_01",
        "hotelId": "ht_001",
        "name": "Standard Room",
        "description": "Comfortable room featuring a queen bed, work desk, high-speed WiFi, and courtyard view.",
        "basePrice": 180.0,
        "maxAdults": 2,
        "maxChildren": 1,
        "maxOccupancy": 2,
        "bedType": "QUEEN",
        "size": "280 sq ft",
        "status": "ACTIVE",
        "createdAt": "2026-08-01T08:00:00Z",
        "updatedAt": "2026-08-01T08:00:00Z"
    },
    {
        "id": "rt_dlx_02",
        "hotelId": "ht_001",
        "name": "Deluxe Room",
        "description": "Spacious deluxe room with king bed, 55-inch OLED TV, luxury shower, and city skyline view.",
        "basePrice": 250.0,
        "maxAdults": 2,
        "maxChildren": 2,
        "maxOccupancy": 4,
        "bedType": "KING",
        "size": "380 sq ft",
        "status": "ACTIVE",
        "createdAt": "2026-08-01T08:00:00Z",
        "updatedAt": "2026-08-05T11:20:00Z"
    },
    {
        "id": "rt_ste_03",
        "hotelId": "ht_001",
        "name": "Presidential Suite",
        "description": "Top-floor penthouse suite with private jacuzzi balcony, dining room, lounge area, and ocean view.",
        "basePrice": 850.0,
        "maxAdults": 4,
        "maxChildren": 2,
        "maxOccupancy": 6,
        "bedType": "KING",
        "size": "950 sq ft",
        "status": "ACTIVE",
        "createdAt": "2026-08-01T08:00:00Z",
        "updatedAt": "2026-08-10T16:45:00Z"
    }
]
```
