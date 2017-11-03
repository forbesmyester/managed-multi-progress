/// <reference path="../types/multi-progress/index.d.ts"/>

import { remove, findIndex, filter, slice, sortBy, head, merge, assoc } from 'ramda';
import * as MultiProgress from 'multi-progress';
import * as ProgressBar from 'progress';

export function getPercent(doneCount, totalCount) {
    return Math.floor(doneCount / totalCount * 100);
}

export interface BarInput {
    total: number;
    format: string;
    width?: number;
    complete?: string;
    incomplete?: string;
}

export interface BarUpdate {
    id: string;
    current: number;
    total?: number;
    params?: { [k: string]: string };
}

interface Bar extends BarInput, BarUpdate {
    total: number;
    bar: ProgressBar;
    time: number;
}

export function knockOut<A>(index: number, moveFn: (a: A, b: A) => A, newVal: A, ar: A[]): A[] {
    let r: A[] = [];
    for (let i = 0; i < ar.length - 1; i++) {
        if ((index > -1) && (i >= index)) {
            r[i] = moveFn(ar[i], ar[i + 1]);
        }
        else { r[i] = ar[i]; }
    }
    r[ar.length - 1] = moveFn(ar[ar.length - 1], newVal);
    return r;
}

// export class ManagedMultiProgress {

//     private bars: Bar[];
//     private progress: ProgressBar[];
//     private multiProgress: MultiProgress;
//     private main: ProgressBar;

//     constructor(private maxBarCount, mainBar: BarInput & BarUpdate, private subBarOpts: BarInput, private sortByImpl: (b: BarInput) => number) {
//         this.multiProgress = new MultiProgress();
//         this.main = this.initProgressBar(mainBar);
//     }

//     initProgressBar(inputAndUpdate: BarInput & BarUpdate): ProgressBar {
//         return this.multiProgress.newBar(
//             inputAndUpdate.format,
//             {
//                 complete: inputAndUpdate.complete ? inputAndUpdate.complete : '=',
//                 incomplete: inputAndUpdate.incomplete ? inputAndUpdate.incomplete : ' ',
//                 width: inputAndUpdate.width ? inputAndUpdate.width : 25,
//                 current: inputAndUpdate.current,
//                 total: inputAndUpdate.total
//             }
//         );
//     }

//     private create(inputAndUpdate: BarInput & BarUpdate): Bar {
//         let overallBar1 = this.multiProgress.newBar(
//             inputAndUpdate.format,
//             {
//                 complete: inputAndUpdate.complete ? inputAndUpdate.complete : '=',
//                 incomplete: inputAndUpdate.incomplete ? inputAndUpdate.incomplete : ' ',
//                 width: inputAndUpdate.width ? inputAndUpdate.width : 25,
//                 current: inputAndUpdate.current,
//                 total: inputAndUpdate.total
//             }
//         );

//         let b = merge(inputAndUpdate, { bar: overallBar1, time: new Date().getTime() });
//         update(b, inputAndUpdate);

//         return b;

//     }

// }
//
export interface BarUpdater {
    (BarUpdate): void;
    terminate: (msg?: string) => void;
}


export default function index(maxBarCount, mainBar: BarInput & BarUpdate, subBarOpts: BarInput): BarUpdater {

    let terminated = false;
    let bars: Bar[] = [];
    let multiProgress = new MultiProgress();
    let inited = false;

    function update(bar: Bar, update: BarUpdate) {
        let params = assoc('id', update.id, update.params);
        if (update.total) {
            bar.total = update.total;
            bar.bar['total'] = bar.total; // OMG!
            params = assoc('total', update.total, params);
        }
        bar.current = update.current;
        bar.bar.update(
            update.current / bar.total,
            params
        );
        bar.id = update.id;
        bar.time = new Date().getTime();
        bar.params = params;
        return bar;
    }

    function create(inputAndUpdate: BarInput & BarUpdate, andUpdate: boolean = true): Bar {
        let overallBar1 = multiProgress.newBar(
            inputAndUpdate.format,
            {
                complete: inputAndUpdate.complete ? inputAndUpdate.complete : '=',
                incomplete: inputAndUpdate.incomplete ? inputAndUpdate.incomplete : ' ',
                width: inputAndUpdate.width ? inputAndUpdate.width : 25,
                current: inputAndUpdate.current,
                total: inputAndUpdate.total
            }
        );

        let b = merge(inputAndUpdate, { bar: overallBar1, time: new Date().getTime() });
        if (andUpdate) { update(b, inputAndUpdate); }

        return b;

    }

    bars.push(create(merge({ params: { title: 'overall' } }, mainBar), false));

    let barUpdater: BarUpdater = <BarUpdater>function barUpdater(barUpdate: BarUpdate) {
        if (!inited) {
            update(bars[0], merge({ params: { title: 'overall' } }, mainBar));
            inited = true;
        }
        if (terminated) { return; }
        let perhapsAlready = findIndex(
            (b) => { return b.id == barUpdate.id; },
            bars
        );
        if (perhapsAlready > -1) {
            update(bars[perhapsAlready], barUpdate);
            return;
        }
        if (bars.length < maxBarCount) {
            bars.push(create(merge(
                subBarOpts,
                barUpdate,
            )));
            return;
        }
        let oldest: Bar = head(
            sortBy(
                (b) => { return b.time; },
                slice(1, Infinity, bars)
            )
        );
        let oldestIndex = findIndex(
            (b) => { return b.id == oldest.id; },
            bars
        );
        bars = knockOut<Bar>(
            oldestIndex,
            (a: Bar, b: Bar) => {
                return update(a, {
                    id: b.id,
                    current: b.current,
                    total: b.total,
                    params: b.params,
                });
            },
            <Bar>barUpdate,
            bars
        );
        return;
    };

    barUpdater.terminate = (msg) => {
        terminated = true;
        multiProgress.terminate();
        if (msg) {
            console.log(msg);
        }
    };

    return barUpdater;

}

// Not really sure how to test something like this. I played with it until it
// looked right... I probably could write tests now, but it is done.
// Uncomment the following to see it running!
// if (process.argv.length > 2) {
//     let barUpdater = index(
//         5,
//         {
//             current: 0,
//             total: 10,
//             format: 'M[:bar] :current/:total - :id :title',
//             id: 'main',
//             width: 10,
//             complete: '#',
//             incomplete: '-',
//         },
//         {
//             total: 10,
//             format: 'S[:bar] :current/:total - :id :title',
//         }
//     );
//     let i = 0;
//     let interval = setInterval(() => {
//         barUpdater({
//             id: "i" + Math.floor(i / 10),
//             current: i % 10,
//             params: { title: 'i' + i++ }
//         });
//         if (i > 50) {
//             barUpdater({
//                 id: "main",
//                 current: 5,
//                 total: 10
//             });
//         }
//         if (i >= 100) {
//             barUpdater.terminate("Done");
//             clearInterval(interval);
//         }
//     }, 100);
// }
