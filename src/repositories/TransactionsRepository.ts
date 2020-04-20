import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = this.getTotalIncome(transactions);
    const outcome = this.getTotalOutcome(transactions);
    const total = income - outcome;

    return { income, outcome, total };
  }

  private getTotalIncome(transactions: Transaction[]): number {
    const income = transactions.reduce((accum, transaction) => {
      return transaction.type === 'income'
        ? accum + Number(transaction.value)
        : accum;
    }, 0);
    return income || 0;
  }

  private getTotalOutcome(transactions: Transaction[]): number {
    const outcome = transactions.reduce((accum, transaction) => {
      return transaction.type === 'outcome'
        ? accum + Number(transaction.value)
        : accum;
    }, 0);
    return outcome || 0;
  }
}

export default TransactionsRepository;
