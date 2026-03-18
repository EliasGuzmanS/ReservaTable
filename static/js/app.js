// app.js - Authentication & Form Handling

document.addEventListener('DOMContentLoaded', () => {
    // Auth State Observer
    if(window.auth) {
        window.auth.onAuthStateChanged((user) => {
            const loginLink = document.getElementById('login-link');
            const logoutLink = document.getElementById('logout-link');
            const adminLink = document.getElementById('admin-link');

            if (user) {
                loginLink.style.display = 'none';
                logoutLink.style.display = 'block';
                // Simple admin check based on email
                if (user.email === 'admin@utch.edu.mx') {
                    adminLink.style.display = 'block';
                } else {
                    adminLink.style.display = 'none';
                }
            } else {
                loginLink.style.display = 'block';
                logoutLink.style.display = 'none';
                adminLink.style.display = 'none';
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-link');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.auth.signOut().then(() => {
                window.location.href = '/';
            });
        });
    }

    // Login Form logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('authError');
            
            errorMsg.textContent = 'Iniciando sesión...';
            window.auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    if (user.email === 'admin@utch.edu.mx') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/';
                    }
                })
                .catch((error) => {
                    errorMsg.textContent = "Error: " + error.message;
                    console.error('Error logging in:', error);
                });
        });
    }

    // Reservation Form logic
    const reserveForm = document.getElementById('reserveForm');
    if (reserveForm) {
        reserveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const table = document.getElementById('selectedTable').value;
            const date = document.getElementById('reserveDate').value;
            const time = document.getElementById('reserveTime').value;
            const people = document.getElementById('reservePeople').value;
            const statusBox = document.getElementById('reservationStatus');

            if (table === '' || table === 'Ninguna') {
                statusBox.style.color = 'red';
                statusBox.textContent = 'Por favor selecciona una mesa en el mapa.';
                return;
            }

            const user = window.auth ? window.auth.currentUser : null;
            const userId = user ? user.uid : 'anon';
            const userEmail = user ? user.email : 'anonimo@example.com';

            const reservationData = {
                table: table,
                date: date,
                time: time,
                people: parseInt(people),
                uid: userId,
                email: userEmail,
                status: 'Pendiente',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            statusBox.style.color = '#007A33';
            statusBox.textContent = 'Guardando reserva...';

            if(window.db && window.firebaseConfig.apiKey !== "ENTRA_TU_API_KEY_AQUI") {
                window.db.collection("reservations").add(reservationData)
                .then(() => {
                    statusBox.textContent = '¡Reserva confirmada exitosamente!';
                    reserveForm.reset();
                    document.getElementById('selectedTable').value = '';
                })
                .catch((error) => {
                    console.warn('Firebase error', error);
                    statusBox.textContent = 'Error al guardar reserva.';
                });
            } else {
                // Modo fallback si no hay firebase con credenciales
                console.warn('Modo sin base de datos real.');
                statusBox.textContent = '¡Reserva recibida! (Simulación local por falta de llaves Firebase)';
                setTimeout(() => {
                    reserveForm.reset();
                    document.getElementById('selectedTable').value = '';
                    statusBox.textContent = '';
                }, 3000);
            }
        });
    }

    // Admin table logic
    const reservationsBody = document.getElementById('reservationsBody');
    if (reservationsBody && window.db && window.firebaseConfig.apiKey !== "ENTRA_TU_API_KEY_AQUI") {
        window.db.collection("reservations").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
            reservationsBody.innerHTML = '';
            if(snapshot.empty) {
                reservationsBody.innerHTML = '<tr><td colspan="6">No hay reservas registradas.</td></tr>';
            }
            snapshot.forEach((doc) => {
                const data = doc.data();
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${data.email}</td>
                    <td>${data.table}</td>
                    <td>${data.date}</td>
                    <td>${data.time}</td>
                    <td>${data.people}</td>
                    <td><strong style="color:var(--primary-green)">${data.status}</strong></td>
                `;
                reservationsBody.appendChild(tr);
            });
        }, (error) => {
            console.error("Firebase fetch error", error);
            reservationsBody.innerHTML = '<tr><td colspan="6" style="color:red;">Error de lectura Firebase o sin permisos configurados.</td></tr>';
        });
    } else if (reservationsBody) {
        reservationsBody.innerHTML = '<tr><td colspan="6">Esperando conexión Base de Datos... Configura Firebase en firebase-config.js</td></tr>';
    }
});
