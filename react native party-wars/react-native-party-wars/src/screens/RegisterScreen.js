import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LinearGradient } from 'expo-linear-gradient';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('Básico');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [registrationMode, setRegistrationMode] = useState('sendCode');

  useEffect(() => {
    requestMediaLibraryPermission();
  }, []);

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso necesario',
        'Se requiere permiso para acceder a la biblioteca de fotos.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    }
  };

  const sendVerificationCode = async () => {
    try {
      const response = await fetch('http://192.168.1.90:3000/usuarios/send-random-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setGeneratedCode(data.code);
      Alert.alert('Código enviado', 'Se ha enviado un código de verificación a tu correo electrónico.');
      setRegistrationMode('verifyCode');
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al enviar el código. Por favor, inténtalo de nuevo.');
    }
  };

  const verifyCode = async () => {
    try {
      console.log('Verification Code:', verificationCode);
      const response = await fetch('http://192.168.1.90:3000/usuarios/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const responseData = await response.json();
      console.log('Response Data:', responseData); // Verifica la estructura de la respuesta

      if (responseData.isValid) {
        console.log('Código verificado correctamente');
        setIsCodeVerified(true);
      } else {
        console.log('Código incorrecto');
        setIsCodeVerified(false);
        Alert.alert('Código incorrecto', 'El código de verificación no es correcto.');
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
      Alert.alert('Error', 'Ocurrió un error al verificar el código. Por favor, inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    if (isCodeVerified) {
      handleRegister();
    }
  }, [isCodeVerified]);

  const handleRegister = async () => {
    console.log('isCodeVerified:', isCodeVerified);
    if (!isCodeVerified) {
      Alert.alert('Código no verificado', 'Debes verificar tu correo electrónico antes de registrarte.');
      return;
    }

    try {
      if (!name || !email || !password || !description) {
        setErrorText('No se pueden dejar campos vacíos excepto la imagen');
        return;
      }

      if (!email.includes('@')) {
        setErrorText('Correo inválido, por favor, compruébelo');
        return;
      }

      setErrorText('');

      const userData = {
        nome: name,
        email: email,
        password: password,
        plan: 'Básico',
        descripcionPersonal: description,
        image: image,
        urlImagen: image,
      };

      const response = await fetch('http://192.168.1.90:3000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el usuario');
      }

      Alert.alert('Usuario registrado', 'Usuario registrado correctamente. Por favor, inicia sesión para continuar.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.');
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      setImageSelected(true);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profileImages/${new Date().toISOString()}`);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setImage(downloadURL);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Registrarte en <Text style={styles.titleBold}>Party Wars</Text></Text>
      </View>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.profileIcon}>
            <Text style={styles.iconText}>+</Text>
          </View>
        )}
      </TouchableOpacity>
      <LinearGradient
        colors={['#FFDE59', '#FF914D']}
        style={styles.bottomSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {registrationMode === 'sendCode' && (
          <>
            <TextInput
              placeholder="Nombre"
              placeholderTextColor="#ffffff"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Correo electrónico"
              placeholderTextColor="#ffffff"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            {errorText && <Text style={styles.errorText}>{errorText}</Text>}
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#ffffff"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              placeholder="Descripción personal"
              placeholderTextColor="#ffffff"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
            <TouchableOpacity style={styles.buttonContainer} onPress={sendVerificationCode}>
              <LinearGradient
                colors={['#313131', '#313131']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Registrarse</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.ViewToLogin}>
              <TouchableOpacity onPress={goToLogin}>
                <Text style={styles.link}>¿Ya tienes una cuenta? <Text style={styles.blueText}>Pincha aquí</Text></Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {registrationMode === 'verifyCode' && (
          <>
            <TextInput
              placeholder="Código de Verificación"
              placeholderTextColor="#ffffff"
              value={verificationCode}
              onChangeText={setVerificationCode}
              style={styles.input}
            />
            <TouchableOpacity style={styles.buttonContainer} onPress={verifyCode}>
              <LinearGradient
                colors={['#313131', '#313131']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Verificar Código</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#313131',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#313131',
    width: '100%',
    paddingVertical: 5,
  },
  imageContainer: {
    position: 'absolute',
    top: '18%',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    bottom: '65%',
  },
  bottomSection: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 2.2,
    width: '100%',
    alignItems: 'center',
    paddingTop: 140,
    paddingBottom: 60,
  },
  title: {
    fontSize: 30,
    color: '#ffffff',
    marginBottom: 20,
    bottom: -10,
  },
  titleBold: {
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 150,
    borderColor: '#ffffff',
    borderWidth: 2,
    marginVertical: 10,
    borderRadius: 15,
  },
  profileIcon: {
    width: 150,
    height: 150,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 75,
    marginVertical: 10,
  },
  iconText: {
    fontSize: 50,
    color: 'gray',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    bottom: 30,
  },
  buttonContainer: {
    width: '80%',
    borderRadius: 10,
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    bottom: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  ViewToLogin: {
    bottom: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: '#000000',
    marginTop: 15,
  },
  blueText: {
    color: '#00ADEF',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default RegisterScreen;
