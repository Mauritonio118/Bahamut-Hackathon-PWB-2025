import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { getTransactionHistory, Transaction } from "@/lib/roulette";
import { useWallet } from "@/lib/wallet";
import { getRelativeTime } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

export default function TransactionHistory() {
  const { isConnected, mockUserId } = useWallet();
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load transaction history when wallet is connected
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isConnected || !mockUserId) return;
      
      setIsLoading(true);
      try {
        const history = await getTransactionHistory(mockUserId, 5);
        setTransactions(history);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
    
    // Refresh transactions every 10 seconds
    const interval = setInterval(fetchTransactions, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, [isConnected, mockUserId]);

  return (
    <Card className={`${theme === 'dark' ? 'bg-[#1E1E1E] text-white border-gray-700' : 'bg-white text-[#1E1E1E] border-gray-300'} rounded-2xl shadow-lg border-2 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,105,180,0.1),transparent_70%)] z-0"></div>
      <CardContent className="p-6 relative z-10">
        <h2 className={`text-xl font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-[#1E1E1E]'}`}>
          <Clock className="h-5 w-5 text-[#FF69B4] mr-2" />
          Recent Transactions
        </h2>
        
        <div className={`space-y-3 text-sm max-h-40 overflow-y-auto ${theme === 'dark' ? 'scrollbar-dark' : 'scrollbar-light'}`}>
          {!isConnected ? (
            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center italic p-3 ${theme === 'dark' ? 'bg-[#0D0D0D]' : 'bg-gray-100'} rounded-xl border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
              Connect wallet to view transactions
            </div>
          ) : isLoading ? (
            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center p-3 ${theme === 'dark' ? 'bg-[#0D0D0D]' : 'bg-gray-100'} rounded-xl border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center italic p-3 ${theme === 'dark' ? 'bg-[#0D0D0D]' : 'bg-gray-100'} rounded-xl border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
              No transactions yet
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className={`p-3 border-2 ${theme === 'dark' ? 'border-gray-700 bg-[#0D0D0D]' : 'border-gray-300 bg-gray-100'} rounded-xl flex justify-between items-center mb-2`}>
                <div>
                  <span className={`font-medium ${tx.result === "win" ? "text-green-500" : "text-red-500"}`}>
                    {tx.result === "win" ? "Win" : "Loss"}
                  </span>
                  <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ml-1`}>
                    {tx.betAmount} {tx.betToken} on {tx.betColor}
                  </span>
                </div>
                <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{getRelativeTime(tx.timestamp)}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
