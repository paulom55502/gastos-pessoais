# Gastos Pessoais

Aplicação web em React para controle de gastos pessoais.

## Tecnologias
- React 18 + Vite
- React Router DOM (roteamento entre páginas)
- Context API (estado compartilhado)
- CSS externo com responsividade
- API REST: [reqres.in](https://reqres.in)

## Páginas
- **Início** — resumo com totais por categoria e dados da API REST
- **Cadastro** — formulário com validação e envio para API REST
- **Listagem** — lista dinâmica com busca, filtro e ordenação

## Como rodar

```bash
docker compose up -d
docker compose exec app npm install
docker compose exec app npm run dev
```

Acesse: http://localhost:5174
