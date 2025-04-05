// Types for roulette game
export type Token = "FTN" | "LBR";
export type BetColor = "red" | "black";
export type BetAmount = 0.1 | 0.5 | 1 | 5 | 10 | 25;
export type SpinResult = "win" | "loss";
export type ResultColor = "red" | "black";

export interface Bet {
  amount: BetAmount | null;
  token: Token;
  color: BetColor | null;
}

export interface Transaction {
  id: number;
  userId: number;
  betAmount: number;
  betToken: string;
  betColor: string;
  result: SpinResult;
  timestamp: string;
}

export interface SpinResponse {
  result: SpinResult;
  resultColor: ResultColor;
  ftnDelta: number;
  lbrDelta: number;
  updatedBalances: {
    ftnBalance: number;
    lbrBalance: number;
  };
  transaction: Transaction;
}

export async function placeBet(
  userId: number,
  betAmount: number,
  betToken: Token,
  betColor: BetColor
): Promise<SpinResponse> {
  const response = await fetch("/api/spin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      betAmount,
      betToken,
      betColor,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to place bet");
  }

  return await response.json();
}

export async function getTransactionHistory(
  userId: number,
  limit = 10
): Promise<Transaction[]> {
  const response = await fetch(`/api/user/${userId}/transactions?limit=${limit}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch transaction history");
  }

  return await response.json();
}

// Calculate wheel rotation based on result
export function calculateWheelRotation(resultColor: ResultColor): number {
  // The wheel has 32 slots (alternating red and black)
  const totalSlices = 32;
  let sliceIndex = 0; // Initialisation par défaut

  // Déterminer l'index de la tranche basé sur la couleur du résultat
  if (resultColor === "red") {
    // Red segments are at even indices (0, 2, 4, ...)
    const redIndices = Array.from({ length: totalSlices / 2 }, (_, i) => i * 2);
    sliceIndex = redIndices[Math.floor(Math.random() * redIndices.length)];
  } else if (resultColor === "black") {
    // Black segments are at odd indices (1, 3, 5, ...)
    const blackIndices = Array.from({ length: totalSlices / 2 }, (_, i) => i * 2 + 1);
    sliceIndex = blackIndices[Math.floor(Math.random() * blackIndices.length)];
  }
  
  // Calculate rotation in degrees
  const degreesPerSlice = 360 / totalSlices;
  const extraSpins = 5; // Number of full rotations before stopping
  const rotation = extraSpins * 360 + sliceIndex * degreesPerSlice;
  
  return rotation;
}
