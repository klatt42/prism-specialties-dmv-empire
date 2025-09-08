/**
 * Blog Navigation System
 * Bidirectional linking between blog posts and service pages
 */

class BlogNavigation {
    constructor() {
        this.servicePages = {
            'art-restoration': {
                title: 'Art & Collectibles Restoration',
                url: '/specialties/art-collectibles-restoration/',
                counties: ['montgomery-county', 'loudoun-county', 'prince-william-county', 'northern-virginia', 'western-maryland'],
                keywords: ['art', 'painting', 'collectible', 'antique', 'sculpture', 'artwork', 'canvas', 'frame']
            },
            'textile-restoration': {
                title: 'Textile & Fabric Restoration',
                url: '/specialties/textile-fabric-restoration/',
                counties: ['montgomery-county', 'loudoun-county', 'prince-william-county', 'northern-virginia', 'western-maryland'],
                keywords: ['textile', 'fabric', 'clothing', 'dress', 'wedding', 'garment', 'upholstery', 'curtain']
            },
            'electronics-restoration': {
                title: 'Electronics & Data Restoration',
                url: '/specialties/electronics-data-restoration/',
                counties: ['montgomery-county', 'loudoun-county', 'prince-william-county', 'northern-virginia', 'western-maryland'],
                keywords: ['electronics', 'computer', 'data', 'phone', 'tablet', 'gaming', 'server', 'digital']
            },
            'document-restoration': {
                title: 'Document & Photo Restoration',
                url: '/specialties/document-photo-restoration/',
                counties: ['montgomery-county', 'loudoun-county', 'prince-william-county', 'northern-virginia', 'western-maryland'],
                keywords: ['document', 'photo', 'paper', 'photograph', 'certificate', 'book', 'manuscript', 'archive']
            }
        };

        this.blogTopics = {
            'water-damage': ['electronics-restoration', 'document-restoration', 'art-restoration', 'textile-restoration'],
            'fire-damage': ['electronics-restoration', 'document-restoration', 'art-restoration', 'textile-restoration'],
            'emergency-response': ['electronics-restoration', 'document-restoration', 'art-restoration', 'textile-restoration'],
            'insurance-claims': ['electronics-restoration', 'document-restoration', 'art-restoration', 'textile-restoration'],
            'data-recovery': ['electronics-restoration'],
            'art-restoration': ['art-restoration'],
            'textile-care': ['textile-restoration'],
            'document-preservation': ['document-restoration'],
            'family-heirlooms': ['art-restoration', 'textile-restoration', 'document-restoration'],
            'business-continuity': ['electronics-restoration', 'document-restoration']
        };

        this.currentLocation = window.location.pathname;
        this.init();
    }

    init() {
        this.addBlogToServiceLinks();
        this.addServiceToBlogLinks();
        this.setupSmoothScroll();
        this.setupAnalyticsTracking();
    }

    // Add Related Services section to blog posts
    addBlogToServiceLinks() {
        if (!this.isBlogPage()) return;

        const blogContent = this.getBlogContent();
        const relatedServices = this.findRelatedServices(blogContent);
        
        if (relatedServices.length > 0) {
            this.renderRelatedServices(relatedServices);
        }
    }

    // Add Learn More blog links to service pages
    addServiceToBlogLinks() {
        if (!this.isServicePage()) return;

        const serviceType = this.getServiceType();
        const relatedBlogPosts = this.findRelatedBlogPosts(serviceType);
        
        if (relatedBlogPosts.length > 0) {
            this.renderRelatedBlogPosts(relatedBlogPosts);
        }
    }

    isBlogPage() {
        return this.currentLocation.includes('/blog/') || 
               this.currentLocation.includes('/resources/') ||
               document.querySelector('article') !== null;
    }

    isServicePage() {
        return this.currentLocation.includes('/specialties/') ||
               this.currentLocation.includes('restoration') ||
               document.querySelector('.service-card') !== null;
    }

    getBlogContent() {
        const article = document.querySelector('article') || document.querySelector('main') || document.body;
        return article.textContent.toLowerCase();
    }

    getServiceType() {
        const path = this.currentLocation;
        
        if (path.includes('art') || path.includes('collectible')) return 'art-restoration';
        if (path.includes('textile') || path.includes('fabric')) return 'textile-restoration';
        if (path.includes('electronics') || path.includes('data')) return 'electronics-restoration';
        if (path.includes('document') || path.includes('photo')) return 'document-restoration';
        
        return 'general';
    }

