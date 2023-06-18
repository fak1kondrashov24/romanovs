import React, { useState, useEffect, useRef } from 'react';
import Xarrow, { Xwrapper } from 'react-xarrows'
import './App.css';
import romanovs from './romanovs.json';
import history from './history.json';


function App() {
  const [year, setYear] = useState(0);

  return (
    <div id='main'>
      <Information year={year} />
      <Year setYear={setYear} year={year} />
      <Tree year={year} />
    </div>
  )
}

const facts = (year) => {
  const fact = history.find(info => {
    return parseInt(info.year) === parseInt(year);
  });
  
  return(fact)
}


function Information({ year }) {  
  const fact = facts(year)

  let fact_info = fact.info;
  let fact_text = fact.text;

  return (
    <div id='information'>
    <div id='information_scroll'>
      <div id='title'>{fact_info}</div>
      <div id='text' dangerouslySetInnerHTML={{__html: fact_text}}></div>
    </div>
    </div>
  )
}


function Year({ year, setYear }) {  

  const yearChangeByRange = (event) => {
    setYear(event.target.value);
  }

  const yearNull = () => {
    const yearBegin = () => {
      setYear(1613);
    }
    
    return(
      <div id="year_click">
        <button id="year_null" onClick = {yearBegin}>СТАРТ</button>
      </div>
    )
  }

  return (
    <div id="year_choose">
      <input type="range" id="year_range" onChange={yearChangeByRange} value={year} min="1613" max="1801" step="1"></input>
      {year === 0 ? yearNull() : <YearNotNull year={year} setYear={setYear} />}
    </div>
  )
}

function YearNotNull ({year, setYear}) {
  
  const yearChanged = (year_new) => {
    setYear(year_new); 
  }

  const yearUp = () => {
    if (year === 1801) {
      alert("Родословная представлена только с 1613 по 1801 год")
    } else {
      return( yearChanged(parseInt(year) + 1) )
    }
  }

  const yearDown = () => {
    if (year === 1613) {
      alert("Родословная представлена только с 1613 по 1801 год")
    } else {
      yearChanged(parseInt(year) - 1)
    }
  }

  return(
    <div id="year_click">
      <button className="year_button" id="year_down" onClick = {yearDown}></button>
      <div id="year_text">{year}</div>
      <button className="year_button" id="year_up" onClick = {yearUp}></button>
    </div> 
  )
}


function Tree({year}) {
  let romanovs_born = [];
  let fact = facts(year);
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
  
  const create = (person) => {
    if (person.id === 63) {
      return ( <div style={{ position: 'absolute', zIndex: '0'}}> <svg width ='43' height ='40.599998474121094' overflow ='auto' style= {{ position: 'absolute', left: '1341.01px', top: '-36.6px', pointerEvents: 'none'}}> <path d ='M 39 4 C 39 30.0799987792968876, 4 10.519999694824218, 4 36.599998474121094' stroke ='gray' strokeDasharray ='0 0' strokeWidth ='1' fill ='transparent' pointerEvents ='visibleStroke'></path></svg></div>)
    }

    if (person.id === 64) {
      return ( <div style={{ position: 'absolute', zIndex: '0'}}> <svg width ='43' height ='40.599998474121094' overflow ='auto' style={{position: 'absolute', left: '1376px', top: '-36.6px', pointerEvents: 'none'}}><path d ='M 4 4 C 4 30.079998779296876, 39 10.519999694824218, 39 36.599998474121094' stroke ='gray' strokeDasharray ='0 0' strokeWidth ='1' fill ='transparent' pointerEvents ='visibleStroke'></path></svg></div> )
    }
    
    switch (person.creation) {
      default : return
      case 'left': return ( <div className='fake' id = {'parents_id' + person.id} style={{left: person.position + 60 - 5 + 'px'}} /> )
      case 'right': return ( <div className='fake' id = {'parents_id' + person.id} style={{left: person.position - 10 - 5 + 'px'}}></div> )
      case 'child': return ( <Xarrow key = {'arrow_' + person.id} start = {'parents_id' + person.creator} end={'id' + person.id} startAnchor = 'bottom' endAnchor = 'top' color='gray' strokeWidth = {1} showHead={false}></Xarrow> )
    }
  }
  
  const born_romanovs = generation.map((person) => (
    <Xwrapper>
      <Person fact = {fact} key = {'person' + person.id} year = {year} id = {person.id} name = {person.name} image = {person.image} year_born = {person.year_born} year_died = {person.year_died} age_died={person.age_died} year_start={person.year_start} year_finish={person.year_finish} ruler={person.ruler} position = {person.position} />
      {create(person)}
      <div className='person-background' style={{left: person.position + 'px'}}></div>
    </Xwrapper>
  ))

  return (born_romanovs)
}

function Person({year, id, name, image, year_born, year_died, age_died, year_start, year_finish, ruler, position}) {
  let age_number = 0;
  let isDead = '';
  let isKing = '';
  let isTold = ''; 

  const fact = facts(year)
  if (fact.persons.includes(id)) {
    isTold = ' told'
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
    <div className={'person' + isDead + isTold} id={'id' + id} style={{left: position + 'px'}}>
      <div className='name' dangerouslySetInnerHTML={{__html: name}} />
      <div className='based'>
        <img className='image' src={require('./images/' + image + '.png')} alt={"Портрет " + name} />
        <div className='right'>
          <div className='extra'>
            {(isKing === 'ruler') ? <img className='czar_icon' src={require("./images/crown.png")} alt="Этот человек был правителем" /> : ''}
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