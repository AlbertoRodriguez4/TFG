import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlanBusiness = () => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpDate, setCardExpDate] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paypalPassword, setPaypalPassword] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { id } = JSON.parse(userData);
        setId(id);
        console.log("El id del usuario es: " + id);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  };

  const handleCardPayment = () => {
    setSelectedPaymentMethod('card');
  };

  const handlePaypalPayment = () => {
    setSelectedPaymentMethod('paypal');
  };

  const handlePayment = async () => {
    setLoading(true);
    if (selectedPaymentMethod === 'card') {
      await makeCardPayment();
    } else if (selectedPaymentMethod === 'paypal') {
      await makePaypalPayment();
    }
    setLoading(false);
  };

  const makeCardPayment = async () => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/usuarios/${id}/plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'Business',
        }),
      });
      const paymentData = await response.json();
      // TODO: handle payment response
      Alert.alert('Pago realizado correctamente');
    } catch (error) {
      console.error('Error al realizar el pago con tarjeta de crédito:', error);
    }
  };

  const makePaypalPayment = async () => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/usuarios/${id}/plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'Business',
        }),
      });
      const paymentData = await response.json();
      // TODO: handle payment response
      Alert.alert('Pago realizado correctamente');
    } catch (error) {
      console.error('Error al realizar el pago con PayPal:', error);
    }
  };

  let paymentForm = null;
  if (selectedPaymentMethod === 'card') {
    paymentForm = (
      <View>
        <TextInput
          style={styles.input}
          placeholder="Número de tarjeta"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre en la tarjeta"
          value={cardName}
          onChangeText={setCardName}
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de expiración (MM/YY)"
          value={cardExpDate}
          onChangeText={setCardExpDate}
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          value={cardCvv}
          onChangeText={setCardCvv}
        />
      </View>
    );
  } else if (selectedPaymentMethod === 'paypal') {
    paymentForm = (
      <View>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={paypalEmail}
          onChangeText={setPaypalEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={paypalPassword}
          onChangeText={setPaypalPassword}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Plan Business</Text>
      <Text style={styles.description}>
        Obtén acceso a funciones exclusivas con nuestro Plan Business. Obtén herramientas avanzadas para hacer crecer tu negocio.
      </Text>
      <View style={styles.paymentOptions}>
        <TouchableOpacity style={styles.paymentOption} onPress={handleCardPayment} disabled={loading}>
          <Image source={require('../assets/credit-card.png')} style={styles.paymentIcon} />
          <Text style={styles.paymentText}>Pagar con tarjeta de crédito</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption} onPress={handlePaypalPayment} disabled={loading}>
          <Image source={require('../assets/paypal.png')} style={styles.paymentIcon} />
          <Text style={styles.paymentText}>Pagar con PayPal</Text>
        </TouchableOpacity>
      </View>
      {paymentForm}
      {selectedPaymentMethod && (
        <TouchableOpacity style={styles.paymentButton} onPress={handlePayment} disabled={loading}>
          <Text style={styles.paymentButtonText}>Pagar</Text>
        </TouchableOpacity>
      )}
      {loading && <Text style={styles.loading}>Realizando pago...</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  paymentOption: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    width: '45%',
  },
  paymentIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  paymentText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  paymentButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  paymentButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
});

export default PlanBusiness;
