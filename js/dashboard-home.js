window.onload = function () {
    processLogIn();
}

function getCurrentDate() {
    let currentDate = new Date();
    var dd = String(currentDate.getDate()).padStart(2, '0');
    var mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    var yyyy = currentDate.getFullYear();
    currentDate = yyyy + '-' + mm + '-' + dd;
    return currentDate;
}

async function processLogIn() {
    let currentDate = getCurrentDate();
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
    let campaignData = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=select+Name,Type,StartDate,GW_Volunteers__Volunteers_Still_Needed__c,GW_Volunteers__Volunteer_Jobs__c+from+Campaign+Where+IsActive+=+True+And+EndDate+>=" + currentDate, {
        method: "GET",
        mode: 'cors',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + data["access_token"]
        }
    });

    campaignResponse = await campaignData.json();
    console.log(campaignResponse);
    Object.entries(campaignResponse).forEach(
        ([key, value]) => {
            if (key == "records")
                console.log(key, value);
        }
    );

    setTimeout(console.log(campaignResponse["records"]["0"]["Passcode__c"]), 13000);
    let serverPassword = secretData["records"]["0"]["Passcode__c"];

    if (password == serverPassword) {
        formDiv.style.cssText = "display:none;";
        loader.style.cssText = "display:block;";
        console.log("About to redirect.");
        window.location.replace("./dashboard-home.html");
    }
}