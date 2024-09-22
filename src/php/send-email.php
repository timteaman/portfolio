<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $subject = htmlspecialchars(trim($_POST['subject']));
    $message = htmlspecialchars(trim($_POST['message']));

    $to = "tim.like.tea@gmail.com";
    $headers = "From: " . $email . "\r\n" .
               "Reply-To: " . $email . "\r\n" .
               "Content-type: text/html; charset=utf-8";

    $email_content = "<h3>You have a new message</h3>";
    $email_content .= "<p><strong>Name:</strong> $name</p>";
    $email_content .= "<p><strong>Email:</strong> $email</p>";
    $email_content .= "<p><strong>Subject:</strong> $subject</p>";
    $email_content .= "<p><strong>Message:</strong><br>$message</p>";

    // Отправка письма
    if (mail($to, $subject, $email_content, $headers)) {
        echo "Message sent successfully!";
    } else {
        echo "Error sending message!";
    }
}
?>
