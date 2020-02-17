// Main types for this API
export enum StatusBarStyle {
  Dark = 'DARK',
  Light = 'LIGHT'
}

export const StatusBar = {
  getEngine() {
    const win = (window as any);
    return (win.StatusBar) || (win.Capacitor && win.Capacitor.Plugins.StatusBar);
  },
  available() {
    return !!this.getEngine();
  },
  isCordova() {
    return !!(window as any).StatusBar;
  },
  isCapacitor() {
    const win = (window as any);
    return !!win.Capacitor;
  },
  async getInfo() {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    if (this.isCapacitor()) {
      return engine.getInfo();
    } else {
      return {};
    }
  },
  async hide() {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    await engine.hide();
  },
  async show() {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    await engine.show();
  },
  async setBackgroundColor(color: string) {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    if (this.isCapacitor()) {
      return engine.setBackgroundColor({ color });
    } else {
      const isHex = color[0] === '#';
      return (isHex) ? engine.backgroundColorByHexString(color) : engine.backgroundColorByName(color);
    }
  },
  async setStyle(style: StatusBarStyle) {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    if (this.isCapacitor()) {
      return engine.setStyle({ style });
    } else {
      return (style === StatusBarStyle.Dark) ? engine.styleDefault() : engine.styleLightContent();
    }
  }
};
