import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
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
    <View style={styles.container}>
      {loggedInUser ? (
        <>
          <Text style={styles.welcomeText}>Bienvenido, {loggedInUser}</Text>
          <Button title="Cerrar Sesión" onPress={handleLogout} />
        </>
      ) : (
        <>
          <Image source={require('../assets/perfil.png')}
            style={styles.logo} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Nombre de Usuario"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            {loginError && (
              <Text style={styles.errorText}>El correo o la contraseña es incorrecto, inténtelo de nuevo</Text>
            )}
            <Text style={styles.registerText}>
              ¿No tienes una cuenta aún?{' '}
              <Text style={styles.registerLink} onPress={handleRegister}>
                Crear cuenta
              </Text>
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Cambia esto según el fondo deseado
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#FFA500', // Color naranja
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  registerText: {
    marginVertical: 10,
  },
  registerLink: {
    color: 'blue',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
