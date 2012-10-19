<!--

// Revision History:
// 10/14/2012	Initial coding
// 10/15/2012	Adding Tie Advanced Object
// 10/17/2012	Added multiple ship support
//				Added X-Wing and Y-Wing object (no AI for Y-Wing)

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
ywing.closing[0] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.closing[1] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.closing[2] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.closing[3] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.closing[4] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.closing[5] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.closing[6] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.closing[7] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
	
ywing.away = new Array();
ywing.away[0] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.away[1] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.away[2] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.away[3] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.away[4] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.away[5] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.away[6] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );
ywing.away[7] = new Array( "NA", "NA", "NA", "NA", "NA", "NA" );

// ****************************************************************************
// Ships

var SHIP_TIE = 0;
var SHIP_TIE_ADVACED = 1;
var SHIP_XWING = 2;
var SHIP_YWING = 3;
/*
var SHIP_TIE_INTERCEPTOR = 4;
var SHIP_AWING = 5;
var SHIP_SLAVE1 = 6;
var SHIP_FALCON = 7;
*/

var ships = new Array( tie, tieAdvanced, xwing, ywing );
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
}
	
function pick()
{
	var pick=Math.floor(Math.random()*6);
	return pick;
}

function format_manuver( ship, manuver )
{
	var formatted = "<p><span style=color:blue>" + ship.name + ": </span><br>";
	if( ship.simple.indexOf( manuver ) > -1 )
	{
		formatted += "<span style=color:green>" + manuver + "</span>";
	}
	else if( ship.difficult.indexOf( manuver ) > -1 )
	{
		formatted += "<span style=color:red>" + manuver + "</span></p>";
	}
	else
	{
		formatted += "<span>" + manuver + "</span></p>";
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
	var selection = "<span style=color:blue>Enemy: </span><br>";
	selection += heading + " at " + DIRECTION[direction] + " o'clock";
	
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