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

function onGoogleSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('Google User signed in: ID - ' + profile.getId() + ', Full Name - ' + profile.getName());
  document.getElementById('message').innerText = 'Google sign-in successful for: ' + profile.getName();
}

function onFacebookSignIn() {
FB.login(function(response) {
    if (response.authResponse) {
        console.log('Facebook User signed in.', response);
        document.getElementById('message').innerText = 'Facebook sign-in successful.';
    } else {
        console.log('User cancelled login or did not fully authorize.');
    }
}, {scope: 'public_profile,email'});
}

window.fbAsyncInit = function() {
FB.init({
    appId      : 'FACEBOOK_APP_ID', // TODO: it will be replaced.
    cookie     : true,
    xfbml      : true,
    version    : 'v11.0'
});
};