# 📧 GoHighLevel Email Templates with PDF Attachments

## Overview
Professional follow-up email templates for immediate delivery after PDF access, with checklist-specific content and PDF attachments.

## 🔥 Fire Damage Email Template

### Subject Line Options
- "🔥 Your Fire Recovery Checklist + 24/7 Emergency Support"
- "Complete Fire Damage Recovery Guide - Professional 20-Step Protocol"
- "Your Fire Recovery Checklist is Ready + Insurance Claim Tips"

### Template HTML
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f9fa;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%); padding: 30px 20px; text-align: center;">
        <img src="{{company.logo_url}}" alt="Prism Specialties DMV" style="height: 60px; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🔥 Your Fire Recovery Checklist</h1>
        <p style="color: #ffcdd2; margin: 10px 0 0; font-size: 16px;">Professional 20-step protocol for fire damage recovery</p>
    </div>

    <!-- Main Content -->
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

        <!-- Personal Greeting -->
        <div style="padding: 30px;">
            <h2 style="color: #2c3e50; margin-bottom: 20px;">Hi {{contact.first_name}},</h2>

            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Thank you for accessing our professional fire damage recovery checklist. I wanted to make sure you have everything you need during this challenging time.
            </p>

            <!-- Emergency Notice -->
            <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #e65100; margin: 0 0 10px; font-size: 18px;">⚠️ Time-Critical Actions</h3>
                <ul style="color: #bf360c; margin: 0; padding-left: 20px;">
                    <li>Contact your insurance company immediately if you haven't already</li>
                    <li>Document ALL damage with photos before moving anything</li>
                    <li>Do not enter the property until cleared by fire officials</li>
                    <li>Address water damage from firefighting efforts within 24-48 hours</li>
                </ul>
            </div>

            <h3 style="color: #d32f2f; margin: 30px 0 15px;">📋 Your Complete Fire Recovery Package</h3>

            <!-- Attached PDF Description -->
            <div style="background: #f8f9fa; border: 2px solid #e3f2fd; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #1976d2; margin: 0 0 10px; display: flex; align-items: center;">
                    <span style="background: #e3f2fd; padding: 5px 10px; border-radius: 20px; margin-right: 10px;">📄</span>
                    Attached: Fire_Damage_Recovery_Checklist.pdf
                </h4>
                <p style="color: #666; margin: 0; font-size: 14px;">
                    Complete 20-step professional protocol used by emergency responders and insurance professionals. Includes timeline, priorities, and contact information.
                </p>
            </div>

            <!-- Additional Resources -->
            <h3 style="color: #d32f2f; margin: 30px 0 15px;">🛠️ Professional Support Available</h3>

            <div style="display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0;">
                <div style="flex: 1; min-width: 250px; background: #fff; border: 2px solid #ffcdd2; border-radius: 10px; padding: 15px; text-align: center;">
                    <div style="background: #d32f2f; color: white; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 20px;">🔥</div>
                    <h4 style="color: #d32f2f; margin: 0 0 5px;">Fire Damage Restoration</h4>
                    <p style="color: #666; font-size: 14px; margin: 0;">Smoke removal, structural cleaning, content restoration</p>
                </div>

                <div style="flex: 1; min-width: 250px; background: #fff; border: 2px solid #bbdefb; border-radius: 10px; padding: 15px; text-align: center;">
                    <div style="background: #1976d2; color: white; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 20px;">💧</div>
                    <h4 style="color: #1976d2; margin: 0 0 5px;">Water Damage (from firefighting)</h4>
                    <p style="color: #666; font-size: 14px; margin: 0;">Extraction, drying, mold prevention</p>
                </div>
            </div>

            <!-- Document Recovery Upsell -->
            <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #7b1fa2; margin: 0 0 10px; display: flex; align-items: center;">
                    <span style="margin-right: 10px;">📄</span>
                    Important Documents Damaged?
                </h4>
                <p style="color: #4a148c; margin: 0 0 15px; font-size: 14px;">
                    We specialize in recovering fire-damaged documents, photos, and records. Professional restoration can save irreplaceable items.
                </p>
                <a href="{{website_url}}/checklists/document-recovery-checklist.html?email={{contact.email}}&source=fire_damage_email"
                   style="background: #7b1fa2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 20px; font-weight: 500; display: inline-block;">
                    Get Document Recovery Guide
                </a>
            </div>

            <!-- Emergency Contact -->
            <div style="background: #e8f5e8; border-radius: 10px; padding: 20px; margin: 30px 0; text-align: center;">
                <h3 style="color: #2e7d32; margin: 0 0 15px;">🚨 24/7 Emergency Response</h3>
                <p style="color: #1b5e20; margin: 0 0 15px;">
                    Fire damage restoration is time-critical. Every hour counts for preventing permanent damage.
                </p>
                <a href="tel:301-215-3191"
                   style="background: #2e7d32; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; display: inline-block;">
                    📞 Call 301-215-3191 Now
                </a>
                <p style="color: #4caf50; margin: 15px 0 0; font-size: 14px;">
                    Available 24/7 for emergency response throughout DMV region
                </p>
            </div>

            <!-- Next Steps -->
            <h3 style="color: #d32f2f; margin: 30px 0 15px;">📋 Your Next Steps</h3>
            <ol style="color: #555; line-height: 1.8; padding-left: 20px;">
                <li><strong>Download and print</strong> the attached checklist for offline reference</li>
                <li><strong>Contact your insurance</strong> company if you haven't already done so</li>
                <li><strong>Document everything</strong> with photos before cleanup begins</li>
                <li><strong>Call us for professional assessment</strong> - insurance often covers restoration costs</li>
            </ol>

            <p style="color: #555; line-height: 1.6; margin: 30px 0 20px;">
                I'm here to help you through this difficult time. Please don't hesitate to reach out with any questions about fire damage restoration or the recovery process.
            </p>

            <p style="color: #555; margin: 0;">
                Best regards,<br>
                <strong>Mike Klatt</strong><br>
                Prism Specialties DMV<br>
                <a href="tel:301-215-3191" style="color: #d32f2f;">301-215-3191</a> |
                <a href="mailto:mike@prismspecialtiesdmv.com" style="color: #d32f2f;">mike@prismspecialtiesdmv.com</a>
            </p>
        </div>
    </div>

    <!-- Footer -->
    <div style="max-width: 600px; margin: 20px auto 0; padding: 20px; text-align: center; color: #999; font-size: 12px;">
        <p>Prism Specialties DMV | Professional Restoration Services</p>
        <p>Serving Washington DC, Maryland & Northern Virginia</p>
        <p>
            <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a> |
            <a href="{{website_url}}" style="color: #999;">Website</a>
        </p>
    </div>
