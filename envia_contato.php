<?php
require_once 'inc/send_mail.php';
# --- Captura os dados vindo do formulário --- #
$assunto = "Contato - Esquadrias Elegance";

$nome = $_POST['nome'];
$fone = $_POST['fone'];
$email = $_POST['email'];

$br = "\n<br/>";
$mensagem = "<html><head></head><body><fieldset><legend>Contato</legend><table>";
$mensagem .= "<tr><td>Nome:</td><td>$nome</td></tr>";
$mensagem .= "<tr><td>Fone:</td><td>$fone</td></tr>";
$mensagem .= "<tr><td>Email:</td><td>$email</td></tr>";
$mensagem .= "<tr><td>Mensagem:</td><td>".$_POST['mensage']."</td></tr>";
$mensagem .= "</table></fieldset></body></html>";

$remetente = array('nome' => $nome, 'email' => $email);
$destinatario = array('nome' => 'Esquadrias Elegance - Contato', 'email' => 'marcelo@esquadriaselegance.com.br');

$email_enviado = 0;
if ($nome != '' && $fone != '' && $email != '') {
	$email_enviado = send_mail( $remetente, $destinatario, $assunto, $mensagem );
}

?>
<script type="text/javascript">
<?php if ($email_enviado == 1) { ?>
window.location='agradecimento.html';
<?php } else { ?>
window.history.back();
<?php } ?>
</script>