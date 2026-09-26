import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import type { Notification } from '@/core/types';
import { useNotifications } from '@/hooks/useData';
import { dataClient } from '@/services/client';
import { colors, font, space } from '@/theme/tokens';
import { formatDate } from '@/utils/format';

export default function NotificationsScreen() {
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  const markRead = useMutation({
    mutationFn: (id: string) => dataClient.markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  if (notifications.isError) {
    return (
      <Screen>
        <EmptyState
          title="Не удалось загрузить уведомления"
          actionLabel="Повторить"
          onAction={() => notifications.refetch()}
        />
      </Screen>
    );
  }

  if (!notifications.data) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  const items = [...notifications.data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const renderItem = ({ item }: { item: Notification }) => {
    const unread = !item.readAt;
    return (
      <Pressable
        style={styles.row}
        onPress={() => unread && markRead.mutate(item.id)}
        disabled={!unread}
      >
        {unread ? <View style={styles.dot} /> : <View style={styles.dotPlaceholder} />}
        <View style={styles.rowBody}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.rowMessage}>{item.message}</Text>
          <Text style={styles.rowDate}>{formatDate(item.createdAt)}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={notifications.isFetching}
            onRefresh={() => notifications.refetch()}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={<EmptyState title="Уведомлений пока нет" />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: space.lg,
    gap: space.sm,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    gap: space.sm,
    padding: space.md,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
  },
  dot: {
    marginTop: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dotPlaceholder: {
    width: 8,
  },
  rowBody: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    color: colors.text,
    fontFamily: font.sansSemiBold,
    fontSize: 14,
  },
  rowMessage: {
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  rowDate: {
    color: colors.muted,
    fontFamily: font.mono,
    fontSize: 10,
    marginTop: 2,
  },
});
