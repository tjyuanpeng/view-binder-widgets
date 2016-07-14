# duo

> alpha component library with [view-binder](//gitlab.alibaba-inc.com/alpha/view-binder/)

## Install

```sh
$ tnpm install --save-dev @ali/view-binder-widget
```

## Usage

**in javascript**

```javascript
var select2 = require('@ali/view-binder-widget/index').select2;
select2.init(/* initialConfig */)
```

**in css**

```css
@import "@ali/view-binder-widget/lib/select2/select2.css";
```

**in html**

```html
<select
    bd-widget-select2="select.value"
    data-select2-options="select.options"
    data-select2-placeholder="please select a item"
    class="some class names"
></select>
```
