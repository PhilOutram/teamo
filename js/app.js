// Hockey Fixtures Dashboard JavaScript
// Configuration is loaded from config.js

// Get configuration from config.js
const TEAMS = CONFIG.teams;
const EMAILJS_CONFIG = CONFIG.email;

let fixturesData = [];
let weekendOffset = 0; // 0 = next weekend, -1 = previous, +1 = weekend after next

// Calculate weekend based on offset (Saturday and Sunday)
function getNextWeekend() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Days until next Saturday (6 = Saturday)
    let daysUntilSaturday;
    if (dayOfWeek === 0) { // Sunday
        daysUntilSaturday = 6;
    } else if (dayOfWeek === 6) { // Saturday - use today
        daysUntilSaturday = 0;
    } else { // Monday-Friday
        daysUntilSaturday = 6 - dayOfWeek;
    }
    
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + daysUntilSaturday + (weekendOffset * 7));
    saturday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);
    
    const mondayMorning = new Date(sunday);
    mondayMorning.setDate(sunday.getDate() + 1);
    
    return { saturday, sunday, mondayMorning };
}

// Navigate to previous or next weekend
function navigateWeekend(direction) {
    weekendOffset += direction;
    loadFixtures();
}

// Format date for display
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

// Format date range compactly for header
function formatDateRange(startDate, endDate) {
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const month = startDate.toLocaleDateString('en-GB', { month: 'short' });
    const year = startDate.getFullYear();
    
    // If same month
    if (startDate.getMonth() === endDate.getMonth()) {
        return `${startDay}-${endDay} ${month} ${year}`;
    } else {
        const endMonth = endDate.toLocaleDateString('en-GB', { month: 'short' });
        return `${startDay} ${month} - ${endDay} ${endMonth} ${year}`;
    }
}

// Format time for display
function formatTime(date) {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// Format date compactly for fixtures (just day of week)
function formatFixtureDate(date) {
    const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
    const day = date.getDate();
    return `${dayName} ${day}`;
}

// Parse iCal data
function parseICS(icsText) {
    const events = [];
    const lines = icsText.split('\n').map(line => line.trim());
    
    let currentEvent = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line === 'BEGIN:VEVENT') {
            currentEvent = {};
        } else if (line === 'END:VEVENT' && currentEvent) {
            if (currentEvent.dtstart) {
                events.push(currentEvent);
            }
            currentEvent = null;
        } else if (currentEvent) {
            if (line.startsWith('DTSTART')) {
                const dateStr = line.split(':')[1];
                currentEvent.dtstart = parseICSDate(dateStr);
            } else if (line.startsWith('SUMMARY:')) {
                currentEvent.summary = line.substring(8);
            } else if (line.startsWith('LOCATION:')) {
                currentEvent.location = line.substring(9);
            } else if (line.startsWith('DESCRIPTION:')) {
                currentEvent.description = line.substring(12);
            }
        }
    }
    
    return events;
}

// Parse ICS date format
function parseICSDate(dateStr) {
    // Format: YYYYMMDDTHHMMSS or YYYYMMDD
    dateStr = dateStr.replace(/[Z]/g, '');
    
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    
    if (dateStr.length > 8) {
        const hour = parseInt(dateStr.substring(9, 11));
        const minute = parseInt(dateStr.substring(11, 13));
        return new Date(year, month, day, hour, minute);
    }
    
    return new Date(year, month, day);
}

// Extract opponent from summary
function extractOpponent(summary, teamName) {
    // Common patterns: "Team A vs Team B", "Team A v Team B", "vs Team B"
    const patterns = [
        /vs\.?\s+(.+?)$/i,
        /v\s+(.+?)$/i,
        /-\s*(.+?)$/,
        /against\s+(.+?)$/i
    ];
    
    for (const pattern of patterns) {
        const match = summary.match(pattern);
        if (match) {
            return match[1].trim();
        }
    }
    
    return summary;
}

