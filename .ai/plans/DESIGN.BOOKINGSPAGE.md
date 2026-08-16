# Bookings page — Tailwind CSS + Chakra UI recreation brief

## Objective and business purpose

Recreate the hotel **Bookings** workspace in React + TypeScript using **Tailwind CSS** for layout/visual utilities and **Chakra UI** for accessible interactive primitives. Do not import Ant Design, Ant Design icons, or their CSS.

This is an operational workspace for front-desk staff and managers, not a customer booking screen. It contains two views in one page:

| Tab                 | Purpose now                                                                                                             | Intended production purpose                                                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Front Desk**      | Collect a walk-in/direct guest’s stay requirements and display candidate rooms with a Book Now action for vacant rooms. | Search live availability by room type, date/time, occupancy, capacity, maintenance state, and conflicting bookings; then start a real booking flow.              |
| **Online Platform** | Displays the prototype’s same sample room table.                                                                        | Display externally sourced reservations/allocation records from OTAs and the hotel’s own online channel, including source/channel and operational booking state. |

The current prototype is desktop-first and the form/table do not form a fully responsive mobile experience. The new project must preserve the content and visual intent while being responsive at every viewport, accessible, and composed from reusable components—never one oversized `BookingPage` component.

## Copy/paste implementation prompt

> Build a responsive `BookingPage` for a hotel operations dashboard using React, TypeScript, Tailwind CSS, and Chakra UI. Do not use Ant Design. Maintain the current compact internal-dashboard feel: pale blue page canvas (#f2f8ff), 20px desktop content padding, white cards/panels, subdued gray labels, and action blue (#1890ff / #2563eb). The page sits underneath the application header and scrolls vertically without clipping content.
>
> Use Chakra UI components for semantics and interaction—`Tabs`, `Card`, `Button`, `Select` or a controlled combobox, `NumberInput` (or an accessible custom stepper), `Table`, `Badge`, `IconButton`, and `Tooltip`—and Tailwind for responsive grid, spacing, colors, and component class composition. Use Lucide icons for Calendar, UserRound, Plus, Minus, ChevronLeft, ChevronRight, and ChevronsUpDown. Do not combine all form controls, table columns, tabs, and business logic in the page component.
>
> **Tab shell:** At the top of the working area, render a full-width two-tab list: `Front Desk` and `Online Platform`. Each tab is half the available width on desktop, has centered 15px medium text, 12px vertical padding, and shares one 1px #e0e0e0 bottom divider. Inactive text is #666, active text is #1890ff with 600 weight and a 2px blue underline flush to the bottom. Hover uses #333 text and a very light #f5f5f5 background. Use Chakra’s accessible tab semantics, keyboard arrow navigation, and a clear focus-visible ring; do not reproduce the legacy removal of focus outlines. Leave 20px below the tab bar, then render the selected tab panel. On small screens make the list horizontally scrollable only if labels cannot fit; do not shrink touch targets below 44px.
>
> **Front Desk tab:** Compose `FrontDeskBookingView` from exactly two independent feature units with a 20px vertical gap: `AvailabilitySearchForm` followed by `RoomAvailabilityTable`. The tab container must orchestrate search state and pass query/result props down; it must not duplicate either form or table markup.
>
> **Availability search form:** Render a white 12px-radius card with a subtle border/shadow and responsive 16px–20px padding. Desktop layout is a two-column composition: the form fields take the available space and a wide primary `Check availability` button occupies the right-side action area (the legacy control is about 45% of the card width, but in the responsive version it should size naturally and never dominate small screens). On mobile/tablet, stack the action after the fields as a full-width button.
>
> Form field groups, in this exact visual/content order:
>
> 1. **Room Type** — label above a three-option segmented radio group: Standard, Deluxe, VIP. The selected option is visibly blue and the group is keyboard-operable. Initial selection: Standard.
> 2. **Check in** and **Check out** — two equal-width date-time inputs in one row on desktop. Display the established format `ddd, MMM D, HH:mm`, include a calendar icon, do not expose a `Now` shortcut, and initialize to tomorrow at 12:00 and the following day at 22:30. On narrow screens, stack these inputs. Keep the selected date and time as one logical value per field (a native date/time pair is acceptable if Chakra has no bundled date picker).
> 3. **Guest counts** — Adult, Teen, Children, displayed in three equal columns on desktop. Each has bold label, secondary 12px helper copy, and a compact minus / numeric value / plus stepper. Adults use `Older than 18 years` and range 1–10; Teens use `13–18 years` and range 0–10; Children use `0–12 years` and range 0–10. Disable decrement/increment at valid lower/upper bounds. Correct the current prototype’s Teen lower-bound inconsistency: the README business rule is 0–10, so the minus button must be enabled at 1 and disabled at 0. On mobile, retain three coherent rows or a 1–2 column grid; controls must not overflow.
>
> Clicking `Check availability` validates that type, check-in, check-out, and guest values are valid; check-out must be after check-in. Then assemble a typed `AvailabilityQuery` containing `roomType`, ISO check-in/out timestamps, `adults`, `teens`, and `children`, invoke `onSearch(query)`, show a loading state if needed, and pass only matching eligible rooms to the table. In the visual prototype, it is acceptable to display mock rooms, but do not leave the action as `console.log` in the recreated application. Label the blue primary action `Check availability`, use a leading UserRound icon, and keep a 44px minimum height.
>
> **Availability table:** Render a reusable `RoomAvailabilityTable`, shown beneath the search card. It lists candidates with the columns: Room Number, Bed Type, Room Floor, Room Facility, and Action. Format room number as `#101`; floor as `Floor - 1`; facilities are readable wrapped notes but constrained on desktop so they do not consume the entire row. Bed type is a small semantic color badge: King gold, Queen purple, all other bed types blue. The table supports sorting by room number, bed type, and floor; controls must announce sort direction and work with keyboard. Use client-side pagination for the prototype: default 10 rows; size choices 10, 20, 50; total copy `Total N rooms`.
>
> `Book Now` is a blue row action only for rooms whose operational status is `Vacant`; all other rows show the disabled control with a reason available through accessible text/tooltip (for example, `Room is occupied`). The `onBookNow(room)` callback starts the next booking workflow; it must be owned by the parent/container, not buried in the table. Do not make a disabled button look actionable.
>
> On screens below the table’s comfortable width, do not force a squeezed five-column table. Either: (1) put the desktop table in a clearly labeled horizontally scrollable region with a visible left/right affordance, **and** provide a card list view at small breakpoints, or (2) switch directly to `RoomAvailabilityCard` items. The recommended mobile card order is room number + bed badge on top, Floor, facilities, status, then full-width Book Now. Keep sorting and pagination usable in either representation. Maintain a minimum 44px target for actions.
>
> **Online Platform tab:** Render an `OnlinePlatformBookingsView` that consumes the same `RoomAvailabilityTable`/`RoomAvailabilityCard` display primitive in prototype mode to exactly match the current screen. Make the boundary future-ready: its input must be a `ChannelReservation[]` or a discriminated `BookingListItem[]`, rather than knowing about a hard-coded room data file. The page must make clear in empty/loading states that this is for externally sourced allocations; do not mix it into Front Desk search results. When channel data is not available yet, a restrained empty/informational state may say `Online platform reservations will appear here` while preserving the prototype-table option for visual parity.
>
> **Responsive behavior is mandatory:**
>
> - Wide desktop (`>=1280px`): preserve the compact form groups, two date fields in a row, three guest-count columns, and desktop table.
> - Tablet (`768–1279px`): use two columns for date inputs and a 3-column guest grid when each remains readable; move the check button to its own full-width row when the form action would crowd fields.
> - Mobile (`<768px`): 16px page padding, tabs retain usable labels, form uses a one-column layout for dates and action, and guest counters wrap without horizontal scroll. Table becomes the card list or an intentionally scrollable table region as specified above.
> - Preserve real focus indicators, form error text connected to inputs, labels for all controls, live announcement of availability result count, and `prefers-reduced-motion` support.

## Component architecture and ownership

| Component                    | Responsibility                                    | Contract / contained UI                                                                                                                                                                                |
| ---------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `BookingPage`                | Page-level tab state and data orchestration only. | Owns active tab, calls availability/channel hooks, routes callbacks to feature views. Replaces `Booking.tsx`.                                                                                          |
| `BookingTabs`                | Shared accessible two-view navigation.            | `value`, `onValueChange`, `frontDesk`, `onlinePlatform`; wraps Chakra `Tabs`. Keeps all tab styling and ARIA state in one place.                                                                       |
| `FrontDeskBookingView`       | Direct booking workflow composition.              | Receives `rooms`, `onSearch`, `onBookNow`; renders `AvailabilitySearchForm` and `RoomAvailabilityTable`/mobile list with a 20px gap. Replaces `FrontDesk`.                                             |
| `AvailabilitySearchForm`     | Typed, validated direct-booking criteria form.    | `initialValue?`, `onSubmit(query)`, `isSearching?`; owns transient field state and validation. Replaces `CheckAvailability`.                                                                           |
| `RoomTypeSelector`           | Reusable Standard/Deluxe/VIP segmented control.   | `value`, `onChange`, options. Can be shared with a new-booking flow.                                                                                                                                   |
| `DateTimeField`              | Labelled reusable date-time control.              | `label`, `value`, `onChange`, `min?`, `error?`; renders date/time picker implementation and calendar icon.                                                                                             |
| `GuestCountStepper`          | Reusable bounded guest count control.             | `label`, `description`, `value`, `min`, `max`, `onChange`; owns plus/minus disabled states.                                                                                                            |
| `RoomAvailabilityTable`      | Desktop candidate-room results list.              | `rooms`, `sort`, `onSortChange`, `pagination`, `onPaginationChange`, `onBookNow`, `showChannelColumns?`; contains column renderers and no global data/store import. Replaces `RoomsAvailabilityTable`. |
| `RoomAvailabilityCard`       | Mobile equivalent of a table row.                 | Same `room` and `onBookNow` inputs, with shared `RoomBedBadge` and `BookRoomAction`.                                                                                                                   |
| `RoomBedBadge`               | Semantic bed-type color badge.                    | `bedType`; centralizes King/Queen/default palette.                                                                                                                                                     |
| `BookRoomAction`             | Vacancy-gated booking CTA.                        | `room`, `onBookNow`; centralizes disabled state and explanatory text.                                                                                                                                  |
| `TablePagination`            | Reusable controlled table/card pagination.        | `page`, `pageSize`, `total`, `onChange`, `pageSizeOptions`.                                                                                                                                            |
| `OnlinePlatformBookingsView` | External-channel reservation-list composition.    | `reservations` or unified `items`, loading/error/empty states, reuse of availability list primitives. Replaces `BookingOrders`.                                                                        |

### Recommended source boundaries

```text
src/
  pages/
    BookingPage.tsx
  components/feature/bookings/
    BookingTabs.tsx
    FrontDeskBookingView.tsx
    AvailabilitySearchForm.tsx
    RoomTypeSelector.tsx
    DateTimeField.tsx
    GuestCountStepper.tsx
    RoomAvailabilityTable.tsx
    RoomAvailabilityCard.tsx
    RoomBedBadge.tsx
    BookRoomAction.tsx
    TablePagination.tsx
    OnlinePlatformBookingsView.tsx
  types/
    bookings.ts                       # AvailabilityQuery, AvailabilityResult, ChannelReservation, BookingListItem
  hooks/
    useRoomAvailability.ts             # API/mock data integration only
    useChannelReservations.ts          # OTA / online-channel integration only
```

Keep the current `mockRooms` data strictly at the page/hook boundary. No display component should directly import it, read MobX state, or emit `console.log` as its business action.

## Data contracts and state flow

```text
BookingPage
  ├─ active tab: frontDesk | onlinePlatform
  ├─ FrontDeskBookingView
  │    ├─ AvailabilitySearchForm → AvailabilityQuery
  │    └─ useRoomAvailability(query) → rooms → table/card list → onBookNow(room)
  └─ OnlinePlatformBookingsView
       └─ useChannelReservations() → channel reservations → shared list presentation
```

Use these minimum TypeScript concepts:

- `AvailabilityQuery`: room type; check-in/check-out ISO timestamps; adults, teens, and children.
- `AvailabilityResult`: a `Room` plus eligibility/availability reason for its requested stay.
- `ChannelReservation`: booking ID, channel/source, booking status, room/allocation detail, duration, guest summary; allow `roomNumber` to be unavailable before allocation.
- `BookingListItem`: discriminated union if the Front Desk and online records are intentionally shown through one shared table/card renderer.

## Design tokens and visual specifications

| Purpose                        | Value                                                                 |
| ------------------------------ | --------------------------------------------------------------------- |
| Page background                | `#f2f8ff`                                                             |
| Content padding                | 20px desktop; 16px mobile                                             |
| Section gap                    | 20px                                                                  |
| Tab divider                    | `#e0e0e0`, 1px                                                        |
| Inactive/hover/active tab text | `#666` / `#333` / `#1890ff`                                           |
| Active tab underline           | `#1890ff`, 2px                                                        |
| Tab hover background           | `#f5f5f5`                                                             |
| Search card                    | white, 12px radius, soft subtle border/shadow                         |
| Primary action                 | blue #2563eb or existing #1890ff; white text; hover one shade darker  |
| Text label / helper            | semibold dark neutral / 12px muted gray                               |
| Bed badges                     | King gold, Queen purple, all other types blue                         |
| Table treatment                | bordered, readable rows, facility column wraps/truncates responsively |

## Existing component mapping

| Existing component           | New Tailwind + Chakra responsibility                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `Booking.tsx`                | `BookingPage` + `BookingTabs`; preserve the two-tab state but use Chakra Tabs and real focus behavior.                        |
| `FrontDesk.tsx`              | `FrontDeskBookingView`; remains a small composition layer for search and results.                                             |
| `CheckAvailability.tsx`      | `AvailabilitySearchForm` composed from `RoomTypeSelector`, `DateTimeField`, and `GuestCountStepper`.                          |
| `RoomsAvailabilityTable.tsx` | Controlled `RoomAvailabilityTable` plus `RoomAvailabilityCard` mobile presentation; remove Ant Table, Tag, Button, and Space. |
| `BookingOrders.tsx`          | `OnlinePlatformBookingsView`; retain prototype table parity but define a channel-reservation-ready data boundary.             |

## Acceptance checklist

- The page contains only Front Desk and Online Platform views, presented through accessible tabs.
- Front Desk shows room type, check-in/out, Adult/Teen/Children counters, availability action, then results.
- Adult bounds are 1–10; Teen and Children bounds are 0–10.
- Availability queries are typed, validated, and result counts are announced; no implementation leaves the primary action as a console log.
- Room table supports sorting, pagination, responsive card/table presentation, and vacancy-gated Book Now actions.
- Online Platform remains a separate source-oriented view, even while prototype data is reused.
- Components own one responsibility and receive data/callbacks through typed props—no monolithic page or direct mock/store imports inside presentational components.
- No Ant Design dependency remains in this feature; Chakra + Tailwind behavior is responsive, focus-visible, and mobile safe.
