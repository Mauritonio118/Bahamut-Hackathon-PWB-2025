import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Download } from "lucide-react";
import { useWallet } from "@/lib/wallet";
import { formatNumber } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

export default function Balance() {
  const { isConnected } = useWallet();
  const { theme } = useTheme();
  // Pour la démonstration, utilisons des soldes simulés
  const ftnBalance = 100;
  const lbrBalance = 50;
  
  const handleWithdraw = async () => {
    try {
      // Ici on peut ajouter la logique pour retirer les jetons
      // Pour l'instant, on simule avec un toast de succès
      toast({
        title: "Retrait demandé",
        description: "Votre demande de retrait a été envoyée.",
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors du retrait:", error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande de retrait.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={`${theme === 'dark' ? 'bg-[#1E1E1E] text-white border-gray-700' : 'bg-white text-[#1E1E1E] border-gray-300'} rounded-2xl shadow-lg border-2 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,105,180,0.15),transparent_70%)] z-0"></div>
      <CardContent className="p-6 relative z-10">
        <h2 className={`text-xl font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-[#1E1E1E]'}`}>
          <DollarSign className="h-5 w-5 text-[#FF69B4] mr-2" />
          Votre Solde
        </h2>
        
        {isConnected ? (
          <div className={`mb-4 ${theme === 'dark' ? 'bg-[#0D0D0D]' : 'bg-gray-100'} rounded-xl p-4 space-y-2 border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
            <p className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mr-2 shadow-sm"></span>
                <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>FTN</span>
              </span>
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-[#1E1E1E]'}`}>{formatNumber(ftnBalance)}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 mr-2 shadow-sm"></span>
                <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>LBR</span>
              </span>
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-[#1E1E1E]'}`}>{formatNumber(lbrBalance)}</span>
            </p>
          </div>
        ) : (
          <div className={`mb-4 ${theme === 'dark' ? 'bg-[#0D0D0D]' : 'bg-gray-100'} rounded-xl p-4 text-center border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Connectez votre wallet pour voir votre solde</p>
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            className={`w-full flex items-center justify-center gap-2 rounded-xl border-2 ${theme === 'dark' ? 'border-gray-700 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-800 hover:bg-gray-100'}`}
            onClick={handleWithdraw}
            disabled={!isConnected}
          >
            <Download className="h-4 w-4" />
            Retirer les fonds
          </Button>
          
          <a 
            href="https://faucet.sepolia.dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`text-center text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} mt-2 block`}
          >
            Obtenir des jetons de test Sepolia
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
