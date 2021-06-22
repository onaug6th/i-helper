import { computed, ComputedRef } from 'vue';

export default function useButton(
  { isStore, isInstalled, isDev }: { [propName: string]: boolean },
  plugin: ComputedRef<any>
): { [propName: string]: ComputedRef } {
  const canUpdate = computed(() => {
    return plugin.value.isDownload && plugin.value.version > plugin.value.isDownloadVersion;
  });

  const showUpdate = computed(() => {
    return ((isStore && plugin.value.isDownload) || isInstalled) && canUpdate.value;
  });

  const showOpen = computed(() => {
    return (isStore && plugin.value.isDownload) || isInstalled || isDev;
  });

  const showDelete = computed(() => {
    return isDev || isInstalled;
  });

  return {
    showUpdate,
    showOpen,
    showDelete
  };
}
