"use strict";
/// <reference path="../types/multi-progress/index.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const MultiProgress = require("multi-progress");
function getPercent(doneCount, totalCount) {
    return Math.floor(doneCount / totalCount * 100);
}
exports.getPercent = getPercent;
function index(maxBarCount, mainBar, subBarOpts) {
    let bars = [];
    let multiProgress = new MultiProgress();
    function update(bar, update) {
        bar.bar.update(update.current / bar.total, update.params);
        bar.id = update.id;
        bar.time = new Date().getTime();
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
    return function uuuuu(barUpdate) {
        if (bars.length < maxBarCount) {
            bars.push(create(ramda_1.merge(subBarOpts, barUpdate)));
            return;
        }
        let perhapsAlready = ramda_1.filter((b) => { return b.id == barUpdate.id; }, bars);
        if (perhapsAlready.length) {
            update(perhapsAlready[0], barUpdate);
            return;
        }
        let oldest = ramda_1.head(ramda_1.sortBy((b) => { return b.time; }, ramda_1.slice(1, Infinity, bars)));
        update(oldest, barUpdate);
        return;
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBEQUEwRDs7QUFFMUQsaUNBQWtFO0FBQ2xFLGdEQUFnRDtBQUdoRCxvQkFBMkIsU0FBUyxFQUFFLFVBQVU7SUFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRkQsZ0NBRUM7QUFzQkQsZUFBOEIsV0FBVyxFQUFFLE9BQTZCLEVBQUUsVUFBb0I7SUFFMUYsSUFBSSxJQUFJLEdBQVUsRUFBRSxDQUFDO0lBQ3JCLElBQUksYUFBYSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7SUFFeEMsZ0JBQWdCLEdBQVEsRUFBRSxNQUFpQjtRQUN2QyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FDVixNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQ2hCLENBQUM7UUFDRixHQUFHLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDbkIsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRCxnQkFBZ0IsY0FBb0M7UUFDaEQsSUFBSSxXQUFXLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FDbEMsY0FBYyxDQUFDLE1BQU0sRUFDckI7WUFDSSxRQUFRLEVBQUUsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRztZQUNqRSxVQUFVLEVBQUUsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRztZQUN2RSxLQUFLLEVBQUUsY0FBYyxDQUFDLEtBQUssQ0FB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