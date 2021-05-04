const myReact = {
    createElement: ()=>{},
    render: ()=>{}
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

myReact.render = (element, container) => {
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


const root = document.getElementById('root')
myReact.render(element, root)