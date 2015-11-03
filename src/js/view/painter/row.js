/**
 * @fileoverview Row Painter 정의
 * @author NHN Ent. FE Development Team
 */
'use strict';

var Painter = require('../../base/painter');

/**
 * Row Painter
 * 성능 향상을 위해 Row Painter 를 위한 클래스 생성
 * @module painter/row
 */
var RowPainter = tui.util.defineClass(Painter,/**@lends module:painter/row.prototype */{
    /**
     * @constructs
     * @extends module:painter
     * @param {object} options - Options
     *      @param {string} [options.whichSide='R']   어느 영역에 속하는 row 인지 여부. 'L|R' 중 하나를 지정한다.
     *      @param {object} options.collection change 를 감지할 collection 객체
     */
    init: function(options) {
        Painter.apply(this, arguments);

        this.setOwnProperties({
            columnModelList: options.columnModelList
        });
    },

    baseTemplate: _.template(
        '' +
        '<tr ' +
        'key="<%=key%>" ' +
        'class="<%=className%>" ' +
        'style="height: <%=height%>px;">' +
        '<%=contents%>' +
        '</tr>'
    ),

    /**
     * model 변경 시 이벤트 핸들러
     * @param {object} model - 변화가 일어난 모델 인스턴스
     * @param {jQuery} $tr - jquery object for tr element
     */
    onModelChange: function(model, $tr) {
        var editType,
            cellInstance;

        _.each(model.changed, function(cellData, columnName) {
            if (columnName !== '_extraData') {
                editType = this._getEditType(columnName, cellData);
                cellInstance = this.grid.cellFactory.getInstance(editType);
                cellInstance.onModelChange(cellData, $tr);
            }
        }, this);
    },

    /**
     * cellData 의 isEditable 프로퍼티에 따른 editType 을 반환한다.
     * editable 프로퍼티가 false 라면 normal type 으로 설정한다.
     * @param {string} columnName 컬럼명
     * @param {Object} cellData 셀 데이터
     * @return {string} cellFactory 에서 사용될 editType
     * @private
     */
    _getEditType: function(columnName, cellData) {
        var editType = this.grid.columnModel.getEditType(columnName);
        if (!cellData.isEditable && columnName !== '_number') {
            editType = 'normal';
        }
        return editType;
    },

    /**
     * 등록된 Cell Painter들의 이름을 key로 갖고, instance를 value로 갖는 객체를 반환한다.
     * @returns {object} CellFactory
     */
    getCellPainters: function() {
        return this.grid.cellFactory.instances;
    },

    /**
     * tr html 마크업을 반환한다.
     * @param {object} model 마크업을 생성할 모델 인스턴스
     * @return {string} tr 마크업 문자열
     */
    getHtml: function(model) {
        var columnModelList = this.columnModelList,
            cellFactory = this.grid.cellFactory,
            html = '',
            columnName, cellData, editType, cellInstance;

        if (tui.util.isUndefined(model.get('rowKey'))) {
           return html;
        }

        _.each(columnModelList, function(columnModel) {
            columnName = columnModel['columnName'];
            cellData = model.get(columnName);
            /* istanbul ignore else */
            if (cellData && cellData['isMainRow']) {
                editType = this._getEditType(columnName, cellData);
                cellInstance = cellFactory.getInstance(editType);
                html += cellInstance.getHtml(cellData);
            }
        }, this);

        return this.baseTemplate({
            key: model.get('rowKey'),
            height: this.grid.dimensionModel.get('rowHeight') + RowPainter._extraHeight,
            contents: html,
            className: ''
        });
    },

    static: {
        /**
         * IE7에서만 TD의 border만큼 높이가 늘어나는 버그에 대한 예외처리를 위한 값
         * @memberof RowPainter
         * @static
         */
        _extraHeight: (function() {
            var value = 0;
            if (tui.util.browser.msie && tui.util.browser.version === 7) {
                // css에서 IE7에 대해서만 padding의 높이를 위아래 1px씩 주고 있음 (border가 생겼을 때는 0)
                value = -2;
            }
            return value;
        }())
    }
});

module.exports = RowPainter;
