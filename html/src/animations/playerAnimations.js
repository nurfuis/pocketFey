const makeStandingFrames = (rootFrame=0) => {
  return {
    duration: 300,
    frames: [
      {
        time: 0,
        frame: rootFrame,
      }
    ]
  }
}
const makeWalkingFrames = (rootFrame=0) => {
  return {
    duration: 400,
    frames: [
      {
        time: 0,
        frame: rootFrame
      },
      {
        time: 100,
        frame: rootFrame+1
      },
      {
        time: 200,
        frame: rootFrame
      },
      {
        time: 300,
        frame: rootFrame+2
      }
    ]
  }
}

export const STAND_DOWN = makeStandingFrames(0);
export const STAND_RIGHT = makeStandingFrames(9);
export const STAND_UP = makeStandingFrames(3);
export const STAND_LEFT = makeStandingFrames(6);

export const WALK_DOWN = makeWalkingFrames(0);
export const WALK_RIGHT = makeWalkingFrames(9);
export const WALK_UP = makeWalkingFrames(3);
export const WALK_LEFT = makeWalkingFrames(6);

export const PICK_UP_DOWN = {
  duration: 10,
  frames: [
    {
      time: 0,
      frame: 12
    }
  ]
}
export const ATTACK_LEFT = {
  duration: 350,
  frames: [
    {
      time: 0,
      frame: 6
    },
    {
      time: 50,
      frame: 7
    },
    {
      time: 250,
      frame: 8
    },
    {
      time: 300,
      frame: 0
    },    
   
  ]
}
export const ATTACK_UP = {
  duration: 350,
  frames: [
    {
      time: 0,
      frame:3
    },
    {
      time: 50,
      frame: 4
    },
    {
      time: 250,
      frame: 5
    },
    {
      time: 300,
      frame: 3
    },    
   
  ]
}
export const ATTACK_RIGHT = {
  duration: 350,
  frames: [
    {
      time: 0,
      frame:9
    },
    {
      time: 50,
      frame: 10
    },
    {
      time: 250,
      frame: 9
    },
    {
      time: 300,
      frame: 11
    },    
   
  ]
}
export const ATTACK_DOWN = {
  duration: 250,
  frames: [
    {
      time: 0,
      frame:0
    },
    {
      time: 50,
      frame: 2
    },
    {
      time: 250,
      frame: 1
    },
    {
      time: 300,
      frame: 2
    },    
   
  ]
}