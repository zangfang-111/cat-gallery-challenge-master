
/*
- Write a React component that fetches the data from the link below 
and shows a gallery of cats in various moods.
- When the start or end is reached, the gallery should cycle to the 
opposite end.
- The left and right buttons should trigger a sliding animation to the 
next/previous image 
(example: https://raw.githubusercontent.com/farzadso/Bootstrap-Carousel/master/preview.gif)
- The preview panel at the bottom should move one image to the left or 
right when the buttons are clicked.
- The gallery can have a maximum width of 500 but should be responsive 
if the window is made smaller.
*/

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const link = 'https://gist.githubusercontent.com/manfredxu99/df3be12d855d2e8825d30784a43d4b31/raw/d5efd3062343703df33bf0ec1b0c469fb83cb9f9/cat.json';
// const CHEVRON_LEFT_SRC = 'https://icons.deanishe.net/icon/material/444/arrow-back/256.png'
// const CHEVRON_RIGHT_SRC = 'https://icons.deanishe.net/icon/material/444/arrow-right/256.png'

const FlexSlider = {
	// total no of items
	num_items: document.querySelectorAll(".slider-item").length,
	
	// position of current item in view
	current: 1,

	init: function() {
		// set CSS order of each item initially
		document.querySelectorAll(".slider-item").forEach(function(element, index) {
			element.style.order = index+1;
		});

		this.addEvents();
	},

	addEvents: function() {
		var that = this;

		// click on move item button
		document.querySelector("#move-button").addEventListener('click', () => {
			this.gotoNext();
		});

		// after each item slides in, slider container fires transitionend event
		document.querySelector("#slider-container").addEventListener('transitionend', () => {
			this.changeOrder();
		});
	},

	changeOrder: function() {
		// change current position
		if(this.current == this.num_items)
			this.current = 1;
		else 
			this.current++;

		let order = 1;

		// change order from current position till last
		for(let i=this.current; i<=this.num_items; i++) {
			document.querySelector(`.slider-item[value=${i}]`).style.order = order;
			order++;
		}

		// change order from first position till current
		for(let i=1; i<this.current; i++) {
			console.log('--i--', i)
      document.querySelector(`.slider-item[${i}]`).style.order = order;
      order++;
		}

		// translate back to 0 from -100%
		// we don't need transitionend to fire for this translation, so remove transition CSS
		document.querySelector("#slider-container").classList.remove('slider-container-transition');
		document.querySelector("#slider-container").style.transform = 'translateX(0)';
	},

	gotoNext: function() {
		// translate from 0 to -100% 
		// we need transitionend to fire for this translation, so add transition CSS
		document.querySelector("#slider-container").classList.add('slider-container-transition');
		document.querySelector("#slider-container").style.transform = 'translateX(-100%)';
	}
};

/**
 * Cats gallery component.
 */
function CatGallery () {
  const [cats, setCats] = useState(null)

  // The useEffect for fetch cats data as componentDidMount lifecycle.
  useEffect(() => { fetchData() }, [])

  /**
   * Cats data fetch function with using axios and try / cache.
   * used async / await
   */
  async function fetchData () {
    try {
      const response = await axios.get(link)
      setCats(response.data.cats)
      FlexSlider.init();
    } catch (error) {
      console.log(error)
    }
  }

  // if cats data is null, the loading section.
  if (!cats) return <div />

  return (
    <section className='carousel' aria-label='Gallery'>
      <div id="slider-container-outer">
      <div id="slider-container" className="slider-container-transition">
        <div className="slider-item" value="1">Item 1</div>
        <div className="slider-item" value="2">Item 2</div>
        <div className="slider-item" value="3">Item 3</div>
        <div className="slider-item" value="4">Item 4</div>
      </div>
    </div>
    <button id="move-button">Move Item</button>
    </section>
  )
}

export default CatGallery