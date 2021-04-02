window.addEventListener('load', async function () {
    console.log("Window Loaded");
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

    let responseGetProfile = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=Select+Name,+Birthdate,+Description,+Passcode__c,+Email,+MobilePhone,+HasOptedOutOfEmail,+DoNotCall,+npsp__Do_Not_Contact__c,+Address__c,+GW_Volunteers__Volunteer_Skills__c+FROM+Contact+Where+Email+=+'ansh45@gmail.com'", {
        method: "GET",
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + data["access_token"]
        }
    });

    profileData = await responseGetProfile.json();
    setTimeout(console.log(profileData), 8000);
    let doNotCall = profileData["records"]["0"]["DoNotCall"];
    let volunteerSkills = profileData["records"]["0"]["GW_Volunteers__Volunteer_Skills__c"];
    let hasOptedOutOfEmail = profileData["records"]["0"]["HasOptedOutOfEmail"];
    let doNotContact = profileData["records"]["0"]["npsp__Do_Not_Contact__c"];
    console.log(typeof (doNotCall), doNotContact, hasOptedOutOfEmail);

    document.getElementById('firstName').value = String(profileData["records"]["0"]["Name"]).split(" ")[0];
    document.getElementById('lastName').value = String(profileData["records"]["0"]["Name"]).split(" ")[1];
    document.getElementById('mobile').value = profileData["records"]["0"]["MobilePhone"];
    document.getElementById('email').value = profileData["records"]["0"]["Email"];
    document.getElementById('password').value = profileData["records"]["0"]["Passcode__c"];
    document.getElementById('dateOfBirth').value = profileData["records"]["0"]["Birthdate"];
    document.getElementById('description').value = profileData["records"]["0"]["Description"];
    document.getElementById('street').value = profileData["records"]["0"]["Address__c"];

    console.log(String(name).split(" ")[0]);

});