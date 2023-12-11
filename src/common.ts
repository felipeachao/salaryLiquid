export type exemptionRange = {
  first: number;
  end: number;
  aliquot: number;
};

export enum TaxRate {
  INSS = 'INSS',
  IRRF = 'IRRF',
}
