module hj.library {
    export class Utils {
        public static guid(): string {
            var p8 = (s: boolean) => {
                var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
            }
            return p8(false) + p8(true) + p8(true) + p8(false);
        }
    }
}