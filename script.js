document.addEventListener('DOMContentLoaded', () => {
    const produtos = [
      { id: 1, nome: 'Café Expresso', preco: 3.5, descricao: 'Café puro e forte', imagem: '/api/placeholder/300/200' },
      { id: 2, nome: 'Cappuccino', preco: 4.5, descricao: 'Café com leite e espuma', imagem: '/api/placeholder/300/200' },
      { id: 3, nome: 'Bolo de Chocolate', preco: 5.0, descricao: 'Bolo caseiro de chocolate', imagem: '/api/placeholder/300/200' },
      { id: 4, nome: 'Sanduíche Natural', preco: 6.5, descricao: 'Sanduíche leve e saudável', imagem: '/api/placeholder/300/200' },
      { id: 5, nome: 'Suco de Laranja', preco: 4.0, descricao: 'Suco natural da fruta', imagem: '/api/placeholder/300/200' },
      { id: 6, nome: 'Croissant', preco: 3.0, descricao: 'Croissant francês tradicional', imagem: '/api/placeholder/300/200' },
      { id: 7, nome: 'Chá Verde', preco: 3.0, descricao: 'Chá verde refrescante', imagem: '/api/placeholder/300/200' },
      { id: 8, nome: 'Muffin de Blueberry', preco: 4.0, descricao: 'Muffin recheado com blueberry', imagem: '/api/placeholder/300/200' },
      { id: 9, nome: 'Smoothie de Frutas', preco: 5.5, descricao: 'Smoothie de frutas variadas', imagem: '/api/placeholder/300/200' },
      { id: 10, nome: 'Torta de Limão', preco: 4.5, descricao: 'Torta de limão cremosa', imagem: '/api/placeholder/300/200' },
      { id: 11, nome: 'Café Gelado', preco: 4.0, descricao: 'Café gelado refrescante', imagem: '/api/placeholder/300/200' },
      { id: 12, nome: 'Brownie', preco: 3.5, descricao: 'Brownie de chocolate', imagem: '/api/placeholder/300/200' },
    ];
  
    let mesas = {};
    let mesaAtual = null;
  
    const mesaInput = document.getElementById('mesaInput');
    const abrirMesaBtn = document.getElementById('abrirMesaBtn');
    const tabsList = document.getElementById('tabsList');
    const tabsContent = document.getElementById('tabsContent');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');
    const produtosContainer = document.getElementById('produtosContainer');
  
    abrirMesaBtn.addEventListener('click', () => abrirMesa(mesaInput.value || Date.now()));
  
    closeModal.addEventListener('click', () => fecharModal());
  
    window.onclick = function(event) {
      if (event.target === modal) {
        fecharModal();
      }
    }
  
    function abrirMesa(numeroMesa) {
      if (!mesas[numeroMesa]) {
        mesas[numeroMesa] = { carrinho: [] };
      }
      mesaAtual = numeroMesa;
      renderTabs();
    }
  
    function fecharMesa(numeroMesa) {
      delete mesas[numeroMesa];
      if (mesaAtual === numeroMesa) {
        mesaAtual = null;
      }
      renderTabs();
    }
  
    function adicionarAoCarrinho(produto, numeroMesa) {
      const mesa = mesas[numeroMesa];
      const itemExistente = mesa.carrinho.find(item => item.id === produto.id);
      if (itemExistente) {
        itemExistente.quantidade += 1;
      } else {
        mesa.carrinho.push({ ...produto, quantidade: 1 });
      }
      renderTabs();
    }
  
    function calcularTotal(carrinho) {
      return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0).toFixed(2);
    }
  
    function renderTabs() {
      tabsList.innerHTML = '';
      tabsContent.innerHTML = '';
  
      if (Object.keys(mesas).length === 0) {
        tabsContent.innerHTML = '<p>Nenhuma mesa aberta. Abra uma mesa para começar.</p>';
        return;
      }
  
      Object.keys(mesas).forEach(numeroMesa => {
        const tabButton = document.createElement('button');
        tabButton.textContent = `Mesa ${numeroMesa}`;
        tabButton.className = mesaAtual === numeroMesa ? 'active' : '';
        tabButton.addEventListener('click', () => {
          mesaAtual = numeroMesa;
          renderTabs();
        });
        tabsList.appendChild(tabButton);
  
        if (mesaAtual === numeroMesa) {
          const mesa = mesas[numeroMesa];
          const card = document.createElement('div');
          card.className = 'card';
  
          const cardHeader = document.createElement('div');
          cardHeader.className = 'card-content';
          cardHeader.innerHTML = `<h3>Carrinho - Mesa ${numeroMesa}</h3>`;
          card.appendChild(cardHeader);
  
          const table = document.createElement('table');
          table.innerHTML = `
            <thead>
              <tr>
                <th class="text-left">Item</th>
                <th class="text-right">Qtd</th>
                <th class="text-right">Preço</th>
                <th class="text-right">Subtotal</th>
              </tr>
            </thead>
          `;
          const tbody = document.createElement('tbody');
          mesa.carrinho.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${item.nome}</td>
              <td class="text-right">${item.quantidade}</td>
              <td class="text-right">R$ ${item.preco.toFixed(2)}</td>
              <td class="text-right">R$ ${(item.preco * item.quantidade).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
          });
          table.appendChild(tbody);
          card.appendChild(table);
  
          const totalDiv = document.createElement('div');
          totalDiv.className = 'font-bold mt-4 text-right';
          totalDiv.textContent = `Total: R$ ${calcularTotal(mesa.carrinho)}`;
          card.appendChild(totalDiv);
  
          const verCatalogoBtn = document.createElement('button');
          verCatalogoBtn.textContent = 'Ver Catálogo de Produtos';
          verCatalogoBtn.className = 'w-full mb-4';
          verCatalogoBtn.addEventListener('click', () => abrirModal(numeroMesa));
          card.appendChild(verCatalogoBtn);
  
          const fecharMesaBtn = document.createElement('button');
          fecharMesaBtn.textContent = `Fechar Mesa ${numeroMesa}`;
          fecharMesaBtn.className = 'close-mesa-btn mt-4';
          fecharMesaBtn.addEventListener('click', () => fecharMesa(numeroMesa));
          card.appendChild(fecharMesaBtn);
  
          tabsContent.appendChild(card);
        }
      });
    }
  
    function abrirModal(numeroMesa) {
      produtosContainer.innerHTML = '';
  
      produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'card';
  
        const img = document.createElement('img');
        img.src = produto.imagem;
        img.alt = produto.nome;
        card.appendChild(img);
  
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        cardContent.innerHTML = `
          <h3>${produto.nome}</h3>
          <p>${produto.descricao}</p>
          <p class="font-bold">R$ ${produto.preco.toFixed(2)}</p>
        `;
  
        const addButton = document.createElement('button');
        addButton.textContent = 'Adicionar ao Carrinho';
        addButton.addEventListener('click', () => adicionarAoCarrinho(produto, numeroMesa));
        cardContent.appendChild(addButton);
  
        card.appendChild(cardContent);
        produtosContainer.appendChild(card);
      });
  
      modal.style.display = 'flex';
    }
  
    function fecharModal() {
      modal.style.display = 'none';
    }
  
    renderTabs();
  });
  