</body>
</html>
```

## 💧 Water Damage Email Template

### Subject Line Options
- "💧 Your Water Emergency Checklist + Immediate Action Steps"
- "Time-Critical: Water Damage Recovery Guide Inside"
- "Your Water Emergency Guide - Act Fast to Prevent Mold"

### Template HTML
```html
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f9fa;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); padding: 30px 20px; text-align: center;">
        <img src="{{company.logo_url}}" alt="Prism Specialties DMV" style="height: 60px; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">💧 Water Emergency Action Guide</h1>
        <p style="color: #bbdefb; margin: 10px 0 0; font-size: 16px;">Time-critical steps to save what matters most</p>
    </div>

    <!-- Urgent Alert -->
    <div style="max-width: 600px; margin: 0 auto; background: #fff3e0; border-left: 5px solid #ff9800; padding: 20px;">
        <h2 style="color: #e65100; margin: 0 0 10px; font-size: 20px;">⏰ URGENT: 24-48 Hour Window</h2>
        <p style="color: #bf360c; margin: 0; font-weight: 500;">
            Water damage spreads rapidly. Mold can begin growing within 24-48 hours. Every minute counts.
        </p>
    </div>

    <!-- Main Content -->
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px;">
        <h2 style="color: #2c3e50; margin-bottom: 20px;">Hi {{contact.first_name}},</h2>

        <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            I received your request for our water emergency checklist. Given the time-sensitive nature of water damage, I wanted to get this critical information to you immediately.
        </p>

        <!-- Immediate Actions -->
        <div style="background: #e3f2fd; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin: 0 0 15px;">🚨 Take These Actions RIGHT NOW</h3>
            <ol style="color: #0d47a1; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li><strong>Stop the water source</strong> if possible and safe to do so</li>
                <li><strong>Turn off electricity</strong> in affected areas</li>
                <li><strong>Remove standing water</strong> with pumps, wet vacuums, or buckets</li>
                <li><strong>Move furniture and belongings</strong> to dry areas</li>
                <li><strong>Start air circulation</strong> with fans and dehumidifiers</li>
            </ol>
        </div>

        <!-- PDF Attachment Info -->
        <div style="background: #f8f9fa; border: 2px solid #e3f2fd; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <h4 style="color: #1976d2; margin: 0 0 10px; display: flex; align-items: center;">
                <span style="background: #e3f2fd; padding: 5px 10px; border-radius: 20px; margin-right: 10px;">📄</span>
                Attached: Water_Emergency_Checklist.pdf
            </h4>
            <p style="color: #666; margin: 0; font-size: 14px;">
                Complete emergency protocol with hour-by-hour timeline. Print this for offline reference during the emergency.
            </p>
        </div>

        <!-- Emergency Contact CTA -->
        <div style="background: #c8e6c9; border-radius: 10px; padding: 20px; margin: 30px 0; text-align: center;">
            <h3 style="color: #2e7d32; margin: 0 0 15px;">💧 Professional Water Extraction Available Now</h3>
            <p style="color: #1b5e20; margin: 0 0 15px;">
                We have emergency water extraction equipment ready 24/7. Most insurance covers emergency services.
            </p>
            <a href="tel:301-215-3191"
               style="background: #2e7d32; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; display: inline-block;">
                📞 Emergency Response: 301-215-3191
            </a>
        </div>
    </div>
