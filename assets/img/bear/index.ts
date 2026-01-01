/**
 * assets/img/bear/index.ts
 * * Central registry for the Tunnel Bear animation frames.
 * Maps static image assets for use in React Native Image components.
 */

export const BEAR_ASSETS = {
  // 21 Frames for the bear watching the cursor as the user types
  watch: [
    require('./watch_bear_0.png'),
    require('./watch_bear_1.png'),
    require('./watch_bear_2.png'),
    require('./watch_bear_3.png'),
    require('./watch_bear_4.png'),
    require('./watch_bear_5.png'),
    require('./watch_bear_6.png'),
    require('./watch_bear_7.png'),
    require('./watch_bear_8.png'),
    require('./watch_bear_9.png'),
    require('./watch_bear_10.png'),
    require('./watch_bear_11.png'),
    require('./watch_bear_12.png'),
    require('./watch_bear_13.png'),
    require('./watch_bear_14.png'),
    require('./watch_bear_15.png'),
    require('./watch_bear_16.png'),
    require('./watch_bear_17.png'),
    require('./watch_bear_18.png'),
    require('./watch_bear_19.png'),
    require('./watch_bear_20.png'),
  ],
  // 6 Frames for the bear covering its eyes during password entry
  hide: [
    require('./hide_bear_0.png'),
    require('./hide_bear_1.png'),
    require('./hide_bear_2.png'),
    require('./hide_bear_3.png'),
    require('./hide_bear_4.png'),
    require('./hide_bear_5.png'),
  ],
  // 4 Frames for the bear peeking when "show password" is toggled
  peek: [
    require('./peak_bear_0.png'),
    require('./peak_bear_1.png'),
    require('./peak_bear_2.png'),
    require('./peak_bear_3.png'),
  ],
};

export type BearAssetType = typeof BEAR_ASSETS;