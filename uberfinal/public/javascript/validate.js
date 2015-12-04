/**
 * New node file
 */
$(document).ready(function() {
  function checkZipCode() {
	var zipCode = $(".zipcode").val();
	var zipCodeCheck = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
	if (!zipCodeCheck.test(zipCode)) alert("Error!Wrong zip code format! Please check it");
  }
  
  function checkEmailFormat() {
	var email = $('.email').val();
	var emailCheck = /[_a-zA-Z\d\-\.]+@[_a-zA-Z\d\-]+(\.[_a-zA-Z\d\-]+)+$/;
	if (!emailCheck.test(email)) alert("Error!Wrong email format! Please check it");
  }
  
  function ValidState() {
	
	var state = $('#state').val();
	
	var states = {
	  "AL" : "Alabama",
	  "AK" : "Alaska",
	  "AS" : "American Samoa",
	  "AZ" : "Arizona",
	  "AR" : "Arkansas",
	  "CA" : "California",
	  "CO" : "Colorado",
	  "CT" : "Connecticut",
	  "DE" : "Delaware",
	  "DC" : "District Of Columbia",
	  "FM" : "Federated States Of Micronesia",
	  "FL" : "Florida",
	  "GA" : "Georgia",
	  "GU" : "Guam",
	  "HI" : "Hawaii",
	  "ID" : "Idaho",
	  "IL" : "Illinois",
	  "IN" : "Indiana",
	  "IA" : "Iowa",
	  "KS" : "Kansas",
	  "KY" : "Kentucky",
	  "LA" : "Louisiana",
	  "ME" : "Maine",
	  "MH" : "Marshall Islands",
	  "MD" : "Maryland",
	  "MA" : "Massachusetts",
	  "MI" : "Michigan",
	  "MN" : "Minnesota",
	  "MS" : "Mississippi",
	  "MO" : "Missouri",
	  "MT" : "Montana",
	  "NE" : "Nebraska",
	  "NV" : "Nevada",
	  "NH" : "New Hampshire",
	  "NJ" : "New Jersey",
	  "NM" : "New Mexico",
	  "NY" : "New York",
	  "NC" : "North Carolina",
	  "ND" : "North Dakota",
	  "MP" : "Northern Mariana Islands",
	  "OH" : "Ohio",
	  "OK" : "Oklahoma",
	  "OR" : "Oregon",
	  "PW" : "Palau",
	  "PA" : "Pennsylvania",
	  "PR" : "Puerto Rico",
	  "RI" : "Rhode Island",
	  "SC" : "South Carolina",
	  "SD" : "South Dakota",
	  "TN" : "Tennessee",
	  "TX" : "Texas",
	  "UT" : "Utah",
	  "VT" : "Vermont",
	  "VI" : "Virgin Islands",
	  "VA" : "Virginia",
	  "WA" : "Washington",
	  "WV" : "West Virginia",
	  "WI" : "Wisconsin",
	  "WY" : "Wyoming"
	}

	if (states[state.toUpperCase()] == undefined) {
	  var find = false;
	  for ( var x in states) {
		if (states[x].toUpperCase() == state.toUpperCase()) {
		  find = true;
		  break;
		}
	  }
	  if (find == false) alert("Error! Wrong State, please check it");
	}
  }
  
});