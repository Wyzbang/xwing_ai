<!--

// Revision History:
// 10/14/2012	Initial coding
// 10/15/2012	Adding Tie Advanced Object
// 10/17/2012	Added multiple ship support
//				Added X-Wing and Y-Wing object (no AI for Y-Wing)
// 10/28/2012	Added Y-Wing AI choices
// 12/12/2012	Convert movement string to function calls
//				Added Tie-Interceptor, A-Wing, YT-1300 (Falcon), Firspare(Slave 1)

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
// Moves

function F( distance )
{
	var move = distance + " Forward";
	return move
} 

function BL( distance )
{
	var move = distance + " Bank Left";
	return move
} 

function BR( distance )
{
	var move = distance + " Bank Right";
	return move
} 

function TL( distance )
{
	var move = distance + " Turn Left";
	return move
} 

function TR( distance )
{
	var move = distance + " Turn Right";
	return move
} 

function K( distance )
{
	var move = distance + " Koiogran";
	return move
} 


// ****************************************************************************
// Tie Fighter

var	tie = new Object();
tie.name = "Tie Fighter";
tie.image = "img/tie.png"
tie.simple = new Array( F(2), BL(2), BR(2), F(3) );
tie.difficult = new Array( K(3), K(4) );                                               

// AI choices
tie.closing = new Array();
tie.closing[0] = new Array( BL(2), BR(2), F(2),  F(2),  K(4),  K(4) );
tie.closing[1] = new Array( F(2),  BR(3), BR(2), BR(2), TR(2), TR(1)  );
tie.closing[2] = new Array( TR(1), TR(1), TR(2), TR(2), K(3),  K(4) );
tie.closing[3] = new Array( K(4),  K(4),  K(3),  TR(2), TR(1), TR(1)  );
tie.closing[4] = new Array( K(4),  K(3),  K(3),  TL(3), TR(3), F(5)  );
tie.closing[5] = new Array( TL(1), TL(1), TL(2), K(3),  K(4),  K(4) );
tie.closing[6] = new Array( K(4),  K(3),  TL(2), TL(2), TL(1), TL(1) );
tie.closing[7] = new Array( F(2),  BL(3), BL(2), BL(2), TL(2), TL(1) );
	
tie.away = new Array();
tie.away[0] = new Array( F(5),  F(4),  F(4),  F(3),  F(3),  F(2) );
tie.away[1] = new Array( F(5),  F(4),  BR(3), BR(3), BR(2), BR(2) );
tie.away[2] = new Array( BR(3), TR(3), BR(2), TR(2), TR(2), TR(1) );
tie.away[3] = new Array( K(4),  K(3),  K(3),  TR(2), TR(2), TR(1) );
tie.away[4] = new Array( K(3),  K(3),  K(3),  K(3),  TL(1), TR(1) );
tie.away[5] = new Array( TL(1), TL(2), TL(2), K(3),  K(3),  K(4) );
tie.away[6] = new Array( BL(3), TL(3), BL(2), TL(2), TL(2), TL(1) );
tie.away[7] = new Array( BL(2), BL(2), BL(3), BL(3), F(4),  F(5) );

// ****************************************************************************
// Tie Advanced

var tieAdvanced = new Object();
tieAdvanced.name = "Tie Advanced";
tieAdvanced.image = "img/TieAdvanced.png";
tieAdvanced.simple = new Array( BL(1), BR(1), F(2), F(3) );
tieAdvanced.difficult = new Array( K(4) );

// AI choices
tieAdvanced.closing = new Array();
tieAdvanced.closing[0] = new Array( BL(2), BR(2), F(2),  F(2),  K(4),  K(4) );
tieAdvanced.closing[1] = new Array( F(2),  BR(3), BR(2), BR(2), TR(3), TR(2) );
tieAdvanced.closing[2] = new Array( TR(2), TR(2), TR(2), BR(1), K(4),  K(4) );
tieAdvanced.closing[3] = new Array( K(4),  K(4),  F(5),  TR(2), TR(2), BR(1) );
tieAdvanced.closing[4] = new Array( K(4),  K(4),  K(4),  TL(3), TR(3), F(4) );
tieAdvanced.closing[5] = new Array( BL(1), TL(2), TL(2), F(5),  K(4),  K(4) );
tieAdvanced.closing[6] = new Array( K(4),  K(4),  BL(1), TL(2), TL(2), TL(2) );
tieAdvanced.closing[7] = new Array( F(2),  BL(3), BL(2), BL(2),   TL(3), TL(2) );

