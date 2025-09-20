# Prism Specialties Logo Specifications

## Brand Colors (CRITICAL - Must Match Exactly)
- **"Prism" Text**: Blue #00a0df
- **"SPECIALTIES" Text**: Gray #7c878f
- **Background**: Light Gray #e8eaed or Transparent
- **Registered Trademark**: ® symbol required on all logos

## Required Logo Files

### Navigation Header Logo
- **File**: `prism-logo-300.png`
- **Dimensions**: 300px width (height auto-proportioned)
- **Usage**: Header navigation, mobile displays
- **Requirements**: 
  - Clear visibility at small sizes
  - Includes ® symbol
  - Blue #00a0df for "Prism"
  - Gray #7c878f for "SPECIALTIES"

### Footer and Hero Logo
- **File**: `prism-logo-500.png`
- **Dimensions**: 500px width (height auto-proportioned)
- **Usage**: Footer sections, hero banners
- **Requirements**:
  - Medium-resolution displays
  - Professional presentation
  - Full brand color compliance
  - Clear ® symbol visibility

### High-Resolution Display Logo
- **File**: `prism-logo-1000.png`
- **Dimensions**: 1000px width (height auto-proportioned)
- **Usage**: Retina displays, high-DPI screens
- **Requirements**:
  - Crisp edges on high-resolution displays
  - Perfect color accuracy
  - Sharp ® symbol rendering

### Marketing Materials Logo
- **File**: `prism-logo-2000.png`
- **Dimensions**: 2000px width (height auto-proportioned)
- **Usage**: Print materials, large format displays, marketing
- **Requirements**:
  - Print-quality resolution (300+ DPI when sized)
  - Professional marketing standard
  - Brand guideline compliance
  - ® symbol clearly visible at all sizes

## Technical Requirements

### File Format
- **Format**: PNG with transparency
- **Color Profile**: sRGB
- **Compression**: Optimized for web while maintaining quality

### Brand Compliance Checklist
- [ ] "Prism" text uses exact color #00a0df (blue)
- [ ] "SPECIALTIES" text uses exact color #7c878f (gray)
- [ ] Registered trademark ® symbol included
- [ ] Proper letter spacing and typography
- [ ] Transparent background (no white box)
- [ ] Crisp edges with anti-aliasing
- [ ] Consistent proportions across all sizes

### CSS Implementation
```css
.logo-header {
  width: 300px;
  height: auto;
  background-image: url('../images/logos/prism-logo-300.png');
}

.logo-footer {
  width: 500px;
  height: auto;
  background-image: url('../images/logos/prism-logo-500.png');
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .logo-header {
    background-image: url('../images/logos/prism-logo-1000.png');
    background-size: 300px auto;
  }
  
  .logo-footer {
    background-image: url('../images/logos/prism-logo-2000.png');
    background-size: 500px auto;
  }
}
```

## Directory Structure
```
images/
├── logos/
│   ├── prism-logo-300.png    (Header navigation)
│   ├── prism-logo-500.png    (Footer/hero sections)
│   ├── prism-logo-1000.png   (High-resolution displays)
│   └── prism-logo-2000.png   (Marketing materials)
├── icons/                    (Service icons, social media)
├── backgrounds/              (Hero backgrounds, textures)
└── services/                 (Service-specific imagery)
```

## Quality Control
1. **Color Accuracy**: Use digital color picker to verify exact hex values
2. **Trademark Symbol**: Must be visible and legible at all sizes
3. **File Size**: Optimize for web without compromising quality
4. **Transparency**: Ensure proper alpha channel for overlays
5. **Cross-Browser**: Test rendering in all major browsers

## IMPORTANT NOTES
- Logo files must be obtained from official Prism Specialties brand assets
- Never recreate or modify the official logo design
- Maintain exact color specifications for franchise compliance
- All logo usage must include the ® registered trademark symbol
- Contact franchise headquarters for official logo assets if not available