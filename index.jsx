
const element = (
    <div id='foo'>
        <a>bar</a>
        <span>span</span>
    </div>
)

const myReact = {
    createElement
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

React.render(element, document.getElementById('root'))