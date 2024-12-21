import { UndineElement } from 'undine';

const isProperty = (key: string) => key !== "children"
const isEvent = (key: string) => key.startsWith("on");

// Global application state to store hooks states
let states: any[][] = [];
let componentIndex = 0;
let currentHookIndex = 0;

// Dummy variables for illustration - assign these appropriately during mounting/rendering
let currentComponent: UndineElement | null = null;
let currentContainer: HTMLElement | null = null;

const resetHookIndices = () => {
  currentHookIndex = 0;
};


// A simple global render trigger mechanism
let rerenderQueue: {element: UndineElement, dom: HTMLElement}[] = []; 

const triggerRerender = () => {
  for (const component of rerenderQueue) {
    render(component.element, component.dom);
  }

  rerenderQueue = [];
}

const updateDomProperties = (dom: HTMLElement, prevProps: Record<string, any>, nextProps: Record<string, any>) => {
  const defaultPropKey = 'children';

  // Remove event listeners
  for (const [removePropKey, removePropValue] of Object.entries(prevProps)) {
    if (isEvent(removePropKey)) {
      const eventName = removePropKey.toLowerCase().substring(2);
      dom.removeEventListener(eventName, removePropValue);
    } else if (removePropKey !== defaultPropKey) {
      Object.assign(dom, { [removePropKey]: null });
    }
  }

  // Add event listeners
  for (const [addPropKey, addPropValue] of Object.entries(nextProps)) {
    if (isEvent(addPropKey)) {
      const eventName = addPropKey.toLowerCase().substring(2);
      dom.addEventListener(eventName, addPropValue);
    } else if (addPropKey !== defaultPropKey) {
      Object.assign(dom, { [addPropKey]: addPropValue });
    }
  }
}


const generateComponent = (element: UndineElement) => {
  if (typeof element.type === 'string') {
    if (element.type === 'TEXT_ELEMENT') {
      return document.createTextNode(element.props.nodeValue);
    }
    return document.createElement(element.type);
  }
  return null;
}

const createDOM = (element: UndineElement, dom: HTMLElement): HTMLElement | Text | null => {
  const { type, props } = element;
  
    if (typeof element.type === 'function') {
        return createDOM(element.type(element.props), dom);
    }

    const el = generateComponent(element);
    
    if (el) {
      updateDomProperties(el as HTMLElement, {}, props);
    }

    for (const child of element.props.children) {
      createDOM(child, el as HTMLElement);
    }

    dom.appendChild(el as HTMLElement);
    return el;
}


const performUnitOfWork = () => {
  const id = 1;
  const fps = 1e3 / 60;
  

  let frameDeadline: number = 0;
  let pendingCallback: IdleRequestCallback | null = null;

  const channel = new MessageChannel();

  const timeRemaining = (frameDeadline: number) => frameDeadline - window.performance.now();

  const deadline = {
    didTimeout: false,
    timeRemaining: timeRemaining(frameDeadline),
  }
  

  channel.port2.onmessage = () => {
    if (typeof pendingCallback === 'function') {
      (pendingCallback as IdleRequestCallback)(deadline as any);
    }
  }

  window.requestIdleCallback = (callback: IdleRequestCallback) => {
    window.requestAnimationFrame((frameTime) => {
      frameDeadline = frameTime + fps;
      pendingCallback = callback;
      channel.port1.postMessage(null);
    })
    return id;
  }
}

// Dummy variables for illustration - assign these appropriately during mounting/rendering
export const render = (element: UndineElement, container: HTMLElement) => {
    createDOM(element, container);
    performUnitOfWork()
  
  // Set global variables to know which component/container are being rendered
  currentComponent = element;
  currentContainer = container;
  componentIndex++;
}


export const useState = <S>(initialState: S) => {
  // Initialize state for this hook index if it's undefined
  if (typeof states[componentIndex] === 'undefined') {
    states[componentIndex] = [];
  }


  if (typeof states[componentIndex][currentHookIndex] === 'undefined') {
    states[componentIndex][currentHookIndex] = initialState;
  }

  const currentIndex = currentHookIndex;

  const setState = (newState: S | ((newState: S) => void)) => {
    if (typeof(newState) === 'function') {
      states[componentIndex][currentIndex] = (newState as ((newState: S) => void))(states[componentIndex][currentIndex]);
    } else {
      states[componentIndex][currentIndex] = newState;
    }

    rerenderQueue.push({element: currentComponent!, dom: currentContainer!});
    triggerRerender();
    // Trigger a re-render logic here (specific to your library architecture)
    // Ideally, you'd require a `reRender()` function to refresh the component
  }


  const state = states[componentIndex][currentHookIndex];
  
  currentHookIndex += 1; // Move to the next hook index

  return [state, setState];
}