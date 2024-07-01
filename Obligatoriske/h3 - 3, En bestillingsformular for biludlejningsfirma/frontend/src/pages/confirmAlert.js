const confirmAlert = (message, title) => {
    if(message != null && title != null){
        document.body.innerHTML = document.body.innerHTML + '<div id="dialogoverlay"></div><div id="dialogbox" class="slit-in-vertical"><div><div id="dialogboxhead"></div><div id="dialogboxbody"></div><div id="dialogboxfoot"></div></div></div>'
        let doverlay = document.getElementById('dialogoverlay')
        let dialog = document.getElementById('dialogbox')
        let winH = window.innerHeight;

        doverlay.style.height = winH+"px";
        doverlay.style.display = "block";

        dialog.style.top = '100px';
        dialog.style.display = "block";

        document.getElementById('dialogboxhead').style.display = 'block';

        if(typeof title === 'undefined') {
            document.getElementById('dialogboxhead').style.display = 'none';
        } else {
            document.getElementById('dialogboxhead').innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> '+ title;
        }
        document.getElementById('dialogboxbody').innerHTML = message;
        document.getElementById('dialogboxfoot').innerHTML = '<button class="pure-material-button-contained active" onclick="window.closeDialog()">OK</button>';

        // Attach closeDialog to the window object
        window.closeDialog = function() {
            document.getElementById('dialogbox').style.display = "none";
            document.getElementById('dialogoverlay').style.display = "none";
        }
    }else{
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
    }
    return;
}   

export default confirmAlert;