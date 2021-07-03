window.onload = function () {
    checkSessionValidity();
    loadTiles();
    getVolunteerStats();
    loadChats();
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

async function getVolunteerStats() {
    let vArray = [];
    let realActiveCount = 0;
    let position = 0;
    let vHoursCompleted = 0;
    let vRank = 0;
    let vManagerNotes = "";
    let emailId = getCookie("Id");

    let volunteerStats = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=select+GW_Volunteers__Volunteer_Hours__c,email,GW_Volunteers__Volunteer_Manager_Notes__c+from+Contact+where+GW_Volunteers__Volunteer_Status__c+=+'active'", {
        method: "GET",
        mode: 'cors',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + await getToken()
        }
    });

    volunteerStatsResponse = await volunteerStats.json();
    for (let i = 0; i < volunteerStatsResponse["totalSize"]; i++) {
        vArray.push([volunteerStatsResponse["records"][i]["GW_Volunteers__Volunteer_Hours__c"], volunteerStatsResponse["records"][i]["Email"], volunteerStatsResponse["records"][i]["GW_Volunteers__Volunteer_Manager_Notes__c"]]);
    }
    vArray.sort();
    for (let j = volunteerStatsResponse["totalSize"] - 1; j >= 0; j--) {
        if (vArray[j][1] == emailId) {
            position = volunteerStatsResponse["totalSize"] - j;
            vHoursCompleted = vArray[j][0];
            vManagerNotes = vArray[j][2];
        }
        if (vArray[j][0] > 0) {
            realActiveCount = realActiveCount + 1;
        }
    }

    if (position <= realActiveCount)
        document.getElementById("rank").innerHTML = "<span>" + position + "</span> Volunteer Rank";
    else
        document.getElementById("rank").innerHTML = "<span>" + (realActiveCount + 1) + "</span> Volunteer Rank";

    if (vHoursCompleted < 5) {
        document.getElementById("leaderRank").innerHTML = "<span style='margin-bottom:25px'><i class='fas fa-child fa-xs'></i></span>Toddler";
    } else if (vHoursCompleted < 10) {
        document.getElementById("leaderRank").innerHTML = "<span style='margin-bottom:25px'><i class='fab fa-earlybirds fa-xs'></i></span>Novice";
    } else if (vHoursCompleted < 15) {
        document.getElementById("leaderRank").innerHTML = "<span style='margin-bottom:25px'><i class='fas fa-dragon fa-xs'></i></span>Swift";
    } else if (vHoursCompleted < 20) {
        document.getElementById("leaderRank").innerHTML = "<span style='margin-bottom:25px'><i class='fas fa-user-astronaut fa-xs'></i></span>Mettler";
    } else if (vHoursCompleted < 25) {
        document.getElementById("leaderRank").innerHTML = "<span style='margin-bottom:25px'><i class='fas fa-biking fa-xs'></i></span>Drifter";
    } else {
        document.getElementById("leaderRank").innerHTML = "<span style='margin-bottom:25px'><i class='fas fa-user-ninja fa-xs'></i></span>Ninja";
    }

    document.getElementById("hoursCompleted").innerHTML = "<span>" + vHoursCompleted + "</span> Hours Volunteered";
    document.getElementById("managerNotes").innerHTML = "<span style='font-size:16px'>" + vManagerNotes + "</span> Your Feedback";
}

async function loadTiles() {
    let currentDate = getCurrentDate();
    let noOfCampaigns = 0;
    document.getElementById("currentDateTag").innerHTML = "&nbsp;&nbsp;" + currentDate;

    let campaignData = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=select+Name,Type,StartDate,GW_Volunteers__Volunteers_Still_Needed__c,GW_Volunteers__Volunteer_Jobs__c+from+Campaign+Where+IsActive+=+True+And+EndDate+>=" + currentDate, {
        method: "GET",
        mode: 'cors',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + await getToken()
        }
    });

    campaignResponse = await campaignData.json();
    Object.entries(campaignResponse["records"]).forEach(
        ([key1, value1]) => {
            noOfCampaigns = noOfCampaigns + 1;
        }
    );

    for (let i = 0; i < noOfCampaigns; i++) {
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
}

async function editProfile() {

    window.location.replace("./edit.html");
}