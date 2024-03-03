
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Check if any field is empty
    if (!email || !password) {
      alert('Please fill in all fields.');
      return; // Stop the function from proceeding further
    }

    // Validate email format
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return; // Stop the function from proceeding further
    }

    onSignIn(email, password).then(isSignedIn => {
      if (isSignedIn) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        window.location.href = 'success.html'; // Redirect to success page
      } else {
        alert('Invalid email address or password. Please try again.');
      }
    });
  });
});

function validateEmail(email) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}

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


function onSignIn(email, password) {
  if (email === 'name@mail.com' && password === 'password'){
    return true
  }
  else{
    return false
  }
}