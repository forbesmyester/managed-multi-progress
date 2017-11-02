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
    total?: number;
    params?: {
        [k: string]: string;
    };
}
export declare function knockOut<A>(index: number, moveFn: (a: A, b: A) => A, newVal: A, ar: A[]): A[];
export interface BarUpdater {
    (BarUpdate: any): void;
    terminate: () => void;
}
export default function index(maxBarCount: any, mainBar: BarInput & BarUpdate, subBarOpts: BarInput): BarUpdater;
