import React from 'react';
import { shallow } from 'enzyme';
import Todo from './src/components/Todo/todo';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { MuiThemeProvider } from 'material-ui/styles';


describe('Todo component renders the todo correctly', () => {
    it('renders correctly', () => {
      const rendered = renderer.create(
          <MuiThemeProvider>
        <Todo/>
        </MuiThemeProvider>
      );
      console.log(rendered);
      expect(rendered.toJSON()).toMatchSnapshot();
    });
  });

describe('Math example', () => {

    it('addition', () => {
        expect(2 + 2).toEqual(4);
    })

});