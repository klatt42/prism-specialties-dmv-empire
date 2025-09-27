# 📱 Mobile-Focused SMS Nurture Sequences

## Overview
SMS-first nurture campaigns optimized for mobile users who prefer quick, actionable communication with immediate response options.

## 🚨 High Engagement Mobile Sequence

### Immediate Response (0-15 minutes)
```sms
🚨 Hi [Name], thanks for downloading our [Emergency] guide!

Is this an ACTIVE emergency?
Reply:
• Y = Immediate help
• N = Prevention tips

- Prism Specialties DMV
Call 301-215-3191
```

### Follow-up (30 minutes - if no response)
```sms
Hi [Name], we're here 24/7 for emergencies. Quick question about your [Emergency] situation:

Rate urgency 1-10:
1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟

Just reply with number. We'll prioritize accordingly.
```

### High Priority Response (1 hour)
```sms
[Name], spent 5+ min on our guide = you need help!

🔥 PRIORITY SUPPORT:
✅ Free 15-min consultation
✅ 24/7 emergency response
✅ Insurance claim guidance

Tap: bit.ly/prism-priority-call

Or call 301-215-3191 (saves ~$5k avg)
```

### Emergency Hours Follow-up (Evening/Weekend)
```sms
[Name], accessing emergency info at [Time]?

🌙 AFTER-HOURS SUPPORT:
• Emergency line: 301-215-3191
• Text updates: Reply "ALERTS"
• Free assessment: bit.ly/prism-assess

We're awake so you can sleep better.
```

## 🎯 Medium Engagement Mobile Sequence

### Day 0: Welcome + Quick Win
```sms
👋 [Name], got your [Emergency] checklist!

QUICK TIP: Take photos BEFORE any cleanup. Insurance needs before/after proof.

Save our number: 301-215-3191
More tips coming! Reply STOP to opt out.
```

### Day 1: Actionable Tip
```sms
[Name], 48-hour window tip for [Emergency]:

🔥 FIRE: Air out smoke odors but DON'T use fans until structure cleared
💧 WATER: Remove standing water within 24hrs to prevent mold
⚡ LIGHTNING: Have electrical systems inspected before power restoration

Questions? Call 301-215-3191
```

### Day 3: Value + Social Proof
```sms
[Name], quick story:

Customer in [Your Area] saved $12k by calling us within 48hrs of water damage. Early action = better outcomes.

🎯 Free damage assessment: bit.ly/prism-assess

What matters most in your property?
```

### Day 5: Interactive Engagement
```sms
[Name], quick poll:

How prepared do you feel for future emergencies?
A) Very prepared
B) Somewhat ready
C) Need help

Just reply A, B, or C.
Based on your answer, we'll send personalized tips!
```

### Day 7: Consultation Offer
```sms
[Name], week 1 complete! 🎉

Based on your [Emergency] interest, would a free 15-min property assessment help?

✅ Identify weak spots
✅ Prevention strategies
✅ Insurance optimization

Book: bit.ly/prism-consult
Or call: 301-215-3191
```

## 🔄 Low Engagement Reactivation

### Day 2: Check-in
```sms
Hi [Name], did our [Emergency] guide help?

Quick feedback:
👍 = Helpful
👎 = Need more info
❓ = Have questions

Your input helps us help others!
```

### Day 5: Different Angle
```sms
[Name], 90% of people miss this about [Emergency]:

Most damage happens in the 48 HOURS after the event, not during.

Quick examples:
🔥 Acid smoke residue sets in
💧 Mold spores activate
⚡ Delayed electrical failures

More info: bit.ly/prism-hidden-dangers
```

### Day 10: Social Proof
```sms
[Name], real case from your area:

"Wish I'd called Prism sooner. What looked like $5k damage became $50k because I waited a week." - McLean homeowner

Don't wait. Free assessment: 301-215-3191

Even for "small" issues.
```

### Day 15: Last Chance Value
```sms
[Name], final resource for [Emergency] prep:

🎁 FREE EMERGENCY PACKAGE:
• All 4 checklists (Fire/Water/Lightning/Document)
• Prevention calendar
• Insurance checklist
• Emergency contact card

Claim: bit.ly/prism-complete-kit

(No strings attached - we're here when you need us)
```

## 📱 Device-Specific Mobile Optimizations

### iPhone Users (iOS Detection)
```sms
[Name], iPhone user tip!

Add our emergency number to Siri:
"Hey Siri, add Prism Emergency to contacts: 301-215-3191"

During crisis = just say "Call Prism Emergency"

Smart shortcuts save precious time! ⏰
```

### Android Users
```sms
[Name], Android user tip!

Create emergency widget:
1. Long-press home screen
2. Add "Direct Dial" widget
3. Select 301-215-3191
4. Label "Prism Emergency"

One-tap emergency help! 📱
```

