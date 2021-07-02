let toggle = false;

function checkSessionValidity() {
    if (getCookie("IsActive") == null || getCookie("IsActive") == "") {
        console.log("Session Expired");
        window.location.replace("./login.html");
    }
}

function notificationToggle() {
    if (toggle) {
        console.log("if", toggle);
        document.getElementById("notification-toggle").style.cssText = "display:none";
        toggle = !toggle;
    } else {
        console.log("else", toggle);
        document.getElementById("notification-toggle").style.cssText = "display:block";
        toggle = !toggle;
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
    document.getElementById("ntfc").innerHTML = "";
    if (noOfEmails > 0) {
        for (let i = 0; i < noOfEmails; i++) {
            document.getElementById("ntfc").innerHTML += '<div class="notification-li"><div class="notification-image"><img src="img/emailnt.svg" ></div><div class="notification-text">' + taskObject["records"][i]["Subject"].substring(7) + '<br><span class="notification-date">Received on ' + taskObject["records"][i]["ActivityDate"] + '</span></div></div>';
        }
    } else {
        console.log("panda");
        document.getElementById("ntfc").innerHTML = '<div class="notification-li"><div class="notification-text" style="text-align:center">No notifications yet!<br><br>We will notify you when something arrives.<img style="width:320px;" src="img/pandajpg.jpg" ></div></div>';
    }
}