<!--

// ***************************************************************************
// X-Wing Miniatures AI - Javascript

// ****************************************************************************
// Constants

var VERSION = "v1.6.0";

// ENEMY SHIP DIRECTIONS
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
var AWAY = "Retreating";			// Heading away
var CLOSING = "Closing";			// Closing
var FAR = "Out of Range";			// Far

// MANEUVER DIRECTIONS
var TURN_LEFT = 0;
var BANK_LEFT = 1;
var FORWARD = 2;
var BANK_RIGHT = 3;
var TURN_RIGHT = 4;
var KOIOGRAN = 5;

var MANEUVER = new Array( "turn-left", "bank-left", "forward", 
						  "bank-right", "turn-right", "koiogran" );

// ACTIONS
var TARGET_LOCK = 0x1;
var BARREL_ROLL = 0x2;
var BOOST       = 0x4;
var FOCUS       = 0x8;
var EVADE       = 0x10;

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

// ****************************************************************************
// Moves

function F( distance )
{
	var move = new Object();
	move.num = distance;
	move.dir = FORWARD;
	return move
} 

function BL( distance )
{
	var move = new Object();
	move.num = distance;
	move.dir = BANK_LEFT;
	return move
} 

function BR( distance )
{
	var move = new Object();
	move.num = distance;
	move.dir = BANK_RIGHT;
	return move
} 

function TL( distance )
{
	var move = new Object();
	move.num = distance;
	move.dir = TURN_LEFT;
	return move
} 

function TR( distance )
{
	var move = new Object();
	move.num = distance;
	move.dir = TURN_RIGHT;
	return move
} 

function K( distance )
{
	var move = new Object();
	move.num = distance;
	move.dir = KOIOGRAN;
	return move
} 


// ****************************************************************************
// Tie Fighter

var	tie = new Object();
tie.name = "Tie Fighter";
tie.image = "img/tie.png";
tie.simple = new Array( F(2), BL(2), BR(2), F(3) );
tie.difficult = new Array( K(3), K(4) );  
tie.actions = ( BARREL_ROLL + FOCUS + EVADE );

// AI choices
tie.closing = new Array();
tie.closing[0] = new Array( BL(2), F(2),  F(2),  F(2),  F(2),  BR(2), K(4),  K(4)  );
tie.closing[1] = new Array( F(2),  BR(3), BR(3), BR(2), BR(2), BR(2), TR(2), TR(1) );
tie.closing[2] = new Array( TR(2), TR(2), TR(2), TR(1), TR(1), TR(1), K(4),  K(3)  );
tie.closing[3] = new Array( TR(2), TR(2), TR(1), TR(1), TR(1), K(4),  K(4),  K(3)  );
tie.closing[4] = new Array( TL(3), F(5),  TR(3), K(4),  K(4),  K(3),  K(3),  K(3)  );
tie.closing[5] = new Array( TL(2), TL(2), TL(1), TL(1), TL(1), K(4),  K(4),  K(3)  );
tie.closing[6] = new Array( TL(2), TL(2), TL(2), TL(1), TL(1), TL(1), K(4),  K(3)  );
tie.closing[7] = new Array( TL(2), TL(1), BL(3), BL(3), BL(2), BL(2), BL(2), F(2)  );

tie.away = new Array();
tie.away[0] = new Array( F(5),  F(5),  F(5),  F(4),  F(4),  F(3),  F(3),  F(2)  );
tie.away[1] = new Array( F(5),  F(4),  F(4),  BR(3), BR(3), BR(3), BR(2), BR(2) );
tie.away[2] = new Array( BR(3), BR(2), TR(3), TR(3), TR(2), TR(2), TR(1), TR(1) );
tie.away[3] = new Array( TR(2), TR(2), TR(2), TR(1), TR(1), K(4),  K(3),  K(3)  );
tie.away[4] = new Array( TL(1), TR(1), K(4),  K(4),  K(3),  K(3),  K(3),  K(3)  );
tie.away[5] = new Array( TL(2), TL(2), TL(2), TL(1), TL(1), K(4),  K(3),  K(3)  );
tie.away[6] = new Array( TL(3), TL(3), TL(2), TL(2), TL(1), TL(1), BL(3), BL(2) );
tie.away[7] = new Array( BL(3), BL(3), BL(3), BL(2), BL(2), F(5),  F(4),  F(4)  );

