# Rooms page — Tailwind CSS + shadcn/ui recreation brief

## Copy/paste implementation prompt

> Recreate the existing hotel **Rooms** page in React + TypeScript using **Tailwind CSS** and **shadcn/ui only**. Do not import Ant Design, Ant Design icons, or its CSS. This is an operational room-rack screen, not a marketing page: retain its compact, utilitarian, light SaaS look and all of the original content hierarchy.
>
> Use these shadcn primitives where they fit: `Button`, `Dialog`, `Input`, `Label`, `Select`, and `Sheet` (or an equivalent fixed `<aside>` for the details drawer). Use `lucide-react` icons: `Plus`, `X`, `Eye`, and `EyeOff`. Keep `RoomBox` as a custom component; do not replace it with a generic shadcn Card.
>
> **Page shell:** Render the page below the existing 66px application header. The page itself fills available height, has a white/light neutral canvas, and scrolls vertically. The principal content area has 20px padding. On desktop, the main room area remains full width while the details panel overlays it from the right; do not reflow or permanently shrink the grid when the panel is open.
>
> **Top bar:** Create a horizontal header with `Rooms` as the left aligned 24px, 700-weight, slate-800 title. Place `Add Room` and `Legend` together on the right with a 12px gap. `Add Room` is a blue (#3b82f6) primary button with a leading plus icon, 8px/16px padding, 6px radius, 14px medium text, a very light shadow, and a #2563eb hover state that rises 1px. `Legend` is a secondary neutral-gray button (#f3f4f6 fill, #e5e7eb border, #4b5563 text) with the same size and radius; hover to #e5e7eb. The original currently renders Legend as a visual button only—do not invent a legend popover unless it is explicitly needed.
>
> **Room grid:** Leave 24px below the header. Use CSS grid with `grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))` and a 16px gap. Every card has a minimum height of 140px and fills its grid cell. Render the count underneath, aligned right: `Displaying {filteredRooms.length} of {allRooms.length} rooms`, 14px slate-500. Do not group rooms by floor; preserve one continuous 20-room grid in source order.
>
> **Room cards:** Use the exact custom `RoomBox` specification/code below. A room card’s large colored surface communicates booking status, while its small bottom pill independently communicates housekeeping condition. In the upper 12px row, show the red hourly dot on the left only for an hourly booking. Show a Deluxe or VIP asset/icon on the right only for that room type. Centre the large room number below it. If booked, show its time range or date range under the number. Place the uppercase condition pill at the bottom. Do not show bed type, floor, capacity, generic guest count, or a card footer in the grid.
>
> **Interaction:** Clicking a card toggles selection. The selected card has a 2px version of its status border, `translateY(-2px)`, and a slightly stronger shadow; all cards lift and gain a softer shadow on hover. Clicking the selected card again closes the drawer. Escape and the close button clear selection and close it. Preserve keyboard usability: card is a real button (or has button-equivalent keyboard semantics), focus-visible has a clear ring, and the close button has an accessible label.
>
> **Room detail drawer:** When a card is selected, slide a white fixed panel in from the right in 300ms. On desktop it is 400px wide, begins at 66px from the viewport top, extends to the bottom, has a subtle left shadow, and overlays main content. Its X close control sits at top-right (16px inset), has a 32px circular hit area, slate-500 icon, and slate-100 hover background. Drawer content scrolls independently and uses 20px top/bottom plus 15px horizontal padding. Do not use a dark modal backdrop on desktop—the existing UI has no backdrop.
>
> In the drawer, show `Room {number} Details` in 20px slate-800 semibold. Render Last Cleaned only when present, with a 100px slate-500 label column and slate-800 medium value. Render Notes only when present, in a 12px slate-50 box with 6px radius. If a booking exists, render a slate-50, 1px slate-200 bordered duration box: Check-in / Check-out labels left and values right; append an uppercase red `Hourly` badge when appropriate. Show a Guests section only if a booking exists. Each guest is a compact slate-50 box with name, optional `Age: N`, phone, and a masked identity document (`********1234`) with an Eye/EyeOff toggle. Keep the document masking local to each guest.
>
> Below a divider, reproduce three non-editable reference groups: ROOM STATUS (Occupied, Vacant, Stay Over, Check Out, Check In), ROOM CONDITION (Clean, Dirty, Inspected, Out of Service, Out of Order), and ROOM TYPE (Standard, Deluxe, VIP). The groups use 14px uppercase slate-500 headers with 0.5px tracking, 6px-wrapped gaps, and 12px rounded chips. Only the selected room’s matching status or condition chip uses the relevant palette; all inactive chips are white with a slate-200 border. Only the selected type receives medium weight; it intentionally keeps the neutral chip styling.
>
> **Add Room dialog:** `Add Room` opens a non-dismissable-by-backdrop dialog. Use a shadcn `Dialog` with title `Add New Room`; for edit mode use `Edit Room`. The vertical form has Floor (select 1–6), Room Number (numeric, min 1), Room Type (Standard, Deluxe, Executive, Presidential), and Capacity (numeric, min 1). Every field is required. Footer actions are Cancel and a blue Create/Update action. Reset the form when opened, then populate edit values where provided. The original UI permits Escape only for the details drawer; retain that distinction for the add dialog if an exact reproduction is required.
>
> **Responsive requirements:** At `<768px`, stack the title and controls with a 12px gap; controls become full width and distribute their buttons across the row. The grid uses `repeat(auto-fill, minmax(120px, 1fr))`, while cards otherwise retain their 140px height and visual hierarchy. The details drawer becomes full viewport width and slides from `translateX(100%)` to `translateX(0)` below the app header. At narrow phone widths, permit the header buttons to wrap or use equal flexible widths; never horizontally scroll the page. The drawer must have a 44px minimum close target and scroll independently. Respect `prefers-reduced-motion` by disabling/reducing card and drawer transitions.
>
> **Visual tokens (do not approximate with random colors):** page copy uses slate #1e293b / #334155 / #64748b; shared soft border #e2e8f0; muted background #f8fafc; active blue #3b82f6. Room-status card palettes are exact: Vacant `bg #ffffff, border #e2e8f0, text #1a202c`; Occupied `#ebf5ff, #3b82f6, #1e3a8a`; Stay Over `#fff7ed, #f97316, #9a3412`; Check In `#f0fdf4, #10b981, #065f46`; Check Out `#fef2f2, #ef4444, #991b1b`. Room-condition pill palettes are: Clean `#f0fdf4/#10b981/#065f46`; Dirty `#fef2f2/#ef4444/#991b1b`; Inspected `#ebf5ff/#3b82f6/#1e3a8a`; Out of Service `rgb(250,250,250)/rgb(156,163,175)/rgb(75,85,99)`; Out of Order `rgb(118,118,118)/rgb(91,91,91)/rgb(77,77,77)`.

## Source component inventory

| Existing responsibility | Tailwind + shadcn replacement                                                  |
| ----------------------- | ------------------------------------------------------------------------------ |
| `Rooms.tsx`             | Page state, room grid, count, selection, drawer, and dialog orchestration.     |
| `RoomBox.tsx`           | Keep as a custom, status-themed room-rack button (full code below).            |
| `RoomDetails.tsx`       | Custom scrollable drawer content; use only basic shadcn primitives if helpful. |
| `GuestItem.tsx`         | Custom compact guest row with Lucide Eye/EyeOff, not Ant icons.                |
| `CreateOrEditRoom.tsx`  | shadcn Dialog + Select/Input/Label/Button form.                                |
| `roomThemes.ts`         | Keep the status/condition maps as data; feed CSS variables to `RoomBox`.       |

## Exact `RoomBox.tsx` implementation

This is the recommended Tailwind replacement. It preserves the original component’s data contract and visual behavior, while replacing the clickable `div` with an accessible button. Pass SVG asset URLs for `deluxeBadgeSrc` and `vipBadgeSrc` to match the existing badge artwork exactly.

```tsx
import * as React from "react";
import type { Room, BookingOrder, RoomStateType, RoomStatusType } from "@/types/model";
import { cn } from "@/lib/utils";

type Theme = { backgroundColor: string; borderColor: string; textColor: string };

const statusThemes: Record<RoomStatusType, Theme> = {
    Vacant: { backgroundColor: "#ffffff", borderColor: "#e2e8f0", textColor: "#1a202c" },
    Occupied: { backgroundColor: "#ebf5ff", borderColor: "#3b82f6", textColor: "#1e3a8a" },
    "Stay Over": { backgroundColor: "#fff7ed", borderColor: "#f97316", textColor: "#9a3412" },
    "Check In": { backgroundColor: "#f0fdf4", borderColor: "#10b981", textColor: "#065f46" },
    "Check Out": { backgroundColor: "#fef2f2", borderColor: "#ef4444", textColor: "#991b1b" },
};

const stateThemes: Record<RoomStateType, Theme> = {
    Clean: { backgroundColor: "#f0fdf4", borderColor: "#10b981", textColor: "#065f46" },
    Dirty: { backgroundColor: "#fef2f2", borderColor: "#ef4444", textColor: "#991b1b" },
    Inspected: { backgroundColor: "#ebf5ff", borderColor: "#3b82f6", textColor: "#1e3a8a" },
    "Out of Service": {
        backgroundColor: "rgb(250, 250, 250)",
        borderColor: "rgb(156, 163, 175)",
        textColor: "rgb(75, 85, 99)",
    },
    "Out of Order": {
        backgroundColor: "rgb(118, 118, 118)",
        borderColor: "rgb(91, 91, 91)",
        textColor: "rgb(77, 77, 77)",
    },
};

export interface RoomBoxProps {
    room: Room;
    bookingOrder?: BookingOrder;
    selectedRoom: Room | null;
    onClick: () => void;
    deluxeBadgeSrc?: string;
    vipBadgeSrc?: string;
}

function getBookingRange(booking?: BookingOrder): { start: string; end: string } | null {
    if (!booking) return null;
    // Keep your existing date helpers/formatters here so date text remains identical.
    const start = new Date(booking.duration.start);
    const end = new Date(booking.duration.end);
    return booking.isHourly
        ? {
              start: start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              end: end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
        : {
              start: start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
              end: end.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
          };
}

export function RoomBox({ room, bookingOrder, selectedRoom, onClick, deluxeBadgeSrc, vipBadgeSrc }: RoomBoxProps) {
    const selected = selectedRoom?.id === room.id;
    const status = statusThemes[room.roomStatus] ?? statusThemes.Vacant;
    const state = stateThemes[room.roomState] ?? stateThemes.Clean;
    const range = getBookingRange(bookingOrder);
    const badgeSrc = room.roomType === "Deluxe" ? deluxeBadgeSrc : room.roomType === "VIP" ? vipBadgeSrc : undefined;

    return (
        <button
            type="button"
            aria-pressed={selected}
            aria-label={`Room ${room.number}, ${room.roomStatus}, ${room.roomState}`}
            onClick={onClick}
            className={cn(
                "group relative flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border p-3 text-center shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-[transform,box-shadow,border-width] duration-200",
                "hover:z-[1] hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.15)]",
                "focus-visible:z-[2] focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                selected && "z-[2] -translate-y-0.5 border-2 shadow-[0_4px_15px_rgba(0,0,0,0.2)]",
                "motion-reduce:transform-none motion-reduce:transition-none"
            )}
            style={{
                backgroundColor: status.backgroundColor,
                borderColor: status.borderColor,
                color: status.textColor,
            }}
        >
            <span className="flex h-3 w-full" aria-hidden="true">
                <span className="flex flex-1">
                    {bookingOrder?.isHourly && (
                        <span className="size-2.5 rounded-full bg-[#e53e3e] shadow-[0_0_0_2px_rgba(229,62,62,0.2)] transition duration-200 group-hover:scale-[1.15] group-hover:shadow-[0_0_0_3px_rgba(229,62,62,0.3)]" />
                    )}
                </span>
                <span className="flex flex-1">
                    {badgeSrc && <img src={badgeSrc} alt="" className="h-3 w-auto object-contain" />}
                </span>
            </span>

            <span className="my-2 mb-1 flex flex-col gap-0.5 text-[26px] font-bold leading-none">
                {room.number}
                {range && (
                    <span
                        className={cn(
                            "mt-1 block text-center text-xs font-medium leading-[1.3]",
                            bookingOrder?.isHourly
                                ? "font-medium tracking-[0.5px] text-[#2d3748]"
                                : "text-xs text-[#4a5568]"
                        )}
                    >
                        {range.start} - {range.end}
                    </span>
                )}
            </span>

            <span
                className="mt-2 w-fit rounded-xl border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.5px]"
                style={{
                    backgroundColor: state.backgroundColor,
                    borderColor: state.borderColor,
                    color: state.textColor,
                }}
            >
                {room.roomState}
            </span>
        </button>
    );
}
```

## Acceptance checklist

- No `antd` or `@ant-design/icons` import remains in the recreated Rooms feature.
- Status color belongs to the full room card; condition color belongs to the small lower pill.
- Hourly red dot, booking range, and Deluxe/VIP badges appear only when their data warrants them.
- Selected card toggles the panel; Escape and close clear selection.
- The panel overlays on desktop and is full-width under 768px.
- The grid uses 140px minimum cards on desktop and 120px minimum columns under 768px.
- Form fields validate and reset exactly as described.
- Keyboard focus, icon labels, reduced motion, and narrow-screen behavior are implemented.
