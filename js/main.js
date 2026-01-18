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
    
    // Log any missing elements for debugging
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

// ==================== SCRIPT GENERATION ====================
function generateScripts() {
    // Make sure elements are initialized
    if (!elements.topicInput) {
        initializeElements();
    }
    
    // Check if topicInput exists
    if (!elements.topicInput) {
        console.error('Topic input element not found');
        alert('Error: Topic input field not found on page');
        return;
    }
    
    const topic = elements.topicInput.value.trim();
    const platform = elements.platformSelect ? elements.platformSelect.value : 'tiktok';
    
    if (!topic) {
        alert('Please enter a topic');
        return;
    }
    
    // Update state
    state.topic = topic;
    state.platform = platform;
    state.currentScriptIndex = 0;
    
    // Show loading state
    if (elements.scriptContainer) {
        elements.scriptContainer.classList.remove('hidden');
    }
    
    if (elements.scriptDisplay) {
        elements.scriptDisplay.innerHTML = '<div class="loading">Generating scripts...</div>';
    }
    
    // Generate mock scripts
    setTimeout(() => {
        generateMockScripts();
        displayCurrentScript();
        updateNavigationButtons();
        
        // Scroll to scripts
        if (elements.scriptContainer) {
            elements.scriptContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }, 1000);
}

function generateMockScripts() {
    const platforms = {
        tiktok: [
            "Hook: Struggling with {topic}? Here's 3 secrets nobody tells you!",
            "Problem: Most people get {topic} wrong because they focus on the wrong things",
            "Solution: Try this simple method that takes just 5 minutes a day",
            "CTA: Like for part 2 where I reveal the advanced techniques! #{topic} #tips"
        ],
        youtube: [
            "Intro: Today we're diving deep into {topic}. If you want to master this, stay till the end!",
            "Key Point 1: The foundation of good {topic} starts with proper planning",
            "Key Point 2: Avoid these 3 common mistakes that beginners make",
            "Key Point 3: Advanced techniques that will take your {topic} to the next level",
            "Outro: If you found this helpful, subscribe for more content on {topic}!"
        ],
        instagram: [
            "Caption: Your daily dose of {topic} wisdom! ✨",
            "Tip 1: Quality over quantity always wins with {topic}",
            "Tip 2: Consistency is more important than perfection",
            "Tip 3: Track your progress to stay motivated",
            "Hashtags: #{topic} #motivation #selfimprovement"
        ]
    };
    
    const platformScripts = platforms[state.platform] || platforms.tiktok;
    state.scripts = platformScripts.map((script, index) => ({
        id: index + 1,
        title: `${state.topic} - Script ${index + 1}`,
        content: script.replace(/{topic}/g, state.topic),
        platform: state.platform
    }));
    
    // Update script count
    if (elements.scriptCount) {
        elements.scriptCount.textContent = `(${state.scripts.length} scripts generated)`;
    }
}

// ==================== SCRIPT DISPLAY ====================
function displayCurrentScript() {
    if (state.scripts.length === 0) {
        if (elements.scriptDisplay) {
            elements.scriptDisplay.innerHTML = '<div class="error">No scripts generated yet.</div>';
        }
        return;
    }
    
    const script = state.scripts[state.currentScriptIndex];
    
    if (elements.scriptTitle) {
        elements.scriptTitle.textContent = script.title;
    }
    
    if (elements.scriptContent) {
        elements.scriptContent.textContent = script.content;
    }
    
    if (elements.scriptCounter) {
        elements.scriptCounter.textContent = `${state.currentScriptIndex + 1}/${state.scripts.length}`;
    }
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
    alert('Payment successful! You now have full access to all scripts.');
    
    // Scroll back to scripts
    if (elements.scriptContainer) {
        elements.scriptContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

function processPayment() {
    // Fixed Stripe URL - only one https://
    const stripeUrl = 'https://buy.stripe.com/test_6oU00kginbN30ldgo2gA800';
    console.log('Opening payment URL:', stripeUrl);
    window.open(stripeUrl, '_blank');
    
    // In a real app, you would handle the payment callback here
    setTimeout(() => {
        initPayment();
    }, 2000);
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    initializeElements();
    
    if (elements.generateBtn) {
        elements.generateBtn.addEventListener('click', generateScripts);
    } else {
        console.warn('Generate button not found');
    }
    
    if (elements.topicInput) {
        elements.topicInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateScripts();
            }
        });
    }
    
    if (elements.platformSelect) {
        elements.platformSelect.addEventListener('change', function() {
            if (state.topic && state.scripts.length > 0) {
                generateScripts();
            }
        });
    }
    
    if (elements.nextBtn) {
        elements.nextBtn.addEventListener('click', nextScript);
    }
    
    if (elements.prevBtn) {
        elements.prevBtn.addEventListener('click', prevScript);
    }
    
    if (elements.freeTrialBtn) {
        elements.freeTrialBtn.addEventListener('click', processPayment);
    }
    
    // Set default topic for testing
    if (elements.topicInput && !elements.topicInput.value) {
        elements.topicInput.value = 'fitness tips';
    }
}

// ==================== GLOBAL EXPORTS ====================
// Make functions available globally for onclick handlers
window.scrollToGenerator = scrollToGenerator;
window.generateScripts = generateScripts;
window.nextScript = nextScript;
window.prevScript = prevScript;
window.initPayment = initPayment;
window.processPayment = processPayment;
window.generateMockScripts = generateMockScripts;
window.displayFirstScript = displayFirstScript;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up script generator...');
    setupEventListeners();
    
    // Auto-generate if there's a topic in the input
    if (elements.topicInput && elements.topicInput.value.trim()) {
        setTimeout(generateScripts, 1000);
    }
});

// Fallback in case DOM is already loaded
if (document.readyState !== 'loading') {
    setTimeout(() => {
        setupEventListeners();
    }, 100);
}

console.log('Script Generator loaded successfully');