tie.far = new Array();
tie.far[0] = new Array( BL(3), F(5),  F(5),  F(5),  F(5),  F(4),  F(3),  BR(3) );
tie.far[1] = new Array( BR(3), BR(3), BR(2), TR(3), TR(3), TR(2), TR(2), TR(1) );
tie.far[2] = new Array( BR(3), BR(2), TR(3), TR(3), TR(2), TR(2), TR(1), TR(1) );
tie.far[3] = new Array( TR(3), TR(3), TR(3), TR(3), TR(2), TR(2), TR(1), TR(1) );
tie.far[4] = new Array( TL(2), TL(1), TL(1), TR(2), TR(1), TR(1), K(3),  K(3)  );
tie.far[5] = new Array( TL(3), TL(3), TL(3), TL(3), TL(2), TL(2), TL(1), TL(1) );
tie.far[6] = new Array( TL(3), TL(3), TL(2), TL(2), TL(1), TL(1), BL(3), BL(2) );
tie.far[7] = new Array( TL(3), TL(3), TL(2), TL(2), TL(1), BL(3), BL(3), BL(2) );

// ****************************************************************************
// Tie Advanced

var tieAdvanced = new Object();
tieAdvanced.name = "Tie Advanced";
tieAdvanced.image = "img/TieAdvanced.png";
tieAdvanced.simple = new Array( BL(1), BR(1), F(2), F(3) );
tieAdvanced.difficult = new Array( K(4) );
tieAdvanced.actions = ( TARGET_LOCK + BARREL_ROLL + FOCUS + EVADE );

// AI choices
tieAdvanced.closing = new Array();
tieAdvanced.closing[0] = new Array( BL(2), F(2),  F(2),  F(2),  F(2),  BR(2), K(4),  K(4)  );
tieAdvanced.closing[1] = new Array( F(2),  BR(3), BR(3), BR(2), BR(2), BR(2), TR(3), TR(2) );
tieAdvanced.closing[2] = new Array( BR(1), BR(1), TR(2), TR(2), TR(2), TR(2), K(4),  K(4)  );
tieAdvanced.closing[3] = new Array( F(5),  BR(1), TR(2), TR(2), TR(2), K(4),  K(4),  K(4)  );
tieAdvanced.closing[4] = new Array( TL(3), TL(2), F(4),  TR(3), TR(2), K(4),  K(4),  K(4)  );
tieAdvanced.closing[5] = new Array( TL(2), TL(2), TL(2), BL(1), F(5),  K(4),  K(4),  K(4)  );
tieAdvanced.closing[6] = new Array( TL(2), TL(2), TL(2), TL(2), BL(1), BL(1), K(4),  K(4)  );
tieAdvanced.closing[7] = new Array( TL(3), TL(2), BL(3), BL(3), BL(2), BL(2), BL(2), F(2)  );

tieAdvanced.away = new Array();
tieAdvanced.away[0] = new Array( F(5),  F(5),  F(5),  F(4),  F(4),  F(3),  F(3),  F(2)  );
tieAdvanced.away[1] = new Array( F(4),  F(3),  BR(3), BR(3), BR(3), BR(2), BR(2), BR(2) );
tieAdvanced.away[2] = new Array( BR(3), BR(2), BR(1), TR(3), TR(3), TR(2), TR(2), TR(2) );
tieAdvanced.away[3] = new Array( TR(2), TR(2), TR(2), TR(2), K(4),  K(4),  K(4),  K(4)  );
tieAdvanced.away[4] = new Array( TL(2), TL(2), TR(2), TR(2), K(4),  K(4),  K(4),  K(4)  );
tieAdvanced.away[5] = new Array( TL(2), TL(2), TL(2), TL(2), K(4),  K(4),  K(4),  K(4)  );
tieAdvanced.away[6] = new Array( TL(3), TL(3), TL(3), TL(2), TL(2), TL(2), BL(1), BL(2) );
tieAdvanced.away[7] = new Array( BL(3), BL(3), BL(3), BL(2), BL(2), BL(2), F(4),  F(3)  );

