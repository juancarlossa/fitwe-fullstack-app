import { useAuth } from '@/context/auth-context';
import {
    Activity,
    ChevronRight,
    Clock,
    Flame,
    Footprints,
    Zap
} from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlusButton } from './plus-button';

const { width } = Dimensions.get('window');

const StatCircle = ({ icon: Icon, value, label, progress = 0.7 }) => (
    <View style={styles.statCircleContainer}>
        <View style={styles.circleWrapper}>
            {/* Background Circle */}
            <View style={styles.circleBg} />
            {/* Progress Circle (Mocked with border for simple RN implementation) */}
            <View style={[styles.circleProgress, { borderTopColor: '#00a8cc' }]} />
            <View style={styles.circleInner}>
                <Icon size={20} color="#00a8cc" />
            </View>
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const MetricCard = ({ icon: Icon, title, value, unit, children }) => (
    <View style={styles.metricCard}>
        <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>{title}</Text>
        </View>
        <View style={styles.metricBody}>
            <Text style={styles.metricValue}>
                {value} <Text style={styles.metricUnit}>{unit}</Text>
            </Text>
            {children}
        </View>
    </View>
);

const WorkoutItem = ({ icon: Icon, title, time, duration }) => (
    <TouchableOpacity style={styles.workoutItem}>
        <View style={styles.workoutIconContainer}>
            <Icon size={20} color="#00a8cc" />
        </View>
        <View style={styles.workoutInfo}>
            <Text style={styles.workoutTitle}>{title}</Text>
            <Text style={styles.workoutTime}>{time}</Text>
        </View>
        <View style={styles.workoutMeta}>
            <Text style={styles.workoutDuration}>{duration}</Text>
            <ChevronRight size={18} color="#4b5563" />
        </View>
    </TouchableOpacity>
);

export default function DashboardFitWe() {
    const { user, loading } = useAuth();
    if (loading) return null;
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.greeting}>Hola, {user?.name || 'Usuario'}!</Text>
                    <Text style={styles.subGreeting}>Ready for your evening yoga session?</Text>
                </View>

                {/* Next Class Card */}
                <View style={styles.nextClassCard}>
                    <View style={styles.nextClassInfo}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>NEXT CLASS</Text>
                        </View>
                        <Text style={styles.className}>Vinyasa Yoga</Text>
                        <View style={styles.classTimeContainer}>
                            <Clock size={16} color="#9ca3af" />
                            <Text style={styles.classTime}>6:00 PM - 7:00 PM</Text>
                        </View>
                        <TouchableOpacity style={styles.joinButton}>
                            <Text style={styles.joinButtonText}>Join Meeting</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.classIllustration}>
                        {/* Simple Yoga Silhouette Placeholder */}
                        <Activity size={80} color="#1f2937" strokeWidth={1} />
                    </View>
                </View>

                {/* Activity Circles */}
                <View style={styles.activityCirclesRow}>
                    <StatCircle icon={Footprints} value="8,432" label="STEPS" />
                    <StatCircle icon={Flame} value="450" label="KCAL" />
                    <StatCircle icon={Clock} value="45m" label="MINS" />
                </View>

                {/* Two-Column Metrics */}
                <View style={styles.metricsGrid}>
                    <MetricCard icon={Zap} title="HEART RATE" value="72" unit="BPM">
                        <View style={styles.heartGraph}>
                            {/* Mock Graph Path */}
                            <View style={styles.graphLine} />
                        </View>
                    </MetricCard>
                    <MetricCard icon={Activity} title="WATER INTAKE" value="1.8" unit="Liters">
                        <View style={styles.waterProgress}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <View
                                    key={i}
                                    style={[styles.waterDrop, i <= 3 ? styles.waterDropActive : styles.waterDropInactive]}
                                />
                            ))}
                        </View>
                    </MetricCard>
                </View>

                {/* Upcoming Workouts */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Upcoming Workouts</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                <WorkoutItem
                    icon={Zap}
                    title="Hypertrophy Chest"
                    time="Tomorrow, 08:30 AM"
                    duration="45 min"
                />
                <WorkoutItem
                    icon={Footprints}
                    title="Morning Cardio"
                    time="Wednesday, 07:00 AM"
                    duration="30 min"
                />

                {/* Promo Card */}
                <View style={styles.promoCard}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' }}
                        style={styles.promoImage}
                    />
                    <View style={styles.promoOverlay}>
                        <Text style={styles.promoTitle}>Level up your game.</Text>
                        <Text style={styles.promoSubtitle}>Check out the new HIIT plans available this week.</Text>
                        <View style={styles.promoProgressContainer}>
                            <View style={[styles.promoProgressBar, { width: '60%' }]} />
                        </View>
                    </View>
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Floating Action Button */}
            <PlusButton onPress={() => console.log('New routine pressed')} />

        </SafeAreaView>
    );
};

