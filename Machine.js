import React, { useState } from 'react';
import { Image, ImageBackground } from 'react-native';

import machine from './assets/main_bg_machine2.png';
import won from './assets/won_bg.png';

export default function Machine(props) {
  return (
    <ImageBackground
      source={machine}
      style={{
        width: 590,
        height: 539,
        left: -55,
        overflow: 'hidden',
      }}
    >
      {props.winner ? (
        <Image
          source={won}
          style={{
            position: 'absolute',
            top: 68,
            left: 180,
            width: 348,
            height: 78,
          }}
        />
      ) : null}
      {props.children}
    </ImageBackground>
  );
}
