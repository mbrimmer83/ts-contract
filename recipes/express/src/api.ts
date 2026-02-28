import { initContract } from '@ts-contract/core';
import { validatePlugin } from '@ts-contract/plugins';
import { contract } from './contract.js';

export const api = initContract(contract)
  .use(validatePlugin)
  .build();
