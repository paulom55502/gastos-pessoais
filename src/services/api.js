// services/api.js
// Integração com API REST pública (reqres.in) para simular envio de dados

const BASE_URL = 'https://reqres.in/api'

// Simula o envio de um gasto para uma API REST
export async function enviarGasto(gasto) {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gasto),
  })

  if (!response.ok) throw new Error('Erro ao enviar gasto para a API')

  const data = await response.json()
  return data
}

// Simula busca de usuários da API (exibido na página Início)
export async function buscarUsuarios() {
  const response = await fetch(`${BASE_URL}/users?page=1`)
  if (!response.ok) throw new Error('Erro ao buscar dados da API')
  const data = await response.json()
  return data.data
}
