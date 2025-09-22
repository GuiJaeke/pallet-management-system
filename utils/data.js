function obterDataAtual() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se necessário
    const dia = String(hoje.getDate()).padStart(2, '0');
    const horas = String(hoje.getHours()).padStart(2, '0'); // Formata para 2 dígitos
    const minutos = String(hoje.getMinutes()).padStart(2, '0'); // Formata para 2 dígitos
    const segundos = String(hoje.getSeconds()).padStart(2, '0'); // Formata para 2 dígitos     // Adiciona zero à esquerda se necessário
    return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}
module.exports = obterDataAtual()