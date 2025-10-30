# Prism Specialties DMV Empire - Phase 2 Roadmap

**Date:** 2025-10-30
**Current Status:** Phase 1 Complete, Site Live on Netlify
**Site URL:** https://prismspecialtiesdmv.com
**Last Updated:** 31 days stagnant (last commit Sep 29)

---

## ✅ Current Status Summary

### Deployment ✅
- **Live:** https://prismspecialtiesdmv.com (HTTP/2 200 OK)
- **Hosting:** Netlify Edge
- **Performance:** Site responsive, proper headers configured
- **Security:** X-Frame-Options, X-XSS-Protection active

### Content Inventory
- **Total Pages:** 105 HTML pages
- **Blog/Landing Pages:** 25 specialty pages
  - Art Restoration (directory)
  - Document Restoration (directory)
  - Electronics Restoration (directory)
  - Emergency Restoration (directory)
  - Textile Restoration (directory)
- **Main Pages:** Homepage, About, Contact, Services, FAQ, Emergency
- **Regional Pages:** Fairfax County, plus others
- **PDF Checklists:** 17 professional guides

### GoHighLevel Integration ✅
- Claim submission form (iframe embedded)
- GHL Conversation AI widget loaded
- Regional phone numbers configured:
  - Maryland: 301-215-3191
  - Virginia: 703-229-1321
  - Washington DC: 202-335-4240
- Email: claims.dcandmdmetro@prismspecialties.com

---

## 🔍 Issues Identified

### HIGH PRIORITY

#### 1. Footer Logo Path Issue
**Problem:** `/home/klatt42/prism-specialties-dmv-empire/public/index.html:1413`
```html
<img src="/public/images/prism-logo-white.png.webp"
```
**Issue:** Path starts with `/public/` which won't work on Netlify
**Fix:** Change to `/images/prism-logo-white.png.webp`
**Impact:** Footer logo not displaying on live site

#### 2. Page Count Discrepancy
**Documentation:** Claims 195+ pages
**Actual:** ~105 HTML pages
**Gap:** ~90 pages missing or not yet built
**Action:** Either build missing pages OR update documentation to reflect actual count

#### 3. Excessive Backup Files
**Location:** `public/` directory
**Issue:** Multiple `.backup`, `.old`, `.test`, `.modern-backup` files
**Examples:**
- `about-us.html` has 8 backup variations
- Blog posts have `.backup` and `.modern-backup` files
- Navigation backups scattered throughout

**Impact:**
- Clutters repository
- Increases build size
- Confuses development
- Risk of accidentally editing wrong file

### MEDIUM PRIORITY

#### 4. Performance Audit Needed
**Target:** Funeral Director Standard (<542ms load time)
**Status:** Unknown - needs verification
**Action:** Run Lighthouse audit, measure actual load times

#### 5. GHL Webhook Testing
**Status:** Forms embedded but webhooks not verified
**Action:** Test form submissions, verify leads appear in GHL

#### 6. Schema Markup Completion
**Current:** Basic schema on homepage and contact
**Missing:** Schema for blog posts, service pages, regional pages
**Impact:** SEO opportunity loss

### LOW PRIORITY

#### 7. Code Cleanup
- Test files in blog directory
- Empty or minimal content pages
- Unused CSS/JS files

---

## 🚀 Phase 2 Priorities

### IMMEDIATE FIXES (This Session - 30 minutes)

#### Fix 1: Footer Logo Path
```bash
# Fix footer logo reference in index.html
sed -i 's|/public/images/prism-logo-white.png.webp|/images/prism-logo-white.png.webp|g' public/index.html

# Check for other instances
grep -r "/public/images" public/*.html
```

#### Fix 2: Backup File Cleanup
```bash
# Create backup archive directory
mkdir -p archive/backups/2025-09

# Move all backup files to archive
find public -name "*.backup*" -type f -exec mv {} archive/backups/2025-09/ \;
find public -name "*.old" -type f -exec mv {} archive/backups/2025-09/ \;
find public -name "*.test*" -type f -exec mv {} archive/backups/2025-09/ \;

# Update .gitignore
echo "*.backup*" >> .gitignore
echo "*.old" >> .gitignore
echo "*.test*" >> .gitignore
echo "archive/" >> .gitignore
```

#### Fix 3: Update Documentation
Update `README.md` and analysis docs to reflect:
- Actual page count: 105 pages (not 195+)
- Live site URL
- Current deployment status

---

### SHORT-TERM ENHANCEMENTS (Next 3-5 Days)

#### Enhancement 1: Performance Optimization
**Goal:** Achieve <542ms Funeral Director Standard

**Actions:**
1. Run Lighthouse audit on all major pages
2. Optimize images (convert to WebP, compress)
3. Minify CSS/JS
4. Implement lazy loading for images
5. Add critical CSS inline
6. Defer non-critical scripts

