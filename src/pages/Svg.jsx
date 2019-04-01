import React, { Component } from 'react'
import { Button, Icon } from 'antd'

import './Svg.css'

class Svg extends Component {
  state = {
    isEdit: false,
    isKeyDown: false,
    isMouseDown: false,
    items: [],
    choosedItem: [],
    lines: [],
    mouseDownX: 0,
    mouseDownY: 0,
    mouseDownItem: {},
    matrix: [1, 0, 0, 1, 0, 0],
    currentLineId: '',
    menuOpts: {}
  }
  componentDidMount () {
    document.addEventListener('keydown', this.keyDown)
    document.addEventListener('wheel', this.wheel)
    document.addEventListener('keyup', this.keyUp)
    document.addEventListener('click', this.click)
  }
  componentWillMount () {
    document.removeEventListener('keydown', this.keyDown)
    document.removeEventListener('wheel', this.wheel)
    document.removeEventListener('keyup', this.keyUp)
    document.removeEventListener('click', this.click)
  }

  keyDown = e => {
    if (e.keyCode !== 123) e.preventDefault()
    this.setState({ isKeyDown: e.keyCode === 17 })
  }
  wheel = e => {
    e.preventDefault()
    const { matrix, isKeyDown } = this.state

    if (!isKeyDown) {
      matrix[5] = +matrix[5] - e.deltaY / 4
    } else {
      matrix[0] = e.deltaY > 0 ? +matrix[0] + 0.05 : (+matrix[0] - 0.05) > 0 ? +matrix[0] - 0.05 : +matrix[0]
      matrix[3] = e.deltaY > 0 ? +matrix[3] + 0.05 : (+matrix[3] - 0.05) > 0 ? +matrix[3] - 0.05 : +matrix[3]
    }
    this.setState({ matrix: matrix.map(item => +item) })
  }
  keyUp = e => {
    e.keyCode === 17 && this.setState({ isKeyDown: false })
  }
  click = () => {
    const { menuOpts } = this.state

    menuOpts.display = 'none'
    this.setState({ menuOpts })
  }


  mouseDown = e => {
    const { mouseDownItem } = this.state

    if (e.nativeEvent.which !== 1) return

    if (e.target.className !== 'stage-body-item') {
      this.setState({
        mouseDownItem: {},
        mouseDownX: e.clientX,
        mouseDownY: e.clientY,
        isMouseDown: true,
      })
    } else {
      mouseDownItem.target = e.target
      mouseDownItem.left = e.target.offsetLeft
      mouseDownItem.top = e.target.offsetTop

      this.setState({
        mouseDownX: e.clientX,
        mouseDownY: e.clientY,
        isMouseDown: true,
        mouseDownItem
      })
    }

  }
  mouseMove = e => {
    const { isMouseDown, mouseDownItem, mouseDownX, mouseDownY, matrix } = this.state

    if (!isMouseDown) return

    const _x = e.clientX, _y = e.clientY

    if (!mouseDownItem.target) {
      matrix[4] += ((_x - mouseDownX) * matrix[0])
      matrix[5] += ((_y - mouseDownY) * matrix[3])
      this.setState({ matrix, mouseDownX: _x, mouseDownY: _y })
      return
    }

    mouseDownItem.target.style.left = mouseDownItem.left + (_x - mouseDownX) / matrix[0] + 'px'
    mouseDownItem.target.style.top = mouseDownItem.top + (_y - mouseDownY) / matrix[3] + 'px'
    this.setState({ mouseDownItem })
  }
  mouseUp = () => {
    this.setState({ isMouseDown: false, mouseDownItem: {} })
  }


  chooseItem = e => {
    const { isEdit, lines, choosedItem } = this.state
    if (!isEdit || e.target.className !== 'stage-body-item') return

    if (choosedItem.length < 2) {
      !choosedItem[0] ? choosedItem.push(e.target) : choosedItem[0].id !== e.target.id && choosedItem.push(e.target)
    }

    if (choosedItem.length === 2) {
      for (let i = 0, len = lines.length; i < len; i++) {
        if (lines[i].id.join('-') === `${choosedItem[0].id}-${choosedItem[1].id}` || lines[i].id.join('-') === `${choosedItem[1].id}-${choosedItem[0].id}`) {
          return
        }
      }
      lines.push({
        start: choosedItem[0],
        end: choosedItem[1],
        id: [choosedItem[0].id, choosedItem[1].id]
      })
      choosedItem.length = 0
      this.setState({ lines })
    }

    this.setState({ choosedItem })
  }


