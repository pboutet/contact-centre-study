import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// assets
import './SingleConversation.css';

// TODO: clean up subtype word creation and how it tracks used indexes
// instead of having to track the used indexes, every time a subtype word object gets created, replace
// the characters corresponding to the range of indexes for that word in the string with null characters
// then the filterIndicatorObjects filter on line 47 would only have to look for null characters in the string
// at which point set allowInFilteredList to false

// TODO: change these from JS files to JSON file imports, as was done in AggregateLinguistics.js
// import data from '../../assets/agg-analysis.json';
import KaileeMillerConversation from '../../assets/single_conversation/2d5a77b2-2977-4567-9a86-89cd539f8b9c.json';
import BenOffenbackConversation from '../../assets/single_conversation/267ef8f9-a576-4084-a818-c856e5aefb1f.json';
import AmandaIssacsonConversation from '../../assets/single_conversation/529afe7d-d0ac-4b20-ba3d-39ddaef165cd.json';
import SarahLockwoodConversation from '../../assets/single_conversation/a34531ca-ee71-4030-8278-f2555ac38808.json';

// TODO: remove imports once GET API call for conversations by id is done
// import { default as KaileeMillerConversation } from './2d5a77b2-2977-4567-9a86-89cd539f8b9c';
// import { default as BenOffenbackConversation } from './267ef8f9-a576-4084-a818-c856e5aefb1f';
// import { default as AmandaIssacsonConversation } from './529afe7d-d0ac-4b20-ba3d-39ddaef165cd';
// import { default as SarahLockwoodConversation } from './a34531ca-ee71-4030-8278-f2555ac38808';

// GLOBAL VARS
// TODO: remove this once conversations are GET API calls
const KaileeMillerConversationID = '2d5a77b2-2977-4567-9a86-89cd539f8b9c';
const AmandaIssacsonConversationID = '529afe7d-d0ac-4b20-ba3d-39ddaef165cd';
const SarahLockwoodConversationID = 'a34531ca-ee71-4030-8278-f2555ac38808';
const BenOffenbackConversationID = '267ef8f9-a576-4084-a818-c856e5aefb1f';

// helper function: return range of values as array between two integers, inclusive of min and max
const range = (min, max) => [...Array(max - min + 1).keys()].map(i => i + min);

// create unique sorted (ASC) list of used indexes
const appendUsedIndexes = (wordObjects, usedIndexes = []) => {
  let newUsedIndexes = usedIndexes;

  wordObjects.forEach(element => {
    newUsedIndexes = [...newUsedIndexes, ...range(element.start, element.end)];
  });

  // remove duplicates
  newUsedIndexes = [...new Set(newUsedIndexes)];

  // order numerically
  newUsedIndexes = newUsedIndexes.sort((a, b) => a - b);

  return newUsedIndexes;
}

// return word objects annoated with entity information or seniment information 
// as well as character indexes from the original string used to create these word objects
const createSubtypeWords = (originalText, indicatorObjects, usedIndexes = []) => {

  // filter out indicatorObjects where the range(start, end) indicated appear in usedIndexes
  const filteredIndicatorObjects = indicatorObjects.filter(indicatorObj => {

    // array of indexes of characters in this word object
    const wordIndexes = range(indicatorObj.start, indicatorObj.end);

    // boolean to indicate whether any one of the indexes in wordIndexes appears in usedIndexes
    const overlapFound = wordIndexes.some(element => usedIndexes.indexOf(element) >= 0);

    // fail filter if overlap is found
    const allowInFilteredList = overlapFound ? false : true;

    return allowInFilteredList;
  });

  // create word objects
  let subWords = filteredIndicatorObjects.map(element => (
    {
      ...element,
      text: originalText.slice(element.start, element.end + 1), // want start and end of indicators (inclusive), and slice function is not inclusive of end index
      type: 'entity_group' in element ? 'entity' : 'intensity'
    }
  ));

  // append the new word used indexes to given used indexes
  let newUsedIndexes = appendUsedIndexes(subWords, usedIndexes);

  // return new words and usedIndexes
  return [subWords, newUsedIndexes];
}

// create array of chars objects that were not used in creating entity or intensity/sentiment word objects
const createDefaultWords = (originalText, usedIndexes = []) => {

  // split original string into char array
  const charArr = originalText.split('');

  // create array of default character objects
  let charObjects = charArr.map((char, index) => (
    {
      text: char,
      start: index,
      end: index,
      type: 'default'
    }
  ));

  // filter out charater objects that were already used in entity or intensity/sentiment
  charObjects = charObjects.filter(charObj => usedIndexes.indexOf(charObj.start) === -1);

  return charObjects;
}

const createAllWords = (message, showIntensity = false, showEntities = false) => {
  let wordsArr = [];
  let usedIndexes = [];

  // create word array objects for entity substrings
  if (showEntities) {
    const [entityWords, entityUsedIndexes] = createSubtypeWords(message.text, message.entities);
    wordsArr = [...wordsArr, ...entityWords];
    usedIndexes = entityUsedIndexes;
  }

  // create word array objects for sentiment substrings, don't reuse used indexes (entities take priority)
  if (showIntensity) {
    const [intensityWords, usedIndexesWithIntensity] = createSubtypeWords(message.text, message.sentiment_highlight, usedIndexes);
    wordsArr = [...wordsArr, ...intensityWords];
    usedIndexes = usedIndexesWithIntensity;
  }
  // create word array objects for each unused character (not entities, not sentiment highlighted)
  const defaultCharObjects = createDefaultWords(message.text, usedIndexes);
  wordsArr = [...wordsArr, ...defaultCharObjects];

  // order the words by start index
  wordsArr = wordsArr.sort((a, b) => a.start - b.start);

  return wordsArr;
}

