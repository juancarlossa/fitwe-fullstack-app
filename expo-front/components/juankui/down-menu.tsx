import { Activity, Clock, CreditCard, User } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function DownMenu() {
    return (

        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItemActive}>
                <View style={styles.activeIndicator}>
                    <Activity size={20} color="#000" />
                </View>
                <Text style={styles.navLabelActive}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
                <Clock size={20} color="#9ca3af" />
                <Text style={styles.navLabel}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
                <CreditCard size={20} color="#9ca3af" />
                <Text style={styles.navLabel}>Plans</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
                <User size={20} color="#9ca3af" />
                <Text style={styles.navLabel}>Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#181c22',
        borderTopWidth: 1,
        borderTopColor: '#353940',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        paddingBottom: 5,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navItemActive: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIndicator: {
        backgroundColor: '#00a8cc',
        width: 48,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    navLabel: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 4,
    },
    navLabelActive: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ffffff',
    },
})
