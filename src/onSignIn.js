export const onSignIn = (email, password = "") => {
    if (email === 'validationtest542@gmail.com'){
        return true
    }

    if (email === 'name@mail.com' && password === 'password') {
        return true;
      }
      return false;
};