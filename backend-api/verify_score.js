const BASE_URL = 'http://localhost:3333/api'
let TOKEN = ''

async function login() {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'password' }), // Adjust credentials if needed
  })
  const data = await response.json()
  if (data.token) {
    TOKEN = data.token.token
    console.log('Login successful')
  } else {
    console.error('Login failed', data)
  }
}

async function createMappings() {
  const mappings = [
    { category: 'ept', sectionType: 'listening', rawScore: 10, scaledScore: 30 },
    { category: 'ept', sectionType: 'listening', rawScore: 11, scaledScore: 32 },
    { category: 'ept', sectionType: 'structure', rawScore: 10, scaledScore: 40 },
    { category: 'ept', sectionType: 'reading', rawScore: 10, scaledScore: 35 },
  ]

  const response = await fetch(`${BASE_URL}/score-mappings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mappings }),
  })

  console.log('Create Mappings Status:', response.status)
  const data = await response.json()
  console.log('Create Mappings Response:', data)
}

async function getMappings() {
  const response = await fetch(`${BASE_URL}/score-mappings/ept`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })

  console.log('Get Mappings Status:', response.status)
  const data = await response.json()
  console.log('Get Mappings Response Length:', data.length)
  console.log(
    'Sample Mapping:',
    data.find((m) => m.rawScore === 10 && m.sectionType === 'listening')
  )
}

async function run() {
  await login()
  if (TOKEN) {
    await createMappings()
    await getMappings()
  }
}

run()