// component factory to display each word object within the text of an individual message
const wordFactory = (word) => {
  let wordComponent = <React.Fragment></React.Fragment>;

  switch (word.type) {
    case 'entity':
      wordComponent = <React.Fragment key={uuidv4()}>
        <span className={`single-conversation-entity-outline-${word.entity_group}`}>
          &nbsp;{word.text}&nbsp;
          <span className={`single-conversation-entity-tag-${word.entity_group} small`}>
            &nbsp; {word.entity_group} &nbsp;
          </span>
        </span>
      </React.Fragment>;
      break;

    case 'intensity':
      wordComponent = <React.Fragment key={uuidv4()}>
        <span className={`single-conversation-intensity-${word.sentiment_group}`}>{word.text}</span>
      </React.Fragment>
      break;

    default:
      wordComponent = <React.Fragment key={uuidv4()}>
        <span>{word.text}</span>
      </React.Fragment>
  }

  return wordComponent;
}

// component factory to display messages
// decision to display sentiment border here
const messageFactory = (message, showSentimentBorderColor = false, showIntensity = false, showEntities = false) => {
  let sentimentBorderClass = showSentimentBorderColor ? ` single-conversation-msg-border-${message.sentiment_border}` : '';

  // temp
  createAllWords(message, true, true);

  return (
    <React.Fragment key={uuidv4()}>
      <div className="row">
        <div className={`col-8${message.speaker.toLowerCase() === 'agent' ? ' offset-4' : ''}`}>
          <div className={`single-conversation-msg${sentimentBorderClass}`}>
            <p style={{ marginBottom: '0px' }}>
              {
                createAllWords(message, showIntensity, showEntities).map(word => wordFactory(word))
              }
            </p>
          </div>
          <p className="text-end text-muted small">{message.datetime}</p>
        </div>
      </div>
    </React.Fragment>
  )
};

// TODO: once API routes to get conversation are set up, turn this into getConversation function
// select which of imported conversations to display
const chooseConversation = (conversationID) => {
  let conversation = {};

  switch (conversationID) {
    case KaileeMillerConversationID:
      conversation = KaileeMillerConversation;
      break;

    case AmandaIssacsonConversationID:
      conversation = AmandaIssacsonConversation;
      break;

    case SarahLockwoodConversationID:
      conversation = SarahLockwoodConversation;
      break;

    default:
      conversation = BenOffenbackConversation;
      break;
  }

  return conversation;
}

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const SingleConversation = () => {
  const { conversation_id } = useParams();
  const conversation = chooseConversation(conversation_id);

  let query = useQuery();

  const [sentimentToggle, setSentimentToggle] = useState(false);
  const [intensityToggle, setIntensityToggle] = useState(false);
  const [entitiesToggle, setEntitiesToggle] = useState(false);
  const [conversationClass, setConversationClass] = useState('');

  const toggleChange = (currentValue, setToggle) => {
    setConversationClass('single-conversation-convo-fade-out');
    setTimeout(() => {
      setConversationClass('single-conversation-convo-hide')
      setToggle(!currentValue);
    }, 200);
    setTimeout(() => {setConversationClass('single-conversation-convo-fade-in')}, 400);
    setTimeout(() => {setConversationClass('')}, 1500);
  }

  return (
    <React.Fragment>
      <div className="container" style={{ marginTop: '20px' }}>
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-11">
                <div className="row">
                  <div className="col">
                    <h5 className="mb-0">{conversation.agent_name}</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <p className="small text-muted">
                      {conversation.datetime}  |  Star Rating:&nbsp;
                      {
                        [...Array(conversation.num_stars)].map((e, i) => <i key={uuidv4()} className="fa fa-star"></i>)
                      }<br />
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-1 text-end">
                <Link to="/"><i className="fa fa-close"></i></Link>
              </div>
            </div>
          </div>
          <div className='card-body'>
            <div className='row mb-3 px-md-5'>
              <div className='col'>
                <div className='form-check form-switch'>
                  <input type='checkbox' className='form-check-input' checked={sentimentToggle} onChange={() => { toggleChange(sentimentToggle, setSentimentToggle) }} />
                  <label className='form-check-label'>Message Sentiment</label>
                </div>
                <div className='form-check form-switch'>
                  <input type='checkbox' className='form-check-input' checked={intensityToggle} onChange={() => { toggleChange(intensityToggle, setIntensityToggle) }} />
                  <label className='form-check-label'>Intensity</label>
                </div>
                <div className='form-check form-switch'>
                  <input type='checkbox' className='form-check-input' checked={entitiesToggle} onChange={() => { toggleChange(entitiesToggle, setEntitiesToggle) }} />
                  <label className='form-check-label'>Entities</label>
                </div>
              </div>
            </div>

            <div className='row'>
              <div className='px-md-5'>
                <div className={`card single-conversation-msg-container ${conversationClass}`}>
                  {conversation.messages.map(message => messageFactory(message, sentimentToggle, intensityToggle, entitiesToggle))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
};


export default SingleConversation;
