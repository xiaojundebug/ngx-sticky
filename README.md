# NgxSticky

An angular sticky component.

_development environment: angular 8.2.14_

<p align="center">
  <img alt="travis" src="https://travis-ci.org/xiaojun1994/ngx-sticky.svg?branch=master">
</p>

👉 [Demo](https://stackblitz.com/edit/ngx-sticky-demo)

## Install

```bash
npm i @ciri/ngx-sticky
```

## Quick Start

Add it to your module:

```typescript
import { StickyModule } from '@ciri/ngx-sticky'

@NgModule({
  // ...
  imports: [
    // ...
    StickyModule
  ],
})
```

Add to view:

```html
<ngx-sticky [offsetTop]="0">hello world</ngx-sticky>
```

## Inputs

| Name      | Type   | Default | Description         |
| --------- | ------ | ------- | ------------------- |
| offsetTop | number | 0       | Offset top          |
| zIndex    | number | 1       | z-index when sticky |

## Outputs

| Event  | Description                 | Return value |
| ------ | --------------------------- | ------------ |
| change | Triggered when state change | state        |
