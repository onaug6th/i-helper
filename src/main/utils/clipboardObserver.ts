import { clipboard, NativeImage } from 'electron';

interface Options {
  duration?: number;
  textChange?: (value: string) => void;
  imageChange?: (value: NativeImage) => void;
}

class ClipboardObserver {
  timer: NodeJS.Timeout;
  beforeText: string;
  beforeImage: NativeImage;

  duration = 500;
  textChange: (text: string, brforeText: string) => void;
  imageChange: (image: NativeImage, beforeImage: NativeImage) => void;

  constructor(options: Options) {
    const { duration, textChange, imageChange } = options;

    this.duration = duration;
    this.textChange = textChange;
    this.imageChange = imageChange;

    if (this.textChange || this.imageChange) {
      this.start();
    }
  }

  /**
   * 设置定时器
   */
  setTimer(): void {
    this.timer = setInterval(() => {
      if (this.textChange) {
        const text = clipboard.readText();
        if (this.isDiffText(this.beforeText, text)) {
          this.textChange(text, this.beforeText);
          this.beforeText = text;
        }
      }

      if (this.imageChange) {
        const image = clipboard.readImage();
        if (this.isDiffImage(this.beforeImage, image)) {
          this.imageChange(image, this.beforeImage);
          this.beforeImage = image;
        }
      }
    }, this.duration);
  }

  /**
   * 清除定时器
   */
  clearTimer(): void {
    clearInterval(this.timer);
  }

  /**
   * 设置剪贴板默认内容
   */
  setClipboardDefaultValue(): void {
    if (this.textChange) {
      this.beforeText = clipboard.readText();
    }
    if (this.imageChange) {
      this.beforeImage = clipboard.readImage();
    }
  }

  /**
   * 判断内容是否不一致
   * @param beforeText
   * @param afterText
   * @returns
   */
  isDiffText(beforeText: string, afterText: string): boolean {
    return afterText && beforeText !== afterText;
  }

  /**
   * 判断图片是否不一致
   * @param beforeImage
   * @param afterImage
   * @returns
   */
  isDiffImage(beforeImage: NativeImage, afterImage: NativeImage): boolean {
    return afterImage && !afterImage.isEmpty() && beforeImage.toDataURL() !== afterImage.toDataURL();
  }

  /**
   * 开始
   */
  start(): void {
    this.setClipboardDefaultValue();
    this.setTimer();
  }

  /**
   * 暂停
   */
  stop(): void {
    this.clearTimer();
  }
}

export default ClipboardObserver;
