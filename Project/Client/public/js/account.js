// generate the form to create an account
function createAccountForm() {
    // Create form element
    let formElement = document.createElement('form');
    formElement.appendChild(document.createElement('br'));

    // Create input for first name
    let firstNameLabel = document.createElement('label');
    firstNameLabel.textContent = 'First Name:';
    formElement.appendChild(firstNameLabel);

    let firstNameInput = document.createElement('input');
    firstNameInput.type = 'text';
    firstNameInput.name = 'name';
    firstNameInput.required = true;
    formElement.appendChild(firstNameInput);
    formElement.appendChild(document.createElement('br'));

    // Create input for last name
    let lastNameLabel = document.createElement('label');
    lastNameLabel.textContent = '\nLast Name:';
    formElement.appendChild(lastNameLabel);

    let lastNameInput = document.createElement('input');
    lastNameInput.type = 'text';
    lastNameInput.name = 'name';
    lastNameInput.required = true;
    formElement.appendChild(lastNameInput);
    formElement.appendChild(document.createElement('br'));

    // Create input for date of birth
    let dobLabel = document.createElement('label');
    dobLabel.textContent = 'Date of Birth:';
    formElement.appendChild(dobLabel);

    let dobInput = document.createElement('input');
    dobInput.type = 'date';
    dobInput.name = 'dob';
    dobInput.required = true;
    formElement.appendChild(dobInput);
    formElement.appendChild(document.createElement('br'));

    // Create input for email
    let emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email:';
    formElement.appendChild(emailLabel);

    let emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.required = true;
    formElement.appendChild(emailInput);
    formElement.appendChild(document.createElement('br'));

    // Create input for password
    let passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Password:';
    formElement.appendChild(passwordLabel);

    let passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.name = 'password';
    passwordInput.required = true;
    formElement.appendChild(passwordInput);
    formElement.appendChild(document.createElement('br'));

    // Create input for password confirmation
    let confirmPasswordLabel = document.createElement('label');
    confirmPasswordLabel.textContent = 'Confirm Password:';
    formElement.appendChild(confirmPasswordLabel);

    let confirmPasswordInput = document.createElement('input');
    confirmPasswordInput.type = 'password';
    confirmPasswordInput.name = 'confirmPassword';
    confirmPasswordInput.required = true;
    formElement.appendChild(confirmPasswordInput);
    formElement.appendChild(document.createElement('br'));

    // Create error message element for password confirmation
    let confirmPasswordError = document.createElement('div');
    confirmPasswordError.className = 'error-message';
    formElement.appendChild(confirmPasswordError);

    // Create dropdown list for security question
    let securityQuestionLabel = document.createElement('label');
    securityQuestionLabel.textContent = 'Security Question:';
    formElement.appendChild(securityQuestionLabel);

    let securityQuestionSelect = document.createElement('select');
    securityQuestionSelect.name = 'securityQuestion';
    securityQuestionSelect.required = true;
    let securityQuestions = ['What is your mother\'s maiden name?', 'What is the name of your first pet?',
        'In what city were you born?', 'What was the make of your first car?'];
    for (let i = 0; i < securityQuestions.length; i++) {
        let option = document.createElement('option');
        option.value = securityQuestions[i];
        option.text = securityQuestions[i];
        securityQuestionSelect.appendChild(option);
    }
    formElement.appendChild(securityQuestionSelect);
    formElement.appendChild(document.createElement('br'));

    // Create input for security answer
    let answerLabel = document.createElement('label');
    answerLabel.textContent = 'Question Answer:';
    formElement.appendChild(answerLabel);

    let answerInput = document.createElement('input');
    answerInput.type = 'password';
    answerInput.name = 'password';
    answerInput.required = true;
    formElement.appendChild(answerInput);
    formElement.appendChild(document.createElement('br'));

    // Create submit button
    let submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    formElement.appendChild(document.createElement('br'));
    formElement.appendChild(submitButton);

    // Create clear button
    let clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.textContent = 'Clear';
    clearButton.addEventListener('click', function () {
        formElement.reset(); // Reset the form fields
        confirmPasswordError.textContent = ''; // Clear the error message
    });
    formElement.appendChild(clearButton);

    // Create cancel button
    let cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function () {
        // Hide the form
        let createFormContainer = document.getElementById('createForm');
        createFormContainer.style.display = 'none';
    });
    formElement.appendChild(cancelButton);

    // Event listener for form submission to make sure password and password confirmation match
    // Event listener for form submission
    formElement.addEventListener('submit', function (event) {
        // Check if passwords match
        let password = passwordInput.value;
        let confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            event.preventDefault(); // Prevent the form from being submitted
            confirmPasswordError.textContent = 'The passwords do not match. Please try again.';
        } else {
            confirmPasswordError.textContent = ''; // Clear the error message
            formElement.reset(); // Reset the form fields
        }
    });

    // Insert form into the page
    let createFormFormContainer = document.getElementById('createForm');
    createFormFormContainer.innerHTML = ''; // Clear existing content
    createFormFormContainer.appendChild(formElement);

    // Make the form visible
    createFormFormContainer.style.display = 'block';
}