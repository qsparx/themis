import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Buffer } from 'buffer';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';


export default function ThemisCrypto() {
	

  return (
  <ThemedView style={styles.stepContainer}>
    <ThemedText type="subtitle">Exploring Themis on Web</ThemedText>
    <ThemedText>
      {`Keep your data safe.`}
    </ThemedText>
  </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
