<!--

// Revision History:
// 10/14/2012	Initial coding
// 10/15/2012	Adding Tie Advanced Object
// 10/17/2012	Added multiple ship support
//				Added X-Wing and Y-Wing object (no AI for Y-Wing)
// 10/28/2012	Added Y-Wing AI choices

// ****************************************************************************
// Constants

// DIRECTIONS
var DIR_000 = 0;
var DIR_045 = 1;
var DIR_090 = 2;
var DIR_135 = 3;
var DIR_180 = 4;
var DIR_225 = 5;
var DIR_270 = 6;
var DIR_315 = 7;

var DIRECTION = new Array( "12", "1-2", "3", "4-5", "6", "7-8", "9", "10-11" );

// HEADING
var AWAY = "Heading away";
var CLOSING = "Closing";

// ****************************************************************************
// Tie Fighter

var	tie = new Object();
tie.name = "Tie Fighter";
tie.image = "img/tie.png"
tie.simple = new Array( "2 Forward", "2 Bank Left", "2 Bank Right", "3 Forward" );
tie.difficult = new Array( "3 Koiogran", "4 Koiogran" );                                               

// AI choices
tie.closing = new Array();
tie.closing[0] = new Array( "2 Bank Left", "2 Bank Right", "2 Forward", "2 Forward", "4 Koiogran", "4 Koiogran" );
tie.closing[1] = new Array( "2 Forward",  "3 Bank Right",  "2 Bank Right",  "2 Bank Right",  "2 Turn Right",  "1  Turn Right"  );
tie.closing[2] = new Array( "1  Turn Right",  "1  Turn Right",  "2 Turn Right",  "2 Turn Right",  "3 Koiogran", "4 Koiogran" );
tie.closing[3] = new Array( "4 Koiogran", "4 Koiogran", "3 Koiogran", "2 Turn Right",  "1  Turn Right",  "1  Turn Right"  );
tie.closing[4] = new Array( "4 Koiogran", "3 Koiogran", "3 Koiogran", "3 Turn Left", "3 Turn Right",  "5 Forward"  );
tie.closing[5] = new Array( "1  Turn Left", "1  Turn Left", "2 Turn Left", "3 Koiogran", "4 Koiogran", "4 Koiogran" );
tie.closing[6] = new Array( "4 Koiogran", "3 Koiogran", "2 Turn Left", "2 Turn Left", "1  Turn Left", "1  Turn Left" );
tie.closing[7] = new Array( "2 Forward",  "3 Bank Left", "2 Bank Left", "2 Bank Left", "2 Turn Left", "1  Turn Left" );
	
tie.away = new Array();
tie.away[0] = new Array( "5 Forward",  "4 Forward",  "4 Forward",  "3 Forward",  "3 Forward",  "2 Forward" );
tie.away[1] = new Array( "5 Forward",  "4 Forward",  "3 Bank Right",  "3 Bank Right",  "2 Bank Right",  "2 Bank Right" );
tie.away[2] = new Array( "3 Bank Right",  "3 Turn Right",  "2 Bank Right",  "2 Turn Right",  "2 Turn Right",  "1  Turn Right" );
tie.away[3] = new Array( "4 Koiogran", "3 Koiogran", "3 Koiogran", "2 Turn Right",  "2 Turn Right",  "1  Turn Right" );
tie.away[4] = new Array( "3 Koiogran", "3 Koiogran", "3 Koiogran", "3 Koiogran", "1  Turn Left", "1  Turn Right" );
tie.away[5] = new Array( "1  Turn Left", "2 Turn Left", "2 Turn Left", "3 Koiogran", "3 Koiogran", "4 Koiogran" );
tie.away[6] = new Array( "3 Bank Left", "3 Turn Left", "2 Bank Left", "2 Turn Left", "2 Turn Left", "1  Turn Left" );
tie.away[7] = new Array( "2 Bank Left", "2 Bank Left", "3 Bank Left", "3 Bank Left", "4 Forward",  "5 Forward" );

// ****************************************************************************
// Tie Advanced

var tieAdvanced = new Object();
tieAdvanced.name = "Tie Advanced";
tieAdvanced.image = "img/TieAdvanced.png";
tieAdvanced.simple = new Array( "1 Bank Left", "1 Bank Right", "2 Forward", "3 Forward" );
tieAdvanced.difficult = new Array( "4 Koiogran" );

