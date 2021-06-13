window.onload = function () {
    checkSessionValidity();
    loadTiles();
}

function checkSessionValidity() {
    if (getCookie("IsActive") == null || getCookie("IsActive") == "") {
        console.log("Session Expired");
        window.location.replace("./login.html");
    }
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

function getCurrentDate() {
    let currentDate = new Date();
    var dd = String(currentDate.getDate()).padStart(2, '0');
    var mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    var yyyy = currentDate.getFullYear();
    currentDate = yyyy + '-' + mm + '-' + dd;
    return currentDate;
}

async function loadTiles() {
    let currentDate = getCurrentDate();
    document.getElementById("currentDateTag").innerHTML = "&nbsp;&nbsp;" + currentDate;
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
    let noOfCampaigns = 0;
    Object.entries(campaignResponse["records"]).forEach(
        ([key1, value1]) => {
            noOfCampaigns = noOfCampaigns + 1;
        }
    );
    for (let i = 0; i < noOfCampaigns; i++) {
        console.log(campaignResponse["records"][i]);
        if (i == 0) {
            document.getElementById("headingCampaign1").innerHTML = campaignResponse["records"][i]["Name"];
            document.getElementById("startDateCampaign1").innerHTML = "Starting " + campaignResponse["records"][i]["StartDate"];
            document.getElementById("volunteerNeededCampaign1").innerHTML = "Volunteers Req. " + campaignResponse["records"][i]["GW_Volunteers__Volunteers_Still_Needed__c"];
            document.getElementById("typeCampaign1").innerHTML = campaignResponse["records"][i]["Type"];
            document.getElementById("jobsCampaign1").innerHTML = "Total Jobs " + campaignResponse["records"][i]["GW_Volunteers__Volunteer_Jobs__c"];
        } else if (i == 1) {
            document.getElementById("headingCampaign2").innerHTML = campaignResponse["records"][i]["Name"];
            document.getElementById("startDateCampaign2").innerHTML = "Starting " + campaignResponse["records"][i]["StartDate"];
            document.getElementById("volunteerNeededCampaign2").innerHTML = "Volunteers Req. " + campaignResponse["records"][i]["GW_Volunteers__Volunteers_Still_Needed__c"];
            document.getElementById("typeCampaign2").innerHTML = campaignResponse["records"][i]["Type"];
            document.getElementById("jobsCampaign3").innerHTML = "Total Jobs " + campaignResponse["records"][i]["GW_Volunteers__Volunteer_Jobs__c"];
        } else if (i == 2) {
            document.getElementById("headingCampaign3").innerHTML = campaignResponse["records"][i]["Name"];
            document.getElementById("startDateCampaign3").innerHTML = "Starting " + campaignResponse["records"][i]["StartDate"];
            document.getElementById("volunteerNeededCampaign3").innerHTML = "Volunteers Req. " + campaignResponse["records"][i]["GW_Volunteers__Volunteers_Still_Needed__c"];
            document.getElementById("typeCampaign3").innerHTML = campaignResponse["records"][i]["Type"];
            document.getElementById("jobsCampaign3").innerHTML = "Total Jobs " + campaignResponse["records"][i]["GW_Volunteers__Volunteer_Jobs__c"];
        } else if (i == 3) {
            document.getElementById("headingCampaign4").innerHTML = campaignResponse["records"][i]["Name"];
            document.getElementById("startDateCampaign4").innerHTML = "Starting " + campaignResponse["records"][i]["StartDate"];
            document.getElementById("volunteerNeededCampaign4").innerHTML = "Volunteers Req. " + campaignResponse["records"][i]["GW_Volunteers__Volunteers_Still_Needed__c"];
            document.getElementById("typeCampaign4").innerHTML = campaignResponse["records"][i]["Type"];
            document.getElementById("jobsCampaign4").innerHTML = "Total Jobs " + campaignResponse["records"][i]["GW_Volunteers__Volunteer_Jobs__c"];
        }
    }


    if (password == serverPassword) {
        formDiv.style.cssText = "display:none;";
        loader.style.cssText = "display:block;";
        console.log("About to redirect.");
        window.location.replace("./dashboard-home.html");
    }
}