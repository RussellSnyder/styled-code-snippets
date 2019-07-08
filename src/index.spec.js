import React from 'react';
import {App} from './index';
import {cleanup, configure, fireEvent, render} from '@testing-library/react';

configure({
    testIdAttribute: 'data-test-id'
});

function renderComponent(sdk) {
    return render(<App sdk={sdk}/>);
}

const sdk = {
    entry: {
        fields: {
            language: {getValue: jest.fn(), setValue: jest.fn()},
            theme: {getValue: jest.fn(), setValue: jest.fn()},
            title: {getValue: jest.fn(), setValue: jest.fn()},
            code: {getValue: jest.fn(), setValue: jest.fn()}
        }
    }
};

describe('App', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterEach(cleanup);

    describe('Field reading and setting', () => {
        it('should read language values from entry.fields.language', () => {
            sdk.entry.fields.language.getValue.mockReturnValue('javascript');

            const {getByTestId} = renderComponent(sdk);

            expect(getByTestId('field-language').value).toEqual('javascript');

            fireEvent.change(getByTestId('field-language'), {
                target: {value: 'php'}
            });

            expect(sdk.entry.fields.language.setValue).toHaveBeenCalledWith('php');
        });

        it('should read theme values from entry.fields.theme', () => {
            sdk.entry.fields.theme.getValue.mockReturnValue('dracula');

            const {getByTestId} = renderComponent(sdk);

            expect(getByTestId('field-theme').value).toEqual('dracula');

            fireEvent.change(getByTestId('field-theme'), {
                target: {value: 'a11y-dark'}
            });

            expect(sdk.entry.fields.theme.setValue).toHaveBeenCalledWith('a11y-dark');
        });

        it('should read title values from entry.fields.title', () => {
            sdk.entry.fields.title.getValue.mockReturnValue('js for the dark side');
            // sdk.entry.fields.code.getValue.mockReturnValue('var vampire = "look out!";');
            const {getByTestId} = renderComponent(sdk);

            expect(getByTestId('field-title').value).toEqual('js for the dark side');

            fireEvent.change(getByTestId('field-title'), {
                target: {value: 'yolo'}
            });

            expect(sdk.entry.fields.title.setValue).toHaveBeenCalledWith('yolo');
        });

        it('should read code values from entry.fields.code', () => {
            sdk.entry.fields.code.getValue.mockReturnValue('var vampire = "look out!";');
            const {getByTestId} = renderComponent(sdk);

            expect(getByTestId('field-code').value).toEqual('var vampire = "look out!";');

            fireEvent.change(getByTestId('field-code'), {
                target: {value: 'var life = "jazz";'}
            });

            expect(sdk.entry.fields.code.setValue).toHaveBeenCalledWith('var life = "jazz";');
        });

    })
});
