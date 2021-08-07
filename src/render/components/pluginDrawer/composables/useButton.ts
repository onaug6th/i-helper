import { computed, ComputedRef } from 'vue';

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
    return plugin.value.reviewStatus === 0;
  });

  return {
    showUpdate,
    showOpen,
    showDelete,
    isInReview
  };
}
