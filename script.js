// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation clicks
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize n8n chat automatically
    let chatInitialized = false;
    
    // Initialize chat after a short delay to ensure page is fully loaded
    setTimeout(() => {
        if (!chatInitialized) {
            initializeN8nChat();
            chatInitialized = true;
        }
    }, 1000);

    // Header background change on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    const sections = document.querySelectorAll('.about, .services, .contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Function to initialize n8n chat
async function initializeN8nChat() {
    try {
        // Dynamically import the n8n chat module
        const { createChat } = await import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js');
        
        // Create the chat widget
        createChat({
            webhookUrl: 'https://haniahmad.app.n8n.cloud/webhook/37519ab1-97a9-4fa2-b5e5-c42b95e8b74e/chat',
            initialMessages: [
                'Hi, I\'m Muhammad! Welcome to Dr. Rebaz Dental Clinic. How can I help you today?'
            ],
            // Optional: Customize the chat appearance
            theme: {
                primaryColor: '#2c5aa0',
                textColor: '#333333',
                backgroundColor: '#ffffff'
            },
            // Position the chat icon in the custom location
            target: '#chatIconContainer'
        });
        
        console.log('N8n chat initialized successfully');
    } catch (error) {
        console.error('Error initializing n8n chat:', error);
        // Fallback message
        alert('Chat service is temporarily unavailable. Please call us directly or use the online booking form.');
    }
}
