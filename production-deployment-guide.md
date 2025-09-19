# 🚀 Production Deployment Guide - Prism Specialties DMV

## 📋 Pre-Deployment Checklist

### ✅ Domain & SSL Configuration
- **Domain**: prismspecialtiesdmv.com
- **SSL Certificate**: Required for HTTPS
- **CORS Configuration**: Update for production domain

### ✅ Phone Numbers Configured
- **Washington DC**: 202-335-4240 (Sarah Johnson - Wedding Dress Specialist)
- **Northern Virginia**: 703-229-1321 (Michael Chen - Bridal Restoration Expert)
- **Maryland**: 301-215-3191 (Emily Rodriguez - Textile Conservator)

## 🔧 GHL Integration Setup

### Step 1: GHL Location Configuration
Replace placeholder values in `integrations/ghl/config/ghl-config.js`:

```javascript
locationId: 'YOUR_GHL_LOCATION_ID', // Replace with actual Location ID
apiKey: 'YOUR_GHL_API_KEY',        // Replace with actual API key
```

### Step 2: Automation Sequence IDs
Configure these 10 automation sequences in GHL and update IDs:

1. **EMERGENCY_RESTORATION_RESPONSE** - 15-minute SLA emergency response
2. **HOT_RESTORATION_LEAD** - 4-hour priority follow-up
3. **WARM_RESTORATION_NURTURE** - 24-hour educational sequence
4. **COLD_RESTORATION_NURTURE** - 48-hour nurture campaign
5. **WEDDING_DRESS_RESTORATION_SPECIALIST** - Bridal specialist routing
6. **MILITARY_UNIFORM_RESTORATION_SPECIALIST** - Military expert routing
7. **INSTITUTIONAL_RESTORATION_SPECIALIST** - Museum quality routing
8. **EXPERT_CONSULTATION_INVITATION** - 15+ minute engagement reward
9. **RETURN_VISITOR_CONVERSION** - Multi-visit optimization
10. **DEEP_ENGAGEMENT_CONVERSION** - 90%+ scroll engagement

### Step 3: Webhook Endpoints
Configure these webhook endpoints in GHL:

- `/webhook/automation-trigger` - Main automation endpoint
- `/webhook/emergency-response` - Emergency alerts
- `/webhook/hot-lead` - Priority leads
- `/webhook/lead-scoring` - Score updates

## 🌐 Server Configuration

### Production Environment Variables
```bash
# Domain Configuration
DOMAIN=prismspecialtiesdmv.com
SSL_CERT_PATH=/path/to/ssl/cert
SSL_KEY_PATH=/path/to/ssl/key

# GHL Configuration
GHL_LOCATION_ID=your_actual_location_id
GHL_API_KEY=your_actual_api_key

# Phone Numbers (already configured)
DC_PHONE=202-335-4240
VA_PHONE=703-229-1321
MD_PHONE=301-215-3191
```

### CORS Settings
Update for production domain in `production-config.js`:
```javascript
corsSettings: {
    allowedOrigins: [
        'https://prismspecialtiesdmv.com',
        'https://www.prismspecialtiesdmv.com'
    ]
}
```

## 📊 Monitoring & Analytics

### Dashboard Access
- **Lead Monitoring**: `/dashboard/lead-monitoring.html`
- **Automation Analytics**: Real-time trigger monitoring
- **Regional Performance**: DC vs VA vs MD effectiveness

### Key Metrics to Track
- **Emergency Response SLA**: 15-minute compliance rate
- **Hot Lead Response**: 4-hour SLA compliance
- **Automation Success Rate**: GHL API integration success
- **Regional Conversion**: Specialist assignment effectiveness
- **Content Performance**: Wedding vs Military vs Authority triggers

## 🚨 Emergency Response Protocol

### 15-Minute SLA Triggers
- **Immediate SMS Alert** to regional specialist
- **Priority Call Task** creation in GHL
- **Emergency Email Notification** to management
- **Specialist Assignment** based on location/service type

### Hot Lead Protocol (4-Hour SLA)
- **Custom Quote Email** with service details
- **Case Study Attachment** relevant to service type
- **Consultation Booking Link** for priority scheduling
- **Retargeting Pixel** activation for follow-up

## 🧪 Testing Protocol

### Pre-Production Testing
1. **Test Dashboard**: Visit `/test-ghl-integration.html`
2. **Session Tracking**: Verify sessionStorage updates
3. **Phone Tracking**: Test click-to-call functionality
4. **Form Submission**: Validate automation triggers
5. **Regional Routing**: Confirm specialist assignment

### Production Validation
1. **SSL Certificate**: Ensure HTTPS working
2. **GHL Webhooks**: Verify automation triggers firing
3. **Phone Numbers**: Test call routing to specialists
4. **Response Times**: Monitor SLA compliance
5. **Lead Quality**: Validate scoring accuracy

## 🎯 Success Metrics

### Week 1 Targets
- **Emergency Response**: 90%+ 15-minute SLA compliance
- **Hot Lead Response**: 95%+ 4-hour SLA compliance
- **Automation Success**: 98%+ webhook delivery rate
- **Form Submissions**: 25%+ increase vs previous system

### Month 1 Targets
- **Lead Quality**: 15%+ improvement in qualified leads
- **Conversion Rate**: 20%+ improvement vs previous system
- **Regional Performance**: Balanced lead distribution across DC/VA/MD
- **Customer Satisfaction**: 95%+ satisfaction with response times

## 📞 Support Contacts

### Technical Support
- **GHL Integration**: Check automation sequence status
- **Server Issues**: Monitor webhook endpoint health
- **Phone Routing**: Verify regional specialist availability

### Business Operations
- **Emergency Escalation**: 15-minute SLA missed
- **Lead Quality Issues**: Scoring algorithm adjustments
- **Regional Balancing**: Specialist workload optimization

---

## 🎉 Deployment Commands

```bash
# 1. Update production configuration
cp integrations/ghl/config/production-config.js integrations/ghl/config/ghl-config.js

# 2. Update GHL credentials (manual step)
# Edit ghl-config.js with actual Location ID and API key

# 3. Test all integrations
node test-automation-system.js

# 4. Start production server with SSL
# Configure your production server (nginx, Apache, etc.)

# 5. Verify all endpoints
curl https://prismspecialtiesdmv.com/webhook/automation-trigger
curl https://prismspecialtiesdmv.com/dashboard/lead-monitoring.html
```

**🚀 System Ready for Production Deployment!**