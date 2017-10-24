declare module 'multi-progress' {
    import * as ProgressBar from 'progress';

    class MultiProgress {
        newBar(schema: any, options: any): ProgressBar;
    }

    namespace MultiProgress {}

    export = MultiProgress;
}
