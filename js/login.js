function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function highlightErrorFields(elementId) {
    document.getElementById(elementId).focus();
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

async function processLogIn() {
    let loader = document.getElementById('loader');
    let formDiv = document.getElementById('msform');
    let errorMsg = document.getElementById('errormsg');
    let email = document.getElementById("Email").value;
    let password = document.getElementById("Password").value;
    const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email == "") {
        errorMsg.innerHTML = "Email address can't be empty";
        highlightErrorFields("Email");
    } else if (email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null) {
        errorMsg.innerHTML = "Please enter the valid email ID";
        highlightErrorFields("Email");
    } else if (password == "") {
        errorMsg.innerHTML = "Password can't be empty";
        highlightErrorFields("Password");
    } else {

        let responseViewContact = await fetch("https://eilireland.my.salesforce.com/services/data/v25.0/query?q=select+Passcode__c+from+Contact+where+Email+=+'" + email + "'", {
            method: "GET",
            mode: 'cors',
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + await getToken()
            }
        });

        secretData = await responseViewContact.json();
        let serverPassword = secretData["records"]["0"]["Passcode__c"];

        if (password == serverPassword) {
            formDiv.style.cssText = "display:none;";
            loader.style.cssText = "display:block;";
            console.log("About to redirect.");
            setCookie("IsActive", "active", 30);
            setCookie("Id", email, 300);
            window.location.replace("./dashboard-home.html");
        } else {
            errorMsg.innerHTML = "Your email or password is incorrect. Please try again.";
            highlightErrorFields("Password");
        }
    }
}

function closeBanner() {
    document.getElementById("cookieBanner").innerHTML = "";
    document.getElementById("cookieBanner").style.cssText = "display:none";
}