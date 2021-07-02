function checkSessionValidity() {
    if (getCookie("IsActive") == null || getCookie("IsActive") == "") {
        console.log("Session Expired");
        window.location.replace("./login.html");
    }
}

async function loadNotifications() {
    let currentDate = getCurrentDate();
    let noOfEmails = 0;
    document.getElementById("currentDateTag").innerHTML = "&nbsp;&nbsp;" + currentDate;
    let email = getCookie("Id");

    let responseViewContact = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=select+Id+from+Contact+where+Email+=+'" + email + "'", {
        method: "GET",
        mode: 'cors',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + await getToken()
        }
    });

    let secretData = await responseViewContact.json();
    let Id = secretData["records"]["0"]["Id"];

    let taskData = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=SELECT+Description,Subject,ActivityDate+FROM+TASK+WHERE+WhoId='" + Id + "'", {
        method: "GET",
        mode: 'cors',
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + await getToken()
        }
    });

    taskObject = await taskData.json();
    console.log(taskObject);
    Object.entries(taskObject["records"]).forEach(
        ([key1, value1]) => {
            noOfEmails = noOfEmails + 1;
        }
    );
    let notificationsList = [];
    let dateList = [];
    document.getElementById("ntfc").innerHTML = "";
    for (let i = 0; i < noOfEmails; i++) {
        notificationsList.push(taskObject["records"][i]["Subject"]);
        dateList.push(taskObject["records"][i]["ActivityDate"]);
    }
    console.log(notificationsList);

    document.getElementById("ntfc").innerHTML += '<div class="notification-li"><div class="notification-image"><img src="img/emailnt.svg" ></div><div class="notification-text">' + notificationsList[0].substring(7) + '<br>' + dateList[0] + '</div></div>';
    document.getElementById("ntfc").innerHTML += '<div class="notification-li"><div class="notification-text">' + notificationsList[1].substring(7) + '</div></div>';
}