import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import DefaultConversationList from '../../assets/main/default.json';
import DrillDownConversationList from '../../assets/main/drill_down.json';

// assets
import './Main.css';

const Main = ({ drillDown = false }) => {

  const conversations = drillDown ? DrillDownConversationList : DefaultConversationList;

  return (
    <React.Fragment>
      <div className="container text-start mx-auto " style={{ margin: '10px 30px' }}>
        <div className="row">
          <div className="col-auto col-sm-12 col-md-12 col-lg-4">
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="mb-0">Conversation Filters</h5>
              </div>
              <div className="card-body">
                <form className="text-start mb-3">
                  <label className="form-label">Star Rating (1 - 5)</label>
                  <div id="star-checkboxes">
                    <div className="form-check"><input className="form-check-input" type="checkbox" id="formCheck-4" /><label
                      className="form-check-label" htmlFor="formCheck-4"><i
                        className="fa fa-star"></i>&nbsp;&nbsp;&nbsp;&nbsp;</label></div>
                    <div className="form-check"><input className="form-check-input" type="checkbox" id="formCheck-6" /><label
                      className="form-check-label" htmlFor="formCheck-4"><i className="fa fa-star"></i>&nbsp;<i
                        className="fa fa-star"></i>&nbsp;&nbsp;&nbsp;</label></div>
                    <div className="form-check"><input className="form-check-input" type="checkbox" id="formCheck-5" /><label
                      className="form-check-label" htmlFor="formCheck-4"><i className="fa fa-star"></i>&nbsp;<i
                        className="fa fa-star"></i>&nbsp;<i className="fa fa-star"></i>&nbsp;&nbsp;</label></div>
                    <div className="form-check"><input className="form-check-input" type="checkbox" id="formCheck-1" /><label
                      className="form-check-label" htmlFor="formCheck-4"><i className="fa fa-star"></i>&nbsp;<i
                        className="fa fa-star"></i>&nbsp;<i className="fa fa-star"></i>&nbsp;<i
                          className="fa fa-star"></i>&nbsp;</label></div>
                    <div className="form-check" style={{ marginBottom: '10px' }}><input className="form-check-input" type="checkbox"
                      id="formCheck-4" /><label className="form-check-label" htmlFor="formCheck-4"><i
                        className="fa fa-star"></i>&nbsp;<i className="fa fa-star"></i>&nbsp;<i className="fa fa-star"></i>&nbsp;<i
                          className="fa fa-star"></i>&nbsp;<i className="fa fa-star"></i></label></div>
                  </div>
                  <label className="form-label" style={{ marginBottom: '10px' }}>Issue Filter</label>
                  <select className="form-select" style={{ marginBottom: '10px' }}>
                    <option key={uuidv4()} value="1265" defaultValue>Feedback</option>
                    <option key={uuidv4()} value="1347">Product Information</option>
                    <option key={uuidv4()} value="888">Gift Card Inquiry</option>
                    <option key={uuidv4()} value="895">Product Issue</option>
                  </select>
                  <label className="form-label" style={{ marginBottom: '10px' }}>Start Date/Time</label>
                  <input className="form-control" type="datetime-local" style={{ marginBottom: '10px' }} />
                  <label className="form-label" style={{ marginBottom: '10px' }}>End Date/Time</label>
                  <input className="form-control" type="datetime-local" style={{ marginBottom: '10px' }} />
                  <label className="form-label" style={{ marginBottom: '10px' }}>Agent Filter</label>
                  <select className="form-select" style={{ marginBottom: '10px' }}>
                    <option key={uuidv4()} value="1265" defaultValue>John Addams</option>
                    <option key={uuidv4()} value="1347">Jane Doe</option>
                    <option key={uuidv4()} value="2">Amanda Issacson</option>
                    <option key={uuidv4()} value="3">Sarah Lockwood</option>
                    <option key={uuidv4()} value="8">Ben Offenback</option>
                    <option key={uuidv4()} value="4">Jess Smith</option>
                    <option key={uuidv4()} value="1">Cameron Yang</option>
                  </select>
                  <label className="form-label" style={{ marginBottom: '10px' }}>Customer Filter</label>
                  <select className="form-select" style={{ marginBottom: '10px' }}>
                    <option key={uuidv4()} value="">Annie Gates</option>
                    <option key={uuidv4()} value="">Michele Good</option>
                    <option key={uuidv4()} value="">Alejandra Harris</option>
                    <option key={uuidv4()} value="">Leah Hensley</option>
                    <option key={uuidv4()} value="">Lawanda Mata</option>
                    <option key={uuidv4()} value="">Dino Rosales</option>
                    <option key={uuidv4()} value="">Deidre Shepard</option>
                    <option key={uuidv4()} value="">Alma Yates</option>
                  </select>
                </form>
                {
                  drillDown
                    ?
                    <div className='d-flex justify-content-end'>
                      <Link to="/">
                        <div className='btn btn-outline-secondary'>Clear Drill Down</div>
                      </Link>
                    </div>
                    :
                    <div></div>
                }
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                Analysis Selector
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    
                    <Link to="/topics"><div className="btn btn-lg btn-outline-secondary">Explore Topics</div></Link>
                    
                  </div>
                </div>
              
              </div>
            </div>
          </div>

          {/* conversations main section */}
          <div className="col-md-12 col-lg-8">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Matching Conversations</h5>
              </div>
              <div className="card-body">
                <div className="row" style={{ marginBottom: '15px' }}>
                  <div className="col-md-12 col-lg-9">
                    <form>
                      <div className="input-group pl-4">
                        <input type="text" className="form-control" />
                        <button className="btn btn-dark" type="button">
                          <i className="fa fa-search"></i>
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-12 col-lg-3 text-center align-self-center">
                    <small className="text-center">3,000 Conversations</small>
                  </div>
                </div>
                <div className="row">
                  <div className="col text-start" style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
                    <ul className="list-group">
                      {
                        conversations.map((element, index) => {
                          return (
                            <React.Fragment key={uuidv4()}>
                              <li key={`main-conversation-list-${uuidv4()}`} className="list-group-item" style={{ borderWidth: '0px' }}>
                                <Link to={`/single_conversation/${element.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                  <div className="card conversation-card">
                                    <div className="card-body">
                                      <h4 className="card-title">{element.agent_name}</h4>
                                      <div className="row">
                                        <div className="col">
                                          <h6 className="text-muted mb-2">{element.datetime}&nbsp;</h6>
                                        </div>
                                        <div className="col text-end">
                                          <h6 className="text-muted mb-2">
                                            {
                                              [...Array(element.num_stars)].map((e, i) => <i key={`stars-${uuidv4()}`} className="fa fa-star"></i>)
                                            }
                                          </h6>
                                        </div>
                                      </div>
                                      <p className="card-text">{element.conversation_snippet}...</p>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                            </React.Fragment>
                          )
                        })
                      }
                    </ul>
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

Main.propTypes = {};

Main.defaultProps = {};

export default Main;
