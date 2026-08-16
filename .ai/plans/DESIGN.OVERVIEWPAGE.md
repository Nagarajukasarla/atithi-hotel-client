# Overview page — Tailwind CSS + shadcn/ui recreation brief

## Objective

Recreate the existing hotel **Overview** (home/dashboard) screen in React + TypeScript using **Tailwind CSS** and **shadcn/ui**, with the same information architecture and restrained hotel-operations dashboard look. Do not use Ant Design, Ant icons, or its CSS.

The original screen is desktop-first and its horizontal split sections do not adapt safely to small devices. The new implementation must retain the visual design and content hierarchy while being fully responsive, keyboard accessible, and composable. Do **not** put the entire dashboard in one component or create one-off markup inside the page.

## Copy/paste implementation prompt

> Build a responsive hotel operations dashboard named `OverviewPage` in React + TypeScript with Tailwind CSS and shadcn/ui. Match the existing quiet, compact dashboard style: pale blue page background (#f2f8ff), white section panels, soft shadows, slate/gray text, and a restrained action blue (#2563eb / #2f80ed). Do not use Ant Design. Use shadcn `Card`, `CardHeader`, `CardTitle`, `CardContent`, `Select`, and `Button` where they add behavior/accessibility, but keep visual composition controlled by reusable feature components and Tailwind classes.
>
> The page sits beneath the established app header and has 20px responsive padding (`p-4 sm:p-5`). It must scroll vertically without clipping its content. The desktop page has no extra standalone H1: its first panel is headed `Overview`, exactly as in the current product. Create vertical spacing of 20px between top-level sections.
>
> Compose the page from the reusable components listed in the component architecture below. The page is only responsible for fetching/deriving data and placing components in the section grid. It must not contain duplicated card, table, review, select, or chart markup.
>
> **Section 1 — Overview KPIs:** Render one white `StatisticsSection` headed `Overview`. Its body contains four `OverviewMetricCard`s: `Today's / Check-in / 23`, `Today's / Check-out / 13`, `Total / In hotel / 60`, and `Total / Available room / 10`. Each metric is a clean, borderless, min-width 170px horizontal unit: stacked title/subtitle on the left and its large number bottom-aligned on the right. Use 14px medium gray title, 15px darker gray subtitle, and 24px semibold blue value. Preserve the sparse surface—these are not independent heavy cards inside the parent panel.
>
> **Section 2 — Room type metrics:** Render a second `StatisticsSection` headed `Rooms`. Its body contains four bordered `RoomTypeStatisticsCard`s for Standard, Deluxe, Executive, and VIP. Each has title, active/total count (`6 /16`), and a bottom two-column rate row: `250 /hr` and `1800 /day`, both preceded by the existing blue rate/turnaround icon. Use a 1.5px soft gray border, 8px radius, tiny soft shadow, and the established compact typography: title 14px, active count 21px gray, total 20px muted gray, price 18px blue. Use a reusable `RateDisplay` subcomponent, not duplicate JSX for hourly and daily rows.
>
> **Section 3 — Room and floor status:** Display two white sections side-by-side on wide screens: `Room status` takes 60% and `Floor status` takes 40%, with a 20px gutter. `RoomStatusStatistics` renders two equal table-like columns: Occupied rooms with total 104 and Available rooms with total 20. Each column has a semibold heading with the total blue-aligned right, then Clean / Dirty / Inspected labels and their counts aligned right. The first column has generous desktop separation from the second; on small widths that separation must disappear.
>
> `FloorStatusStatistics` owns a selected floor state, with an accessible compact shadcn select in its section header (Floor 1, Floor 2, Floor 3). Its body uses a reusable half-donut progress visual at 80%, with blue completed arc, #f0f2f5 unfinished arc, open gap at the bottom, and `80%` in the center. Place a two-item vertical legend beside it: 8px blue dot + Completed and 8px pale-gray dot + Yet to Complete. The dots may be buttons only if they actually perform an action; otherwise render them as non-interactive legend markers so keyboard users do not encounter empty controls. Use a charting/progress solution that responds to container width; do not hard-code an SVG or canvas width that overflows.
>
> **Section 4 — Occupancy and feedback:** Display `Occupancy Statistics` (70%) beside `Customers feedback` (30%) on wide screens, with a 20px gutter. Occupancy contains a responsive blue bar chart with month labels Jan through Dec and the current sample values: 88, 99, 95, 100, 60, 118, 60, 123, 64, 91, 97, 60, 108. Preserve the legacy data’s duplicated `Apr` label if exact data parity is required. Bars are #2f80ed, 18px wide on desktop when there is space, have 5px rounded top corners, and expose a tooltip with month and value. Axis tick text is 12px #666. Use `ResponsiveContainer` when using Recharts (or an equivalent responsive chart), never `<BarChart width={730}>`.
>
> Feedback is a vertical `CustomerReviews` list of reusable `CustomerReviewCard`s. Each row has 10px vertical padding and a bottom #eee separator; the top line has a 14px medium guest name left and room number right, then a 13px #666 message 4px below. Render the provided reviews in source order: Yudhishthira Pandava/A101, Draupadi/A102, Arjuna/A201, Bhima/A301, and Nakula/A405. Avoid an inner fixed-height scroll area unless the product later asks for one.
>
> **Responsive behavior is mandatory:**
>
> - Wide desktop (`>=1280px`): keep the four compact KPI/room cards in their row when space permits; use 60/40 and 70/30 layouts for sections 3 and 4.
> - Tablet (`768–1279px`): use a 2-column grid for overview and room-type cards. Keep section 3 and section 4 in two columns only when each can maintain at least 320px width; otherwise stack them. The chart must remeasure automatically.
> - Mobile (`<768px`): use one column for every top-level split and 2 columns for compact KPI/room-type cards when each remains at least 150px; fall back to one column below 360px. Sections, metric cards, chart, select, review rows, and progress display must remain inside viewport width without horizontal scrolling. In the floor panel, stack the legend below the gauge where side-by-side space is insufficient.
> - Use readable tap targets (44px for interactive controls), visible `focus-visible` rings, semantic headings, label the floor select, and respect `prefers-reduced-motion`.

## Component architecture

The following structure keeps every visual unit reusable. Names are intentionally close to the current feature components so migration is straightforward.

| Component                | Responsibility                                        | Contents / public contract                                                                                                                                                                                         |
| ------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OverviewPage`           | Orchestration only.                                   | Supplies dashboard data and lays out the four top-level sections; no individual metric or review markup.                                                                                                           |
| `StatisticsSection`      | Shared white panel / section frame.                   | `title`, optional `headerAction`, `children`, optional `className`. Implements 16px padding, 8px radius, 0 0 8px rgba(0,0,0,.05) shadow, header/title row, and responsive body slot. Replaces `StatisticsWrapper`. |
| `OverviewMetricCard`     | Reusable high-level KPI unit.                         | `title`, `subtitle`, `value`. Borderless compact horizontal metric with left copy and right-aligned blue value. Replaces `OverviewStatisticsCard`.                                                                 |
| `RoomTypeStatisticsCard` | Per-room-type capacity/rate summary.                  | `title`, `active`, `total`, `hourlyPrice`, `dailyPrice`, `currency?`. Replaces `RoomStatisticsCard`.                                                                                                               |
| `RateDisplay`            | Small reusable price line used by the room-type card. | `value`, `unit` (`/hr` or `/day`), optional icon. Keeps the blue icon/value/unit pattern consistent.                                                                                                               |
| `RoomStatusStatistics`   | Two-column operational room-condition summary.        | `occupied`, `available`, where each input has `total`, `clean`, `dirty`, `inspected`. Use an internal `RoomStatusColumn` for each side.                                                                            |
| `RoomStatusColumn`       | Private/reusable table-like status column.            | `title`, `total`, `rows`. Builds aligned heading and Clean/Dirty/Inspected rows.                                                                                                                                   |
| `FloorStatusStatistics`  | Floor-specific housekeeping progress panel.           | `floors`, `selectedFloor`, `onFloorChange`, `completedPercent`; uses `StatisticsSection` with a header select. Replaces the Ant `Select`, `Progress`, and empty-action legend buttons.                             |
| `SemiDonutProgress`      | Responsive accessible 180° progress visualization.    | `value`, `label`, `color`, `trackColor`; includes screen-reader percentage text. Can be reused in other housekeeping progress panels.                                                                              |
| `OccupancyBarChart`      | Responsive monthly occupancy visualization.           | `data: Array<{ label: string; value: number }>`; wraps the chart library in a container-safe feature component. Replaces the misspelled `OccupencyChart` / `OverviewBarChart`.                                     |
| `CustomerReviews`        | Feedback section composition and review mapping.      | `reviews`; places a review list inside `StatisticsSection`. Replaces the current hard-coded internal array with data passed from page/container.                                                                   |
| `CustomerReviewCard`     | One compact review row.                               | `name`, `roomNumber`, `message`; used anywhere feedback needs a consistent row.                                                                                                                                    |

### Suggested source boundaries

```text
src/
  pages/
    OverviewPage.tsx                 # data orchestration and section layout only
  components/feature/overview/
    StatisticsSection.tsx
    OverviewMetricCard.tsx
    RoomTypeStatisticsCard.tsx
    RateDisplay.tsx
    RoomStatusStatistics.tsx
    RoomStatusColumn.tsx
    FloorStatusStatistics.tsx
    SemiDonutProgress.tsx
    OccupancyBarChart.tsx
    CustomerReviews.tsx
    CustomerReviewCard.tsx
  types/
    overview.ts                       # OverviewMetric, RoomTypeMetric, StatusData, FloorProgress, Review, ChartDatum
```

Keep data and display separate: the page/container maps API/store data into typed view models; each feature component receives props and has no knowledge of a global store. Place status colors, labels, room types, and chart data in typed configuration/data modules rather than embedding them in several components.

## Design tokens and layout details

| Purpose                          | Value                                                          |
| -------------------------------- | -------------------------------------------------------------- |
| Page background                  | `#f2f8ff`                                                      |
| Section background               | `#ffffff`                                                      |
| Section radius                   | `8px`                                                          |
| Section shadow                   | `0 0 8px rgba(0, 0, 0, 0.05)`                                  |
| Section padding / header spacing | `16px` / `16px`                                                |
| Primary title                    | `#1e293b`, 24px, 600 (used elsewhere if a page title is added) |
| Section title                    | 17.6px (1.1rem), 600                                           |
| Neutral title / label            | `#6b7280`                                                      |
| Dark subtitle/value text         | `#4b5563` / `#5d6679`                                          |
| Muted total                      | `#858d9d`                                                      |
| Dashboard blue                   | `#2563eb` (metric/rate values), `#2f80ed` (chart/progress)     |
| Card border                      | `#e5e7eb`                                                      |
| Chart/progress track             | `#f0f2f5`                                                      |
| Review divider                   | `#eeeeee`                                                      |
| Content gutter                   | 20px desktop; 16px mobile                                      |

## Existing feature-component mapping

| Current component                     | Preserve / replace in the Tailwind version                                                                                                     |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `StatisticsWrapper`                   | Preserve the role as `StatisticsSection`; it is the shared panel primitive, not page-specific UI.                                              |
| `OverviewStatisticsCard`              | Preserve as `OverviewMetricCard`, simplifying unused `border`, `roundedBorder`, and `boxShadow` flags unless consumers require them.           |
| `RoomStatisticsCard`                  | Preserve as `RoomTypeStatisticsCard`; extract the repeated hourly/daily content into `RateDisplay`.                                            |
| `RoomStatusStatistics`                | Preserve with data-driven rows and the extracted `RoomStatusColumn`.                                                                           |
| `FloorStatusStatistics`               | Preserve its role, but replace Ant `Select`, `Progress`, and nonfunctional Buttons with shadcn Select + `SemiDonutProgress` + semantic legend. |
| `OverviewBarChart` (`OccupencyChart`) | Preserve as `OccupancyBarChart`; correct the name and use a responsive chart container.                                                        |
| `CustomerReviews`                     | Preserve as a section/list composition component, but receive review data via props.                                                           |
| `CustomerReviewCard`                  | Preserve as the single feedback-row component.                                                                                                 |

## Acceptance checklist

- No import from `antd` or `@ant-design/icons` exists in the new Overview feature.
- `OverviewPage` composes feature components; it does not become a large monolith.
- The shared section frame is used for Overview, Rooms, Room status, Floor status, Occupancy Statistics, and Customers feedback.
- The visual hierarchy, data labels, values, and desktop proportions match the current screen.
- The floor selector controls the selected floor state, and all progress/chart visuals resize with their containers.
- Desktop side-by-side sections stack gracefully before they become cramped; no horizontal page scrolling occurs at any viewport size.
- The chart, select, legend, and any clickable component are accessible by keyboard and have visible focus states.
- All dashboard data interfaces are typed and reusable; no display component reaches directly into a global store.
