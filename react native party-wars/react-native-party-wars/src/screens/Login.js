import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loginError, setLoginError] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      checkSession();
    }, [])
  );

  const checkSession = async () => {
    try {
      const user = await AsyncStorage.getItem('userData');
      if (user) {
        setLoggedInUser(JSON.parse(user).nome);
      }
    } catch (error) {
      console.error('Error al verificar la sesión:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/usuarios/login/${email}/${password}`);
      const userData = await response.json();

      if (userData.id) {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setLoggedInUser(userData.nome); // Actualiza el estado loggedInUser con el nombre del usuario
        Alert.alert('Inicio de Sesión Exitoso', `Hola, ${userData.nome}`);
        navigation.navigate('Main', { id: userData.id });
      } else {
        setLoginError(true);
        throw new Error('Correo electrónico o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setLoginError(true);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setLoggedInUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loggedInUser ? (
        <>
          <Text>Bienvenido, {loggedInUser}</Text>
          <Button title="Cerrar Sesión" onPress={handleLogout} />
        </>
      ) : (
        <>
          <Text>Inicio de Sesión</Text>
          <TextInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, padding: 10, marginVertical: 10, width: 250 }}
          />
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ borderWidth: 1, padding: 10, marginVertical: 10, width: 250 }}
          />
          <Button title="Iniciar Sesión" onPress={handleLogin} />
          {loginError && (
            <Text style={{ color: 'red' }}>El correo o la contraseña es incorrecto, inténtelo de nuevo</Text>
          )}
          <Text style={{ marginVertical: 10 }}>¿No tienes una cuenta aún? <Text style={{ color: 'blue' }} onPress={handleRegister}>Registrarse</Text></Text>
        </>
      )}
    </View>
  );
};

export default LoginScreen;
