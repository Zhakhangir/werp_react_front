export const serviceBA = [5, 6, 9];
export const marketingBA = [1, 2, 3, 4, 7, 8];
export const getTradeIn = id => {
  if (!id) return '';
  else if (id === 0) return '';
  else if (id === 1) return 'Trade-in 1';
  else if (id === 2) return 'Trade-in 2';
  else if (id === 3) return 'Trade-in 3';
};

export const tradeInOptions = [
  { key: 0, text: '', value: 0 },
  { key: 1, text: 'Trade-in 1', value: 1 },
  { key: 2, text: 'Trade-in 2', value: 2 },
  { key: 3, text: 'Trade-in 3', value: 3 },
];