tieAdvanced.far = new Array();
tieAdvanced.far[0] = new Array( BL(3), F(5),  F(5),  F(5),  F(5),  F(4),  F(3),  BR(3) );
tieAdvanced.far[1] = new Array( BR(3), BR(2), BR(1), TR(3), TR(3), TR(3), TR(2), TR(2) );
tieAdvanced.far[2] = new Array( BR(3), BR(2), BR(1), TR(3), TR(3), TR(3), TR(2), TR(2) );
tieAdvanced.far[3] = new Array( TR(3), TR(3), TR(3), TR(3), TR(2), TR(2), TR(2), TR(2) );
tieAdvanced.far[4] = new Array( TL(3), TL(2), TL(2), TR(3), TR(2), TR(2), K(4),  K(4)  );
tieAdvanced.far[5] = new Array( TL(3), TL(3), TL(3), TL(3), TL(2), TL(2), TL(2), TL(2) );
tieAdvanced.far[6] = new Array( TL(3), TL(3), TL(3), TL(2), TL(2), BL(3), BL(2), BL(1) );
tieAdvanced.far[7] = new Array( TL(3), TL(3), TL(3), TL(2), TL(2), BL(3), BL(2), BL(1) );

// ****************************************************************************
// X-Wing

var	xwing = new Object();
xwing.name = "X-Wing";
xwing.image = "img/xwing.png";
xwing.simple = new Array( F(1), BL(1), BR(1), F(2) );
xwing.difficult = new Array( K(4) );
xwing.actions = ( TARGET_LOCK + FOCUS );

// AI choices
xwing.closing = new Array();
xwing.closing[0] = new Array( BL(1), F(2),  F(2),  F(2),  F(1),  F(1),  F(1),  BR(1) );
xwing.closing[1] = new Array( F(1),  BR(3), BR(3), BR(2), BR(2), BR(2), TR(2), TR(1) );
xwing.closing[2] = new Array( BR(1), BR(1), BR(1), TR(3), TR(3), TR(2), TR(2), TR(2) );
xwing.closing[3] = new Array( BR(1), BR(1), TR(2), TR(2), TR(2), K(4),  K(4),  K(4)  );
xwing.closing[4] = new Array( TL(3), F(3),  TR(3), K(4),  K(4),  K(4),  K(4),  K(4) );
xwing.closing[5] = new Array( TL(2), TL(2), TL(2), BL(1), BL(1), K(4),  K(4),  K(4)  );
xwing.closing[6] = new Array( TL(3), TL(3), TL(2), TL(2), TL(2), BL(1), BL(1), BL(1) );
xwing.closing[7] = new Array( TL(2), TL(1), BL(3), BL(3), BL(2), BL(2), BL(2), F(1)  );

xwing.away = new Array();
xwing.away[0] = new Array( F(4),  F(4),  F(3),  F(3),  F(3),  F(2),  F(2),  F(1)  );
xwing.away[1] = new Array( BR(3), BR(3), BR(2), BR(2), TR(3), TR(3), TR(2), TR(2) );
xwing.away[2] = new Array( BR(2), BR(1), TR(3), TR(3), TR(3), TR(2), TR(2), TR(2) );
xwing.away[3] = new Array( TR(3), TR(3), TR(2), TR(2), TR(2), K(4),  K(4),  K(4)  );
xwing.away[4] = new Array( TL(2), TL(2), TR(2), TR(2), K(4),  K(4),  K(4),  K(4)  );
xwing.away[5] = new Array( TL(3), TL(3), TL(2), TL(2), TL(2), K(4),  K(4),  K(4)  );
xwing.away[6] = new Array( TL(3), TL(3), TL(3), TL(2), TL(2), TL(2), BL(2), BL(1) );
xwing.away[7] = new Array( TL(3), TL(3), TL(2), TL(2), BL(3), BL(3), BL(2), BL(2) );

xwing.far = new Array();
xwing.far[0] = new Array( BL(3), F(4),  F(4),  F(4),  F(3),  F(3),  F(2),  BR(3) );
xwing.far[1] = new Array( BR(3), BR(2), BR(1), TR(3), TR(3), TR(2), TR(2), TR(2) );
xwing.far[2] = new Array( BR(3), BR(2), BR(1), TR(3), TR(3), TR(2), TR(2), TR(2) );
xwing.far[3] = new Array( TR(3), TR(3), TR(3), TR(2), TR(2), TR(2), TR(2), TR(2) );
xwing.far[4] = new Array( TL(3), TL(2), TL(2), K(4),  K(4),  TR(3), TR(2), TR(2) );
xwing.far[5] = new Array( TL(3), TL(3), TL(3), TL(2), TL(2), TL(2), TL(2), TL(2) );
xwing.far[6] = new Array( BL(3), BL(2), BL(1), TL(3), TL(3), TL(2), TL(2), TL(2) );
xwing.far[7] = new Array( BL(3), BL(2), BL(1), TL(3), TL(3), TL(2), TL(2), TL(2) );

