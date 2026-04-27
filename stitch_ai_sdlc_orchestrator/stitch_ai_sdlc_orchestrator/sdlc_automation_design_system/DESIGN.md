---
name: SDLC Automation Design System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#424753'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#0059c5'
  primary: '#0050b2'
  on-primary: '#ffffff'
  primary-container: '#1868db'
  on-primary-container: '#ecefff'
  inverse-primary: '#aec6ff'
  secondary: '#575e74'
  on-secondary: '#ffffff'
  secondary-container: '#d8dffa'
  on-secondary-container: '#5b6279'
  tertiary: '#535458'
  on-tertiary: '#ffffff'
  tertiary-container: '#6c6c71'
  on-tertiary-container: '#f0eef4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#aec6ff'
  on-primary-fixed: '#001a43'
  on-primary-fixed-variant: '#004397'
  secondary-fixed: '#dbe2fd'
  secondary-fixed-dim: '#bfc6e0'
  on-secondary-fixed: '#141b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e3e2e7'
  tertiary-fixed-dim: '#c7c6cb'
  on-tertiary-fixed: '#1a1b1f'
  on-tertiary-fixed-variant: '#46464b'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: monospace
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

## Brand & Style

The design system is engineered for high-velocity software development environments where clarity, precision, and information density are paramount. It targets technical personas—engineers, product managers, and DevOps specialists—who require a tool that fades into the background while facilitating complex decision-making.

The visual style is **Corporate / Modern**. It prioritizes a systematic approach to layout, drawing inspiration from high-utility productivity suites. The aesthetic is "utilitarian-premium," characterized by a strict adherence to logical groupings, clear visual hierarchies, and a restrained use of color to highlight actionable data and system status. It avoids unnecessary ornamentation, focusing instead on structural integrity and the seamless automation of the software development lifecycle.

## Colors

The color palette is anchored by a vibrant, "action-oriented" primary blue (#1868DB) used for primary calls to action, active states, and focus indicators. The deep navy (#050C1F) serves as the primary text and navigation background color, providing high-contrast grounding for the interface.

A functional logic dictates the rest of the palette:
- **Surface & Secondary:** #292A2E is used for secondary text, icons, and subtle borders to differentiate content areas without adding visual noise.
- **Pure White:** #FFFFFF is the foundational canvas color, ensuring maximum legibility for dense data tables and complex workflows.
- **Functional Accents:** Status-driven colors (Green for Success/Done, Amber for Warning/In-Progress, Red for Danger/Blocked) follow standard industry patterns to ensure immediate cognitive recognition within SDLC pipelines.

## Typography

This design system utilizes **Inter** for all UI elements due to its exceptional legibility at small sizes and its neutral, systematic character. The typography system is built on a modular scale designed to handle high-density information layouts common in SDLC automation.

Key typographic rules:
- **Hierarchical Contrast:** Bold weights are reserved for page headers and section titles to orient the user quickly.
- **Functional Labels:** Captions and metadata labels use a smaller, semi-bold treatment to remain legible while occupying minimal space.
- **Code Blocks:** For AI-generated snippets or Git commits, a monospaced font is used to maintain structural alignment and technical familiarity.

## Layout & Spacing

The layout philosophy is based on a **12-column fluid grid system** with 16px gutters and 24px outer margins. This allows the UI to scale seamlessly from narrow sidebar-driven views (like a backlog) to wide-screen dashboards (like automation pipelines).

A strict 4px base unit governs all spatial relationships. Components like cards and list items use tight internal padding (8px to 12px) to maximize the "information per pixel" ratio, which is critical for developers managing large-scale projects. Layouts should utilize persistent left-hand navigation and contextual right-hand drawers for detail views to maintain the user's primary workflow context.

## Elevation & Depth

To maintain a clean and professional look, the design system utilizes **Low-contrast outlines** and **Tonal layers** rather than heavy shadows.

- **Level 0 (Base):** Used for the primary background (#FFFFFF).
- **Level 1 (Surface):** Subtle light grey (#F4F5F7) backgrounds for sidebars and header bars to provide structural grouping.
- **Level 2 (Object):** Cards and modal containers use a 1px solid border (#DFE1E6) to define their boundaries.
- **Interaction Depth:** Subtle, extra-diffused shadows (4px blur, 5% opacity) are reserved exclusively for floating elements like dropdown menus or active drag-and-drop objects to indicate they are "hovering" over the workspace.

## Shapes

The shape language is **Soft (Level 1)**. Most UI elements, including buttons, input fields, and task cards, feature a 4px (0.25rem) corner radius. This provides a modern, approachable feel while maintaining the geometric rigor expected of professional enterprise software. Large containers like modals or dashboards use a slightly larger 8px (0.5rem) radius to soften the overall interface without losing the structured appearance.

## Components

### Buttons
Primary buttons use the brand blue (#1868DB) with white text. Secondary buttons use a light grey ghost style with an outline. All buttons have a height of 32px or 40px depending on the context.

### Chips & Badges
Essential for tracking issue statuses and AI labels. They use a "Lozenge" shape with subtle background tints and high-contrast text. For example, a "Done" status chip has a light green background with dark green text.

### Inputs & Selects
Input fields feature a 1px solid border that thickens and changes to the primary blue on focus. Help text and error messages are placed immediately below the field in 12px type.

### Cards
Workflow cards (e.g., Jira-style tickets) are white with a subtle 1px border. They should include a clear header, a brief description, and a footer containing metadata like avatars, priority icons, and task keys.

### Activity Feeds
Lists of automated actions or Git commits should use a compact, vertical timeline layout with 1px vertical connectors to visually link sequential events.

### Data Tables
Tables are the backbone of the platform. They should use a "zebra-stripe" or "clean-line" style with sticky headers and the ability to resize columns, prioritizing high density and horizontal scrolling for wide data sets.