/** @format */

import * as fs from 'fs';
import { Cell } from 'ton-core';
import {
  Blockchain,
  SandboxContract,
  TreasuryContract,
} from '@ton-community/sandbox';

import { randomAddress } from '@ton-community/test-utils';
import Game, { configToCell } from '../src/game';

const DEFAULT_PERIOD = Date.now() + 86400;

describe('Game tests', () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let code: Cell;

  beforeAll(async () => {
    code = Cell.fromBoc(fs.readFileSync('../src/contract/game.cell'))[0];
  }),
    it('게임 컨트랙트를 배포한다.', async () => {
      blockchain = await Blockchain.create();

      deployer = await blockchain.treasury('deployer');
      const ownerAddress = deployer.address;

      const gameAddress = randomAddress();
      const gameResult = [{ address: gameAddress, win: 0, lose: 0, tie: 0 }];

      const gameContract = blockchain.openContract(
        Game.createForDeploy(code, {
          owner: ownerAddress,
          period: DEFAULT_PERIOD,
          results: gameResult,
        })
      );
      const deployResult = await gameContract.sendDeploy(deployer.getSender());

      expect(deployResult.transactions).toHaveTransaction({
        from: deployer.address,
        to: gameContract.address,
        deploy: true,
      });

      const config = await gameContract.getConfig();
      expect(ownerAddress.equals(config.owner)).toBe(true);
      expect(config.period).toEqual(DEFAULT_PERIOD);
    }),
    it('게임 기간을 재설정한다.', async () => {
      const SET_PERIOD = Date.now() + 604800;
      blockchain = await Blockchain.create();

      deployer = await blockchain.treasury('deployer');
      const ownerAddress = deployer.address;

      const gameAddress = randomAddress();
      const gameResult = [{ address: gameAddress, win: 0, lose: 0, tie: 0 }];

      const gameContract = blockchain.openContract(
        Game.createForDeploy(code, {
          owner: ownerAddress,
          period: DEFAULT_PERIOD,
          results: gameResult,
        })
      );
      await gameContract.sendDeploy(deployer.getSender());
      await gameContract.sendUpdatePeriod(deployer.getSender(), SET_PERIOD);
      const result = await gameContract.getPeriod();

      expect(result).toEqual(BigInt(SET_PERIOD));
    }),
    it('게임 결과를 저장한다.', async () => {
      blockchain = await Blockchain.create();

      deployer = await blockchain.treasury('deployer');
      const ownerAddress = deployer.address;

      const gameAddress = randomAddress();
      const gameResult = [
        { address: gameAddress, win: 1, lose: 0, tie: 0 },
        { address: randomAddress(), win: 0, lose: 1, tie: 0 },
        { address: randomAddress(), win: 1, lose: 0, tie: 0 },
      ];

      const gameContract = blockchain.openContract(
        Game.createForDeploy(code, {
          owner: ownerAddress,
          period: DEFAULT_PERIOD,
          results: gameResult,
        })
      );
      await gameContract.sendDeploy(deployer.getSender());
      const config = await gameContract.getConfig();
      config.results.push({ address: gameAddress, win: 0, lose: 1, tie: 0 });

      await gameContract.sendUpdateResult(
        deployer.getSender(),
        configToCell(config)
      );

      const result = await gameContract.getConfig();
      console.log(result);
    });
});
