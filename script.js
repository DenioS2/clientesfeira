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

// Estrutura para múltiplos clientes: { "NomeDoCliente": [ itens da conta ], ... }
let bancoClientes = {};
let clienteAtivo = null;

// Elementos do DOM
const btnAddCliente = document.getElementById("btn-add-cliente");
const listaClientesAbas = document.getElementById("lista-clientes-abas");
const areaCliente = document.getElementById("area-cliente");
const msgSemCliente = document.getElementById("msg-sem-cliente");
const nomeClienteDisplay = document.querySelector("#nome-cliente-display span");
const btnEditarCliente = document.getElementById("btn-editar-cliente");
const btnRemoverCliente = document.getElementById("btn-remover-cliente");
const inputBusca = document.getElementById("input-busca");
const listaSugestoes = document.getElementById("lista-sugestoes");
const listaConsumo = document.getElementById("lista-consumo");
const totalContaDisplay = document.getElementById("total-conta");
const btnPago = document.getElementById("btn-pago");

// Evento: Criar Nova Ficha de Cliente
btnAddCliente.addEventListener("click", () => {
    const nome = prompt("Digite o nome do novo cliente:");
    if (!nome || nome.trim() === "") return;
    
    const nomeLimpo = nome.trim();

    if (bancoClientes[nomeLimpo]) {
        alert("Já existe um cliente com esse nome aberto!");
        selecionarCliente(nomeLimpo);
        return;
    }

    bancoClientes[nomeLimpo] = [];
    atualizarAbasClientes();
    selecionarCliente(nomeLimpo);
});

// Troca a visualização para o cliente clicado
function selecionarCliente(nome) {
    clienteAtivo = nome;
    nomeClienteDisplay.textContent = clienteAtivo;
    
    msgSemCliente.classList.add("hidden");
    areaCliente.classList.remove("hidden");
    
    inputBusca.value = "";
    listaSugestoes.classList.add("hidden");
    
    destacarAbaAtiva();
    atualizarInterfaceConta();
}

// Atualiza os botões/abas dos clientes no topo
function atualizarAbasClientes() {
    listaClientesAbas.innerHTML = "";
    Object.keys(bancoClientes).forEach(nome => {
        const button = document.createElement("button");
        button.className = "aba-cliente";
        button.textContent = nome;
        button.type = "button";
        button.addEventListener("click", () => selecionarCliente(nome));
        listaClientesAbas.appendChild(button);
    });
    destacarAbaAtiva();
}

function destacarAbaAtiva() {
    const abas = document.querySelectorAll(".aba-cliente");
    abas.forEach(aba => {
        if (aba.textContent === clienteAtivo) {
            aba.classList.add("ativa");
        } else {
            aba.classList.remove("ativa");
        }
    });
}

// Evento: Editar Nome do Cliente Atual
btnEditarCliente.addEventListener("click", () => {
    if (!clienteAtivo) return;
    const novoNome = prompt("Editar nome do cliente:", clienteAtivo);
    if (!novoNome || novoNome.trim() === "" || novoNome.trim() === clienteAtivo) return;

    const novoNomeLimpo = novoNome.trim();

    if (bancoClientes[novoNomeLimpo]) {
        alert("Já existe outro cliente com esse nome!");
        return;
    }

    bancoClientes[novoNomeLimpo] = bancoClientes[clienteAtivo];
    delete bancoClientes[clienteAtivo];
    
    clienteAtivo = novoNomeLimpo;
    nomeClienteDisplay.textContent = clienteAtivo;
    atualizarAbasClientes();
});

// Evento: Remover Ficha (Excluir)
btnRemoverCliente.addEventListener("click", () => {
    if (!clienteAtivo) return;
    if (confirm(`Deseja cancelar e APAGAR a ficha de ${clienteAtivo}? (Os dados serão perdidos)`)) {
        fecharFichaClienteAtual();
    }
});

// Evento: Finalizar e Pagar Conta (Sucesso)
btnPago.addEventListener("click", () => {
    if (!clienteAtivo) return;
    if (confirm(`Confirmar pagamento total da conta de ${clienteAtivo}?`)) {
        fecharFichaClienteAtual();
    }
});

function fecharFichaClienteAtual() {
    delete bancoClientes[clienteAtivo];
    clienteAtivo = null;
    
    atualizarAbasClientes();
    
    const clientesRestantes = Object.keys(bancoClientes);
    if (clientesRestantes.length > 0) {
        selecionarCliente(clientesRestantes[0]); 
    } else {
        areaCliente.classList.add("hidden");
        msgSemCliente.classList.remove("hidden");
    }
}

// Evento: Filtrar produtos na busca
inputBusca.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();
    listaSugestoes.innerHTML = "";

    if (termo.length === 0 || !clienteAtivo) {
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

// Função: Adicionar produto no extrato do cliente ativo
function adicionarProdutoNaConta(produto) {
    if (!clienteAtivo) return;
    const contaAtual = bancoClientes[clienteAtivo];
    const itemExistente = contaAtual.find(item => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        contaAtual.push({
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
function alterarQuantidade(id, mudanca) {
    if (!clienteAtivo) return;
    let contaAtual = bancoClientes[clienteAtivo];
    const item = contaAtual.find(item => item.id === id);
    if (!item) return;

    item.quantidade += mudanca;

    if (item.quantidade <= 0) {
        bancoClientes[clienteAtivo] = contaAtual.filter(item => item.id !== id);
    }

    atualizarInterfaceConta();
}

// Função: Renderiza a lista do cliente ativo e recalcula o valor total
function atualizarInterfaceConta() {
    listaConsumo.innerHTML = "";
    let totalGeral = 0;

    if (!clienteAtivo) return;
    const contaAtual = bancoClientes[clienteAtivo];

    contaAtual.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;

        const li = document.createElement("li");
        
        const infoDiv = document.createElement("div");
        infoDiv.className = "item-info";
        infoDiv.innerHTML = `
            <strong>${item.nome}</strong> <br>
            <small>R$ ${item.preco.toFixed(2)} un. | Subtotal: R$ ${subtotal.toFixed(2)}</small>
        `;
        
        const controlesDiv = document.createElement("div");
        controlesDiv.className = "item-controles";
        
        const btnMenos = document.createElement("button");
        btnMenos.type = "button";
        btnMenos.className = "btn-ajuste";
        btnMenos.textContent = "-";
        btnMenos.addEventListener("click", () => alterarQuantidade(item.id, -1));
        
        const qtdSpan = document.createElement("span");
        qtdSpan.className = "item-qtd";
        qtdSpan.textContent = item.quantidade;
        
        const btnMais = document.createElement("button");
        btnMais.type = "button";
        btnMais.className = "btn-ajuste";
        btnMais.textContent = "+";
        btnMais.addEventListener("click", () => alterarQuantidade(item.id, 1));
        
        controlesDiv.appendChild(btnMenos);
        controlesDiv.appendChild(qtdSpan);
        controlesDiv.appendChild(btnMais);
        
        li.appendChild(infoDiv);
        li.appendChild(controlesDiv);
        
        listaConsumo.appendChild(li);
    });

    totalContaDisplay.textContent = totalGeral.toFixed(2);
}
