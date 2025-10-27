const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')
const form = document.querySelector('form')
const error = document.querySelector('#error')
const signinBtn = document.querySelector('button')
const load = document.querySelector('#load')

const signin = () => {
    load.style.display = 'block'
    fetch('https://muse-api-i8lp.onrender.com/signin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.email == emailInput.value) {
            console.log(data.id)
            window.location.href = 'home.html'
            localStorage.setItem('userId', data.id)
        } else {
            console.log('unsuccessful')
            error.style.display = 'block'
        }
        
    })
    .finally(() => load.style.display = 'none')
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    signin()
    
})

