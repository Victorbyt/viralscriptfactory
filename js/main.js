// ============================================
// ViralScriptFactory - COMPLETE WORKING SCRIPT
// ============================================

// Global state
let state = {
    topic: '',
    platform: 'tiktok',
    scripts: [],
    paymentLink: 'https://buy.stripe.com/4gMeVe1w730FcZZaq13wQ00'
};

// DOM Elements cache
let elements = {};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('ViralScriptFactory loaded');
    
    // Cache DOM elements
    cacheElements();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show step 1
    changeStep(1);
});

// Cache all DOM elements
function cacheElements() {
    elements = {
        topicInput: document.getElementById('topic'),
        previewScript: document.getElementById('previewScript'),
        allScripts: document.getElementById('allScripts'),
        generateButton: document.querySelector('.btn-primary'),
        unlockButton: document.querySelector('.btn-success'),
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        step4: document.getElementById('step4')
    };
    
    console.log('DOM elements cached:', Object.keys(elements).filter(k => elements[k]));
}

// Setup all event listeners
function setupEventListeners() {
    // Topic examples
    document.querySelectorAll('.example-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const topic = this.textContent.replace(/[^a-zA-Z\s]/g, '').toLowerCase();
            setTopic(topic);
        });
    });
    
    // Enter key on topic input
    if (elements.topicInput) {
        elements.topicInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                generateScripts();
            }
        });
    }
    
    // Generate button
    if (elements.generateButton) {
        elements.generateButton.addEventListener('click', generateScripts);
    }
    
    // Unlock button (if exists)
    if (elements.unlockButton) {
        elements.unlockButton.addEventListener('click', showPayment);
    }
    
    // Manual buttons for step 2
    setTimeout(() => {
        const manualUnlock = document.querySelector('.btn-success[onclick*="showPayment"]');
        const manualBack = document.querySelector('.btn-outline[onclick*="backToStep1"]');
        
        if (manualUnlock) {
            manualUnlock.addEventListener('click', showPayment);
            manualUnlock.removeAttribute('onclick');
        }
        
        if (manualBack) {
            manualBack.addEventListener('click', backToStep1);
            manualBack.removeAttribute('onclick');
        }
    }, 500);
}

// Generate 3 scripts
async function generateScripts() {
    try {
        // Get values
        const topic = elements.topicInput ? elements.topicInput.value.trim() : '';
        const platformEl = document.querySelector('input[name="platform"]:checked');
        
        if (!topic) {
            alert('Please enter a topic! For example: fitness tips, crypto news, cooking hacks');
            return;
        }
        
        // Update state
        state.topic = topic;
        state.platform = platformEl ? platformEl.value : 'tiktok';
        
        // Show loading
        showLoading();
        
        // Generate scripts (mock for now)
        setTimeout(() => {
            generateMockScripts();
            displayFirstScript();
            changeStep(2);
            hideLoading();
        }, 1200);
        
    } catch (error) {
        console.error('Error generating scripts:', error);
        alert('Something went wrong. Please try again.');
        hideLoading();
    }
}

