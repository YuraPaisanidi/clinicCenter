<?php

	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';
	require 'phpmailer/src/SMTP.php';

	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('ru', 'phpmailer/language/');
	$mail->IsHTML(true);

	//От каго письмо
	$mail->setFrom('rudolifrudolif@gmail.com', 'Стартовый макет');
	//Кому отправить
	$mail->addAddress('rudolifrudolif@gmail.com');
	//Тема письма
	$mail->Subject = ('Привет это тест отправки формы');

	//Рука
	$hand = 'Правая';
	if($_POST['hand'] == 'left') {
		$hand = 'Левая';
	}

	//Тело письма
	$body = '<h1>Заголовок письма</h1>';

	if(trim(!empty($_POST['name']))) {
		$body.='<p><strong>Имя: </strong>' . $_POST['name']. '</p>';
	}
	if(trim(!empty($_POST['email']))) {
		$body.='<p><strong>Почта: </strong>' . $_POST['email']. '</p>';
	}
	if(trim(!empty($_POST['phone']))) {
		$body.='<p><strong>Телефон: </strong>' . $_POST['phone']. '</p>';
	}
	if(trim(!empty($_POST['hand']))) {
		$body.='<p><strong>Рука: </strong>' . $_POST['hand']. '</p>';
	}
	if(trim(!empty($_POST['ege']))) {
		$body.='<p><strong>Возраст: </strong>' . $_POST['ege']. '</p>';
	}
	if(trim(!empty($_POST['message']))) {
		$body.='<p><strong>Сообщение: </strong>' . $_POST['message']. '</p>';
	}

	//Прикрепить файл
	if (!empty($_FILES['image']['tmp_name'])) {
		//путь загрузки файла
		$filePath = __DIR__ . '/files/' . $_FILES['image']['name'];

		//загрузим файл
		if (copy($_FILES['image']['tmp_name'], $filePath)) {
			$fileAttach = $filePath;
			$body.='<p><strong>Фото в приложении</strong></p>';
			$mail->addAttachment($fileAttach);
		}
	}

	$mail->Body = $body;

	//Отправляем
	if (!$mail->send()) {
		$message = 'Ошибка';
	} else {
		$massage = 'Данные отправлены!';
	}

	$response = ['message' => $massage];

	header('Content-type: application/json');
	echo json_encode($response);


?>