tieAdvanced.away = new Array();
tieAdvanced.away[0] = new Array( F(5),  F(4),  F(4),  F(3),  F(3),  F(2) );
tieAdvanced.away[1] = new Array( F(4),  F(3),  BR(3), BR(3), BR(2), BR(2) );
tieAdvanced.away[2] = new Array( BR(3), TR(3), BR(2), TR(2), TR(2), BR(1) );
tieAdvanced.away[3] = new Array( K(4),  K(4),  K(4),  TR(2), TR(2), TR(2) );
tieAdvanced.away[4] = new Array( K(4),  K(4),  K(4),  K(4),  TL(2), TR(2) );
tieAdvanced.away[5] = new Array( TL(2), TL(2), TL(2), K(4),  K(4),  K(4) );
tieAdvanced.away[6] = new Array( BL(1), TL(2), TL(2), BL(2), TL(3), TL(3) );
tieAdvanced.away[7] = new Array( F(4),  F(3),  BR(3), BR(3), BL(2), BL(2) );

// ****************************************************************************
// X-Wing

var	xwing = new Object();
xwing.name = "X-Wing";
xwing.image = "img/xwing.png";
xwing.simple = new Array( F(1), BL(1), BR(1), F(2) );
xwing.difficult = new Array( K(4) );                                               

// AI choices
xwing.closing = new Array();
xwing.closing[0] = new Array( F(1),  F(1),  F(2),  F(2),  BL(1), BR(1) );
xwing.closing[1] = new Array( F(1),  BR(1), BR(2), BR(2), TR(2), TR(3) );
xwing.closing[2] = new Array( BR(1), BR(1), TR(2), TR(2), TR(2), TR(3) );
xwing.closing[3] = new Array( K(4),  K(4),  K(4),  TR(2), TR(2), BR(1) );
xwing.closing[4] = new Array( K(4),  K(4),  K(4),  K(4),  TL(3), TR(3) );
xwing.closing[5] = new Array( K(4),  K(4),  K(4),  TL(2), TL(2), BL(1) );
xwing.closing[6] = new Array( BL(1), BL(1), TL(2), TL(2), TL(2), TL(3) );
xwing.closing[7] = new Array( F(1),  BL(1), BL(2), BL(2), TL(2), TL(3) );
	
xwing.away = new Array();
xwing.away[0] = new Array( F(4),  F(3),  F(3),  F(2),  F(2),  F(1) );
xwing.away[1] = new Array( BR(3), BR(2), TR(2), TR(2), TR(3), TR(3) );
xwing.away[2] = new Array( BR(1), BR(2), TR(2), TR(2), TR(3), TR(3) );
xwing.away[3] = new Array( K(4),  K(4),  TR(3), TR(3), TR(2), TR(2) );
xwing.away[4] = new Array( K(4),  K(4),  K(4),  K(4),  TL(2), TR(2) );
xwing.away[5] = new Array( K(4),  K(4),  TL(3), TL(3), TL(2), TL(2) );
xwing.away[6] = new Array( BL(1), BL(2), TL(2), TL(2), TL(3), TL(3) );
xwing.away[7] = new Array( BL(3), BL(2), TR(2), TR(2), TL(3), TL(3) );

// ****************************************************************************
// Y-Wing

var	ywing = new Object();
ywing.name = "Y-Wing";
ywing.image = "img/ywing.png";
ywing.simple = new Array( F(1), F(2) );
ywing.difficult = new Array( TL(3), TR(3), F(4), K(4) );                                              