// Load fixtures from all teams
async function loadFixtures() {
    const contentDiv = document.getElementById('content');
    const messageDiv = document.getElementById('message');
    const refreshBtn = document.getElementById('refreshBtn');
    const emailBtn = document.getElementById('emailBtn');
    
    contentDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading fixtures...</p></div>';
    messageDiv.innerHTML = '';
    refreshBtn.disabled = true;
    emailBtn.disabled = true;
    
    const weekend = getNextWeekend();
    document.getElementById('weekendDate').textContent = 
        formatDateRange(weekend.saturday, weekend.sunday);
    
    fixturesData = [];
    
    try {
        for (const team of TEAMS) {
            try {
                // Using CORS proxy for development - replace with direct URL if CORS is enabled
                const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(team.url)}`;
                const response = await fetch(proxyUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const icsText = await response.text();
                const events = parseICS(icsText);
                
                // Filter for next weekend
                const weekendEvents = events.filter(event => {
                    return event.dtstart >= weekend.saturday && 
                           event.dtstart < weekend.mondayMorning;
                });
                
                // Sort by date/time
                weekendEvents.sort((a, b) => a.dtstart - b.dtstart);
                
                fixturesData.push({
                    team: team,
                    fixtures: weekendEvents
                });
            } catch (error) {
                console.error(`Error loading fixtures for ${team.name}:`, error);
                fixturesData.push({
                    team: team,
                    fixtures: [],
                    error: error.message
                });
            }
        }
        
        displayFixtures();
        emailBtn.disabled = false;
        
    } catch (error) {
        messageDiv.innerHTML = `<div class="error">Error loading fixtures: ${error.message}</div>`;
        contentDiv.innerHTML = '';
    } finally {
        refreshBtn.disabled = false;
    }
}

// Display fixtures
function displayFixtures() {
    const contentDiv = document.getElementById('content');
    const messageDiv = document.getElementById('message');
    
    let html = '<div class="fixtures-grid">';
    let totalFixtures = 0;
    
    for (const teamData of fixturesData) {
        html += `
            <div class="team-section">
                <div class="team-header">
                    <div class="team-icon">${teamData.team.icon}</div>
                    <div class="team-name">${teamData.team.name}</div>
                </div>
        `;
        
        if (teamData.error) {
            html += `<div class="no-fixtures">⚠️ Error loading fixtures: ${teamData.error}</div>`;
        } else if (teamData.fixtures.length === 0) {
            html += '<div class="no-fixtures">No fixtures this weekend</div>';
        } else {
            totalFixtures += teamData.fixtures.length;
            
            for (const fixture of teamData.fixtures) {
                const opponent = extractOpponent(fixture.summary, teamData.team.name);
                
                html += `
                    <div class="fixture">
                        <div class="fixture-date">${formatFixtureDate(fixture.dtstart)} ⏰ ${formatTime(fixture.dtstart)}</div>
                        <div class="fixture-opponent">🏒 ${opponent}</div>
                        ${fixture.location ? `<div class="fixture-venue">📍 ${fixture.location}</div>` : ''}
                    </div>
                `;
            }
        }
        
        html += '</div>';
    }
    
    html += '</div>';
    contentDiv.innerHTML = html;
    
    if (totalFixtures === 0) {
        messageDiv.innerHTML = '<div class="success">✅ All fixtures loaded - no games this weekend!</div>';
    } else {
        messageDiv.innerHTML = `<div class="success">✅ Loaded ${totalFixtures} fixture${totalFixtures !== 1 ? 's' : ''}</div>`;
    }
}

// Send email summary
function sendEmail() {
    // This is a placeholder - you'll need to implement EmailJS or similar
    alert('Email functionality requires EmailJS setup. See README for instructions.');
    
    // Example EmailJS implementation (uncomment after configuration):
    /*
    const weekend = getNextWeekend();
    let emailBody = `Hockey Fixtures for ${formatDate(weekend.saturday)} - ${formatDate(weekend.sunday)}\n\n`;
    
    for (const teamData of fixturesData) {
        emailBody += `${teamData.team.name}:\n`;
        if (teamData.fixtures.length === 0) {
            emailBody += '  No fixtures\n\n';
        } else {
            for (const fixture of teamData.fixtures) {
                emailBody += `  ${formatDate(fixture.dtstart)} ${formatTime(fixture.dtstart)}\n`;
                emailBody += `  ${extractOpponent(fixture.summary, teamData.team.name)}\n`;
                if (fixture.location) emailBody += `  ${fixture.location}\n`;
                emailBody += '\n';
            }
        }
    }
    
    emailBody += `View full details: ${window.location.href}`;
    
    emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
            to_email: EMAILJS_CONFIG.recipientEmail,
            message: emailBody,
            link: window.location.href
        },
        EMAILJS_CONFIG.userId
    ).then(() => {
        alert('Email sent successfully!');
    }).catch(error => {
        alert('Error sending email: ' + error.message);
    });
    */
}

// Load fixtures on page load
window.addEventListener('load', loadFixtures);
