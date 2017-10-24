import test from 'ava';
import { getPercent } from '../src/index';

test('Will skip if not proceed', (tst) => {

    tst.is(getPercent(3, 4), 75);

});
