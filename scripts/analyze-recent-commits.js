const { execSync } = require('child_process');
const fs = require('fs');

function analyzeRecentCommits() {
    console.log('🔍 ANALYZING RECENT COMMITS');
    console.log('===========================\n');

    try {
        // Get recent commits with detailed information
        const gitLog = execSync('git log --oneline -10 --stat', { encoding: 'utf8' });
        const commits = parseCommitLog(gitLog);

        console.log('📊 RECENT COMMIT ANALYSIS:');
        console.log('==========================\n');

        commits.forEach((commit, index) => {
            console.log(`${index + 1}. ${commit.hash} - ${commit.message}`);
            console.log(`   Date: ${commit.date}`);
            console.log(`   Files changed: ${commit.filesChanged}`);
            console.log(`   Insertions: ${commit.insertions}, Deletions: ${commit.deletions}`);

            // Identify emergency fix patterns
            const isEmergencyFix = identifyEmergencyFix(commit);
            if (isEmergencyFix.isEmergency) {
                console.log(`   🚨 EMERGENCY FIX: ${isEmergencyFix.reason}`);
            }

            console.log('');
        });

        // Generate reversion recommendations
        const reversionStrategy = generateReversionStrategy(commits);
        console.log('📋 REVERSION STRATEGY:');
        console.log('=====================\n');

        reversionStrategy.forEach((recommendation, index) => {
            console.log(`${index + 1}. ${recommendation.action}`);
            console.log(`   Commit: ${recommendation.commit}`);
            console.log(`   Reason: ${recommendation.reason}`);
            console.log(`   Risk: ${recommendation.risk}`);
            console.log('');
        });

        // Show files most affected
        const fileAnalysis = analyzeFileChanges(commits);
        console.log('📁 MOST AFFECTED FILES:');
        console.log('======================\n');

        Object.entries(fileAnalysis)
            .sort(([,a], [,b]) => b.changeCount - a.changeCount)
            .slice(0, 10)
            .forEach(([file, data]) => {
                console.log(`${file}: ${data.changeCount} changes across ${data.commits.length} commits`);
            });

        return {
            commits,
            reversionStrategy,
            fileAnalysis
        };

    } catch (error) {
        console.error('❌ Error analyzing commits:', error.message);
        return null;
    }
}

function parseCommitLog(gitLog) {
    const lines = gitLog.split('\n');
    const commits = [];
    let currentCommit = null;

    lines.forEach(line => {
        // Parse commit line (hash and message)
        const commitMatch = line.match(/^([a-f0-9]+)\s+(.+)$/);
        if (commitMatch) {
            if (currentCommit) {
                commits.push(currentCommit);
            }
            currentCommit = {
                hash: commitMatch[1],
                message: commitMatch[2],
                date: '',
                filesChanged: 0,
                insertions: 0,
                deletions: 0,
                files: []
            };
        }

        // Parse file changes
        const fileMatch = line.match(/^\s+(.+?)\s+\|\s+(\d+)\s+([+\-]+)$/);
        if (fileMatch && currentCommit) {
            currentCommit.files.push({
                name: fileMatch[1],
                changes: parseInt(fileMatch[2]),
                pattern: fileMatch[3]
            });
        }

        // Parse summary line
        const summaryMatch = line.match(/^\s+(\d+)\s+files?\s+changed(?:,\s+(\d+)\s+insertions?)?(?:,\s+(\d+)\s+deletions?)?/);
        if (summaryMatch && currentCommit) {
            currentCommit.filesChanged = parseInt(summaryMatch[1]);
            currentCommit.insertions = parseInt(summaryMatch[2]) || 0;
            currentCommit.deletions = parseInt(summaryMatch[3]) || 0;
        }
    });

    if (currentCommit) {
        commits.push(currentCommit);
    }

    return commits;
}

function identifyEmergencyFix(commit) {
    const message = commit.message.toLowerCase();
    const emergencyPatterns = [
        { pattern: /emergency|urgent|critical|fix|repair/i, reason: 'Emergency keywords in message' },
        { pattern: /🚨|⚡|🔧|🛠️/i, reason: 'Emergency emojis used' },
        { pattern: /navigation.*fix|fix.*navigation/i, reason: 'Navigation fix detected' },
        { pattern: /restore|revert|rollback/i, reason: 'Restoration/revert operation' }
    ];

    // Check for high file change count (potential emergency cleanup)
    const highFileCount = commit.filesChanged > 50;
    const highInsertions = commit.insertions > 10000;

    for (const { pattern, reason } of emergencyPatterns) {
        if (pattern.test(commit.message)) {
            return { isEmergency: true, reason };
        }
    }

    if (highFileCount || highInsertions) {
        return {
            isEmergency: true,
            reason: `Large change set: ${commit.filesChanged} files, ${commit.insertions} insertions`
        };
    }

    return { isEmergency: false };
}

function generateReversionStrategy(commits) {
    const strategy = [];

    commits.forEach((commit, index) => {
        const emergencyAnalysis = identifyEmergencyFix(commit);

        if (emergencyAnalysis.isEmergency) {
            if (commit.message.includes('EMERGENCY FIX') || commit.message.includes('🚨')) {
                strategy.push({
                    action: 'CONSIDER REVERTING',
                    commit: `${commit.hash} - ${commit.message}`,
                    reason: 'Emergency fix that may have introduced issues',
                    risk: 'HIGH - May break current functionality'
                });
            } else if (commit.filesChanged > 100) {
                strategy.push({
                    action: 'REVIEW CAREFULLY',
                    commit: `${commit.hash} - ${commit.message}`,
                    reason: 'Large-scale changes that may be problematic',
                    risk: 'MEDIUM - Check for unintended side effects'
                });
            }
        } else if (commit.message.includes('CONSOLIDATION') || commit.message.includes('SYSTEMATIC')) {
            strategy.push({
                action: 'KEEP - PLANNED CHANGE',
                commit: `${commit.hash} - ${commit.message}`,
                reason: 'Systematic improvement with clear purpose',
                risk: 'LOW - Appears to be intentional enhancement'
            });
        } else {
            strategy.push({
                action: 'REVIEW',
                commit: `${commit.hash} - ${commit.message}`,
                reason: 'Standard commit - evaluate based on current issues',
                risk: 'LOW - Normal development activity'
            });
        }
    });

    return strategy;
}

function analyzeFileChanges(commits) {
    const fileAnalysis = {};

    commits.forEach(commit => {
        commit.files.forEach(file => {
            if (!fileAnalysis[file.name]) {
                fileAnalysis[file.name] = {
                    changeCount: 0,
                    commits: []
                };
            }
            fileAnalysis[file.name].changeCount += file.changes;
            fileAnalysis[file.name].commits.push(commit.hash);
        });
    });

    return fileAnalysis;
}

// Run analysis and save results
const analysis = analyzeRecentCommits();

if (analysis) {
    // Save detailed analysis to file
    const report = {
        timestamp: new Date().toISOString(),
        analysis: analysis,
        summary: {
            totalCommits: analysis.commits.length,
            emergencyFixes: analysis.commits.filter(c => identifyEmergencyFix(c).isEmergency).length,
            recommendedReversions: analysis.reversionStrategy.filter(r => r.action.includes('REVERT')).length
        }
    };

    fs.writeFileSync('commit-analysis-report.json', JSON.stringify(report, null, 2));
    console.log('📋 Detailed analysis saved to: commit-analysis-report.json');
}