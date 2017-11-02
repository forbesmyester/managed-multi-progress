"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const index_1 = require("../src/index");
ava_1.default('Will skip if not proceed', (tst) => {
    tst.is(index_1.getPercent(3, 4), 75);
});
ava_1.default('Can transform array', (tst) => {
    let ar = [1, 2, 3, 4, 5];
    tst.deepEqual(index_1.knockOut(2, (a, b) => {
        return a + b;
    }, 9, ar), [1, 2, 7, 9, 14]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0VG9GaWxlTWFwRnVuYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvZ2V0VG9GaWxlTWFwRnVuYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUF1QjtBQUN2Qix3Q0FBb0Q7QUFFcEQsYUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDckMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxrQkFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNqQyxDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ2hDLElBQUksRUFBRSxHQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25DLEdBQUcsQ0FBQyxTQUFTLENBQ1QsZ0JBQVEsQ0FDSixDQUFDLEVBQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDTCxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQixDQUFDLEVBQ0QsQ0FBQyxFQUNELEVBQUUsQ0FDTCxFQUNELENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUNuQixDQUFDO0FBQ04sQ0FBQyxDQUFDLENBQUMifQ==