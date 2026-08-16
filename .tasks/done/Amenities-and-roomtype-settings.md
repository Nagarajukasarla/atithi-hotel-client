1. Room Types
   A RoomType represents a category of rooms.

Database Schema
CREATE TABLE room_types (
id BIGSERIAL PRIMARY KEY,

    hotel_id BIGINT NOT NULL,

    name VARCHAR(100) NOT NULL,
    description TEXT,

    base_price DECIMAL(12, 2) NOT NULL,

    max_adults INTEGER NOT NULL,
    max_children INTEGER DEFAULT 0,
    max_occupancy INTEGER NOT NULL,

    bed_type VARCHAR(50),
    size VARCHAR(50),

    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_room_type_hotel
        FOREIGN KEY (hotel_id)
        REFERENCES hotels(id),

    CONSTRAINT uq_room_type_name_per_hotel
        UNIQUE (hotel_id, name)

);
Example
Grand Palace

Standard
├── ₹2500
├── 2 Adults
└── 1 Child

Deluxe
├── ₹3500
├── 2 Adults
└── 2 Children

Suite
├── ₹6000
├── 4 Adults
└── 2 Children

Examples:

Standard
Deluxe
Executive
Suite

2. Amenities
   Amenities are reusable/shared features.

CREATE TABLE amenities (
id BIGSERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),

    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_amenity_name
        UNIQUE (name)

);

Examples:

Wi-Fi
Air Conditioning
TV
Mini Bar
Parking
Breakfast
Room Service
