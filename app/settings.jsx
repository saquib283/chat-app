import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile, updateEmail } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db, storage } from '../services/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function SettingsScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            const user = auth.currentUser;
            if (!user) return;

            setEmail(user.email);

            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUsername(data.username || '');
                setAvatar(data.avatar || null);
            }
        };

        loadUserData();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            const selectedAsset = result.assets[0];
            await uploadAvatar(selectedAsset.uri);
        }
    };

    const uploadAvatar = async (uri) => {
        const user = auth.currentUser;
        const response = await fetch(uri);
        const blob = await response.blob();

        const avatarRef = ref(storage, `avatars/${user.uid}.jpg`);
        await uploadBytes(avatarRef, blob);

        const downloadURL = await getDownloadURL(avatarRef);
        setAvatar(downloadURL);
    };

    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            setLoading(true);

            // Update Firebase Auth email
            if (email !== user.email) {
                await updateEmail(user, email);
            }

            // Update Auth profile
            await updateProfile(user, {
                displayName: username,
                photoURL: avatar,
            });

            // Update Firestore user doc
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, {
                username,
                email,
                avatar,
            });

            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                position: 'bottom',
            });
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: error.message,
                position: 'bottom',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <Text style={styles.title}>Edit Profile</Text>

                <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
                    {avatar ? (
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>+</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
        textAlign: 'center',
    },
    avatarWrapper: {
        alignSelf: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 40,
        color: '#888',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#fafafa',
    },
    saveButton: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
