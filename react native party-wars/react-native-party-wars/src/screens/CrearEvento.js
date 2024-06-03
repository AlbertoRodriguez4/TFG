import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

const CreateEventScreen = () => {
    const [nombreSala, setNombreSala] = useState('');
    const [edadMinEvento, setEdadMinEvento] = useState('');
    const [edadMaxEvento, setEdadMaxEvento] = useState('');
    const [localizacion, setLocalizacion] = useState('');
    const [tematicaEvento, setTematicaEvento] = useState('');
    const [descripcionEnvento, setDescripcionEnvento] = useState('');
    const [localizacionEvento, setLocalizacionEvento] = useState('');
    const [cantidadAsistentes, setCantidadAsistentes] = useState('');
    const [fechaEvento, setFechaEvento] = useState(new Date());
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
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const requestMediaLibraryPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso necesario', 'Se requiere permiso para acceder a la biblioteca de fotos.', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
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
            setFechaEvento(new Date());
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

    const onChangeFecha = (event, selectedDate) => {
        const currentDate = selectedDate || fechaEvento;
        setShowPicker(false);
        setFechaEvento(currentDate);
        console.log(selectedDate, currentDate);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.topSection}>
                    <Text style={styles.title}>Configurar <Text style={styles.titleBold}>Evento</Text></Text>
                </View>

                <LinearGradient
                    colors={['#FFDE59', '#FF914D']}
                    style={styles.bottomSection}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Image source={require('../assets/mono-premium.jpeg')} style={styles.image} />

                    <TextInput
                        placeholder="Nombre de la Sala"
                        placeholderTextColor="#ffffff"
                        value={nombreSala}
                        onChangeText={setNombreSala}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Edad Mínima del Evento"
                        placeholderTextColor="#ffffff"
                        value={edadMinEvento}
                        onChangeText={setEdadMinEvento}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Edad Máxima del Evento"
                        placeholderTextColor="#ffffff"
                        value={edadMaxEvento}
                        onChangeText={setEdadMaxEvento}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Localización"
                        placeholderTextColor="#ffffff"
                        value={localizacion}
                        onChangeText={setLocalizacion}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Temática del Evento"
                        placeholderTextColor="#ffffff"
                        value={tematicaEvento}
                        onChangeText={setTematicaEvento}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Descripción del Evento"
                        placeholderTextColor="#ffffff"
                        value={descripcionEnvento}
                        onChangeText={setDescripcionEnvento}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Localización del Evento"
                        placeholderTextColor="#ffffff"
                        value={localizacionEvento}
                        onChangeText={setLocalizacionEvento}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Cantidad de Asistentes"
                        placeholderTextColor="#ffffff"
                        value={cantidadAsistentes}
                        onChangeText={setCantidadAsistentes}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateInput}>
                        <Text style={styles.dateText}>{fechaEvento.toLocaleString()}</Text>
                    </TouchableOpacity>
                    {showPicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={fechaEvento}
                            mode="datetime"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeFecha}
                        />
                    )}
                    <TextInput
                        placeholder="Nombre de la Empresa Organizadora"
                        placeholderTextColor="#ffffff"
                        value={nombreEmpEvento}
                        onChangeText={setNombreEmpEvento}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Links de Referencia"
                        placeholderTextColor="#ffffff"
                        value={linksDeReferencia}
                        onChangeText={setLinksDeReferencia}
                        style={styles.input}
                    />
                    <View style={styles.checkboxContainer}>
                        <Text style={styles.checkboxText}>¿Requiere comprar entradas?</Text>
                        <Button title={requiereCompraEntradas ? 'Sí' : 'No'} onPress={() => setRequiereCompraEntradas(!requiereCompraEntradas)} />
                    </View>
                    {requiereCompraEntradas && (
                        <TextInput
                            placeholder="Precio de la Entrada"
                            placeholderTextColor="#ffffff"
                            value={precioEntrada}
                            onChangeText={setPrecioEntrada}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    )}
                    <TouchableOpacity onPress={pickImage} style={styles.buttonContainer}>
                        <LinearGradient
                            colors={['#313131', '#313131']}
                            style={styles.button}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.buttonText}>{imageSelected ? 'Cambiar Imagen' : 'Subir Imagen'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}
                    <TouchableOpacity style={styles.buttonContainer} onPress={handleCreateEvent}>
                        <LinearGradient
                            colors={['#313131', '#313131']}
                            style={styles.button}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.buttonText}>Guardar Evento</Text>
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
        width: 150,
        height: 150,
        borderColor: '#ffffff',
        borderWidth: 2,
        marginVertical: 10,
        borderRadius: 15,
        top : -100,
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
        fontSize: 17
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        marginVertical: 10,
    },
    checkboxText: {
        color: '#ffffff',
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
    uploadedImage: {
        width: 200,
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
});

export default CreateEventScreen;