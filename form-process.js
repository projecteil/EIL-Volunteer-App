window.onload = function () {
    document.getElementById("ContactPreference").addEventListener("focus", processForm);
}

function processForm() {
    let firstName = document.getElementById("FirstName").value;
    let lastName = document.getElementById("LastName").value;
    let phoneNumber = document.getElementById("PhoneNumber").value;
    let email = document.getElementById("Email").value;
    let password = document.getElementById("Password").value;
    let bio = document.getElementById("Bio").value;
    let skills = document.getElementById("Skills").value;
    let dateOfBirth = document.getElementById("DateOfBirth").value;
    let contactPreference = document.getElementById("ContactPreference").value;
    console.log(firstName);
    console.log(lastName);
    console.log(phoneNumber);
    console.log(email);
    console.log(password);
    console.log(bio);
    fetch('https://eilireland.my.salesforce.com/services/data/v25.0/sobjects/Contact/0036N000005PKBcQAO', {
            mode: 'no-cors',
            method: "GET",
            headers: {
                mode: 'no-cors',
                "Content-type": "application/json;charset=UTF-8",
                "Authorization": "Bearer 00D1t000000DDG9!AR0AQHj.85NxoR7P1QUwMom3K3ZRwkgWqZAw2Vwj215XlFNZISCZqwv8CZ5CAtWQGLa6Yct3rGJms5dY.JdQOubWahSBLKo6"
            }
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));
}