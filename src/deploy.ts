/** @format */

import * as fs from 'fs';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { mnemonicToWalletKey } from 'ton-crypto';
import { TonClient, Cell, WalletContractV4, toNano } from 'ton';
import Game from './game';

async function deploy() {
  const endpoint = await getHttpEndpoint({ network: 'testnet' });
  const client = new TonClient({ endpoint });

  const mnemonic = ''
  const key = await mnemonicToWalletKey(mnemonic.split(' '));
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });

  const gameCode = Cell.fromBoc(fs.readFileSync('./contract/game.cell'))[0];
  const initialCounterValue = {
    owner: wallet.address,
    prize: toNano('1'),
    period: Date.now() + 86400,
    results: [],
  };
  const game = Game.createForDeploy(gameCode, initialCounterValue);

  console.log('contract address:', game.address.toString());
  if (await client.isContractDeployed(game.address)) {
    return console.log('Counter already deployed');
  }

  if (!(await client.isContractDeployed(wallet.address))) {
    return console.log('wallet is not deployed');
  }

  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  const gameContract = client.open(game);
  await gameContract.sendDeploy(walletSender);

  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log('waiting for deploy transaction to confirm...');
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log('deploy transaction confirmed!');
}

deploy();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
