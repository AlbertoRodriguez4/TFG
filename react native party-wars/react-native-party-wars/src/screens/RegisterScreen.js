import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  const [isCodeVerified, setIsCodeVerified] = useState('');
  const [registrationMode, setRegistrationMode] = useState('sendCode'); // Modo de registro: enviar código o verificar código

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
      console.log(data);
      setGeneratedCode(data.code);
      Alert.alert('Código enviado', 'Se ha enviado un código de verificación a tu correo electrónico.');
      setRegistrationMode('verifyCode'); // Cambiar al modo de verificación de código después de enviar el código
    } catch (error) {
      console.error('Error al enviar el código:', error);
      Alert.alert('Error', 'Ocurrió un error al enviar el código. Por favor, inténtalo de nuevo.');
    }
  };

  const verifyCode = async () => {
    try {
      const response = await fetch('http://192.168.1.90:3000/usuarios/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const isValid = await response.json();
      console.log(isValid);
      if (isValid) {
        setIsCodeVerified('true');
        console.log(isCodeVerified);
        Alert.alert('Código verificado', 'El código de verificación es correcto.');
        handleRegister(); // Ejecutar registro si el código es correcto
        navigation.navigate('Main');
      } else {
        setIsCodeVerified('false');
        Alert.alert('Código incorrecto', 'El código de verificación no es correcto.');
        registrationMode('sendCode');
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
      Alert.alert('Error', 'Ocurrió un error al verificar el código. Por favor, inténtalo de nuevo.');
    }
  };

  const handleRegister = async () => {
    console.log(isCodeVerified);
    if (isCodeVerified == 'false') {
      Alert.alert('Código no verificado', 'Debes verificar tu correo electrónico antes de registrarte.');
      console.log("no verificado");
      return;
    } else {
      console.log(name, email, password, plan, description, image);
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
          plan: plan,
          descripcionPersonal: description,
          image: image,
          urlImagen: image,
        };
        console.log(userData);
        console.log(userData.image);
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

        navigation.navigate('Main');
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        Alert.alert('Error', 'Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.');
      }
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
      console.log('Imagen subida con éxito');
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('URL de la imagen:', downloadURL);
      setImage(downloadURL);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Registro</Text>
      {registrationMode === 'sendCode' && (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            {errorText && <Text style={styles.errorText}>{errorText}</Text>}
            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              placeholder="Plan"
              value={plan}
              onChangeText={setPlan}
              style={styles.input}
            />
            <TextInput
              placeholder="Descripción personal"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
          </View>
          <Button title="Seleccionar Imagen" onPress={pickImage} />
          {!imageSelected && <Text style={styles.text}>Si no quieres seleccionar una imagen ahora, podrás elegir una imagen en la configuración de perfil del usuario</Text>}
          {imageSelected && <Text style={styles.text}>Imagen seleccionada</Text>}
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <Button title="Registrarse" onPress={sendVerificationCode} />
        </>
      )}
      {registrationMode === 'verifyCode' && (
        <>
          <TextInput
            placeholder="Código de Verificación"
            value={verificationCode}
            onChangeText={setVerificationCode}
            style={styles.input}
          />
          <Button title="Verificar Código" onPress={verifyCode} />
        </>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.link}>¿Ya tienes una cuenta? <Text style={styles.blueText}>Pincha aquí</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  text: {
    marginTop: 10,
    color: 'blue',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  link: {
    marginTop: 10,
    textAlign: 'center',
  },
  blueText: {
    color: 'blue',
  },
  errorText: {
    color: 'red',
  }
});

export default RegisterScreen;

