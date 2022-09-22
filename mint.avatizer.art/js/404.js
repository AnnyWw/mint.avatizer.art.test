var endDate = 0;
var redirectUrl = "/";

function setEndDate(_date){
    endDate = _date;
}

function setredirectUrl(_url){
    redirectUrl = _url;
}

$(document).ready(function () {
 
 	setEndDate(date_new);
	setredirectUrl(redirectTo);
	    
	function get_timer() {
    
		endDate = endDate - 1;

		if(endDate > 0) {

			$("#redirect_after").html(endDate);
			
			setTimeout(get_timer,1000);
        
		}
		else {
			document.location.href = redirectUrl;
		}
	}

	if(endDate > 0){	
		setTimeout(get_timer,1000);
	}




});