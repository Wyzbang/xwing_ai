// ***************************************************************************
// X-Wing Miniatures AI - Javascript

// ****************************************************************************
// Constants

// ENEMY SHIP DIRECTIONS
var DIR_000 = 0;
var DIR_045 = 1;
var DIR_090 = 2;
var DIR_135 = 3;
var DIR_180 = 4;
var DIR_225 = 5;
var DIR_270 = 6;
var DIR_315 = 7;

var DIRECTION = [ "12", "1-2", "3", "4-5", "6", "7-8", "9", "10-11" ];

// HEADING
var AWAY = "Retreating";            // Heading away
var CLOSING = "Closing";            // Closing
var FAR = "Out of Range";           // Far
var STRESSED = "Stressed";          // Stressed

// MANEUVER DIRECTIONS
var TURN_LEFT = 0;
var BANK_LEFT = 1;
var FORWARD = 2;
var BANK_RIGHT = 3;
var TURN_RIGHT = 4;
var KOIOGRAN = 5;
var INVALID = 99;

var MANEUVER = [ "turn-left", "bank-left", "forward", "bank-right", "turn-right", "koiogran" ];

// ACTIONS
var TARGET_LOCK = 0x1;
var BARREL_ROLL = 0x2;
var BOOST       = 0x4;
var FOCUS       = 0x8;
var EVADE       = 0x10;
var CLOAKING    = 0x20;

var CORDINATE   = 0x1000;
var JAM         = 0x2000;
var RECOVER     = 0x4000;
var REINFORCE   = 0x8000;

// ACTIONS TEXT
var TARGET_LOCK_TEXT =  'Obtain <img src="img/action_targetlock.png" alt="Target-Lock"> on targeted ship as a free action.<br>';
TARGET_LOCK_TEXT += "Clear Target Lock at end of turn.";

var BARREL_ROLL_TEXT1 = 'If this will target into AI ship\'s firing arc choose <img src="img/action_barrelroll.png" alt="Barrel Roll">';
var BARREL_ROLL_TEXT2 = 'If this will put the AI ship out of firing enemy ship firing arc choose <img src="img/action_barrelroll.png" alt="Barrel Roll">';

var BOOST_TEXT1 = 'If this will target into AI ship\'s firing arc choose <img src="img/action_boost.png" alt="Boost">';
var BOOST_TEXT2 = 'If this will put the AI ship out of firing enemy ship firing arc choose <img src="img/action_boost.png" alt="Boost">';

var FOCUS_TEXT1 = 'If target is in a firing arc choose <img src="img/action_focus.png" alt="Focus">';
var FOCUS_TEXT2 = 'Always use <img src="img/action_focus.png" alt="Focus">';

var EVADE_TEXT = 'Else Choose <img src="img/action_evade.png" alt="Evade">';

var CLOAKING_TEXT = 'Cloak/Decloak <img src="img/action_cloak.png" alt="Cloak">';          // TODO

// ACTION TEXT - Huge Ships
var CORDINATE_TEXT = "CORDINATE";        // TODO

var JAM_TEXT = "JAM";                    // TODO

var RECOVER_TEXT = "RECOVER";            // TODO

var REINFORCE_TEXT = "REINFORCE";        // TODO

// SHIPS array and currently selected SHIP (re-defined in separate js file)
var ships = [];
var SHIP = {};


// ****************************************************************************
// Moves

function F( distance )
{
    var move = {};
    move.num = distance;
    move.dir = FORWARD;
    return move;
} 

function BL( distance )
{
    var move = {};
    move.num = distance;
    move.dir = BANK_LEFT;
    return move;
} 

function BR( distance )
{
    var move = {};
    move.num = distance;
    move.dir = BANK_RIGHT;
    return move;
} 

function TL( distance )
{
    var move = {};
    move.num = distance;
    move.dir = TURN_LEFT;
    return move;
} 

function TR( distance )
{
    var move = {};
    move.num = distance;
    move.dir = TURN_RIGHT;
    return move;
} 

function K( distance )
{
    var move = {};
    move.num = distance;
    move.dir = KOIOGRAN;
    return move;
} 

function invalid()
{
	var move = {};
	move.num = 0;
	move.dir = INVALID;
	return move;
}

// ****************************************************************************
// Helper Functions

