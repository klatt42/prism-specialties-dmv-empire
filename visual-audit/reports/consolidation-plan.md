# SITE CONSOLIDATION PLAN
## Systematic Fix for 5 Navigation Patterns + Critical Issues

### CRITICAL FINDINGS FROM PLAYWRIGHT AUDIT
- **5 different navigation patterns** across 8 pages
- **1 broken page** (washington-dc.html) with no logo or phone
- **Wrong phone numbers** on DC page (202-215-3191 vs correct 202-335-4240)
- **Inconsistent link patterns** - some have Blog, some don't, some have Checklists

### PHASE 1: Navigation Standardization (CRITICAL)
**Target Pattern**: Homepage pattern with Checklists integration
- **Standard Links**: Home, Services (dropdown), About Us, Blog, Checklists, Contact
- **Phone Integration**: Regional phone numbers in header
- **Logo Placement**: Consistent Prism Specialties logo top-left

**Implementation**:
1. Create master navigation template
2. Apply to ALL pages systematically
3. Test navigation on every single page
4. Verify logo placement and phone numbers

### PHASE 2: Remove Broken/Duplicate Content
**Immediate Deletions**:
- `/public/washington-dc.html` (broken duplicate)
- Any other duplicate regional `.html` files

**URL Redirects**:
- Redirect old URLs to directory structure
- Update all internal links to use `/region-name/` pattern

### PHASE 3: Phone Number Correction
**Regional Phone Number Standards**:
- DC: 202-335-4240 (NOT 202-215-3191)
- VA: 703-229-1321
- MD: 301-215-3191

**Fix Required**:
- DC page currently shows wrong number
- Standardize regional phone display logic

### PHASE 4: Navigation Template Implementation
**Master Template Navigation**:
```html
<nav class="main-nav">
    <a href="[relative-path]/index.html">Home</a>
    <a href="[relative-path]/services.html" class="services-dropdown">Services</a>
    <a href="[relative-path]/about-us.html">About Us</a>
    <a href="[relative-path]/blog/">Blog</a>
    <a href="[relative-path]/checklists/">Checklists</a>
    <a href="[relative-path]/contact.html">Contact</a>
    <a href="tel:[REGIONAL_PHONE]" class="phone-cta">[REGIONAL_PHONE]</a>
</nav>
```

### PHASE 5: Visual Verification Protocol
**Playwright Re-Test After Each Fix**:
1. Take new screenshots
2. Verify navigation consistency
3. Check logo placement
4. Validate phone numbers
5. Test all links work

## IMPLEMENTATION PRIORITY

### 🔥 IMMEDIATE (This Session):
1. **Delete broken washington-dc.html**
2. **Fix DC phone number error**
3. **Standardize navigation on regional pages**

### 🚀 HIGH PRIORITY (Next):
1. **Create universal navigation template**
2. **Apply template to all 8 audited pages**
3. **Re-run Playwright audit for verification**

### 📊 SUCCESS METRICS:
- **1 navigation pattern** (down from 5)
- **0 broken pages** (down from 1)
- **Correct regional phone numbers** on all pages
- **100% logo coverage** across all pages

## TECHNICAL APPROACH
1. **Use Playwright screenshots** to verify each fix visually
2. **Test locally** before each commit to GitHub
3. **Commit incrementally** with screenshot verification
4. **Deploy only after** complete visual audit passes