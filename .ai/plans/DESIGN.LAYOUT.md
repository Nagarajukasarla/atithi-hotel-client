# Portal Layout Design — Sidebar Profile + Header Actions

## Objective

Create the main application shell for the Host/Hotel Management Portal using:

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

Do not use Ant Design, Chakra UI, Material UI, or any other UI framework.

The layout must be completely responsive and reusable across all application pages.

The main application shell consists of:

1. Collapsible Sidebar
2. Top Header
3. Main Content Area

The layout should be designed as a reusable application-level component rather than being implemented separately inside every page.

---

# 1. Overall Layout

Desktop structure:

```text
┌───────────────────────────────────────────────────────────────┐
│                       TOP HEADER                              │
│  Menu / Breadcrumb                              Bell   Avatar │
├──────────────┬────────────────────────────────────────────────┤
│              │                                                │
│   SIDEBAR    │                                                │
│              │                                                │
│   Profile    │              PAGE CONTENT                      │
│              │                                                │
│   Overview   │                                                │
│   Bookings   │                                                │
│   Rooms      │                                                │
│   Settings   │                                                │
│   Plans      │                                                │
│              │                                                │
│   Logout     │                                                │
│              │                                                │
└──────────────┴────────────────────────────────────────────────┘
```

The sidebar must remain fixed on desktop.

The header must remain fixed at the top of the content area.

The page content should occupy all remaining available space.

---

# 2. Sidebar

## Desktop Expanded Width

Use approximately:

```text
256px
```

The sidebar should have:

```text
width: 256px
height: 100vh
```

It should not grow based on content.

---

# 3. Sidebar Collapsed State

When collapsed:

```text
72px
```

Only icons should be visible.

Example:

```text
┌──────┐
│  ◉   │
│      │
│  ▣   │
│  ▤   │
│  ▦   │
│  ⚙   │
│  ◆   │
│      │
│  ↪   │
└──────┘
```

Do not display:

- Navigation text
- User name
- User subtitle
- Workspace name
- Dropdown
- Workspace switcher

The sidebar should transition smoothly between:

```text
256px → 72px
```

Use a short transition around:

```text
duration-200
ease-in-out
```

---

# 4. Sidebar Navigation

The sidebar must contain only these six navigation items:

```text
Overview
Bookings
Rooms
Settings
Plans
Logout
```

Do NOT create:

- Navigation groups
- Categories
- Section headings
- Nested navigation
- Expandable navigation items
- Workspace switcher
- Workspace dropdown
- Submenus

Every item is a single-level navigation item.

---

# 5. Navigation Icons

Use Lucide React icons.

Recommended:

```text
Overview  → LayoutDashboard
Bookings  → CalendarCheck
Rooms     → BedDouble
Settings  → Settings
Plans     → CreditCard
Logout    → LogOut
```

Icons should be approximately:

```text
18px
```

with a subtle stroke weight.

---

# 6. Navigation Item Layout

Expanded:

```text
┌───────────────────────────────┐
│  ▣   Overview                 │
│                               │
│  ▣   Bookings                 │
│                               │
│  ▣   Rooms                    │
│                               │
│  ⚙   Settings                 │
│                               │
│  ◆   Plans                   │
│                               │
│  ↪   Logout                   │
└───────────────────────────────┘
```

Use:

```text
height: 40–42px
padding: 8px 12px
border-radius: 8px
gap: 10–12px
```

---

# 7. Active Navigation Item

The currently selected page must be visually distinguishable.

Use the project's primary blue at a very subtle intensity.

Example:

```text
background: primary-50
icon: primary-600
text: primary-700
```

Do not use a highly saturated full-blue background.

The active item should feel elegant and subtle.

Example:

```text
Overview
────────────────
background: #F5F8FF
icon: #3D6AE8
text: #2F56C9
```

---

# 8. Hover State

Inactive navigation:

```text
text: muted
background: transparent
```

Hover:

```text
background: surface-hover
text: primary text
```

Use a short transition.

Do not create strong animations.

---

# 9. Collapsed Navigation

When the sidebar is collapsed:

```text
[ icon ]
[ icon ]
[ icon ]
[ icon ]
[ icon ]
[ icon ]
```

Icons must be horizontally centered.

When hovering over an icon, show a shadcn/ui Tooltip containing:

```text
Overview
Bookings
Rooms
Settings
Plans
Logout
```

The tooltip is mandatory because navigation labels are hidden in collapsed mode.

---

# 10. Sidebar Profile

The user identity should live inside the sidebar.

Place it near the bottom of the sidebar above Logout.

Example expanded:

```text
──────────────────────────
○  Nagaraju Kasarla
   Host Administrator
──────────────────────────
↪  Logout
```

