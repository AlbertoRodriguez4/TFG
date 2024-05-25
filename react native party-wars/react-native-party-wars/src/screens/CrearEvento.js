import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Image, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateRoomScreen = () => {
    const [nombreSala, setNombreSala] = useState('');
    const [edadMinEvento, setEdadMinEvento] = useState('');
    const [edadMaxEvento, setEdadMaxEvento] = useState('');
    const [localizacion, setLocalizacion] = useState('');
    const [tematicaEvento, setTematicaEvento] = useState('');
    const [descripcionEnvento, setDescripcionEnvento] = useState('');
    const [localizacionEvento, setLocalizacionEvento] = useState('');
    const [cantidadAsistentes, setCantidadAsistentes] = useState('');
    const [fechaEvento, setFechaEvento] = useState('');
    const [nombreEmpEvento, setNombreEmpEvento] = useState('');
    const [linksDeReferencia, setLinksDeReferencia] = useState('');
    const [requiereCompraEntradas, setRequiereCompraEntradas] = useState(false);
    const [precioEntrada, setPrecioEntrada] = useState('');
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [id, setId] = useState(0);
    const [idNavigationEventos, setIdNavigationEventos] = useState(0);
    const [image, setImage] = useState(null);
    const [imageSelected, setImageSelected] = useState(false);

    useEffect(() => {
        loadUserData();
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
    const handleCreateEvent = async () => {
        try {
            const response = await fetch('http://192.168.1.90:3000/eventos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombreSala,
                    edadMinEvento: parseInt(edadMinEvento),
                    edadMaxEvento: parseInt(edadMaxEvento),
                    localizacion,
                    tematicaEvento,
                    descripcionEnvento,
                    localizacionEvento,
                    cantidadAsistentes: parseInt(cantidadAsistentes),
                    fechaEvento,
                    nombreEmpEvento,
                    linksDeReferencia,
                    requiereCompraEntradas,
                    precioEntrada: requiereCompraEntradas ? parseFloat(precioEntrada) : null,
                    imagen: image,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear el evento');
            }

            const data = await response.json();
            setIdNavigationEventos(data);

            console.log('ID del evento creado:', data);

            setNombreSala('');
            setEdadMinEvento('');
            setEdadMaxEvento('');
            setLocalizacion('');
            setTematicaEvento('');
            setDescripcionEnvento('');
            setLocalizacionEvento('');
            setCantidadAsistentes('');
            setFechaEvento('');
            setNombreEmpEvento('');
            setLinksDeReferencia('');
            setRequiereCompraEntradas(false);
            setPrecioEntrada('');
            Alert.alert("evento creado correctamente")
            navigation.navigate("Main");
        } catch (error) {
            console.error('Error al crear el evento:', error);
        }
    };

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const { id } = JSON.parse(userData);
                setId(id);
                console.log("El ID del usuario es " + id);
            }
        } catch (error) {
            console.error('Error al cargar los datos del usuario:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Crear Evento</Text>
                <TextInput
                    placeholder="Nombre de la Sala"
                    value={nombreSala}
                    onChangeText={setNombreSala}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Edad Mínima del Evento"
                    value={edadMinEvento}
                    onChangeText={setEdadMinEvento}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TextInput
                    placeholder="Edad Máxima del Evento"
                    value={edadMaxEvento}
                    onChangeText={setEdadMaxEvento}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TextInput
                    placeholder="Localización"
                    value={localizacion}
                    onChangeText={setLocalizacion}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Temática del Evento"
                    value={tematicaEvento}
                    onChangeText={setTematicaEvento}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Descripción del Evento"
                    value={descripcionEnvento}
                    onChangeText={setDescripcionEnvento}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Localización del Evento"
                    value={localizacionEvento}
                    onChangeText={setLocalizacionEvento}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Cantidad de Asistentes"
                    value={cantidadAsistentes}
                    onChangeText={setCantidadAsistentes}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TextInput
                    placeholder="Fecha del Evento (YYYY-MM-DD)"
                    value={fechaEvento}
                    onChangeText={setFechaEvento}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Nombre de la Empresa Organizadora"
                    value={nombreEmpEvento}
                    onChangeText={setNombreEmpEvento}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Links de Referencia"
                    value={linksDeReferencia}
                    onChangeText={setLinksDeReferencia}
                    style={styles.input}
                />
                <View style={styles.checkboxContainer}>
                    <Text>¿Requiere comprar entradas?</Text>
                    <Button title={requiereCompraEntradas ? 'Sí' : 'No'} onPress={() => setRequiereCompraEntradas(!requiereCompraEntradas)} />
                </View>
                {requiereCompraEntradas && (
                    <TextInput
                        placeholder="Precio de la Entrada"
                        value={precioEntrada}
                        onChangeText={setPrecioEntrada}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                )}
                <Button title="Seleccionar Imagen" onPress={pickImage} />
                {!imageSelected && <Text style={styles.text}>Si no quieres seleccionar una imagen ahora, podrás elegir una imagen en la configuración de perfil del usuario</Text>}
                {imageSelected && <Text style={styles.text}>Imagen seleccionada</Text>}
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <Button title="Confirmar Ajustes" onPress={handleCreateEvent} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default CreateRoomScreen;

