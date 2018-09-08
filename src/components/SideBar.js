import React, { Component } from 'react';
import FlexView from 'react-flexview/lib';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import GEICO from '../images/640px-Geico_logo.svg.png';
import { PageHeader, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import scrollToComponent from 'react-scroll-to-component';

@inject('store')
@observer
export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store.appState;
    this.scrollTo = this.scrollTo.bind(this);
    this.store.setSideBarScrollTo(this.scrollTo);
  }

  scrollTo(id) {
    console.log('scrolling to', id);
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
  }

  renderProfileImage() {
    const { currentUser } = this.store;
    const Profile = styled.img`
      width: 96px;
      height: 96px;
      border-radius: 48px;
    `;
    const H1 = styled.h1`
      color: black;
      font-family: 'Lato', sans-serif;
    `;
    const P = styled.p`
      font-family: 'Lato', sans-serif;
      margin-right: 4px;
    `;

    const GeicoImg = styled.img`
      width: 160px;
      height: 100px;
      object-fit: contain;
    `;

    return (
      <FlexView column hAlignContent="left" shrink={0}>
        <FlexView column>
          <H1>{currentUser.name}</H1>
          <P>{currentUser.gender}</P>
          <P>DOB: {currentUser.DOB}</P>
        </FlexView>
        <GeicoImg src={GEICO} />
      </FlexView>
    );
  }

  renderContent() {
    const P = styled.p`
      font-family: 'Lato', sans-serif;
      margin-right: 4px;
    `;

    return (
      <div>
        <PageHeader
          style={{
            fontSize: 12,
            fontWeight: '400',
            color: '#4d4d4d',
            fontFamily: 'Lato'
          }}
        >
          Patient History
        </PageHeader>

        <Panel id="allergies" bsStyle="danger" ref={v => (this.allergies = v)}>
          <Panel.Heading>
            <Panel.Title componentClass="h3">Allergies</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <div>
              <ListGroup>
                <ListGroupItem header="Penicillin">
                  Experienced rash and hives in 1985.
                </ListGroupItem>
                <ListGroupItem header="Tobacco use">None</ListGroupItem>
                <ListGroupItem header="Medications">
                  No prescription or illegal drug use. Occasional OTC ibuprofen
                  (Advil) for headache (QOD).
                </ListGroupItem>
              </ListGroup>
            </div>
          </Panel.Body>
        </Panel>

        <Panel
          id="medication"
          bsStyle="warning"
          ref={v => (this.medication = v)}
        >
          <Panel.Heading>
            <Panel.Title componentClass="h3">Medication</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <div>
              <ListGroup>
                <ListGroupItem header="Metoprolol">
                  100mg po qd “for years”
                </ListGroupItem>
                <ListGroupItem header="Prozac">
                  20mg po qd; Started 6 months ago
                </ListGroupItem>
                <ListGroupItem header="Protonix">
                  Discontinued 12-18 months ago
                </ListGroupItem>
              </ListGroup>
            </div>
          </Panel.Body>
        </Panel>

        <Panel id="surgical" bsStyle="primary" ref={v => (this.surgical = v)}>
          <Panel.Heading>
            <Panel.Title componentClass="h3">Surgical</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <div>
              <ListGroup>
                <ListGroupItem header="1994">
                  Total abdominal hysterectomy and bilateral oophorectomy for
                  uterine fibroids
                </ListGroupItem>
                <ListGroupItem header="1998">Bunionectomy</ListGroupItem>
              </ListGroup>
            </div>
          </Panel.Body>
        </Panel>

        <Panel id="mhistory" bsStyle="primary" ref={v => (this.mhistory = v)}>
          <Panel.Heading>
            <Panel.Title componentClass="h3">Medical History</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <div>
              <ListGroup>
                <ListGroupItem header="1998">
                  Diagnosed with hypertension and began on unknown medication.
                  Stopped after 6 months because of drowsiness.
                </ListGroupItem>
                <ListGroupItem header="1990">
                  Diagnosed with peptic ulcer disease, which resolved after
                  three months on cimetidine. She Always use generic names
                  describes no history of cancer, lung disease or previous heart
                  disease.
                </ListGroupItem>
              </ListGroup>
            </div>
          </Panel.Body>
        </Panel>

        <Panel id="shistory" bsStyle="success" ref={v => (this.shistory = v)}>
          <Panel.Heading>
            <Panel.Title componentClass="h3">Social History</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <div>
              <ListGroup>
                <ListGroupItem header="Alcohol use">
                  1 or 2 beers each weekend; 1 glass of wine once a week with
                  dinner.
                </ListGroupItem>
                <ListGroupItem header="Tobacco use">None</ListGroupItem>
                <ListGroupItem header="Medications">
                  No prescription or illegal drug use. Occasional OTC ibuprofen
                  (Advil) for headache (QOD).
                </ListGroupItem>
              </ListGroup>
            </div>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
  render() {
    const CustomScrollFlexView = styled(FlexView)`
      padding-left: 16px;
      padding-top: 16px;
      padding-right: 16px;
      overflow: scroll;
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 15px;
        height: 15px;
        border: 1px solid black;
      }
    `;
    return (
      <CustomScrollFlexView column>
        {this.renderProfileImage()}
        {this.renderContent()}
      </CustomScrollFlexView>
    );
  }
}
