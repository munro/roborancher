MAPS = {
    FROG_SWAMP: {
        name: 'Frog Swamp',
        bots: [ 
            [ [ [ 9, 0 ], 'UP' ] ],
            [ [ [ 7, 0 ], 'UP' ], [ [ 11, 0 ], 'UP' ] ]
        ], 
        tiles: [
            '.   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   ',
            '.   .   .   .  ur   r   r   r   r   r   r   r   r   r   r  rd   .   .   .   .   ',
            '.   .   .   .   u   .   .   .   .   .   .   .   .   .   .   d  wr   o-  .   .   ',
            '.   f   o   .   u   .   . fld  fl  fl  fl  fl ful   .   .   d  wr   .   f   .   ',
            '.  wb  wb   .   u   .   .  fd   .   f   .   .  fu   .   .   d  wr   ot  .   .   ',
            '.   .  ot- wl   u   .   .  fd   .   .   .   .  fu   .   .   d   .   wt wt   .   ',
            '.   f   .  wl   u   .   . fdr  fr  fr  fr  fr fru   .   .   d   .   o-  f   .   ',
            '.   .   o  wl   u   .   .   .   .   .   .   .   .   .   .   d   .   .   .   .   ',
            '.   .   .   .  lu   l   l   l   l   l   l   l   l   l   l  dl   .   .   .   .   ',
            '.   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   '
        ]
    }
};

module.exports = MAPS;
