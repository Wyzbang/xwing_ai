
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

