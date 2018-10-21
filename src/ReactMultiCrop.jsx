import React, { Component } from 'react'
import { fabric } from 'fabric'
import Button from '@material-ui/core/Button'
import { Labeled } from 'react-admin'

import Grid from '@material-ui/core/Grid'

class ReactMultiCrop extends Component {
  constructor (props) {
    super(props)
    this.state = {
      canvas: null,
      initial: true
    }
    this.color = 'grey'
    this.opacity = 0.5
    this.strokeColor = 'yellow'
    this.strokeDashArray = [5, 5]
    this.strokeWidth = 5
    this.keyboardHandler = this.keyboardHandler.bind(this)
    this.addNew = this.addNew.bind(this)
    this.deleteShapes = this.deleteShapes.bind(this)
    this.multiSelect = this.multiSelect.bind(this)
    this.discardActiveObject = this.discardActiveObject.bind(this)
  }

  componentDidMount () {
    this.initialCanvas()
  }

  componentDidUpdate () {
    this.changeImage()
  }

  changeImage () {
    const { record } = this.props
    let setImage = this.loadImage.bind(this)
    fabric.Image.fromURL(record.image, setImage)
  }

  loadImage (img) {
    var { initial, canvas } = this.state
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      scaleX: canvas.width / img.width,
      scaleY: canvas.height / img.height
    })
    if (initial) {
      this.setState({ initial: false }, this.initialObjects.bind(this))
    }
  }

  initialImage () {
    const { record } = this.props
    let loadImageNow = this.loadImage.bind(this)
    fabric.Image.fromURL(record.image, loadImageNow)
  }

  initialObjects () {
    var { canvas } = this.state
    const { record } = this.props
    let setOutput = this.setOutput.bind(this)
    let setStateOf = this.setState.bind(this)
    let inputObject = record.clippings
    let createObject = this.createObject.bind(this)
    if (inputObject !== undefined) {
      inputObject.forEach(function (coord) {
        let rect = createObject(canvas, coord)
        canvas.add(rect)
      })
    }
    canvas.renderAll()
    setStateOf({ canvas }, setOutput)
  }

  initialCanvas () {
    var canvas = new fabric.Canvas(this.props.id)
    canvas.uniScaleTransform = true
    let doubleClickEvent = this.doubleClickEvent.bind(this)
    let objectModifiedEvent = this.setOutput.bind(this)
    canvas.on('mouse:dblclick', doubleClickEvent)
    canvas.on('object:modified', objectModifiedEvent)
    let initialImg = this.initialImage.bind(this)
    this.setState({ canvas }, initialImg)
  }

  addNew () {
    var { canvas } = this.state
    var coor = {}
    coor.id = null
    coor.rect = { 'x1': 0, 'y1': 0, 'x2': 0.2, 'y2': 0.2 }
    var rect = this.createObject(canvas, coor)
    rect.lockRotation = true
    canvas.add(rect)
    canvas.renderAll()
    this.setState({ canvas }, this.setOutput)
  }

  doubleClickEvent (options) {
    if (options.target) {
      var { canvas } = this.state
      const left = options.target.left
      const top = options.target.top
      const width = options.target.width
      const height = options.target.height
      var attribute = {}
      attribute.left = left + 5
      attribute.top = top + 5
      attribute.width = width * options.target.scaleX
      attribute.height = height * options.target.scaleY
      var rect = this.createObjectByAttribute(attribute)
      rect.lockRotation = true
      canvas.add(rect)
      canvas.renderAll()
      this.setState({ canvas }, this.setOutput)
    }
  }

  createObjectByAttribute (attribute) {
    return new fabric.Rect({
      left: attribute.left,
      top: attribute.top,
      width: attribute.width,
      height: attribute.height,
      fill: this.color,
      opacity: this.opacity,
      id: null,
      strokeDashArray: this.strokeDashArray,
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth
    })
  }

  shapetoStructureData (element) {
    var { canvas } = this.state
    let coord = {}
    coord.id = element.id
    let x1 = element.left / canvas.width
    let y1 = element.top / canvas.height
    let x2 = (element.left + (element.width * element.scaleX)) / canvas.width
    let y2 = (element.top + (element.height * element.scaleY)) / canvas.height
    var rectangle = { 'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2 }
    coord.rect = JSON.stringify(rectangle)
    if (canvas.backgroundImage) {
      let imgWidth = canvas.backgroundImage.width
      let imgHeight = canvas.backgroundImage.height
      let x1Px = x1 * imgWidth
      let x2Px = x2 * imgWidth
      let y1Px = y1 * imgHeight
      let y2Px = y2 * imgHeight
      var rectanglePx = { 'x1': x1Px, 'y1': y1Px, 'x2': x2Px, 'y2': y2Px }
      coord.rectPx = JSON.stringify(rectanglePx)
    }
    coord.deletedAt = '-1'
    return coord
  }

  deleteShapes () {
    var { canvas } = this.state
    if (canvas) {
      canvas.getActiveObjects().forEach(function (element) {
        canvas.remove(element)
      })
      this.setState({ canvas }, this.setOutput)
    }
  }

  setOutput () {
    var { canvas } = this.state
    let shapeToStructureData = this.shapetoStructureData.bind(this)
    let outputValue = []
    let cropcoords = canvas.getObjects()
    cropcoords.forEach(function (element) {
      outputValue.push(shapeToStructureData(element))
    })
    // let stringOut = JSON.stringify(outputValue)
    this.props.input.onChange(outputValue)
  }

  createObject (canvas, coor) {
    var rectangle
    if (typeof coor.rect === 'string') {
      rectangle = JSON.parse(coor.rect)
    } else {
      rectangle = coor.rect
    }
    let left = canvas.width * rectangle.x1
    let top = canvas.height * rectangle.y1
    let right = canvas.width * rectangle.x2
    let bottom = canvas.height * rectangle.y2
    let width = right - left
    let height = bottom - top
    return new fabric.Rect({
      left: left,
      top: top,
      width: width,
      height: height,
      fill: this.color,
      opacity: this.opacity,
      id: coor.id,
      strokeDashArray: this.strokeDashArray,
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth
    })
  }

  multiSelect () {
    var { canvas } = this.state
    canvas.discardActiveObject()
    var sel = new fabric.ActiveSelection(canvas.getObjects(), {
      canvas: canvas
    })
    canvas.setActiveObject(sel)
    canvas.requestRenderAll()
  }

  discardActiveObject () {
    var { canvas } = this.state
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }

  keyboardHandler (event) {
    if (event.keyCode === 46) {
      // Handle Delete
      this.deleteShapes()
    }
  }

  render () {
    const { input: { value, name } } = this.props

    return (
      <div id='canvas-wrapper'>
        <Labeled label={name}>
          <Grid container
            direction='row'
            justify='flex-start'
            alignItems='flex-start'
            spacing='8'>
            <Grid item xs onKeyDown={this.keyboardHandler} tabIndex='0'>
              <canvas width='800' height='800' style={{ border: '1px solid #aaa' }}{...this.props} />
            </Grid>
            <Grid container item xs
              direction='column'
              justify='flex-start'
              alignItems='flex-start'
              spacing='8'>
              <Grid item xs>
                <Button variant='raised' id='addmore' color='primary' onClick={this.addNew} > Add More Shapes</Button>
              </Grid>
              <Grid item xs>
                <Button variant='raised' id='deleteselected' color='primary' onClick={this.deleteShapes}> Delete Selected Object </Button>
              </Grid>
              <Grid item xs>
                <Button variant='raised' id='multiselect' color='primary' onClick={this.multiSelect}> Select All </Button>
              </Grid>
              <Grid item xs >
                <Button variant='raised' id='discard' color='primary' onClick={this.discardActiveObject}> Discard Selection</Button>
              </Grid>
            </Grid>
            <input type='hidden' value={value} />
          </Grid>
        </Labeled>
      </div>
    )
  }
}

ReactMultiCrop.defaultProps = {
  id: 'canvas'
}

export default ReactMultiCrop
