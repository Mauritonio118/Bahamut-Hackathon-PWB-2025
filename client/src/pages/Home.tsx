import React, { useEffect } from "react";
import GameInfo from "@/components/GameInfo";
import Balance from "@/components/Balance";
import RouletteWheel from "@/components/RouletteWheel";
import BettingOptions from "@/components/BettingOptions";
import TransactionHistory from "@/components/TransactionHistory";
import ResultOverlay from "@/components/ResultOverlay";
import Layout from "@/components/Layout";
import { useWallet } from "@/context/WalletContext";
import { Bet, BetColor, BetAmount, Token, SpinResult, ResultColor } from "@/lib/roulette";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { isConnected, walletAddress } = useWallet();
  const { theme } = useTheme();
  
  useEffect(() => {
    console.log("État de connexion dans Home:", { isConnected, walletAddress });
  }, [isConnected, walletAddress]);
  
  const [bet, setBet] = useState<Bet>({
    amount: null,
    token: "FTN",
    color: null,
  });
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [resultColor, setResultColor] = useState<ResultColor | null>(null);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  
  const handleBetAmountChange = (amount: BetAmount | null) => {
    setBet((prevBet) => ({ ...prevBet, amount }));
  };
  
  const handleTokenChange = (token: Token) => {
    setBet((prevBet) => ({ ...prevBet, token }));
  };
  
  const handleColorChange = (color: BetColor | null) => {
    setBet((prevBet) => ({ ...prevBet, color }));
  };
  
  const handleSpin = async () => {
    console.log("Tentative de spin, état de connexion:", { isConnected, walletAddress });
    
    if (!isConnected || isSpinning) {
      console.log("Spin bloqué:", !isConnected ? "Non connecté" : "Déjà en train de tourner");
      return;
    }
    
    if (bet.amount === null || bet.color === null) {
      console.log("Spin bloqué: Montant ou couleur non sélectionnés");
      return;
    }
    
    setIsSpinning(true);
    
    try {
      console.log("Envoi de la transaction à la blockchain...");
      
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      const result = Math.random() > 0.5 ? "win" : "loss";
      const colors = ["violet", "black"] as ResultColor[];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      console.log("Réponse reçue de la blockchain:", { result, color: randomColor });
      
      setResultColor(randomColor);
      
      setTimeout(() => {
        setSpinResult(result);
        
        let message = "";
        const betAmount = bet.amount || 0;
        
        if (result === "win") {
          if (bet.token === "FTN") {
            message = `Gagné ${betAmount * 2} FTN!`;
          } else {
            message = `Gagné ${betAmount} FTN!`;
          }
        } else {
          if (bet.token === "FTN") {
            message = `Perdu ${betAmount} FTN, gagné ${betAmount} LBR!`;
          } else {
            message = `Perdu ${betAmount} LBR!`;
          }
        }
        
        setResultMessage(message);
        setShowResult(true);
      }, 5000);
    } catch (error) {
      console.error('Error during spin:', error);
      setIsSpinning(false);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la transaction.",
        variant: "destructive"
      });
    }
  };
  
  const handleCloseResult = () => {
    setShowResult(false);
    setIsSpinning(false);
    setSpinResult(null);
    setResultColor(null);
  };
  
  return (
    <Layout>
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden">
              <BettingOptions
                bet={bet}
                onBetAmountChange={handleBetAmountChange}
                onTokenChange={handleTokenChange}
                onColorChange={handleColorChange}
                disabled={isSpinning}
              />
            </div>
            
            <div className="rounded-2xl overflow-hidden">
              <Balance />
            </div>
          </div>
          
          <div className="lg:col-span-8 flex flex-col items-center justify-center order-1 lg:order-2 px-6 md:px-12">
            <div className="relative w-full max-w-[60%] lg:max-w-[65%] mx-auto">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary-light),transparent_70%)] opacity-30 blur-3xl z-0"></div>
              <div className="w-full aspect-square flex items-center justify-center">
                <RouletteWheel 
                  isSpinning={isSpinning} 
                  resultColor={resultColor}
                  result={spinResult}
                  resultMessage={resultMessage}
                />
              </div>
            </div>
            
            <div className="mt-8 text-center w-full max-w-md">
              <div
                className={`text-2xl font-bold mb-3 h-10 flex items-center justify-center ${
                  spinResult === "win" ? "text-green-400" : spinResult === "loss" ? "text-red-400" : ""
                }`}
              >
                {!isSpinning && spinResult && resultMessage}
              </div>
              <button
                onClick={handleSpin}
                disabled={!isConnected || bet.amount === null || bet.color === null || isSpinning}
                className="relative w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--secondary)] hover:to-[var(--primary)] text-white text-xl font-bold py-4 px-10 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSpinning ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      SPINNING...
                    </div>
                  ) : (
                    <span>SPIN THE WHEEL</span>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Game Info et Transaction History côte à côte sur les grands écrans */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Game Info */}
          <div className="rounded-2xl overflow-hidden">
            <GameInfo />
          </div>
          
          {/* Transaction History */}
          <div className="rounded-2xl overflow-hidden">
            <TransactionHistory />
          </div>
        </div>
      </div>
      
      {/* Result Overlay */}
      {showResult && (
        <ResultOverlay
          show={showResult}
          message={resultMessage}
          result={resultColor}
          onClose={handleCloseResult}
        />
      )}
    </Layout>
  );
}
