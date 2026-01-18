// ==================== STATE MANAGEMENT ====================
const state = {
    topic: '',
    platform: 'tiktok',
    scripts: [],
    currentScriptIndex: 0,
    paymentComplete: false
};

// ==================== DOM ELEMENTS ====================
let elements = {};

function initializeElements() {
    elements = {
        topicInput: document.getElementById('topicInput'),
        platformSelect: document.getElementById('platformSelect'),
        scriptContainer: document.getElementById('scriptContainer'),
        generateBtn: document.getElementById('generateBtn'),
        scriptDisplay: document.getElementById('scriptDisplay'),
        scriptTitle: document.getElementById('scriptTitle'),
        scriptContent: document.getElementById('scriptContent'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        scriptCounter: document.getElementById('scriptCounter'),
        paymentSection: document.getElementById('paymentSection'),
        freeTrialBtn: document.getElementById('freeTrialBtn'),
        scriptCount: document.getElementById('scriptCount')
    };
    
    // Debug: Log missing elements
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.warn(`Element ${key} not found in DOM`);
        }
    }
}

// ==================== UTILITY FUNCTIONS ====================
function scrollToGenerator() {
    const generatorSection = document.getElementById('generator');
    if (generatorSection) {
        generatorSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.warn('Generator section not found');
    }
}

