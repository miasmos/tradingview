class Util {
    static randomInt(length = 10): number {
        const rnd = Math.random()
            .toString()
            .substring(2);
        return Number(rnd.substring(0, length));
    }

    static randomHex(length = 4): string {
        /* eslint-disable-next-line no-bitwise */
        return ((Math.random() * 0xffffffffffff) << 0).toString(16).substring(0, length);
    }
}

export default Util;
