<?php
/**
 * CORS Proxy for SHLS Streams
 * 
 * Usage: cors-proxy.php?url=https://shls-live-enc.edgenextcdn.net/...
 * 
 * يجب رفع هذا الملف على سيرفر يدعم PHP (مثل: Hostinger, 000webhost, InfinityFree)
 */

// Set CORS headers to allow all origins
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Max-Age: 86400'); // 24 hours

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the target URL from query parameter
$url = isset($_GET['url']) ? $_GET['url'] : '';

if (empty($url)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing URL parameter']);
    exit;
}

// Validate URL
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid URL']);
    exit;
}

// Only allow SHLS streams for security
$allowed_hosts = [
    'shls-live-enc.edgenextcdn.net',
    'edgenextcdn.net'
];

$url_parts = parse_url($url);
$is_allowed = false;

foreach ($allowed_hosts as $host) {
    if (strpos($url_parts['host'], $host) !== false) {
        $is_allowed = true;
        break;
    }
}

if (!$is_allowed) {
    http_response_code(403);
    echo json_encode(['error' => 'Host not allowed']);
    exit;
}

// Initialize cURL
$ch = curl_init();

// Set cURL options
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 5,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_HTTPHEADER => [
        'Accept: application/vnd.apple.mpegurl, application/x-mpegurl, */*',
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer: https://www.google.com/',
        'Origin: https://www.google.com'
    ]
]);

// Execute request
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$error = curl_error($ch);

curl_close($ch);

// Handle errors
if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL error: ' . $error]);
    exit;
}

// Set appropriate content type
if ($content_type) {
    header('Content-Type: ' . $content_type);
} else {
    // Default to M3U8 content type
    header('Content-Type: application/vnd.apple.mpegurl');
}

// Set response code
http_response_code($http_code);

// Output the response
echo $response;
?>
