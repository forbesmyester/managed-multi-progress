/// <reference path="../../types/multi-progress/index.d.ts" />
export declare function getPercent(doneCount: any, totalCount: any): number;
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
    params?: {
        [k: string]: string;
    };
}
export default function index(maxBarCount: any, mainBar: BarInput & BarUpdate, subBarOpts: BarInput): (barUpdate: BarUpdate) => void;
