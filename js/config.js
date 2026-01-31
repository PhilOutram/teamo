// Hockey Fixtures Configuration
// Edit this file to customize your teams and settings

const CONFIG = {
    // Team Information
    // Replace with your actual iCal feed URLs from Teamo
    teams: [
        {
            name: "M4",
            url: "https://web.teamo.chat/ical/iscahc/16150401/4th-XI-MenCalendar_matches.ics?noCache65",
            icon: "M4"
        },
        {
            name: "M5P",
            url: "https://web.teamo.chat/ical/iscahc/16150402/5P-XI-MenCalendar_matches.ics?noCache21",
            icon: "M5P"
        },
        {
            name: "M5R",
            url: "https://web.teamo.chat/ical/iscahc/16150403/5R-XI-MenCalendar_matches.ics?noCache43",
            icon: "M5R"
        },
        {
            name: "M7",
            url: "https://web.teamo.chat/ical/iscahc/16150404/7th-XI-MenCalendar_matches.ics?noCache70",
            icon: "M7"
        },
        {
            name: "U14",
            url: "https://web.teamo.chat/ical/iscahc/16150374/Boys-U14Calendar_matches.ics?noCache89",
            icon: "U14"
        },
        {
            name: "U16",
            url: "https://web.teamo.chat/ical/iscahc/16150375/Boys-U16Calendar_matches.ics?noCache6",
            icon: "U16"
        },
    ],
    
    // Email Configuration (Optional)
    // Sign up at emailjs.com for free email service
    email: {
        enabled: false,  // Set to true after configuring EmailJS
        serviceId: 'YOUR_SERVICE_ID',
        templateId: 'YOUR_TEMPLATE_ID',
        userId: 'YOUR_USER_ID',
        recipientEmail: 'your-email@example.com'
    },
    
    // Display Settings
    display: {
        // Show loading spinner
        showLoadingSpinner: true,
        
        // Maximum number of fixtures to show per team
        maxFixturesPerTeam: 10,
        
        // Date format locale
        locale: 'en-GB'  // British format (DD/MM/YYYY, 24-hour time)
    }
};
