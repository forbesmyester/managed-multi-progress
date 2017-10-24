/// <reference path="../types/multi-progress/index.d.ts"/>

import { filter, slice, sortBy, head, merge, assoc } from 'ramda';
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
    params?: { [k: string]: string };
}

interface Bar extends BarInput, BarUpdate {
    bar: ProgressBar;
    time: number;
}


export default function index(maxBarCount, mainBar: BarInput & BarUpdate, subBarOpts: BarInput) {

    let bars: Bar[] = [];
    let multiProgress = new MultiProgress();

    function update(bar: Bar, update: BarUpdate) {
        bar.bar.update(
            update.current / bar.total,
            update.params
        );
        bar.id = update.id;
        bar.time = new Date().getTime();
    }

    function create(inputAndUpdate: BarInput & BarUpdate): Bar {
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
        update(b, inputAndUpdate);

        return b;

    }

    bars.push(create(merge({ params: { title: 'overall' } }, mainBar)));

    return function uuuuu(barUpdate: BarUpdate) {
        if (bars.length < maxBarCount) {
            bars.push(create(merge(
                subBarOpts,
                barUpdate,
            )));
            return;
        }
        let perhapsAlready = filter(
            (b) => { return b.id == barUpdate.id; },
            bars
        );
        if (perhapsAlready.length) {
            update(perhapsAlready[0], barUpdate);
            return;
        }
        let oldest: Bar = head(
            sortBy(
                (b) => { return b.time; },
                slice(1, Infinity, bars)
            )
        );
        update(oldest, barUpdate);
        return;
    };

}

// Not really sure how to test something like this. I played with it until it
// looked right... I probably could write tests now, but it is done.
// Uncomment the following to see it running!
// if (process.argv.length > 2) {
//     let barUpdater = index(
//         5,
//         {
//             current: 10,
//             total: 30,
//             format: 'M[:bar] :current/:total - :title',
//             id: 'main',
//             width: 10,
//             complete: '#',
//             incomplete: '-',
//         },
//         {
//             total: 15,
//             format: 'S[:bar] :current/:total - :title',
//         }
//     );
//     let i = 0;
//     let interval = setInterval(() => {
//         barUpdater({
//             id: "i" + Math.floor(i / 10),
//             current: i / 10,
//             params: { title: 'i' + i++ }
//         });
//         if (i >= 100) {
//             clearInterval(interval);
//             console.log("");
//         }
//     }, 100);
// }