// Placeholder icons since User/CreditCard weren't in initial imports
const User = (props: any) => <Activity {...props} />;
const CreditCard = (props: any) => <Zap {...props} />;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0e14', // surface-container-lowest
    },
    header: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: '#10141a',
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00a8cc',
        letterSpacing: -0.5,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerButton: {
        padding: 4,
    },
    profileAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#353940',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    welcomeSection: {
        marginTop: 24,
        marginBottom: 20,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    subGreeting: {
        fontSize: 16,
        color: '#9ca3af',
        marginTop: 4,
    },
    nextClassCard: {
        backgroundColor: '#181c22', // surface-container-low
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        overflow: 'hidden',
        marginBottom: 24,
    },
    nextClassInfo: {
        flex: 1,
        zIndex: 1,
    },
    badge: {
        backgroundColor: 'rgba(0, 168, 204, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    badgeText: {
        color: '#00a8cc',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    className: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    classTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    classTime: {
        color: '#9ca3af',
        fontSize: 14,
    },
    joinButton: {
        backgroundColor: '#00a8cc',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    joinButtonText: {
        color: '#0a0e14',
        fontWeight: 'bold',
        fontSize: 14,
    },
    classIllustration: {
        position: 'absolute',
        right: -10,
        bottom: 20,
        opacity: 0.3,
    },
    activityCirclesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCircleContainer: {
        alignItems: 'center',
        width: width * 0.25,
    },
    circleWrapper: {
        width: 64,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    circleBg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 32,
        borderWidth: 4,
        borderColor: '#1f242d',
    },
    circleProgress: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 32,
        borderWidth: 4,
        borderColor: 'transparent',
        transform: [{ rotate: '45deg' }],
    },
    circleInner: {
        width: 48,
        height: 48,
        backgroundColor: '#181c22',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    statLabel: {
        fontSize: 10,
        color: '#9ca3af',
        marginTop: 2,
        letterSpacing: 0.5,
    },
    metricsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#181c22',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#353940',
    },
    metricTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9ca3af',
        marginBottom: 12,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    metricUnit: {
        fontSize: 14,
        color: '#9ca3af',
        fontWeight: 'normal',
    },
    heartGraph: {
        height: 30,
        marginTop: 12,
        justifyContent: 'center',
    },
    graphLine: {
        height: 2,
        backgroundColor: '#00a8cc',
        opacity: 0.5,
    },
    waterProgress: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 16,
    },
    waterDrop: {
        flex: 1,
        height: 6,
        borderRadius: 3,
    },
    waterDropActive: {
        backgroundColor: '#00a8cc',
    },
    waterDropInactive: {
        backgroundColor: '#1f242d',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    viewAllText: {
        color: '#00a8cc',
        fontSize: 14,
    },
    workoutItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#181c22',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    workoutIconContainer: {
        width: 44,
        height: 44,
        backgroundColor: '#1f242d',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    workoutInfo: {
        flex: 1,
    },
    workoutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    workoutTime: {
        fontSize: 13,
        color: '#9ca3af',
        marginTop: 2,
    },
    workoutMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    workoutDuration: {
        fontSize: 13,
        color: '#9ca3af',
    },
    promoCard: {
        height: 180,
        borderRadius: 24,
        overflow: 'hidden',
        marginTop: 16,
        position: 'relative',
    },
    promoImage: {
        width: '100%',
        height: '100%',
    },
    promoOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 14, 20, 0.7)',
        padding: 24,
        justifyContent: 'flex-end',
    },
    promoTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    promoSubtitle: {
        fontSize: 14,
        color: '#d1d5db',
        marginTop: 4,
        marginBottom: 16,
    },
    promoProgressContainer: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
    },
    promoProgressBar: {
        height: '100%',
        backgroundColor: '#00a8cc',
        borderRadius: 2,
    },

});


