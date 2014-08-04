"""
X-wing Miniatures AI Maneuver Generator
"""
import datetime
import copy
import optparse
import os
import re
import xml.dom.minidom
import xml.etree.ElementTree as ElementTree
import zipfile

from version import VERSION

# ******************************************************************************

DEBUG=False
VEBOSE=False

# ******************************************************************************
# List of potential maneuvers

F = "F"
BL = "BL"
TL = "TL"
BR = "BR"
TR = "TR"
K = "K"

BEARINGS = [ TL, BL, F, BR, TR, K ]

# ******************************************************************************

class Maneuver:
    """
    
    """
    def __init__( self, bearing, speed ):
        self.bearing = bearing
        self.speed = speed
        
    def __str__( self ):
        return "%s(%d)" % (self.bearing, self.speed)
    
    def __repr__( self ):
        return self.__str__()
    
    def __eq__( self, other ):
        return ( self.bearing == other.bearing and self.speed == other.speed )
    
    def __lt__( self, other ):
        
        if self.bearing == other.bearing:
            return ( self.speed < other.speed ) 
        else:
            return( BEARINGS.index( self.bearing ) < BEARINGS.index( other.bearing ) ) 
            
    def reverse( self ):
        """
        Swap left and right banks/turns
        """
        if self.bearing == BL:
            self.bearing = BR
        elif self.bearing == TL:
            self.bearing = TR
        elif self.bearing == BR:
            self.bearing = BL
        elif self.bearing == TR:
            self.bearing = TL

            
# ******************************************************************************
# List of potential Ships

FORWARD = ( Maneuver("F",0), Maneuver("F",1), Maneuver("F",2), Maneuver("F",3), Maneuver("F",4), Maneuver("F",5) )
BANK_LEFT = ( Maneuver("BL",1), Maneuver("BL",2), Maneuver("BL",3) )
TURN_LEFT = ( Maneuver("TL", 1), Maneuver("TL",2), Maneuver("TL",3) )
BANK_RIGHT = ( Maneuver("BR", 1), Maneuver("BR",2), Maneuver("BR",3) )
TURN_RIGHT = ( Maneuver("TR", 1), Maneuver("TR",2), Maneuver("TR",3) )
KORIGAN=( Maneuver("K",2), Maneuver("K",3), Maneuver("K",4), Maneuver("K",5) )    


# ******************************************************************************
#

