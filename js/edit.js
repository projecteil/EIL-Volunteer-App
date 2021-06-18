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

    let doNotCall = profileData["records"]["0"]["DoNotCall"];
    let hasOptedOutOfEmail = profileData["records"]["0"]["HasOptedOutOfEmail"];
    document.getElementById('firstName').value = String(profileData["records"]["0"]["Name"]).split(" ")[0];
    document.getElementById('lastName').value = String(profileData["records"]["0"]["Name"]).split(" ")[1];
    document.getElementById('mobile').value = profileData["records"]["0"]["MobilePhone"];
    document.getElementById('email').value = profileData["records"]["0"]["Email"];
    document.getElementById('password').value = profileData["records"]["0"]["Passcode__c"];
    document.getElementById('dateOfBirth').value = profileData["records"]["0"]["Birthdate"];
    document.getElementById('description').value = profileData["records"]["0"]["Description"];
    document.getElementById('street').value = profileData["records"]["0"]["Address__c"];
    document.getElementById('vNotes').value = profileData["records"]["0"]["GW_Volunteers__Volunteer_Notes__c"];
    let volunteerSkills = profileData["records"]["0"]["GW_Volunteers__Volunteer_Skills__c"];
    let volunteerAvailability = profileData["records"]["0"]["GW_Volunteers__Volunteer_Availability__c"];
    console.log(volunteerAvailability);
    if (volunteerSkills != null) {
        if (volunteerSkills.search("Manual labor") > -1) {
            document.getElementById("manualLabour").click();
        }
        if (volunteerSkills.search("Marketing") > -1) {
            document.getElementById("marketing").click();
        }
        if (volunteerSkills.search("Fundraising") > -1) {
            document.getElementById("fundraising").click();
        }
        if (volunteerSkills.search("Event Planning") > -1) {
            document.getElementById("eventPlanning").click();
        }
        if (volunteerSkills.search("Landscaping") > -1) {
            document.getElementById("landscaping").click();
        }
        if (volunteerSkills.search("Computer usage") > -1) {
            document.getElementById("computerUsage").click();
        }
    }
    if (volunteerAvailability.search("Weekdays") > -1) {
        document.getElementById("f-option").click();
    }
    if (volunteerAvailability.search("Weekends") > -1) {
        document.getElementById("s-option").click();
    }
    if (volunteerAvailability.search("Morning") > -1) {
        document.getElementById("mor-option").click();
    }
    if (volunteerAvailability.search("Afternoon") > -1) {
        document.getElementById("aft-option").click();
    }

    if (doNotCall == true) {
        document.getElementById('doNotCall').click();
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

    let skillList = "";
    let availabilityList = "";

    if (document.getElementById("computerUsage").checked) {
        skillList += "Computer usage;";
    }
    if (document.getElementById("manualLabour").checked) {
        skillList += "Manual labor;";
    }
    if (document.getElementById("marketing").checked) {
        skillList += "Marketing;";
    }
    if (document.getElementById("fundraising").checked) {
        skillList += "Fundraising;";
    }
    if (document.getElementById("eventPlanning").checked) {
        skillList += "Event Planning;";
    }
    if (document.getElementById("landscaping").checked) {
        skillList += "Landscaping;";
    }
    if (skillList.endsWith(";")) {
        skillList = skillList.substring(0, skillList.length - 1);
    }

    if (document.getElementById("s-option").checked) {
        availabilityList += "Weekdays;";
    }
    if (document.getElementById("f-option").checked) {
        availabilityList += "Weekends;";
    }
    if (document.getElementById("mor-option").checked) {
        availabilityList += "Morning;";
    }
    if (document.getElementById("aft-option").checked) {
        availabilityList += "Afternoon;";
    }
    if (availabilityList.endsWith(";")) {
        availabilityList = availabilityList.substring(0, availabilityList.length - 1);
    }
    console.log(availabilityList);
    let contactData = {
        "FirstName": document.getElementById('firstName').value,
        "LastName": document.getElementById('lastName').value,
        "MobilePhone": document.getElementById('mobile').value,
        "Email": document.getElementById('email').value,
        "Passcode__c": document.getElementById('password').value,
        "Birthdate": document.getElementById('dateOfBirth').value,
        "Description": document.getElementById('description').value,
        "Address__c": document.getElementById('street').value,
        "GW_Volunteers__Volunteer_Skills__c": skillList,
        "GW_Volunteers__Volunteer_Notes__c": document.getElementById('vNotes').value,
        "DoNotCall": document.getElementById('doNotCall').checked,
        "HasOptedOutOfEmail": document.getElementById('doNotEmail').checked,
        "GW_Volunteers__Volunteer_Availability__c": availabilityList,
        "AccountId": "0011t00000ppMtOAAU",
    }
    saveNow(contactData);
    window.scroll({
        top: 0,
        behavior: 'smooth'
    });
    document.getElementById("cookieBanner").style.cssText = "display:block;";
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
    let responseCreateContact = await fetch('https://eilireland.my.salesforce.com/services/data/v25.0/sobjects/Contact/' + secretData["records"]["0"]["Id"] + '/', {
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