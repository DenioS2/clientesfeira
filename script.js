// Banco de dados simulado de produtos da feira
const produtosDisponiveis = [
    { id: 1, nome: "Heineken", preco: 10.00 },
    { id: 2, nome: "Original", preco: 10.00 },
    { id: 3, nome: "Amstel", preco: 8.00 },
    { id: 4, nome: "Brahma", preco: 8.00 },
    { id: 5, nome: "Antarctica (Cerveja)", preco: 8.00 },
    { id: 6, nome: "Kaiser", preco: 7.00 },
    { id: 7, nome: "Refrigerante Lata", preco: 7.00 },
    { id: 8, nome: "Refrigerante Pichula", preco: 4.00 },
    { id: 9, nome: "Água com Gás", preco: 4.00 },
    { id: 10, nome: "Água sem Gás", preco: 3.00 },
    { id: 11, nome: "Churrasco", preco: 12.00 },
    { id: 12, nome: "Chopp", preco: 12.00 },
    { id: 13, nome: "Suco", preco: 7.00 },
    { id: 14, nome: "Monster", preco: 10.00 }
];


// Estado da aplicação
let clienteAtual = "";
let contaCliente = []; // Guarda os itens adicionados: { id, nome, preco, quantidade }

// Elementos do DOM
const btnAddCliente = document.getElementById("btn-add-cliente");
const areaCliente = document.getElementById("area-cliente");
const nomeClienteDisplay = document.querySelector("#nome-cliente-display span");
const btnEditarCliente = document.getElementById("btn-editar-cliente");
const inputBusca = document.getElementById("input-busca");
const listaSugestoes = document.getElementById("lista-sugestoes");
const listaConsumo = document.getElementById("lista-consumo");
const totalContaDisplay = document.getElementById("total-conta");
const btnPago = document.getElementById("btn-pago");

// Evento: Adicionar/Definir Cliente
btnAddCliente.addEventListener("click", () => {
    const nome = prompt("Digite o nome da pessoa:");
    if (nome && nome.trim() !== "") {
        clienteAtual = nome.trim();
        nomeClienteDisplay.textContent = clienteAtual;
        areaCliente.classList.remove("hidden");
        btnAddCliente.classList.add("hidden"); // Oculta o botão central inicial
    }
});

// Evento: Editar Cliente
btnEditarCliente.addEventListener("click", () => {
    const novoNome = prompt("Editar nome do cliente:", clienteAtual);
    if (novoNome && novoNome.trim() !== "") {
        clienteAtual = novoNome.trim();
        nomeClienteDisplay.textContent = clienteAtual;
    }
});

// Evento: Filtrar produtos na busca
inputBusca.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();
    listaSugestoes.innerHTML = "";

    if (termo.length === 0) {
        listaSugestoes.classList.add("hidden");
        return;
    }

    const filtrados = produtosDisponiveis.filter(p => p.nome.toLowerCase().includes(termo));

    if (filtrados.length > 0) {
        filtrados.forEach(produto => {
            const li = document.createElement("li");
            li.innerHTML = `<span>${produto.nome}</span> <span>R$ ${produto.preco.toFixed(2)}</span>`;
            li.addEventListener("click", () => adicionarProdutoNaConta(produto));
            listaSugestoes.appendChild(li);
        });
        listaSugestoes.classList.remove("hidden");
    } else {
        listaSugestoes.classList.add("hidden");
    }
});

// Fecha a lista de sugestões se clicar fora
document.addEventListener("click", (e) => {
    if (!inputBusca.contains(e.target) && !listaSugestoes.contains(e.target)) {
        listaSugestoes.classList.add("hidden");
    }
});

// Evento: Finalizar e Pagar Conta
btnPago.addEventListener("click", () => {
    if (confirm(`Confirmar pagamento da conta de ${clienteAtual}?`)) {
        // Reseta o estado do sistema
        clienteAtual = "";
        contaCliente = [];
        
        // Limpa as interfaces de texto
        inputBusca.value = "";
        atualizarInterfaceConta();
        
        // Altera a visibilidade das telas
        areaCliente.classList.add("hidden");
        btnAddCliente.classList.remove("hidden");
    }
});

// Função: Adicionar produto no extrato do cliente
function adicionarProdutoNaConta(produto) {
    const itemExistente = contaCliente.find(item => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        contaCliente.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
        });
    }

    inputBusca.value = "";
    listaSugestoes.classList.add("hidden");
    atualizarInterfaceConta();
}

// Função: Alterar a quantidade (+ ou -)
function alterarQuantidade(id, mudança) {
    const item = contaCliente.find(item => item.id === id);
    if (!item) return;

    item.quantidade += mudança;

    // Se a quantidade chegar a zero, remove da conta
    if (item.quantidade <= 0) {
        contaCliente = contaCliente.filter(item => item.id !== id);
    }

    atualizarInterfaceConta();
}

// Função: Renderiza a lista atualizada e recalcula o valor total
function atualizarInterfaceConta() {
    listaConsumo.innerHTML = "";
    let totalGeral = 0;

    contaCliente.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;

        const li = document.createElement("li");
        li.innerHTML = `
            <div class="item-info">
                <strong>${item.nome}</strong> <br>
                <small>R$ ${item.preco.toFixed(2)} un. | Subtotal: R$ ${subtotal.toFixed(2)}</small>
            </div>
            <div class="item-controles">
                <button class="btn-ajuste" onclick="alterarQuantidade(${item.id}, -1)">-</button>
                <span class="item-qtd">${item.quantidade}</span>
                <button class="btn-ajuste" onclick="alterarQuantidade(${item.id}, 1)">+</button>
            </div>
        `;
        listaConsumo.appendChild(li);
    });

    totalContaDisplay.textContent = totalGeral.toFixed(2);
}
