import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Camera } from 'expo-camera';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, LogBox, Platform, StyleSheet, View, Text } from 'react-native';
import Canvas from 'react-native-canvas';

const TensorCamera = cameraWithTensors(Camera);
LogBox.ignoreAllLogs(true);

const { width, height } = Dimensions.get('window');

export default function App() {
  const [model, setModel] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const context = useRef(null);
  const canvas = useRef(null);
  const lastSpokenObject = useRef('');
  const lastSpokenTime = useRef(Date.now());
  const lastDirectionTime = useRef(Date.now());
  const frameThrottle = 200; // Process a frame every 200ms (~5 FPS)
  let lastFrameTime = Date.now();

  const handleCameraStream = (images) => {
    const loop = async () => {
      const currentTime = Date.now();

      if (currentTime - lastFrameTime < frameThrottle) {
        requestAnimationFrame(loop);
        return;
      }

      lastFrameTime = currentTime;
      const nextImageTensor = images.next().value;

      if (!model || !nextImageTensor) {
        requestAnimationFrame(loop);
        return;
      }

      try {
        const predictions = await model.detect(nextImageTensor);

        if (predictions.length > 0) {
          console.log('Predictions:', predictions);

          // Announce detected object
          announceObject(predictions);

          // Provide navigation instructions after announcements
          giveDirections(predictions);

          // Draw bounding boxes for detected objects
          drawRectangle(predictions, nextImageTensor);
        }
      } catch (error) {
        console.error('Detection Error:', error);
      }

      requestAnimationFrame(loop);
    };

    loop();
  };

  const announceObject = (predictions) => {
    const currentTime = Date.now();
    const firstPrediction = predictions[0]; // Focus on the first detected object
    const objectClass = firstPrediction.class;

    if (
      objectClass !== lastSpokenObject.current &&
      currentTime - lastSpokenTime.current > 3000 // Speak about a detected object every 3 seconds
    ) {
      Speech.speak(` ${objectClass}. Detected`, { rate: 1.0 });
      lastSpokenObject.current = objectClass;
      lastSpokenTime.current = currentTime;
    }
  };

  const giveDirections = (predictions) => {
    const currentTime = Date.now();

    if (currentTime - lastDirectionTime.current < 2000) {
      // Avoid giving navigation instructions too frequently
      return;
    }

    const directions = predictions.map((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      const centerX = x + width / 2;

      if (centerX < width / 3) return 'Move slightly to your right.';
      if (centerX > (2 * width) / 3) return 'Move slightly to your left.';
      return 'You may proceed straight.';
    });

    const uniqueDirections = Array.from(new Set(directions)); // Remove duplicate directions
    const direction = uniqueDirections[0] || 'Proceed with caution.';

    Speech.speak(direction, { rate: 1.2 });
    lastDirectionTime.current = currentTime;
  };

  const drawRectangle = (predictions, nextImageTensor) => {
    if (!context.current || !canvas.current || predictions.length === 0) return;

    const scaleWidth = width / nextImageTensor.shape[1];
    const scaleHeight = height / nextImageTensor.shape[0];
    const flipHorizontal = Platform.OS !== 'ios';

    context.current.clearRect(0, 0, width, height);

    predictions.forEach((prediction) => {
      const [x, y, boxWidth, boxHeight] = prediction.bbox;

      const adjustedX = flipHorizontal
        ? canvas.current.width - x * scaleWidth - boxWidth * scaleWidth
        : x * scaleWidth;
      const adjustedY = y * scaleHeight;

      context.current.strokeRect(
        adjustedX,
        adjustedY,
        boxWidth * scaleWidth,
        boxHeight * scaleHeight
      );

      context.current.fillText(prediction.class, adjustedX - 5, adjustedY - 5);
    });
  };

  const handleCanvas = (can) => {
    if (can) {
      can.width = width;
      can.height = height;
      const ctx = can.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        ctx.lineWidth = 2;
        context.current = ctx;
        canvas.current = can;
      }
    }
  };

  const initializeTensorFlow = async () => {
    try {
      tf.env().set('WEBGL_PACK', false); // Optimize memory usage
      await tf.ready();
      const loadedModel = await cocoSsd.load();
      console.log('Model Loaded Successfully');
      setModel(loadedModel);
    } catch (error) {
      console.error('TensorFlow Initialization Error:', error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      await initializeTensorFlow();
    })();
  }, []);

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  let textureDims =
    Platform.OS === 'ios'
      ? { height: 1920, width: 1080 }
      : { height: 1200, width: 1600 };

  return (
    <View style={styles.container}>
      <TensorCamera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
        resizeHeight={150} // Reduce processing load
        resizeWidth={112}
        resizeDepth={3}
        onReady={handleCameraStream}
        autorender={true}
      />
      <Canvas style={styles.canvas} ref={handleCanvas} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  canvas: {
    position: 'absolute',
    zIndex: 1000000,
    width: '100%',
    height: '100%',
  },
});
