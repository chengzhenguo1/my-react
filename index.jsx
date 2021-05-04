
const element = (
    <div id='foo'>
        <a>bar</a>
        <span>span</span>
    </div>
)

function createElement(type, props, ...children) {
    return {
        type,
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