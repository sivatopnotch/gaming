import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Matter from 'matter-js';
import FloorObject from './src/views/Object.js';
import BirdObject from './src/views/Bird.js';
import PipeUpObject from './src/views/PipeUp.js';
import PipeDownObject from './src/views/PipeDown.js';
import Constants from './src/Constants.js';
import Physics from './src/Physics.js';
const App = () => {
  const [gameEngine, setGameEngine] = useState(null);
  const [running, setRunning] = useState(false);

  const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const generatePipes = () => {
    let topPipeHeight = randomBetween(100, Constants.MAX_HEIGHT / 2 - 100);
    let bottomPipeHeight =
      Constants.MAX_HEIGHT - topPipeHeight - Constants.GAP_SIZE;
    let sizes = [topPipeHeight, bottomPipeHeight];
    if (Math.random() < 0.5) {
      sizes = sizes.reverse();
    }
    return sizes;
  };

  const setupWorld = () => {
    let engine = Matter.Engine.create({enableSleeping: false});
    let world = engine.world;
    let bird = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 4,
      Constants.MAX_HEIGHT / 2,
      50,
      50,
    );
    let floor = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 35,
      Constants.MAX_WIDTH,
      50,
      {isStatic: true},
    );
    let ceiling = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      25,
      Constants.MAX_WIDTH,
      50,
      {isStatic: true},
    );
    let [pipe1Height, pipe2Height] = generatePipes();

    let pipe1 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH - Constants.PIPE_WIDTH / 2,
      pipe1Height / 2,
      Constants.PIPE_WIDTH,
      pipe1Height,
      {isStatic: true},
    );
    let pipe2 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH - Constants.PIPE_WIDTH / 2,
      Constants.MAX_HEIGHT - pipe2Height / 2,
      Constants.PIPE_WIDTH,
      pipe2Height,
      {isStatic: true},
    );

    let [pipe3Height, pipe4Height] = generatePipes();

    let pipe3 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH * 2 - Constants.PIPE_WIDTH / 2,
      pipe3Height / 2,
      Constants.PIPE_WIDTH,
      pipe3Height,
      {isStatic: true},
    );
    let pipe4 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH * 2 - Constants.PIPE_WIDTH / 2,
      Constants.MAX_HEIGHT - pipe4Height / 2,
      Constants.PIPE_WIDTH,
      pipe4Height,
      {isStatic: true},
    );

    Matter.World.add(world, [bird, floor, ceiling, pipe1, pipe2, pipe3, pipe4]);
    Matter.Events.on(engine, 'collisionStart', (event) => {
      var pairs = event.pairs;

      gameEngine.dispatch({type: 'game-over'});
    });
    return {
      physics: {engine: engine, world: world},
      bird: {body: bird, size: [50, 50], color: 'red', renderer: BirdObject},
      floor: {
        body: floor,
        size: [Constants.MAX_WIDTH, 50],
        color: 'green',
        renderer: FloorObject,
      },
      ceiling: {
        body: ceiling,
        size: [Constants.MAX_WIDTH, 50],
        color: 'green',
        renderer: FloorObject,
      },
      pipe1: {
        body: pipe1,
        size: [Constants.PIPE_WIDTH, pipe1Height],
        color: 'green',
        renderer: PipeUpObject,
      },
      pipe2: {
        body: pipe2,
        size: [Constants.PIPE_WIDTH, pipe2Height],
        color: 'green',
        renderer: PipeDownObject,
      },
      pipe3: {
        body: pipe3,
        size: [Constants.PIPE_WIDTH, pipe3Height],
        color: 'green',
        renderer: PipeUpObject,
      },
      pipe4: {
        body: pipe4,
        size: [Constants.PIPE_WIDTH, pipe4Height],
        color: 'green',
        renderer: PipeDownObject,
      },
    };
  };

  const onEvent = (e) => {
    if (e.type === 'game-over') {
      //Alert.alert("Game Over");
      setRunning(false);
    }
  };

  const reset = () => {
    gameEngine.swap(setupWorld());
    setRunning(true);
  };

  return (
    <View style={styles.container}>
      <GameEngine
        ref={(ref) => {
          setGameEngine(ref);
        }}
        style={styles.gameContainer}
        running={running}
        entities={setupWorld}
        onEvent={onEvent}
        systems={[Physics]}>
        <StatusBar hidden={true} />
        {!running && (
          <TouchableOpacity style={styles.fullScreenButton} onPress={reset}>
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>Game Over</Text>
            </View>
          </TouchableOpacity>
        )}
      </GameEngine>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gameOverText: {
    color: 'white',
    fontSize: 48,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
});

export default App;
