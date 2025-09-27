# 🏷️ GoHighLevel Tagging System for Lead Qualification

## Overview
Comprehensive tagging system for automatic lead qualification and nurture sequence management in GoHighLevel.

## 📊 Core Tags

### Lead Source Tags
- `website_form` - Contact from website form submission
- `pdf_viewer` - Contact accessed PDF viewer
- `sms_opt_in` - Contact opted into SMS alerts
- `exit_intent` - Contact from exit intent popup
- `direct_call` - Contact called directly from website

### Device & Platform Tags
- `mobile_user` - Accessed from mobile device
- `desktop_user` - Accessed from desktop
- `ios_user` - iPhone/iPad user
- `android_user` - Android device user

### Checklist Type Tags
- `checklist_fire_damage` - Fire damage checklist
- `checklist_water_damage` - Water damage checklist
- `checklist_document_recovery` - Document recovery checklist
- `checklist_lightning_strike` - Lightning strike checklist
- `checklist_general` - General emergency checklist

### Engagement Level Tags
- `instant_access` - Immediately accessed PDF
- `pdf_viewed` - Successfully viewed PDF content
- `pdf_downloaded` - Downloaded PDF file
- `time_30_seconds` - Spent 30+ seconds on page
- `time_1_minute` - Spent 1+ minute on page
- `time_3_minutes` - Spent 3+ minutes on page
- `scrolled` - Scrolled through content
- `share_attempted` - Attempted to share content

### Connection & Technical Tags
- `fast_connection` - High-speed internet user
- `slow_connection` - Low-speed internet user
- `offline_capable` - Has offline content cached
- `background_download` - PDF downloaded in background

### Geographic Tags
- `dmv_region` - Washington DC/Maryland/Virginia area
- `zip_[code]` - Specific zip code (e.g., zip_20852)
- `maryland_resident` - Maryland zip codes
- `virginia_resident` - Virginia zip codes
- `dc_resident` - Washington DC zip codes

### Lead Qualification Tags
- `hot_lead` - Multiple engagements, long time on site
- `warm_lead` - PDF downloaded, some engagement
- `cold_lead` - Minimal engagement
- `emergency_active` - Recent emergency situation
- `research_phase` - Information gathering mode

## 🎯 Automatic Tagging Rules

### High-Value Lead Indicators
```javascript
// Hot Lead Qualification
if (timeOnPage >= 180 && pdfDownloaded && (shareAttempted || smsOptIn)) {
    tags.push('hot_lead', 'emergency_active');
}

// Warm Lead Qualification
if (timeOnPage >= 60 && pdfViewed) {
    tags.push('warm_lead');
}

// Mobile Emergency User
if (mobileUser && fastAccess && checklistType === 'fire_damage') {
    tags.push('mobile_emergency', 'urgent_need');
}
```

### Nurture Sequence Triggers
- `hot_lead` → **Immediate Call Schedule** (within 1 hour)
- `warm_lead` → **Follow-up Email Series** (4 emails over 7 days)
- `cold_lead` → **Educational Newsletter** (weekly tips)
- `sms_opted_in` → **Emergency Alert System** (weather/seasonal)

## 📱 SMS Opt-in Tags
- `sms_opted_in` - Consented to SMS alerts
- `emergency_alerts` - Wants severe weather alerts
- `seasonal_tips` - Wants preventive maintenance tips
- `sms_engaged` - Responded to SMS messages
- `sms_unsubscribed` - Opted out of SMS

## 🔄 Workflow Assignment

### Fire Damage Workflow
**Triggers**: `checklist_fire_damage` + `pdf_viewed`
**Tags Added**: `fire_damage_prospect`, `urgent_restoration`
**Actions**:
1. Immediate email with fire recovery PDF
2. Schedule call within 2 hours if `hot_lead`
3. Send insurance claim tips after 24 hours

