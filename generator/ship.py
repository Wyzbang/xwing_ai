#!/usr/bin/env python
"""
X-wing Miniatures AI Ship
"""
import copy

from maneuvers import *

# ******************************************************************************

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
        self.closing.append( self.generate_row( [F, R], [TRL, TRR, SLL, SLR, K, RBL, RBR], [BR, BL], "slow" ) )
        self.away.append( self.generate_row( [F], [], [], "fast" ) )
        self.far.append( self.generate_row( [F], [], [BR, BL], "fast" ) )
        self.stressed.append( self.generate_row( [F], [], [BR, BL], "stressed" ) )

        # 1, NE, 1-2 o'clock
        #   closing: F, BR*, TR
        #      away: BR, TR
        #       far: BR, TR
        self.label = "1-2 o'clock"
        self.closing.append( self.generate_row( [BR], [TR, R, RBL], [F], "slow" ) )
        self.away.append( self.generate_row( [BR], [], [TR], "fast" ) )
        self.far.append( self.generate_row( [BR], [], [TR], "fast" ) )
        self.stressed.append( self.generate_row( [BR], [TR], [F], "stressed" ) )

        # 2, E,  3   o'clock
        #   closing: TR, K
        #      away: BR, TR
        #       far: TR
        self.label = "3 o'clock"
        if self.name in [ "lambda", "uwing", "upsilon" ]:
            self.closing.append( self.generate_row( [BR], [TR], [], "slow" ) )
            self.away.append( self.generate_row( [BR], [TR], [], "fast" ) )
            self.far.append( self.generate_row( [BR], [], [], "fast" ) )
            self.stressed.append( self.generate_row( [BR], [TR], [], "stressed" ) )
        elif self.name in [ "corvette", "transport", "carrier", "raider" ]:
            self.closing.append( self.generate_row( [BR], [F], [], "slow" ) )
            self.away.append( self.generate_row( [BR], [F], [], "fast" ) )
            self.far.append( self.generate_row( [BR], [F], [], "fast" ) )
            self.stressed.append( self.generate_row( [BR], [F], [], "stressed" ) )
        else:
            self.closing.append( self.generate_row( [TR], [RBL], [TRL, TRR, SLL, SLR, K], "slow" ) )
            self.away.append( self.generate_row( [TR], [BR], [], "fast" ) )
            self.far.append( self.generate_row( [TR], [], [], "fast" ) )
            self.stressed.append( self.generate_row( [TR], [], [], "stressed" ) )

        # 3, SE, 4-5 o'clock
        #   closing: BR, TR, K
        #      away: TR, K
        #       far: TR
        self.label = "4-5 o'clock"
        if self.name in [ "lambda", "uwing", "upsilon" ]:
            self.closing.append( self.generate_row( [BR], [TR], [], "slow" ) )
            self.away.append( self.generate_row( [BR], [TR], [], "fast" ) )
            self.far.append( self.generate_row( [BR], [TR], [], "fast" ) )
            self.stressed.append( self.generate_row( [BR], [TR], [], "stressed" ) )
        elif self.name in [ "corvette", "transport", "carrier", "raider" ]:
            self.closing.append( self.generate_row( [BR], [F], [], "slow" ) )
            self.away.append( self.generate_row( [BR], [F], [], "fast" ) )
            self.far.append( self.generate_row( [BR], [F], [], "fast" ) )
            self.stressed.append( self.generate_row( [BR], [F], [], "stressed" ) )
        else:
            self.closing.append( self.generate_row( [TR], [TRL, TRR, SLL, SLR, K, RBR], [BR], "slow" ) )
            self.away.append( self.generate_row( [TR], [TRL, TRR, SLL, SLR, K], [], "fast" ) )
            self.far.append( self.generate_row( [TR], [], [], "fast" ) )
            self.stressed.append( self.generate_row( [TR], [], [], "stressed" ) )

        # 4, S,  6   o'clock
        #   closing: F, K*, TL, TR
        #      away: K*, TR, TL
        #       far: K, TR*, TL*
        self.label = "6 o'clock"
        if self.name in [ "lambda", "houndstooth", "kwing", "uwing", "upsilon" ]:
            # Special case as this ship does not support Koiogran Turn
            self.closing.append( self.generate_row( [BL,BR], [TL,TR,F], [], "fast" ) )
            self.away.append( self.generate_row( [BL,BR], [TL,TR], [], "fast" ) )
            self.far.append( self.generate_row( [TL, TR], [], [], "fast" ) )
            self.stressed.append( self.generate_row( [BL, BR], [], [], "stressed" ) )
        elif self.name in [ "decimator", "hwk290" ]:
            # Special case as this ship does not support Koiogran Turn
            self.closing.append( self.generate_row( [TL,TR], [F], [], "fast" ) )
            self.away.append( self.generate_row( [TL,TR], [], [], "fast" ) )
            self.far.append( self.generate_row( [TL, TR], [], [], "fast" ) )
            self.stressed.append( self.generate_row( [TL, TR], [], [], "stressed" ) )
        elif self.name in [ "corvette", "transport", "carrier", "raider" ]:
            self.closing.append( self.generate_row( [BL, BR], [], [], "slow" ) )
            self.away.append( self.generate_row( [BL, BR], [], [], "fast" ) )
            self.far.append( self.generate_row( [BL, BR], [], [], "fast" ) )
            self.stressed.append( self.generate_row( [BL, BR], [], [], "stressed" ) )
        else:
            self.closing.append( self.generate_row( [TRL, TRR, SLL, SLR, K], [TL,F,TR], [], "fast" ) )
            self.away.append( self.generate_row( [TRL, TRR, SLL, SLR, K], [TR, TL], [], "fast" ) )
            self.far.append( self.generate_row( [TL, TR], [], [TRL, TRR, SLL, SLR, K], "fast" ) )
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
