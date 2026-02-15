// Get DOM elements
const projectNameInput = document.getElementById('projectName');
const descriptionInput = document.getElementById('description');
const styleSelect = document.getElementById('style');
const generateBtn = document.getElementById('generateBtn');
const previewCard = document.getElementById('previewCard');
const logoImage = document.getElementById('logoImage');
const downloadBtn = document.getElementById('downloadBtn');
const errorMsg = document.getElementById('errorMsg');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');

// Style descriptions for prompts
const styleDescriptions = {
    minimalist: 'minimalist, clean lines, simple shapes, modern',
    modern: 'modern, tech-inspired, futuristic, digital, sleek',
    playful: 'playful, colorful, fun, friendly, vibrant',
    professional: 'professional, corporate, elegant, trustworthy, refined',
    vintage: 'vintage, retro, classic, nostalgic, timeless'
};

// Generate prompt for logo
function generatePrompt(name, description, style) {
    const styleDesc = styleDescriptions[style];
    return `Professional logo design for "${name}", ${description}. 
Style: ${styleDesc}. 
Clean background, vector-style icon, high quality, centered composition, 
modern and memorable. Logo symbol only, no text in the image.`;
}

// Show error message
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 5000);
}

// Generate logo via Netlify serverless function (API key stays on server)
async function generateLogo() {
    const projectName = projectNameInput.value.trim();
    const description = descriptionInput.value.trim();
    const style = styleSelect.value;

    // Validation
    if (!projectName) {
        showError('Please enter a project name');
        return;
    }

    if (!description) {
        showError('Please enter a description');
        return;
    }

    // Show loading state
    generateBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    previewCard.style.display = 'none';

    try {
        // Create prompt
        const prompt = generatePrompt(projectName, description, style);

        // Call Netlify serverless function (proxies to fal.ai on the server)
        const response = await fetch('/.netlify/functions/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to generate logo');
        }

        // Display logo
        if (result.images && result.images[0]) {
            logoImage.src = result.images[0].url;
            previewCard.style.display = 'block';
        } else {
            throw new Error('No image generated');
        }

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to generate logo. Please try again.');
    } finally {
        // Reset button state
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Download logo
async function downloadLogo() {
    try {
        const projectName = projectNameInput.value.trim().replace(/\s+/g, '-').toLowerCase();
        const filename = `${projectName}-logo.png`;

        // Fetch image as blob
        const response = await fetch(logoImage.src);
        const blob = await response.blob();

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download error:', error);
        showError('Failed to download logo');
    }
}

// Event listeners
generateBtn.addEventListener('click', generateLogo);
downloadBtn.addEventListener('click', downloadLogo);

// Allow Enter key in inputs
projectNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateLogo();
});

descriptionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) generateLogo();
});