// ****************************************************************************
// Y-Wing

var	ywing = new Object();
ywing.name = "Y-Wing";
ywing.image = "img/ywing.png";
ywing.simple = new Array( F(1), F(2) );
ywing.difficult = new Array( TL(3), TR(3), F(4), K(4) );
ywing.actions = ( TARGET_LOCK + FOCUS );

// AI choices
ywing.closing = new Array();
ywing.closing[0] = new Array( BL(1), F(1),  F(1),  F(2),  F(2),  BR(1) );
ywing.closing[1] = new Array( F(1),  BR(2), BR(2), BR(1), TR(2), TR(2) );
ywing.closing[2] = new Array( BR(1), BR(1), TR(2), TR(2), TR(2), TR(2) );
ywing.closing[3] = new Array( K(4),  K(4),  K(4),  BR(1), TR(2), TR(2) );
ywing.closing[4] = new Array( TL(2), K(4),  K(4),  K(4),  K(4),  TR(2) );
ywing.closing[5] = new Array( TL(2), TL(2), BL(1), K(4),  K(4),  K(4)  );
ywing.closing[6] = new Array( TL(2), TL(2), TL(2), TL(2), BL(1), BL(1) );
ywing.closing[7] = new Array( TL(2), TL(2), BL(2), BL(2), BL(1), F(1)  );

ywing.away = new Array();
ywing.away[0] = new Array( F(3),  F(3),  F(2),  F(2),  F(2),  F(1)  );
ywing.away[1] = new Array( BR(3), BR(2), TR(2), TR(2), TR(2), TR(3) );
ywing.away[2] = new Array( BR(1), BR(2), TR(2), TR(2), TR(2), TR(3) );
ywing.away[3] = new Array( K(4),  K(4),  TR(3), TR(3), TR(2), TR(2) );
ywing.away[4] = new Array( TL(2), K(4),  K(4),  K(4),  K(4),  TR(2) );
ywing.away[5] = new Array( TL(3), TL(3), TL(2), TL(2), K(4),  K(4)  );
ywing.away[6] = new Array( TL(2), TL(2), TL(2), TL(3), BL(1), BL(2) );
ywing.away[7] = new Array( TR(2), TR(2), TL(2), TL(3), BL(3), BL(2) );

ywing.far = new Array();
ywing.far[0] = new Array( BL(3), F(4),  F(4),  F(4),  F(4),  F(3),  F(3),  F(3),  F(2),  BR(3) );
ywing.far[1] = new Array( BR(3), BR(2), BR(1), BR(1), TR(3), TR(3), TR(3), TR(2), TR(2), TR(2) );
ywing.far[2] = new Array( BR(3), BR(2), BR(1), BR(1), TR(3), TR(3), TR(3), TR(2), TR(2), TR(2) );
ywing.far[3] = new Array( TR(3), TR(3), TR(3), TR(3), TR(2), TR(2), TR(2), TR(2), TR(2), TR(2) );
ywing.far[4] = new Array( TL(3), TL(3), TL(2), TL(2), K(4),  K(4),  TR(3), TR(3), TR(2), TR(2) );
ywing.far[5] = new Array( TL(3), TL(3), TL(3), TL(3), TL(2), TL(2), TL(2), TL(2), TL(2), TL(2) );
ywing.far[6] = new Array( BL(3), BL(2), BL(1), BL(1), TL(3), TL(3), TL(3), TL(2), TL(2), TL(2) );
ywing.far[7] = new Array( BL(3), BL(2), BL(1), BL(1), TL(3), TL(3), TL(3), TL(2), TL(2), TL(2) );

// ****************************************************************************
// Tie Interceptor

var tieInterceptor = new Object();
tieInterceptor.name = "Tie Interceptor";
tieInterceptor.image = "img/tieInterceptor.png";
tieInterceptor.simple = new Array( F(2), F(3), F(4), TL(2), BL(2), BR(2), TR(2) );
tieInterceptor.difficult = new Array( K(3), K(5) );   
tieInterceptor.actions = ( BARREL_ROLL + BOOST + FOCUS + EVADE );

