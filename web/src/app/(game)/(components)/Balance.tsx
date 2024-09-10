import React from 'react';
import { FaDollarSign } from 'react-icons/fa';

interface USDCBalanceProps {
  balance: string;
}

const USDCBalance: React.FC<USDCBalanceProps> = ({ balance }) => (
  <div className="w-full flex justify-between items-center bg-primary-bg/20 p-4 rounded-lg">
    <div className="flex items-center gap-2">
      <FaDollarSign className="text-green-400 text-xl" />
      <span className="text-white font-semibold">Balance</span>
    </div>
    <span className="text-white text-lg font-bold">{balance} USDC</span>
  </div>
);

export default USDCBalance;