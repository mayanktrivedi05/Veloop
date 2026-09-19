import lvl1 from "./lvl-1.svg";
import lvl2 from "./lvl-2.svg";
import lvl3 from "./lvl-3.svg";
import lvl4 from "./lvl-4.svg";
import lvl5 from "./lvl-5.svg";
import lvl6 from "./lvl-6.svg";
import lvl7 from "./lvl-7.svg";
import lvl8 from "./lvl-8.svg";
import lvl9 from "./lvl-9.svg";
import lvl10 from "./lvl-10.svg";
import lock from "./lock.svg";

const BADGES_BY_LEVEL = { 1: lvl1, 2: lvl2, 3: lvl3, 4: lvl4, 5: lvl5, 6: lvl6, 7: lvl7, 8: lvl8, 9: lvl9, 10: lvl10 };

export function getBadgeSrc(level) {
  return BADGES_BY_LEVEL[level] ?? lvl1;
}

export const lockBadgeSrc = lock;
