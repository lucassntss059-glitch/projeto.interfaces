# CondoFix

Site do CondoFix: aplicativo para moradores de condomínio registrarem problemas, reclamações e pedidos de manutenção ou instalação.
Projeto acadêmico (Análise e Desenvolvimento de Sistemas). Protótipo: Figma da entrega E2.

## Para quem
- Moradores, que registram e acompanham solicitações.
- Administração, que recebe os pedidos.

## Como rodar
1. Clone o repositório.
2. Abra `index.html` no navegador (ou use a extensão Live Server no IDE).
3. Login de teste: qualquer e-mail válido e senha com 6+ caracteres.

Não há back-end: as solicitações ficam no `localStorage` do navegador.

## Arquivos
| Arquivo | Função |
|---|---|
| `index.html` | Login |
| `inicio.html` | Início e últimas solicitações |
| `nova-solicitacao.html` | Formulário em 3 passos (tipo, detalhes, revisão) + confirmação |
| `minhas-solicitacoes.html` | Lista com busca, filtro e ordenação (componente Bootstrap) |
| `sobre.html` | Sobre o projeto e integrantes |
| `css/style.css` | Todo o estilo, tema claro/escuro e equivalente em CSS puro do componente Bootstrap |
| `js/script.js` | Tema, menu, validação, fluxo de nova solicitação, filtro e ordenação |
| `img/` | Logo e ilustração |
| `MUDANCAS.md` | Diferenças em relação ao protótipo |

## Cores
Azul `#24527A` e verde `#68BE7F` (as cores da logo), com tema claro e escuro. O botão de tema fica fixo no canto inferior direito.

## JavaScript
Alternar tema, abrir/fechar menu, validação com mensagem própria, adicionar item, filtrar e ordenar lista.

## Créditos do grupo
- Lucas Santos Sousa
- Kauã Henrique Tolentino
- Felipe Villela da Silva
- Geovanna Gabrielle Dantas Carvalho
- Vinicius Prates
