import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';
import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
} from '@chakra-ui/react'

import './Topics.css';

import topicsData from '../../assets/topics/topics.json';

const topicClick = (topic, setShowDetails, setSelectedTopic) => {
    setSelectedTopic(topic);
    setShowDetails(true);
};

const TopicBarFactory = (topic, setShowDetails, setSelectedTopic, maxConversationsInTopic) => {

    const barFillPercent = topic.interactions / maxConversationsInTopic * 100;

    return (
        <React.Fragment key={uuidv4()}>
            <div className='row mb-3'>
                <div className='col-12'>
                    <div className='card'>
                        <div className={`card-body`}>
                            <div className='mb-1'>
                                Topic {topic.topicNumber}: {topic.topicName}

                                <div className='float-end'>
                                    <div className='topic-expand-details' onClick={() => { topicClick(topic, setShowDetails, setSelectedTopic) }}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{ width: '1em', height: '1em' }}
                                            fill="currentColor"
                                            className="bi bi-chevron-right"
                                            viewBox="0 0 16 16">
                                            <path
                                                fillRule="evenodd"
                                                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: 'small' }}>Number of Interactions: </div>
                            <div className="progress mb-2" style={{ height: '20px' }}>
                                <div className="progress-bar bg-info" style={{ width: `${barFillPercent}%` }}
                                    role="progressbar" aria-valuemin="0" aria-valuemax="100">
                                    {topic.interactions}
                                </div>
                            </div>
                            <div style={{ fontSize: 'small', fontStyle: 'italic' }}>
                                Most common words: &nbsp;
                                {   // this is done so that a comma is not rendered behind the final word
                                    topic.commonTerms.map((term, index) => {
                                        const res = index == topic.commonTerms.length - 1 ? <span key={uuidv4()}>{term}</span> : <span key={uuidv4()}>{term}, </span>
                                        return res;
                                    })
                                }
                            </div>
                        </div>
                    </div>

                </div >
            </div >
        </React.Fragment >
    )
}

// ---- intensity highlight for aggregate phrases functions ----- 
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
        }
    ));

    console.log(subWords)

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

const createAllWords = (message) => {
    let wordsArr = [];
    let usedIndexes = [];

    // create word array objects for sentiment substrings, don't reuse used indexes (entities take priority)
    const [intensityWords, usedIndexesWithIntensity] = createSubtypeWords(message.text, message.intensity, usedIndexes);
    wordsArr = [...wordsArr, ...intensityWords];
    usedIndexes = usedIndexesWithIntensity;

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
        case 'default': // no styling
            wordComponent = <React.Fragment key={uuidv4()}>
                <span>{word.text}</span>
            </React.Fragment>
            break;

        default: // one of 3 (light, med, dark) intensity stylings
            wordComponent = <React.Fragment key={uuidv4()}>
                <span className={`topic-selected-intensity-${word.type}`}>{word.text}</span>
            </React.Fragment>
    }

    return wordComponent;
}
// ---- end aggregrate phrase functions ----

const TopicDetails = (props) => {
    let selectedTopic = props.selectedTopic;

    // order by occurences (phrase freqency)
    selectedTopic.phrases.sort((a, b) => a.occurences - b.occurences);

    console.log(selectedTopic.phrases)

    return (
        <React.Fragment>
            <div className="row mt-3">
                <div className='col'>
                    <div className='card'>
                        <div className='card-body'>
                            <div className='float-start'>#{selectedTopic.topicNumber}: {selectedTopic.topicName}</div>
                            <div className='float-end'>
                                <Link to="/drill_down">
                                    <button className='button btn btn-sm btn-outline-secondary'>Drill Down</button>
                                </Link>
                            </div>
                        </div>
                        <div className='px-3'><hr /></div>
                        <div className='card-body ps-3 mt-2'>
                            <h4>Word Count</h4>
                            <StatGroup className='mb-3'>
                                <Stat>
                                    <StatNumber>{selectedTopic.basicStats.wordCount.min}</StatNumber>
                                    <StatLabel>Min</StatLabel>
                                </Stat>
                                <Stat>
                                    <StatNumber>{selectedTopic.basicStats.wordCount.avg}</StatNumber>
                                    <StatLabel>Avg</StatLabel>
                                </Stat>
                                <Stat>
                                    <StatNumber>{selectedTopic.basicStats.wordCount.max}</StatNumber>
                                    <StatLabel>Max</StatLabel>
                                </Stat>
                            </StatGroup>
                        </div>
                        <div className='card-body ps-3 mb-2'>
                            <h4>Sentence Complexity</h4>
                            <StatGroup>
                                <Stat>
                                    <StatNumber>{selectedTopic.basicStats.complexityPercent.agent}</StatNumber>
                                    <StatLabel>Agent</StatLabel>
                                </Stat>
                                <Stat>
                                    <StatNumber>{selectedTopic.basicStats.complexityPercent.customer}</StatNumber>
                                    <StatLabel>Customer</StatLabel>
                                </Stat>
                                <Stat>
                                    <StatNumber>{selectedTopic.basicStats.complexityPercent.avg}</StatNumber>
                                    <StatLabel>Avg</StatLabel>
                                </Stat>
                            </StatGroup>
                        </div>
                        <div className='px-5'><hr /></div>
                        <div className='card-body'>
                            {/* List header */}
                            <div className='row mb-3'>
                                <div className='col-2'>
                                    <h4>
                                        {/* chat icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-right-text" viewBox="0 0 16 16">
                                            <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z" />
                                            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                                        </svg>
                                    </h4>
                                </div>
                                <div className='col-10'><h4>Phrases</h4></div>
                            </div>
                            {
                                selectedTopic.phrases.map(phrase => {
                                    return (
                                        <React.Fragment key={uuidv4()}>
                                            <div className='row'>
                                                <div className='col-2'>{phrase.occurences}</div>
                                                <div className='col-10'>
                                                    {
                                                        createAllWords(phrase).map(word => wordFactory(word))
                                                    }
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

const Topics = () => {
    const topics = topicsData;
    const maxConversationsInTopic = topics[0]['interactions']; // assuming that the first topic has the most conversations in it

    const [showDetails, setShowDetails] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState({});

    return (
        <React.Fragment>
            <div className="container">
                <div className="row" style={{ marginTop: '20px' }}>
                    <div className="col">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-11">
                                        <h5 className="mb-0">Topic Modelling</h5>
                                    </div>
                                    <div className="col-1 text-end">
                                        <Link to="/"><i className="fa fa-close"></i></Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className='row'>
                                    {/* topic list */}
                                    <div className='col-8'>
                                        <div className='card mt-3'>
                                            <div className='card-body'>
                                                <div className='mb-2'>Topic List</div>
                                                <hr />
                                            </div>
                                            <div className='card-body'>
                                                <div className='topic-list-card pe-3'>
                                                    {
                                                        topics.map(topic => TopicBarFactory(topic, setShowDetails, setSelectedTopic, maxConversationsInTopic))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* topic details view */}
                                    <div className='col-4'>
                                        {showDetails && <TopicDetails selectedTopic={selectedTopic} />}
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div >
                </div >
            </div >
        </React.Fragment >
    )
}

export default Topics