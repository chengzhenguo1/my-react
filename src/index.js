const myReact = {
    createElement: null,
    render: null
}

myReact.createElement = (type, config, ...children) => {
    let ref = null
    let key = null
    let props = {}
    if (config) {
        for (const name in config) {
            if (Object.hasOwnProperty.call(config, name)) {
                if (name === 'ref') {
                    ref = config[name]
                } else if (name === 'key') {
                    key = config[name]
                } else {
                    props[name] = config[name]
                }
            }
        }
    }

    return {
        type,
        ref,
        key,
        props: {
            ...props,
            children: children.map((child) => {
                return typeof child === 'object'
                    ? child
                    : createTextElement(child)
            })
        }
    }
}

function createDom(fiber) {
      
    const { type, props } = element
    const dom = type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(type)

    /* 排除chidren */
    const isProperty = key => key !== 'children'
    /* 将props的属性挂载到children上 */
    Object.keys(props)
    .filter(isProperty)
    .forEach((name) => {
        dom[name] = props[name]
    })

    /* 递归挂载 */
    const { children = [] } = props
    if (children) {
        children.forEach((child) => {
            /* 挂载到父级节点dom上 */
            myReact.render(child, dom)
        })
    }

    container.appendChild(dom)
}

myReact.render = (element, container) => {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element]
        }
    }
}

/* 创建文本节点 */
function createTextElement(element) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: element,
            children: []
        }
    }
}

/** @jsx myReact.createElement */
const element = (
    <div style="background: salmon">
      <h1>Hello World<span>啊</span></h1>
      <h2 style="text-align:right">from Didact</h2>
    </div>
)

let nextUnitOfWork = null

/**
   * @param {deadline} 检查浏览器还剩余多少时间
*/
function loop(deadline){
    let shouldYield = false
    while(nextUnitOfWork && !shouldYield){
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        /* 是否还有剩余时间 */
        shouldYield = deadline.timeRemaining() < 1
    }
    requestIdleCallback(loop)
}

/* 浏览器空闲时间执行callback */
requestIdleCallback(loop)

function performUnitOfWork(fiber){
    // 创建dom
    if(!fiber.dom){
        fiber.dom = createDom(fiber)
    }
    // 挂载dom
    if(fiber.parent){
       fiber.parent.dom.appendChild(fiber) 
    }
    const elements = fiber.props.children
    let index = 0
    let prevSibling = null 
    // 创建 children fibers
    while(index < elements.length){
        const element = elements[index]
        // 创建一个新fiber
        const newFiber = {
            type: element.type,
            props: element.props,
            dom: null,
            parent: fiber
        }
        // 第一个子元素
        if(index === 0){
            fiber.child = newFiber
        }
        // 不是第一个元素，需要挂载到兄弟上
        if(prevSibling){
            prevSibling.sibling = newFiber
        }
        index++
        prevSibling = newFiber
    }
    // 返回Childs
    if(fiber.child){
        return fiber.child
    }
    // 无child,返回父级的兄弟查找
    let nextFiber = fiber
    while(nextFiber){
        if(nextFiber.sibling){
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}


const root = document.getElementById('root')
myReact.render(element, root)