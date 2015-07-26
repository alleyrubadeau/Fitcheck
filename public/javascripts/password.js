
function checkPassword(str)
  {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return re.test(str);
  }

  function checkForm(form)
  {
    if(form.email.value == "") {
      alert("Error: Email cannot be blank!");
      form.email.focus();
      return false;
    }
    // re = /^\w+$/;
    // if(!re.test(form.email.value)) {
    //   alert("Error: Username must contain only letters, numbers and underscores!");
    //   form.email.focus();
    //   return false;
    // }
    if(form.password.value != "" && form.password.value == form.pwd2.value) {
      if(!checkPassword(form.password.value)) {
        alert("The password you have entered is not valid!");
        form.password.focus();
        return false;
      }
    }
    else {
      alert("Error: Please check that you've entered and confirmed your password!");
      form.password.focus();
      return false;
    }
    return true;
  }
