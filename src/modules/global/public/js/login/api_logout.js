// Cerrar sesión con fetch
async function logout() {

    console.log('Script cargado para ejecutar cierre')

  const res = await fetch('/logout', {
    method: 'POST', // o GET si así configuraste
    credentials: 'include' // MUY IMPORTANTE para que envíe la cookie
  })

  const data = await res.json()
  console.log(data.message)
  if (res.ok) {
    window.location.href = '/login' // redirigir al login
  }
}
