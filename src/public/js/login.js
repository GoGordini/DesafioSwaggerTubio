const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    // {
    //     email: "asdasd",
    //     password: "asdasd",
    // }
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) { //si todo fue OK, login retorna 200.
            window.location.replace('/products');
        }
    })
})