// Generate mock scripts (for now)
function generateMockScripts() {
    const { topic, platform } = state;
    
    state.scripts = [
        `🎯 HOOK (0-3s): "Stop making this ${topic} mistake!"
        
🎵 SOUND: Trending ${platform} audio (check trending page)

📱 PLATFORM: ${platform}

📝 TEXT OVERLAYS:
1. Common mistake most people make
2. The simple fix nobody talks about
3. Pro tip for better results

📢 CTA: Follow @yourhandle for more ${topic} tips!

🔥 HASHTAGS: #${topic.replace(/\s+/g, '')} #${platform} #viral #fyp #trending

💡 VISUAL: Show before/after or demonstration
💡 DURATION: 15-30 seconds
💡 POST TIME: 7-9 PM (peak hours)`,

        `🎯 HOOK (0-3s): "I tried ${topic} for 7 days and here's what happened!"
        
🎵 SOUND: Viral ${platform} sound with 5M+ uses

📱 PLATFORM: ${platform}

📝 TEXT OVERLAYS:
1. Day 1-3: Initial challenges
2. Day 4-6: Breakthrough moment
3. Day 7: Amazing results

📢 CTA: Save this for when you need it!

🔥 HASHTAGS: #${topic.replace(/\s+/g, '')} #${platform} #trending #dailytips #contentcreator

💡 VISUAL: Use transitions between days
💡 DURATION: 20-45 seconds
💡 POST TIME: Tuesday/Thursday`,

        `🎯 HOOK (0-3s): "This ${topic} hack will change everything!"
        
🎵 SOUND: Popular ${platform} audio from trending creators

📱 PLATFORM: ${platform}

📝 TEXT OVERLAYS:
1. The problem with traditional approach
2. The game-changing alternative
3. How to implement it today

📢 CTA: Tag a friend who needs this!

🔥 HASHTAGS: #${topic.replace(/\s+/g, '')} #${platform}hack #lifehack #goals #productivity

💡 VISUAL: Split-screen comparison
💡 DURATION: 25-50 seconds
💡 POST TIME: Weekend mornings`
    ];
    
    console.log(`Generated 3 scripts for "${topic}" on ${platform}`);
}

// Display first script in preview
function displayFirstScript() {
    if (!elements.previewScript || !state.scripts[0]) return;
    
    elements.previewScript.innerHTML = `
        <div style="text-align: left; animation: fadeIn 0.8s;">
            <h3 style="color: #333; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                <span style="background: #6366f1; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">1</span>
                Your First Script (Free Preview)
            </h3>
            <div style="background: white; border-left: 4px solid #6366f1; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.1); margin-bottom: 20px;">
                <div style="font-family: 'Courier New', monospace; white-space: pre-wrap; line-height: 1.6; color: #333; font-size: 14px;">
                    ${state.scripts[0]}
                </div>
            </div>
            <p style="color: #666; font-size: 14px; background: #f0f9ff; padding: 10px; border-radius: 8px;">
                <i class="fas fa-info-circle"></i> Want all 3 scripts + trending sound suggestions + hashtag research?
            </p>
        </div>
    `;
}

// Show payment page
function showPayment() {
    if (!state.topic) {
        alert('Please generate scripts first!');
        return;
    }
    
    console.log('Opening payment for topic:', state.topic);
    
    // Add topic to payment link for tracking
    const paymentUrl = `${state.paymentLink}?client_reference_id=${encodeURIComponent(state.topic)}`;
    
    // Open in new tab
    window.open(paymentUrl, '_blank');
    
    // Show confirmation message
    alert(`Payment page opened! After payment, your 3 scripts for "${state.topic}" will be delivered.`);
    
    // For testing: simulate payment and show scripts
    // setTimeout(() => {
    //     displayAllScripts();
    //     changeStep(4);
    // }, 2000);
}

