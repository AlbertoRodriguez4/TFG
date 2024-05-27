import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';

const CreateGameScreen = () => {
  const [nombre, setNombre] = useState('');
  const [propiedadJuego, setPropiedadJuego] = useState('');
  const [descripcionJuego, setDescripcionJuego] = useState('');
  const [categoriaJuego, setCategoriaJuego] = useState('');
  const [normasJuego, setNormasJuego] = useState('');

  const handleCreateGame = async () => {
    try {
      // Imprimir los datos antes de enviar la solicitud al backend
      console.log('Datos del juego:', {
        nombre,
        propiedadJuego,
        descripcionJuego,
        categoriaJuego,
        normasJuego,
      });

      const response = await fetch('http://192.168.1.90:3000/juegos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          propiedadJuego,
          descripcionJuego,
          categoriaJuego,
          normasJuego,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el juego');
      }

      // Si el juego se crea correctamente, muestra un mensaje de éxito
      Alert.alert('Juego Creado', 'El juego se ha creado exitosamente');

      // Limpiar los campos después de crear el juego
      setNombre('');
      setPropiedadJuego('');
      setDescripcionJuego('');
      setCategoriaJuego('');
      setNormasJuego('');
    } catch (error) {
      console.error('Error al crear el juego:', error);
      Alert.alert('Error', 'Ocurrió un error al crear el juego. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {/* Navegar hacia atrás */}}>
          <Image source={require('../assets/izquierda.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Partida Privada</Text>
        <TouchableOpacity onPress={() => {/* Navegar a la pantalla principal */}}>
          <Image source={require('../assets/hogar.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Image source={require('../assets/mono-business.jpg')} style={styles.gameImage} />
        <Text style={styles.label}>Nombre del juego:</Text>
        <TextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />
        <Text style={styles.label}>Temática del juego</Text>
        <TextInput
          placeholder="Propiedad del Juego"
          value={propiedadJuego}
          onChangeText={setPropiedadJuego}
          style={styles.input}
        />
        <Text style={styles.label}>Descripcion</Text>
        <TextInput
          placeholder="Descripción del Juego"
          value={descripcionJuego}
          onChangeText={setDescripcionJuego}
          style={styles.input}
        />
        <Text style={styles.label}>Normas</Text>
        <TextInput
          placeholder="Normas del Juego"
          value={normasJuego}
          onChangeText={setNormasJuego}
          style={styles.input}
        />
      </View>
      <TouchableOpacity style={styles.createButton} onPress={handleCreateGame}>
        <Text style={styles.createButtonText}>Crear Juego 🏆</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#000',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  gameImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  createButton: {
    backgroundColor: '#FFA726',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateGameScreen;
