import { clipboard, NativeImage } from 'electron';

/**
 * 为不同文本
 * @param {*} beforeText
 * @param {*} afterText
 */
function isDiffText(beforeText: string, afterText: string) {
  return beforeText && afterText && beforeText !== afterText;
}

/**
 * 为不同图片
 * @param {*} beforeImage
 * @param {*} afterImage
 */
function isDiffImage(beforeImage: NativeImage, afterImage: NativeImage) {
  return afterImage && !afterImage.isEmpty() && beforeImage.toDataURL() !== afterImage.toDataURL();
}

const DEFAULT_OPTIONS = {
  duration: 500
};

interface Options {
  duration: number;
  textChange?: any;
  imageChange?: any;
}

/**
 * 传递配置，观察需要变化的剪贴板内容
 * @param {*} option
 */
function clipboardObserver(option = {}) {
  const options: Options = Object.assign({}, DEFAULT_OPTIONS, option);
  const { duration, textChange, imageChange } = options;
  let timer: any;

  if (textChange || imageChange) {
    let beforeText: string;
    let beforeImage: NativeImage;

    //  为了尽量少读取剪贴板
    if (textChange) {
      beforeText = clipboard.readText();
    }
    //  为了尽量少读取剪贴板
    if (imageChange) {
      beforeImage = clipboard.readImage();
    }

    timer = setInterval(() => {
      if (textChange) {
        const text = clipboard.readText();
        if (isDiffText(beforeText, text)) {
          textChange(text, beforeText);
          beforeText = text;
        }
      }

      if (imageChange) {
        const image = clipboard.readImage();
        if (isDiffImage(beforeImage, image)) {
          imageChange(image, beforeImage);
          beforeImage = image;
        }
      }
    }, duration);
  }

  return {
    destroy() {
      clearInterval(timer);
    }
  };
}

export default clipboardObserver;