// AI choices
tieInterceptor.closing = new Array();
tieInterceptor.closing[0] = new Array( BL(2), F(2),  F(2),  K(5),  K(5),  BR(2) );
tieInterceptor.closing[1] = new Array( F(2),  BR(3), BR(2), BR(2), TR(2), TR(1)  );
tieInterceptor.closing[2] = new Array( TR(1), TR(1), TR(2), TR(2), K(3),  K(5) );
tieInterceptor.closing[3] = new Array( K(5),  K(5),  K(3),  TR(2), TR(1), TR(1)  );
tieInterceptor.closing[4] = new Array( K(5),  K(3),  K(3),  TL(3), TR(3), F(5)  );
tieInterceptor.closing[5] = new Array( TL(1), TL(1), TL(2), K(3),  K(5),  K(5) );
tieInterceptor.closing[6] = new Array( K(5),  K(3),  TL(2), TL(2), TL(1), TL(1) );
tieInterceptor.closing[7] = new Array( F(2),  BL(3), BL(2), BL(2), TL(2), TL(1) );

tieInterceptor.away = new Array();
tieInterceptor.away[0] = new Array( F(5),  F(4),  F(4),  F(3),  F(3),  F(2) );
tieInterceptor.away[1] = new Array( F(5),  F(4),  BR(3), BR(3), BR(2), BR(2) );
tieInterceptor.away[2] = new Array( BR(3), TR(3), BR(2), TR(2), TR(2), TR(1) );
tieInterceptor.away[3] = new Array( K(5),  K(3),  K(3),  TR(2), TR(2), TR(1) );
tieInterceptor.away[4] = new Array( K(3),  K(3),  K(3),  K(3),  TL(1), TR(1) );
tieInterceptor.away[5] = new Array( TL(1), TL(2), TL(2), K(3),  K(3),  K(5) );
tieInterceptor.away[6] = new Array( BL(3), TL(3), BL(2), TL(2), TL(2), TL(1) );
tieInterceptor.away[7] = new Array( BL(2), BL(2), BL(3), BL(3), F(4),  F(5) );

tieInterceptor.far = new Array();
tieInterceptor.far[0] = new Array( BL(3), F(5),  F(5),  F(5),  F(5),  F(4),  F(4),  F(4),  F(3),  BR(3) );
tieInterceptor.far[1] = new Array( BR(3), BR(3), BR(2), BR(2), TR(3), TR(3), TR(2), TR(2), TR(1), TR(1) );
tieInterceptor.far[2] = new Array( BR(3), BR(3), BR(2), BR(2), TR(3), TR(3), TR(2), TR(2), TR(1), TR(1) );
tieInterceptor.far[3] = new Array( TR(3), TR(3), TR(3), TR(2), TR(2), TR(2), TR(1), TR(1), TR(1), TR(1) );
tieInterceptor.far[4] = new Array( TL(3), TL(2), TL(1), TL(1), K(3),  K(3),  TR(3), TR(2), TR(1), TR(1) );
tieInterceptor.far[5] = new Array( TL(3), TL(3), TL(3), TL(2), TL(2), TL(2), TL(1), TL(1), TL(1), TL(1) );
tieInterceptor.far[6] = new Array( BL(3), BL(3), BL(2), BL(2), TL(3), TL(3), TL(2), TL(2), TL(1), TL(1) );
tieInterceptor.far[7] = new Array( BL(3), BL(3), BL(2), BL(2), TL(3), TL(3), TL(2), TL(2), TL(1), TL(1) );

// ****************************************************************************
// A-Wing

var awing = new Object();
awing.name = "A-Wing";
awing.image = "img/awing.png";
awing.simple = new Array( F(2), F(3), F(4), F(5), TL(2), BL(2), BR(2), TR(2));
awing.difficult = new Array( K(3), K(5) );
awing.actions = ( TARGET_LOCK + BOOST + FOCUS + EVADE );

