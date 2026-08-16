Add Rooms Feature Implementation Plan
Define the technical design for adding physical rooms. This includes designing a customizable popup form in the frontend (matching active room types) and structuring the database tables and backend components.

Proposed UI Form Flow & Fields
Instead of the current placeholder dialog, we propose a streamlined CreateOrEditRoomDialog layout:

Room Number (Input Field):

Text input (e.g., "101", "102", "A-1").
Validated to be non-empty and unique per hotel.
Floor (Input Field):

Simple text input (e.g., "Ground Floor", "1st Floor", "Penthouse") instead of a restricted select dropdown, allowing custom hotel layouts.
Room Type (Segmented Choice Buttons):

Rendered as interactive labeled buttons/pills rather than a select list.
Populated dynamically using the room types configured in Settings (roomTypeService.getRoomTypes()).
Selecting a room type automatically initializes/updates the default guest capacity.
Room Capacity (Input Field):

Numeric input.
Defaults to the selected Room Type's capacity limit, but allows manual override for custom room setups.
Default Statuses (Automated):

Room Status: Defaults to VACANT.
Room State: Defaults to CLEAN.
Proposed Database Schema & Models
A. Database Table (rooms)
sql

CREATE TABLE rooms (
    id BIGSERIAL PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    room_type_id BIGINT NOT NULL,
    capacity INTEGER NOT NULL,
    room_status VARCHAR(30) NOT NULL DEFAULT 'VACANT',
    room_state VARCHAR(30) NOT NULL DEFAULT 'CLEAN',
    last_cleaned TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_room_hotel 
        FOREIGN KEY (hotel_id) 
        REFERENCES hotels(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_room_room_type 
        FOREIGN KEY (room_type_id) 
        REFERENCES room_types(id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_room_number_per_hotel 
        UNIQUE (hotel_id, room_number)
);
B. Enums & Entities (Backend Java)
com.nag.atithi.enums.RoomStatus:
VACANT, OCCUPIED, BOOKED
com.nag.atithi.enums.RoomState:
CLEAN, DIRTY, MAINTENANCE
com.nag.atithi.models.Room:
Standard Spring Boot JPA entity referencing Hotel and RoomType models.
Proposed Frontend API Integration
Create a roomService client in src/api/room-service.ts supporting standard room operations:

GET /hotel/rooms (retrieves rooms list)
POST /hotel/rooms (creates room)
PUT /hotel/rooms/{id} (updates room details/status)
DELETE /hotel/rooms/{id} (removes room)
Integrate 
rooms-page.tsx
 with the new service client, fetching room types on mount to populate the dialog choices.

