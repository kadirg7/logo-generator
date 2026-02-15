// Netlify Serverless Function — proxies logo generation requests to fal.ai
// API key is stored in Netlify environment variables (FAL_API_KEY)

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
        };
    }

    try {
        // Parse request body
        const { prompt } = JSON.parse(event.body);

        if (!prompt || typeof prompt !== 'string') {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Missing or invalid "prompt" field in request body.' })
            };
        }

        // Check that API key is configured
        const apiKey = process.env.FAL_API_KEY;
        if (!apiKey) {
            console.error('FAL_API_KEY environment variable is not set.');
            return {
                statusCode: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Server configuration error. API key is missing.' })
            };
        }

        // Call fal.ai API from the server side (no CORS issues)
        const falResponse = await fetch('https://fal.run/fal-ai/flux/schnell', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                image_size: 'square_hd',
                num_inference_steps: 4,
                num_images: 1
            })
        });

        if (!falResponse.ok) {
            const errorText = await falResponse.text();
            console.error(`fal.ai API error (${falResponse.status}):`, errorText);
            return {
                statusCode: falResponse.status,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Failed to generate logo. The AI service returned an error.' })
            };
        }

        const result = await falResponse.json();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('Serverless function error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error. Please try again later.' })
        };
    }
};
