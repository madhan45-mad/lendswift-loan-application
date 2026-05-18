// PAN Validation
export const validatePAN = (pan, loanType) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(pan)) {
    return 'PAN format must be AAAAA9999A';
  }

  const entityTypeChar = pan.charAt(3);
  
  if (loanType === 'Personal' || loanType === 'Home') {
    if (entityTypeChar !== 'P') {
      return 'For personal/home loans, 4th character must be P (Individual)';
    }
  } else if (loanType === 'Business') {
    if (!['P', 'C', 'F'].includes(entityTypeChar)) {
      return 'For business loans, 4th character must be P, C, or F';
    }
  }

  return true;
};

// Aadhaar Verhoeff Validation
// Multiplication table d
const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

// Permutation table p
const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

export const validateAadhaar = (aadhaar) => {
  if (!/^[0-9]{12}$/.test(aadhaar)) {
    return 'Aadhaar must be exactly 12 digits';
  }

  let c = 0;
  let invertedArray = aadhaar.split('').reverse().map(Number);

  for (let i = 0; i < invertedArray.length; i++) {
    c = d[c][p[(i % 8)][invertedArray[i]]];
  }

  return c === 0 ? true : 'Invalid Aadhaar number (checksum failed)';
};
