const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static('.'));

// Proxy endpoint for IPTV links
app.get('/proxy/*', async (req, res) => {
    try {
        // Extract the URL from the request
        const targetUrl = req.params[0];
        
        if (!targetUrl) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        console.log(`🔄 Proxying request to: ${targetUrl}`);

        // Fetch the content from the target URL
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the content type
        const contentType = response.headers.get('content-type') || 'text/plain';
        
        // Set appropriate headers
        res.set({
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });

        // Stream the response
        response.body.pipe(res);

    } catch (error) {
        console.error('❌ Proxy error:', error.message);
        res.status(500).json({ 
            error: 'Proxy error', 
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Proxy server is running',
        timestamp: new Date().toISOString()
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
    console.log(`📡 Proxy endpoint: http://localhost:${PORT}/proxy/`);
    console.log(`💡 Example: http://localhost:${PORT}/proxy/https://list.iptvcat.com/my_list/s/f3290311a06f133de0427abfcbc979b2.m3u8`);
});

module.exports = app;
