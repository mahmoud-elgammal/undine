import { UndineElement, IUndineDefaultProps } from "../types/index";

export const createElement = (type: string, config: IUndineDefaultProps = { children: [] }, ...children: UndineElement[]): UndineElement => {
    const props = { ...config, children: children.map(child => typeof child === 'object' ? child : createTextElement(child)) };
    return { type, props };
}

export const createTextElement = (text: string): UndineElement => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}