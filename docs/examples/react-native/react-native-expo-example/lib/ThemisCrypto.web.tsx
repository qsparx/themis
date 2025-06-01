import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { Asset } from 'expo-asset';
import themis, { initialize } from 'wasm-themis';

import { Buffer } from 'buffer';
global.Buffer = Buffer;

export default function ThemisCrypto() {
	
	useEffect(() => {
        async function initThemis() {
            try {
                console.log("Initializing Themis wasm...");
                // Load the WASM file as an asset
                const asset = Asset.fromModule(require('@/public/assets/wasm/libthemis.wasm'));
                await asset.downloadAsync();
                
                // Initialize Themis with the asset URI
                console.log("Initializing Themis with asset URI:", asset.uri);
                await initialize(asset.uri);
                console.log("Themis initialized");

                // You can now use Themis functions
                let message = 'Test Message Please Ignore'
                let context = 'Secure Cell example code'
                let master_key = Buffer.from('bm8sIHRoaXMgaXMgbm90IGEgdmFsaWQgbWFzdGVyIGtleQ==', 'base64')
                let passphrase = 'My Litte Secret: Passphrase Is Magic'

                let encrypted_message, decrypted_message

                console.log('# Secure Cell in Seal mode\n')

                console.log('## Master key API\n')

                let scellMK = themis.SecureCellSeal.withKey(master_key)

                encrypted_message = scellMK.encrypt(Buffer.from(message, 'UTF-8'))
                console.log('Encrypted: ' + Buffer.from(encrypted_message).toString('base64'))

                decrypted_message = scellMK.decrypt(encrypted_message)
                console.log('Decrypted: ' + Buffer.from(decrypted_message).toString('UTF-8'))

                // Visit https://docs.cossacklabs.com/simulator/data-cell/
                console.log()
                encrypted_message = Buffer.from('AAEBQAwAAAAQAAAAEQAAAC0fCd2mOIxlDUORXz8+qCKuHCXcDii4bMF8OjOCOqsKEdV4+Ga2xTHPMupFvg==', 'base64')
                decrypted_message = scellMK.decrypt(encrypted_message)
                console.log('Decrypted (simulator): ' + Buffer.from(decrypted_message).toString('UTF-8'))


            } catch (err) {
                console.error("Exception: Failed to initialize Themis wasm", err);
            }
        }
        
        initThemis();
	 }, []);
		
  return (
  <ThemedView style={styles.stepContainer}>
    <ThemedText type="subtitle">Exploring Themis on Web</ThemedText>
    <ThemedText>
      {`Keep your data safe...`}
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
