'use strict';

var _ = require('underscore');

var Clipboard = require('model/clipboard');
var Model = require('base/model');
var DomEventBus = require('event/domEventBus');

function deepEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

describe('grid paste test', function() {
    var clipboard;

    function triggerCopyEvent() {
        clipboard.domEventBus.trigger('key:clipboard', {command: 'copy'});
    }

    function triggerPasteEvent(text) {
        clipboard.domEventBus.trigger('key:clipboard', {
            command: 'paste',
            text: text
        });
    }

    beforeEach(function() {
        clipboard = new Clipboard(null, {
            dataModel: new Model(),
            columnModel: new Model(),
            focusModel: new Model(),
            selectionModel: new Model(),
            renderModel: new Model(),
            domEventBus: DomEventBus.create()
        });
    });

    describe('key:clipboard event with copy command', function() {
        var SAMPLE_TEXT = 'sample text';

        it('if selection exists, set text attribute to values of selected cells', function() {
            clipboard.focusModel.which = _.constant({});
            clipboard.selectionModel.hasSelection = _.constant(true);
            clipboard.selectionModel.getValuesToString = _.constant(SAMPLE_TEXT);

            triggerCopyEvent('copy');
            expect(clipboard.get('text')).toBe(SAMPLE_TEXT);
        });

        describe('if selection does not exists, set text attribute to value of focused cell', function() {
            var rowDataMock;

            beforeEach(function() {
                rowDataMock = {
                    getValueString: jasmine.createSpy('getValueString').and.returnValue(SAMPLE_TEXT)
                };
                clipboard.dataModel.get = jasmine.createSpy('get').and.returnValue(rowDataMock);
                clipboard.renderModel.getCellData =
                    jasmine.createSpy('getCellData').and.returnValue({formattedValue: SAMPLE_TEXT});

                clipboard.selectionModel.hasSelection = _.constant(false);
                clipboard.focusModel.which = _.constant({
                    rowKey: 0,
                    columnName: 'c1'
                });
            });

            it('with fommatedValue', function() {
                clipboard.columnModel.getCopyOptions = jasmine.createSpy().and.returnValue({
                    useFormattedValue: true
                });
                triggerCopyEvent('copy');

                expect(clipboard.columnModel.getCopyOptions).toHaveBeenCalledWith('c1');
                expect(clipboard.renderModel.getCellData).toHaveBeenCalledWith(0, 'c1');
                expect(clipboard.get('text')).toBe(SAMPLE_TEXT);
            });

            it('with original value', function() {
                clipboard.columnModel.getCopyOptions = jasmine.createSpy().and.returnValue({
                    useFormattedValue: false
                });
                triggerCopyEvent('copy');

                expect(clipboard.columnModel.getCopyOptions).toHaveBeenCalledWith('c1');
                expect(clipboard.dataModel.get).toHaveBeenCalledWith(0);
                expect(rowDataMock.getValueString).toHaveBeenCalledWith('c1');
                expect(clipboard.get('text')).toBe(SAMPLE_TEXT);
            });
        });
    });

    describe('_duplicateData', function() {
        describe('should duplicate data', function() {
            it('when length of selection row range is multiple of data row length', function() {
                var data = [[1, 2], [3, 4]];
                var result = clipboard._duplicateData(data, 5, 2);

                expect(deepEqual(result, [[1, 2], [3, 4], [1, 2], [3, 4]])).toBe(true);
            });

            it('when length of selection column range is multiple of data column length', function() {
                var data = [[1, 2], [3, 4]];
                var result = clipboard._duplicateData(data, 2, 5);

                expect(deepEqual(result, [[1, 2, 1, 2], [3, 4, 3, 4]])).toBe(true);
            });

            it('when length of selection range is multiple of data length', function() {
                var data = [[1, 2], [3, 4]];
                var result = clipboard._duplicateData(data, 5, 5);

                expect(deepEqual(result, [[1, 2, 1, 2], [3, 4, 3, 4], [1, 2, 1, 2], [3, 4, 3, 4]])).toBe(true);
            });
        });

        describe('should return same data', function() {
            it('if the length of selection range is not multiple of data length', function() {
                var data = [[1, 2], [3, 4]];
                var result = clipboard._duplicateData(data, 3, 3);

                expect(deepEqual(result, [[1, 2], [3, 4]])).toBe(true);
            });

            it('if the length of selection range is smaller than data length', function() {
                var data = [[1, 2], [3, 4]];
                var result = clipboard._duplicateData(data, 1, 1);

                expect(deepEqual(result, [[1, 2], [3, 4]])).toBe(true);
            });
        });
    });
});
