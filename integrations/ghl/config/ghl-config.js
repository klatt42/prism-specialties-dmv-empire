// GHL API Configuration for Prism Specialties DMV
const GHL_CONFIG = {
    // API Endpoints
    apiBase: 'https://services.leadconnectorhq.com',
    locationId: 'YOUR_GHL_LOCATION_ID', // Replace with your actual GHL Location ID
    apiKey: 'YOUR_GHL_API_KEY', // Add your GHL API key for webhook integration

    // Regional Phone Tracking (production numbers)
    phoneNumbers: {
        DC: '202-335-4240',
        VA: '703-229-1321',
        MD: '301-215-3191'
    },

    // Content Scoring Values (based on blog engagement patterns)
    contentScores: {
        // Blog Category Scores
        artRestoration: 25,
        historicalArtifacts: 35,       // Historical category
        civilWarRestoration: 40,       // High historical value
        battlefieldArtifacts: 35,      // Regional historical significance
        textileRestoration: 30,
        documentRestoration: 35,
        governmentDocuments: 40,       // Government/legal category
        federalRecords: 45,            // High authority value
        classifiedDocuments: 50,       // Highest security level
        electronicsRestoration: 25,
        vintageElectronics: 30,        // Specialty category
        antiqueRadioRepair: 35,        // High specialty value
        retroGamingRestoration: 30,    // Gaming specialty
        waterDamageRestoration: 50,    // Emergency category
        floodRecovery: 55,             // High emergency value
        moldPrevention: 45,            // Health-critical service
        fireDamageRestoration: 50,     // Emergency category
        smokeDamageRecovery: 45,       // High emergency value
        sootRemoval: 40,               // Specialized service
        photoRestoration: 25,          // Personal category
        familyArchiveDigitization: 30, // High personal value
        slideConversion: 25,           // Personal/family service

        // Engagement Level Scores
        blogView: 5,
        blogTimeSpent3Min: 15,
        blogTimeSpent5Min: 25,
        emergencyCtaClick: 50,
        phoneCallClick: 75,
        phoneHover: 10,        // Hover indicates interest
        phoneCopy: 25,         // Copy indicates intent to call later
        contactFormSubmit: 100,

        // Regional Authority Scores
        localSearch: 10,
        regionalContent: 15,
        emergencyService: 50,

        // High-Value Indicators
        militaryUniformContent: 40, // High emotional value
        weddingDressContent: 45,    // High emotional value
        governmentRecordsContent: 35, // High authority value
        emergencyResponse: 60,      // Immediate need
        waterDamageEmergency: 50,   // Emergency water damage content
        insuranceClaimsInterest: 15, // Insurance claims engagement
        floodZoneContent: 20,       // DMV flood zone awareness
        emergencyProtocol: 35,      // Emergency protocol engagement
        fireDamageEmergency: 50,    // Emergency fire damage content
        smokeDamageAssessment: 25,  // Smoke damage assessment interest
        fireDepartmentPartnership: 10, // Fire department partnership awareness
        wildfireConsiderations: 15, // Virginia wildfire awareness
        sootRemovalInterest: 20,    // Soot removal service interest
        governmentDocumentPreservation: 40, // Government document content
        securityClearanceInterest: 15, // Security clearance engagement
        naraCompliance: 10,         // NARA compliance awareness
        federalAgencyPartnership: 15, // Federal agency interest
        chainOfCustody: 10,         // Chain of custody protocols
        classificationLevelInterest: 10, // Classification level engagement
        civilWarRestoration: 35,    // Civil War historical content
        battlefieldArtifacts: 20,   // Battlefield artifact interest
        museumQualityInterest: 15,  // Museum-quality restoration interest
        authenticationInterest: 15, // Authentication service interest
        provenanceDocumentation: 10, // Provenance documentation interest
        virginiaMuseumPartnership: 10, // Virginia museum partnership interest
        collectorNetworkInterest: 15, // Collector network engagement
        vintageElectronicsRestoration: 30, // Vintage electronics content
        freeDiagnosticInterest: 20,  // Free diagnostic evaluation interest
        componentSourcingInterest: 15, // Component sourcing engagement
        antiqueRadioInterest: 20,    // Antique radio repair interest
        retroGamingInterest: 15,     // Retro gaming restoration interest
        dmvCollectorCommunity: 10,   // DMV collector community engagement
        vintageShowsInterest: 10,    // Vintage electronics shows interest
        functionalityRestorationInterest: 15, // Functionality restoration focus
        photoRestorationFamily: 25,    // Photo restoration family content
        freeSampleInterest: 20,        // Free sample restoration interest
        familyArchiveInterest: 15,     // Family archive digitization interest
        slideConversionInterest: 15,   // Slide conversion service interest
        genealogySupport: 10,          // Genealogy research support interest
        digitalPreservationInterest: 10, // Digital preservation solutions interest
        beforeAfterGalleryInterest: 15, // Before/after gallery engagement
        dmvFamilyHistorians: 10,       // DMV family historians engagement
        familyLegacyInterest: 20       // Family legacy preservation interest
    },

    // Lead Temperature Thresholds
    leadTemperature: {
        cold: 0,      // 0-24 points
        warm: 25,     // 25-49 points
        hot: 50,      // 50-99 points
        emergency: 100 // 100+ points
    },

    // Content Categories for Automation Triggers
    contentCategories: {
        textile: ['wedding-dress', 'military-uniform', 'textile-restoration'],
        document: ['historic-documents', 'government-records', 'document-restoration'],
        government: ['government-documents', 'federal-records', 'classified-documents', 'NARA-compliance'],
        historical: ['civil-war', 'battlefield-artifacts', 'historical-preservation', 'authentication'],
        art: ['museum-pieces', 'estate-art', 'art-restoration'],
        electronics: ['church-electronics', 'audio-equipment', 'electronics-restoration'],
        vintage: ['vintage-electronics', 'antique-radio', 'retro-gaming', 'component-sourcing'],
        family: ['photo-restoration', 'family-archive', 'slide-conversion', 'genealogy'],
        waterDamage: ['water-damage', 'flood-recovery', 'mold-prevention', 'emergency-restoration'],
        fireDamage: ['fire-damage', 'smoke-damage', 'soot-removal', 'fire-restoration'],
        emergency: ['emergency', 'immediate', 'urgent', '15-minute', 'hotline', '4-hour']
    },

    // Regional Targeting
    regions: {
        DC: ['washington-dc', 'capitol-hill', 'georgetown'],
        VA: ['northern-virginia', 'alexandria', 'arlington', 'fairfax'],
        MD: ['montgomery-county', 'prince-georges', 'annapolis']
    },

    // DMV Flood Zone Targeting
    floodZones: {
        highRisk: {
            DC: ['georgetown-waterfront', 'anacostia-river', 'rock-creek'],
            VA: ['old-town-alexandria', 'potomac-river-corridor', 'great-falls'],
            MD: ['bethesda-potomac', 'national-harbor', 'chesapeake-bay']
        },
        moderateRisk: {
            DC: ['dupont-circle', 'adams-morgan', 'shaw'],
            VA: ['fairfax-county', 'loudoun-county', 'prince-william'],
            MD: ['silver-spring', 'rockville', 'gaithersburg']
        },
        specialConsiderations: {
            historicProperties: ['georgetown', 'old-town-alexandria', 'annapolis-historic'],
            governmentBuildings: ['federal-triangle', 'capitol-hill', 'pentagon'],
            commercialDistricts: ['downtown-dc', 'rosslyn', 'bethesda-row']
        }
    },

    // Virginia Civil War Battlefields & Museum Partnerships
    virginiaBattlefields: {
        majorBattlefields: {
            bullRun: {
                location: 'Manassas',
                battles: ['First Bull Run 1861', 'Second Bull Run 1862'],
                artifacts: ['uniforms', 'weapons', 'personal-effects', 'camp-equipment'],
                museums: ['Manassas National Battlefield Park']
            },
            fredericksburg: {
                location: 'Fredericksburg',
                battles: ['Battle of Fredericksburg 1862'],
                artifacts: ['urban-warfare-relics', 'maryes-heights-artifacts'],
                museums: ['Fredericksburg Battlefield Park']
            },
            chancellorsville: {
                location: 'Spotsylvania County',
                battles: ['Battle of Chancellorsville 1863'],
                artifacts: ['wilderness-artifacts', 'jackson-related-items'],
                museums: ['Chancellorsville Battlefield']
            },
            coldHarbor: {
                location: 'Hanover County',
                battles: ['Battle of Cold Harbor 1864'],
                artifacts: ['trench-warfare-items', 'siege-equipment'],
                museums: ['Cold Harbor Battlefield']
            },
            petersburg: {
                location: 'Petersburg',
                battles: ['Siege of Petersburg 1864-1865'],
                artifacts: ['siege-artifacts', 'crater-battlefield-relics'],
                museums: ['Petersburg National Battlefield']
            },
            appomattox: {
                location: 'Appomattox County',
                battles: ['Battle of Appomattox Court House 1865'],
                artifacts: ['surrender-site-artifacts', 'retreat-path-relics'],
                museums: ['Appomattox Court House National Historical Park']
            }
        },
        collectingAreas: {
            northernVirginia: ['fairfax', 'loudoun', 'prince-william', 'arlington'],
            centralVirginia: ['spotsylvania', 'hanover', 'henrico', 'chesterfield'],
            southernVirginia: ['dinwiddie', 'sussex', 'brunswick', 'mecklenburg']
        }
    },

    // Virginia Museum Partnerships
    virginiaMuseumPartnerships: {
        stateInstitutions: {
            virginiaMuseumOfHistory: {
                location: 'Richmond',
                specialties: ['state-collection-preservation', 'exhibition-preparation'],
                services: ['authentication', 'conservation', 'research']
            },
            virginiaHistoricalSociety: {
                location: 'Richmond',
                specialties: ['research-collections', 'manuscript-preservation'],
                services: ['provenance-research', 'documentation', 'conservation']
            }
        },
        nationalParkService: {
            manassasNationalBattlefield: {
                location: 'Manassas',
                specialties: ['park-collection-conservation', 'artifact-research'],
                services: ['battlefield-artifact-analysis', 'interpretation-support']
            },
            petersburgNationalBattlefield: {
                location: 'Petersburg',
                specialties: ['siege-artifact-preservation', 'educational-programming'],
                services: ['conservation', 'research', 'exhibition-preparation']
            }
        },
        privateMuseums: {
            museumOfTheCivilWarSoldier: {
                location: 'Richmond',
                specialties: ['soldier-artifacts', 'personal-effects'],
                services: ['private-collection-services', 'authentication']
            }
        }
    },

    // Civil War Collector Networks
    civilWarCollectorNetworks: {
        virginiaCollectors: {
            associations: ['Virginia Civil War Collectors Association', 'Richmond Area Civil War Roundtable'],
            specialties: ['battlefield-artifacts', 'military-antiques', 'documents'],
            services: ['authentication', 'appraisal', 'restoration', 'provenance-research']
        },
        nationalNetworks: {
            associations: ['Civil War Collectors Society', 'Company of Military Historians'],
            specialties: ['high-end-artifacts', 'museum-quality-pieces'],
            services: ['expert-authentication', 'insurance-appraisal', 'scholarly-research']
        }
    },

    // DMV Vintage Electronics Collector Communities & Shows
    dmvVintageElectronics: {
        collectorCommunities: {
            capitolAreaRadioClub: {
                location: 'Washington DC Metro',
                focus: 'antique-radio-collectors',
                meetings: 'monthly',
                specialties: ['tube-radios', 'transistor-radios', 'restoration-techniques']
            },
            dcRetroGamingSociety: {
                location: 'Washington DC',
                focus: 'classic-gaming-preservation',
                events: 'quarterly-meets',
                specialties: ['arcade-cabinets', 'console-restoration', 'handheld-games']
            },
            northernVaHiFiClub: {
                location: 'Northern Virginia',
                focus: 'vintage-audio-equipment',
                meetings: 'bi-monthly',
                specialties: ['amplifiers', 'turntables', 'speakers', 'hi-fi-restoration']
            },
            classicComputerClubDC: {
                location: 'DMV Region',
                focus: 'early-personal-computers',
                events: 'monthly-workshops',
                specialties: ['apple-ii', 'commodore', 'early-ibm', 'calculator-restoration']
            }
        },
        vintageElectronicsShows: {
            spring: {
                timoniumRadioShow: {
                    location: 'Timonium, MD',
                    timing: 'March',
                    focus: 'antique-radio-electronics',
                    attendance: '500+'
                },
                dcHamfest: {
                    location: 'Fairfax, VA',
                    timing: 'May',
                    focus: 'amateur-radio-vintage',
                    attendance: '1000+'
                }
            },
            summer: {
                northernVaVintageComputerShow: {
                    location: 'Chantilly, VA',
                    timing: 'July',
                    focus: 'classic-computers',
                    attendance: '300+'
                },
                arcadeExpo: {
                    location: 'Alexandria, VA',
                    timing: 'August',
                    focus: 'arcade-restoration',
                    attendance: '400+'
                }
            },
            fall: {
                capitolAreaRadioShow: {
                    location: 'Laurel, MD',
                    timing: 'October',
                    focus: 'radio-restoration',
                    attendance: '600+'
                },
                retroGamingConvention: {
                    location: 'Rockville, MD',
                    timing: 'November',
                    focus: 'retro-gaming',
                    attendance: '800+'
                }
            },
            winter: {
                holidayElectronicsSwap: {
                    location: 'Arlington, VA',
                    timing: 'December',
                    focus: 'electronics-swap-meet',
                    attendance: '200+'
                },
                vintageHiFiShow: {
                    location: 'Bethesda, MD',
                    timing: 'February',
                    focus: 'high-end-audio',
                    attendance: '350+'
                }
            }
        },
        specialtyDealers: {
            tubeSuppliers: ['Capitol Electronics', 'Antique Electronic Supply'],
            componentSources: ['Electronic Goldmine', 'Surplus Sales of Nebraska'],
            serviceManuals: ['Sams Photofacts', 'Vintage Radio Manuals'],
            nosparts: ['Fair Radio Sales', 'All Electronics Corp']
        }
    },

    // DMV Family Historians & Genealogy Societies
    dmvFamilyHistorians: {
        genealogySocieties: {
            nationalGenealogicalSociety: {
                location: 'Arlington, VA',
                focus: 'professional-genealogy-research',
                membership: '16000+',
                specialties: ['photo-preservation', 'family-documentation', 'research-standards'],
                events: ['annual-conference', 'monthly-lectures', 'photo-preservation-workshops']
            },
            dcGenealogicalSociety: {
                location: 'Washington, DC',
                focus: 'local-family-history',
                membership: '800+',
                specialties: ['dc-area-families', 'photo-archiving', 'cemetery-research'],
                events: ['monthly-meetings', 'genealogy-fairs', 'photo-identification-sessions']
            },
            marylandGenealogicalSociety: {
                location: 'Baltimore/Rockville, MD',
                focus: 'maryland-family-research',
                membership: '1200+',
                specialties: ['maryland-records', 'german-immigration', 'photo-preservation'],
                events: ['quarterly-workshops', 'cemetery-tours', 'family-photo-sharing']
            },
            virginiaGenealogicalSociety: {
                location: 'Richmond, VA (Northern VA chapters)',
                focus: 'virginia-family-history',
                membership: '2000+',
                specialties: ['colonial-families', 'civil-war-records', 'plantation-photography'],
                events: ['annual-jamboree', 'regional-meetings', 'photo-dating-workshops']
            }
        },
        familyHistoryResources: {
            librariesAndArchives: {
                libraryOfCongress: {
                    location: 'Washington, DC',
                    collections: ['american-memory-project', 'prints-photographs-division'],
                    services: ['photo-identification', 'preservation-consultation']
                },
                nationalArchives: {
                    location: 'College Park, MD',
                    collections: ['military-records', 'immigration-photos', 'census-images'],
                    services: ['family-research-assistance', 'photo-digitization']
                },
                darlibrary: {
                    location: 'Washington, DC',
                    collections: ['dar-ancestor-photos', 'revolutionary-war-families'],
                    services: ['lineage-verification', 'ancestral-photo-research']
                }
            },
            familyHistoryCenters: {
                fairfaxFamilyHistoryCenter: {
                    location: 'Fairfax, VA',
                    services: ['genealogy-research', 'photo-scanning', 'family-tree-software'],
                    resources: ['microfilm-readers', 'digital-collections', 'volunteer-assistance']
                },
                gaithersburgFamilyHistoryCenter: {
                    location: 'Gaithersburg, MD',
                    services: ['german-records', 'photo-preservation', 'research-guidance'],
                    resources: ['european-collections', 'immigration-records', 'photo-identification']
                }
            }
        },
        photoPreservationCommunity: {
            workshops: [
                'photo-identification-and-dating',
                'digital-preservation-best-practices',
                'family-archive-organization',
                'genealogy-photo-documentation'
            ],
            meetups: [
                'monthly-photo-sharing-sessions',
                'family-history-show-and-tell',
                'photo-restoration-demonstrations',
                'digital-archive-planning'
            ],
            collaborativeProjects: [
                'cemetery-photo-documentation',
                'historic-neighborhood-photography',
                'family-reunion-photo-collection',
                'genealogy-society-photo-archives'
            ]
        }
    },

    // National Archives & Federal Agency Targeting
    nationalArchivesProximity: {
        location: 'Washington DC',
        distanceFromNARA: '10 miles',
        benefits: [
            'direct-consultation-access',
            'NARA-specialist-coordination',
            'federal-standards-compliance',
            'records-schedule-verification'
        ],
        federalFacilities: [
            'National Archives Building',
            'National Archives at College Park',
            'Washington National Records Center',
            'Federal Records Centers'
        ]
    },

    // Federal Agency Partnerships
    federalAgencyTargeting: {
        executiveBranch: {
            departments: ['State', 'Defense', 'Justice', 'Treasury', 'Interior', 'Agriculture', 'Commerce', 'Labor', 'HHS', 'HUD', 'Transportation', 'Energy', 'Education', 'Veterans Affairs', 'Homeland Security'],
            agencies: ['EPA', 'NASA', 'NSF', 'SBA', 'SSA'],
            specialConsiderations: ['security-clearance-required', 'GSA-contracting', 'federal-procurement']
        },
        legislativeBranch: {
            institutions: ['House of Representatives', 'Senate', 'Library of Congress', 'Government Accountability Office'],
            documentTypes: ['congressional-records', 'committee-reports', 'legislative-history'],
            specialRequirements: ['public-access-considerations', 'historical-preservation']
        },
        judicialBranch: {
            courts: ['Supreme Court', 'Federal Courts', 'Administrative Courts'],
            documentTypes: ['court-records', 'case-files', 'judicial-opinions'],
            requirements: ['legal-admissibility', 'chain-of-custody', 'sealed-document-handling']
        },
        intelligenceCommunity: {
            agencies: ['CIA', 'NSA', 'FBI', 'DIA', 'NGA'],
            clearanceRequirements: ['Secret', 'Top Secret', 'TS/SCI'],
            specialProtocols: ['compartmented-information', 'SCIF-processing', 'special-access-programs']
        }
    },

    // Fire Department Partnerships & Wildfire Zones
    fireDepartmentPartnerships: {
        DC: {
            department: 'DC Fire & EMS',
            coverage: ['washington-dc', 'capitol-hill', 'georgetown', 'dupont-circle'],
            specialPrograms: ['historic-property-fires', 'government-building-response'],
            responseCoordination: true
        },
        VA: {
            department: 'Fairfax County Fire',
            coverage: ['fairfax-county', 'loudoun-county', 'prince-william'],
            specialPrograms: ['wildfire-response', 'residential-fire-recovery'],
            wildfireRisk: 'moderate-high'
        },
        MD: {
            department: 'Montgomery County Fire',
            coverage: ['montgomery-county', 'prince-georges'],
            specialPrograms: ['emergency-victim-assistance', 'commercial-fire-response'],
            responseCoordination: true
        }
    },

    // Virginia Wildfire Considerations
    wildfireZones: {
        highRisk: {
            areas: ['great-falls', 'leesburg', 'purcellville', 'bluemont'],
            seasons: ['spring', 'summer', 'fall'],
            considerations: ['extensive-smoke-penetration', 'mixed-combustion-materials', 'large-scale-contamination']
        },
        moderateRisk: {
            areas: ['reston', 'herndon', 'vienna', 'oakton'],
            seasons: ['summer', 'fall'],
            considerations: ['residential-density', 'HVAC-contamination', 'insurance-complexities']
        },
        specialResponse: {
            equipment: ['mobile-smoke-chambers', 'ozone-generators', 'thermal-imaging'],
            protocols: ['multi-property-coordination', 'insurance-claim-coordination', 'evacuation-support']
        }
    },

    // Phone Call Automation Triggers
    phoneCallTriggers: {
        emergency: {
            responseTime: 15, // minutes
            workflow: 'emergency_response',
            priority: 'immediate'
        },
        hotLead: {
            responseTime: 240, // 4 hours in minutes
            workflow: 'hot_lead_followup',
            priority: 'high'
        },
        standard: {
            responseTime: 1440, // 24 hours in minutes
            workflow: 'standard_followup',
            priority: 'normal'
        }
    },

    // GHL Webhook Endpoints
    webhooks: {
        phoneCall: '/webhook/phone-call',
        emergencyResponse: '/webhook/emergency-response',
        hotLead: '/webhook/hot-lead',
        leadScoring: '/webhook/lead-scoring',
        automation: '/webhook/automation-trigger'
    },

    // GHL Automation Sequence IDs (replace with your actual automation IDs)
    automationSequences: {
        // Emergency Response Sequences
        EMERGENCY_RESTORATION_RESPONSE: 'YOUR_EMERGENCY_AUTOMATION_ID',

        // Lead Temperature Sequences
        HOT_RESTORATION_LEAD: 'YOUR_HOT_LEAD_AUTOMATION_ID',
        WARM_RESTORATION_NURTURE: 'YOUR_WARM_LEAD_AUTOMATION_ID',
        COLD_RESTORATION_NURTURE: 'YOUR_COLD_LEAD_AUTOMATION_ID',

        // Content-Specific Sequences
        WEDDING_DRESS_RESTORATION_SPECIALIST: 'YOUR_WEDDING_SPECIALIST_AUTOMATION_ID',
        MILITARY_UNIFORM_RESTORATION_SPECIALIST: 'YOUR_MILITARY_SPECIALIST_AUTOMATION_ID',
        INSTITUTIONAL_RESTORATION_SPECIALIST: 'YOUR_INSTITUTIONAL_AUTOMATION_ID',
        WATER_DAMAGE_EMERGENCY_RESPONSE: 'YOUR_WATER_DAMAGE_AUTOMATION_ID',
        FLOOD_RECOVERY_SPECIALIST: 'YOUR_FLOOD_RECOVERY_AUTOMATION_ID',
        INSURANCE_CLAIMS_ASSISTANCE: 'YOUR_INSURANCE_CLAIMS_AUTOMATION_ID',
        FIRE_DAMAGE_EMERGENCY_RESPONSE: 'YOUR_FIRE_DAMAGE_AUTOMATION_ID',
        SMOKE_DAMAGE_ASSESSMENT: 'YOUR_SMOKE_DAMAGE_AUTOMATION_ID',
        FIRE_DEPARTMENT_COORDINATION: 'YOUR_FIRE_DEPT_AUTOMATION_ID',
        GOVERNMENT_DOCUMENT_PRESERVATION: 'YOUR_GOVERNMENT_DOC_AUTOMATION_ID',
        FEDERAL_RECORDS_RESTORATION: 'YOUR_FEDERAL_RECORDS_AUTOMATION_ID',
        SECURITY_CLEARANCE_CONSULTATION: 'YOUR_SECURITY_CLEARANCE_AUTOMATION_ID',
        CIVIL_WAR_RESTORATION: 'YOUR_CIVIL_WAR_AUTOMATION_ID',
        HISTORICAL_ARTIFACT_PRESERVATION: 'YOUR_HISTORICAL_ARTIFACT_AUTOMATION_ID',
        AUTHENTICATION_CONSULTATION: 'YOUR_AUTHENTICATION_AUTOMATION_ID',
        VINTAGE_ELECTRONICS_RESTORATION: 'YOUR_VINTAGE_ELECTRONICS_AUTOMATION_ID',
        FREE_DIAGNOSTIC_EVALUATION: 'YOUR_FREE_DIAGNOSTIC_AUTOMATION_ID',
        COMPONENT_SOURCING_CONSULTATION: 'YOUR_COMPONENT_SOURCING_AUTOMATION_ID',
        PHOTO_RESTORATION_FAMILY: 'YOUR_PHOTO_RESTORATION_AUTOMATION_ID',
        FREE_SAMPLE_RESTORATION: 'YOUR_FREE_SAMPLE_AUTOMATION_ID',
        FAMILY_ARCHIVE_DIGITIZATION: 'YOUR_FAMILY_ARCHIVE_AUTOMATION_ID',

        // Engagement-Based Sequences
        EXPERT_CONSULTATION_INVITATION: 'YOUR_EXPERT_CONSULTATION_AUTOMATION_ID',
        RETURN_VISITOR_CONVERSION: 'YOUR_RETURN_VISITOR_AUTOMATION_ID',
        DEEP_ENGAGEMENT_CONVERSION: 'YOUR_DEEP_ENGAGEMENT_AUTOMATION_ID',

        // Milestone Sequences
        ENGAGEMENT_5_MINUTE_MILESTONE: 'YOUR_5MIN_MILESTONE_AUTOMATION_ID',
        ENGAGEMENT_10_MINUTE_MILESTONE: 'YOUR_10MIN_MILESTONE_AUTOMATION_ID'
    },

    // Automation Actions Configuration
    automationActions: {
        emergency: {
            immediate_sms_alert: 'Send immediate SMS to emergency team',
            emergency_call_task: 'Create priority call task for 15-min response',
            priority_email_notification: 'Send priority email to regional specialist',
            regional_specialist_assignment: 'Assign to regional emergency specialist'
        },
        hotLead: {
            immediate_sms_followup: 'Send immediate SMS follow-up within 5 minutes',
            priority_call_task: 'Create high-priority call task',
            custom_quote_email: 'Send custom quote email with service details',
            case_study_attachment: 'Attach relevant case study examples',
            consultation_booking_link: 'Provide priority consultation booking link'
        },
        warmLead: {
            educational_email_series: 'Start educational email sequence',
            consultation_offer_sms: 'Send consultation offer via SMS',
            retargeting_pixel_activation: 'Activate retargeting pixels',
            social_proof_email: 'Send social proof and testimonials',
            before_after_gallery_link: 'Provide before/after gallery access'
        },
        coldLead: {
            general_newsletter_signup: 'Add to general newsletter list',
            case_study_email_series: 'Start case study email series',
            social_proof_sequence: 'Begin social proof sequence',
            educational_content_drip: 'Start educational content drip campaign',
            seasonal_restoration_tips: 'Add to seasonal tips sequence'
        },
        waterDamageEmergency: {
            immediate_emergency_response: 'Trigger immediate emergency response protocol',
            insurance_claims_specialist: 'Assign certified insurance claims specialist',
            emergency_documentation: 'Begin emergency damage documentation process',
            mold_prevention_alert: 'Send mold prevention timeline and protocols',
            emergency_equipment_dispatch: 'Dispatch emergency drying equipment',
            regional_specialist_assignment: 'Assign regional water damage specialist'
        },
        insuranceClaims: {
            claims_specialist_introduction: 'Introduce certified insurance claims specialist',
            documentation_checklist: 'Send comprehensive documentation checklist',
            carrier_liaison_setup: 'Set up direct insurance carrier communication',
            maximize_settlement_guide: 'Provide settlement maximization strategies',
            claims_timeline_tracking: 'Begin claims timeline and milestone tracking'
        },
        fireDamageEmergency: {
            immediate_fire_assessment: 'Dispatch certified fire damage specialist within 4 hours',
            smoke_damage_evaluation: 'Begin comprehensive smoke and soot damage assessment',
            fire_dept_coordination: 'Coordinate with local fire department for scene access',
            emergency_stabilization: 'Implement emergency board-up and smoke sealing',
            insurance_fire_claims: 'Initiate fire damage insurance claim with documentation',
            contents_evaluation: 'Assess salvageable contents for pack-out and restoration'
        },
        smokeDamageAssessment: {
            smoke_type_identification: 'Identify wet smoke, dry smoke, or protein smoke damage',
            penetration_analysis: 'Assess smoke penetration depth and affected materials',
            odor_elimination_plan: 'Develop thermal fogging and ozone treatment protocol',
            hvac_contamination_check: 'Evaluate HVAC system contamination and cleaning needs',
            restoration_timeline: 'Provide detailed restoration timeline and expectations'
        },
        governmentDocumentPreservation: {
            security_clearance_verification: 'Verify required security clearance level for document handling',
            federal_standards_compliance: 'Ensure NARA compliance and federal preservation standards',
            chain_of_custody_setup: 'Establish documented chain of custody protocols',
            classification_level_assessment: 'Determine document classification and handling requirements',
            GSA_contracting_coordination: 'Initiate GSA contract vehicle for federal procurement',
            federal_agency_liaison: 'Assign dedicated federal agency liaison specialist'
        },
        securityClearanceConsultation: {
            clearance_level_consultation: 'Provide consultation on required security clearance levels',
            federal_facility_coordination: 'Coordinate secure processing in federal facilities if required',
            SCIF_processing_options: 'Discuss SCIF processing capabilities for classified materials',
            government_contracting_info: 'Provide GSA contracting and federal procurement information',
            NARA_compliance_guidance: 'Offer guidance on NARA compliance and federal standards'
        },
        civilWarRestoration: {
            artifact_assessment: 'Professional assessment of Civil War artifacts and historical significance',
            battlefield_provenance: 'Research battlefield recovery documentation and historical context',
            museum_quality_restoration: 'Provide museum-standard conservation and restoration services',
            virginia_museum_coordination: 'Coordinate with Virginia museums and historical institutions',
            collector_network_access: 'Connect with Virginia Civil War collector networks and associations',
            insurance_appraisal: 'Professional appraisal for insurance and estate documentation'
        },
        authenticationConsultation: {
            artifact_authentication: 'Professional authentication services for historical artifacts',
            provenance_research: 'Comprehensive historical research and documentation services',
            materials_analysis: 'Period-appropriate materials and construction verification',
            certification_documentation: 'Provide authentication certificates and professional reports',
            collector_consultation: 'Expert consultation for private collectors and estates',
            museum_standards_compliance: 'Ensure AAM and NPS compliance for institutional collections'
        },
        vintageElectronicsRestoration: {
            free_diagnostic_evaluation: 'Provide comprehensive diagnostic assessment at no charge',
            component_sourcing_consultation: 'Assess parts availability and sourcing options',
            restoration_feasibility_analysis: 'Determine restoration viability and cost estimates',
            dmv_collector_network_access: 'Connect with local vintage electronics communities',
            vintage_show_coordination: 'Coordinate consultation at regional electronics shows',
            specialty_restoration_planning: 'Develop custom restoration approach for unique items'
        },
        freeDiagnosticEvaluation: {
            comprehensive_assessment: 'Complete functionality and condition evaluation',
            parts_availability_research: 'Research component availability and sourcing options',
            restoration_cost_estimate: 'Provide detailed restoration cost breakdown',
            functionality_restoration_plan: 'Develop plan for electrical and mechanical restoration',
            aesthetic_preservation_options: 'Discuss cabinet and cosmetic restoration approaches',
            collector_value_consultation: 'Assess collectible value and investment potential'
        },
        photoRestorationFamily: {
            free_sample_restoration: 'Provide complimentary sample restoration to demonstrate quality',
            family_archive_assessment: 'Comprehensive evaluation of family photo collections',
            genealogy_research_support: 'Coordinate with DMV genealogy societies and family historians',
            digital_preservation_planning: 'Develop long-term digital archive preservation strategy',
            family_timeline_creation: 'Organize photos chronologically for family history documentation',
            legacy_project_consultation: 'Plan comprehensive family legacy preservation projects'
        },
        freeSampleRestoration: {
            sample_photo_selection: 'Help select best candidate photo for sample restoration',
            quality_demonstration: 'Complete professional restoration of sample photo at no charge',
            restoration_process_explanation: 'Detailed explanation of restoration techniques and approach',
            full_project_estimation: 'Provide comprehensive estimate for complete family archive',
            genealogy_integration_options: 'Discuss integration with family tree and genealogy research',
            digital_delivery_planning: 'Plan digital archive organization and delivery format'
        }
    },

    // Regional Specialist Assignments
    regionalSpecialists: {
        DC: {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@prism-specialties.com',
            phone: '202-335-4240',
            specialties: ['art_restoration', 'museum_quality', 'government_contracts']
        },
        VA: {
            name: 'Michael Chen',
            email: 'michael.chen@prism-specialties.com',
            phone: '703-229-1321',
            specialties: ['military_restoration', 'textile_restoration', 'wedding_dress']
        },
        MD: {
            name: 'Emily Rodriguez',
            email: 'emily.rodriguez@prism-specialties.com',
            phone: '301-215-3191',
            specialties: ['document_restoration', 'electronics_restoration', 'institutional']
        }
    }
};

module.exports = GHL_CONFIG;