import './css/style.css'
import { useState, useRef, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(32);
  const [inputValue, setInputValue] = useState(0);
  const resizableRef = useRef(null);

  useEffect(() => {
    const newResizableRef = resizableRef.current
    const gridItems = document.querySelectorAll('.gallery-img');

  
    const handleResize = () => {
      // eliminem classes anteriors i tornem a aplicar càlcul de cuadrícula.
      // delete 
      gridItems.forEach(item => {
        removeLastStaggeredClass(item)
      });
      getRowChange()
    };

    // we create a new observer to see any changes
    // if there is a size change we call handleResize function
    const resizeObserver = new ResizeObserver(handleResize);
    if (newResizableRef) {
      resizeObserver.observe(newResizableRef);
    }

    // clean the observer 
    return () => {
      if (newResizableRef) {
        resizeObserver.unobserve(newResizableRef);
      }
    };

  });

  function getRowChange() {
    const gridItems = document.querySelectorAll('.gallery-img');
    let previousTop = 0;
    let cont = 0;
    // we want to avoid first row
    const firstTop = gridItems[0].getBoundingClientRect().top;
    gridItems.forEach(item => {
      const currentTop = item.getBoundingClientRect().top;
      if (currentTop !== previousTop && currentTop !== firstTop) {
        // there's a row change --> we update cont and apply new class
        previousTop = currentTop;
        cont++
        removeLastStaggeredClass(item) // --> we remove any other staggered class before assigning new one
        item.classList.toggle(`staggered-${cont}`)
      } else if(currentTop === previousTop) {
        // they are on the same row, so they share same class
        removeLastStaggeredClass(item)
        item.classList.toggle(`staggered-${cont}`)
      }

    });
  }

  function removeLastStaggeredClass(element) {
    if (!element || !element.classList) return;
    const classes = Array.from(element.classList);
    const isStaggered = classes.some(c => c.startsWith('staggered-'));
    if (isStaggered) {
      const lastClass = classes.pop();
      element.classList.remove(lastClass);
    }
  }

  // we create the array
  const array = new Array(count).fill(null);

  // update grid items based on input value
  const handleClick = () => {
    setCount(inputValue);
  };

  // input onChange
  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    (!isNaN(value) && value >= 0) ? setInputValue(value) : setInputValue(0)
  };

  return (
    <>
      <h1>Dynamic Hexagonal CSS Grid</h1>

      <div className='logic-box'>
        <input type="number" value={inputValue} min="0" onChange={handleInputChange} />
        <button onClick={handleClick}>Update Grid Items</button>
      </div>

      <div className='gallery' ref={resizableRef}>
        {
          array.map((_, index) => (
            <div className="gallery-img" key={index}>
              <span>{index + 1}</span>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default App