function display_ship_choice( faction, funct )
{
    var data = "";
    var idx=0;
    var shown=0;
    
    data += '<form action="demo_form.asp" name="ship_buttons">';

    data += '<b>Faction:</b><br>';

    data += '<label>\n';
    data += '    <div title="Empire">' 
    data += '       <input type="radio" onclick="display_ship_choice(\'empire\', \'' + funct + '\')" hidden >'
    data += '       <img class="faction_button" src="img/empire.png" />'
    data += '    </div>'
    data += '</label>\n';
    
    data += '<label>\n';
    data += '    <div title="Rebels">' 
    data += '       <input type="radio" onclick="display_ship_choice(\'rebel\', \'' + funct + '\')" hidden >'
    data += '        <img class="faction_button" src="img/rebel.png" />'
    data += '    </div>'
    data += '</label>\n';

    data += '<br>\n';
    
    data += '<label>\n';
    data += '    <div title="Scum">' 
    data += '       <input type="radio" onclick="display_ship_choice(\'scum\', \'' + funct + '\')" hidden >'
    data += '        <img class="faction_button" src="img/scum.png" />'
    data += '    </div>'
    data += '</label>\n';
    
    data += '<b>AI Ship:</b><br>';
    
    for( idx=0; idx < ships.length; idx++ )
    {
        // only add buttons for ships for the selected faction
        if( ships[idx].faction == faction )
        {
            // run the selected function on the first faction ship found
            if( shown == 0 )
            {
                var fn = window[funct];
                fn(idx);
            }
            
            shown++;
            funct_args = funct + "(" + idx + ")";
    
            data += '<label>\n';
            data += '    <div title="' + ships[idx].name + '">' 
            data += '       <input type="radio" onclick="' + funct_args + '" hidden />'
            data += '       <img class="ship_button" src="' + ships[idx].image + '" />'
            data += '    </div>'
            data += '</label>\n';
    
            if( shown % 2 == 0 )
            {
                data += '<br>\n'
            }
        }
    }
        
    data += '<br>\n';
    data += '</form>\n';
    document.getElementById( "ships" ).innerHTML = data;
    
    // Set faction specific target images
    for( var idx=0; idx < 8; idx++ ) {
    	var target = "target" + idx
    	var image  = "img/" + faction + idx + ".png"
        document.getElementById(target).src = image;
    }
    
}

function gen_maneuver_table( name, table )
{
    var data;
    data = '<div class="label">' + name + "</div>";
    data += '<table class="ship_table">';
    for( var dir=0; dir < table.length; dir++ )
    {
        data += "<tr><td class=\"ship_cell\">" + DIRECTION[dir];
        for( var item=0; item < table[dir].length; item++ )
        {
            maneuver = format_maneuver( SHIP, table[dir][item] );
            data += "<td class=\"ship_cell\">";
            data += '<div class="table_num">' + maneuver.num + '</div>';
            data += '<div class="table_num">' + maneuver.img + '</div>';
            data += "</td>";
        }
        data += "</tr>";
    }
    data += "</table><br>";
    return data;
}

function display_ship( ship_id )
{
    // Set the global to the selected ship
    SHIP = ships[ ship_id ];
    if (SHIP === undefined ) {
    	var error = "<div><p>Unable to get ship(" + ship_id + ")</div>";
    	document.getElementById( "table" ).innerHTML( error );
    	return;
    } 
    
    // image
    ship = '<img src="' + SHIP.image + '" alt="' + SHIP.name + '"><br>' + SHIP.name;
    
    actions =  format_actions( SHIP );
    
    // Tables (closing, away, etc.)
    var tables = "";
    tables += gen_maneuver_table( CLOSING, SHIP.closing )
    tables += gen_maneuver_table( AWAY, SHIP.away )
    tables += gen_maneuver_table( FAR, SHIP.far )
    tables += gen_maneuver_table( STRESSED, SHIP.stressed )
    
    document.getElementById( "version" ).innerHTML = VERSION;
    document.getElementById( "ship").innerHTML = ship;
    document.getElementById( "actions" ).innerHTML = actions;
    document.getElementById( "table" ).innerHTML = tables;
}


function set_version()
{
    document.getElementById('version').innerHTML = VERSION;
}


function set_ship( ship_id )
{
    // Set the global to the selected ship
    SHIP = ships[ ship_id ];
    if (SHIP === undefined ) {
    	document.getElementById('ship_name').innerHTML = "<br>Unknown Ship: " + ship_id;
    	return;
    }

    set_version();
    
    // Update index html elements for the selected ship
   	document.getElementById('ship_image').src = SHIP.image;
   	document.getElementById('ship_name').innerHTML = "<br>" + SHIP.name;
    
    // Clear any previous maneuvers shown
    document.getElementById('closing_num').innerHTML = "<p></p>";
    document.getElementById('closing_img').innerHTML = "<p></p>";
    document.getElementById('away_num').innerHTML = "<p></p>";
    document.getElementById('away_img').innerHTML = "<p></p>";
    document.getElementById('far_num').innerHTML = "<p></p>";
    document.getElementById('far_img').innerHTML = "<p></p>";
    document.getElementById('stressed_num').innerHTML = "<p></p>";
    document.getElementById('stressed_img').innerHTML = "<p></p>";
    
    document.getElementById('selection').innerHTML = "<p>Press a direction</p>";
    document.getElementById('actions-text').innerHTML = format_actions( SHIP );
}


function pick( options )
{
	if (options === undefined)
	{
		return invalid();
	}

	var size=options.length;
	if ( size == 0 )
	{
		return invalid();
	}
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
    if( maneuver.dir == INVALID )
    {
    	num = "<span style=color:purple>NA</span>";
    	img = "";
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
    
    return actions;
}


// ****************************************************************************
// Main

function load_index()
{
    set_ship(0);
    display_ship_choice( "empire", "set_ship" );
}


function load_ships()
{
    display_ship(0);
    display_ship_choice( "empire", "display_ship" );
}


function movement( direction )
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
    
    maneuver = pick( SHIP.stressed[direction] );
    formatted = format_maneuver( SHIP, maneuver );
    document.getElementById( "stressed_num" ).innerHTML = formatted.num;
    document.getElementById( "stressed_img" ).innerHTML = formatted.img;
}
