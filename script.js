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
const corpoTabela = document.querySelector('#corpo-tabela'); // Selecionando o corpo da tabela onde o histórico vai aparecer
const textoEntrada = document.querySelector('#texto-entrada');
const textoSaida = document.querySelector('#texto-saida');
const textoTotal = document.querySelector('#texto-total');

// Função que cria o HTML de uma nova linha e joga na tabela
function adicionarLinhaNaTabela(descricao, valor, tipo) {
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
        // 1. Remove a linha do HTML
        linha.remove();
        
        // 2. CHAMADA DA NOVA FUNÇÃO: Atualiza os saldos subtraindo o valor
        removerSaldos(valor, tipo);
    });

    // 5. Coloca a linha que criamos dentro do corpo da tabela lá no HTML
    corpoTabela.appendChild(linha);
}
    
function atualizarSaldos(valor, tipo) {
    // 1. Faz a matemática baseada no tipo
    if (tipo === 'entrada') {
        totalEntradas += valor; // Soma no total de entradas
    } else {
        totalSaidas += valor;   // Soma no total de saídas
    }
        
    // 2. Calcula o saldo final (Entradas menos as Saídas)
    saldoTotal = totalEntradas - totalSaidas;

    // 3. Atualiza os textos dos cards na tela com o valor formatado in R$
    textoEntrada.textContent = totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    textoSaida.textContent = totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    textoTotal.textContent = saldoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Escutando quando o formulário for enviado
form.addEventListener('submit', function(evento) {
    // 1. Impede a página de recarregar
    evento.preventDefault();
            
    // 2. Captura os valores que o usuário digitou
    const descricao = inputDescricao.value;
    const valor = Number(inputValor.value); // Convertendo o texto digitado em número
    const tipo = inputTipo.value;

    // 3. Teste rápido no console para ver se funcionou
    console.log("Descrição:", descricao);
    console.log("Valor:", valor);
    console.log("Tipo:", tipo);
    
    // Chamada da nova função: Passando as caixinhas que capturamos para a função da tabela
    adicionarLinhaNaTabela(descricao, valor, tipo);
    
    // Faz os cálculos e atualiza os cards do topo!
    atualizarSaldos(valor, tipo);
    
    // 4. Limpa os campos do formulário para a próxima digitação
    form.reset();
}); // <-- O EventListener do formulário acaba AQUI!

// Função para subtrair os valores dos cards quando uma linha é excluída (Agora isolada e global!)
function removerSaldos(valor, tipo) {
    // 1. Deduz o valor do seu respectivo acumulador
    if (tipo === 'entrada') {
        totalEntradas -= valor; // Subtrai do total de entradas
    } else {
        totalSaidas -= valor;   // Subtrai do total de saídas
    }

    // 2. Recalcula o saldo final
    saldoTotal = totalEntradas - totalSaidas;

    // 3. Atualiza os textos dos cards na tela
    textoEntrada.textContent = totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    textoSaida.textContent = totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    textoTotal.textContent = saldoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}