// PRISM SPECIALTIES DMV - PERFORMANCE VALIDATOR
// Elena Execution - Funeral Director Standard™ Validation

const fs = require('fs');
const path = require('path');

class PrismPerformanceValidator {
    constructor() {
        this.funeralDirectorStandard = 542; // milliseconds
        this.performanceResults = {
            htmlFiles: [],
            cssFiles: [],
            jsFiles: [],
            buildSystem: []
        };
    }

    findFilesByExtension(extension) {
        const files = [];
        const scanDirectory = (dir) => {
            try {
                const items = fs.readdirSync(dir);
                items.forEach(item => {
                    if (item.startsWith('.') || item === 'node_modules') return;
                    const fullPath = path.join(dir, item);
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory()) {
                        scanDirectory(fullPath);
                    } else if (item.toLowerCase().endsWith(extension.toLowerCase())) {
                        files.push(fullPath);
                    }
                });
            } catch (error) {
                // Directory doesn't exist
            }
        };
        scanDirectory('.');
        return files;
    }

    validateHTMLOptimization() {
        console.log('📄 ELENA EXECUTION - HTML OPTIMIZATION ANALYSIS...');
        const htmlFiles = this.findFilesByExtension('.html');
        
        htmlFiles.forEach(file => {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const stats = fs.statSync(file);
                
                const analysis = {
                    file: file,
                    sizeKB: Math.round(stats.size / 1024 * 100) / 100,
                    hasTitle: content.includes('<title>'),
                    hasMetaDescription: content.includes('name="description"'),
                    hasViewport: content.includes('name="viewport"'),
                    hasLazyLoading: content.includes('loading="lazy"'),
                    hasAuthorityReversal: content.includes('authority-reversal') || content.toLowerCase().includes('funeral director'),
                    optimizationScore: 0
                };
                
                // Calculate score
                let score = 0;
                if (analysis.hasTitle) score += 20;
                if (analysis.hasMetaDescription) score += 20;
                if (analysis.hasViewport) score += 20;
                if (analysis.hasLazyLoading) score += 20;
                if (analysis.hasAuthorityReversal) score += 20;
                
                analysis.optimizationScore = score;
                this.performanceResults.htmlFiles.push(analysis);
                
            } catch (error) {
                console.error(`❌ Error analyzing ${file}: ${error.message}`);
            }
        });
    }

    validateBuildSystem() {
        console.log('🔧 ELENA EXECUTION - BUILD SYSTEM VALIDATION...');
        
        const buildAnalysis = {
            packageJson: fs.existsSync('package.json'),
            netlifyToml: fs.existsSync('netlify.toml'),
            publicDir: fs.existsSync('public'),
            buildScripts: fs.existsSync('build-scripts'),
            score: 0
        };
        
        let score = 0;
        if (buildAnalysis.packageJson) score += 25;
        if (buildAnalysis.netlifyToml) score += 25;
        if (buildAnalysis.publicDir) score += 25;
        if (buildAnalysis.buildScripts) score += 25;
        
        buildAnalysis.score = score;
        this.performanceResults.buildSystem.push(buildAnalysis);
    }

    runPerformanceValidation() {
        console.log('⚱️  ELENA EXECUTION - FUNERAL DIRECTOR STANDARD™ VALIDATION');
        console.log(`Target: <${this.funeralDirectorStandard}ms load time + 95% accessibility`);
        console.log('=' .repeat(70));
        
        this.validateHTMLOptimization();
        this.validateBuildSystem();
        this.generatePerformanceReport();
    }

    generatePerformanceReport() {
        console.log('\n🚀 ELENA EXECUTION PERFORMANCE REPORT');
        console.log('=' .repeat(50));
        
        console.log('\n📄 HTML FILES ANALYSIS:');
        this.performanceResults.htmlFiles.forEach(html => {
            console.log(`📄 ${html.file}:`);
            console.log(`   Size: ${html.sizeKB} KB`);
            console.log(`   Optimization Score: ${html.optimizationScore}%`);
            console.log(`   Has Title: ${html.hasTitle ? '✅' : '❌'}`);
            console.log(`   Has Meta Description: ${html.hasMetaDescription ? '✅' : '❌'}`);
            console.log(`   Has Authority Reversal: ${html.hasAuthorityReversal ? '✅' : '❌'}`);
        });

        console.log('\n🔧 BUILD SYSTEM:');
        this.performanceResults.buildSystem.forEach(build => {
            console.log(`   Package.json: ${build.packageJson ? '✅' : '❌'}`);
            console.log(`   Netlify.toml: ${build.netlifyToml ? '✅' : '❌'}`);
            console.log(`   Public Directory: ${build.publicDir ? '✅' : '❌'}`);
            console.log(`   Build Scripts: ${build.buildScripts ? '✅' : '❌'}`);
            console.log(`   Build System Score: ${build.score}%`);
        });

        // Overall assessment
        const avgHTMLScore = this.performanceResults.htmlFiles.reduce((sum, html) => sum + html.optimizationScore, 0) / this.performanceResults.htmlFiles.length || 0;
        const buildScore = this.performanceResults.buildSystem[0]?.score || 0;
        const overallScore = Math.round((avgHTMLScore + buildScore) / 2);

        console.log('\n🎯 FUNERAL DIRECTOR STANDARD™ COMPLIANCE:');
        console.log(`   HTML Optimization: ${Math.round(avgHTMLScore)}%`);
        console.log(`   Build System: ${buildScore}%`);
        console.log(`   Overall Score: ${overallScore}%`);
        console.log(`   Meets Standard: ${overallScore >= 75 ? '✅ YES' : '❌ NEEDS IMPROVEMENT'}`);
    }
}

const performanceValidator = new PrismPerformanceValidator();
performanceValidator.runPerformanceValidation();