// import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({title, value, type, category} : Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if( type == 'outcome' && total < value){
      throw new AppError('You do not have enough balance');
    }

    let transactionCategory = <Category> await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if(!transactionCategory){
      transactionCategory = <Category> categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }    

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
