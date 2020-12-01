# ReactMultiCrop

**Deprecated**

Move [here](https://github.com/berviantoleo/react-multi-crop)

ReactMultiCrop Used Fabric.js and Integrated with react-admin. Designed for [react-admin](https://github.com/marmelab/react-admin) component.

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Build Status

|                                                                                                                                  Codacy                                                                                                                                   |                                                                 Travis                                                                  |                                              Github Action                                              |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
| [![Codacy Badge](https://api.codacy.com/project/badge/Grade/0ea45a02956a4ca78eb39823c15b1cc8)](https://app.codacy.com/app/berviantoleo/ReactMultiCrop?utm_source=github.com&utm_medium=referral&utm_content=bervProject/ReactMultiCrop&utm_campaign=Badge_Grade_Settings) | [![Build Status](https://travis-ci.org/bervProject/ReactMultiCrop.svg?branch=master)](https://travis-ci.org/bervProject/ReactMultiCrop) | ![Node.js Package](https://github.com/bervProject/ReactMultiCrop/workflows/Node.js%20Package/badge.svg) |

## Prerequisted and Dependecies

- Please read how to install fabric.js:

https://www.npmjs.com/package/fabric

- Dependencies:
  - Material UI
  - fabric.js

## How to Install

```bash
    yarn add react-multi-crop
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
