# 🎨 Branded PDF Template System - Prism Specialties DMV

## Overview
Professional PDF template system that maintains consistent branding, authority positioning, and user experience across all emergency checklists and resources.

## 🎯 Brand Identity System

### Primary Brand Colors
```css
:root {
    --prism-primary: #00a0df;      /* Primary Blue - Headers, CTAs */
    --prism-secondary: #0080c7;    /* Darker Blue - Accents */
    --prism-accent: #e74c3c;       /* Emergency Red - Urgent items */
    --prism-dark: #2c3e50;         /* Dark Gray - Body text */
    --prism-success: #27ae60;      /* Green - Completed, Safe */
    --prism-warning: #f39c12;      /* Orange - Caution items */
    --emergency-red: #e74c3c;      /* Emergency actions */
    --emergency-orange: #ff6b35;   /* Time-critical items */
}
```

### Typography Hierarchy
- **Primary Font**: Inter (Google Fonts) - Professional, readable
- **Fallback Fonts**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Sizes**: H1 (28px), H2 (22px), H3 (18px), Body (14px), Small (12px)
- **Weights**: Light (400), Medium (500), Semi-bold (600), Bold (700)

## 📄 PDF Template Structure

### Header Section
```html
<!-- Professional Header -->
<header class="pdf-header">
    <div class="header-left">
        <div class="company-logo">P</div>
        <div class="company-info">
            <h1>Prism Specialties DMV</h1>
            <div class="company-tagline">Professional Emergency Response & Restoration</div>
        </div>
    </div>
    <div class="header-right">
        <div class="emergency-hotline">📞 (301) 215-3191</div>
        <div class="professional-badge">✓ Specialty Contents</div>
    </div>
</header>
```

### Authority Banner
```html
<!-- Authority & Credibility -->
<section class="authority-banner">
    <h2>[Emergency Type] - Professional Protocol</h2>
    <div class="authority-subtitle">Used by Emergency Responders & Insurance Adjusters</div>
    <div class="credentials-row">
        <div class="credential-badge">✓ Specialty Contents</div>
        <div class="credential-badge">✓ Insurance Approved</div>
        <div class="credential-badge">✓ EPA Compliant</div>
        <div class="credential-badge">✓ 24/7 Emergency Response</div>
    </div>
</section>
```

### Critical Timeline (Emergency-Specific)
```html
<!-- Time-Critical Information -->
<section class="critical-timeline">
    <h3>⏰ Critical Action Timeline - Time Sensitive!</h3>
    <div class="timeline-grid">
        <div class="timeline-item">
            <div class="timeline-time">IMMEDIATE (0-2 Hours)</div>
            <div class="timeline-action">Safety assessment, professional contact</div>
        </div>
        <!-- Additional timeline items -->
    </div>
</section>
```

### Checklist Format
```html
<!-- Professional Checklist Items -->
<div class="checklist-item">
    <div class="checklist-checkbox"></div>
    <div class="checklist-content">
        <div class="checklist-title">Action Item Title</div>
        <div class="checklist-description">Detailed instructions and context</div>
        <div class="checklist-priority priority-critical">Critical</div>
    </div>
</div>
```

### Footer Section
```html
<!-- Professional Footer -->
<footer class="pdf-footer">
    <div class="footer-left">
        <!-- Regional Offices -->
    </div>
    <div class="footer-center">
        <div class="qr-code">QR CODE<br>Scan for Resources</div>
    </div>
    <div class="footer-right">
        <!-- Certifications & Contact -->
    </div>
</footer>
```

## 🏢 Contact Information System

### Emergency Hotline
**Primary Number**: (301) 215-3191
- **Available**: 24/7/365
- **Purpose**: Emergency response and consultation
- **Placement**: Header, footer, emergency sections

### Regional Offices

#### Northern Virginia Office
```
1234 Technology Drive
Herndon, VA 20170
(703) 555-0123
```

#### Maryland Office
```
5678 Executive Boulevard
Rockville, MD 20852
(301) 555-0124
```

#### Washington DC Office
```
901 K Street NW, Suite 300
Washington, DC 20001
(202) 555-0125
```

## 🏆 Authority Messaging Framework

### Professional Credentials
- **Specialty Contents Recovery Experts**
- **Document Restoration Specialists**
- **Electronics Recovery Services**
- **Art & Antique Conservation**
- **Textile & Fabric Care**

### Insurance Approval Language
```
"Insurance Adjuster Approved Protocol"
"Meets All Insurance Documentation Requirements"
"Professional Standards Exceed Industry Requirements"
"Preferred Vendor for Major Insurance Companies"
```

### Authority Positioning Statements
- "Used by Emergency Professionals"
- "Trusted by Insurance Adjusters"
- "Museum-Quality Restoration Techniques"
- "24/7 Emergency Response Team"
- "Licensed • Bonded • Insured"

## 📱 QR Code Resource System

