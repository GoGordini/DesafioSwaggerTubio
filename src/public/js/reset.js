const form = document.getElementById('resetForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    const responseUser= await fetch('/api/users/reset', {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    });
       if (responseUser.ok) { window.location.replace('/login')} else{
        if (responseUser.status === 401) {window.location.replace('/restore')
       } else {
        Swal.fire({
        icon: 'error',
        title: 'Error de contraseña',
        text: 'La nueva contraseña debe ser diferente de la anterior',
    }).then(() => {
    });}; 
        }
    })