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
var FAR = "Out of Range";            // Far

// MANEUVER DIRECTIONS
var TURN_LEFT = 0;
var BANK_LEFT = 1;
var FORWARD = 2;
var BANK_RIGHT = 3;
var TURN_RIGHT = 4;
var KOIOGRAN = 5;

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
var TARGET_LOCK_TEXT =  "Obtain <b>Target-Lock</b> on targeted ship as a free action.<br>";
TARGET_LOCK_TEXT += "Clear Target Lock at end of turn.";

var BARREL_ROLL_TEXT1 = "If this will target into AI ship's firing arc choose <b>Barrel-Roll</b>";
var BARREL_ROLL_TEXT2 = "If this will put the AI ship out of firing enemy ship firing arc choose <b>Barrel-Roll</b>";

var BOOST_TEXT1 = "If this will target into AI ship's firing arc choose <b>Boost</b>";
var BOOST_TEXT2 = "If this will put the AI ship out of firing enemy ship firing arc choose <b>Boost</b>";

var FOCUS_TEXT1 = "If target is in a firing arc choose <b>Focus</b>";
var FOCUS_TEXT2 = "Always use Focus";

var EVADE_TEXT = "Else Choose <b>Evade</b>";

var CLOAKING_TEXT = "CLOAKING";          // TODO

// ACTION TEXT - Hugh Ships
var CORDINATE_TEXT = "CORDINATE";        // TODO

var JAM_TEXT = "JAM";                    // TODO

var RECOVER_TEXT = "RECOVER";            // TODO

var REINFORCE_TEXT = "REINFORCE";        // TODO

// SHIPS array and currently selected SHIP (re-defined in seperate js file)
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
    
            if( idx % 2 == 1 )
            {
                data += '<br>\n'
            }
        }
    }
        
    data += '<br>\n';
    data += '</form>\n';
    document.getElementById( "ships" ).innerHTML = data;
}


function display_ship( ship_id )
{
    // Set the global to the selected ship
    SHIP = ships[ ship_id ];
    
    var data;
    data = '<div style="font-size: x-large; font-weight: bold">';
    data += '<a name="' + SHIP.name + '"></a>';
    
    // image
    data += '<img src="' + SHIP.image + '" alt="' + SHIP.name + '">';
    
    // name
    data += SHIP.name + "</div>";
    data += format_actions( SHIP );
    
    // Tables (closing, away)
    data += '<div class="label">' + CLOSING + "</div>";
    data += '<table class="ship_table">';
    for( var dir=0; dir < SHIP.closing.length; dir++ )
    {
        data += "<tr><td class=\"ship_cell\">" + DIRECTION[dir];
        for( var item=0; item < SHIP.closing[dir].length; item++ )
        {
            maneuver = format_maneuver( SHIP, SHIP.closing[dir][item] );
            data += "<td class=\"ship_cell\">";
            data += '<div class="table_num">' + maneuver.num + '</div>';
            data += '<div class="table_num">' + maneuver.img + '</div>';
            data += "</td>";
        }
        data += "</tr>";
    }
    data += "</table><br>";
    
    data += '<div class="label">' + AWAY + "</div>";
    data += '<table class="ship_table">';
    for( var dir=0; dir < SHIP.away.length; dir++ )
    {
        data += "<tr><td class=\"ship_cell\">" + DIRECTION[dir];
        for( var item=0; item < SHIP.away[dir].length; item++ )
        {
            maneuver = format_maneuver( SHIP, SHIP.away[dir][item] );
            data += "<td class=\"ship_cell\">";
            data += '<div class="table_num">' + maneuver.num + '</div>';
            data += '<div class="table_num">' + maneuver.img + '</div>';
            data += "</td>";
        }
        data += "</tr>";
    }
    data += "</table><br>";
    
    data += '<div class="label">' + FAR + "</div>";
    data += '<table class="ship_table">';
    for( var dir=0; dir < SHIP.far.length; dir++ )
    {
        data += "<tr><td class=\"ship_cell\">" + DIRECTION[dir];
        for( var item=0; item < SHIP.far[dir].length; item++ )
        {
            maneuver = format_maneuver( SHIP, SHIP.far[dir][item] );
            data += "<td class=\"ship_cell\">";
            data += '<div class="table_num">' + maneuver.num + '</div>';
            data += '<div class="table_num">' + maneuver.img + '</div>';
            data += "</td>";
        }
        data += "</tr>";
    }
    data += "</table>";
    
    document.getElementById('version').innerHTML = VERSION;
    document.getElementById( "table" ).innerHTML = data;
}


function set_version()
{
    document.getElementById('version').innerHTML = VERSION;
}


function set_ship( ship_id )
{
    // Set the global to the selected ship
    SHIP = ships[ ship_id ];
    
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
}
