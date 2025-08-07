// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     ActivityIndicator,
//     SafeAreaView,
//     Modal,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { register } from '../services/authService';

// const RegisterScreen = () => {
//     const router = useRouter();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [modalTitle, setModalTitle] = useState('');
//     const [modalMessage, setModalMessage] = useState('');

//     const handleRegister = async () => {
//         setIsLoading(true);
//         try {
//             await register(email, password);
//             setModalTitle('Success');
//             setModalMessage('Registration successful! Redirecting to login.');
//             setModalVisible(true);
//             setTimeout(() => {
//                 setModalVisible(false);
//                 router.replace('/login');
//             }, 1500); // Redirect after a short delay
//         } catch (error) {
//             let message = '';
//             switch (error.code) {
//                 case 'auth/invalid-email':
//                     message = 'The email address is not valid. Please check your email.';
//                     break;
//                 case 'auth/email-already-in-use':
//                     message = 'This email is already in use. Please use a different one.';
//                     break;
//                 case 'auth/weak-password':
//                     message = 'The password is too weak. Please use at least 6 characters.';
//                     break;
//                 case 'auth/network-request-failed':
//                     message = 'A network error occurred. Please check your connection.';
//                     break;
//                 default:
//                     message = 'Registration failed. Please try again.';
//                     break;
//             }
//             setModalTitle('Registration Failed');
//             setModalMessage(message);
//             setModalVisible(true);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const closeModal = () => {
//         setModalVisible(false);
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.contentContainer}>
//                 <Text style={styles.title}>Create Account</Text>
//                 <TextInput
//                     placeholder="Email"
//                     placeholderTextColor="#888"
//                     onChangeText={setEmail}
//                     value={email}
//                     style={styles.input}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                 />
//                 <TextInput
//                     placeholder="Password"
//                     placeholderTextColor="#888"
//                     secureTextEntry
//                     onChangeText={setPassword}
//                     value={password}
//                     style={styles.input}
//                 />
//                 <TouchableOpacity
//                     style={styles.registerButton}
//                     onPress={handleRegister}
//                     disabled={isLoading}>
//                     {isLoading ? (
//                         <ActivityIndicator color="#fff" />
//                     ) : (
//                         <Text style={styles.buttonText}>Register</Text>
//                     )}
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginLink}>
//                     <Text style={styles.loginText}>
//                         Already have an account? <Text style={styles.linkText}>Login</Text>
//                     </Text>
//                 </TouchableOpacity>
//             </View>

//             <Modal
//                 animationType="fade"
//                 transparent={true}
//                 visible={modalVisible}
//                 onRequestClose={closeModal}>
//                 <View style={styles.centeredView}>
//                     <View style={styles.modalView}>
//                         <Text style={styles.modalTitle}>{modalTitle}</Text>
//                         <Text style={styles.modalMessage}>{modalMessage}</Text>
//                         <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
//                             <Text style={styles.buttonText}>OK</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         </SafeAreaView>
//     );
// };


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: '#f5f7fa',
//     },
//     contentContainer: {
//         padding: 24,
//     },
//     title: {
//         fontSize: 32,
//         fontWeight: 'bold',
//         marginBottom: 40,
//         textAlign: 'center',
//         color: '#1a1a1a',
//     },
//     input: {
//         height: 50,
//         backgroundColor: '#fff',
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 12,
//         paddingHorizontal: 16,
//         fontSize: 16,
//         color: '#1a1a1a',
//         marginBottom: 16,
//     },
//     registerButton: {
//         backgroundColor: '#007bff',
//         borderRadius: 12,
//         height: 50,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 5,
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     loginLink: {
//         marginTop: 24,
//         alignSelf: 'center',
//     },
//     loginText: {
//         fontSize: 14,
//         color: '#666',
//     },
//     linkText: {
//         color: '#007bff',
//         fontWeight: 'bold',
//     },
//     centeredView: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.4)',
//     },
//     modalView: {
//         margin: 20,
//         backgroundColor: 'white',
//         borderRadius: 20,
//         padding: 35,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     modalTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 15,
//         textAlign: 'center',
//         color: '#1a1a1a',
//     },
//     modalMessage: {
//         marginBottom: 20,
//         textAlign: 'center',
//         fontSize: 16,
//         color: '#666',
//     },
//     modalButton: {
//         backgroundColor: '#007bff',
//         borderRadius: 10,
//         padding: 12,
//         elevation: 2,
//         minWidth: 120,
//         alignItems: 'center',
//     },
// });

// export default RegisterScreen;






import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    Modal,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { register } from '../services/authService';

const RegisterScreen = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const handleRegister = async () => {
        setIsLoading(true);
        try {
            await register(email, password);
            setModalTitle('Success');
            setModalMessage('Registration successful! Redirecting to login.');
            setModalVisible(true);
            setTimeout(() => {
                setModalVisible(false);
                router.replace('/login');
            }, 1500);
        } catch (error) {
            let message = '';
            switch (error.code) {
                case 'auth/invalid-email':
                    message = 'The email address is not valid. Please check your email.';
                    break;
                case 'auth/email-already-in-use':
                    message = 'This email is already in use. Please use a different one.';
                    break;
                case 'auth/weak-password':
                    message = 'The password is too weak. Please use at least 6 characters.';
                    break;
                case 'auth/network-request-failed':
                    message = 'A network error occurred. Please check your connection.';
                    break;
                default:
                    message = 'Registration failed. Please try again.';
                    break;
            }
            setModalTitle('Registration Failed');
            setModalMessage(message);
            setModalVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Create Account</Text>

                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#888"
                    onChangeText={setEmail}
                    value={email}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.passwordInputWrapper}>
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#888"
                        secureTextEntry={!isPasswordVisible}
                        onChangeText={setPassword}
                        value={password}
                        style={styles.passwordInput}
                    />
                    <TouchableOpacity
                        style={styles.eyeIconContainer}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        {isPasswordVisible ? (
                            <Eye size={24} color="#888" />
                        ) : (
                            <EyeOff size={24} color="#888" />
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Register</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/login')}
                    style={styles.loginLink}
                >
                    <Text style={styles.loginText}>
                        Already have an account?{' '}
                        <Text style={styles.linkText}>Login</Text>
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>{modalTitle}</Text>
                        <Text style={styles.modalMessage}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f5f7fa',
    },
    contentContainer: {
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#1a1a1a',
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1a1a1a',
        marginBottom: 16,
    },
    passwordInputWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
    passwordInput: {
        height: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingRight: 45, // space for eye icon
        fontSize: 16,
        color: '#1a1a1a',
    },
    eyeIconContainer: {
        position: 'absolute',
        right: 12,
        top: 12,
        padding: 4,
    },
    registerButton: {
        backgroundColor: '#007bff',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 24,
        alignSelf: 'center',
    },
    loginText: {
        fontSize: 14,
        color: '#666',
    },
    linkText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#1a1a1a',
    },
    modalMessage: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
    modalButton: {
        backgroundColor: '#007bff',
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        minWidth: 120,
        alignItems: 'center',
    },
});

export default RegisterScreen;
