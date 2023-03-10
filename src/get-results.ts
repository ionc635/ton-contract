/** @format */

import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient, Address } from 'ton';
import Game from './game';

async function main() {
  const endpoint = await getHttpEndpoint({ network: 'testnet' });
  const client = new TonClient({ endpoint });

  const gameAddress = Address.parse('');
  const game = new Game(gameAddress);
  const gameContract = client.open(game);

  const value = await gameContract.getConfig();
  console.log('value:', value);
}

main();
