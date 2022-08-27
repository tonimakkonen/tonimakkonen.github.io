
"use strict"

const buttonSelectecColor = 0x8888ff
const buttonColor = 0x44bbcc

function buttonLogic(buttonList) {
  for (const button of buttonList) {
    if (mouseClick && mouseX >= button.x0 && mouseX <= button.x1 && mouseY >= button.y0 && mouseY <= button.y1) {
      button.func(button) // just execute the base logic in button
    }
  }
}

function buttonAddClickButton(x, y, width, height, text, func, game) {
  var rect = game.add.rectangle(x, y, width, height, buttonColor);
  var text = game.add.text(x, y, text, {'color': '#000000'})
  text.setOrigin(0.5, 0.5)
  var nb = {
    x: x,
    y: y,
    x0: x - width/2,
    x1: x + width/2,
    y0: y - height/2,
    y1: y + height/2,
    rect: rect,
    text: text,
    func: func
  }
  return nb
}

function buttonAddListButton(x, y, width, height, text, func, selected, list, game) {
  var rect = game.add.rectangle(x, y, width, height, selected ? buttonSelectecColor : buttonColor);
  var text = game.add.text(x, y, text, {'color': '#000000'})
  text.setOrigin(0.5, 0.5)
  var nb = {
    x: x,
    y: y,
    x0: x - width/2,
    x1: x + width/2,
    y0: y - height/2,
    y1: y + height/2,
    rect: rect,
    text: text,
    list: list,
    func: (button) => {
      buttonClearListButtonSelection(button.list)
      button.rect.setFillStyle(buttonSelectecColor)
      func()
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
  if (button.text) button.text.destroy()
}

function buttonDestroyList(list) {
  for (const button of list) buttonDestroy(button)
}
