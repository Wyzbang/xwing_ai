#!/usr/bin/env python
"""
X-wing Miniatures AI Maneuver
"""

# ******************************************************************************
# List of potential maneuvers

F = "F"     # Forward
BL = "BL"   # Bank Left
TL = "TL"   # Turn Left
BR = "BR"   # Bank Right
TR = "TR"   # Turn Right
K = "K"     # Korigran Turn
SLL = "SLL" # Segnor's Loop - Left
SLR = "SLR" # Segnor's Loop - Right
TRL = "TRL" # Tallon Roll - Left
TRR = "TRR" # Tallon Roll - Right

BEARINGS = [ TL, BL, F, BR, TR, K, SLL, SLR, TRL, TRR ]

# ******************************************************************************

class Maneuver:
    """
    
    """
    def __init__( self, bearing, speed ):
        if( bearing not in BEARINGS ):
            raise Exception( 'Invalid Bearing: %s' % bearing )
        self.bearing = bearing
        if not isinstance(speed, int):
            raise Exception( 'Invalid Speed: %s %s' % (speed, type(speed)) )
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
        swap = { BL:BR, BR:BL, TL:TR, TR:TL, SLL:SLR, SLR:SLL, TRL:TRR, TRR:TRL }
        if( self.bearing in swap.keys() ):
            self.bearing = swap[self.bearing]
