// ==================== STATE MANAGEMENT ====================
const state = {
    topic: '',
    platform: 'tiktok',
    scripts: [],
    currentScriptIndex: 0,
    paymentComplete: false
};

// ==================== DOM ELEMENTS ====================
const elements = {
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

// ==================== UTILITY FUNCTIONS ====================
function scrollToGenerator() {
    const generatorSection = document.getElementById('generator');
    if (generatorSection) {
        generatorSection.scrollIntoView({ behavior: 'smooth' });
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
    const topic = elements.topicInput.value.trim();
    const platform = elements.platformSelect.value;
    
    if (!topic) {
        alert('Please enter a topic');
        return;
    }
    
    // Update state
    state.topic = topic;
    state.platform = platform;
    state.currentScriptIndex = 0;
    
    // Show loading state
    elements.scriptContainer.classList.remove('hidden');
    elements.scriptDisplay.innerHTML = '<div class="loading">Generating scripts...</div>';
    
    // Generate mock scripts (in real app, this would be an API call)
    setTimeout(() => {
        generateMockScripts();
        displayCurrentScript();
        updateNavigationButtons();
        
        // Scroll to scripts
        elements.scriptContainer.scrollIntoView({ behavior: 'smooth' });
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
        elements.scriptDisplay.innerHTML = '<div class="error">No scripts generated yet.</div>';
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
    
    // Mark payment as complete (in real app, this would redirect to Stripe)
    state.paymentComplete = true;
    
    // Show success message
    alert('Payment successful! You now have full access to all scripts.');
    
    // Enable all features (in a real app, this would unlock premium features)
    document.querySelectorAll('.premium-feature').forEach(feature => {
        feature.classList.remove('locked');
        feature.classList.add('unlocked');
    });
    
    // Scroll back to scripts
    elements.scriptContainer.scrollIntoView({ behavior: 'smooth' });
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements if they exist
    if (elements.generateBtn) {
        elements.generateBtn.addEventListener('click', generateScripts);
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
        elements.freeTrialBtn.addEventListener('click', function() {
            // Fixed Stripe URL - removed double "https"
            const stripeUrl = 'https://www.stripe.com/test_6ou00kginbN30ldgo2gA800';
            window.open(stripeUrl, '_blank');
        });
    }
    
    // Initialize with a default if needed
    if (elements.topicInput && !elements.topicInput.value) {
        elements.topicInput.value = 'fitness tips';
    }
    
    // Check for existing scripts
    if (state.scripts.length > 0) {
        displayCurrentScript();
        updateNavigationButtons();
    }
});

// ==================== GLOBAL EXPORTS ====================
// Make functions available globally for onclick handlers
window.scrollToGenerator = scrollToGenerator;
window.generateScripts = generateScripts;
window.nextScript = nextScript;
window.prevScript = prevScript;
window.initPayment = initPayment;
window.generateMockScripts = generateMockScripts;
window.displayFirstScript = displayFirstScript;

// ==================== INITIALIZATION ====================
// Auto-generate if there's a topic in the input on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (elements.topicInput && elements.topicInput.value) {
            setTimeout(generateScripts, 500);
        }
    });
} else {
    if (elements.topicInput && elements.topicInput.value) {
        setTimeout(generateScripts, 500);
    }
}

console.log('Script Generator loaded successfully');
