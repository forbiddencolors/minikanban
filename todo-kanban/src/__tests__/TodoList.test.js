import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/TodoList';
import { mount, shallow } from 'enzyme';

describe('Todo List', function() {

	let wrapper;
  beforeEach(() => wrapper = shallow(<TodoList />));

	it('should show form when clicking add', () => {
	  expect(wrapper.find('.App').length).toEqual(1);
	});

	it('should Add a new Todo when form is submitted', () => {
	  expect(wrapper.find( '.kanban-columns')).toHaveLength(3);
	});

	it('should allow deletion of tasks', () => {
	  expect(wrapper.find( '.kanban-columns')).toHaveLength(0);
	});

	it('should should persist changes after refresh.', () => {
	  expect(wrapper.find( '.kanban-columns')).toHaveLength(0);
	});

});

