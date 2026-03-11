/**
 * CloudFlare Worker - CORS Proxy for SHLS Streams
 * 
 * خطوات التثبيت:
 * 1. اذهب إلى: https://dash.cloudflare.com/
 * 2. Workers & Pages → Create Worker
 * 3. انسخ هذا الكود واحفظه
 * 4. Deploy
 * 5. استخدم الرابط: https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/?url=STREAM_URL
 * 
 * مميزات:
 * - مجاني 100,000 طلب يومياً
 * - سريع جداً (CDN عالمي)
 * - موثوق
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Get URL from query parameter
  const url = new URL(request.url)
  const targetUrl = url.searchParams.get('url')
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleCORS()
  }
  
  // Validate URL parameter
  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
      status: 400,
      headers: corsHeaders()
    })
  }
  
  // Security: Only allow specific domains
  const allowedHosts = [
    'shls-live-enc.edgenextcdn.net',
    'edgenextcdn.net'
  ]
  
  let targetUrlObj
  try {
    targetUrlObj = new URL(targetUrl)
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: corsHeaders()
    })
  }
  
  // Check if hostname is allowed
  const isAllowed = allowedHosts.some(host => 
    targetUrlObj.hostname.includes(host)
  )
  
  if (!isAllowed) {
    return new Response(JSON.stringify({ 
      error: 'Host not allowed',
      allowed_hosts: allowedHosts 
    }), {
      status: 403,
      headers: corsHeaders()
    })
  }
  
  try {
    // Fetch the target URL with custom headers
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Accept': 'application/vnd.apple.mpegurl, application/x-mpegurl, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.google.com/',
        'Origin': 'https://www.google.com'
      },
      redirect: 'follow'
    })
    
    // Clone response and add CORS headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        ...corsHeaders()
      }
    })
    
    return newResponse
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Fetch failed',
      message: error.message 
    }), {
      status: 500,
      headers: corsHeaders()
    })
  }
}

// CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  }
}

// Handle CORS preflight
function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  })
}