  add = () => {
    const { items } = this.state
    const randomId = ('' + (Math.random().toFixed(6))).split('.')[1]
    items.push({
      id: randomId,
      title: `${randomId}`
    })
    this.setState({ items })
  }
  reset = () => {
    this.setState({ matrix: [1, 0, 0, 1, 0, 0] })
  }
  edit = () => {
    const { isEdit } = this.state
    this.setState({ isEdit: !isEdit })
  }


  getInfo = line => {
    const width = line.start.offsetLeft <= line.end.offsetLeft ? line.end.offsetLeft - line.start.offsetLeft - line.start.offsetWidth : line.start.offsetLeft - line.end.offsetLeft - line.end.offsetWidth
    const height = Math.abs((line.end.offsetTop + line.end.offsetHeight / 2) - (line.start.offsetTop + line.start.offsetHeight / 2)) + 40
    const left = line.start.offsetLeft <= line.end.offsetLeft ? line.start.offsetLeft + line.start.offsetWidth : line.end.offsetLeft + line.end.offsetWidth

    let path, top

    if (line.start.offsetTop <= line.end.offsetTop) {
      top = line.start.offsetTop + line.start.offsetHeight / 2 - 20
      path = `
              M${line.start.offsetLeft <= line.end.offsetLeft ? 0 : width},${20} 
              C${line.start.offsetLeft <= line.end.offsetLeft ? `${width - 20},20 20,${height - 20}` : `20,20 ${width - 20},${height - 20}`}
              ${line.start.offsetLeft <= line.end.offsetLeft ? width - 15 : 15},${height - 20}
            `
    } else if (line.start.offsetTop > line.end.offsetTop) {
      top = line.end.offsetTop + line.end.offsetHeight / 2 - 20
      path = `
              M${line.start.offsetLeft <= line.end.offsetLeft ? 0 : width},${height - 20}
              C${line.start.offsetLeft <= line.end.offsetLeft ? `${width - 20},${height - 20} 20,20` : `20,${height - 20} ${width - 20},20`}
              ${line.start.offsetLeft <= line.end.offsetLeft ? width - 15 : 15},${20}
            `
    }

    return {
      path,
      width,
      height,
      left,
      top
    }
  }


  lineContextMenu = e => {
    e.preventDefault()
    if (e.target.tagName !== 'path') return

    const { menuOpts } = this.state
    menuOpts.display = 'block'
    menuOpts.left = `${e.clientX}px`
    menuOpts.top = `${e.clientY}px`
    this.setState({ currentLineId: e.currentTarget.id, menuOpts })
  }
  deleteLine = () => {
    const { lines, currentLineId } = this.state

    const tmp = lines.filter(line => line.id.join('-') !== currentLineId)

    this.setState({ lines: tmp })
  }


  render () {
    const { isEdit, items, lines, matrix, menuOpts } = this.state

    return (
      <div className='stage'
        onClick={this.chooseItem}
        onMouseDown={this.mouseDown}
        onMouseMove={this.mouseMove}
        onMouseUp={this.mouseUp}
      >
        <div className='stage-opera'>
          <Button onClick={this.edit} type={`${!isEdit ? 'default' : 'primary'}`}><Icon type='edit' /></Button>
          <Button onClick={this.add}><Icon type='plus' /></Button>
          <Button onClick={this.reset}><Icon type="reload" /></Button>
        </div>
        <div
          className='stage-body'
          style={{ transform: `matrix(${matrix.join(',')})` }}
        >
          {
            items.map(item => {
              return (
                <div
                  key={item.id}
                  id={item.id}
                  className='stage-body-item'
                  style={{ background: `#${item.id}` }}
                />
              )
            })
          }
          <div>
            {
              lines.map(line => {
                const { width, height, left, top, path } = this.getInfo(line)

                return (
                  <div
                    key={line.id.join('-')}
                    id={line.id.join('-')}
                    className='stage-body-line'
                    style={{ width: `${width}px`, height: `${height}px`, left: `${left}px`, top: `${top}px` }}
                    onContextMenu={this.lineContextMenu}
                  >
                    <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <g className="stage-body-line-path ">
                        <path d={path} stroke="black" fill="none" className="stage-body-line-body"></path>
                      </g>
                    </svg>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div>
          <svg>
            <defs>
              <marker id="Triangle" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="4" fill="#acacac" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" style={{ strokeDasharray: '0, 0' }}></path>
              </marker>
              <marker id="TriangleHover" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="4" fill="#7EAEFF" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" style={{ strokeDasharray: '0, 0' }}></path>
              </marker>
            </defs>
          </svg>
        </div>
        <ul className='stage-body-line-menu' style={{ display: menuOpts.display, left: menuOpts.left, top: menuOpts.top }}>
          <li onClick={this.deleteLine}>
            <span >删除</span>
            <span>
              <span className="hotkey">delete</span>
            </span>
          </li>
        </ul>
      </div>
    )
  }
}

export default Svg