class Ship:
    
    def __init__( self, name="", name2="" ):
        self.name = name
        self.name2 = name2           
        self.image = ""
        self.actions = []
        self.faction = ""
        
        self.maneuvers = []
        self.simple = []
        self.normal = []
        self.difficult = []
        
        self.limits = {}
        
        self.closing = []
        self.away = []
        self.far = []
        self.stressed = []
    
        
    def getManeuvers( self ):
        """
        Return: single list of all valid moves for this ship
        """
        if self.maneuvers == []:
            self.maneuvers = self.simple + self.normal + self.difficult
            self.maneuvers.sort()
        
        return self.maneuvers
    
        
    def isValid( self, maneuver ):
        """
        Return: Boolean of if the give maneuver is valid for this ship
        """
        return ( maneuver in self.getManeuvers() )

    
    def _gen_limits( self ):
        """
        Find the highest and lowest speed for each bearing
        """

        for maneuver in self.getManeuvers():
            if maneuver.bearing not in self.limits:
                self.limits[ maneuver.bearing ] = [5,0]
                
            if maneuver.speed > self.limits[ maneuver.bearing ][1]:
                self.limits[ maneuver.bearing ][1] = maneuver.speed
                
            if maneuver.speed < self.limits[ maneuver.bearing ][0]:
                self.limits[ maneuver.bearing ][0] = maneuver.speed

                
    def isSimple( self, maneuver ):
        return maneuver in self.simple
    
    
    def isNormal( self, maneuver ):
        return maneuver in self.normal
    
    
    def isDifficult( self, maneuver ):
        return maneuver in self.difficult
        
    
    def isFast( self, maneuver ):
        if self.limits == {}:
            self._gen_limits()
        
        a = self.limits[ maneuver.bearing ][1] - 1;
        if maneuver.speed >= a:
            return True
        else:
            return False            

        
    def isSlow( self, maneuver ):
        if self.limits == {}:
            self._gen_limits()
            
        a = self.limits[ maneuver.bearing ][0] + 1
        if maneuver.speed <= a:
            return True
        else:
            return False

        
    def __gen_js_maneuver_list( self, target, maneuvers ):
        """
        Format the given list as java script array
        target:  
        maneuvers:   list of maneuvers
        """
        code = '%s.%s = [ ' % (self.name, target ) 
        for i, maneuver in enumerate(maneuvers):
            if i < len(maneuvers) - 1:
                code += '%s, ' % (maneuver)
            else:
                code += "%s" % (maneuver)
                
        code += ' ];'
                
        return code
    
        
    def generate_javascript( self ):
        """
        Export ship to javascript code
        """
        code = []
        
        code.append( "// ****************************************************************************" )
        code.append( "// %s" % self.name2 )
        code.append( "" )

        code.append( 'var %s = {};' % self.name )
        code.append( '%s.name = "%s";' % ( self.name, self.name2 ) )
        code.append( '%s.image = "%s";' % ( self.name, self.image ) )
        code.append( '%s.faction = "%s";' % ( self.name, self.faction ) )
        
        code.append( self.__gen_js_maneuver_list( "simple", self.simple ) )
        code.append( self.__gen_js_maneuver_list( "normal", self.normal ) )
        code.append( self.__gen_js_maneuver_list( "difficult", self.difficult ) )
        
        code.append( '%s.actions = (%s);' % ( self.name, self.actions ) )
        
        # AI Tables: closing, away, far (two-dimentional arrays)
        code.append( "" )
        code.append( '%s.closing = [];' % ( self.name ) )
        for i, row in enumerate( self.closing ):
            code.append( self.__gen_js_maneuver_list( "closing[%d]" % (i), row ) )

        code.append( "" )
        code.append( '%s.away = [];' % ( self.name ) )
        for i, row in enumerate( self.away ):
            code.append( self.__gen_js_maneuver_list( "away[%d]" % (i), row ) )
            
        code.append( "" )
        code.append( '%s.far = [];' % ( self.name ) )
        for i, row in enumerate( self.far ):
            code.append( self.__gen_js_maneuver_list( "far[%d]" % (i), row ) )
        
        code.append( "" )
        code.append( '%s.stressed = [];' % ( self.name ) )
        for i, row in enumerate( self.stressed ):
            code.append( self.__gen_js_maneuver_list( "stressed[%d]" % (i), row ) )
            
        code.append( "" )
        return code
    
    
    def dump( self ):
        
        print( "Name: %s (%s)" % ( self.name, self.name2 ) )
        print( "   Image: %s" % self.image )
        print( "   Simple: %s" % self.simple )
        print( "   Normal: %s" % self.normal )
        print( "   Difficult: %s" % self.difficult )
        
        print( "   All: %s" % self.maneuvers )
        
        print( "   Limits: %s" % self.limits )
        
        print( "   Actions: %s" % self.actions )
        
        print( "   Closing: %s" % self.closing )
        print( "   Away: %s" % self.away )
        print( "   Far: %s" % self.far )
    
    
    def generate_row( self, commonBearing, uncommonBearing, rareBearing, speed ):
        """
        Generate a single AI table row
        common:    list of maneuver bearings that are common
        uncommon:  list of maneuver bearings that are uncommon
        rare:      list of maneuver bearings that are rare
        speed:     which maneuvers speed to preferred (slow, fast, stressed)
        """
        common = []
        uncommon = []
        rare = []

        row = []
        
        for maneuver in self.getManeuvers():
            if speed == "fast" and self.isFast( maneuver ):
                pass
            elif speed == "slow" and self.isSlow( maneuver ):
                pass
            elif speed == "stressed" and not self.isDifficult( maneuver ):
                pass
            else:
                # Remove any maneuvers that do not match desired speed
                continue
                
            if maneuver.bearing in commonBearing:
                common.append( maneuver )
            elif maneuver.bearing in uncommonBearing:
                uncommon.append( maneuver )
            elif maneuver.bearing in rareBearing:
                rare.append( maneuver )
            else:
                pass  # do not use other maneuvers

        if speed == "fast":
            common.reverse()
            uncommon.reverse()
            rare.reverse()
        
        if len(common) == 0:
            print( "WARNING: No common maneuvers for %s in %s at %s" % (self.name, speed, self.label) )
            return []
                
        if len(uncommon) == 0 and len(rare) == 0:
            numCommon = 10
            numUncommon = 0
            numRare = 0
        elif len(uncommon) > 0 and len(rare) == 0:
            numCommon = 7
            numUncommon = 3
            numRare = 0
        elif len(uncommon) == 0 and len(rare) > 0:
            numCommon = 8
            numUncommon = 0
            numRare = 2
        else:
            numCommon = 7
            numUncommon = 2
            numRare = 1

        for i in range( numCommon ):
            index = ( i % len(common) )
            row.append( common[index] )

        for i in range( numUncommon ):
            if len(uncommonBearing) > 1:
                a = 2 * i
                b =  i // len (uncommon) % 2  #add 0 or 1 one for multiple
                index = ( (a + b) % len(uncommon) )   # Uncommon has few item use each bearing
            else:
                index = ( i % len(uncommon) )
            row.append( uncommon[index] )
        
        for i in range( numRare ):
            if len(rareBearing) > 1:
                a = 2 * i
                b =  i // len (rare) % 2  #add 0 or 1 one for multiple
                index = ( (a + b) % len(rare) )
            else:
                index = ( i % len(rare) )
            row.append( rare[index] )
        

        # Sort slowest or fastest first
        row.sort()
            
        return row
        
    
    def reverse_row( self, row ):
        """
        Swap left and right banks/turns
        """
        new_row = []
        for maneuver in row:
            new = copy.copy( maneuver )
            new.reverse()
            new_row.append( new )
                
        return new_row
        
        
    def generate_tables( self ):
        """
        Generate a AI tables
        """
        if( len(self.getManeuvers()) == 0 ): 
            print( "WARNING: No maneuvers available for %s" % self.name )
            return
        
        # 0, N,  12  o'clock
        #   closing: F*, K, BR, BL       short
        #      away: F                   long
        #       far: F*, BL, BR
        self.label = "12 o'clock"
        self.closing.append( self.generate_row( [F], [K], [BR, BL], "slow" ) )
        self.away.append( self.generate_row( [F], [], [], "fast" ) )
        self.far.append( self.generate_row( [F], [], [BR, BL], "fast" ) )
        self.stressed.append( self.generate_row( [F], [], [BR, BL], "stressed" ) )
        
        # 1, NE, 1-2 o'clock
        #   closing: F, BR*, TR
        #      away: BR, TR
        #       far: BR, TR
        self.label = "1-2 o'clock"
        self.closing.append( self.generate_row( [BR], [TR], [F], "slow" ) )
        self.away.append( self.generate_row( [BR], [], [TR], "fast" ) )
        self.far.append( self.generate_row( [BR], [], [TR], "fast" ) )
        self.stressed.append( self.generate_row( [BR], [TR], [F], "stressed" ) )
        
        # 2, E,  3   o'clock
        #   closing: TR, K
        #      away: BR, TR
        #       far: TR
        self.label = "3 o'clock"
        if self.name in [ "lambda" ]:
            self.closing.append( self.generate_row( [BR], [TR], [], "slow" ) )
            self.away.append( self.generate_row( [BR], [TR], [], "fast" ) )
            self.far.append( self.generate_row( [BR], [], [], "fast" ) )
            self.stressed.append( self.generate_row( [BR], [TR], [], "stressed" ) )
        elif self.name in [ "corvette", "transport" ]:
            self.closing.append( self.generate_row( [BR], [F], [], "slow" ) )
            self.away.append( self.generate_row( [BR], [F], [], "fast" ) )
            self.far.append( self.generate_row( [BR], [F], [], "fast" ) )
            self.stressed.append( self.generate_row( [BR], [F], [], "stressed" ) )
        else:
            self.closing.append( self.generate_row( [TR], [], [K], "slow" ) )
            self.away.append( self.generate_row( [TR], [BR], [], "fast" ) )
            self.far.append( self.generate_row( [TR], [], [], "fast" ) )
            self.stressed.append( self.generate_row( [TR], [], [], "stressed" ) )
        
        # 3, SE, 4-5 o'clock
        #   closing: BR, TR, K
        #      away: TR, K
        #       far: TR
        self.label = "4-5 o'clock"
        if self.name in [ "lambda" ]:
            self.closing.append( self.generate_row( [BR], [TR], [], "slow" ) )
            self.away.append( self.generate_row( [BR], [TR], [], "fast" ) )
            self.far.append( self.generate_row( [BR], [TR], [], "fast" ) )
            self.stressed.append( self.generate_row( [BR], [TR], [], "stressed" ) )
        elif self.name in [ "corvette", "transport" ]:
            self.closing.append( self.generate_row( [BR], [F], [], "slow" ) )
            self.away.append( self.generate_row( [BR], [F], [], "fast" ) )
            self.far.append( self.generate_row( [BR], [F], [], "fast" ) )
            self.stressed.append( self.generate_row( [BR], [F], [], "stressed" ) )
        else:
            self.closing.append( self.generate_row( [TR], [K], [BR], "slow" ) )
            self.away.append( self.generate_row( [TR], [K], [], "fast" ) )
            self.far.append( self.generate_row( [TR], [], [], "fast" ) )
            self.stressed.append( self.generate_row( [TR], [], [], "stressed" ) )
                
        # 4, S,  6   o'clock
        #   closing: F, K*, TL, TR
        #      away: K*, TR, TL
        #       far: K, TR*, TL*
        self.label = "6 o'clock"
        if self.name in [ "lambda" ]:
            # Special case as this ship does not support Koiogran Turn 
            self.closing.append( self.generate_row( [BL,BR], [TL,TR,F], [], "fast" ) )
            self.away.append( self.generate_row( [BL,BR], [TL,TR], [], "fast" ) )
            self.far.append( self.generate_row( [TL, TR], [], [K], "fast" ) )
            self.stressed.append( self.generate_row( [BL, BR], [], [], "stressed" ) )
        elif self.name in [ "hwk290" ]:
            # Special case as this ship does not support Koiogran Turn 
            self.closing.append( self.generate_row( [TL,TR], [F], [], "fast" ) )
            self.away.append( self.generate_row( [TL,TR], [], [], "fast" ) )
            self.far.append( self.generate_row( [TL, TR], [], [K], "fast" ) )
            self.stressed.append( self.generate_row( [TL, TR], [], [], "stressed" ) )
        elif self.name in [ "corvette", "transport" ]:
            self.closing.append( self.generate_row( [BL, BR], [], [], "slow" ) )
            self.away.append( self.generate_row( [BL, BR], [], [], "fast" ) )
            self.far.append( self.generate_row( [BL, BR], [], [], "fast" ) )
            self.stressed.append( self.generate_row( [BL, BR], [], [], "stressed" ) )
        else:
            self.closing.append( self.generate_row( [K], [TL,F,TR], [], "fast" ) )
            self.away.append( self.generate_row( [K], [TR, TL], [], "fast" ) )
            self.far.append( self.generate_row( [TL, TR], [], [K], "fast" ) )
            self.stressed.append( self.generate_row( [TL, TR], [], [], "stressed" ) )
                
        # 5, SW, 7-8   o'clock: Reverse of #3
        self.closing.append( self.reverse_row( self.closing[3] ) )
        self.away.append( self.reverse_row( self.away[3] ) )
        self.far.append( self.reverse_row( self.far[3] ) )
        self.stressed.append( self.reverse_row( self.stressed[3] ) )

        # 6, W,  9     o'clock: Reverse of #2
        self.closing.append( self.reverse_row( self.closing[2] ) )
        self.away.append( self.reverse_row( self.away[2] ) )
        self.far.append( self.reverse_row( self.far[2] ) )
        self.stressed.append( self.reverse_row( self.stressed[2] ) )

        # 7, NW, 10-11 o'clock: Reverse of #1
        self.closing.append( self.reverse_row( self.closing[1] ) )
        self.away.append( self.reverse_row( self.away[1] ) )
        self.far.append( self.reverse_row( self.far[1] ) )
        self.stressed.append( self.reverse_row( self.stressed[1] ) )

        
