let totalEntradas = 0;
let totalSaidas = 0;
let saldoTotal = 0;

const form = document.querySelector('#form-transacao');
const inputDescricao = document.querySelector('#descricao');
const inputValor = document.querySelector('#valor');
const inputTipo = document.querySelector('#tipo');

const corpoTabela = document.querySelector('#corpo-tabela'); 
const textoEntrada = document.querySelector('#texto-entrada');
const textoSaida = document.querySelector('#texto-saida');
const textoTotal = document.querySelector('#texto-total');

function adicionarLinhaNaTabela(id, descricao, valor, tipo) {
    const linha = document.createElement('tr');
    const classeValor = tipo === 'entrada' ? 'valor-entrada' : 'valor-saida';
    const valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    linha.innerHTML = `
        <td>${descricao}</td>
        <td class="${classeValor}">${valorFormatado}</td>
        <td>${tipo === 'entrada' ? 'Entrada' : 'Saída'}</td>
        <td><button class="btn-deletar">❌</button></td>
        `;

    const botaoDeletar = linha.querySelector('.btn-deletar');
    
    botaoDeletar.addEventListener('click', function() {
        if (id === null) {
            linha.remove();
        } else {
            fetch(`http://localhost:8080/api/financas/${id}`, {
                method: 'DELETE'
            })
            .then(() => {
                linha.remove();
                removerSaldos(valor, tipo);
            });
        }
    });

    corpoTabela.appendChild(linha);
}
    
function atualizarSaldos(valor, tipo) {
    if (tipo === 'entrada') {
        totalEntradas += valor; 
    } else {
        totalSaidas += valor;   
    }
        
    saldoTotal = totalEntradas - totalSaidas;

    textoEntrada.textContent = totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    textoSaida.textContent = totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    textoTotal.textContent = saldoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

form.addEventListener('submit', function(evento) {
    evento.preventDefault();
            
    const descricao = inputDescricao.value;
    const valor = Number(inputValor.value); 
    const tipo = inputTipo.value.toUpperCase(); 

    const novaFinanca = {
        descricao: descricao,
        valor: valor,
        tipo: tipo
    };

    fetch('http://localhost:8080/api/financas', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(novaFinanca) 
    })
    .then(resposta => {
        if (resposta.status >= 400) {
            throw new Error('Erro na validação do servidor');
        }
        return resposta.json(); 
    })
    .then(financaSalvaNoBanco => {
        adicionarLinhaNaTabela(financaSalvaNoBanco.id, financaSalvaNoBanco.descricao, financaSalvaNoBanco.valor, financaSalvaNoBanco.tipo.toLowerCase());
        atualizarSaldos(financaSalvaNoBanco.valor, financaSalvaNoBanco.tipo.toLowerCase());
        form.reset();
    })
    .catch(erro => {
        alert('Erro ao salvar transação: Verifique os dados inseridos.');
        console.error(erro);
    });
});

function removerSaldos(valor, tipo) {
    if (tipo === 'entrada') {
        totalEntradas -= valor; 
    } else {
        totalSaidas -= valor;   
    }

    saldoTotal = totalEntradas - totalSaidas;

    textoEntrada.textContent = totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    textoSaida.textContent = totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    textoTotal.textContent = saldoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function buscarTransacoesDoBackend() {
    fetch('http://localhost:8080/api/financas')
        .then(resposta => resposta.json())
        .then(listaDeFinancas => {
            if (listaDeFinancas.length === 0) {
                adicionarLinhaNaTabela(null, "Exemplo: salário mensal", 2500.00, "entrada");
            } else {
                listaDeFinancas.forEach(function(financaIndividual) {
                    adicionarLinhaNaTabela(financaIndividual.id, financaIndividual.descricao, financaIndividual.valor, financaIndividual.tipo.toLowerCase());
                    atualizarSaldos(financaIndividual.valor, financaIndividual.tipo.toLowerCase());
                });
            }
    });
}

buscarTransacoesDoBackend();