declare module 'multi-progress' {
    import * as ProgressBar from 'progress';

    class MultiProgress {
        newBar(schema: any, options: any): ProgressBar;
        terminate(): void;
    }

    namespace MultiProgress {}

    export = MultiProgress;
}
