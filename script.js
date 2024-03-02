document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const messageContainer = document.getElementById('message');
  
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
  
      if (email === 'name@mail.com' && password === 'password') {
        messageContainer.textContent = 'Login successful!';
        messageContainer.className = 'success'
      } else {
        messageContainer.textContent = 'Invalid email address or password. Please try again.';
        messageContainer.className = 'error'
      }
    });
  });