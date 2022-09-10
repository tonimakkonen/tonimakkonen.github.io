
"use strict"

const buttonSelectecColor = 0x8888ff
const buttonColor = 0x44bbcc
const buttonDisabledColor = 0x555555

function buttonLogic(buttonList) {
  for (const button of buttonList) {
    if (mouseClick && mouseX >= button.x0 && mouseX <= button.x1 && mouseY >= button.y0 && mouseY <= button.y1) {
      button.func(button)
      return // only allow one button execution
    }
  }
}

function buttonAddBuyButton(x, y, width, height, cost, text, image, func, game) {
  var rect = game.add.rectangle(x, y, width, height, buttonColor).setDepth(1)
  if (cost) {
    cost = game.add.text(x - width/2 + height*2, y, cost, {'color': '#000000'})
    cost.setOrigin(0.0, 0.5)
    cost.setDepth(1)
  }
  if (text) {
    var text = game.add.text(x - width/2 + height*4, y, text, {'color': '#000000'})
    text.setOrigin(0.0, 0.5)
    text.setDepth(1)
  }
  if (image) {
    image = game.add.sprite(x - width * 0.5 + height*0.5 + 5, y, image)
    image.setDepth(1)
    image.setScale(0.6)
  }
  var nb = {
    x: x,
    y: y,
    x0: x - width/2,
    x1: x + width/2,
    y0: y - height/2,
    y1: y + height/2,
    rect: rect,
    cost: cost,
    text: text,
    image: image,
    func: func
  }
  return nb
}

function buttonAddClickButton(x, y, width, height, text, image, func, game) {
  var rect = game.add.rectangle(x, y, width, height, buttonColor).setDepth(1)
  if (text) {
    var text = game.add.text(x, y, text, {'color': '#000000'})
    text.setOrigin(0.5, 0.5)
    text.setDepth(1)
  }
  if (image) {
    image = game.add.sprite(x - width * 0.5 + height*0.5 + 5, y, image)
    image.setDepth(1)
    image.setScale(0.6)
  }
  var nb = {
    x: x,
    y: y,
    x0: x - width/2,
    x1: x + width/2,
    y0: y - height/2,
    y1: y + height/2,
    rect: rect,
    text: text,
    image: image,
    func: func
  }
  return nb
}

function buttonAddGridButton(x, y, width, height, func, game) {
  var rect = game.add.rectangle(x, y, width, height);
  rect.setFillStyle()
  rect.setStrokeStyle(2,buttonColor)
  rect.setDepth(1)
  var nb = {
    x: x,
    y: y,
    x0: x - width/2,
    x1: x + width/2,
    y0: y - height/2,
    y1: y + height/2,
    rect: rect,
    text: undefined,
    image: undefined,
    grid: true,
    func: func
  }
  return nb
}

function buttonAddListButton(x, y, width, height, text, image, func, selected, list, game) {
  var rect = game.add.rectangle(x, y, width, height, selected ? buttonSelectecColor : buttonColor);
  if(text) {
    var text = game.add.text(x, y, text, {'color': '#000000'})
    text.setOrigin(0.5, 0.5)
    text.setDepth(1)
  }
  if (image) {
    image = game.add.sprite(x - width * 0.5 + height*0.5 + 5, y, image)
    image.setDepth(1)
  }
  var nb = {
    x: x,
    y: y,
    x0: x - width/2,
    x1: x + width/2,
    y0: y - height/2,
    y1: y + height/2,
    rect: rect,
    text: text,
    image: image,
    list: list,
    func: (button) => {
      buttonClearListButtonSelection(button.list)
      button.rect.setFillStyle(buttonSelectecColor)
      func(button)
    }
  }
  list.push(nb)
  return nb
}

function buttonClearListButtonSelection(list) {
  for (const button of list) {
    button.rect.setFillStyle(buttonColor)
  }
}

// destroy all phaser objects
function buttonDestroy(button) {
  if (button.rect) button.rect.destroy()
  if (button.cost) button.cost.destroy()
  if (button.text) button.text.destroy()
  if (button.image) button.image.destroy()
}

function buttonDestroyList(list) {
  for (const button of list) {
    buttonDestroy(button)
  }
}

function buttonSetColor(button, color) {
  if (button.grid) button.rect.setStrokeStyle(2, color)
  else button.rect.setFillStyle(color)
}

function buttonSetColorList(list, color) {
  for (const button of list) buttonSetColor(button, color)
}
