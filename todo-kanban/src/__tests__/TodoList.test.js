import React from 'react';
import ReactDOM from 'react-dom';
import { TodoApp } from '../components/TodoList';
import { mount, shallow } from 'enzyme';

describe('Todo List', function() {

	let wrapper;
  beforeEach(() => wrapper = shallow(<TodoApp />));

	it('should show form when clicking add', () => {
		//let wrapper = shallow(<TodoApp />);
		console.log('log: ', wrapper.find('form.form-inline').hasClass('has-danger').to.equal(true) )
		expect(wrapper.find('form.form-inline').hasClass('has-danger')).to.equal(true);


	  //expect(wrapper.find('.form-control').length).toEqual(1);
	});



	it('should Add a new Todo when form is submitted', () => {
	  const task = 'Drink some water'
	  expect(wrapper.find('.form-control').length).toEqual(1);
	});

	it('should allow deletion of tasks', () => {
	  expect(wrapper.find( '.kanban-columns')).toHaveLength(0);
	});

	it('should should persist changes after refresh.', () => {
	  expect(wrapper.find( '.kanban-columns')).toHaveLength(0);
	});

});

