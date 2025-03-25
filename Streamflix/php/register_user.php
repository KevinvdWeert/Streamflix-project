<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$name || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

$credentialsFile = __DIR__ . '/../log/credentials.txt'; // Updated path to log folder
if (!file_exists($credentialsFile)) {
    file_put_contents($credentialsFile, '');
}

$lines = file($credentialsFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
foreach ($lines as $line) {
    list($storedEmail, ) = explode(':', $line);
    if ($storedEmail === $email) {
        echo json_encode(['success' => false, 'message' => 'Email already registered.']);
        exit;
    }
}

// Store the full name, email, and password
file_put_contents($credentialsFile, "$name:$email:$password\n", FILE_APPEND);

echo json_encode(['success' => true, 'message' => 'Account created successfully.']);
