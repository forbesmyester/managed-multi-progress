"use strict";
/// <reference path="../types/multi-progress/index.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const MultiProgress = require("multi-progress");
function getPercent(doneCount, totalCount) {
    return Math.floor(doneCount / totalCount * 100);
}
exports.getPercent = getPercent;
function knockOut(index, moveFn, newVal, ar) {
    let r = [];
    for (let i = 0; i < ar.length - 1; i++) {
        if ((index > -1) && (i >= index)) {
            r[i] = moveFn(ar[i], ar[i + 1]);
        }
        else {
            r[i] = ar[i];
        }
    }
    r[ar.length - 1] = moveFn(ar[ar.length - 1], newVal);
    return r;
}
exports.knockOut = knockOut;
function index(maxBarCount, mainBar, subBarOpts) {
    let terminated = false;
    let bars = [];
    let multiProgress = new MultiProgress();
    let inited = false;
    function update(bar, update) {
        let params = ramda_1.assoc('id', update.id, update.params);
        if (update.total) {
            bar.total = update.total;
            bar.bar['total'] = bar.total; // OMG!
            params = ramda_1.assoc('total', update.total, params);
        }
        bar.current = update.current;
        bar.bar.update(update.current / bar.total, params);
        bar.id = update.id;
        bar.time = new Date().getTime();
        bar.params = params;
        return bar;
    }
    function create(inputAndUpdate, andUpdate = true) {
        let overallBar1 = multiProgress.newBar(inputAndUpdate.format, {
            complete: inputAndUpdate.complete ? inputAndUpdate.complete : '=',
            incomplete: inputAndUpdate.incomplete ? inputAndUpdate.incomplete : ' ',
            width: inputAndUpdate.width ? inputAndUpdate.width : 25,
            current: inputAndUpdate.current,
            total: inputAndUpdate.total
        });
        let b = ramda_1.merge(inputAndUpdate, { bar: overallBar1, time: new Date().getTime() });
        if (andUpdate) {
            update(b, inputAndUpdate);
        }
        return b;
    }
    bars.push(create(ramda_1.merge({ params: { title: 'overall' } }, mainBar), false));
    let barUpdater = function barUpdater(barUpdate) {
        if (!inited) {
            update(bars[0], ramda_1.merge({ params: { title: 'overall' } }, mainBar));
            inited = true;
        }
        if (terminated) {
            return;
        }
        let perhapsAlready = ramda_1.findIndex((b) => { return b.id == barUpdate.id; }, bars);
        if (perhapsAlready > -1) {
            update(bars[perhapsAlready], barUpdate);
            return;
        }
        if (bars.length < maxBarCount) {
            bars.push(create(ramda_1.merge(subBarOpts, barUpdate)));
            return;
        }
        let oldest = ramda_1.head(ramda_1.sortBy((b) => { return b.time; }, ramda_1.slice(1, Infinity, bars)));
        let oldestIndex = ramda_1.findIndex((b) => { return b.id == oldest.id; }, bars);
        bars = knockOut(oldestIndex, (a, b) => {
            return update(a, {
                id: b.id,
                current: b.current,
                total: b.total,
                params: b.params,
            });
        }, barUpdate, bars);
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
exports.default = index;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBEQUEwRDs7QUFFMUQsaUNBQXFGO0FBQ3JGLGdEQUFnRDtBQUdoRCxvQkFBMkIsU0FBUyxFQUFFLFVBQVU7SUFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRkQsZ0NBRUM7QUF1QkQsa0JBQTRCLEtBQWEsRUFBRSxNQUF5QixFQUFFLE1BQVMsRUFBRSxFQUFPO0lBQ3BGLElBQUksQ0FBQyxHQUFRLEVBQUUsQ0FBQztJQUNoQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDO0lBQzFCLENBQUM7SUFDRCxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckQsTUFBTSxDQUFDLENBQUMs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