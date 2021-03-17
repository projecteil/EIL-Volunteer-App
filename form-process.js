async function processForm() {

    let formDiv = document.getElementById('msform');
    let confirmEmailDiv = document.getElementById('emailconfirm');
    let firstName = document.getElementById("FirstName").value;
    let lastName = document.getElementById("LastName").value;
    let phoneNumber = document.getElementById("PhoneNumber").value;
    let email = document.getElementById("Email").value;
    let password = document.getElementById("Password").value;
    let dateOfBirth = document.getElementById("DateOfBirth").value;

    formDiv.style.cssText = "display: None";
    confirmEmailDiv.style.cssText = "display: block !important"




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



    // let responseViewContact = await fetch('https://eilireland.my.salesforce.com/services/data/v25.0/sobjects/Contact/0036N000005PKBcQAO', {
    //         method: "GET",
    //         headers: {
    //             "Content-type": "application/json;charset=UTF-8",
    //             "Authorization": "Bearer " + data["access_token"]
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(json => console.log(json))
    //     .catch(err => console.log(err));

    let contactData = {
        "FirstName": firstName,
        "LastName": lastName,
        "MobilePhone": phoneNumber,
        "Email": email,
        "Password__c": password,
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