### Location-Based Triggers
```sms
[Name] in [City], weather alert!

⛈️ SEVERE STORMS expected [Date]

PREP CHECKLIST:
✅ Clear gutters/drains
✅ Secure outdoor items
✅ Check sump pump
✅ Save our number: 301-215-3191

We monitor storms 24/7 for emergency response.
```

## 🎮 Interactive SMS Features

### Quick Polls for Engagement
```sms
[Name], 30-second poll:

What's your #1 home emergency fear?
A) Fire damage
B) Water damage
C) Storm damage
D) Electrical issues
E) Break-in/security

Reply A-E. We'll send targeted prevention tips!
```

### Seasonal Reminders
```sms
[Name], March maintenance reminder! 🌸

SPRING PREP CHECKLIST:
□ Roof inspection (winter damage?)
□ AC system check
□ Gutter cleaning
□ Smoke detector batteries

Need professional help? 301-215-3191

Check off completed items! ✅
```

### Emergency Simulations
```sms
[Name], 60-second drill! ⏰

SCENARIO: Kitchen fire starts while cooking.

What's your FIRST action?
A) Grab fire extinguisher
B) Call 911
C) Turn off heat source
D) Evacuate immediately

Reply A-D. We'll explain the right sequence!
```

## 📊 Response Tracking & Optimization

### Response Categories
- **Immediate Responders**: Reply within 15 minutes → High priority nurture
- **Quick Responders**: Reply within 24 hours → Standard nurture
- **Delayed Responders**: Reply after 24+ hours → Re-engagement sequence
- **Non-Responders**: No replies → Reduce frequency, try different angles

### A/B Testing Elements
- **Emoji Usage**: Test emoji-heavy vs. text-only messages
- **Length**: Short (under 160 char) vs. longer messages
- **CTA Style**: Direct links vs. "Reply for info"
- **Timing**: Business hours vs. evening/weekend sends
- **Urgency**: High urgency vs. helpful tone

### Response Automation
```javascript
// Auto-responses based on keyword detection
const autoResponses = {
    'Y': 'Connecting you to emergency response team...',
    'YES': 'Emergency team alerted. Calling you in 2 minutes.',
    'HELP': 'Help on the way! Calling 301-215-3191 now or call us.',
    'STOP': 'Unsubscribed. For emergencies, always call 301-215-3191',
    'INFO': 'More info: [relevant link based on their checklist type]'
};
```

## 🔥 Emergency-Specific SMS Content

### Fire Damage Mobile Sequence
```sms
Day 0: "🔥 Fire recovery guide downloaded! CRITICAL: Don't enter until cleared by fire dept. Need immediate help? Call 301-215-3191"

Day 1: "🔥 48-hour update: Smoke damage accelerates after fires. Professional cleaning within 48hrs = salvageable. Later = permanent damage."

Day 3: "🔥 Insurance tip: Document EVERYTHING. Take photos before touching anything. We help with claims daily. Questions? 301-215-3191"
```

### Water Damage Mobile Sequence
```sms
Day 0: "💧 Water emergency guide ready! Remember: Mold starts growing in 24-48 hours. Clock is ticking. Emergency response: 301-215-3191"

Day 1: "💧 Drying update: Fans help but aren't enough. Professional dehumidification prevents hidden moisture damage. Free assessment available."

Day 3: "💧 Prevention tip: Check these monthly - under sinks, around toilets, basement walls. Early detection saves thousands."
```

### Lightning Strike Mobile Sequence
```sms
Day 0: "⚡ Lightning damage info sent! SAFETY: Don't use electrical devices until system inspected. Hidden damage common. Emergency: 301-215-3191"

Day 1: "⚡ Electronics tip: Surge protectors help but whole-house protection is better. Power company may cover inspection costs."

Day 3: "⚡ Insurance note: Lightning claims often denied due to 'lack of evidence.' We help document everything properly."
```

## 📱 Mobile-Specific Features

### Rich Media Messages (MMS)
- Before/after photos of restoration projects
- Video clips showing damage progression
- Infographic-style prevention tips
- QR codes for instant access to resources

### Geolocation Integration
```sms
[Name], severe weather approaching [Your Area]!

Live radar shows arrival in 45 minutes.

PREP NOW:
• Move cars under cover
• Secure outdoor furniture
• Charge devices
• Have our number ready: 301-215-3191

Stay safe! 🌩️
```

### Time-Sensitive Offers
```sms
[Name], flash opportunity!

Next 3 homeowners get FREE emergency preparedness assessment (normally $200).

Perfect for [Season] prep.
Book by Friday: bit.ly/flash-prep

Or call now: 301-215-3191
Spots filling fast! ⏰
```

This mobile SMS strategy ensures immediate, actionable communication that matches how mobile users prefer to consume content - quick, scannable, and immediately actionable.