### QR Code Destinations
1. **Additional Resources Hub**: `/emergency-resources/[checklist-type]`
2. **Video Tutorials**: YouTube playlist for each emergency type
3. **Digital Checklist**: Interactive online version
4. **Emergency Contact Form**: Direct consultation request
5. **Insurance Documentation**: Downloadable templates

### QR Code Implementation
```html
<div class="qr-code">
    <!-- Actual QR code image or generator -->
    <img src="/assets/qr-codes/fire-damage-resources.png" alt="QR Code">
    <div class="qr-text">Scan for Resources</div>
</div>
```

## 🎨 Visual Design Elements

### Priority Color Coding
- **Critical (Red)**: Immediate safety concerns, emergency actions
- **Urgent (Orange)**: Time-sensitive actions, 24-hour deadline
- **Important (Green)**: Essential but not immediate
- **Informational (Blue)**: Tips, professional insights

### Professional Icons
- 🚨 Emergency/Critical
- ⏰ Time-sensitive
- 📞 Contact/Call
- 📋 Documentation
- 💡 Professional tip
- ✅ Completed/Safe
- ⚠️ Warning/Caution
- 📸 Photo/Document

### Section Styling
```css
/* Section Headers */
.section-header {
    background: var(--bg-secondary);
    padding: 15px 20px;
    border-left: 5px solid var(--prism-primary);
    margin-bottom: 20px;
    border-radius: 0 8px 8px 0;
}

/* Professional Tips */
.pro-tip {
    background: #f0f8ff;
    border: 2px solid var(--prism-primary);
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    position: relative;
}

/* Insurance Alerts */
.insurance-alert {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    border: 2px solid var(--emergency-orange);
    border-radius: 8px;
    padding: 20px;
    margin: 25px 0;
}
```

## 📝 Content Template Variations

### Fire Damage Template
- **Primary Color**: Emergency Red (#e74c3c)
- **Icon Theme**: 🔥 Fire, smoke, heat
- **Timeline**: 0-2 hours, 2-12 hours, 12-24 hours, 24-48 hours
- **Key Messaging**: Speed critical, smoke damage spreads

### Water Damage Template
- **Primary Color**: Water Blue (#3498db)
- **Icon Theme**: 💧 Water, moisture, flooding
- **Timeline**: 0-1 hour, 1-6 hours, 6-24 hours, 24-48 hours
- **Key Messaging**: Mold prevention, immediate extraction

### Lightning Strike Template
- **Primary Color**: Electric Yellow (#f1c40f)
- **Icon Theme**: ⚡ Lightning, electrical, surge
- **Timeline**: Immediate, 2-4 hours, 24 hours, ongoing
- **Key Messaging**: Hidden damage, electrical safety

### Document Recovery Template
- **Primary Color**: Document Purple (#9b59b6)
- **Icon Theme**: 📄 Documents, preservation, digital
- **Timeline**: Immediate, 4-8 hours, 24 hours, restoration
- **Key Messaging**: Preservation techniques, digital backup

## 🔧 Technical Implementation

### Print Optimization
```css
@media print {
    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .pdf-container {
        box-shadow: none;
        max-width: none;
        margin: 0;
        padding: 0.5in;
    }

    .checklist-item {
        page-break-inside: avoid;
    }
}
```

### Mobile Responsiveness
```css
@media (max-width: 768px) {
    .pdf-header {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }

    .timeline-grid {
        grid-template-columns: 1fr;
    }

    .pdf-footer {
        grid-template-columns: 1fr;
        text-align: center;
    }
}
```

### File Organization
```
/checklists/assets/pdfs/
├── fire-damage-first-48-hours.html
├── water-emergency-save-what-matters.html
├── lightning-strike-power-surge.html
├── document-recovery-checklist.html
├── storm-damage-structure-assessment.html
└── emergency-response-master-checklist.html

/checklists/assets/previews/
├── fire-damage-first-48-hours-preview.png
├── water-emergency-save-what-matters-preview.png
├── lightning-strike-power-surge-preview.png
└── document-recovery-checklist-preview.png

/checklists/assets/qr-codes/
├── fire-damage-resources.png
├── water-damage-resources.png
├── lightning-resources.png
└── document-resources.png
```

## 📊 Brand Consistency Checklist

### Visual Elements ✅
- [ ] Prism Specialties logo prominently displayed
- [ ] Consistent color scheme throughout
- [ ] Professional typography (Inter font family)
- [ ] Emergency hotline clearly visible
- [ ] Regional office information included
- [ ] QR code for additional resources

### Content Elements ✅
- [ ] Authority messaging present
- [ ] Insurance approval language included
- [ ] Professional certifications listed
- [ ] 24/7 emergency contact emphasized
- [ ] Time-critical information highlighted
- [ ] Professional tips and insights

### Technical Elements ✅
- [ ] Print-optimized formatting
- [ ] Mobile-responsive design
- [ ] Fast loading times
- [ ] Accessible color contrast
- [ ] Scannable QR codes
- [ ] SEO-friendly metadata

This branded PDF template system ensures every emergency checklist reinforces Prism Specialties' professional authority while providing maximum value to users in crisis situations.