// AI choices
awing.closing = new Array();
awing.closing[0] = new Array( BL(2), BR(2), F(2),  F(2),  K(5),  K(5) );
awing.closing[1] = new Array( F(2),  BR(3), BR(2), BR(2), TR(2), TR(1)  );
awing.closing[2] = new Array( TR(1), TR(1), TR(2), TR(2), K(3),  K(5) );
awing.closing[3] = new Array( K(5),  K(5),  K(3),  TR(2), TR(1), TR(1)  );
awing.closing[4] = new Array( K(5),  K(3),  K(3),  TL(3), TR(3), F(5)  );
awing.closing[5] = new Array( TL(1), TL(1), TL(2), K(3),  K(5),  K(5) );
awing.closing[6] = new Array( K(5),  K(3),  TL(2), TL(2), TL(1), TL(1) );
awing.closing[7] = new Array( F(2),  BL(3), BL(2), BL(2), TL(2), TL(1) );

awing.away = new Array();
awing.away[0] = new Array( F(5),  F(4),  F(4),  F(3),  F(3),  F(2) );
awing.away[1] = new Array( F(5),  F(4),  BR(3), BR(3), BR(2), BR(2) );
awing.away[2] = new Array( BR(3), TR(3), BR(2), TR(2), TR(2), TR(1) );
awing.away[3] = new Array( K(5),  K(3),  K(3),  TR(2), TR(2), TR(1) );
awing.away[4] = new Array( K(3),  K(3),  K(3),  K(3),  TL(1), TR(1) );
awing.away[5] = new Array( TL(1), TL(2), TL(2), K(3),  K(3),  K(5) );
awing.away[6] = new Array( BL(3), TL(3), BL(2), TL(2), TL(2), TL(1) );
awing.away[7] = new Array( BL(2), BL(2), BL(3), BL(3), F(4),  F(5) );

awing.far = new Array();
awing.far[0] = new Array( BL(3), F(5),  F(5),  F(5),  F(5),  F(4),  F(4),  F(4),  F(3),  BR(3) );
awing.far[1] = new Array( BR(3), BR(3), BR(2), BR(2), TR(3), TR(3), TR(2), TR(2), TR(1), TR(1) );
awing.far[2] = new Array( BR(3), BR(3), BR(2), BR(2), TR(3), TR(3), TR(2), TR(2), TR(1), TR(1) );
awing.far[3] = new Array( TR(3), TR(3), TR(3), TR(2), TR(2), TR(2), TR(1), TR(1), TR(1), TR(1) );
awing.far[4] = new Array( TL(3), TL(2), TL(1), TL(1), K(3),  K(3),  TR(3), TR(2), TR(1), TR(1) );
awing.far[5] = new Array( TL(3), TL(3), TL(3), TL(2), TL(2), TL(2), TL(1), TL(1), TL(1), TL(1) );
awing.far[6] = new Array( BL(3), BL(3), BL(2), BL(2), TL(3), TL(3), TL(2), TL(2), TL(1), TL(1) );
awing.far[7] = new Array( BL(3), BL(3), BL(2), BL(2), TL(3), TL(3), TL(2), TL(2), TL(1), TL(1) );

// ****************************************************************************
// Slave 1

var slave1 = new Object();
slave1.name = "Firespray-31";
slave1.image = "img/slave1.png";
slave1.simple = new Array( F(1), F(2), BL(1), BR(1) );
slave1.difficult = new Array( K(3), K(4) );   
slave1.actions = ( TARGET_LOCK + FOCUS + EVADE );

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

slave1.far = new Array();
slave1.far[0] = new Array( BL(3), F(4),  F(4),  F(4),  F(4),  F(3),  F(3),  F(3),  F(2),  BR(3) );
slave1.far[1] = new Array( BR(3), BR(2), BR(1), BR(1), TR(3), TR(3), TR(3), TR(2), TR(2), TR(2) );
slave1.far[2] = new Array( BR(3), BR(2), BR(1), BR(1), TR(3), TR(3), TR(3), TR(2), TR(2), TR(2) );
slave1.far[3] = new Array( TR(3), TR(3), TR(3), TR(3), TR(2), TR(2), TR(2), TR(2), TR(2), TR(2) );
slave1.far[4] = new Array( TL(3), TL(3), TL(2), TL(2), K(3),  K(3),  TR(3), TR(3), TR(2), TR(2) );
slave1.far[5] = new Array( TL(3), TL(3), TL(3), TL(3), TL(2), TL(2), TL(2), TL(2), TL(2), TL(2) );
slave1.far[6] = new Array( BL(3), BL(2), BL(1), BL(1), TL(3), TL(3), TL(3), TL(2), TL(2), TL(2) );
slave1.far[7] = new Array( BL(3), BL(2), BL(1), BL(1), TL(3), TL(3), TL(3), TL(2), TL(2), TL(2) );


