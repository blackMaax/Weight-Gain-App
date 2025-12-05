# Design System Documentation

This document outlines the centralized design system for the Weight Gain App.

## Color Palette

### Primary Colors
- **Dark Red**: `#780000` - Used for hover states, dark accents
- **Bright Red**: `#C1121F` - Primary action color, active states
- **Cream**: `#FDF0D5` - Background color, light surfaces
- **Dark Blue**: `#003049` - Primary text, headings
- **Light Blue**: `#669BBC` - Secondary actions, accents

### Usage
```tsx
// ✅ Good - Use design system colors
className="bg-primary text-primary-foreground"
className="bg-cream text-dark-blue"

// ❌ Bad - Hardcoded colors
className="bg-[#C1121F] text-[#FDF0D5]"
```

## Spacing Scale

Use consistent spacing throughout:
- `xs`: 4px (0.25rem)
- `sm`: 8px (0.5rem)
- `md`: 16px (1rem)
- `lg`: 24px (1.5rem)
- `xl`: 32px (2rem)
- `2xl`: 48px (3rem)

### Usage
```tsx
// ✅ Good - Use Tailwind spacing scale
className="p-4 gap-6 mb-8"

// ❌ Bad - Custom spacing
className="p-[18px] gap-[27px]"
```

## Typography

### Font Families
- **Sans**: Geist (primary)
- **Mono**: Geist Mono (code)

### Font Sizes
- `xs`: 12px
- `sm`: 14px
- `base`: 16px
- `lg`: 18px
- `xl`: 20px
- `2xl`: 24px
- `3xl`: 30px
- `4xl`: 36px
- `5xl`: 48px

### Font Weights
- `normal`: 400
- `medium`: 500
- `semibold`: 600
- `bold`: 700
- `black`: 900

### Usage
```tsx
// ✅ Good - Use semantic classes
<h1>Title</h1>
<p className="text-sm text-muted-foreground">Description</p>

// ❌ Bad - Inline styles or hardcoded values
<h1 style={{ fontSize: '36px' }}>Title</h1>
```

## Border Radius

- `sm`: 8px
- `md`: 12px
- `lg`: 16px (default)
- `xl`: 24px
- `2xl`: 32px
- `full`: 9999px

### Usage
```tsx
// ✅ Good
className="rounded-xl"
className="rounded-lg"

// ❌ Bad
className="rounded-[16px]"
```

## Shadows

- `sm`: Small shadow for subtle elevation
- `md`: Medium shadow (default for cards)
- `lg`: Large shadow for modals
- `xl`: Extra large shadow
- `inner`: Inner shadow for inputs

### Usage
```tsx
// ✅ Good
className="shadow-md"
className="shadow-lg hover:shadow-xl"

// ❌ Bad
className="shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
```

## Components

### Cards
```tsx
// Use the utility class
<div className="ds-card">
  Content
</div>

// Or manually
<div className="bg-card text-card-foreground rounded-xl p-6 shadow-md border border-border">
  Content
</div>
```

### Buttons
```tsx
// Primary button
<button className="ds-button-primary px-6 py-3">
  Click me
</button>

// Secondary button
<button className="ds-button-secondary px-6 py-3">
  Cancel
</button>
```

### Inputs
```tsx
<input className="ds-input" type="text" />
```

## Transitions

- `fast`: 150ms
- `normal`: 200ms (default)
- `slow`: 300ms
- `slower`: 500ms

### Usage
```tsx
className="transition-all duration-200"
```

## Best Practices

1. **Always use design system tokens** - Never hardcode colors, spacing, or other values
2. **Use semantic color names** - `primary`, `secondary`, `muted` instead of color names
3. **Consistent spacing** - Use the spacing scale (4px increments)
4. **Typography hierarchy** - Use heading tags (h1-h6) for proper hierarchy
5. **Responsive design** - Use Tailwind responsive prefixes (`md:`, `lg:`) consistently
6. **Accessibility** - Ensure sufficient color contrast (WCAG AA minimum)

## Migration Guide

When updating existing components:

1. Replace hardcoded colors with design system colors
2. Replace custom spacing with spacing scale
3. Use utility classes where possible
4. Update border radius to use standard values
5. Ensure shadows use the shadow scale

## Examples

### Before (Bad)
```tsx
<div className="bg-[#FDF0D5] p-[24px] rounded-[16px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
  <h1 className="text-[36px] text-[#003049]">Title</h1>
</div>
```

### After (Good)
```tsx
<div className="ds-card">
  <h1>Title</h1>
</div>
```


