import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

// assets
import data from '../../assets/agg-analysis.json';

//helper functions
//------------------------------------------------------
let maxNgram = 8;

const tdFactory = (tdContents) => {
  return (
    <React.Fragment key={`td-key-${uuidv4()}`}>
      <td key={`td-key-${uuidv4()}`}>{tdContents}</td>
    </React.Fragment>
  )
};
const trFactory = (trContents, key) => {
  return (
    <React.Fragment key={`tr-key-${uuidv4()}`}>
      <tr key={`tr-key-${uuidv4()}`}>{trContents}</tr>
    </React.Fragment>
  )
}

const rowsArrayFactory = (ngramData, tablePrefix) => {
  let contents = ngramData.map((element, index) => {
    // construct td
    let rank = tdFactory(element.rank.toString());
    let occurences = tdFactory(element.occurences.toString());
    let phrase = tdFactory(element.phrase.toString());

    // construct row
    let row = trFactory([rank, occurences, phrase], `${tablePrefix}_${index}`);
    return row;
  });

  return contents;
};

const wordIntensityFactory = (word) => {
  let sentimentClass = "";

  switch (word.intensity) {
    case 3:
      sentimentClass = "single-conversation-intensity-dark";
      break;

    case 2:
      sentimentClass = "single-conversation-intensity-med";
      break;

    case 1:
      sentimentClass = "single-conversation-intensity-light";
      break;

    default:
      break;
  }

  return (
    <React.Fragment key={`word-intensity-${uuidv4()}`}>
      <span key={`word-intensity-${uuidv4()}`} className={sentimentClass}>{word.text}</span>
    </React.Fragment>
  );
}

const intensityRowsFactory = (intensityData, tablePrefix) => {

  let contents = intensityData.map((element, index) => {
    // construct td
    let rank = tdFactory(element.rank.toString());
    let occurences = tdFactory(element.occurences.toString());
    let phrase = tdFactory(element.phrase.map(word => wordIntensityFactory(word)));

    // construct row
    let row = trFactory([rank, occurences, phrase], `${tablePrefix}_${index}`);
    return row;
  });

  return contents;
}

const tableFactory = (contents, tableName) => {
  return (
    <React.Fragment key={`table-factory-key-${uuidv4()}`}>
      <div className="table-responsive" key={uuidv4()}>
        <table className="table table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th colSpan="1">Rank</th>
              <th>Occurrences</th>
              <th>Phrase</th>
            </tr>
          </thead>
          <tbody id={tableName}>
            {contents}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  )
}

