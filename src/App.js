import React, { useState, useEffect, useRef } from 'react';
import Xarrow, { Xwrapper } from 'react-xarrows'
import './App.css';
import romanovs from './romanovs.json';
import history from './history.json';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }


function App() {
  const [year, setYear] = useState(0);

  return (
    <div id='main'>
      <Information year={year} />it
      <Year setYear={setYear} year={year} />
      <Tree year={year} />
    </div>
  );
}

const facts = (year) => {
  const fact = history.find(info => {
    return parseInt(info.year) === parseInt(year);
  });
  
  return(fact)
}


function Information({ year }) {  
  let fact_year = 0;
  let fact_info = '';
  let fact_text = '';

  const fact = facts(year)

  if (fact !== undefined) {
    fact_year = fact.year;
    fact_info = fact.info;
    fact_text = fact.text;
  }

  return (
    <div id='information'>
      <div id='title'>{fact_info}</div>
      <div id='text'>{fact_text}</div>
    </div>
  )
}

function Year({ year, setYear }) {  
  
  const yearChanged = (year_new) => {
    setYear(year_new); 
  }
  
  const yearChangeByRange = (event) => {
    yearChanged(event.target.value);
  }

  const yearUp = (event) => {
    if (year < 1801 && year >= 1612) {
      yearChanged(parseInt(year) + 1);
    }
    else {
      alert("Родословная представлена только с 1612 по 1801 гг. \n Передвиньте ползунок.")
    }
  }

  const yearDown = (event) => {
    if (year > 1612 && year <= 1801) {
      yearChanged(parseInt(year) - 1);
    }
    else {
      alert("Родословная представлена только с 1612 по 1801 гг. \nПередвиньте ползунок.")
    }
  }

  return (
    <div id="year_choose">
      <input type="range" id="year_range" onChange={yearChangeByRange} value={year} min="1612" max="1801" step="1"></input>
      <div id="year_click">
        <button className="year_button" id="left" onClick = {yearDown}></button>
        <div id="year">{year}</div>
        <button className="year_button" id="rigth" onClick = {yearUp}></button>
      </div>
    </div>
  )
}


function Tree({year, fact}) {
  let romanovs_born = [];
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current.scrollTo(685, 0);
  }, []);
  
  if (year !== 0) {
    romanovs_born = romanovs.map((people) => (
      people.filter((person) => (parseInt(person.year_show) <= parseInt(year)))
    ));
  } else {
    romanovs_born = romanovs;
  }

  const romanovs_born_now = romanovs_born.map((generation, index) => (
    <div className='generation' key={index}>
      <Generation generation = {generation} year = {year} fact={fact}/>
    </div>
  ))

  return (
    <div id='tree' ref={scrollRef}><div id='tree_scroll'>{romanovs_born_now}</div></div>
  )
}

function Generation({year, fact, generation}) {
  
  const create = (creation, person) => {
    switch (creation) {
      case 'left': return ( <Fake id = {person.id} position = {person.position + 60 - 5}/> )
      case 'right': return ( <Fake id = {person.id} position = {person.position - 10 - 5}/> )
      case 'child': return ( <Xarrow key = {'arrow_' + person.id} start = {'parents_id' + person.creator} end={'id' + person.id} startAnchor = 'bottom' endAnchor = 'top' color='gray' strokeWidth = {1} showHead={false}></Xarrow> )
    }
  }
  
  const born_romanovs = generation.map((person) => (
    <Xwrapper>
      <Person fact = {fact} key = {'person' + person.id} year = {year} id = {person.id} name = {person.name} year_born = {person.year_born} year_show = {person.year_show} year_died = {person.year_died} age_died={person.age_died} year_start={person.year_start} year_finish={person.year_finish} ruler={person.ruler} position = {person.position} />
      {create(person.creation, person)}
      <div className='person-background' style={{left: person.position + 'px'}}></div>
    </Xwrapper>
  ))

  return (born_romanovs)
}

function Fake({id, position}) {
  return (
    <div className='fake' id = {'parents_id' + id} style={{left: position + 'px'}}></div>
  )
}

function Person({year, id, name, year_born, year_show, year_died, age_died, year_start, year_finish, ruler, position}) {
  let age_number = 0;
  let isDead = '';
  let isKing = '';
  let isFact = ''; 

  const fact = facts(year)
  if (fact !== undefined) {
    if (fact.persons.includes(id)) {
      isFact = ' told'
    }
  }

  if (year >= year_died) {
    isDead = ' died';
    age_number = age_died;
  } else if (year === 0) {
    age_number = age_died;
  } else {
    if (year_born === '?') {
      age_number = '?';
    } else {
      age_number = year - year_born;
    }
  }

  if (ruler === true) {
    if (year === 0) {
      isKing = 'ruler'
    } else if (year >= year_start && year_finish >= year) {
      isKing = 'ruler';
    } else {
      isKing = '';
    }
  }

  const age_word = (age) => {
    let word = '';
    if ((0 < age % 10) && (age % 10 <= 4) ) {
      word = 'г.';
    }
    else {
      word = 'л.';
    }
    return (word)
  }


  return (
    <div className={'person' + isDead + isFact} id={'id' + id} style={{left: position + 'px'}}>
      <div className='name'>{name}</div>
      <div className='based'>
        <div className='image'></div>
        <div className='right'>
          <div className='extra'>
            {(isKing === 'ruler') ? <div className='czar_icon'></div> : ''}
          </div>
          <div className='age'>
            <div className='age_number'>{age_number}</div>
            <div className='age_word'>{age_word(age_number)}</div>
          </div>
        </div>
      </div>
      <div className='years'>( {year_born} - {year_died} )</div>
    </div>
  )
}


export default App;