import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { useApiKeySaved } from '@/auth/api-key-context';
import { verifyApiKey } from '@/auth/payload';

export default function SetupScreen() {
  const [inputKey, setInputKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const onKeySaved = useApiKeySaved();

  const handleSaveKey = async () => {
    const key = inputKey.trim();
    if (!key) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }
    setIsVerifying(true);
    try {
      const valid = await verifyApiKey(key);
      if (!valid) {
        Alert.alert('Invalid key', 'The server rejected this API key.');
        return;
      }

      await SecureStore.setItemAsync('payload_api_key', key);
      onKeySaved();
    } catch (error) {
      Alert.alert('Error', 'Could not verify the key. Check your connection and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Expenses</Text>
      <Text style={styles.subtitle}>Paste your personal API key to continue.</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Paste API Key here..."
        value={inputKey}
        onChangeText={setInputKey}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <Button
        title={isVerifying ? 'Verifying...' : 'Save & Enter App'}
        onPress={handleSaveKey}
        disabled={isVerifying}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 30, textAlign: 'center', color: '#666' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, marginBottom: 20 }
});