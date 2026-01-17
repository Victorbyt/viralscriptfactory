// frontend/js/main.js
// Configuration
const config = {
    backendUrl: 'https://mock-backend-for-testing.com', // Will update after deployment
    stripePublicKey: 'pk_test_51P...',
    paypalClientId: 'your_paypal_client_id'
};

// Global state
let state = {
    topic: '',
    platform: 'tiktok',
    scripts: [],
    paymentIntentId: null,
    clientSecret: null
};

// DOM Elements
const step1El = document.getElementById('step1');
const step2El = document.getElementById('step2');
const step3El = document.getElementById('step3');
const step4El = document.getElementById('step4');
const stepIndicators = document.querySelectorAll('.step');

// Initialize Stripe
const stripe = Stripe(config.stripePublicKey);
let elements;

// Initialize PayPal
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '5.00'
                },
                description: '3 Viral Scripts - ' + state.topic
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            // Payment completed
            showSuccessModal();
            // Call backend to generate scripts
            generateAllScripts('paypal', details.id);
        });
    }
}).render('#paypal-button-container');

// Function to set topic from examples
function setTopic(topic) {
    document.getElementById('topic').value = topic;
    state.topic = topic;
}

// Function to scroll to generator
function scrollToGenerator() {
    document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
}

// Step 1: Generate Scripts
async function generateScripts() {
    state.topic = document.getElementById('topic').value;
    const platformEl = document.querySelector('input[name="platform"]:checked');
    state.platform = platformEl ? platformEl.value : 'tiktok';
    
    if (!state.topic.trim()) {
        alert('Please enter a topic!');
        return;
    }
    
    showLoading();
    
    try {
        // In production, this would call your backend
        // For now, simulate with mock data
        const mockScript = generateMockScript(state.topic, state.platform);
        
        // Show preview
        document.getElementById('previewScript').innerHTML = mockScript;
        
        // Store mock data (in production, this comes from backend)
        state.scripts = [
            mockScript,
            generateMockScript(state.topic, state.platform),
            generateMockScript(state.topic, state.platform)
        ];
        
        // Initialize Stripe payment
        await initializeStripe();
        
        // Move to step 2
        changeStep(2);
        hideLoading();
    } catch (error) {
        console.error('Error:', error);
        hideLoading();
        alert('Failed to generate script. Please try again.');
    }
}

// Initialize Stripe Elements
async function initializeStripe() {
    try {
        // In production, create PaymentIntent via backend
        const response = await fetch(config.backendUrl + '/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 500, // $5.00 in cents
                currency: 'usd',
                topic: state.topic
            })
        });
        
        const data = await response.json();
        state.clientSecret = data.clientSecret;
        state.paymentIntentId = data.paymentIntentId;
        
        // Create Stripe Elements
        elements = stripe.elements({
            clientSecret: state.clientSecret,
            appearance: {
                theme: 'stripe'
            }
        });
        
        const paymentElement = elements.create('payment');
        paymentElement.mount('#stripe-payment-element');
    } catch (error) {
        console.error('Stripe initialization error:', error);
        // Fallback to mock for demo
        state.clientSecret = 'mock_secret_' + Date.now();
        state.paymentIntentId = 'mock_intent_' + Date.now();
    }
}

// Step 2: Show Payment
function showPayment() {
    changeStep(3);
}

// Step 3: Process Stripe Payment
async function processStripePayment() {
    showLoading();
    
    try {
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            clientSecret: state.clientSecret,
            confirmParams: {
                return_url: window.location.href,
            },
            redirect: 'if_required'
        });
        
        if (error) {
            hideLoading();
            alert(error.message);
            return;
        }
        
        if (paymentIntent.status === 'succeeded') {
            showSuccessModal();
            // In production, verify with backend
            await generateAllScripts('stripe', paymentIntent.id);
        }
    } catch (error) {
        console.error('Payment error:', error);
        hideLoading();
        alert('Payment failed. Please try again.');
    }
}

// Generate all scripts after payment
async function generateAllScripts(paymentMethod, paymentId) {
    try {
        // In production, call backend to generate real scripts
        // For demo, use mock scripts
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
        
        displayAllScripts();
        changeStep(4);
        hideLoading();
        
        // Track conversion
        trackConversion(paymentMethod, paymentId);
    } catch (error) {
        console.error('Script generation error:', error);
        alert('Failed to generate scripts. Contact support.');
    }
}