### Water Damage Workflow
**Triggers**: `checklist_water_damage` + `instant_access`
**Tags Added**: `water_damage_prospect`, `time_sensitive`
**Actions**:
1. Emergency response email (5 minutes)
2. SMS alert if opted in (immediate)
3. Follow-up with drying timeline checklist

### Document Recovery Workflow
**Triggers**: `checklist_document_recovery`
**Tags Added**: `document_specialist_needed`, `high_value_items`
**Actions**:
1. Specialized document recovery email
2. Case study examples of successful recoveries
3. Insurance documentation guidance

## 📈 Lead Scoring System

### Score Calculation
```javascript
let leadScore = 0;

// Engagement scoring
if (tags.includes('time_3_minutes')) leadScore += 30;
if (tags.includes('pdf_downloaded')) leadScore += 25;
if (tags.includes('sms_opted_in')) leadScore += 20;
if (tags.includes('share_attempted')) leadScore += 15;
if (tags.includes('scrolled')) leadScore += 10;

// Urgency scoring
if (tags.includes('mobile_user')) leadScore += 15;
if (tags.includes('fast_connection')) leadScore += 10;
if (tags.includes('instant_access')) leadScore += 20;

// Device/Platform scoring
if (tags.includes('ios_user')) leadScore += 5; // Higher income demographic
if (tags.includes('dmv_region')) leadScore += 10; // Service area

// Final qualification
if (leadScore >= 70) tags.push('hot_lead');
else if (leadScore >= 40) tags.push('warm_lead');
else tags.push('cold_lead');
```

## 🎨 Visual Tag Organization in GHL

### Color Coding
- 🔴 **Red**: Emergency/Urgent (`hot_lead`, `emergency_active`)
- 🟠 **Orange**: Time-Sensitive (`warm_lead`, `water_damage`)
- 🟡 **Yellow**: Follow-up Needed (`cold_lead`, `pdf_viewed`)
- 🟢 **Green**: Engaged (`sms_opted_in`, `pdf_downloaded`)
- 🔵 **Blue**: Technical (`mobile_user`, `fast_connection`)
- 🟣 **Purple**: Geographic (`dmv_region`, `maryland_resident`)

### Tag Groups
1. **Lead Quality**: `hot_lead`, `warm_lead`, `cold_lead`
2. **Emergency Type**: `fire_damage`, `water_damage`, `document_recovery`
3. **Engagement**: `pdf_viewed`, `time_3_minutes`, `share_attempted`
4. **Technical**: `mobile_user`, `fast_connection`, `sms_opted_in`
5. **Geographic**: `dmv_region`, `zip_codes`, `state_residents`

## 🚀 Implementation Checklist

### GHL Setup
- [ ] Create custom fields for lead scoring
- [ ] Set up tag-based workflows for each emergency type
- [ ] Configure SMS opt-in automation
- [ ] Create lead scoring automation
- [ ] Set up geographic tagging rules

### Webhook Integration
- [ ] Configure tag assignment in webhook handler
- [ ] Test tag application on form submission
- [ ] Verify workflow triggers from tags
- [ ] Test SMS opt-in tag assignment
- [ ] Validate engagement tracking tags

### Monitoring & Optimization
- [ ] Track tag effectiveness in lead conversion
- [ ] Monitor workflow performance by tag combination
- [ ] A/B test tag-based nurture sequences
- [ ] Analyze geographic tag patterns
- [ ] Optimize lead scoring algorithm

## 📊 Reporting Tags

### Conversion Tracking
- `converted_to_customer` - Closed sale
- `scheduled_estimate` - Booked service call
- `phone_consultation` - Had phone conversation
- `email_responded` - Replied to follow-up emails

### Campaign Performance
- `q1_campaign` - First quarter lead
- `storm_season` - Hurricane/storm season lead
- `winter_prep` - Winter preparation campaign
- `insurance_claim` - Insurance-related inquiry

This comprehensive tagging system enables precise lead qualification, targeted nurture sequences, and detailed performance analytics for the Prism Specialties DMV lead generation system.