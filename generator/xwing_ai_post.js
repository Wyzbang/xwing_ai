
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

var SHIP_TIE_BOMBER = 8;
var SHIP_BWING = 9;
var SHIP_LAMBDA = 10;
var SHIP_HWK290 = 11;

var ships = new Array( tie, tieAdvanced, xwing, ywing, tieInterceptor, awing, slave1, falcon, tieBomber, bwing, lambda, hwk290 );
var SHIP = tie;

// ****************************************************************************
// Helper Functions

function display_ship( ship_id )
{
	// Set the global to the selected ship
	SHIP = ships[ ship_id ];
	
	var data;
	data = '<div style="font-size: x-large; font-weight: bold">'
	data += '<a name="' + SHIP.name + '"></a>'
	
	// image
	data += '<img src="' + SHIP.image + '" alt="' + SHIP.name + '">';
	
	// name
	data += SHIP.name + "</div>";
	data += format_actions( SHIP );
	
	// Tables (closing, away)
	data += '<div class="label">' + CLOSING + "</div>"
	data += '<table class="ship_table">';
	for( var dir=0; dir < SHIP.closing.length; dir++ )
	{
		data += "<tr><td class=\"ship_cell\">" + DIRECTION[dir];
		for( var item=0; item < SHIP.closing[dir].length; item++ )
		{
			maneuver = format_maneuver( SHIP, SHIP.closing[dir][item] );
			data += "<td class=\"ship_cell\">";
			data += '<div class="table_num">' + maneuver.num + '</div>'
			data += '<div class="table_num">' + maneuver.img + '</div>';
			data += "</td>";
		}
		data += "</tr>";
	}
	data += "</table><br>";
	
	data += '<div class="label">' + AWAY + "</div>"
	data += '<table class="ship_table">';
	for( var dir=0; dir < SHIP.away.length; dir++ )
	{
		data += "<tr><td class=\"ship_cell\">" + DIRECTION[dir];
		for( var item=0; item < SHIP.away[dir].length; item++ )
		{
			maneuver = format_maneuver( SHIP, SHIP.away[dir][item] );
			data += "<td class=\"ship_cell\">";
			data += '<div class="table_num">' + maneuver.num + '</div>'
			data += '<div class="table_num">' + maneuver.img + '</div>';
			data += "</td>";
		}
		data += "</tr>";
	}
	data += "</table><br>";
	
	data += '<div class="label">' + FAR + "</div>"
	data += '<table class="ship_table">';
	for( var dir=0; dir < SHIP.far.length; dir++ )
	{
		data += "<tr><td class=\"ship_cell\">" + DIRECTION[dir];
		for( var item=0; item < SHIP.far[dir].length; item++ )
		{
			maneuver = format_maneuver( SHIP, SHIP.far[dir][item] );
			data += "<td class=\"ship_cell\">";
			data += '<div class="table_num">' + maneuver.num + '</div>'
			data += '<div class="table_num">' + maneuver.img + '</div>';
			data += "</td>";
		}
		data += "</tr>";
	}
	data += "</table>";
	
	document.getElementById('version').innerHTML = VERSION;
	document.getElementById( "table" ).innerHTML = data;
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

function set_version()
{
	document.getElementById('version').innerHTML = VERSION;
}

function set_ship( ship_id )
{
	// Set the global to the selected ship
	SHIP = ships[ ship_id ];
	
	set_version()
	
	// Update index html elements for the selected ship
	document.getElementById('ship_image').src = SHIP.image;
	
	// TODO: Temporary difference between ARROW and CIRCLE versions
	if( document.getElementById( "near_img" ) != null )
	{
		document.getElementById('output-label').innerHTML = SHIP.name + " Manuever (near/far)";
		document.getElementById('near_num').innerHTML = "<p></p>";
		document.getElementById('near_img').innerHTML = "<p></p>";
	}
	else
	{
		document.getElementById('closing_num').innerHTML = "<p></p>";
		document.getElementById('closing_img').innerHTML = "<p></p>";
		document.getElementById('away_num').innerHTML = "<p></p>";
		document.getElementById('away_img').innerHTML = "<p></p>";
	}
	
	document.getElementById('far_num').innerHTML = "<p></p>";
	document.getElementById('far_img').innerHTML = "<p></p>";
	
	document.getElementById('selection').innerHTML = "<p>Press a direction</p>";
	document.getElementById('actions-text').innerHTML = format_actions( SHIP );
}

function pick( options )
{
	var size=options.length;
	var choice=Math.floor(Math.random()*size);
	return options[choice];
}

function maneuverInList( maneuver, list )
{
	var found = false;
	for( var i=0; i < list.length; i++ )
	{
		if( ( list[i].num == maneuver.num ) && ( list[i].dir == maneuver.dir ) )
		{
			found = true;
			break;
		}
	}
	
	return found;
}

function format_maneuver( ship, maneuver )
{
	var num;
	var img;
	
	// Koiogran is always red
	if( maneuver.dir == KOIOGRAN )
	{
		num = "<span style=color:red>" + maneuver.num + "</span>";
		img = '<img src="img/koiogran.png">';
	}
	else if ( maneuverInList( maneuver, ship.simple ) )
	{
		num = "<span style=color:green>" + maneuver.num + "</span>";
		img = '<img src="img/' + MANEUVER[maneuver.dir] + '-green.png">';
	}
	else if ( maneuverInList( maneuver, ship.difficult ) )
	{
		num = "<span style=color:red>" + maneuver.num + "</span>";
		img = '<img src="img/' + MANEUVER[maneuver.dir] + '-red.png">';
	}
	else
	{
		num = "<span>" + maneuver.num + "</span>";
		img = '<img src="img/' + MANEUVER[maneuver.dir] + '-white.png">';
	}
	
	return {'num': num, 'img': img };
}

function format_actions( ship )
{
	var actions = "<ol>";
	
	if( ship.actions & TARGET_LOCK )
	{
		actions += "<li>" + TARGET_LOCK_TEXT + "</li>";
	}
	
	if( ship.actions & BARREL_ROLL )
	{
		actions += "<li>" + BARREL_ROLL_TEXT1 + "</li>";
		actions += "<li>" + BARREL_ROLL_TEXT2 + "</li>";
	}
	
	if( ship.actions & BOOST )
	{
		actions += "<li>" + BOOST_TEXT1 + "</li>";
		actions += "<li>" + BOOST_TEXT2 + "</li>";
	}
	
	if( ship.actions & FOCUS )
	{
		if( ship.actions & EVADE )
		{
			actions += "<li>" + FOCUS_TEXT1 + "</li>";
		}
		else
		{
			actions += "<li>" + FOCUS_TEXT2 + "</li>";
		}
	}
	
	if( ship.actions & EVADE )
	{
		actions += "<li>" + EVADE_TEXT + "</li>";
	}
	
	return actions;
	
	if( ship.actions & CLOAKING )
	{
		actions += "<li>" + CLOAKING_TEXT + "</li>";
	}
	
	if( ship.actions & CORDINATE )
	{
		actions += "<li>" + CORDINATE_TEXT + "</li>";
	}
	
	if( ship.actions & JAM )
	{
		actions += "<li>" + JAM_TEXT + "</li>";
	}
	
	if( ship.actions & RECOVER )
	{
		actions += "<li>" + RECOVER_TEXT + "</li>";
	}
	
	if( ship.actions & REINFORCE )
	{
		actions += "<li>" + REINFORCE_TEXT + "</li>";
	}
	
	actions += "</ol>";
}

// ****************************************************************************
// Main

function movement( direction, heading )
{
	// direction: n=0, ne=1, e=2, se=3, s=4, sw=5, w=6,nw=7
	// heading: away, closing
	var selection = "<p>";
	selection += heading + " at " + DIRECTION[direction] + " o'clock</p>";
	
	// Select the maneuver randonly from appropriate ship table
	var maneuver;
	switch( heading )
	{
	case AWAY:
		maneuver = pick( SHIP.away[direction] );
		break;
	case CLOSING:
		maneuver = pick( SHIP.closing[direction] );
		break;
	default:
		maneuver = "invalid";
	}
	
	var near = format_maneuver( SHIP, maneuver );
	
	maneuver = pick( SHIP.far[direction] );
	var far  = format_maneuver( SHIP, maneuver );
	
	// Update HTML with selection and maneuver
	document.getElementById('selection').innerHTML = selection;
	document.getElementById('near_num').innerHTML = near.num
	document.getElementById('near_img').innerHTML = near.img;
	document.getElementById('far_num').innerHTML = far.num
	document.getElementById('far_img').innerHTML = far.img;
}

function movement2( direction )
{
	// direction: n=0, ne=1, e=2, se=3, s=4, sw=5, w=6,nw=7
	// heading: away, closing
	var maneuver;
	var selection = "<p>";
	selection += "at " + DIRECTION[direction] + " o'clock</p>";
	document.getElementById('selection').innerHTML = selection;
	
	// Select the maneuver randonly from appropriate ship table
	maneuver = pick( SHIP.closing[direction] );
	formatted = format_maneuver( SHIP, maneuver );
	document.getElementById( "closing_num" ).innerHTML = formatted.num;
	document.getElementById( "closing_img" ).innerHTML = formatted.img;
	
	maneuver = pick( SHIP.away[direction] );
	formatted = format_maneuver( SHIP, maneuver );
	document.getElementById( "away_num" ).innerHTML = formatted.num;
	document.getElementById( "away_img" ).innerHTML = formatted.img;
	
	maneuver = pick( SHIP.far[direction] );
	formatted = format_maneuver( SHIP, maneuver );
	document.getElementById( "far_num" ).innerHTML = formatted.num;
	document.getElementById( "far_img" ).innerHTML = formatted.img;
}
-->
