📋 ANALYZING NAVIGATION STRUCTURE
Date: Fri Sep 19 13:59:17 EDT 2025

## Navigation in public/index.html
            margin-right: 15px;
            vertical-align: middle;
            object-fit: contain;
        }
        
        .nav-menu {
            display: flex;
            list-style: none;
            gap: 30px;
        }
        
        .nav-menu a {
            text-decoration: none;
            color: var(--brand-primary);
            font-weight: 600;
            padding: 10px 15px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        
        .nav-menu a:hover {
            background: var(--brand-light);
            color: var(--brand-accent);
        }
        
        .services-dropdown {
            position: relative;
        }
        
        .services-dropdown:hover .dropdown-menu {
            display: block;
        }
        
        .dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            border-radius: 5px;
            min-width: 220px;
            padding: 10px 0;
            z-index: 1000;
        }
        
        .dropdown-menu a {
            display: block;
            padding: 12px 20px;
            color: #333;
            text-decoration: none;
            font-weight: 500;
            border-radius: 0;
        }
        
        .dropdown-menu a:hover {
            background: #f8f9fa;
            color: #00a0df;
        }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, var(--brand-primary) 0%, #004080 100%);
            color: var(--brand-white);
            padding: 100px 0;
            text-align: center;
        }
        
        .hero h1 {
            color: var(--brand-white);
            font-size: 3rem;
--
            margin: 0;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }
            
            .hero h1 {
                font-size: 2rem;
            }
            
            .hero .subheadline {
                font-size: 1.1rem;
            }
            
            .cta-buttons {
                flex-direction: column;
                align-items: center;
            }
--
     style="height: 85px !important; width: auto !important; clip-path: inset(0 0 12% 0);"
     class="logo-img">
                    <span class="brand-text">Prism Specialties DMV</span>
                </a>
                
                <nav>
                    <ul class="nav-menu">
                        <li class="services-dropdown">
                            <a href="#services">Services</a>
                            <div class="dropdown-menu">
                                <a href="#services">Art & Collectibles</a>
                                <a href="#services">Electronics & Data Recovery</a>
                                <a href="#services">Textile & Fabric Restoration</a>
                                <a href="#services">Document Recovery</a>
                                <a href="#services">Commercial & Large Loss</a>
                                <a href="#services">Lightning Strike Validation</a>
                            </div>
                        </li>
                        <li><a href="about-us.html">About Us</a></li>
                        <li><a href="../blog/index.html">Blog</a></li>
                        <li><a href="#service-areas">Service Areas</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>

## Navigation in public/services.html
        <div class="header-content">
            <a href="index.html" class="logo-brand">
                <img src="images/logos/prism-logo-1000.png" alt="Prism Specialties DMV">
                <span class="brand-text">Prism Specialties DMV</span>
            </a>
            <nav>
                <a href="index.html">Home</a>
                <a href="all-services.html">Services</a>
                <a href="blog/index.html">Blog</a>
                <a href="contact.html">Contact</a>
                <a href="about-us.html">About</a>
                <a href="emergency.html">Emergency</a>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="hero-content">
                <h1>Would you trust your family's irreplaceable treasures to someone who "does restoration on the side"?</h1>

## Navigation in public/about-us.html
        /* Dropdown Menu Styles */
        .services-dropdown {
            position: relative;
        }
        
        .services-dropdown:hover .dropdown-menu {
            display: block;
        }
        
        .dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            border-radius: 5px;
            min-width: 220px;
            padding: 10px 0;
            z-index: 1000;
        }
        
        .dropdown-menu a {
            display: block;
            padding: 12px 20px;
            color: #333;
            text-decoration: none;
            font-weight: 500;
        }
        
        .dropdown-menu a:hover {
            background: #f8f9fa;
            color: #00a0df;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header style="background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 15px 20px;">
            <div>
                <a href="index.html" style="display: flex; align-items: center; text-decoration: none;">
                    <img src="images/logos/prism-logo-1000.png" alt="Prism Specialties DMV" style="height: 85px; width: auto; clip-path: inset(0 0 12% 0); margin-right: 15px;">
                    <span style="color: #00a0df; font-size: 1.8rem; font-weight: 700; font-family: 'Arial', sans-serif; display: inline-block;">Prism Specialties DMV</span>
                </a>
            </div>
            <nav style="display: flex; gap: 30px; align-items: center;">
                <div class="services-dropdown">
                    <a href="index.html#services" style="text-decoration: none; color: #333; font-weight: 500;">Services</a>
                    <div class="dropdown-menu">
                        <a href="index.html#services">Art & Collectibles</a>
                        <a href="index.html#services">Electronics & Data Recovery</a>
                        <a href="index.html#services">Textile & Fabric Restoration</a>
                        <a href="index.html#services">Document Recovery</a>
                        <a href="index.html#services">Commercial & Large Loss</a>
                        <a href="index.html#services">Lightning Strike Validation</a>
                    </div>
                </div>
                <a href="about-us.html" style="text-decoration: none; color: #00a0df; font-weight: 600;">About Us</a>
                <a href="blog/index.html" style="text-decoration: none; color: #333; font-weight: 500;">Blog</a>
                <a href="index.html#service-areas" style="text-decoration: none; color: #333; font-weight: 500;">Service Areas</a>
                <a href="index.html#contact" style="text-decoration: none; color: #333; font-weight: 500;">Contact</a>
                <a href="tel:301-215-3191" style="background: #00a0df; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: 600;">301-215-3191</a>
            </nav>
        </div>

## Navigation in public/contact.html
        <div class="header-content">
            <a href="index.html" class="logo-brand">
                <img src="images/logos/prism-logo-1000.png" alt="Prism Specialties DMV">
                <span class="brand-text">Prism Specialties DMV</span>
            </a>
            <nav>
                <a href="index.html">Home</a>
                <a href="services.html">Services</a>
                <a href="blog/index.html">Blog</a>
                <a href="contact.html" class="active">Contact</a>
                <a href="about-us.html">About</a>
                <a href="emergency.html">Emergency</a>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <h1>You Don't Have to Face This Alone</h1>
            <p>When disaster damages your precious belongings, compassionate experts are just a phone call away</p>

