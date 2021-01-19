import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';

import Reels from './Reels';
import Machine from './Machine';

import spinBtn from './assets/spin_button.png';
import { Audio } from 'expo-av';
import { placeBet } from './game';

import logo from './assets/logo.png';
import { LinearGradient } from 'expo-linear-gradient';

const THEMES = {
  blue: {
    colors: ['#318DB8', '#05578C'],
    locations: [0, 1],
    status: 'light',
  },
  gold: {
    colors: ['#fccd4d', '#f8b500'],
    locations: [0, 1],
    status: 'light',
  },
  avocado: {
    colors: ['#f2f5f6', '#a9db80', '#96c56f'],
    locations: [0, 0.3, 1],
    status: 'dark',
  },
  light: {
    colors: ['#f2f5f6', '#c8d7dc'],
    locations: [0, 1],
    status: 'dark',
  },
  dark: {
    colors: ['#2a3439', '#1B252A'],
    locations: [0, 1],
    status: 'light',
  },
};

import { track } from './SnapyrSdk';

const theme = THEMES.blue;

export default function App() {
  const [spinSound, setSpinSound] = useState();
  const [payoutSound, setPayoutSound] = useState();
  const [fastPayoutSound, setFastPayoutSound] = useState();
  const [user, setUser] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [lastSpin, setLastSpin] = useState();
  const [spinHistory, setSpinHistory] = useState([]);
  const [appTheme, setAppTheme] = useState(theme);
  const [bet, setBet] = useState(1);
  const [coins, setCoins] = useState(100);
  const [spinPress, setSpinPress] = useState(false);
  const [spinDisabled, setSpinDisabled] = useState(false);
  const [spinning, setSpinning] = useState(false);

  function nextTheme() {
    const themeNames = Object.keys(THEMES);
    const currentIndex = themeNames.findIndex(
      (theme) => THEMES[theme] === appTheme
    );
    if (currentIndex === themeNames.length - 1) {
      return THEMES[themeNames[0]];
    }
    return THEMES[themeNames[currentIndex + 1]];
  }

  useEffect(() => {
    const spinSoundFile = new Audio.Sound();
    const payoutSoundFile = new Audio.Sound();
    const fastPayoutSoundFile = new Audio.Sound();
    (async () => {
      await Promise.all([
        spinSoundFile.loadAsync(require('./assets/spinning.mp3')),
        payoutSoundFile.loadAsync(require('./assets/payout.mp3')),
        fastPayoutSoundFile.loadAsync(require('./assets/fastpayout.mp3')),
      ]);
      setSpinSound(spinSoundFile);
      setPayoutSound(payoutSoundFile);
      setFastPayoutSound(fastPayoutSoundFile);
      setLoaded(true);
    })();
    return () => {
      spinSoundFile.unloadAsync();
      payoutSoundFile.unloadAsync();
    };
  }, []);

  function spin(jackpot) {
    setCoins(coins - bet);

    const results = placeBet({ name: user, coins }, bet, jackpot);

    const { payout } = results;

    const speed = payout > 40 ? 100 : 200;

    setSpinning(true);
    if (spinSound) {
      spinSound.replayAsync();
    }
    setTimeout(() => {
      setSpinning(false);
      if (payout) {
        setSpinDisabled(true);
        if (speed === 200 && payoutSound) {
          payoutSound.setIsLoopingAsync(true);
          payoutSound.playAsync();
        } else if (speed === 100 && fastPayoutSound) {
          fastPayoutSound.setIsLoopingAsync(true);
          fastPayoutSound.playAsync();
        }
        setCoins((c) => c + 1);
        const paying = setInterval(() => {
          setCoins((c) => c + 1);
        }, speed);
        setTimeout(() => {
          if (speed === 200 && payoutSound) {
            payoutSound.stopAsync();
          } else if (speed === 100 && fastPayoutSound) {
            fastPayoutSound.stopAsync();
          }
          setSpinDisabled(false);
          clearInterval(paying);
        }, speed * payout);
      }
    }, 2500);

    console.log('new spin', results);

    if (results.payout > 0) {
      console.log({ bet, payout: results.payout, win_time: new Date().toISOString() });
      track('win', { bet, payout: results.payout });
    } else {
      console.log({ bet, loss_time: new Date().toISOString() });
      track('loss', { bet });
    }

    setLastSpin(results);
    setSpinHistory((current) => [...current, results]);
  }
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={appTheme.colors}
        locations={appTheme.locations}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%',
        }}
      />
      {/* <Modal visible={!playing}>
        <KeyboardAvoidingView style={styles.modal}>
          <Text>Snapyr Slots</Text>
          <TextInput
            value={user}
            onChangeText={setUser}
            style={{
              height: 40,
              width: 320,
              paddingHorizontal: 12,
              backgroundColor: '#eee',
              borderWidth: 0,
              fontSize: 24,
              marginTop: 20,
            }}
          />
          <Pressable onPress={() => setPlaying(true)} style={styles.play}>
            <Text style={styles.playText}>New Game</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal> */}
      {loaded ? (
        <SafeAreaView style={styles.main}>
          <View style={styles.logo}>
            <Pressable onPress={() => setAppTheme(nextTheme())}>
              <Image source={logo} />
            </Pressable>
          </View>
          <Machine winner={!spinning && lastSpin && !!lastSpin.payout}>
            <Reels
              spinning={spinning}
              results={lastSpin}
              style={{
                top: 155,
                left: 187,
                width: 333,
                height: 220,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row',
              }}
            />
            <View style={styles.spinButton}>
              <Pressable
                disabled={spinning || spinDisabled}
                onPress={() => spin(false)}
                onLongPress={() => spin(true)}
                onPressIn={() => setSpinPress(true)}
                onPressOut={() => setSpinPress(false)}
              >
                <Image
                  source={spinBtn}
                  style={[
                    styles.spinButtonImage,
                    spinPress
                      ? styles.spinButtonPress
                      : spinDisabled || spinning
                      ? styles.spinButtonDisabled
                      : {},
                  ]}
                />
              </Pressable>
            </View>
            <Text style={styles.lastWin}>
              {lastSpin && lastSpin.payout && !spinning ? lastSpin.payout : ''}
            </Text>
            <Text style={styles.coins}>{coins}</Text>
            <Text style={styles.currentBet}>{bet}</Text>
          </Machine>
        </SafeAreaView>
      ) : null}
      <StatusBar style={appTheme.status} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  playText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  play: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'limegreen',
    borderRadius: 12,
    marginVertical: 22,
  },
  spinButton: {
    position: 'absolute',
    bottom: 65,
    right: 58,
    height: 70,
    overflow: 'hidden',
  },
  spinButtonImage: {
    width: 90,
    height: 300,
  },
  spinButtonPress: {
    top: -75,
  },
  spinButtonDisabled: {
    top: -225,
  },
  currentBet: {
    bottom: 78,
    left: 388,
    position: 'absolute',
    fontSize: 20,
  },
  coins: {
    bottom: 78,
    left: 295,
    position: 'absolute',
    fontSize: 20,
    width: 50,
    textAlign: 'right',
  },
  lastWin: {
    bottom: 78,
    left: 203,
    position: 'absolute',
    fontSize: 20,
    width: 50,
    textAlign: 'right',
  },
  logo: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    height: 125,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    flex: 1,
  },
});
