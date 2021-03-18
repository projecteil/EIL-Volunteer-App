async function processForm() {

    let formDiv = document.getElementById('msform');
    let confirmEmailDiv = document.getElementById('emailconfirm');
    let errorMsg = document.getElementById('errormsg');
    let firstName = document.getElementById("FirstName").value;
    let lastName = document.getElementById("LastName").value;
    let phoneNumber = document.getElementById("PhoneNumber").value;
    let email = document.getElementById("Email").value;
    let password = document.getElementById("Password").value;
    let dateOfBirth = document.getElementById("DateOfBirth").value;

    if (firstName == "") {
        console.log("Empty");
        errorMsg.innerHTML = "First Name can't be empty";
    } else {
        formDiv.style.cssText = "display: None";
        confirmEmailDiv.style.cssText = "display: block !important"
        dateOfBirth = dateOfBirth.split('/');
        dateOfBirth = dateOfBirth[1] + "/" + dateOfBirth[0] + "/" + dateOfBirth[2];
        dateOfBirth = new Date(dateOfBirth);
        dateOfBirth = dateOfBirth.toISOString();
    }






    let response = await fetch("https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9fTLmJ60pJ5LcM88X.T4cnlgFI6sTtiU0_tQwwMuyjIocVl289zYxysWrm45Y9JSHF0f55z.1SJoYFpkQ&client_secret=E2D30FFD226F098FDC26D1A0FA58581717B97678E30559C77F55C092B7899361&username=project2@eilireland.org&password=OldMonk1234auRJQemePs9mac0guNA7ZrFa", {
        method: "POST",
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        },
    });

    let data = await response.json();
    setTimeout(console.log(data), 8000);
    setTimeout(console.log(data["access_token"]), 13000);

    let contactData = {
        "FirstName": firstName,
        "LastName": lastName,
        "MobilePhone": phoneNumber,
        "Email": email,
        "Passcode__c": password,
        "Birthdate": dateOfBirth,
        "AccountId": "0011t00000ppMtOAAU"
    }

    let responseCreateContact = await fetch('https://eilireland.my.salesforce.com/services/data/v25.0/sobjects/Contact', {
            method: "POST",
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + data["access_token"]
            },
            body: JSON.stringify(contactData),
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));
}

async function processLogIn() {

    let loader = document.getElementById('loader');
    let formDiv = document.getElementById('msform');
    let errorMsg = document.getElementById('errormsg');
    let email = document.getElementById("Email").value;
    let password = document.getElementById("Password").value;

    if (email == "") {
        console.log("Empty");
        errorMsg.innerHTML = "Email can't be empty";
    } else {

        let response = await fetch("https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9fTLmJ60pJ5LcM88X.T4cnlgFI6sTtiU0_tQwwMuyjIocVl289zYxysWrm45Y9JSHF0f55z.1SJoYFpkQ&client_secret=E2D30FFD226F098FDC26D1A0FA58581717B97678E30559C77F55C092B7899361&username=project2@eilireland.org&password=OldMonk1234auRJQemePs9mac0guNA7ZrFa", {
            method: "POST",
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
            },
        });

        let data = await response.json();

        let responseViewContact = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=select+Passcode__c+from+Contact+where+Email+=+'" + email + "'", {
            method: "GET",
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + data["access_token"]
            }
        });

        secretData = await responseViewContact.json();
        setTimeout(console.log(secretData), 8000);
        setTimeout(console.log(secretData["records"]["0"]["Passcode__c"]), 13000);
        let serverPassword = secretData["records"]["0"]["Passcode__c"];

        if (password == serverPassword) {
            formDiv.style.cssText = "display:none;";
            loader.style.cssText = "display:block;";
            console.log("About to redirect.");
            window.location.replace("./dashboard-home.html");

        }
    }

}