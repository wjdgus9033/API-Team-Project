<?php
// CORS 헤더
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

function isValidApiKey() {
    return defined('API_KEY') && trim(API_KEY) !== '';
}

function sendError($msg, $code = 500) {
    http_response_code($code);
    echo json_encode(['error' => true, 'message' => $msg]);
    exit();
}

function sendResponse($data) {
    http_response_code(200);
    echo json_encode($data);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Only GET method allowed', 405);
}

if (!isValidApiKey()) {
    sendError('API_KEY is not set in config.php', 401);
}

// API 호출 URL
$url = "https://apis.data.go.kr/1741000/CasualtiesFromHeatwaveByYear/getCasualtiesFromHeatwaveByYear?serviceKey=" 
       . API_KEY . "&pageNo=1&numOfRows=100&type=xml";

// cURL 요청
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);

if ($response === false) {
    sendError('cURL Error: ' . curl_error($ch));
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    sendError("API returned HTTP $httpCode", $httpCode);
}

// XML 파싱
$xml = simplexml_load_string($response, 'SimpleXMLElement', LIBXML_NOCDATA);
if (!$xml) {
    sendError('Failed parsing XML');
}

$result = [];
foreach ($xml->body->items->item as $item) {
    $result[] = [
        'year'     => (string) $item->wrttimeid,
        'total'    => (string) $item->tot,
        'indoor'   => (string) $item->indoor_subtot,
        'outdoor'  => (string) $item->otdoor_subtot,
    ];
}

sendResponse($result);
?>