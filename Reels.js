import React from 'react';
import { View, Image } from 'react-native';

import overlay from './assets/reel_overlay.png';
import Reel from './Reel';

const reelSpots = {
  r1: -500,
  r2: -600,
  r3: -700,
  r4: -225,
  r5: -325,
  r6: -425,
  r7: -2225,
};

export default function Reels(props) {
  const { results, spinning } = props;
  const tops = results
    ? [
        reelSpots['r' + props.results.reels[0]],
        reelSpots['r' + props.results.reels[1]],
        reelSpots['r' + props.results.reels[2]],
      ]
    : [-600, -505, -360];
  return (
    <View {...props}>
      <Reel left={2} top={tops[0]} spin={spinning} index={0} />
      <Reel left={16} top={tops[1]} spin={spinning} index={1} />
      <Reel left={28} top={tops[2]} spin={spinning} index={2} />
      <Image
        source={overlay}
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 90,
          position: 'absolute',
        }}
      />
    </View>
  );
}