    findRelatedServices(content) {
        const related = [];
        
        Object.keys(this.servicePages).forEach(serviceKey => {
            const service = this.servicePages[serviceKey];
            const hasKeywords = service.keywords.some(keyword => 
                content.includes(keyword) || content.includes(keyword + 's')
            );
            
            if (hasKeywords) {
                related.push({
                    key: serviceKey,
                    ...service
                });
            }
        });

        return related.slice(0, 4); // Limit to 4 services
    }

    findRelatedBlogPosts(serviceType) {
        // This would typically fetch from a blog API or static list
        // For now, return curated blog posts based on service type
        const blogPosts = {
            'art-restoration': [
                { title: 'Saving Family Art After Fire Damage', url: '/blog/saving-family-art-fire-damage/', category: 'Art Restoration' },
                { title: 'Insurance Claims for Damaged Collectibles', url: '/blog/insurance-claims-damaged-collectibles/', category: 'Insurance' },
                { title: 'Emergency Response for Art Collections', url: '/blog/emergency-response-art-collections/', category: 'Emergency' }
            ],
            'textile-restoration': [
                { title: 'Wedding Dress Water Damage Recovery', url: '/blog/wedding-dress-water-damage-recovery/', category: 'Textile Care' },
                { title: 'Preserving Family Clothing Heirlooms', url: '/blog/preserving-family-clothing-heirlooms/', category: 'Family Heirlooms' },
                { title: 'Emergency Textile Restoration Process', url: '/blog/emergency-textile-restoration-process/', category: 'Emergency' }
            ],
            'electronics-restoration': [
                { title: 'Data Recovery After Water Damage', url: '/blog/data-recovery-water-damage/', category: 'Data Recovery' },
                { title: 'Business Continuity After Electronics Failure', url: '/blog/business-continuity-electronics-failure/', category: 'Business' },
                { title: 'Family Photo Recovery from Damaged Devices', url: '/blog/family-photo-recovery-damaged-devices/', category: 'Family Memories' }
            ],
            'document-restoration': [
                { title: 'Saving Important Documents After Flooding', url: '/blog/saving-documents-after-flooding/', category: 'Document Care' },
                { title: 'Preserving Historical Family Papers', url: '/blog/preserving-historical-family-papers/', category: 'Family History' },
                { title: 'Emergency Document Recovery Process', url: '/blog/emergency-document-recovery-process/', category: 'Emergency' }
            ],
            'general': [
                { title: 'Emergency Response Guide for Homeowners', url: '/blog/emergency-response-guide-homeowners/', category: 'Emergency' },
                { title: 'Working with Insurance for Restoration Claims', url: '/blog/working-insurance-restoration-claims/', category: 'Insurance' },
                { title: 'Why Choose Specialty Restoration', url: '/blog/why-choose-specialty-restoration/', category: 'Education' }
            ]
        };

        return blogPosts[serviceType] || blogPosts['general'];
    }

    renderRelatedServices(services) {
        const container = this.createRelatedServicesContainer();
        
        const html = `
            <section class="related-services" style="
                background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                padding: 40px 20px;
                margin: 40px 0;
                border-radius: 12px;
                border-left: 4px solid #3b82f6;
            ">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h3 style="
                        color: #1e293b;
                        font-size: 1.8rem;
                        margin-bottom: 20px;
                        text-align: center;
                    ">Related Restoration Services</h3>
                    <div class="services-grid" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 20px;
                        margin-top: 30px;
                    ">
                        ${services.map(service => `
                            <a href="${service.url}" class="service-link" data-service="${service.key}" style="
                                background: white;
                                padding: 20px;
                                border-radius: 8px;
                                text-decoration: none;
                                color: inherit;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                                transition: all 0.3s ease;
                                border: 1px solid #e2e8f0;
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.15)';" 
                               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                                <h4 style="
                                    color: #3b82f6;
                                    margin-bottom: 10px;
                                    font-size: 1.1rem;
                                ">${service.title}</h4>
                                <p style="
                                    color: #64748b;
                                    font-size: 0.9rem;
                                    margin: 0;
                                ">Learn more about our specialized ${service.title.toLowerCase()} services →</p>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;

