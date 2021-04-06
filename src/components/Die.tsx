export type Die = {
  color: string;
  winRange: number[];
}
export function allDice() {
  var Dice:Array<Die> = [
    {
      color: "red",
      winRange: [1,5],
    },
    {
      color: "blue",
      winRange: [4,15],
    },
    {
      color: "green",
      winRange: [10,25],
    },
    {
      color: "yellow",
      winRange: [15,40],
    },
    {
      color: "silver",
      winRange: [20,60],
    }
  ];
  return Dice;
}