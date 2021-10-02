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
  //  是商店且下载过
  const isStoreAndDownloaded = computed(() => {
    return isStore && plugin.value.isDownload;
  });

  //  展示更新按钮
  const showUpdate = computed(() => {
    return (isStoreAndDownloaded.value || isInstalled) && plugin.value.canUpdate;
  });

  //  展示启动按钮
  const showOpen = computed(() => {
    return isStoreAndDownloaded.value || isInstalled || isDev;
  });

  //  展示删除按钮
  const showDelete = computed(() => {
    return isDev || isInstalled || isStoreAndDownloaded.value;
  });

  //  展示下载按钮
  const showDownload = computed(() => {
    return isStore && !plugin.value.isDownload;
  });

  //  正在审核
  const isInReview = computed(() => {
    return plugin.value.reviewStatus === ReviewStatus.pending;
  });

  //  展示审核内容
  const showReviewContent = computed(() => {
    return plugin.value.reviewStatus === ReviewStatus.fail;
  });

  //  展示设置按钮
  const showSetting = computed(() => {
    return isInstalled || isStoreAndDownloaded.value;
  });

  return {
    showUpdate,
    showOpen,
    showDelete,
    showSetting,
    showDownload,
    isInReview,
    showReviewContent
  };
}
