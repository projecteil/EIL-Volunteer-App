window.addEventListener('load', async function () {

    let email = getCookie("Id");
    console.log("Document is loaded, now fetching the data for ", email);
    let responseGetProfile = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=Select+Name,+Birthdate,+Description,+Passcode__c,+Email,+MobilePhone,+HasOptedOutOfEmail,+DoNotCall,+npsp__Do_Not_Contact__c,+Address__c,+GW_Volunteers__Volunteer_Skills__c,+GW_Volunteers__Volunteer_Notes__c,+GW_Volunteers__Volunteer_Availability__c+FROM+Contact+Where+Email='" + email + "'", {
        method: "GET",
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + await getToken()
        }
    });

    profileData = await responseGetProfile.json();
    console.log(profileData);

    let doNotCall = profileData["records"]["0"]["DoNotCall"];
    let hasOptedOutOfEmail = profileData["records"]["0"]["HasOptedOutOfEmail"];
    let doNotContact = profileData["records"]["0"]["npsp__Do_Not_Contact__c"];
    let volunteerSkills = profileData["records"]["0"]["GW_Volunteers__Volunteer_Skills__c"];
    let volunteerAvailability = profileData["records"]["0"]["GW_Volunteers__Volunteer_Availability__c"];
    document.getElementById('firstName').value = String(profileData["records"]["0"]["Name"]).split(" ")[0];
    document.getElementById('lastName').value = String(profileData["records"]["0"]["Name"]).split(" ")[1];
    document.getElementById('mobile').value = profileData["records"]["0"]["MobilePhone"];
    document.getElementById('email').value = profileData["records"]["0"]["Email"];
    document.getElementById('password').value = profileData["records"]["0"]["Passcode__c"];
    document.getElementById('dateOfBirth').value = profileData["records"]["0"]["Birthdate"];
    document.getElementById('description').value = profileData["records"]["0"]["Description"];
    document.getElementById('street').value = profileData["records"]["0"]["Address__c"];
    document.getElementById('vNotes').value = profileData["records"]["0"]["GW_Volunteers__Volunteer_Notes__c"];

    if (doNotCall == true) {
        document.getElementById('doNotCall').click();
    }
    if (doNotContact == true) {
        document.getElementById('doNotContact').click();
    }
    if (hasOptedOutOfEmail == true) {
        document.getElementById('doNotEmail').click();
    }
});

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

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function pushToSalesforce() {
    let contactData = {
        "FirstName": document.getElementById('firstName').value,
        "LastName": document.getElementById('lastName').value,
        "MobilePhone": document.getElementById('mobile').value,
        "Email": document.getElementById('email').value,
        "Passcode__c": document.getElementById('password').value,
        "Birthdate": document.getElementById('dateOfBirth').value,
        "Description": document.getElementById('description').value,
        "Address__c": document.getElementById('street').value,
        "AccountId": "0011t00000ppMtOAAU",
    }
    console.log(contactData);
    saveNow(contactData);
    let abc = "document.getElementById('vNotes').value; document.getElementById('doNotCall'); document.getElementById('doNotContact'); document.getElementById('doNotEmail').click()";
}

async function saveNow(contactData) {

    let email = getCookie("Id");
    let responseViewContact = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=select+Id+from+Contact+where+Email+=+'" + email + "'", {
        method: "GET",
        mode: 'cors',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + await getToken()
        }
    });

    secretData = await responseViewContact.json();

    let responseCreateContact = await fetch('https://eilireland.my.salesforce.com/services/data/v25.0/sobjects/Contact/' + secretData["records"]["0"]["Id"], {
            method: "PATCH",
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