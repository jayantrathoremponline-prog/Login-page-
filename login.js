
        // PASTE YOUR GOOGLE SCRIPT URL HERE
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzzNQ3MwhnrRwyTS7804Cq5tv8LS8i7cOV4imwbm4MpS-WGLIyDLWwjPlthB2T5pNdCFw/exec'; 

        function toggleForms() {
            document.getElementById('login-form').classList.toggle('hidden');
            document.getElementById('signup-form').classList.toggle('hidden');
            document.getElementById('message').innerText = "";
        }

        function submitForm(action) {
            const userField = action === 'login' ? 'login-user' : 'signup-user';
            const passField = action === 'login' ? 'login-pass' : 'signup-pass';

            const username = document.getElementById(userField).value;
            const password = document.getElementById(passField).value;
            const messageBox = document.getElementById('message');

            if(!username || !password) {
                messageBox.innerText = "Please fill in all fields.";
                messageBox.style.color = "red";
                return;
            }

            messageBox.innerText = "Processing...";
            messageBox.style.color = "black";

            const data = { action: action, username: username, password: password };

            fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.result === 'success') {
                    messageBox.style.color = "green";
                    messageBox.innerText = result.message;
                    
                    if(action === 'signup') {
                        // If signup successful, switch to login view
                        document.getElementById('signup-user').value = '';
                        document.getElementById('signup-pass').value = '';
                        setTimeout(() => toggleForms(), 1500);
                    } else {
                        // --- LOGIN SUCCESS LOGIC ---
                        
                        // 1. Save username to browser memory so the next page knows who logged in
                        localStorage.setItem('campusUser', username);
                        
                        // 2. Redirect to the Campus Print page
                        window.location.href = 'campus_print.html'; 
                    }
                } else {
                    messageBox.style.color = "red";
                    messageBox.innerText = result.message;
                }
            })
            .catch(error => {
                messageBox.style.color = "red";
                messageBox.innerText = "Error connecting to server.";
                console.error('Error:', error);
            });
        }
    

