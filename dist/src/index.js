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
    let bars = [];
    let multiProgress = new MultiProgress();
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
    function create(inputAndUpdate) {
        let overallBar1 = multiProgress.newBar(inputAndUpdate.format, {
            complete: inputAndUpdate.complete ? inputAndUpdate.complete : '=',
            incomplete: inputAndUpdate.incomplete ? inputAndUpdate.incomplete : ' ',
            width: inputAndUpdate.width ? inputAndUpdate.width : 25,
            current: inputAndUpdate.current,
            total: inputAndUpdate.total
        });
        let b = ramda_1.merge(inputAndUpdate, { bar: overallBar1, time: new Date().getTime() });
        update(b, inputAndUpdate);
        return b;
    }
    bars.push(create(ramda_1.merge({ params: { title: 'overall' } }, mainBar)));
    let barUpdater = function barUpdater(barUpdate) {
        // console.log(barUpdate);
        let perhapsAlready = ramda_1.findIndex((b) => { return b.id == barUpdate.id; }, bars);
        // console.log(perhapsAlready, barUpdate.id);
        if (perhapsAlready > -1) {
            // console.log("p");
            update(bars[perhapsAlready], barUpdate);
            return;
        }
        if (bars.length < maxBarCount) {
            // console.log("s");
            bars.push(create(ramda_1.merge(subBarOpts, barUpdate)));
            return;
        }
        let oldest = ramda_1.head(ramda_1.sortBy((b) => { return b.time; }, ramda_1.slice(1, Infinity, bars)));
        let oldestIndex = ramda_1.findIndex((b) => { return b.id == oldest.id; }, bars);
        // console.log("r");
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
    barUpdater.terminate = () => {
        multiProgress.terminate();
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
//             current: 10,
//             total: 30,
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
//             barUpdater.terminate();
//             clearInterval(interval);
//             console.log("");
//         }
//     }, 100);
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBEQUEwRDs7QUFFMUQsaUNBQXFGO0FBQ3JGLGdEQUFnRDtBQUdoRCxvQkFBMkIsU0FBUyxFQUFFLFVBQVU7SUFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRkQsZ0NBRUM7QUF1QkQsa0JBQTRCLEtBQWEsRUFBRSxNQUF5QixFQUFFLE1BQVMsRUFBRSxFQUFPO0lBQ3BGLElBQUksQ0FBQyxHQUFRLEVBQUUsQ0FBQztJQUNoQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDO0lBQzFCLENBQUM7SUFDRCxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckQsTUFBTSxDQUFDLENBQUMs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