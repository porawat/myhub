import { Directive,Renderer, ElementRef } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
/**
 * Generated class for the FocuserDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[focuser]' // Attribute selector
})
export class FocuserDirective {

  constructor(
    private renderer:Renderer, 
    public keyboard:Keyboard,
    private elementRef:ElementRef) {
    console.log('Hello FocuserDirective Directive');
  }
  ngAfterViewInit() {
    const element = this.elementRef.nativeElement.querySelector('input');
    // we need to delay our call in order to work with ionic ...
    setTimeout(() => {
        this.renderer.invokeElementMethod(element, 'focus', []);
        this.keyboard.show();
    }, 0);
}
}
