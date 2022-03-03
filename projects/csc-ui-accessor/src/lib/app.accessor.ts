import {
  Directive,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
@Directive({
  selector: '[cControl]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CControl),
      multi: true,
    },
  ],
})
export class CControl implements ControlValueAccessor {
  @HostBinding('value') hostValue: any;

  lastValue: any;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private stencilElement: ElementRef<Element>) {
    const { nativeElement } = this.stencilElement;
    if (!nativeElement.tagName.toLowerCase().startsWith('c-')) {
      console.error(
        'cControl ControlValueAccessor falsely used on non csc-ui component',
        nativeElement
      );
    }
  }

  writeValue(value: any) {
    this.hostValue = this.lastValue = value == null ? '' : value;
  }

  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  @HostListener('changeValue', ['$event.detail'])
  _handleChangeValue(value: any) {
    this.writeValue(value);
    this.onChange(value);
  }
}
