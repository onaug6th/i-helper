import { computed, ComputedRef } from 'vue';

enum ReviewStatus {
  pending,
  success,
  fail
}

export default function useButton(
  { isStore, isInstalled, isDev }: { [propName: string]: boolean },
  plugin: ComputedRef<any>
): { [propName: string]: ComputedRef } {
  const showUpdate = computed(() => {
    return ((isStore && plugin.value.isDownload) || isInstalled) && plugin.value.canUpdate;
  });

  const showOpen = computed(() => {
    return (isStore && plugin.value.isDownload) || isInstalled || isDev;
  });

  const showDelete = computed(() => {
    return isDev || isInstalled;
  });

  const isInReview = computed(() => {
    return plugin.value.reviewStatus === ReviewStatus.pending;
  });

  return {
    showUpdate,
    showOpen,
    showDelete,
    isInReview
  };
}