// Display all 3 scripts (after payment)
function displayAllScripts() {
    if (!elements.allScripts || !state.scripts.length) return;
    
    let html = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #10b981; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="fas fa-party-horn"></i> Your 3 Viral Scripts Are Ready!
            </h2>
            <p style="color: #666;">For topic: <strong>${state.topic}</strong> on <strong>${state.platform}</strong></p>
        </div>
    `;
    
    state.scripts.forEach((script, index) => {
        html += `
            <div class="script-card" style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 25px; box-shadow: 0 5px 20px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
                <div style="display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #f3f4f6;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-right: 15px;">
                        ${index + 1}
                    </div>
                    <h3 style="margin: 0; color: #333;">Script ${index + 1}</h3>
                </div>
                <div style="font-family: 'Courier New', monospace; white-space: pre-wrap; line-height: 1.6; color: #333; font-size: 14px; background: #f8fafc; padding: 20px; border-radius: 8px;">
                    ${script}
                </div>
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb; color: #666; font-size: 13px;">
                    <strong>📈 Success Tips:</strong> Post during peak hours, use trending sounds, engage with comments
                </div>
            </div>
        `;
    });
    
    html += `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-top: 30px;">
            <h3 style="margin-top: 0;">Want Unlimited Scripts?</h3>
            <p>Get unlimited script generation for just $19/month</p>
            <button onclick="showSubscription()" style="background: white; color: #6366f1; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px;">
                Upgrade Now
            </button>
        </div>
    `;
    
    elements.allScripts.innerHTML = html;
}

// Step management
function changeStep(stepNumber) {
    // Hide all steps
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById('step' + i);
        if (step) step.style.display = 'none';
    }
    
    // Show current step
    const currentStep = document.getElementById('step' + step' + stepNumber);
    if (currentStep) {
        currentStep.style.display = 'block';
        currentStep.classList.add('active');
    }
    
    // Update indicators
    const indicators = document.querySelectorAll('.step-indicator .step');
    if (indicators.length) {
        indicators.forEach((indicator, index) => {
            if (index < stepNumber) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    console.log('Changed to step:', stepNumber);
}

// Helper functions
function setTopic(topic) {
    if (elements.topicInput) {
        elements.topicInput.value = topic;
        elements.topicInput.focus();
    }
    state.topic = topic;
    console.log('Topic set to:', topic);
}

function backToStep1() {
    changeStep(1);
    if (elements.topicInput) {
        elements.topicInput.focus();
    }
}

function newScript() {
    changeStep(1);
    if (elements.topicInput) {
        elements.topicInput.value = '';
        elements.topicInput.focus();
    }
}

// Loading functions
function showLoading() {
    const loadingModal = document.getElementById('loadingModal');
    if (loadingModal) {
        loadingModal.style.display = 'flex';
    } else {
        // Create temporary loading indicator
        const loader = document.createElement('div');
        loader.id = 'temp-loader';
        loader.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999;">
                <div style="background: white; padding: 30px; border-radius: 15px; text-align: center;">
                    <div class="loader" style="border: 4px solid #f3f4f6; border-top: 4px solid #6366f1; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                    <p>Generating your viral scripts...</p>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
    }
}

function hideLoading() {
    const loadingModal = document.getElementById('loadingModal');
    if (loadingModal) {
        loadingModal.style.display = 'none';
    }
    
    const tempLoader = document.getElementById('temp-loader');
    if (tempLoader) {
        tempLoader.remove();
    }
}

// Download scripts as text file
function downloadScripts() {
    if (!state.scripts.length) {
        alert('No scripts to download. Generate scripts first.');
        return;
    }
    
    let content = `VIRAL SCRIPTS FOR: ${state.topic}\n`;
    content += `PLATFORM: ${state.platform}\n`;
    content += `GENERATED: ${new Date().toLocaleString()}\n\n`;
    content += '='.repeat(50) + '\n\n';
    
    state.scripts.forEach((script, index) => {
        content += `SCRIPT ${index + 1}:\n`;
        content += '-'.repeat(30) + '\n';
        content += script + '\n\n';
        content += '='.repeat(50) + '\n\n';
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viral-scripts-${state.topic.replace(/\s+/g, '-')}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Scripts downloaded! Check your downloads folder.');
}

// Share on Twitter
function shareOnTwitter() {
    const text = `Just generated 3 viral ${state.platform} scripts about "${state.topic}" using ViralScriptFactory! Try it: ${window.location.href}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Show subscription modal
function showSubscription() {
    alert('Unlimited script generation coming soon! Email us at support@viralscriptfactory.com for early access.');
}

// Add CSS animations if not present
function addStyles() {
    if (!document.getElementById('dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .script-card {
                animation: fadeIn 0.5s ease-in;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize styles
addStyles();

console.log('ViralScriptFactory v1.0 loaded successfully!');
