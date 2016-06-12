#!/usr/bin/env python
"""
X-wing Miniatures AI Maneuver Generator
"""
import datetime
import json
import optparse
import os
import re
import xml.dom.minidom
import xml.etree.ElementTree as ElementTree
import zipfile

from ship import *
from version import VERSION

# ******************************************************************************

DEBUG=False
VEBOSE=False

ACTIONS = ( 'BARREL_ROLL', 'BOOST', 'CLOAKING', 'CORDINATE', 'EVADE', 'FOCUS', 'JAM', 'RECOVER', 'REINFORCE', 'SLAM', 'TARGET_LOCK' )
FACTIONS = ( 'rebel', 'empire', 'scum' )

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
        Export ships dictionary as javascript
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

    
    def validateActions( self, name, actionsString ):
        """
        Validate all actions are valid
        """
        actions = actionsString.split("+")
        actions = [x.strip() for x in actions]
        
        for action in actions:
            if not action in ACTIONS:
                raise Exception("%s: Invalid Action: %s" % (name, action))
        return True


    def validateImage( self, name, image ):
        if not os.path.isfile( "../web/" + image ):
            raise Exception( "%s: Image does not exist: %s" % (name, image))


    def validateFaction( self, name, faction ):
        """
        Validate Faction value
        """
        if( faction not in FACTIONS ):
            raise Exception("%s: Invalid faction: %s" % (name, faction))

        
    def parse_ship_xml( self, filepath ):
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
            
            image = s.attrib[ 'image' ]
            self.validateImage(name, image)
            self.ships[name].image = image
            
            actions = s.attrib[ 'actions' ]
            self.validateActions(name, actions)
            self.ships[name].actions = actions
            
            faction = s.attrib[ 'faction' ]
            self.validateFaction(name, faction)
            self.ships[name].faction = faction
            
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
    
    dst = r"../builds/xwing_ai_%s.zip" % VERSION
    src = r"../xwing_ai"
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
    parser.add_option( "-b", "--build", action="store_true", dest="build", default=False,
                       help="Save" )
    (options, args) = parser.parse_args()
    
    xwing = XWingGenerator()
    
    for file in os.listdir("ships"):
        filepath = "ships/%s" % file
        
        if ".xml" in filepath:
            xwing.parse_ship_xml( filepath )
        else:
            print( "WARN: Unexpected file type '%s'" % filepath )

    xwing.export_js( "../web/src/xwing_ships.js" )

    if( options.build ):
        doBuild()