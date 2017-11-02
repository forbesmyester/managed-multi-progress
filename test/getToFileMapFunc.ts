import test from 'ava';
import { knockOut, getPercent } from '../src/index';

test('Will skip if not proceed', (tst) => {
    tst.is(getPercent(3, 4), 75);
});

test('Can transform array', (tst) => {
    let ar: number[] = [1, 2, 3, 4, 5];
    tst.deepEqual(
        knockOut<number>(
            2,
            (a, b) => {
                return a + b;
            },
            9,
            ar
        ),
        [1, 2, 7, 9, 14]
    );
});