**Tools:**
```bash
# Install optimization tools
npm install --save-dev imagemin imagemin-webp terser cssnano

# Run image optimization
node scripts/optimize-images.js

# Minify CSS
npx cssnano public/assets/css/*.css

# Minify JS
npx terser public/assets/js/*.js -o public/assets/js/bundle.min.js
```

#### Enhancement 2: GHL Integration Testing
**Goal:** Verify all lead capture working correctly

**Test Checklist:**
- [ ] Contact form submission → appears in GHL
- [ ] Claim form submission → appears in GHL
- [ ] Tags applied correctly (Art, Electronics, Textile, Document, Emergency)
- [ ] Email sequences trigger
- [ ] SMS sequences trigger (if configured)
- [ ] PDF delivery working
- [ ] Conversation AI widget responding

**Testing Process:**
1. Submit test form with unique identifier
2. Check GHL dashboard for lead
3. Verify tags applied
4. Check email inbox for welcome email
5. Check SMS for confirmation (if applicable)
6. Document any issues

#### Enhancement 3: Schema Markup Expansion
**Goal:** 100% schema coverage across all pages

**Pages Needing Schema:**
- Blog posts (Article schema)
- Service pages (Service schema)
- Regional pages (LocalBusiness schema with areaServed)
- Checklists (HowTo schema)

**Template:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Blog Title",
  "description": "Blog description",
  "author": {
    "@type": "Organization",
    "name": "Prism Specialties DMV"
  },
  "datePublished": "2025-09-28",
  "dateModified": "2025-09-28"
}
```

---

### MEDIUM-TERM ENHANCEMENTS (Next 1-2 Weeks)

#### Enhancement 4: Complete Landing Page Matrix
**Current:** 105 pages
**Target:** 195+ pages (or adjust expectations)

**Missing Page Categories:**
- Geographic variations (more counties/cities)
- Specialty combinations (Art + Fire Damage, Electronics + Water Damage)
- Damage type specific pages

**Decision Needed:**
- Build remaining 90+ pages? (high effort)
- OR adjust documentation to reflect 105 pages? (low effort)

**Recommendation:** Assess ROI first
- Review analytics: which pages get traffic?
- Focus on high-performing combinations
- Build 10-20 strategic pages rather than 90 generic ones

#### Enhancement 5: Analytics & Conversion Tracking
**Goal:** Measure what's working

**Setup:**
1. Google Analytics 4 (GA4) integration
2. Conversion tracking for:
   - Form submissions
   - Phone clicks
   - Email clicks
   - PDF downloads
   - Emergency banner clicks
3. Heat mapping (Hotjar or Microsoft Clarity)
4. A/B testing framework

**Priority Metrics:**
- Page views by category
- Conversion rate by page type
- Time to form submission
- Bounce rate by traffic source
- Geographic traffic distribution

#### Enhancement 6: Lead Magnet Optimization
**Current:** 17 PDF checklists
**Enhancement:** Make them conversion powerhouses

**Improvements:**
1. Add forms to download (email capture)
2. Create follow-up email sequences per checklist
3. Add QR codes to PDFs (track offline sharing)
4. Create interactive web versions
5. Add video walkthroughs

**Example Flow:**
```
User visits checklist page
  → Enter email to download PDF
  → Instant PDF delivery
  → Welcome email (1 hour later)
  → Educational email #1 (Day 2)
  → Case study email (Day 4)
  → Call-to-action email (Day 7)