// AI choices
ywing.closing = new Array();
ywing.closing[0] = new Array( F(1),  F(1),  F(2),  F(2),  BL(1), BR(1) );
ywing.closing[1] = new Array( F(1),  BR(1), BR(2), BR(2), TR(2), TR(2) );
ywing.closing[2] = new Array( BR(1), BR(1), TR(2), TR(2), TR(2), TR(2) );
ywing.closing[3] = new Array( K(4),  K(4),  K(4),  TR(2), TR(2), BR(1) );
ywing.closing[4] = new Array( K(4),  K(4),  K(4),  K(4),  TL(2), TR(2) );
ywing.closing[5] = new Array( K(4),  K(4),  K(4),  TL(2), TL(2), BL(1) );
ywing.closing[6] = new Array( BL(1), BL(1), TL(2), TL(2), TL(2), TL(2) );
ywing.closing[7] = new Array( F(1),  BL(1), BL(2), BL(2), TL(2), TL(2) );
	
ywing.away = new Array();
ywing.away[0] = new Array( F(3),  F(3),  F(2),  F(2),  F(2),  F(1) );
ywing.away[1] = new Array( BR(3), BR(2), TR(2), TR(2), TR(2), TR(3) );
ywing.away[2] = new Array( BR(1), BR(2), TR(2), TR(2), TR(2), TR(3) );
ywing.away[3] = new Array( K(4),  K(4),  TR(3), TR(3), TR(2), TR(2) );
ywing.away[4] = new Array( K(4),  K(4),  K(4),  K(4),  TL(2), TR(2) );
ywing.away[5] = new Array( K(4),  K(4),  TL(3), TL(3), TL(2), TL(2) );
ywing.away[6] = new Array( BL(1), BL(2), TL(2), TL(2), TL(2), TL(3) );
ywing.away[7] = new Array( BL(3), BL(2), TR(2), TR(2), TL(2), TL(3) );

// ****************************************************************************
// Tie Interceptor

var tieInterceptor = new Object();
tieInterceptor.name = "Tie Interceptor";
tieInterceptor.image = "img/tieInterceptor.png";
tieInterceptor.simple = new Array( F(2), F(3), F(4), TL(2), BL(2), BR(2), TR(2) );
tieInterceptor.difficult = new Array( K(3), K(5) );   

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
awing.simple = new Array( F(2), F(3), F(4), F(5), TL(2), BL(2), BR(2), TR(2));
awing.difficult = new Array( K(3), K(5) );   

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
slave1.name = "Firespray-31";
slave1.image = "img/slave1.png";
slave1.simple = new Array( F(1), F(2), BL(1), BR(1) );
slave1.difficult = new Array( K(3), K(4) );   

// AI choices
slave1.closing = new Array();
slave1.closing[0] = new Array( BL(3), BR(3), F(2),  F(2),  K(3),  K(4) );
slave1.closing[1] = new Array( F(1),  BR(3), BR(3), BR(3), TR(3), TR(2) );
slave1.closing[2] = new Array( TR(2), TR(2), TR(3), TR(3), K(3),  K(4) );
slave1.closing[3] = new Array( TR(2), TR(2), TR(3), K(3),  K(4),  K(4) );
slave1.closing[4] = new Array( F(4),  TL(3), TR(3), K(3),  K(4),  K(4) );
slave1.closing[5] = new Array( TL(2), TL(2), TL(3), K(3),  K(4),  K(4) );
slave1.closing[6] = new Array( TL(2), TL(2), TL(3), TL(3), K(3),  K(3) );
slave1.closing[7] = new Array( F(1),  BL(3), BL(3), BL(3), TL(3), TL(2) );

