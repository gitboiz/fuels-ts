import { FUEL_NETWORK_URL } from '../src/configs';
import { Predicate } from '../src/predicate';
import { Provider } from '../src/providers';

import { predicateAbi } from './fixtures/predicate-abi';
import { predicateBytecode } from './fixtures/predicate-bytecode';

/**
 * @group node
 * @group browser
 */
describe('Predicate', () => {
  describe('Functions', () => {
    const predicateAddress = '0x6b6ef590390f0a7de75f8275ab5d7877c17236caba2514039c6565ec15f79111';
    let provider: Provider;

    beforeAll(async () => {
      provider = await Provider.create(FUEL_NETWORK_URL);
    });

    it('sets predicate address for given byte code', () => {
      const predicate = new Predicate(predicateBytecode, provider);
      expect(predicate.address.toB256()).toEqual(predicateAddress);
    });

    it('sets predicate data for given ABI', () => {
      const b256 = '0x0101010101010101010101010101010101010101010101010101010101010101';
      const predicate = new Predicate(predicateBytecode, provider, predicateAbi, [b256]);

      expect(predicate.predicateArgs).not.toBeUndefined();
    });

    it('throws when predicate ABI has no main function', () => {
      const abiWithNoMain = {
        ...predicateAbi,
        functions: [
          {
            ...predicateAbi.functions[0],
            name: 'notMain',
          },
        ],
      };

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const predicate = new Predicate(predicateBytecode, provider, abiWithNoMain, ['NADA'], {
          value: 1,
        });
      }).toThrow('Cannot use ABI without "main" function');
    });
  });
});
