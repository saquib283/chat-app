import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, ChevronRight, Settings } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
} from 'firebase/firestore';

import { db } from '../services/firebaseConfig';
import { auth, logout, getAllUsers } from '../services/authService';

export default function HomeScreen() {
    const router = useRouter();
    const [allUsers, setAllUsers] = useState([]);
    const [recentChats, setRecentChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Get the current user from the auth service.
    const currentUser = auth.currentUser;

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const fetchedUsers = await getAllUsers();
            const otherUsers = fetchedUsers.filter(u => u.uid !== currentUser.uid);

            const chatsQuery = query(
                collection(db, 'chats'),
                where('participants', 'array-contains', currentUser.uid),
                orderBy('lastMessageAt', 'desc')
            );

            const unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
                const recentChatPartnerIds = new Set();
                snapshot.forEach(chatDoc => {
                    const chatData = chatDoc.data();
                    const partnerUid = chatData.participants.find(uid => uid !== currentUser.uid);
                    if (partnerUid) {
                        recentChatPartnerIds.add(partnerUid);
                    }
                });

                const recentChatUsers = otherUsers.filter(user => recentChatPartnerIds.has(user.uid));
                const filteredAllUsers = otherUsers.filter(user => !recentChatPartnerIds.has(user.uid));

                setRecentChats(recentChatUsers);
                setAllUsers(filteredAllUsers);
                setLoading(false);
            }, (error) => {
                console.error("onSnapshot error:", error);
                setLoading(false);
            });

            return () => unsubscribeChats();

        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Failed to load data.',
                text2: 'Please try again.',
                position: 'bottom',
            });
        }
    }, [currentUser]);

    useEffect(() => {
        let unsubscribe;
        // Check if `currentUser` is available before fetching data
        if (currentUser) {
            unsubscribe = fetchData();
        } else {
            // In this new architecture, this block should ideally not be hit,
            // as the `_layout` file would have already redirected the user.
            // It serves as a failsafe.
            setLoading(false);
        }
        return () => unsubscribe && unsubscribe();
    }, [currentUser, fetchData]);

    const onRefresh = async () => {
        setRefreshing(true);
        if (currentUser) {
            await fetchData();
        }
        setRefreshing(false);
    };

    const handleOpenChat = (user) => {
        router.push(`/chat/${user.uid}?email=${encodeURIComponent(user.email)}`);
    };

    const handleSettings = () => {
        router.push('/settings');
    };

    const handleLogout = async () => {
        try {
            await logout();
            Toast.show({ type: 'success', text1: 'Logged Out', position: 'bottom' });
            // The `_layout.jsx` listener will automatically handle the redirection to the login screen.
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Logout Failed', position: 'bottom' });
        }
    };

    const renderUserItem = ({ item }) => (
        <TouchableOpacity style={styles.userCard} onPress={() => handleOpenChat(item)}>
            <View style={styles.userAvatar}>
                {/* Fallback to first letter if no photoURL */}
                <Text style={styles.avatarText}>{item.email.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.userEmail}>{item.email}</Text>
            <ChevronRight size={24} color="#666" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={handleSettings} style={styles.iconButton}>
                        <Settings size={24} color="#007bff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
                        <LogOut size={24} color="#007bff" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.currentUserEmail}>{currentUser?.email}</Text>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>My Messages</Text>
                    {recentChats.length > 0 ? (
                        <FlatList
                            data={recentChats}
                            keyExtractor={(item) => item.uid}
                            renderItem={renderUserItem}
                            scrollEnabled={false}
                        />
                    ) : (
                        <Text style={styles.emptyListText}>No recent messages.</Text>
                    )}
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Users</Text>
                    <FlatList
                        data={allUsers}
                        keyExtractor={(item) => item.uid}
                        renderItem={renderUserItem}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
        padding: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        padding: 8,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '300',
        color: '#666',
    },
    currentUserEmail: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 24,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    userEmail: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    emptyListText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },
});