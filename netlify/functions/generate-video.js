const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const { topic, script, part } = JSON.parse(event.body);
        const API_KEY = process.env.AI_API_KEY;

        if (!API_KEY) {
            return { 
                statusCode: 500, 
                body: JSON.stringify({ error: 'API Key Netlify par set nahi hai.' }) 
            };
        }

        const apiResponse = await fetch('https://api.heygen.com/v2/video/generate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                video_inputs: [{
                    character: { type: 'avatar', avatar_id: 'default_teacher' },
                    voice: { type: 'text', input_text: `${topic} - ${part}: ${script}` }
                }]
            })
        });

        const data = await apiResponse.json();

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                videoUrl: data.data?.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4' 
            })
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
