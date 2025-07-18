<?php
// filepath: /Users/kjh/Documents/API-Team-Project/public/api/news-data.php

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
    return defined('NAVER_CLIENT_ID') && defined('NAVER_CLIENT_SECRET')
        && trim(NAVER_CLIENT_ID) !== '' && trim(NAVER_CLIENT_SECRET) !== '';
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
    sendError('NAVER_CLIENT_ID or NAVER_CLIENT_SECRET is not set in config.php', 401);
}

// 쿼리 파라미터 받기
$query = isset($_GET['query']) ? $_GET['query'] : '';
if (!$query) {
    sendError('Missing query parameter', 400);
}

// 네이버 뉴스 검색 API 호출
$naver_url = "https://openapi.naver.com/v1/search/news.json?query=" . urlencode($query) . "&display=10&sort=sim";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $naver_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-Naver-Client-Id: " . NAVER_CLIENT_ID,
    "X-Naver-Client-Secret: " . NAVER_CLIENT_SECRET
]);
$response = curl_exec($ch);

if ($response === false) {
    sendError('cURL Error: ' . curl_error($ch));
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    sendError("API returned HTTP $httpCode", $httpCode);
}

$data = json_decode($response, true);
if ($data === null) {
    sendError('Failed parsing JSON');
}

sendResponse($data);