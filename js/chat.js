let chatEnabled = false;

function chatToggle() {
    if (chatEnabled) {
        document.getElementById("chat-toggle").style.cssText = "opacity:0";
        chatEnabled = !chatEnabled;
    } else {
        document.getElementById("chat-toggle").style.cssText = "opacity:1";
        chatEnabled = !chatEnabled;
    }
}

async function loadChats() {
    let currentDate = getCurrentDate();
    let noOfVolunteers = 0;
    document.getElementById("currentDateTag").innerHTML = "&nbsp;&nbsp;" + currentDate;
    let email = getCookie("Id");

    let contactListData = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=select+id,name+from+Contact+where+GW_Volunteers__Volunteer_Status__c='Active'", {
        method: "GET",
        mode: 'cors',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + await getToken()
        }
    });

    let contactListObj = await contactListData.json();
    console.log("contacts...  ", contactListObj);
    let Id = secretData["records"]["0"]["Id"];

    Object.entries(contactListObj["records"]).forEach(
        ([key1, value1]) => {
            noOfVolunteers = noOfVolunteers + 1;
        }
    );
    document.getElementById("ntfc").innerHTML = "";
    if (noOfVolunteers > 0) {
        document.getElementById("notification-header").innerHTML = "Notifications";
        for (let i = 0; i < noOfVolunteers; i++) {
            console.log(contactListObj["records"][i]["Name"]);
            //document.getElementById("ntfc").innerHTML += '<div class="notification-li"><div class="notification-image"><img src="img/emailnt.svg" ></div><div class="notification-text">' + taskObject["records"][i]["Subject"].substring(7) + '<br><span class="notification-date">Received on ' + taskObject["records"][i]["ActivityDate"] + '</span></div></div>';
        }
    } else {
        console.log("panda");
        document.getElementById("notification-header").innerHTML = "No notifications yet!";
        document.getElementById("ntfc").innerHTML = '<div class="notification-li"><div class="notification-text" style="text-align:center"><img style="width:260px;" src="img/pandajpg.jpg" ><br><br>We will notify you when something arrives.</div></div>';
    }
}