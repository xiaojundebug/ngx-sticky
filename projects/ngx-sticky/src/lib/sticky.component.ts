import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core'
import { caniuse } from './utils'
import { combineLatest, fromEvent, Subject } from 'rxjs'
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame'
import { startWith, takeUntil, throttleTime } from 'rxjs/operators'
import { DomSanitizer } from '@angular/platform-browser'

const IS_NATIVE_SUPPORTED = caniuse('position', 'sticky')

@Component({
  selector: 'ngx-sticky',
  templateUrl: './sticky.component.html',
  styleUrls: ['./sticky.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StickyComponent implements OnInit, OnDestroy {
  /** 顶部触发距离 */
  @Input('offsetTop') offsetTop = 0
  /** 同 css z-index */
  @Input('zIndex') zIndex = 1
  /** 状态变动时触发 */
  @Output('change') change = new EventEmitter<boolean>()

  @HostBinding('class')
  get hostClassName() {
    const obj = {
      'ngx-sticky': true,
      'ngx-sticky--native': IS_NATIVE_SUPPORTED,
      'ngx-sticky--simulate': !IS_NATIVE_SUPPORTED && this.fixed
    }

    return Object.entries(obj)
      .filter(el => el[1])
      .map(el => el[0])
      .join(' ')
  }

  @HostBinding('style')
  get hostStyle() {
    if (!IS_NATIVE_SUPPORTED) return
    return this.sanitizer.bypassSecurityTrustStyle(`
      top: ${this.offsetTop}px;
      z-index: ${this.zIndex};
    `)
  }
  get innerStyle() {
    if (IS_NATIVE_SUPPORTED) return
    return {
      top: this.fixed ? this.offsetTop + 'px' : '',
      zIndex: this.zIndex
    }
  }

  private destroy$ = new Subject<void>()
  private fixed = false

  constructor(
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private render: Renderer2,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (IS_NATIVE_SUPPORTED) {
      return
    }
    const resize$ = fromEvent(window, 'resize').pipe(
      throttleTime(0, animationFrame),
      startWith(null)
    )
    const scroll$ = fromEvent(window, 'scroll').pipe(throttleTime(0, animationFrame))

    combineLatest(resize$, scroll$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const outer = this.elRef.nativeElement
        const rect = outer.getBoundingClientRect()

        if (!this.fixed && rect.top <= this.offsetTop) {
          this.render.setStyle(outer, 'height', rect.height + 'px')
          this.fixed = true
          this.change.emit(true)
        } else if (this.fixed && rect.top > this.offsetTop) {
          this.render.setStyle(outer, 'height', 'auto')
          this.fixed = false
          this.change.emit(false)
        }

        this.cdr.detectChanges()
      })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
