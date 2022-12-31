import { fCurrency } from '../../utils/formatNumber';

export const formatFroshPrice = (froshPrice: number) => fCurrency(froshPrice / 100);