# ******************************************************************************

class XWingGenerator:
    
    def __init__( self ):
        self.ships = {}

    def __copy_file( self, filepath, dst ):
        """
        Write contents of file to open file
        """
        src = open( filepath, 'r' )
        for line in src.readlines():
            dst.write( line )
        src.close()  
        
        
    def export_js( self, filepath ):
        """
        Export ships dictonary as javascript
        """
        print( "Exporting ships to %s..." % filepath )
        js = open( filepath, 'w' )
        
        # Create javascript header and version 
        js.write( "// %s\n" % ( '*' * 76 ) )
        js.write( "// X-Wing Miniatures AI - Ships \n" )
        js.write( "// Generated: %s\n" % datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") )
        js.write( "\n" )
        js.write( 'var VERSION = "%s";\n' % VERSION )
        js.write( "\n\n" )
        
        # Convert and write ships to the javascript
        ships_array = ""
        for ship in sorted( self.ships ):
            print( "   exporting %s..." % ship )
            self.ships[ship].generate_tables()
            code = self.ships[ship].generate_javascript()
            for line in code:
                js.write( line + "\n" )
            
            ships_array += "%s, " % self.ships[ship].name
        
        # Append array of all the created ship objects        
        js.write( "\n" )
        js.write( "// %s\n" % ( '*' * 76 ) )
        js.write( "// Ships\n" )
        js.write( "\n" )
        js.write( "var ships = [ %s ];" % ships_array[:-2] )
             
        print( "Export complete." )
        
    
    def __parse_js_maneuvers( self, line ):
        """
        Helper function to parse maneuver line from javascript
        """
        maneuvers = []
        
        one = line[  line.find( "Array(" ) + 6 : line.find( ");" ) ]
        for item in one.split( "," ):
            bearing = item[ 1 : item.find( '(' ) ]
            speed   = int(item[ item.find( '(' ) + 1 : item.find( ')' )])
            maneuvers.append( Maneuver( bearing, speed ) )
        
        return maneuvers


    def parse_js( self, filepath ):
        """
        Populate the ships dictionary from java script
        """
        
        NEW_SHIP = re.compile( "^var.* = new Object" )
        NAME = re.compile( ".*\.name = " )
        IMAGE = re.compile( ".*\.image = " )
        ACTIONS = re.compile( ".*\.actions = " )

        SIMPLE = re.compile( ".*\.simple = new Array" )
        NORMAL = re.compile( ".*\.normal = new Array" )
        DIFFICULT = re.compile( ".*\.difficult = new Array" )
    
        print( "Parsing %s..." % filepath )
        js = open( filepath, 'r' )
        for line in js.readlines():
            
            if( NEW_SHIP.match( line ) ):
                name = line[4: line.find(" = ")]
                self.ships[ name ] = Ship( name )

            elif( NAME.match( line ) ):
                self.ships[name].name2 = line[ line.find("=")+3 : -3 ]

            elif( IMAGE.match( line ) ):
                self.ships[name].image = line[ line.find("=")+3 : -3 ]

            elif( ACTIONS.match( line ) ):
                self.ships[name].actions = line[ line.find("=")+3 : -3 ].strip()
            
            elif( SIMPLE.match( line ) ):
                self.ships[name].simple = self.__parse_js_maneuvers( line )
            
            elif( NORMAL.match( line ) ):
                self.ships[name].normal = self.__parse_js_maneuvers( line )
            
            elif( DIFFICULT.match( line ) ):
                self.ships[name].difficult = self.__parse_js_maneuvers( line )

        js.close()
        print( "Parsing complete." )                

    
    def export_xml( self, filepath ):
        """
        Export ships dictionary to xml
        """
        print( "Exporting ships to %s..." % filepath )
        root = ElementTree.Element( "ships" )
    
        # Convert each ship into XML
        for name in sorted( self.ships ):
            ship = self.ships[name]
            attribs = { "name": ship.name2, "image": ship.image, "actions": ship.actions }
            s = ElementTree.SubElement( root, name, attribs )
    
            simple = ElementTree.SubElement( s, 'simple' )
            for maneuver in ship.simple:   
                m = ElementTree.SubElement( simple, "maneuver" )
                m.text = "%s%d" % ( maneuver.bearing, maneuver.speed )
    
            normal = ElementTree.SubElement( s, 'normal' )
            for maneuver in ship.normal:   
                m = ElementTree.SubElement( normal, "maneuver" )
                m.text = "%s%d" % ( maneuver.bearing, maneuver.speed )
    
            difficult = ElementTree.SubElement( s, 'difficult' )
            for maneuver in ship.difficult:   
                m = ElementTree.SubElement( difficult, "maneuver" )
                m.text = "%s%d" % ( maneuver.bearing, maneuver.speed )

        # Save to file (export to minidom for prettyprint)
        rough_string = ElementTree.tostring(root, 'utf-8')
        reparsed = xml.dom.minidom.parseString(rough_string)
        
        xmlfile = open( filepath, 'w' )
        xmlfile.write( reparsed.toprettyxml(indent="\t") )
        xmlfile.close()

        print( "Export complete." )
            
        
    def parse_xml( self, filepath ):
        """
        Parse xml into ships dictionary
        """
        print( "Parsing %s..." % filepath )
        
        tree = ElementTree.ElementTree()
        tree.parse( filepath )
        root = tree.getroot()
    
        for s in list(root):
            name = s.tag
            self.ships[name] = Ship( name )
            self.ships[name].name2 = s.attrib[ 'name' ]
            self.ships[name].image = s.attrib[ 'image' ]
            self.ships[name].actions = s.attrib[ 'actions' ]
            self.ships[name].faction = s.attrib[ 'faction' ]
            
            simple = s.find( 'simple' )
            for man in list(simple):
                m = man.text.strip()
                bearing = m[:-1]
                speed = int( m[-1] )
                self.ships[name].simple.append( Maneuver( bearing, speed ) ) 
            
            normal = s.find( 'normal' )
            for man in list(normal):
                m = man.text.strip()
                bearing = m[:-1]
                speed = int( m[-1] )
                self.ships[name].normal.append( Maneuver( bearing, speed ) ) 
            
            difficult = s.find( 'difficult' )
            for man in list(difficult):
                m = man.text.strip()
                bearing = m[:-1]
                speed = int( m[-1] )
                self.ships[name].difficult.append( Maneuver( bearing, speed ) ) 

        print( "Parsing complete." )
        
        
# ******************************************************************************

def doBuild():
    """
    """
    
    dst = r"F:\src\builds\xwing_ai_%s.zip" % VERSION
    src = r"F:\src\xwing_ai"
    exclude_dirs = ( ".git", "generator" )
    exclude_files = ( ".gitignore", ".project", ".pydevproject" )
    
    print( "Building %s..." % (dst) )

    # Do not overwrite existing file
    if os.path.exists( dst ):
        print( "ERROR: Zip file already exists!" )
        return
    
    zip1 = zipfile.ZipFile( dst, 'w', zipfile.ZIP_DEFLATED )
    for root, dirs, files in os.walk(src, topdown=True):
        
        # ignore directory
        dirs[:] = [ d for d in dirs if d not in exclude_dirs ]

        for file in files:
            if file not in exclude_files:
                filepath = os.path.join( root, file )
                print( "Adding %s..." % filepath )
                zip1.write( filepath, os.path.relpath(filepath, src) )
    
    print( "Build complete." )

# ******************************************************************************
                
if __name__ == "__main__":
    
    parser = optparse.OptionParser()
    parser.add_option( "-j", "--js", action="store_true", dest="js_to_xml", default=False,
                       help="Convert ships from javascript to xml" )
    parser.add_option( "-b", "--build", action="store_true", dest="build", default=False,
                       help="Save" )
    (options, args) = parser.parse_args()
    
    xwing = XWingGenerator()
    
    if( options.build and options.js_to_xml ):
        print( "ERROR: Invalid options" )
    
    if( options.js_to_xml ):
        xwing.parse_xml( "xwing_ai_save.js" )
        xwing.export_xml( "ships.xml" )
    else:
        xwing.parse_xml( "ships.xml" )
        xwing.export_js( "..\\web\\src\\xwing_ships.js" )

    if( options.build ):
        doBuild()