        container.innerHTML = html;
        this.insertRelatedServicesSection(container);
    }

    renderRelatedBlogPosts(posts) {
        const container = this.createRelatedBlogContainer();
        
        const html = `
            <section class="related-blog-posts" style="
                background: linear-gradient(135deg, #fef3c7, #fde68a);
                padding: 40px 20px;
                margin: 40px 0;
                border-radius: 12px;
                border-left: 4px solid #f59e0b;
            ">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h3 style="
                        color: #1e293b;
                        font-size: 1.8rem;
                        margin-bottom: 20px;
                        text-align: center;
                    ">Learn More About This Service</h3>
                    <div class="blog-posts-grid" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 20px;
                        margin-top: 30px;
                    ">
                        ${posts.map(post => `
                            <a href="${post.url}" class="blog-link" data-post="${post.title}" style="
                                background: white;
                                padding: 20px;
                                border-radius: 8px;
                                text-decoration: none;
                                color: inherit;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                                transition: all 0.3s ease;
                                border: 1px solid #fed7aa;
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.15)';" 
                               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                                <div style="
                                    background: #f59e0b;
                                    color: white;
                                    padding: 4px 12px;
                                    border-radius: 20px;
                                    font-size: 0.8rem;
                                    display: inline-block;
                                    margin-bottom: 10px;
                                ">${post.category}</div>
                                <h4 style="
                                    color: #1e293b;
                                    margin-bottom: 10px;
                                    font-size: 1.1rem;
                                    line-height: 1.3;
                                ">${post.title}</h4>
                                <p style="
                                    color: #64748b;
                                    font-size: 0.9rem;
                                    margin: 0;
                                ">Read expert insights and tips →</p>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;

        container.innerHTML = html;
        this.insertRelatedBlogSection(container);
    }

    createRelatedServicesContainer() {
        let container = document.getElementById('related-services-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'related-services-container';
        }
        return container;
    }

    createRelatedBlogContainer() {
        let container = document.getElementById('related-blog-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'related-blog-container';
        }
        return container;
    }

    insertRelatedServicesSection(container) {
        const article = document.querySelector('article') || document.querySelector('main');
        if (article) {
            // Insert before footer or at end of article
            const footer = article.querySelector('footer') || document.querySelector('footer');
            if (footer) {
                footer.parentNode.insertBefore(container, footer);
            } else {
                article.appendChild(container);
            }
        } else {
            document.body.appendChild(container);
        }
    }

    insertRelatedBlogSection(container) {
        const main = document.querySelector('main') || document.querySelector('.service-card').closest('section');
        if (main) {
            const footer = document.querySelector('footer');
            if (footer) {
                footer.parentNode.insertBefore(container, footer);
            } else {
                main.appendChild(container);
            }
        } else {
            document.body.appendChild(container);
        }
    }

    setupSmoothScroll() {
        document.addEventListener('click', (event) => {
            const target = event.target.closest('a[href^="#"]');
            if (target) {
                event.preventDefault();
                const targetId = target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }

    setupAnalyticsTracking() {
        // Track blog to service clicks
        document.addEventListener('click', (event) => {
            const serviceLink = event.target.closest('.service-link');
            const blogLink = event.target.closest('.blog-link');
            
            if (serviceLink) {
                this.trackBlogToServiceClick(serviceLink.dataset.service);
            }
            
            if (blogLink) {
                this.trackServiceToBlogClick(blogLink.dataset.post);
            }
        });
    }

    trackBlogToServiceClick(serviceType) {
        // Google Analytics event tracking
        if (typeof gtag === 'function') {
            gtag('event', 'blog_to_service_click', {
                'event_category': 'Blog Navigation',
                'event_label': serviceType,
                'service_type': serviceType,
                'source_page': this.currentLocation
            });
        }

        // Fallback for GA Universal Analytics
        if (typeof ga === 'function') {
            ga('send', 'event', 'Blog Navigation', 'blog_to_service_click', serviceType);
        }

        console.log(`Blog to service click tracked: ${serviceType}`);
    }

    trackServiceToBlogClick(postTitle) {
        // Google Analytics event tracking
        if (typeof gtag === 'function') {
            gtag('event', 'service_to_blog_click', {
                'event_category': 'Service Navigation',
                'event_label': postTitle,
                'post_title': postTitle,
                'source_page': this.currentLocation
            });
        }

        // Fallback for GA Universal Analytics
        if (typeof ga === 'function') {
            ga('send', 'event', 'Service Navigation', 'service_to_blog_click', postTitle);
        }

        console.log(`Service to blog click tracked: ${postTitle}`);
    }

    // Utility method to manually add related services to a specific blog post
    addCustomRelatedServices(services) {
        this.renderRelatedServices(services);
    }

    // Utility method to manually add related blog posts to a service page
    addCustomRelatedBlogPosts(posts) {
        this.renderRelatedBlogPosts(posts);
    }

    // Method to get analytics data
    getNavigationStats() {
        return {
            currentPage: this.currentLocation,
            isBlogPage: this.isBlogPage(),
            isServicePage: this.isServicePage(),
            serviceType: this.getServiceType()
        };
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Create global instance
    window.blogNavigation = new BlogNavigation();
    
    console.log('Blog Navigation System initialized:', window.blogNavigation.getNavigationStats());
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogNavigation;
}