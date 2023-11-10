// enumerates the functions that are available in the LLM
type functionObj = {
  name: string,
  description: string,
  parameters: {
    type: string,
    properties: any,
    required: string[]
  }
}

export const playerWin = {
  "name": "playerWin",
  "description": `Player1's ability and weapon is greater than player2 during the battle.
    Therefore, player1 defeat player2 and player1 wins.`,
  "parameters": {
    "type": "object",
    "properties": {
      "result":{
        "type": "string",
        "description": "Describe how player1 defeated player2." 
      }
    },
    "required": ["result"]
  }
}

export const otherPlayerWin = {
  "name": "otherPlayerWin",
  "description": `Even player1 tried their best in the battle, player2 is stronger than player1 
  and player1 lost. Player1 received fatal damage and are about to die`,
  "parameters": {
    "type": "object",
    "properties": {
      "result":{
        "type": "string",
        "description": "Describe how player2 defeated player1." 
      }
    },
    "required": ["result"]
  }
}

export function getAvailableFunctions(): functionObj[] {
  const available_functions = [];
  available_functions.push(playerWin);
  available_functions.push(otherPlayerWin);
  return available_functions;
}