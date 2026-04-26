# Design System Specification: 

## 1. Overview & Creative North Star
### The Creative North Star: "The Digital Biologist"
This design system moves away from the "toy-like" aesthetic of traditional creature-collection interfaces. Instead, we are building a high-end, editorial field guide. Think of a premium digital journal used by a researcher—clean, authoritative, yet vibrantly alive.

We break the "standard app" template by utilizing **intentional asymmetry** and **tonal depth**. Rather than a rigid grid of identical boxes, we use varied card proportions and overlapping elements (like a Pokémon's sprite breaking the container's edge) to create a sense of motion and organic life. Typography is our primary architectural tool, using dramatic scale shifts to create a clear narrative hierarchy.

---

## 2. Colors & Surface Architecture
Our palette centers on the iconic red of the Pokédex, but interpreted through a sophisticated Material Design lens to ensure depth and accessibility.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Boundaries must be established through:
1.  **Background Color Shifts:** Placing a `surface-container-low` card on a `surface` background.
2.  **Tonal Transitions:** Using the subtle difference between `surface-container` and `surface-container-high`.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the following nesting logic to create depth:
*   **Base Layer:** `surface` (The foundation).
*   **Secondary Sections:** `surface-container-low` (Subtle grouping).
*   **Primary Interaction Cards:** `surface-container-lowest` (The "white paper" feel).
*   **Floating Modals/Popovers:** `surface-container-highest` (The closest layer to the user).

### The Glass & Signature Textures
*   **Glassmorphism:** Use semi-transparent `surface` colors with a `backdrop-filter: blur(20px)` for navigation bars and floating action buttons. This allows the vibrant type-based backgrounds (Water, Grass, Fire) to bleed through softly.
*   **Signature Gradients:** Use a subtle linear gradient (Top-Left to Bottom-Right) from `primary` to `primary-container` for hero elements. This adds a "soul" to the red that a flat hex code cannot achieve.
*   **The Pattern:** Pokéball motifs must be implemented as high-frequency, low-contrast watermarks using `outline-variant` at 5-10% opacity.

---

## 3. Typography
We use a dual-font strategy to balance character with readability.

*   **Display & Headlines (Plus Jakarta Sans):** Chosen for its modern, geometric curves that feel high-tech yet approachable. Use `display-lg` for Pokémon names to create an editorial, "magazine-cover" feel.
*   **Body & Labels (Inter):** The workhorse. Inter provides exceptional legibility for complex stats and descriptions.

**The Hierarchy Goal:**
The gap between a Pokémon’s name (`display-md`) and its category (`label-md`) should be dramatic. Use `on-surface-variant` for secondary metadata to ensure the eye is drawn to the high-contrast `primary` headlines first.

---

## 4. Elevation & Depth
Traditional drop shadows are too "heavy" for a modern encyclopedia. We use **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on top of a `surface-container` background to create a natural lift.
*   **Ambient Shadows:** For floating elements, use a shadow with a 32px blur and 4% opacity, tinted with the `on-surface` color.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in high-contrast mode), use the `outline-variant` token at **15% opacity**. Never use 100% opaque lines.
*   **Glass Depth:** When a Pokémon's elemental type (Water/Grass) is the background, overlay cards with 80% opacity and a backdrop blur to integrate the creature into its environment.

---

## 5. Components

### Cards & Lists
*   **The Forbid Rule:** No divider lines between list items. Use 16px or 24px of vertical whitespace or a subtle shift to `surface-container-low` on hover.
*   **The "Breakout" Element:** Images of Pokémon should overlap the top or side edge of their container by 8-12px to break the boxy feel.

### Buttons
*   **Primary:** Solid `primary` background with `on-primary` text. `xl` (1.5rem) rounded corners.
*   **Secondary:** `secondary-container` background with `on-secondary-container` text.
*   **Glass Variant:** For "Capture" actions, use a semi-transparent blur button to maintain the background's visibility.

### Type Badges (Chips)
*   Instead of flat colors, use a subtle 10% opacity fill of the type color (Water Blue, Grass Green) with a matching colored text.
*   Shape: `full` roundedness (9999px) for a pill-shaped look.

### Input Fields
*   **State:** Use `surface-container-high` for the field background. 
*   **Focus:** Transition the "Ghost Border" from 15% to 60% opacity using the `primary` color. No heavy 2px strokes.

### Evolution Trackers (Specialty Component)
*   Use a "connected-surface" approach. Instead of an arrow, use a continuous `surface-container-highest` shape that flows between the different stages of the Pokémon.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical margins. A larger left-hand margin for a Pokémon's name creates a "sidebar" feel for stats.
*   **Do** use color to signify type, but keep it muted. A "Fire" screen should feel like a "tinted room," not a "bucket of red paint."
*   **Do** prioritize whitespace. Information density should feel like a premium textbook, not a spreadsheet.

### Don't:
*   **Don't** use black (`#000000`). Use `on-background` or `on-surface` for deep tones to keep the palette organic.
*   **Don't** use standard Material shadows (Level 1-5). Use our Tonal Layering and Ambient Shadow specs.
*   **Don't** center-align long blocks of text. Stick to left-aligned editorial layouts for body copy.
*   **Don't** use 1px dividers. If you feel you need a divider, increase the spacing by 8px instead.