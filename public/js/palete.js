document.getElementById('etq').addEventListener('submit', function (evento) {
    evento.preventDefault();
    const resposta = confirm('Tem certeza que deseja imprimir a Etiqueta? após a impressão não será mais possível a adição e edição de itens!')
    if (resposta) {
        document.getElementById('etq').submit();
    }
})
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("codinterno").focus();
});
const quantform = document.getElementById('quantForm')
if (quantform != null) {
    document.getElementById('quantForm').addEventListener('submit', function (evento) {
        const quant = document.getElementById("newQuant").value
        console.log(quant)
        if (!quant) {
            evento.preventDefault();
            return alert('preencha a quantidade!')
        }
        if (quant <= 0) {
            evento.preventDefault();
            return alert('Quantidade deve ser maior que 0!')
        }
    })
};


document.getElementById('codinterno').addEventListener('keydown', function (event) {
    if (event.key == 'Tab') {
        const codDigitado = document.getElementById("codinterno").value
        if (!codDigitado) {
            return alert('preencha o código!')
            document.getElementById("codinterno").focus();
        }
    }
})
document.getElementById('quant').addEventListener('keydown', function (event) {
    if (event.key == 'Tab') {
        const quant = document.getElementById("quant").value
        const print = document.getElementById("print").value
        console.log(quant)
        if (!quant) {
            document.getElementById("codinterno").focus();
            return alert('preencha a quantidade!')
        }
        if (quant <= 0) {
            document.getElementById("codinterno").focus();
            return alert('Quantidade deve ser maior que 0!')
        }
        if (print == 'true') {
            return alert('Palete já impresso não pode ser alterado!')
        }
        document.getElementById('form').submit();
    }
})
document.getElementById('form').addEventListener('submit', function (evento) {
    const quant = document.getElementById("quant").value
    console.log(quant)
    if (!quant) {
        document.getElementById("codinterno").focus();
        evento.preventDefault();
        return alert('preencha a quantidade!')
    }
    if (quant <= 0) {
        document.getElementById("codinterno").focus();
        evento.preventDefault();
        return alert('Quantidade deve ser maior que 0!')
    }

})
const teclasPressionadas = {};
document.addEventListener('keydown', function (evento) {
    teclasPressionadas[evento.key] = true; // Marca a tecla como pressionada

    if (teclasPressionadas['Control'] && teclasPressionadas['p']) {
        const print = document.getElementById("print").value
        evento.preventDefault()
        if (print == 'true') {
            return window.location.href = "http://192.168.3.95:3001/palete/print/{{palete.id}}";
        }
        const resposta = confirm('Tem certeza que deseja imprimir? após a impressão não será mais possível a adição e edição de itens!')
        if (resposta) {
            evento.preventDefault()
            window.location.href = "http://192.168.3.95:3001/palete/print/{{palete.id}}";
        }
    } else {
        console.log('Ação cancelada')
    }
});

let tloc = document.getElementById('tloc')

const elementos = document.querySelectorAll('#tloc'); // Seleciona todos com a classe 'loc'

elementos.forEach(function(elemento) {
    if (elemento.innerText.length > 6) {

        elemento.style.fontSize = '1em';  // Aplica o estilo desejado
    }
});