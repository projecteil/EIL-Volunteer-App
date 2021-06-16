async function processForm() {

    let formDiv = document.getElementById('msform');
    let confirmEmailDiv = document.getElementById('emailconfirm');
    let errorMsg = document.getElementById('errormsg');
    let errorIcon = document.getElementById('erroricon');
    let firstName = document.getElementById("FirstName").value;
    let lastName = document.getElementById("LastName").value;
    let phoneNumber = document.getElementById("PhoneNumber").value;
    let email = document.getElementById("Email").value;
    let password = document.getElementById("Password").value;
    let dateOfBirth = document.getElementById("DateOfBirth").value;

    if (firstName == "") {
        console.log("Please enter first name.");
        errorMsg.innerHTML = "Please enter first name.";
        highlightErrorFields("FirstName");
    } else if (lastName == "") {
        console.log("Please enter last Name.");
        errorMsg.innerHTML = "Please enter last name.";
        highlightErrorFields("LastName");
    } else if (phoneNumber == "") {
        console.log("Please enter your phone number.");
        errorMsg.innerHTML = "Please enter your phone number.";
        highlightErrorFields("PhoneNumber");
    } else if (phoneNumber.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/) == null || phoneNumber.length > 15 || phoneNumber.length < 9) {
        console.log("Please enter a valid phone number containing only {0-9,(,),+,-}.");
        errorMsg.innerHTML = "Please enter a valid phone number containing only {0-9,(,),+,-}.";
        highlightErrorFields("PhoneNumber");
    } else if (email == "") {
        console.log("Please enter your email address.");
        errorMsg.innerHTML = "Please enter your email address.";
        highlightErrorFields("Email");
    } else if (email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null) {
        console.log("Please enter a valid email address.");
        errorMsg.innerHTML = "Please enter a valid email address.";
        highlightErrorFields("Email");
    } else if (dateOfBirth == "") {
        console.log("Please enter the date of birth.");
        errorMsg.innerHTML = "Please enter the date of birth.";
        highlightErrorFields("DateOfBirth");
    } else if (dateOfBirth.match(/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/\-]\d{4}$/) == null || dateOfBirth.length != 10) {
        console.log("Please enter a valid date of birth in DD/MM/YYYY format.");
        errorMsg.innerHTML = "Please enter a valid date of birth in DD/MM/YYYY format.";
        highlightErrorFields("DateOfBirth");
    } else if (password == "") {
        console.log("Please enter  the password.");
        errorMsg.innerHTML = "Please enter the password.";
        highlightErrorFields("Password");
    } else if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/) == null) {
        console.log("Please enter a valid password having minimum eight characters, at least one uppercase letter, one lowercase letter and one number.");
        errorMsg.innerHTML = "Please enter a valid password having minimum eight characters, at least one uppercase letter, one lowercase letter and one number.";
        highlightErrorFields("Password");
    } else {
        formDiv.style.cssText = "display: None";
        confirmEmailDiv.style.cssText = "display: block !important"
        dateOfBirth = dateOfBirth.split('/');
        dateOfBirth = dateOfBirth[1] + "/" + dateOfBirth[0] + "/" + dateOfBirth[2];
        dateOfBirth = new Date(dateOfBirth);
        dateOfBirth = dateOfBirth.toISOString();
        let contactData = {
            "FirstName": firstName,
            "LastName": lastName,
            "MobilePhone": phoneNumber,
            "Email": email,
            "Passcode__c": password,
            "Birthdate": dateOfBirth,
            "AccountId": "0011t00000ppMtOAAU",
            "GW_Volunteers__Volunteer_Status__c": 'Active'
        }
        registerNow(contactData);
    }
}

function highlightErrorFields(elementId) {
    document.getElementById(elementId).focus();
}

function resetErrorFields() {
    document.getElementById("FirstName").style.cssText = "border: 1px solid #ccc";
    document.getElementById("LastName").style.cssText = "border: 1px solid #ccc";
    document.getElementById("PhoneNumber").style.cssText = "border: 1px solid #ccc";
    document.getElementById("Email").style.cssText = "border: 1px solid #ccc";
    document.getElementById("Password").style.cssText = "border: 1px solid #ccc";
    document.getElementById("DateOfBirth").style.cssText = "border: 1px solid #ccc";
}
async function getToken() {
    let response = await fetch("https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9fTLmJ60pJ5LcM88X.T4cnlgFI6sTtiU0_tQwwMuyjIocVl289zYxysWrm45Y9JSHF0f55z.1SJoYFpkQ&client_secret=E2D30FFD226F098FDC26D1A0FA58581717B97678E30559C77F55C092B7899361&username=project2@eilireland.org&password=Secureit123AYfrE3tYJC7OVZtTEg0hgDkI", {
        method: "POST",
        mode: 'cors',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        },
    });

    let data = await response.json();
    return await data["access_token"];
}

async function registerNow(contactData) {

    let responseCreateContact = await fetch('https://eilireland.my.salesforce.com/services/data/v25.0/sobjects/Contact', {
            method: "POST",
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + await getToken()
            },
            body: JSON.stringify(contactData),
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));
}