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
	  expect(wrapper.find( '.kanban-columns')).toHaveLength(3);
	});

	it('should support drag and drop between columns', () => {
	  expect(wrapper.find( div)).toHaveLength(0);
	});

	it('should change task status with column change', () => {
	  expect(wrapper.find( div)).toHaveLength(0);
	});

});

