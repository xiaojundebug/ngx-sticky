import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core'
import { caniuse } from './utils'
import { combineLatest, fromEvent, Subject } from 'rxjs'
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame'
import { startWith, takeUntil, throttleTime } from 'rxjs/operators'

const IS_NATIVE_SUPPORTED = caniuse('position', 'sticky')

@Component({
  selector: 'ngx-sticky',
  templateUrl: './sticky.component.html',
  styleUrls: ['./sticky.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StickyComponent implements OnInit, OnDestroy {
  @ViewChild('outer', { static: false }) outer
  @ViewChild('inner', { static: false }) inner
  /** 顶部触发距离 */
  @Input('offsetTop') offsetTop = 0
  /** 同 css z-index */
  @Input('zIndex') zIndex = 1
  /** 状态变动时触发 */
  @Output('change') change = new EventEmitter<boolean>()

  get outerClassList() {
    return {
      'ngx-sticky': true,
      'ngx-sticky--native': IS_NATIVE_SUPPORTED,
      'ngx-sticky--simulate': !IS_NATIVE_SUPPORTED && this.fixed
    }
  }
  get outerStyle() {
    if (!IS_NATIVE_SUPPORTED) return
    return { top: this.offsetTop + 'px', zIndex: this.zIndex }
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

  constructor(private cdr: ChangeDetectorRef, private render: Renderer2) {}

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
        const outer = this.outer.nativeElement
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
