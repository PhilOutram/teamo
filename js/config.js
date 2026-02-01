// Hockey Fixtures Configuration
// Edit this file to customize your teams and settings

const CONFIG = {
    // Team Information
    // The feed files are automatically fetched by GitHub Actions every 6 hours
    teams: [
        { name: "M4",  file: "feeds/feed1.ics", icon: "M4"  },
        { name: "M5P", file: "feeds/feed2.ics", icon: "M5P" },
        { name: "M5R", file: "feeds/feed3.ics", icon: "M5R" },
        { name: "M7",  file: "feeds/feed4.ics", icon: "M7"  },
        { name: "U14", file: "feeds/feed5.ics", icon: "U14" },
        { name: "U16", file: "feeds/feed6.ics", icon: "U16" },
    ],
    
    // Email Configuration (Optional)
    // Sign up at emailjs.com for free email service
    email: {
        enabled: true,  // Set to true after configuring EmailJS
        serviceId: 'service_o8b47y7',
        templateId: 'template_inxi2hd',
        userId: 'xptDbUUJb9PYrgzAa',
        recipientEmail: 'phil_outram@hotmail.com'
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