slave1.away = new Array();
slave1.away[0] = new Array( F(4),  F(4),  F(3),  F(3),  F(2),  F(2) );
slave1.away[1] = new Array( BR(3), BR(3), BR(3), BR(3), F(3),  F(4) );
slave1.away[2] = new Array( TR(2), TR(2), BR(2), BR(3), TR(3), TR(3) );
slave1.away[3] = new Array( TR(3), TR(3), TR(3), K(3),  K(3),  K(4) );
slave1.away[4] = new Array( TL(2), TR(2), K(3),  K(3),  K(3),  K(3) );
slave1.away[5] = new Array( TL(2), TL(3), TL(3), K(3),  K(3),  K(4) );
slave1.away[6] = new Array( TL(2), TL(2), BL(2), BL(3), TL(3), TL(3) );
slave1.away[7] = new Array( BL(3), BL(3), BL(3), BL(3), F(3),  F(4) );

// ****************************************************************************
// Millenium Falcon

var falcon = new Object();
falcon.name = "YT-1300";
falcon.image = "img/falcon.png";
falcon.simple = new Array( F(1), F(2), BL(1), BR(1) );
falcon.difficult = new Array( K(3), K(4) );   

// AI choices
falcon.closing = new Array();
falcon.closing[0] = new Array( BL(2), BR(2), F(2),  F(2),  K(3),  K(4) );
falcon.closing[1] = new Array( F(1),  BR(3), BR(2), BR(2), TR(2), TR(1) );
falcon.closing[2] = new Array( TR(1), TR(1), TR(2), TR(2), K(3),  K(4) );
falcon.closing[3] = new Array( TR(1), TR(1), TR(2), K(3),  K(4),  K(4) );
falcon.closing[4] = new Array( F(4),  TL(2), TR(2), K(3),  K(4),  K(4) );
falcon.closing[5] = new Array( TL(1), TL(1), TL(2), K(3),  K(4),  K(4) );
falcon.closing[6] = new Array( TL(1), TL(1), TL(2), TL(2), K(3),  K(3) );
falcon.closing[7] = new Array( F(1),  BL(3), BL(2), BL(2), TL(2), TL(1) );

falcon.away = new Array();
falcon.away[0] = new Array( F(4),  F(4),  F(3),  F(3),  F(2),  F(2) );
falcon.away[1] = new Array( BR(2), BR(2), BR(3), BR(3), F(3),  F(4) );
falcon.away[2] = new Array( TR(1), TR(1), BR(1), BR(2), TR(2), TR(2) );
falcon.away[3] = new Array( TR(2), TR(2), TR(2), K(3),  K(3),  K(4) );
falcon.away[4] = new Array( TL(1), TR(1), K(3),  K(3),  K(3),  K(3) );
falcon.away[5] = new Array( TL(1), TL(2), TL(2), K(3),  K(3),  K(4) );
falcon.away[6] = new Array( TL(1), TL(1), BL(1), BL(2), TL(2), TL(2) );
falcon.away[7] = new Array( BL(2), BL(2), BL(3), BL(3), F(3),  F(4) );

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

function display_ship( ship )
{
	var data;
	// image
	data = '<img src="' + ship.image + '" alt="' + ship.name + '">';

	// name
	data += ship.name + "<br>";
	
	// Tables (closing, away)
	data += '<table id="ship_display">';
	for( var dir=0; dir < ship.closing.length; dir++ )
	{
		data += "<tr><td id=\"ship_cell\">" + DIRECTION[dir] + "</td><td id=\"ship_cell\">" + CLOSING + "</td>";
		for( var item=0; item < ship.closing[dir].length; item++ )
		{
			data += "<td id=\"ship_cell\">" + ship.closing[dir][item] + "</td>";
		}
		data += "</tr>";
	
		data += "<tr><td id=\"ship_cell\">" + DIRECTION[dir] + "</td><td id=\"ship_cell\">" + AWAY + "</td>";
		for( var item=0; item < ship.away[dir].length; item++ )
		{
			data += "<td id=\"ship_cell\">" + ship.away[dir][item] + "</td>";
		}
		data += "</tr>";
	}
	data += "</table>";
	
	data += "<hr>";
	
	document.getElementById( ship.name ).innerHTML = data;
}

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

function display_ships()
{
	for( var ship=0; ship < ships.length; ship++ )
	{
		display_ship( ships[ship] );
	}
}

-->