// AI choices
tieAdvanced.closing = new Array();
tieAdvanced.closing[0] = new Array( "2 Bank Left",  "2 Bank Right",   "2 Forward",  "2 Forward",  "4 Koiogran",  "4 Koiogran" );
tieAdvanced.closing[1] = new Array( "2 Forward",  "3 Bank Right",  "2 Bank Right",  "2 Bank Right",  "3 Turn Right",  "2 Turn Right" );
tieAdvanced.closing[2] = new Array( "2 Turn Right",  "2 Turn Right",  "2 Turn Right",  "1 Bank Right",  "4 Koiogran",  "4 Koiogran" );
tieAdvanced.closing[3] = new Array( "4 Koiogran",  "4 Koiogran",  "5 Forward",  "2 Turn Right",  "2 Turn Right",  "1 Bank Right" );
tieAdvanced.closing[4] = new Array( "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "3 Turn Left",  "3 Turn Right",  "4 Forward" );
tieAdvanced.closing[5] = new Array( "1 Bank Left",  "2 Turn Left",  "2 Turn Left",  "5 Forward",  "4 Koiogran",  "4 Koiogran" );
tieAdvanced.closing[6] = new Array( "4 Koiogran",  "4 Koiogran",  "1 Bank Left",  "2 Turn Left",  "2 Turn Left",  "2 Turn Left" );
tieAdvanced.closing[7] = new Array( "2 Forward",  "3 Bank Left",  "2 Bank Left",  "2 Bank Left",  "3 Turn Left",  "2 Turn Left" );

tieAdvanced.away = new Array();
tieAdvanced.away[0] = new Array( "5 Forward",  "4 Forward",  "4 Forward",  "3 Forward",  "3 Forward",  "2 Forward" );
tieAdvanced.away[1] = new Array( "4 Forward",  "3 Forward",  "3 Bank Right",  "3 Bank Right",  "2 Bank Right",  "2 Bank Right" );
tieAdvanced.away[2] = new Array( "3 Bank Right",  "3 Turn Right",  "2 Bank Right",  "2 Turn Right",  "2 Turn Right",  "1 Bank Right" );
tieAdvanced.away[3] = new Array( "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "2 Turn Right",  "2 Turn Right",  "2 Turn Right" );
tieAdvanced.away[4] = new Array( "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "2 Turn Left",  "2 Turn Right" );
tieAdvanced.away[5] = new Array( "2 Turn Left",  "2 Turn Left", "2 Turn Left",  "4 Koiogran",  "4 Koiogran",  "4 Koiogran" );
tieAdvanced.away[6] = new Array( "1 Bank Left",  "2 Turn Left",  "2 Turn Left",  "2 Bank Left",  "3 Turn Left",  "3 Turn Left" );
tieAdvanced.away[7] = new Array( "4 Forward",  "3 Forward",  "3 Bank Right",  "3 Bank Right",  "2 Bank Left",  "2 Bank Left" );

// ****************************************************************************
// X-Wing

var	xwing = new Object();
xwing.name = "X-Wing";
xwing.image = "img/xwing.png";
xwing.simple = new Array( "1 Forward", "1 Bank Left", "1 Bank Right", "2 Forward" );
xwing.difficult = new Array( "4 Koiogran" );                                               

// AI choices
xwing.closing = new Array();
xwing.closing[0] = new Array( "1 Forward",  "1 Forward",  "2 Forward",  "2 Forward",  "1 Bank Left",  "1 Bank Right" );
xwing.closing[1] = new Array( "1 Forward",  "1 Bank Right",  "2 Bank Right",  "2 Bank Right",  "2 Turn Right",  "3 Turn Right" );
xwing.closing[2] = new Array( "1 Bank Right",  "1 Bank Right",  "2 Turn Right",  "2 Turn Right",  "2 Turn Right",  "3 Turn Right" );
xwing.closing[3] = new Array( "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "2 Turn Right",  "2 Turn Right",  "1 Bank Right" );
xwing.closing[4] = new Array( "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "3 Turn Left",  "3 Turn Right" );
xwing.closing[5] = new Array( "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "2 Turn Left",  "2 Turn Left",  "1 Bank Left" );
xwing.closing[6] = new Array( "1 Bank Left",  "1 Bank Left",  "2 Turn Left",  "2 Turn Left",  "2 Turn Left",  "3 Turn Left" );
xwing.closing[7] = new Array( "1 Forward",  "1 Bank Left",  "2 Bank Left",  "2 Bank Left",  "2 Turn Left",  "3 Turn Left" );
	
xwing.away = new Array();
xwing.away[0] = new Array( "4 Forward",  "3 Forward",  "3 Forward",  "2 Forward",  "2 Forward",  "1 Forward" );
xwing.away[1] = new Array( "3 Bank Right",  "2 Bank Right",  "2 Turn Right",  "2 Turn Right",  "3 Turn Right",  "3 Turn Right" );
xwing.away[2] = new Array( "1 Bank Right",  "2 Bank Right",  "2 Turn Right",  "2 Turn Right",  "3 Turn Right",  "3 Turn Right" );
xwing.away[3] = new Array( "4 Koiogran",  "4 Koiogran",  "3 Turn Right",  "3 Turn Right",  "2 Turn Right",  "2 Turn Right" );
xwing.away[4] = new Array( "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "2 Turn Left",  "2 Turn Right" );
xwing.away[5] = new Array( "4 Koiogran",  "4 Koiogran",  "3 Turn Left",  "3 Turn Left",  "2 Turn Left",  "2 Turn Left" );
xwing.away[6] = new Array( "1 Bank Left",  "2 Bank Left",  "2 Turn Left",  "2 Turn Left",  "3 Turn Left",  "3 Turn Left" );
xwing.away[7] = new Array( "3 Bank Left",  "2 Bank Left",  "2 Turn Right",  "2 Turn Right",  "3 Turn Left",  "3 Turn Left" );

// ****************************************************************************
// Y-Wing

var	ywing = new Object();
ywing.name = "Y-Wing";
ywing.image = "img/ywing.png";
ywing.simple = new Array( "1 Forward", "2 Forward" );
ywing.difficult = new Array( "3 Turn Left", "3 Turn Right", "4 Forward", "4 Koiogran" );                                              

// AI choices
ywing.closing = new Array();
ywing.closing[0] = new Array( "1 Forward",  "1 Forward",  "2 Forward",  "2 Forward",  "1 Bank Left",  "1 Bank Right" );
ywing.closing[1] = new Array( "1 Forward",  "1 Bank Right",  "2 Bank Right",  "2 Bank Right",  "2 Turn Right",  "2 Turn Right" );
ywing.closing[2] = new Array( "1 Bank Right",  "1 Bank Right",  "2 Turn Right",  "2 Turn Right",  "2 Turn Right",  "2 Turn Right" );
ywing.closing[3] = new Array( "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "2 Turn Right",  "2 Turn Right",  "1 Bank Right" );
ywing.closing[4] = new Array( "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "2 Turn Left",  "2 Turn Right" );
ywing.closing[5] = new Array( "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "2 Turn Left",  "2 Turn Left",  "1 Bank Left" );
ywing.closing[6] = new Array( "1 Bank Left",  "1 Bank Left",  "2 Turn Left",  "2 Turn Left",  "2 Turn Left",  "2 Turn Left" );
ywing.closing[7] = new Array( "1 Forward",  "1 Bank Left",  "2 Bank Left",  "2 Bank Left",  "2 Turn Left",  "2 Turn Left" );
	
ywing.away = new Array();
ywing.away[0] = new Array( "3 Forward",  "3 Forward",  "2 Forward",  "2 Forward",  "2 Forward",  "1 Forward" );
ywing.away[1] = new Array( "3 Bank Right",  "2 Bank Right",  "2 Turn Right",  "2 Turn Right",  "2 Turn Right",  "3 Turn Right" );
ywing.away[2] = new Array( "1 Bank Right",  "2 Bank Right",  "2 Turn Right",  "2 Turn Right",  "2 Turn Right",  "3 Turn Right" );
ywing.away[3] = new Array( "4 Koiogran",  "4 Koiogran",  "3 Turn Right",  "3 Turn Right",  "2 Turn Right",  "2 Turn Right" );
ywing.away[4] = new Array( "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "4 Koiogran",  "2 Turn Left",  "2 Turn Right" );
ywing.away[5] = new Array( "4 Koiogran",  "4 Koiogran",  "3 Turn Left",  "3 Turn Left",  "2 Turn Left",  "2 Turn Left" );
ywing.away[6] = new Array( "1 Bank Left",  "2 Bank Left",  "2 Turn Left",  "2 Turn Left",  "2 Turn Left",  "3 Turn Left" );
ywing.away[7] = new Array( "3 Bank Left",  "2 Bank Left",  "2 Turn Right",  "2 Turn Right",  "2 Turn Left",  "3 Turn Left" );

// ****************************************************************************
// Tie Interceptor

var tieInterceptor = new Object();
tieInterceptor.name = "Tie Interceptor";
tieInterceptor.image = "img/tieInterceptor.png";
tieInterceptor.simple = new Array();
tieInterceptor.difficult = new Array();   

// AI choices
tieInterceptor.closing = new Array();
tieInterceptor.closing[0] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.closing[1] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.closing[2] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.closing[3] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.closing[4] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.closing[5] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.closing[6] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.closing[7] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );

tieInterceptor.away = new Array();
tieInterceptor.away[0] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.away[1] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.away[2] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.away[3] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.away[4] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.away[5] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.away[6] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
tieInterceptor.away[7] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );

// ****************************************************************************
// A-Wing

var awing = new Object();
awing.name = "A-Wing";
awing.image = "img/awing.png";
awing.simple = new Array();
awing.difficult = new Array();   

// AI choices
awing.closing = new Array();
awing.closing[0] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.closing[1] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.closing[2] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.closing[3] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.closing[4] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.closing[5] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.closing[6] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.closing[7] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );

awing.away = new Array();
awing.away[0] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.away[1] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.away[2] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.away[3] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.away[4] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.away[5] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.away[6] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
awing.away[7] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );

// ****************************************************************************
// Slave 1

var slave1 = new Object();
slave1.name = "Slave 1";
slave1.image = "img/slave1.png";
slave1.simple = new Array();
slave1.difficult = new Array();   

// AI choices
slave1.closing = new Array();
slave1.closing[0] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.closing[1] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.closing[2] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.closing[3] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.closing[4] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.closing[5] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.closing[6] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.closing[7] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );

slave1.away = new Array();
slave1.away[0] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.away[1] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.away[2] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.away[3] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.away[4] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.away[5] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.away[6] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
slave1.away[7] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );

// ****************************************************************************
// Millenium Falcon

var falcon = new Object();
falcon.name = "Millenium Falcon";
falcon.image = "img/falcon.png";
falcon.simple = new Array();
falcon.difficult = new Array();   

// AI choices
falcon.closing = new Array();
falcon.closing[0] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.closing[1] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.closing[2] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.closing[3] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.closing[4] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.closing[5] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.closing[6] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.closing[7] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );

falcon.away = new Array();
falcon.away[0] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.away[1] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.away[2] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.away[3] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.away[4] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.away[5] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.away[6] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
falcon.away[7] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );

// ****************************************************************************
// Ships

var SHIP_TIE = 0;
var SHIP_TIE_ADVANCED = 1;
var SHIP_XWING = 2;
var SHIP_YWING = 3;

var SHIP_TIE_INTERCEPTOR = 4;
var SHIP_AWING = 5;
var SHIP_SLAVE1 = 6;
var SHIP_FALCON = 7;

var ships = new Array( tie, tieAdvanced, xwing, ywing, tieInterceptor, awing, slave1, falcon );
var SHIP = tie;

// ****************************************************************************
// Helper Functions

function get_ship()
{
	var selection = 0;
	for( var i=0; i < document.ship_radio.ship_selection.length; i++ )
	{
		if( document.ship_radio.ship_selection[i].checked )
		{
			selection = eval( document.ship_radio.ship_selection[i].value );
			break;
		}
	}
	
	return ships[ selection ];
}

function set_ship( ship )
{
	SHIP = ships[ ship ]; 
	document.getElementById('ship_image').src = ships[ ship ].image;
	document.getElementById('output-label').innerHTML = ships[ ship ].name;
	document.getElementById('selection').innerHTML = "<p>Press a direction and heading</p>";
	document.getElementById('output').innerHTML = "<p>Press a direction and heading</p>";
}
	
function pick()
{
	var pick=Math.floor(Math.random()*6);
	return pick;
}

function format_manuver( ship, manuver )
{
	var formatted = "<p>"; // = "<span style=color:blue>" + ship.name + ": </span><br>";
	if( ship.simple.indexOf( manuver ) > -1 )
	{
		formatted += "<span style=color:green>" + manuver + "</span>";
	}
	else if( ship.difficult.indexOf( manuver ) > -1 )
	{
		formatted += "<span style=color:red>" + manuver + "</span>";
	}
	else
	{
		formatted += "<span>" + manuver + "</span>";
	}
	formatted += "</p>";
	
	return formatted;
}

// ****************************************************************************
// Main

function movement( direction, heading )
{
	// direction: n=0, ne=1, e=2, se=3, s=4, sw=5, w=6,nw=7
	// heading: away, closing
	var selection = "<p>"; // = "<span style=color:blue>Enemy: </span><br>";
	selection += heading + " at " + DIRECTION[direction] + " o'clock</p>";
	
	var choice = pick();
		
	// Set the Action
	var action;
	switch( heading )
	{
	case AWAY:
		action = SHIP.away[direction][choice];
		break;
	case CLOSING:
		action = SHIP.closing[direction][choice];
		break;
	default:
		action = "invalid";
	}
	
	var formatted = format_manuver( SHIP, action );

	// Update HTML with selection and action
	document.getElementById('selection').innerHTML = selection;
	document.getElementById('output').innerHTML = formatted;
}

-->