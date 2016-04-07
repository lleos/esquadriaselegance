<?php
#ini_set('display_errors', '1'); # somente para debug ;]

# É obrigatório informar o caminho para a classe PHPMailer
require_once 'class.phpmailer.php';

/**
 * Função utilizada para o envio de e-mail com a classe PHPMailer.
 *
 * @param   array/hash  $de 
 *        - $de['nome']  Nome do remetente.
 *        - $de['email']   E-mail do remetente.
 *
 * @param array/hash  $para
 *        - $para['nome']  Nome do destinatário.
 *        - $para['email'] E-mail do destinatário.
 *
 * @param string    $assunto
 *        - O assunto da mensagem.
 *
 * @param text    $msg
 *        - a mensagem que vai no corpo do e-mail.
 *
 * @example send_mail( array('nome' => 'Leandro Heuert', 'email' => 'leandroh@gmail.com'), array('nome' => 'Leonardo', 'email' => 'leonardo@leosoft.com.br'), 'Assunto da mensagem', 'Texto que vai no corpo do e-mail.');
 *
 * @return  Retorna verdadeiro se o e-mail foi enviado com sucesso.
 *    Se não uma mensagem de erro!
 */
 
 
function send_mail($de, $para, $assunto, $msg = null) {
  $mail = new PHPMailer();

  $mail->IsSMTP();                             // Informa que eh SMTP
  $mail->Host = "smtp.esquadriaselegance.com.br";         // Especifica o servidor de e-mail
  $mail->SMTPAuth = true;                      // Inicia a autenticação via smtp
  $mail->Username = "admin@esquadriaselegance.com.br"; // usuário do SMTP
  $mail->Password = "l1i2t3l4";                    // senha do SMTP

  $mail->From = "admin@esquadriaselegance.com.br";//$de['email'];
  $mail->FromName = $de['nome'];
  $mail->AddAddress($para['email'], $para['nome']);
 
  $mail->AddAttachment("teste.txt");

  $mail->WordWrap = 50;                         // set word wrap to 50 characters
  $mail->IsHTML(true);                          // Formato do email eh HTML
  $mail->CharSet = 'utf-8';
  $mail->Port = 587;
  

  $mail->Subject = $assunto;
  $mail->Body    = $msg;
  $mail->AltBody = strip_tags(str_replace("<br>", "\n", $msg));

  if ( !$mail->Send() ) {
    echo "<h4>A mensagem não pode ser enviada! </h4>";
    echo "<p>Mailer Error: " . $mail->ErrorInfo . "</p>";
    exit;
  }

  return TRUE;
}

?>
