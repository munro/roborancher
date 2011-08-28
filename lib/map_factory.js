/* 0: floor 
 * 1: wall
 * 2: hole
   3: conveyor up
   4: conveyor right
   5: conveyor down
   6: conveyor left
 */
define(function () {
    return {
        [conveyor('up to right'), 
        simple_arena: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0],
            [0,0,0,0,3,2,0,0,0,0,0,0,0,0,2,5,0,0,0,0],
            [0,0,0,0,3,0,2,0,0,0,0,0,0,2,0,5,0,0,0,0],
            [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0],
            [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0],
            [0,0,0,0,3,0,2,0,0,0,0,0,0,2,0,5,0,0,0,0],
            [0,0,0,0,3,2,0,0,0,0,0,0,0,0,2,5,0,0,0,0],
            [0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
        four_corners: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,1],
            [1,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,1],
            [1,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ]
    };
});