import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { mount, shallow } from 'enzyme';

describe('Kanban App', function() {

	let wrapper;
  beforeEach(() => wrapper = shallow(<App />));

	it('renders without crashing', () => {
	  expect(wrapper.find('.App').length).toEqual(1);
	});



	it('should have three columns', () => {
		const wrapper = shallow(<App />);
	  expect(wrapper.find( '.kanban-columns')).toHaveLength(3);
	});

});