// Display all scripts
function displayAllScripts() {
    const container = document.getElementById('allScripts');
    container.innerHTML = '';
    
    state.scripts.forEach((script, index) => {
        const scriptCard = document.createElement('div');
        scriptCard.className = 'script-card';
        scriptCard.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="background: #6366f1; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                    ${index + 1}
                </div>
                <h3 style="margin: 0;">Script ${index + 1}</h3>
            </div>
            <div style="font-family: monospace; white-space: pre-wrap;">${script}</div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <strong>Trending Sounds:</strong> #${state.platform}Sound123<br>
                <strong>Hashtags:</strong> #${state.topic.replace(/\s+/g, '')} #viral #trending
            </div>
        `;
        container.appendChild(scriptCard);
    });
}

// Change step
function changeStep(stepNumber) {
    // Hide all steps
    [step1El, step2El, step3El, step4El].forEach(el => {
        el.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Update indicators
    stepIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index < stepNumber);
    });
}

// Back to step 1
function backToStep1() {
    changeStep(1);
}

// Show/hide loading modal
function showLoading() {
    document.getElementById('loadingModal').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingModal').style.display = 'none';
}

function showSuccessModal() {
    document.getElementById('successModal').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('successModal').style.display = 'none';
    }, 2000);
}

// Show payment methods
function showStripePayment() {
    document.getElementById('stripe-payment').style.display = 'block';
    document.getElementById('paypal-payment').style.display = 'none';
    document.getElementById('crypto-payment').style.display = 'none';
    updatePaymentTabs('stripe');
}

function showPayPalPayment() {
    document.getElementById('stripe-payment').style.display = 'none';
    document.getElementById('paypal-payment').style.display = 'block';
    document.getElementById('crypto-payment').style.display = 'none';
    updatePaymentTabs('paypal');
}

function showCryptoPayment() {
    document.getElementById('stripe-payment').style.display = 'none';
    document.getElementById('paypal-payment').style.display = 'none';
    document.getElementById('crypto-payment').style.display = 'block';
    updatePaymentTabs('crypto');
}

function updatePaymentTabs(activeTab) {
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.payment-tab[onclick*="${activeTab}"]`).classList.add('active');
}

// Copy crypto address
function copyAddress() {
    const address = document.querySelector('.address').textContent;
    navigator.clipboard.writeText(address).then(() => {
        alert('Address copied to clipboard!');
    });
}

// Download scripts as PDF
function downloadScripts() {
    const content = state.scripts.map((script, i) => 
        `SCRIPT ${i+1}\n${script}\n\n`
    ).join('\n---\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viral-scripts-${state.topic}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Share on Twitter
function shareOnTwitter() {
    const text = `Just generated 3 viral ${state.platform} scripts about "${state.topic}" using @ViralScriptFactory!`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

// New script
function newScript() {
    changeStep(1);
    document.getElementById('topic').value = '';
    document.getElementById('topic').focus();
}

// Mock script generator (for demo)
function generateMockScript(topic, platform) {
    const hooks = [
        "Stop making this mistake!",
        "This changed everything for me...",
        "You won't believe what happened next!",
        "The secret nobody tells you about...",
        "3 simple steps to..."
    ];
    
    const ctas = [
        "Follow for more tips!",
        "Save this for later!",
        "Try this and tag me!",
        "Comment your results below!",
        "Share with someone who needs this!"
    ];
    
    const hook = hooks[Math.floor(Math.random() * hooks.length)];
    const cta = ctas[Math.floor(Math.random() * ctas.length)];
    
    return `📱 ${platform.toUpperCase()} SCRIPT

🎯 HOOK (0-3s): ${hook}

🎵 SOUND: Use trending "${platform} sound" with 1M+ uses

📝 TEXT OVERLAYS:
1. First point about ${topic}
2. Second important tip
3. The game-changer

👀 VISUAL: Show before/after or demonstration

📢 CTA: ${cta}

🔥 HASHTAGS: #${topic.replace(/\s+/g, '')} #${platform} #viral #fyp`;
}

// Track conversion
function trackConversion(paymentMethod, paymentId) {
    // In production, send to analytics
    console.log(`Conversion: ${paymentMethod}, ID: ${paymentId}, Topic: ${state.topic}`);
    
    // Update stats display
    const statsElement = document.querySelector('.stat-number');
    if (statsElement) {
        const current = parseInt(statsElement.textContent.replace(/\D/g, '')) || 5000;
        statsElement.textContent = (current + 3).toLocaleString() + '+';
    }
}

// Show subscription modal
function showSubscription() {
    alert('Coming soon! Unlimited scripts for $19/month. Email support@viralscriptfactory.com to get early access.');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set up example tags
    document.querySelectorAll('.example-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const topic = this.textContent.replace(/[^a-zA-Z\s]/g, '').toLowerCase();
            setTopic(topic);
        });
    });
    
    // Form submission
    document.getElementById('topic').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateScripts();
        }
    });
    
    // Default to stripe payment
    showStripePayment();
});
