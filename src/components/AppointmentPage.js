import React from 'react';
import ReactDOM from 'react-dom';
import FullCalendar from 'rc-calendar/lib/FullCalendar';

import 'rc-select/assets/index.css';
import Select from 'rc-select';

import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
import FlexView from 'react-flexview/lib';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

const format = 'YYYY-MM-DD';
const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

function onSelect(value) {
  console.log('select', value.format(format));
}
@inject('store')
@observer
export default class Appointment extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.store.appState;
  }
  state = {
    type: 'date'
  };

  onTypeChange = type => {
    console.log(type);
    this.setState({
      type
    });
  };
  renderEvent(m) {
    const { pages } = this.store;

    const D = styled.p`
      color: #008dcd;
    `;

    let content = '';
    const date = m.format('YYYY-MM-DD');
    // if (date in appointments) {
    //   appointments[date].map(d => {
    // content += d + '\n';
    //   });
    // }

    pages[2].data.map((a, index) => {
      if (a.yearstamp == date) {
        content += a.time + '\n';
      }
    });

    return (
      <div>
        <D>{m.format('D')}</D>
        <p>{content}</p>
      </div>
    );
  }

  randomDate() {
    return new Date(
      +new Date() - Math.floor(Math.random() * 10000000000)
    ).toString();
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  render() {
    return (
      <FlexView grow={1}>
        <FullCalendar
          style={{ margin: 10 }}
          Select={Select}
          fullscreen
          defaultValue={now}
          type={this.state.type}
          style={{ width: '100%', height: '100%' }}
          locale={cn ? zhCN : enUS}
          dateCellContentRender={e => this.renderEvent(e)}
        />
      </FlexView>
    );
  }
}
