/** @format */

import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient, Address, WalletContractV4 } from 'ton';
import { mnemonicToWalletKey } from 'ton-crypto';
import Game from './game';

async function main() {
  const endpoint = await getHttpEndpoint({ network: 'testnet' });
  const client = new TonClient({ endpoint });

  const mnemonic = '';
  const key = await mnemonicToWalletKey(mnemonic.split(' '));
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });

  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  const gameAddress = Address.parse('EQDJIo_4HbQMav5asyzrikaKEAyJ8OZeBMayluYS6SZm5nvH');
  const game = new Game(gameAddress);
  const gameContract = client.open(game);

//   await gameContract.sendUpdatePeriod(walletSender, Date.now());
  await gameContract.sendPrize(walletSender, [wallet.address, wallet.address, wallet.address]);

  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log('waiting for transaction to confirm...');
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log('transaction confirmed!');
}

main();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
