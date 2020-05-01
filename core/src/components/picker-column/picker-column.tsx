import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { PickerColumn } from '../../interface';

/**
 * @internal
 */
@Component({
  tag: 'ion-picker-column',
  styleUrls: {
    ios: 'picker-column.ios.scss',
    md: 'picker-column.md.scss'
  }
})
export class PickerColumnCmp implements ComponentInterface {
  private optsEl?: HTMLElement;
  private scrollEl?: HTMLElement;
  private selectedOpt?: HTMLElement;

  @Element() el!: HTMLElement;

  /**
   * Emitted when the selected value has changed
   * @internal
   */
  @Event() ionPickerColChange!: EventEmitter<PickerColumn>;

  @Prop() col!: PickerColumn;

  componentDidLoad() {
    const { col, optsEl, scrollEl } = this;
    if (!scrollEl || !optsEl || !col || col.selectedIndex === undefined) { return; }

    setTimeout(() => {
      const colBBox = this.el.getBoundingClientRect();
      const root = this.el.getRootNode() as any;

      const alignRight = this.el.classList.contains('picker-opts-right');
      const alignLeft = this.el.classList.contains('picker-opts-left');

      const y = colBBox.y + (colBBox.height / 2);
      let x = 0;
      if (alignRight) {
        x = colBBox.x + (colBBox.width - 15);
      } else if (alignLeft) {
        x = colBBox.x + 15;
      } else {
        x = colBBox.x + (colBBox.width / 2);
      }

      scrollEl.addEventListener('scroll', () => {
        const selectedElement = root.elementFromPoint(x, y);
        if (!selectedElement || !selectedElement.classList.contains('picker-opt')) { return; }
        this.selectOption(selectedElement);
      });
    }, 500);
    this.onOptionSelected(col.selectedIndex, false);
  }

  private getElementByIndex(index: number): HTMLElement | null {
    const { optsEl } = this;
    if (!optsEl) { return null; }

    const optionEls = optsEl.querySelectorAll('.picker-opt');
    return optionEls[index] as HTMLElement | null;
  }

  private scrollOptionIntoView(optionEl: HTMLElement, smooth = true) {
    optionEl.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'center'
    });
  }

  private onOptionSelected(index: number, smooth = true) {
    const selectedElement = this.getElementByIndex(index);
    if (!selectedElement) { return; }

    this.scrollOptionIntoView(selectedElement, smooth);
    this.selectOption(selectedElement);
  }

  private selectOption(optionEl: HTMLElement) {
    if (this.selectedOpt) {
      this.selectedOpt.classList.remove(PICKER_OPT_SELECTED);
    }

    this.selectedOpt = optionEl;
    this.selectedOpt.classList.add(PICKER_OPT_SELECTED);
  }

  render() {
    const { col } = this;
    const Button = 'button' as any;
    const mode = getIonMode(this);
    return (
      <Host
        class={{
          [mode]: true,
          'picker-col': true,
          'picker-opts-left': this.col.align === 'left',
          'picker-opts-right': this.col.align === 'right'
        }}
        style={{
          'max-width': this.col.columnWidth
        }}
      >
        {col.prefix && (
          <div class="picker-prefix" style={{ width: col.prefixWidth! }}>
            {col.prefix}
          </div>
        )}
        <div class="picker-opts" ref={el => this.scrollEl = el}>
          <div class="picker-opt picker-opt-liam"></div>
          <div class="picker-opts-sizing" style={{ maxWidth: col.optionsWidth! }} ref={el => this.optsEl = el}>
            { col.options.map((o, index) =>
              <Button
                type="button"
                class={{ 'picker-opt': true, 'picker-opt-disabled': !!o.disabled }}
                opt-index={index}
                onClick={() => this.onOptionSelected(index)}
              >
                {o.text}
              </Button>
            )}
          </div>
          <div class="picker-opt picker-opt-liam"></div>
        </div>
        {col.suffix && (
          <div class="picker-suffix" style={{ width: col.suffixWidth! }}>
            {col.suffix}
          </div>
        )}
      </Host>
    );
  }
}

const PICKER_OPT_SELECTED = 'picker-opt-selected';
