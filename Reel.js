import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Image } from 'react-native';

import strip from './assets/reel_strip.png';

export default function Reel(props) {
  const spinAnimation = useRef(new Animated.Value(props.top || 0)).current;

  const startSpin = () => {
    Animated.sequence([
      Animated.loop(
        Animated.sequence([
          Animated.timing(spinAnimation, {
            toValue: 0,
            duration: 0.001,
            useNativeDriver: true,
          }),
          Animated.timing(spinAnimation, {
            toValue: -1925,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        { iterations: props.index + 2 }
      ),
      Animated.timing(spinAnimation, {
        toValue: props.top,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (props.spin) {
      startSpin();
    }
  }, [props.spin, props.top, startSpin]);

  return (
    <Animated.View
      style={[
        {
          display: 'flex',
          flexDirection: 'column',
          left: props.left,
          transform: [{ translateY: spinAnimation }],
        },
      ]}
    >
      <Image source={strip} style={styles.reel} />
      <Image source={strip} style={styles.reel} />
      <Image source={strip} style={styles.reel} />
      <Image source={strip} style={styles.reel} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  reel: {
    width: 100,
    height: 575,
  },
});
