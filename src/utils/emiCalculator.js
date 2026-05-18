export const calculateEMI = (principal, tenureMonths, loanType) => {
  // Rates
  let annualRate = 10.5; // Personal
  if (loanType === 'Home') annualRate = 8.5;
  if (loanType === 'Business') annualRate = 14.0;

  const monthlyRate = annualRate / 12 / 100;
  
  // EMI Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n – 1)
  const mathPower = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * mathPower) / (mathPower - 1);
  
  const totalCost = (emi * tenureMonths) - principal;
  
  // Processing Fee: 1% (min 2000, max 25000)
  let processingFee = principal * 0.01;
  if (processingFee < 2000) processingFee = 2000;
  if (processingFee > 25000) processingFee = 25000;

  return {
    emi: Math.round(emi),
    totalCost: Math.round(totalCost),
    processingFee: Math.round(processingFee),
    interestRate: annualRate,
  };
};

export const formatINR = (number) => {
  if (number === undefined || number === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(number);
};
