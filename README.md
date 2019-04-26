# ReactMultiCrop


[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0ea45a02956a4ca78eb39823c15b1cc8)](https://app.codacy.com/app/berviantoleo/ReactMultiCrop?utm_source=github.com&utm_medium=referral&utm_content=bervProject/ReactMultiCrop&utm_campaign=Badge_Grade_Settings)
[![Build Status](https://travis-ci.org/bervProject/ReactMultiCrop.svg?branch=master)](https://travis-ci.org/bervProject/ReactMultiCrop)

ReactMultiCrop Used Fabric.js and Integrated with react-admin. Design for [react-admin](https://github.com/marmelab/react-admin) component.

## Prerequisted and Dependecies

* Please read how to install fabric.js:

https://www.npmjs.com/package/fabric

* Dependencies:
  * react-admin
  * Material UI
  * fabric.js

## How to Install

```bash
    npm install --save react-multi-crop
```

## How to Use

You can use [redux-form](https://redux-form.com) to embed this component for field input.

### in react-admin

```js
import ReactMultiCrop from 'react-multi-crop';
import { Field } from 'redux-form';

...
<Field name="my_field" component={ReactMultiCrop} />
...
```
### in react-admin depend on another field for image showing

```js
import ReactMultiCrop from 'react-multi-crop';
import { Field, formValues } from 'redux-form';

...
<Field name="image" component={ImageField} />
<Field name="my_field" component={formValues('image')(ReactMultiCrop)} />
...
```
