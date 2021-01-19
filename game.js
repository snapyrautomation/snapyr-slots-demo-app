// RNG for a single reel
export function spinReel(possible) {
  return Math.floor(Math.random() * possible) + 1;
}

// Total possibilities for a reel (note: 7 is a blank space, but I didn't like how it looked)
export const REEL_POSSIBLE = 6;

// payscale based on reel combinations, can be changed easily enough
export const payscale = {
  '6-6-6': 80, // big win
  '5-5-5': 15, // cherries
  '4-4-4': 50, // bars,
  '3-3-3': 12, // watermelons
  '2-2-2': 20, // Lucky 7s
  '1-1-1': 14, // bananas
  '7-7-7': 8, // blanks
  '13-25-26': 16, // mixed cherry bars
  odd: 4, // odd numbers
};

// calculates the payout based on the value of 3 reels (an array of integers)
export function calculatePayout(bet, reels) {
  const threes = reels.every(
    (val, index) => index === 0 || val === reels[index - 1]
  );
  let payout = 0;
  // three of a kind
  if (threes) {
    payout = payscale[reels[0] + '-' + reels[1] + '-' + reels[2]];
  }
  // otherwise it's one of the mixed payouts
  else if (
    (reels[2] === 6 || reels[2] === 2) &&
    (reels[1] === 2 || reels[1] === 5) &&
    (reels[0] === 1 || reels[0] === 3)
  ) {
    payout = payscale['13-25-26'];
  } else if (
    reels[0] < 7 &&
    reels[0] % 2 &&
    reels[1] < 7 &&
    reels[1] % 2 &&
    reels[2] < 7 &&
    reels[2] % 2
  ) {
    payout = payscale.odd;
  }
  // better luck next time
  return payout * bet;
}

// user hit the spin button, let's see what happens
export function placeBet(user, bet, jackpot) {
  const result = {
    ts: Date.now(),
    bet,
    user,
    reels: jackpot
      ? [6, 6, 6]
      : [
          spinReel(REEL_POSSIBLE),
          spinReel(REEL_POSSIBLE),
          spinReel(REEL_POSSIBLE),
        ],
  };
  result.payout = calculatePayout(bet, result.reels);
  console.log(user);
  console.log(bet);
  console.log(jackpot);
  return result;
}