function scrollToPayment() {
    const paymentSection = document.getElementById('paymentSection');
    if (paymentSection) {
        paymentSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ADDED THIS FUNCTION - FIXES YOUR ERROR!
function setTopic(topic) {
    if (elements.topicInput) {
        elements.topicInput.value = topic;
        // Auto-generate if there's already a topic
        if (topic.trim()) {
            generateScripts();
        }
    } else {
        // Fallback if elements not initialized
        const input = document.getElementById('topicInput');
        if (input) {
            input.value = topic;
            if (topic.trim()) {
                setTimeout(generateScripts, 100);
            }
        }
    }
}

// ==================== SCRIPT GENERATION ====================
function generateScripts() {
    // Make sure elements are initialized
    if (!elements.topicInput || !elements.topicInput.value) {
        initializeElements();
    }
    
    // Check if topicInput exists
    if (!elements.topicInput) {
        console.error('Topic input element not found');
        // Create one if it doesn't exist (fallback)
        const existingInput = document.getElementById('topicInput');
        if (existingInput) {
            elements.topicInput = existingInput;
        } else {
            alert('Error: Topic input field not found on page');
            return;
        }
    }
    
    const topic = elements.topicInput.value.trim();
    const platform = elements.platformSelect ? elements.platformSelect.value : 'tiktok';
    
    if (!topic) {
        alert('Please enter a topic');
        return;
    }
    
    console.log(`Generating scripts for topic: "${topic}" on platform: ${platform}`);
    
    // Update state
    state.topic = topic;
    state.platform = platform;
    state.currentScriptIndex = 0;
    
    // Show loading state
    if (elements.scriptContainer) {
        elements.scriptContainer.classList.remove('hidden');
        elements.scriptContainer.style.display = 'block';
    }
    
    if (elements.scriptDisplay) {
        elements.scriptDisplay.innerHTML = '<div class="loading">Generating scripts... Please wait</div>';
    }
    
    // Generate mock scripts immediately (no backend needed for testing)
    generateMockScripts();
    
    // Display the first script
    if (state.scripts.length > 0) {
        displayCurrentScript();
        updateNavigationButtons();
        
        // Scroll to scripts
        setTimeout(() => {
            if (elements.scriptContainer) {
                elements.scriptContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    }
}

function generateMockScripts() {
    console.log(`Generating mock scripts for: ${state.topic}`);
    
    const platforms = {
        tiktok: [
            `🎯 HOOK: "Struggling with ${state.topic}? Here's 3 secrets nobody tells you!"\n\n📌 POINT 1: Start with small, manageable steps\n📌 POINT 2: Consistency beats intensity every time\n📌 POINT 3: Track your progress visually\n\n👉 CTA: "Like for part 2 where I reveal the advanced techniques! #${state.topic.replace(/\s+/g, '')} #tips"`,
            
            `🔥 TREND HOOK: "POV: You're trying to master ${state.topic} but missing this one thing"\n\n💡 THE SECRET: It's not about working harder, but working smarter\n📊 EXAMPLE: "Instead of 2 hours daily, try 25 mins of focused practice"\n🎯 RESULT: "I went from beginner to pro in just 30 days"\n\n👉 CTA: "Save this for when you need motivation! #${state.topic.replace(/\s+/g, '')} #growth"`
        ],
        youtube: [
            `🎬 INTRO: "Welcome back! Today we're diving deep into ${state.topic}. If you want to master this, stay till the end because I'm sharing my exact framework!"\n\n📚 CHAPTER 1: The Foundation\n• Why most people fail at ${state.topic}\n• The 3 pillars you MUST understand\n\n🎯 CHAPTER 2: Practical Steps\n• Step-by-step process (beginner to advanced)\n• Common mistakes to avoid\n\n🚀 CHAPTER 3: Advanced Techniques\n• How to get 10x results\n• Tools and resources I recommend\n\n👍 OUTRO: "If you found this helpful, smash that like button and subscribe for more ${state.topic} content every week!"`,
            
            `📢 OPENING: "This ONE strategy for ${state.topic} changed everything for me..."\n\n⏰ TIMESTAMPS:\n0:00 - The big mistake everyone makes\n1:30 - My personal journey with ${state.topic}\n3:45 - The exact system I use\n6:20 - How to implement today\n8:00 - Q&A (your questions answered)\n\n💎 KEY TAKEAWAY: "Quality over quantity always wins with ${state.topic}"\n\n🔔 SUBSCRIBE: "Turn on notifications so you don't miss part 2!"`
        ],
        instagram: [
            `✨ CAPTION: "Your daily dose of ${state.topic} wisdom! ✨\n\n📌 Save this post for when you need motivation!\n\n1️⃣ First things first: START.\nDon't wait for perfect conditions.\n\n2️⃣ Progress > Perfection\nSmall consistent steps beat occasional giant leaps.\n\n3️⃣ Celebrate tiny wins\nThey add up to massive results!\n\n👇 Drop a ♥️ if you agree!\n\n#${state.topic.replace(/\s+/g, '')} #motivation #selfimprovement #growthmindset"`,
            
            `🏆 CAPTION: "Level up your ${state.topic} game with these 5 tips:\n\n1. Morning routine alignment\n2. 80/20 principle focus\n3. Consistent tracking\n4. Community accountability\n5. Regular reflection\n\n💭 Which one will you try first? Comment below!\n\n👉 Share with someone who needs this!\n\n📲 Follow for daily inspiration\n\n#${state.topic.replace(/\s+/g, '')} #success #productivity #lifecoach"`
        ]
    };
    
    const platformScripts = platforms[state.platform] || platforms.tiktok;
    state.scripts = platformScripts.map((script, index) => ({
        id: index + 1,
        title: `${state.topic} - Script ${index + 1} (${state.platform})`,
        content: script,
        platform: state.platform
    }));
    
    console.log(`Generated ${state.scripts.length} scripts for ${state.platform}`);
    
    // Update script count
    if (elements.scriptCount) {
        elements.scriptCount.textContent = `(${state.scripts.length} scripts generated)`;
    }
}

// ==================== SCRIPT DISPLAY ====================
function displayCurrentScript() {
    if (state.scripts.length === 0) {
        if (elements.scriptDisplay) {
            elements.scriptDisplay.innerHTML = '<div class="error">No scripts generated yet. Click "Generate Scripts" first.</div>';
        }
        return;
    }
    
    const script = state.scripts[state.currentScriptIndex];
    
    if (elements.scriptTitle) {
        elements.scriptTitle.textContent = script.title;
    }
    
    if (elements.scriptContent) {
        elements.scriptContent.textContent = script.content;
        elements.scriptContent.style.whiteSpace = 'pre-line'; // Preserve line breaks
    }
    
    if (elements.scriptCounter) {
        elements.scriptCounter.textContent = `${state.currentScriptIndex + 1}/${state.scripts.length}`;
    }
    
    console.log(`Displaying script ${state.currentScriptIndex + 1} of ${state.scripts.length}`);
}

function displayFirstScript() {
    state.currentScriptIndex = 0;
    displayCurrentScript();
    updateNavigationButtons();
}

function nextScript() {
    if (state.currentScriptIndex < state.scripts.length - 1) {
        state.currentScriptIndex++;
        displayCurrentScript();
        updateNavigationButtons();
    }
}

function prevScript() {
    if (state.currentScriptIndex > 0) {
        state.currentScriptIndex--;
        displayCurrentScript();
        updateNavigationButtons();
    }
}

function updateNavigationButtons() {
    if (elements.prevBtn && elements.nextBtn) {
        elements.prevBtn.disabled = state.currentScriptIndex === 0;
        elements.nextBtn.disabled = state.currentScriptIndex === state.scripts.length - 1;
    }
}

// ==================== PAYMENT FUNCTIONS ====================
function processPayment() {
    // Fixed Stripe URL
    const stripeUrl = 'https://buy.stripe.com/test_6oU00kginbN30ldgo2gA800';
    console.log('Opening payment URL:', stripeUrl);
    
    // Open in new tab
    window.open(stripeUrl, '_blank');
    
    // Simulate payment success after delay
    setTimeout(() => {
        initPayment();
    }, 2000);
}

function initPayment() {
    // Check if scripts are generated
    if (state.scripts.length === 0) {
        alert('Please generate scripts first');
        scrollToGenerator();
        return;
    }
    
    // Mark payment as complete
    state.paymentComplete = true;
    
    // Show success message
    alert('✅ Payment successful! You now have full access to all scripts.');
    
    // Enable premium features
    document.querySelectorAll('.premium-feature').forEach(feature => {
        feature.classList.remove('locked');
        feature.classList.add('unlocked');
    });
    
    console.log('Payment processed successfully');
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    initializeElements();
    
    // Generate button
    if (elements.generateBtn) {
        elements.generateBtn.addEventListener('click', generateScripts);
        console.log('Generate button found and listener added');
    } else {
        console.error('Generate button not found!');
    }
    
    // Enter key on topic input
    if (elements.topicInput) {
        elements.topicInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateScripts();
            }
        });
    }
    
    // Platform change
    if (elements.platformSelect) {
        elements.platformSelect.addEventListener('change', function() {
            if (state.topic && state.scripts.length > 0) {
                generateScripts();
            }
        });
    }
    
    // Navigation buttons
    if (elements.nextBtn) {
        elements.nextBtn.addEventListener('click', nextScript);
    }
    
    if (elements.prevBtn) {
        elements.prevBtn.addEventListener('click', prevScript);
    }
    
    // Payment button
    if (elements.freeTrialBtn) {
        elements.freeTrialBtn.addEventListener('click', processPayment);
    }
    
    // Set default topic for testing
    if (elements.topicInput && !elements.topicInput.value) {
        elements.topicInput.value = 'fitness tips';
        elements.topicInput.placeholder = 'e.g., fitness tips, digital marketing, cooking';
    }
}

// ==================== GLOBAL EXPORTS ====================
// Make ALL functions available globally for onclick handlers
window.scrollToGenerator = scrollToGenerator;
window.generateScripts = generateScripts;
window.nextScript = nextScript;
window.prevScript = prevScript;
window.initPayment = initPayment;
window.processPayment = processPayment;
window.generateMockScripts = generateMockScripts;
window.displayFirstScript = displayFirstScript;
window.setTopic = setTopic; // THIS WAS MISSING!

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, setting up script generator...');
    setupEventListeners();
    
    // Auto-generate if there's a topic in the input
    setTimeout(() => {
        if (elements.topicInput && elements.topicInput.value.trim()) {
            console.log('Auto-generating scripts for initial topic...');
            generateScripts();
        }
    }, 500);
});

// Fallback initialization
if (document.readyState !== 'loading') {
    setTimeout(() => {
        setupEventListeners();
    }, 100);
}

console.log('✅ Script Generator loaded successfully');