```

---

### LONG-TERM ENHANCEMENTS (Next 1-3 Months)

#### Enhancement 7: Advanced GHL Automation
**Current:** Basic form submission
**Target:** Intelligent lead nurturing

**Features:**
1. Lead scoring based on:
   - Damage type (fire = higher urgency)
   - Property type (commercial = higher value)
   - Geographic location
   - Time since incident
2. Automated follow-ups:
   - SMS within 5 minutes
   - Email within 15 minutes
   - Phone call within 2 hours (if no response)
3. Abandoned form recovery
4. Referral program automation
5. Customer satisfaction surveys

#### Enhancement 8: Competitive Differentiation
**Goal:** Stand out in crowded restoration market

**Strategies:**
1. **Before/After Gallery:**
   - Photo restoration examples
   - Art restoration case studies
   - Document recovery success stories
2. **Video Content:**
   - Process explanations
   - Customer testimonials
   - Emergency response footage
3. **Live Chat:**
   - 24/7 availability
   - Instant quotes
   - Photo upload for assessment
4. **Instant Quote Calculator:**
   - Select damage type
   - Select items affected
   - Get estimated timeline & cost range

#### Enhancement 9: SEO & Content Marketing
**Goal:** Dominate local specialty restoration searches

**Content Strategy:**
1. **Ultimate Guides:**
   - "Complete Guide to Art Restoration in Maryland"
   - "Protecting Family Heirlooms from Water Damage"
   - "What Insurance Covers for Specialty Restoration"
2. **Local SEO:**
   - Google Business Profile optimization
   - Local citations (Yelp, Bing Places)
   - County-specific landing pages
3. **Link Building:**
   - Partner with insurance agents
   - Museums & historical societies
   - Contractor networks
4. **Content Calendar:**
   - 2 blog posts/week
   - 1 case study/month
   - 1 video/month

---

## 📊 Success Metrics (Phase 2 Goals)

### Performance
- [ ] Load time <542ms (Funeral Director Standard)
- [ ] 95%+ Lighthouse Performance score
- [ ] 100% mobile responsive
- [ ] 95%+ accessibility score

### Conversion
- [ ] Form submission rate: 3%+ of traffic
- [ ] Phone click rate: 5%+ of traffic
- [ ] Email open rate: 35%+
- [ ] Lead-to-customer: 15%+

### Traffic
- [ ] Organic traffic: +50% (vs baseline)
- [ ] Direct traffic: +30%
- [ ] Social traffic: establish baseline
- [ ] Email traffic: establish baseline

### Business Impact
- [ ] Lead volume: 15x increase (per documentation goal)
- [ ] Conversion rate: 6x improvement
- [ ] Average project value: 4x increase
- [ ] Market share: 60-80% specialty restoration capture

---

## 🛠️ Implementation Priority Matrix

### THIS WEEK (Critical)
1. ✅ Fix footer logo path → 5 minutes
2. ✅ Clean up backup files → 15 minutes
3. ✅ Update documentation → 10 minutes
4. Run performance audit → 30 minutes
5. Test GHL integration → 1 hour
6. Commit & push updates → 5 minutes

**Total Time:** ~2.5 hours

### NEXT WEEK (High Value)
1. Image optimization → 2 hours
2. Schema markup expansion → 3 hours
3. Analytics setup → 2 hours
4. Lead magnet forms → 3 hours

**Total Time:** ~10 hours

### THIS MONTH (Strategic)
1. A/B testing framework → 4 hours
2. Advanced GHL automation → 8 hours
3. Content creation (4 blog posts) → 8 hours
4. Video content production → 12 hours

**Total Time:** ~32 hours

---

## 💡 Quick Wins (Do These First)

### Quick Win #1: Fix Footer Logo (5 min)
```bash
sed -i 's|/public/images/prism-logo-white.png.webp|/images/prism-logo-white.png.webp|g' public/index.html
git add public/index.html
git commit -m "FIX: Footer logo path for Netlify deployment"
git push
```

### Quick Win #2: Add Google Analytics (10 min)
```html
<!-- Add to <head> of all pages -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Quick Win #3: Optimize Emergency Banner (5 min)
Make phone number more prominent:
```html
<div class="emergency-banner">
    🚨 <strong>Emergency?</strong>
    <a href="tel:301-215-3191" style="font-size: 1.2em;">
        CALL NOW: 301-215-3191
    </a>
    - 24/7 Response
</div>
```

### Quick Win #4: Add Click Tracking (15 min)
Track critical interactions:
```javascript
// Track phone clicks
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        gtag('event', 'phone_click', {
            'phone_number': link.href.replace('tel:', ''),
            'page': window.location.pathname
        });
    });
});

// Track form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
        gtag('event', 'form_submit', {
            'form_id': form.id,
            'page': window.location.pathname
        });
    });
});
```

---

## 🎯 Recommended Phase 2 Sequence

### Week 1: Foundation & Fixes
- Fix footer logo
- Clean up backups
- Performance audit
- Test GHL integration
- Setup analytics

### Week 2: Optimization
- Image optimization
- CSS/JS minification
- Schema markup expansion
- Mobile responsiveness audit

### Week 3: Conversion
- Lead magnet forms
- A/B testing setup
- Conversion tracking
- Heat mapping

### Week 4: Content & Growth
- Blog posts (2-3)
- Case study
- Video content
- Email campaigns

---

## 📝 Notes & Considerations

### Technical Debt
- Backup files (being addressed)
- Inconsistent styling in some pages
- Some pages have inline styles vs external CSS
- Mobile nav needs improvement on some pages

### Content Gaps
- Missing case studies
- No customer testimonials (text or video)
- Limited before/after examples
- No FAQ expansions

### Integration Opportunities
- Zapier for advanced automation
- Calendly for appointment booking
- Stripe for payment processing
- ServiceTitan for job management

### Marketing Opportunities
- Google Local Services Ads
- Bing Ads (already have verification tag)
- Facebook/Instagram ads
- LinkedIn for commercial clients
- YouTube for video content

---

## 🚀 Ready to Launch Phase 2?

**Immediate Next Steps:**
1. Run through "Quick Wins" (35 minutes total)
2. Commit and push changes
3. Verify on live site
4. Move to Week 1 tasks

**Questions to Answer:**
1. Do we build remaining 90 pages or adjust documentation?
2. What's the budget for paid advertising?
3. Who creates video content?
4. What's the priority: leads, brand, or both?

---

**Last Updated:** 2025-10-30
**Status:** Ready for Phase 2 kickoff
**Estimated Phase 2 Duration:** 4-6 weeks
**Expected Result:** 15x lead generation, 6x conversion improvement
