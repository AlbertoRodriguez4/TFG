import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

const CreateGameScreen = () => {
  const [nombre, setNombre] = useState('');
  const [propiedadJuego, setPropiedadJuego] = useState('');
  const [descripcionJuego, setDescripcionJuego] = useState('');
  const [categoriaJuego, setCategoriaJuego] = useState('');
  const [normasJuego, setNormasJuego] = useState('');
  const [fechaJuego, setFechaJuego] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const [idNavigationJuegos, setIdNavigationJuegos] = useState(null);

  useEffect(() => {
    if (route.params?.idNavigationJuegos) {
      setIdNavigationJuegos(route.params.idNavigationJuegos);
      console.log(route.params.idNavigationJuegos);
    }
  }, [route.params?.idNavigationJuegos]);

  const handleCreateGame = async () => {
    try {
      console.log('Datos del juego:', {
        nombre,
        propiedadJuego,
        descripcionJuego,
        categoriaJuego,
        normasJuego,
        fechaJuego,
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
          fechaJuego,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el juego');
      }

      Alert.alert('Juego Creado', 'El juego se ha creado exitosamente');

      setNombre('');
      setPropiedadJuego('');
      setDescripcionJuego('');
      setCategoriaJuego('');
      setNormasJuego('');
      setFechaJuego(new Date());
      navigation.navigate('VerJuegos', { idNavigationJuegos: idNavigationJuegos });
    } catch (error) {
      console.error('Error al crear el juego:', error);
      Alert.alert('Error', 'Ocurrió un error al crear el juego. Por favor, inténtalo de nuevo.');
    }
  };

  const onChangeFecha = (event, selectedDate) => {
    const currentDate = selectedDate || fechaJuego;
    setShowPicker(false);
    setFechaJuego(currentDate);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <Text style={styles.title}>Crear <Text style={styles.titleBold}>Juego</Text></Text>
        </View>

        <LinearGradient
          colors={['#FFDE59', '#FF914D']}
          style={styles.bottomSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image source={require('../assets/mono-business.jpg')} style={styles.image} />

          <TextInput
            placeholder="Nombre del Juego"
            placeholderTextColor="#ffffff"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
          <TextInput
            placeholder="Temática del Juego"
            placeholderTextColor="#ffffff"
            value={propiedadJuego}
            onChangeText={setPropiedadJuego}
            style={styles.input}
          />
          <TextInput
            placeholder="Descripción del Juego"
            placeholderTextColor="#ffffff"
            value={descripcionJuego}
            onChangeText={setDescripcionJuego}
            style={styles.input}
          />
          <TextInput
            placeholder="Normas del Juego"
            placeholderTextColor="#ffffff"
            value={normasJuego}
            onChangeText={setNormasJuego}
            style={styles.input}
          />
          <TextInput
            placeholder="Categoría del Juego"
            placeholderTextColor="#ffffff"
            value={categoriaJuego}
            onChangeText={setCategoriaJuego}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateInput}>
            <Text style={styles.dateText}>{fechaJuego.toLocaleString()}</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={fechaJuego}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={onChangeFecha}
            />
          )}
          <TouchableOpacity style={styles.buttonContainer} onPress={handleCreateGame}>
            <LinearGradient
              colors={['#313131', '#313131']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Crear Juego 🏆</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#313131',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    top: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 150,
  },
  bottomSection: {
    paddingTop: 80,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 120,
  },
  title: {
    fontSize: 30,
    color: '#ffffff',
    marginBottom: 20,
  },
  titleBold: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    width: 250,
    height: 150,
    borderColor: '#ffffff',
    borderWidth: 2,
    marginVertical: 10,
    borderRadius: 15,
    top: -100,
    position: 'absolute',
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
    fontSize: 17,
  },
  dateInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  dateText: {
    color: '#ffffff',
    fontWeight: 'bold',
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

export default CreateGameScreen;