import Undine from 'undine';
import { useState } from 'undine-dom'

const App = () => {
    const [count, setCount] = useState(0)
    const onClick = () => setCount(10)

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={onClick}>Click me</button>
        </div>
    )
}
export default App