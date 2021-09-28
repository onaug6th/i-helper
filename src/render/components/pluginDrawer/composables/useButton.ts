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
  const isStoreAndDownload = computed(() => {
    return isStore && plugin.value.isDownload;
  });

  const showUpdate = computed(() => {
    return (isStoreAndDownload.value || isInstalled) && plugin.value.canUpdate;
  });

  const showOpen = computed(() => {
    return isStoreAndDownload.value || isInstalled || isDev;
  });

  const showDelete = computed(() => {
    return isDev || isInstalled || isStoreAndDownload.value;
  });

  const isInReview = computed(() => {
    return plugin.value.reviewStatus === ReviewStatus.pending;
  });

  const showSetting = computed(() => {
    return isInstalled || isStoreAndDownload.value;
  });

  return {
    showUpdate,
    showOpen,
    showDelete,
    showSetting,
    isInReview
  };
}
