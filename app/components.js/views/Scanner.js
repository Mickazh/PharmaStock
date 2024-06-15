import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Audio } from 'expo-av';

export default function Scanner({ onClose, onScan }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    const partialData = data.substr(4, 13);
    await playSound();
    onScan({ data: partialData });
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./beep.mp3')
    );
    await sound.playAsync();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleOverlay}>
          <View style={styles.leftOverlay} />
          <View style={styles.rectangleContainer}>
            <View style={styles.rectangle}>
              <View style={[styles.corner, styles.topLeftCorner]} />
              <View style={[styles.corner, styles.topRightCorner]} />
              <View style={[styles.corner, styles.bottomLeftCorner]} />
              <View style={[styles.corner, styles.bottomRightCorner]} />
            </View>
          </View>
          <View style={styles.rightOverlay} />
        </View>
        <View style={styles.bottomOverlay} />
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"black",
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)', // Semi-transparency
  },
  middleOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftOverlay: {
    flex: 1,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.4)', // Semi-transparency
  },
  rightOverlay: {
    flex: 1,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.4)', // Semi-transparency
  },
  rectangleContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  rectangle: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  corner: {
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
    position: 'absolute',
  },
  topLeftCorner: {
    borderTopWidth: 5,
    borderLeftWidth: 5,
    top: -1,
    left: -1,
    borderTopLeftRadius: 10,
  },
  topRightCorner: {
    borderTopWidth: 5,
    borderRightWidth: 5,
    top: -1,
    right: -1,
    borderTopRightRadius: 10,
  },
  bottomLeftCorner: {
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    bottom: -1,
    left: -1,
    borderBottomLeftRadius: 10,
  },
  bottomRightCorner: {
    borderBottomWidth: 5,
    borderRightWidth: 5,
    bottom: -1,
    right: -1,
    borderBottomRightRadius: 10,
  },
  bottomOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)', // Semi-transparency
  },
  closeButton: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'rgba(93, 176, 117, 1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
