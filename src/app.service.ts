import { Injectable } from '@nestjs/common';
import { TaxRate, exemptionRange } from './common';
import { SalaryDto } from './salary.dto';

@Injectable()
export class AppService {
  async salary(query: SalaryDto) {
    const { deduction, salary } = query;

    const inssTable: exemptionRange[] = [
      { first: 0, end: 1320, aliquot: 7.5 },
      { first: 1320.01, end: 2571.29, aliquot: 9 },
      { first: 2571.3, end: 3856.94, aliquot: 12 },
      { first: 3856.95, end: 7507.49, aliquot: 14 },
    ];

    const irrfTable: exemptionRange[] = [
      { first: 0, end: 2112, aliquot: 0 },
      { first: 2112.01, end: 2826.65, aliquot: 7.5 },
      { first: 2826.66, end: 3751.05, aliquot: 15 },
      { first: 3751.06, end: 4664.68, aliquot: 22.5 },
      { first: 4664.68, end: 0, aliquot: 27.5 },
    ];

    const inssBase: number = salary - (deduction ?? 0);

    const inss: number = parseFloat(
      inssTable
        .reduce(
          (count, value) =>
            count + this.progressiveTaxRate(value, inssBase, TaxRate.INSS),
          0,
        )
        .toFixed(2),
    );

    const irrfBase: number = inssBase - inss;

    const irrf: number = parseFloat(
      irrfTable
        .reduce(
          (count, value) =>
            count + this.progressiveTaxRate(value, irrfBase, TaxRate.IRRF),
          0,
        )
        .toFixed(2),
    );

    return {
      inss,
      inssBase,
      irrf,
      irrfBase,
      salaryLiquid: salary - irrf - inss,
    };
  }

  private progressiveTaxRate(
    value: exemptionRange,
    base: number,
    taxRate: TaxRate,
  ): number {
    const { first, end, aliquot } = value;
    let salarioFaixa: number;

    let condition: boolean = base >= end;

    if (taxRate == TaxRate.IRRF) condition = condition && end != 0;

    if (condition) salarioFaixa = end - first;
    else if (base > first) salarioFaixa = base - first;

    salarioFaixa = salarioFaixa ?? 0;

    const sum: number = (salarioFaixa * aliquot) / 100;

    return sum;
  }
}
