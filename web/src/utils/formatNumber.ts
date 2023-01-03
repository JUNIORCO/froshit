import numeral from 'numeral';

export function fCurrency(number: string | number) {
  return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

export function fPercent(number: number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number: string | number) {
  return numeral(number).format();
}

export function fShortenNumber(number: string | number) {
  return numeral(number).format('0.00a').replace('.00', '');
}

export function fData(number: string | number) {
  return numeral(number).format('0.0 b');
}

export function fDollarToCent(amount: number) {
  const str = amount.toString();
  const [int] = str.split('.');

  return Number(amount.toFixed(2).replace('.', '').padEnd(int.length === 1 ? 3 : 4, '0'));
}
