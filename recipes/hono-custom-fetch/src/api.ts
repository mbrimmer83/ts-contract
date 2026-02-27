import { initContract } from '@ts-contract/core';
import { pathPlugin, validatePlugin } from '@ts-contract/plugins';
import { contract } from './contract.js';

export const api = initContract(contract)
  .use(pathPlugin)
  .use(validatePlugin)
  .build();