Use shadcn:

```text
Avatar
```

The profile must NOT have:

- Dropdown
- Workspace switcher
- Account switcher
- Plan switcher

It is purely informational.

---

# 11. Collapsed Profile

When sidebar is collapsed:

```text
   ○
```

Only the avatar should remain visible.

On hover:

```text
Nagaraju Kasarla
Host Administrator
```

can be shown through a Tooltip.

---

# 12. Top Header

The header should have approximately:

```text
height: 64px
```

It should have:

```text
background: white
border-bottom: 1px solid border
```

Left side:

```text
Sidebar toggle
Page title / breadcrumb
```

Right side:

```text
Notification
Profile Avatar
```

---

# 13. Sidebar Toggle

Use:

```text
PanelLeft
PanelLeftClose
```

from Lucide.

Expanded:

```text
PanelLeftClose
```

Collapsed:

```text
PanelLeft
```

The button should be subtle and should not look like a primary action.

---

# 14. Notification

Place notification at the top-right.

Use:

```text
Bell
```

Recommended structure:

```text
┌──────┐
│  🔔  │
└──────┘
```

If unread notifications exist, show a small badge.

Example:

```text
       ●
      🔔
```

Do not use a large red notification bubble.

Use a small semantic indicator.

Clicking the notification button should later open a shadcn:

```text
Popover
```

or:

```text
Sheet
```

depending on the amount of notification content.

---

# 15. Header Profile

The header should contain a compact avatar on the right.

Example:

```text
                    🔔   ○
```

The avatar should be approximately:

```text
32px × 32px
```

The header profile should not duplicate the full user information because the full identity already exists inside the sidebar.

For now, the avatar is simply an action target for future profile functionality.

---

# 16. Mobile Behavior

On mobile:

The permanent sidebar must disappear.

Instead, use a shadcn:

```text
Sheet
```

for navigation.

Header:

```text
┌─────────────────────────────────┐
│ ☰                         🔔  ○ │
└─────────────────────────────────┘
```

Clicking the menu button opens the sidebar from the left.

The mobile sidebar should contain:

```text
Avatar
Name
Subtitle

Overview
Bookings
Rooms
Settings
Plans
Logout
```

The Sheet should close automatically after navigation.

---

# 17. Main Content

The application shell should expose:

```tsx
<DashboardLayout>
    <PageContent />
</DashboardLayout>
```

Do not place page-specific UI inside the layout.

For example:

```tsx
<DashboardLayout>
    <OverviewPage />
</DashboardLayout>
```

and:

```tsx
<DashboardLayout>
    <BookingsPage />
</DashboardLayout>
```

The layout must only handle:

- Sidebar
- Header
- Navigation
- Responsive behavior
- Content container

---

# 18. Component Structure

Create reusable components:

```text
components/
└── layout/
    ├── AppLayout.tsx
    ├── Sidebar.tsx
    ├── SidebarHeader.tsx
    ├── SidebarNavigation.tsx
    ├── SidebarNavigationItem.tsx
    ├── SidebarProfile.tsx
    ├── SidebarToggle.tsx
    ├── Header.tsx
    ├── HeaderActions.tsx
    ├── NotificationButton.tsx
    └── MobileNavigation.tsx
```

Do not create one huge `DashboardLayout.tsx`.

Each component should have one responsibility.

---

# 19. Responsive Requirements

The new implementation must be responsive across:

```text
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

Never use fixed positioning that causes content overlap.

The main content must automatically adapt when:

```text
sidebar = 256px
```

and:

```text
sidebar = 72px
```

---

# 20. Design Characteristics

The visual style should be:

- Minimal
- Modern
- Professional
- Calm
- SaaS-oriented
- Clean
- Lightweight

Avoid:

- Excessive gradients
- Excessive shadows
- Strong borders
- Huge icons
- Heavy animations
- Bright backgrounds
- Multiple accent colors

Use the established blue design system as the primary accent.

---

# 21. Accessibility

All navigation items must:

- Be keyboard accessible.
- Have visible focus states.
- Have meaningful accessible labels.
- Work correctly with screen readers.
- Have tooltips in collapsed mode.

The sidebar toggle must have:

```text
aria-label="Toggle sidebar"
```

Notification:

```text
aria-label="Notifications"
```

---

# 22. Final Requirement

The final implementation should feel like a modern hotel/property management SaaS application rather than a generic admin dashboard.

The navigation should be simple:

```text
Overview
Bookings
Rooms
Settings
Plans
Logout
```

No workspace system.

No categories.

No nested menus.

No navigation groups.

No unnecessary controls.

The sidebar should communicate the product structure immediately while the header provides only global actions such as notifications and profile.
