// Variáveis para acumular os valores dos saldos
let totalEntradas = 0;
let totalSaidas = 0;
let saldoTotal = 0;

// Selecionando os elementos do formulário
const form = document.querySelector('#form-transacao');
const inputDescricao = document.querySelector('#descricao');
const inputValor = document.querySelector('#valor');
const inputTipo = document.querySelector('#tipo');

// Selecionando os elementos de texto dos cards do HTML
const corpoTabela = document.querySelector('#corpo-tabela'); 
const textoEntrada = document.querySelector('#texto-entrada');
const textoSaida = document.querySelector('#texto-saida');
const textoTotal = document.querySelector('#texto-total');

// Função que cria o HTML de uma nova linha e joga na tabela
function adicionarLinhaNaTabela(id, descricao, valor, tipo) {
    // 1. Cria o elemento de linha (tr) na memória do JavaScript
    const linha = document.createElement('tr');

    // 2. Define qual classe CSS o valor vai usar baseado no tipo (entrada ou saida)
    const classeValor = tipo === 'entrada' ? 'valor-entrada' : 'valor-saida';
    
    // 3. Formata o valor para o padrão de moeda do Brasil (R$ 0.00)
    const valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // 4. Constrói o HTML de dentro da linha (as células td)
    linha.innerHTML = `
        <td>${descricao}</td>
        <td class="${classeValor}">${valorFormatado}</td>
        <td>${tipo === 'entrada' ? 'Entrada' : 'Saída'}</td>
        <td><button class="btn-deletar">❌</button></td>
        `;

    // Capturando o botão de deletar que ACABOU de ser criado dentro desta linha
    const botaoDeletar = linha.querySelector('.btn-deletar');
    
    // Ouvindo o clique no X dessa linha específica
    botaoDeletar.addEventListener('click', function() {
        // CORREÇÃO 1: Dispara o comando DELETE primeiro. 
        // Só limpamos a tela se o Java confirmar o sucesso (dentro do .then)
        fetch(`http://localhost:8080/api/financas/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            linha.remove(); // Remove do HTML
            removerSaldos(valor, tipo); // Deduz dos cards do topo
        });
    });

    // 5. Coloca a linha que criamos dentro do corpo da tabela lá no HTML
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

// Escutando quando o formulário for enviado
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
    .then(resposta => resposta.json())
    .then(financaSalvaNoBanco => {
        adicionarLinhaNaTabela(financaSalvaNoBanco.id, financaSalvaNoBanco.descricao, financaSalvaNoBanco.valor, financaSalvaNoBanco.tipo.toLowerCase());
        atualizarSaldos(financaSalvaNoBanco.valor, financaSalvaNoBanco.tipo.toLowerCase());
        form.reset();
    });
}); 

// Função para subtrair os valores dos cards quando uma linha é excluída
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

// ==========================================
// CONEXÃO COM O BACK-END (JAVA) - BUSCAR DADOS
// ==========================================

function buscarTransacoesDoBackend() {
    fetch('http://localhost:8080/api/financas')
        .then(resposta => resposta.json())
        .then(listaDeFinancas => {
            listaDeFinancas.forEach(function(financaIndividual) {
                // CORREÇÃO 2: Adicionado o ID como primeiro argumento aqui também!
                adicionarLinhaNaTabela(financaIndividual.id, financaIndividual.descricao, financaIndividual.valor, financaIndividual.tipo.toLowerCase());
                atualizarSaldos(financaIndividual.valor, financaIndividual.tipo.toLowerCase());
            });
        });
}

// Executa a busca assim que a página abre
buscarTransacoesDoBackend();