const accordionItemFactory = (contents, accordionName, index) => {
  let itemName = `.item-${index}`;

  return (
    <React.Fragment key={`accordionItemFactory-${uuidv4()}`}>
      <div className="accordion-item" key={uuidv4()}>
        <h2 className="accordion-header" role="tab">
          <button className={`accordion-button ${index === 1 ? "" : "collapsed"}`} data-bs-toggle="collapse" data-bs-target={`${accordionName} ${itemName}`}
            aria-expanded={`${index === 1 ? true : false}`} aria-controls={`${accordionName.substring(1)} ${itemName}`}>
            Most Common {index} Word Phrases
          </button>
        </h2>
        <div className={`accordion-collapse collapse ${index === 1 ? "show" : ""} ${itemName.substring(1)}`} role="tabpanel"
          data-bs-parent={accordionName}>
          <div className="accordion-body">
            {contents}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

const accordItemsArrayFactory = (tabName, accordionName, rowData) => {
  let accordionItems = [];
  let tableRows = [];

  for (let i = 1; i <= maxNgram; i++) {

    if (tabName === 'intensity') {
      tableRows = intensityRowsFactory(rowData[`${i}_gram`], `${tabName}_${i}_gram`);
    } else {
      tableRows = rowsArrayFactory(rowData[`${i}_gram`], `${tabName}_${i}_gram`);
    }
    let table = tableFactory(tableRows, `${tabName}_${i}_gram`);
    let item = accordionItemFactory(table, accordionName, i);
    accordionItems.push(item);
  }

  return accordionItems;
}

const mostCommonAccordItems = accordItemsArrayFactory('most_common', `#accordion-1`, data.most_common);
const intensityAccordItems = accordItemsArrayFactory('intensity', `#accordion-2`, data.intensity);
const positiveAccordItems = accordItemsArrayFactory('postive_phrases', `#accordion-3`, data.most_common);
const neutralAccordItems = accordItemsArrayFactory('neutral_phrases', `#accordion-4`, data.most_common);
const negativeAccordItems = accordItemsArrayFactory('negative_phrases', `#accordion-5`, data.most_common);
// end helper functions -------------------------------

const AggregateLinguistics = () => {

  return (
    <React.Fragment>
      <div className="container">
        <div className="row" style={{ marginTop: '20px' }}>
          <div className="col">
            <div className="card">
              <div className="card-header">
                <div className="row">
                  <div className="col-11">
                    <h5 className="mb-0">Aggregate Analysis</h5>
                  </div>
                  <div className="col-1 text-end">
                    <Link to="/"><i className="fa fa-close"></i></Link>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div>
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a className="nav-link active" role="tab" data-bs-toggle="tab" href="#tab-1">Basic Stats</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link" role="tab" data-bs-toggle="tab" href="#tab-2">Most Common Phrases</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link" role="tab" data-bs-toggle="tab" href="#tab-3">Intensity/Importance</a>
                    </li>
                    {/* TODO: put these back in once data is available */}
                    {/* <li className="nav-item" role="presentation">
                      <a className="nav-link" role="tab" data-bs-toggle="tab" href="#tab-4">Positive Phrases</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link" role="tab" data-bs-toggle="tab" href="#tab-5">Neutral Phrases</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link" role="tab" data-bs-toggle="tab" href="#tab-6">Negative Phrases</a>
                    </li> */}
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane fade show active" role="tabpanel" id="tab-1">
                      <div className="row" style={{ marginTop: '20px' }}>
                        <div className="col">
                          <div className="card">
                            <div className="card-body">
                              <h4 className="card-title">Basic Stats</h4>
                              <div className="table-responsive">
                                <table className="table table-striped table-hover table-borderless">
                                  <tbody>
                                    <tr>
                                      <td>Average Word Count</td>
                                      <td>467</td>
                                    </tr>
                                    <tr>
                                      <td>Minimum Word Count</td>
                                      <td>203</td>
                                    </tr>
                                    <tr>
                                      <td>Maximum Word Count</td>
                                      <td>798</td>
                                    </tr>
                                    <tr>
                                      <td>Average Agent Utterance</td>
                                      <td>379</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col">
                          <div className="card">
                            <div className="card-body">
                              <h4 className="card-title">Complexity Metrics</h4>
                              <div className="table-responsive">
                                <table className="table table-striped table-hover table-borderless">
                                  <tbody>
                                    <tr>
                                      <td>Average Complexity % -&nbsp;Agent Utterances</td>
                                      <td>56%</td>
                                    </tr>
                                    <tr>
                                      <td>Average Complexity % -&nbsp;Customer Utterances</td>
                                      <td>37%</td>
                                    </tr>
                                    <tr>
                                      <td>Average Complexity % - Document Wide</td>
                                      <td>45%</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" role="tabpanel" id="tab-2">
                      <div className="accordion" role="tablist" id="accordion-1" style={{ marginTop: '10px' }}>
                        {mostCommonAccordItems}
                      </div>
                    </div>
                    <div className="tab-pane fade" role="tabpanel" id="tab-3">
                      <div className="accordion" role="tablist" id="accordion-2" style={{ marginTop: '10px' }}>
                        {intensityAccordItems}
                      </div>
                    </div>
                    {/* TODO: put this back in one pos/neutral/neg data available */}
                    {/* <div className="tab-pane fade" role="tabpanel" id="tab-4">
                      <div className="accordion" role="tablist" id="accordion-3" style={{ marginTop: '10px' }}>
                        {positiveAccordItems}
                      </div>
                    </div>
                    <div className="tab-pane fade" role="tabpanel" id="tab-5">
                      <div className="accordion" role="tablist" id="accordion-4" style={{ marginTop: '10px' }}>
                        {neutralAccordItems}
                      </div>
                    </div>
                    <div className="tab-pane fade" role="tabpanel" id="tab-6">
                      <div className="accordion" role="tablist" id="accordion-5" style={{ marginTop: '10px' }}>
                        {negativeAccordItems}
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
};

AggregateLinguistics.defaultProps = {};

export default AggregateLinguistics;