// ****************************************************************************
// Millenium Falcon

var falcon = new Object();
falcon.name = "YT-1300";
falcon.image = "img/falcon.png";
falcon.simple = new Array( F(1), F(2), BL(1), BR(1) );
falcon.difficult = new Array( K(3), K(4) );   
falcon.actions = ( TARGET_LOCK + FOCUS );

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

falcon.far = new Array();
falcon.far[0] = new Array( BL(3), F(4),  F(4),  F(4),  F(4),  F(3),  F(3),  F(3),  F(2),  BR(3) );
falcon.far[1] = new Array( BR(3), BR(2), BR(1), BR(1), TR(2), TR(2), TR(2), TR(1), TR(1), TR(1) );
falcon.far[2] = new Array( BR(3), BR(2), BR(1), BR(1), TR(2), TR(2), TR(2), TR(1), TR(1), TR(1) );
falcon.far[3] = new Array( TR(2), TR(2), TR(2), TR(2), TR(1), TR(1), TR(1), TR(1), TR(1), TR(1) );
falcon.far[4] = new Array( TL(3), TL(3), TL(2), TL(2), K(3),  K(3),  TR(3), TR(3), TR(2), TR(2) );
falcon.far[5] = new Array( TL(2), TL(2), TL(2), TL(2), TL(1), TL(1), TL(1), TL(1), TL(1), TL(1) );
falcon.far[6] = new Array( BL(3), BL(2), BL(1), BL(1), TL(2), TL(2), TL(2), TL(1), TL(1), TL(1) );
falcon.far[7] = new Array( BL(3), BL(2), BL(1), BL(1), TL(2), TL(2), TL(2), TL(1), TL(1), TL(1) );

// ****************************************************************************
// TieBomber

var tieBomber = new Object();
tieBomber.name = "Tie Bomber";
tieBomber.image = "img/tieBomber.png";
tieBomber.simple = new Array( F(1), F(2), F(3), BL(2), BR(2) );
tieBomber.difficult = new Array( TL(2), TR(2), K(5) );   
tieBomber.actions = ( BARREL_ROLL + FOCUS + TARGET_LOCK );

tieBomber.closing = new Array();
tieBomber.closing[0] = new Array( F(1) );
tieBomber.closing[1] = new Array( F(1) );
tieBomber.closing[2] = new Array( F(1) );
tieBomber.closing[3] = new Array( F(1) );
tieBomber.closing[4] = new Array( F(1) );
tieBomber.closing[5] = new Array( F(1) );
tieBomber.closing[6] = new Array( F(1) );
tieBomber.closing[7] = new Array( F(1) );

tieBomber.away = new Array();
tieBomber.away[0] = new Array( F(1) );
tieBomber.away[1] = new Array( F(1) );
tieBomber.away[2] = new Array( F(1) );
tieBomber.away[3] = new Array( F(1) );
tieBomber.away[4] = new Array( F(1) );
tieBomber.away[5] = new Array( F(1) );
tieBomber.away[6] = new Array( F(1) );
tieBomber.away[7] = new Array( F(1) );

tieBomber.far = new Array();
tieBomber.far[0] = new Array( F(1) );
tieBomber.far[1] = new Array( F(1) );
tieBomber.far[2] = new Array( F(1) );
tieBomber.far[3] = new Array( F(1) );
tieBomber.far[4] = new Array( F(1) );
tieBomber.far[5] = new Array( F(1) );
tieBomber.far[6] = new Array( F(1) );
tieBomber.far[7] = new Array( F(1) );

// ****************************************************************************
// B-Wing

var bwing = new Object();
bwing.name = "B-Wing";
bwing.image = "img/bwing.png";
bwing.simple = new Array( BL(1), F(1), F(2), BR(1) );
bwing.difficult = new Array( TL(1), BL(3), F(1), BR(3), TR(1), K(2) );   
bwing.actions = ( BARREL_ROLL + FOCUS + TARGET_LOCK );

bwing.closing = new Array();
bwing.closing[0] = new Array( F(1) );
bwing.closing[1] = new Array( F(1) );
bwing.closing[2] = new Array( F(1) );
bwing.closing[3] = new Array( F(1) );
bwing.closing[4] = new Array( F(1) );
bwing.closing[5] = new Array( F(1) );
bwing.closing[6] = new Array( F(1) );
bwing.closing[7] = new Array( F(1) );

