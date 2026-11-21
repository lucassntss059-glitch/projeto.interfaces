(function () {
  'use strict';

  /* ===== Dados (localStorage) ===== */
  var CHAVE = 'condofix_solicitacoes';
  var SEED = [
    { id: 'CF-0019', titulo: 'Motor do portão parado', status: 'Em análise', tipo: 'Problema', local: 'Bloco A - Garagem', data: '2026-11-18T10:00:00' },
    { id: 'CF-0018', titulo: 'Luz do hall apagada', status: 'Agendado', tipo: 'Manutenção', local: 'Bloco B - Hall', data: '2026-11-15T09:00:00' },
    { id: 'CF-0017', titulo: 'Barulho após as 22h', status: 'Em análise', tipo: 'Reclamação', local: 'Bloco C - Apto 21', data: '2026-11-10T22:30:00' }
  ];

  function carregar() {
    try {
      var d = JSON.parse(localStorage.getItem(CHAVE));
      if (Array.isArray(d) && d.length) return d;
    } catch (e) { /* storage indisponível: usa os dados de exemplo */ }
    return SEED.slice();
  }
  function salvar(lista) {
    try { localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch (e) { /* ignora */ }
  }
  function porData(a, b) { return new Date(b.data) - new Date(a.data); }

  /* ===== Comportamento 1: alternar tema ===== */
  var raiz = document.documentElement;
  var btnTema = document.getElementById('btnTema');
  function aplicarTema(t) {
    raiz.setAttribute('data-tema', t);
    if (btnTema) {
      var rotulo = t === 'escuro' ? 'Ativar tema claro' : 'Ativar tema escuro';
      btnTema.textContent = t === 'escuro' ? '\u2600\uFE0E' : '\u263E';
      btnTema.setAttribute('aria-label', rotulo);
      btnTema.title = rotulo;
    }
  }
  var temaSalvo = null;
  try { temaSalvo = localStorage.getItem('condofix_tema'); } catch (e) { /* ignora */ }
  aplicarTema(temaSalvo || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'));
  if (btnTema) {
    btnTema.addEventListener('click', function () {
      var novo = raiz.getAttribute('data-tema') === 'escuro' ? 'claro' : 'escuro';
      aplicarTema(novo);
      try { localStorage.setItem('condofix_tema', novo); } catch (e) { /* ignora */ }
    });
  }

  /* ===== Comportamento 2: abrir/fechar menu ===== */
  var btnMenu = document.getElementById('btnMenu');
  var menu = document.getElementById('menu');
  if (btnMenu && menu) {
    btnMenu.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      btnMenu.setAttribute('aria-expanded', String(aberto));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) {
        menu.classList.remove('aberto');
        btnMenu.setAttribute('aria-expanded', 'false');
        btnMenu.focus();
      }
    });
  }

  /* ===== Comportamento 3: validação com mensagem própria ===== */
  function mensagem(c) {
    var v = c.validity;
    var grupo = c.closest('[data-vazio]');
    if (v.customError) return c.validationMessage;
    if (v.valueMissing) return c.dataset.vazio || (grupo && grupo.dataset.vazio) || 'Preencha este campo.';
    if (v.typeMismatch || v.patternMismatch) return c.dataset.invalido || 'Valor inválido.';
    if (v.tooShort) return 'Digite pelo menos ' + c.minLength + ' caracteres.';
    return c.validationMessage;
  }
  function campos(c) {
    return c.form.querySelectorAll('[name="' + c.name + '"]');
  }
  function mostrarErro(c) {
    var span = document.getElementById('erro-' + c.name);
    if (span) span.textContent = mensagem(c);
    campos(c).forEach(function (x) { x.setAttribute('aria-invalid', 'true'); });
  }
  function limparErro(c) {
    if (!c.name) return;
    var span = document.getElementById('erro-' + c.name);
    if (span) span.textContent = '';
    campos(c).forEach(function (x) { x.removeAttribute('aria-invalid'); });
  }
  function ligarValidacao(form) {
    var focou = false;
    // 'invalid' dispara no envio nativo; cancelamos o balão do navegador e mostramos a nossa mensagem
    form.addEventListener('invalid', function (e) {
      e.preventDefault();
      mostrarErro(e.target);
      if (!focou) {
        focou = true;
        e.target.focus();
        setTimeout(function () { focou = false; }, 0);
      }
    }, true);
    form.addEventListener('input', function (e) { limparErro(e.target); });
  }

  /* Avisos "em breve" (links sem página no protótipo) */
  var aviso = document.getElementById('aviso');
  document.querySelectorAll('[data-em-breve]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (aviso) aviso.textContent = 'Este recurso ainda não está disponível.';
    });
  });

  /* ===== Login ===== */
  var login = document.getElementById('formLogin');
  if (login) {
    ligarValidacao(login);
    login.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = login.elements.email.value.split('@')[0];
      try { localStorage.setItem('condofix_nome', nome); } catch (err) { /* ignora */ }
      window.location.href = 'inicio.html';
    });
  }

  /* ===== Início ===== */
  var nomeEl = document.getElementById('nomeMorador');
  if (nomeEl) {
    var n = null;
    try { n = localStorage.getItem('condofix_nome'); } catch (e) { /* ignora */ }
    if (n) nomeEl.textContent = n.charAt(0).toUpperCase() + n.slice(1);
  }
  var seloClasse = { 'Em análise': 'selo-analise', 'Agendado': 'selo-agendado', 'Concluído': 'selo-concluido' };
  var listaUltimas = document.getElementById('listaUltimas');
  if (listaUltimas) {
    carregar().sort(porData).slice(0, 3).forEach(function (s) {
      var li = document.createElement('li');
      var txt = document.createElement('span');
      txt.textContent = s.id + ' — ' + s.titulo;
      var selo = document.createElement('span');
      selo.className = 'selo ' + (seloClasse[s.status] || '');
      selo.textContent = s.status;
      li.append(txt, selo);
      listaUltimas.appendChild(li);
    });
  }

  /* ===== Comportamento 4: adicionar item (fluxo de nova solicitação) ===== */
  var form = document.getElementById('formSolicitacao');
  if (form) {
    ligarValidacao(form);
    var passos = Array.prototype.slice.call(form.querySelectorAll('.passo'));
    var progresso = document.getElementById('progresso');
    var atual = 0;

    var ir = function (n) {
      passos.forEach(function (p, i) { p.hidden = i !== n; });
      atual = n;
      progresso.hidden = n === 3;
      progresso.textContent = 'Passo ' + (n + 1) + ' de 3';
      passos[n].querySelector('h2').focus();
    };
    var validarPasso = function (passo) {
      var ok = true, primeiro = null;
      passo.querySelectorAll('[name]').forEach(function (c) {
        if (!c.checkValidity()) {
          mostrarErro(c);
          ok = false;
          if (!primeiro) primeiro = c;
        }
      });
      if (primeiro) primeiro.focus();
      return ok;
    };
    var preencherRevisao = function () {
      var d = new FormData(form);
      var img = form.elements.imagem.files[0];
      document.getElementById('rev-tipo').textContent = d.get('tipo');
      document.getElementById('rev-descricao').textContent = d.get('descricao');
      document.getElementById('rev-local').textContent = d.get('local');
      document.getElementById('rev-imagem').textContent = img ? img.name : 'Nenhuma';
    };

    form.elements.imagem.addEventListener('change', function (e) {
      var f = e.target.files[0];
      e.target.setCustomValidity(f && f.size > 2 * 1024 * 1024 ? 'A imagem deve ter até 2 MB.' : '');
    });

    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ir]');
      if (!b) return;
      var destino = Number(b.dataset.ir);
      if (destino > atual && !validarPasso(passos[atual])) return;
      if (destino === 2) preencherRevisao();
      ir(destino);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lista = carregar();
      var maior = lista.reduce(function (m, s) { return Math.max(m, parseInt(s.id.slice(3), 10) || 0); }, 0);
      var d = new FormData(form);
      var desc = String(d.get('descricao')).trim();
      var nova = {
        id: 'CF-' + String(maior + 1).padStart(4, '0'),
        titulo: desc.length > 40 ? desc.slice(0, 40).trim() + '…' : desc,
        status: 'Em análise',
        tipo: d.get('tipo'),
        local: d.get('local'),
        data: new Date().toISOString()
      };
      lista.push(nova);
      salvar(lista);
      document.getElementById('protocolo').textContent = nova.id;
      ir(3);
    });
  }

  /* ===== Comportamentos 5 e 6: filtrar e ordenar a lista ===== */
  var listaMinhas = document.getElementById('listaMinhas');
  if (listaMinhas) {
    var bsSelo = { 'Em análise': 'text-bg-warning', 'Agendado': 'text-bg-info', 'Concluído': 'text-bg-success' };
    var dados = carregar();
    var busca = document.getElementById('busca');
    var filtro = document.getElementById('filtroStatus');
    var ordem = document.getElementById('ordem');
    var contagem = document.getElementById('contagem');

    // Componente com Bootstrap: card + badge (equivalente em CSS puro em css/style.css)
    var criarCard = function (s) {
      var li = document.createElement('li');
      li.className = 'card border-0 shadow-sm';
      var corpo = document.createElement('div');
      corpo.className = 'card-body d-flex justify-content-between align-items-start gap-3';
      var info = document.createElement('div');
      var h = document.createElement('h2');
      h.className = 'card-titulo';
      h.textContent = s.id + ' — ' + s.titulo;
      var meta = document.createElement('p');
      meta.className = 'meta';
      meta.textContent = s.tipo + ', ' + s.local + ' (' + new Date(s.data).toLocaleDateString('pt-BR') + ')';
      info.append(h, meta);
      var badge = document.createElement('span');
      badge.className = 'badge ' + (bsSelo[s.status] || 'text-bg-secondary');
      badge.textContent = s.status;
      corpo.append(info, badge);
      li.appendChild(corpo);
      return li;
    };

    var desenhar = function () {
      var termo = busca.value.trim().toLowerCase();
      var lista = dados.filter(function (s) {
        var texto = (s.id + ' ' + s.titulo + ' ' + s.local).toLowerCase();
        return (!filtro.value || s.status === filtro.value) && texto.indexOf(termo) !== -1;
      });
      lista.sort(function (a, b) {
        if (ordem.value === 'antigos') return -porData(a, b);
        if (ordem.value === 'titulo') return a.titulo.localeCompare(b.titulo, 'pt-BR');
        return porData(a, b);
      });
      listaMinhas.textContent = '';
      if (!lista.length) {
        var vazio = document.createElement('li');
        vazio.className = 'vazio';
        vazio.textContent = 'Nenhuma solicitação encontrada. Limpe os filtros ou crie uma nova.';
        listaMinhas.appendChild(vazio);
      } else {
        lista.forEach(function (s) { listaMinhas.appendChild(criarCard(s)); });
      }
      contagem.textContent = lista.length + (lista.length === 1 ? ' solicitação' : ' solicitações');
    };

    busca.addEventListener('input', desenhar);
    filtro.addEventListener('change', desenhar);
    ordem.addEventListener('change', desenhar);
    busca.form.addEventListener('submit', function (e) { e.preventDefault(); });
    desenhar();
  }
})();