</body>
</html>
```

## 📄 Document Recovery Email Template

### Subject Line Options
- "📄 Your Document Recovery Guide + Professional Restoration Options"
- "Save Your Important Papers: Document Recovery Checklist Inside"
- "Professional Document Restoration - Photos, Papers & Records"

### Template HTML (Abbreviated)
```html
<!-- Focus on gentle, professional tone for valuable/sentimental items -->
<div style="background: linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%); padding: 30px 20px; text-align: center;">
    <h1 style="color: white;">📄 Document Recovery Guide</h1>
    <p style="color: #e1bee7;">Professional restoration for photos, papers & precious records</p>
</div>

<!-- Emphasize sentimental value and specialized techniques -->
<div style="padding: 30px;">
    <h2>Hi {{contact.first_name}},</h2>

    <p>Important documents, family photos, and personal records often hold irreplaceable value beyond their physical worth. I understand how devastating it can be when these items are damaged.</p>

    <!-- Specialized Services -->
    <div style="background: #f3e5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #7b1fa2;">🔬 Specialized Document Recovery Services</h3>
        <ul style="color: #4a148c;">
            <li><strong>Freeze-Drying</strong> for water-damaged papers</li>
            <li><strong>Digital Scanning</strong> to preserve content permanently</li>
            <li><strong>Photo Restoration</strong> for family memories</li>
            <li><strong>Historical Documents</strong> with archival techniques</li>
        </ul>
    </div>
</div>
```

## ⚡ Lightning Strike Email Template

### Subject Line Options
- "⚡ Your Lightning Strike Recovery Guide + Electronics Assessment"
- "Power Surge Damage: Professional Electronics Restoration"
- "Lightning Strike Recovery - Protect Your Electronics & Systems"

## 🎯 Email Automation Workflow

### Timing Schedule
1. **Immediate** (5 minutes): Welcome email with PDF attachment
2. **Day 1**: Follow-up with additional resources specific to damage type
3. **Day 3**: Check-in email with professional services offer
4. **Day 7**: Educational content (prevention/insurance tips)
5. **Day 14**: Final follow-up with case studies/testimonials

### Personalization Variables
- `{{contact.first_name}}` - Personal greeting
- `{{contact.email}}` - Email address for links
- `{{checklist_type}}` - Specific emergency type
- `{{zip_code}}` - Geographic targeting
- `{{company.logo_url}}` - Branded header
- `{{website_url}}` - Base website URL
- `{{unsubscribe_url}}` - Compliance link

### A/B Testing Elements
- Subject line urgency vs. helpful tone
- PDF attachment mention in subject vs. body
- Emergency CTA placement (top vs. bottom)
- Professional vs. personal sender name
- Length (concise vs. detailed)

## 📊 Tracking & Analytics

### Email Engagement Metrics
- Open rates by emergency type
- Click-through rates to emergency phone number
- PDF download completion rates
- Follow-up email engagement
- Conversion to phone calls/service requests

### GHL Integration
- Track email opens → add `email_opened` tag
- Track link clicks → add `link_clicked` tag
- Track phone number clicks → add `called_emergency` tag
- Track PDF downloads → add `pdf_downloaded_email` tag

This comprehensive email template system ensures immediate, valuable follow-up that builds trust and positions Prism Specialties as the professional emergency restoration partner.