bwing.away = new Array();
bwing.away[0] = new Array( F(1) );
bwing.away[1] = new Array( F(1) );
bwing.away[2] = new Array( F(1) );
bwing.away[3] = new Array( F(1) );
bwing.away[4] = new Array( F(1) );
bwing.away[5] = new Array( F(1) );
bwing.away[6] = new Array( F(1) );
bwing.away[7] = new Array( F(1) );

bwing.far = new Array();
bwing.far[0] = new Array( F(1) );
bwing.far[1] = new Array( F(1) );
bwing.far[2] = new Array( F(1) );
bwing.far[3] = new Array( F(1) );
bwing.far[4] = new Array( F(1) );
bwing.far[5] = new Array( F(1) );
bwing.far[6] = new Array( F(1) );
bwing.far[7] = new Array( F(1) );

// ****************************************************************************
// Lamda Shuttle

var lambda = new Object();
lambda.name = "Lambda Shuttle";
lambda.image = "img/lambda.png";
lambda.simple = new Array( BL(1), F(1), F(2), BR(1) );
lambda.difficult = new Array( TL(2), BL(3), F(0), BR(3), TR(2) );   
lambda.actions = ( BARREL_ROLL + FOCUS + TARGET_LOCK );

lambda.closing = new Array();
lambda.closing[0] = new Array( F(0) );
lambda.closing[1] = new Array( F(1) );
lambda.closing[2] = new Array( F(1) );
lambda.closing[3] = new Array( F(1) );
lambda.closing[4] = new Array( F(1) );
lambda.closing[5] = new Array( F(1) );
lambda.closing[6] = new Array( F(1) );
lambda.closing[7] = new Array( F(1) );

lambda.away = new Array();
lambda.away[0] = new Array( F(1) );
lambda.away[1] = new Array( F(1) );
lambda.away[2] = new Array( F(1) );
lambda.away[3] = new Array( F(1) );
lambda.away[4] = new Array( F(1) );
lambda.away[5] = new Array( F(1) );
lambda.away[6] = new Array( F(1) );
lambda.away[7] = new Array( F(1) );

lambda.far = new Array();
lambda.far[0] = new Array( F(1) );
lambda.far[1] = new Array( F(1) );
lambda.far[2] = new Array( F(1) );
lambda.far[3] = new Array( F(1) );
lambda.far[4] = new Array( F(1) );
lambda.far[5] = new Array( F(1) );
lambda.far[6] = new Array( F(1) );
lambda.far[7] = new Array( F(1) );

// ****************************************************************************
// HWK-290 (Moldy Crow)

var hwk290 = new Object();
hwk290.name = "HWK-290";
hwk290.image = "img/hwk290.png";
hwk290.simple = new Array( BL(1), F(1), F(2), BR(1) );
hwk290.difficult = new Array( BL(3), F(4), BR(3) );   
hwk290.actions = ( FOCUS + TARGET_LOCK );

hwk290.closing = new Array();
hwk290.closing[0] = new Array( F(1) );
hwk290.closing[1] = new Array( F(1) );
hwk290.closing[2] = new Array( F(1) );
hwk290.closing[3] = new Array( F(1) );
hwk290.closing[4] = new Array( F(1) );
hwk290.closing[5] = new Array( F(1) );
hwk290.closing[6] = new Array( F(1) );
hwk290.closing[7] = new Array( F(1) );

hwk290.away = new Array();
hwk290.away[0] = new Array( F(1) );
hwk290.away[1] = new Array( F(1) );
hwk290.away[2] = new Array( F(1) );
hwk290.away[3] = new Array( F(1) );
hwk290.away[4] = new Array( F(1) );
hwk290.away[5] = new Array( F(1) );
hwk290.away[6] = new Array( F(1) );
hwk290.away[7] = new Array( F(1) );

hwk290.far = new Array();
hwk290.far[0] = new Array( F(1) );
hwk290.far[1] = new Array( F(1) );
hwk290.far[2] = new Array( F(1) );
hwk290.far[3] = new Array( F(1) );
hwk290.far[4] = new Array( F(1) );
hwk290.far[5] = new Array( F(1) );
hwk290.far[6] = new Array( F(1) );
hwk290.far[7] = new Array( F(1) );

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
	actions += "</ol>";
	
	return actions;
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
