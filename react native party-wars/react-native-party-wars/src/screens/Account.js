import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
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
      <Text>Editar Perfil</Text>
      <TouchableOpacity onPress={pickImage}>
        {urlImagen ? (
          <Image source={{ uri: newImage ? newImage : urlImagen }} style={styles.image} />
        ) : (
          <View style={styles.profileIcon}>
            <Text style={styles.iconText}>+</Text>
          </View>
        )}
      </TouchableOpacity>
      <TextInput placeholder="Nombre" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Correo electrónico" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Descripción personal" value={descripcionPersonal} onChangeText={setDescripcionPersonal} style={styles.input} />
      <Button title="Actualizar Perfil" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    width: 250,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  profileIcon: {
    width: 200,
    height: 200,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconText: {
    fontSize: 50,
    color: 'gray',
  },
});

export default EditProfileScreen;
