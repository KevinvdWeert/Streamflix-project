<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

$credentialsFile = __DIR__ . '/../log/credentials.txt'; // Updated path to log folder
if (!file_exists($credentialsFile)) {
    echo json_encode(['success' => false, 'message' => 'No credentials found.']);
    exit;
}

$lines = file($credentialsFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
foreach ($lines as $line) {
    list($storedName, $storedEmail, $storedPassword) = explode(':', $line);
    if ($storedEmail === $email && $storedPassword === $password) {
        echo json_encode(['success' => true, 'user' => ['name' => $storedName, 'email' => $storedEmail]]);
        exit;
    }
}

echo json_encode(['success' => false, 'message' => 'Invalid credentials.']);
