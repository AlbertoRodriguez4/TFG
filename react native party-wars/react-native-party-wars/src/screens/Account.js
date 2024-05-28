import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../../FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditProfileScreen = () => {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('');
  const [descripcionPersonal, setDescripcionPersonal] = useState('');
  const [id, setId] = useState(0);
  const [urlImagen, setUrlImagen] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
      requestMediaLibraryPermission();
    });
    return unsubscribe;
  }, [navigation]);

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Se requiere permiso para acceder a la biblioteca de fotos.', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { id } = JSON.parse(userData);
        setId(id);
        fetchUserData(id);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/usuarios/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setNome(userData.nome);
        setEmail(userData.email);
        setPassword(userData.password);
        setPlan(userData.plan);
        setDescripcionPersonal(userData.descripcionPersonal);
        setUrlImagen(userData.urlImagen);
      } else {
        throw new Error('Error al obtener los datos del usuario');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      Alert.alert('Error', 'Hubo un problema al obtener los datos del usuario. Por favor, intenta de nuevo.');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      let imageUrl = urlImagen;
      if (newImage) {
        imageUrl = await uploadImage(newImage);
      }

      const updatedUserData = {
        nome: nome,
        email: email,
        password: password,
        plan: plan,
        descripcionPersonal: descripcionPersonal,
        urlImagen: imageUrl,
      };

      const response = await fetch(`http://192.168.1.90:3000/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      Alert.alert('Perfil actualizado', 'Su perfil ha sido actualizado exitosamente');
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      Alert.alert('Error', 'Ocurrió un error al actualizar el usuario. Por favor, inténtalo de nuevo.');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setNewImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profileImages/${new Date().toISOString()}`);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Editar tu <Text style={styles.titleBold}>Cuenta</Text></Text>
      </View>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {urlImagen ? (
          <Image source={{ uri: newImage ? newImage : urlImagen }} style={styles.image} />
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
        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#ffffff"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#ffffff"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
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
          value={descripcionPersonal}
          onChangeText={setDescripcionPersonal}
          style={styles.input}
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={handleUpdateProfile}>
          <LinearGradient
            colors={['#313131', '#000000']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>Actualizar Perfil</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#313131',
    width: '100%',
    paddingVertical: 20,
  },
  imageContainer: {
    position: 'absolute',
    top: '20%',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bottomSection: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
    paddingTop: 100,
  },
  title: {
    fontSize: 40,
    color: '#ffffff',
    marginBottom: 20,
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
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
