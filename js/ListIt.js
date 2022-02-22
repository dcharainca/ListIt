
var ObjList = new Array();
function ManageList(tableName) {
    /*VARIABLES***************/
    this.ExtraFilterEstructure = "";
    this.ExtraFiltersType = "";
    this.UnitMeasure = "px";
    this.ColumnsNumber = 0;
    this.Columns = new Array();
    this.GroupNumber = 0;
    this.Groups = new Array();
    this.UrlRequest = "";
    this.Parameters = "";
    this.Keys = "";
    this.ClassList = "";
    this.ClassHeader = "";
    this.ClassItem = "";
    this.ClassItemAlternative = "";
    this.ClassSelectedItem = "";
    this.ClassSearchBox = "";
    this.ClassHeaderAsc = "";
    this.ClassHeaderDesc = "";
    this.ClassHeaderRegular = "";
    this.ClassPager = "";
    this.PageSize = 0;
    this.DivPaginateName = "";
    this.LabelTotalItemsCliendID = tableName + "_LabelTotalItems";
    this.LabelTotalPagesCliendID = tableName + "_LabelTotalPages";
    this.TexboxCurrentPageCliendID = tableName + "_TextboxCurrentPage";
    this.UrlImageSelect = "";
    this.MethodSelectedRow = "";
    this.MultipleSearch = false;
    this.Paginate = false;
    this.Sorting = false;
    this.IndexLastSelectedRow = -1;
    this.PageNumberActive = 1;
    this.RequesType = "POST";
    /************************/
    this.ListName = tableName;
    this.DivSelectName = "";
    $("#" + this.ListName + " tbody ").remove();
    this.AddColumn = function (type, busqueda, field, title, width, align, atributtes, showColumn) {
        var col = new Array();
        col.Type = type; //Item, Select
        col.SearchBox = isArray(busqueda) == true ? busqueda[0] : busqueda;
        col.SearchOperator = isArray(busqueda) == true ? busqueda[1] : "%LIKE%";
        col.Field = field;
        col.Title = title;
        col.Width = width;
        col.Align = align;
        col.Atributtes = atributtes;
        col.ShowColumn = showColumn;
        this.Columns[this.ColumnsNumber] = col;
        this.ColumnsNumber++;
    };
    this.GetColumns = function () {
        return this.Columns;
    };
    this.AddGroupColumn = function (start, end, title) {
        var col = new Array();
        col.Inicio = start; //PUEDE SER Item, Select
        col.Fin = end; //PUEDE SER true, false
        col.Title = title;

        this.Groups[this.GroupNumber] = col;
        this.GroupNumber++;
    };
    this.InitList = function () {
        /*VARIABLES************/
        this.flag = false;
        this.time = 0;
        this.SelectedRow = null;
        this.SelectedHeader = null;
        this.SortColumn = '';
        this.SortOrientation = 'DESC';
        ObjList[this.ListName] = this;
        /****************/
        var boxSearch = "<input type='text' style='width:99%' class='" + this.ClassSearchBox + "' OnKeyPress=\"return FilterList(event,'" + this.ListName + "');\" id='txtB_@field'/>";

        $('#' + this.ListName).addClass(this.ClassList);
        $('#' + this.ListName).empty();

        var widthList = 0;
        for (i = 0; i < this.Columns.length; i++) {
            width = this.Columns[i].Width;
            widthList += parseInt(width);
        }

        $('#' + this.ListName).css("width", "98%");
        $('#' + this.ListName).css("min-width", widthList.toString());

        $('#' + this.DivPaginateName).css("min-width", widthList.toString());
        $('#' + this.DivPaginateName).css("width", "98%");
        /*************************************************************/

        if (this.MultipleSearch) {
            var html = "<tr>";
            for (i = 0; i < this.Columns.length; i++) {
                if (this.Columns[i].SearchBox) {
                    html += "<th  style='width:" + this.Columns[i].Width + this.UnitMeasure + "'>" + boxSearch.replace('@field', this.Columns[i].Field) + "</th>";
                } else {
                    html += "<th  style='width:" + this.Columns[i].Width + this.UnitMeasure + "'></th>";
                }
            }

            html += "</tr>";
            $('#' + this.ListName).append(html);
        }
        /*COLSPAN*******************************************************/
        if (this.Groups.length > 0) {
            html = "<tr class='" + this.ClassHeader + "'>";

            for (i = 0; i < this.Columns.length; i++) {
                isGroup = false;
                for (x = 0; x < this.Groups.length; x++) {
                    if (this.Groups[x].Inicio <= i + 1 && this.Groups[x].Fin >= i + 1) {
                        isGroup = true;
                        if (this.Groups[x].Inicio == i + 1) {
                            html += "<th colspan=" + (this.Groups[x].Fin - this.Groups[x].Inicio + 1).toString() + ">" + this.Groups[x].Title + "</th>";
                        }
                    }
                }
                if (isGroup == false) {
                    switch (this.Columns[i].Type) {
                        case "Select":
                            html += "<th  style='width:" + this.Columns[i].Width + this.UnitMeasure + "' rowspan=2></th>";
                            break;
                        default:
                            if (this.Sorting) {
                                html += "<th  style='width:" + this.Columns[i].Width + this.UnitMeasure + "' rowspan=2><a id='a_" + this.Columns[i].Field + "' OnClick=\"FillList('" + this.Columns[i].Field + "','" + this.ListName + "')\">" + this.Columns[i].Title + "</a></th>";
                            } else {
                                html += "<th  style='width:" + this.Columns[i].Width + this.UnitMeasure + "' rowspan=2>" + this.Columns[i].Title + "</th>";
                            }
                            break;
                    }
                }

            }
            html += "</tr>";
            $('#' + this.ListName).append(html);
        }
        /******************************************************************************/
        /*Headers*******************************************************/
        html = "<tr class='" + this.ClassHeader + "'>";
        for (i = 0; i < this.Columns.length; i++) {
            isGroup = false;
            if (this.Groups.length > 0) {
                for (x = 0; x < this.Groups.length; x++) {
                    if (this.Groups[x].Inicio <= i + 1 && this.Groups[x].Fin >= i + 1) {
                        isGroup = true;
                    }
                }
            } else {
                isGroup = true;
            }
            if (isGroup) {
                switch (this.Columns[i].Type) {
                    case "Select":
                        html += "<th  style='width:" + this.Columns[i].Width + this.UnitMeasure + "'></th>";
                        break;
                    default:
                        if (this.Sorting) {
                            html += "<th  style='width:" + this.Columns[i].Width + this.UnitMeasure + "'><a id='a_" + this.Columns[i].Field + "' OnClick=\"FillList('" + this.Columns[i].Field + "','" + this.ListName + "')\" style='cursor:pointer;'>" + this.Columns[i].Title + "</a></th>";
                        } else {
                            html += "<th  style='width:" + this.Columns[i].Width + this.UnitMeasure + "'>" + this.Columns[i].Title + "</th>";
                        }
                        break;
                }
            }

        }
        html += "</tr>";
        $('#' + this.ListName).append(html);
        /******************************************************************************/
        if (this.Paginate) {
            $('#' + this.DivPaginateName).addClass(this.ClassPager);

            var pager = "<input type='button' value='' class='first' onclick='return PaginateList(\"" + this.ListName + "\",\"first\");' /> " +
                "<input type='button' value='' class='previous' onclick='return PaginateList(\"" + this.ListName + "\",\"previous\");' /> " +
                "<input type='text' id='" + this.TexboxCurrentPageCliendID + "' value='1' onkeypress='if (validateJustNumbers())return PaginateList(\"" + this.ListName + "\",\"current\"); else return false;' style='width:30px' /> " +
                "de " +
                "<label id='" + this.LabelTotalPagesCliendID + "'></label>" +
                "<input type='button' value='' class='next' onclick='return PaginateList(\"" + this.ListName + "\",\"next\");' /> " +
                "<input type='button' value='' class='last' onclick='return PaginateList(\"" + this.ListName + "\",\"last\");' /> " +
                "<div style='display:inline-block'>&nbsp;&nbsp; N° de Registros: " +
                "<label id='" + this.LabelTotalItemsCliendID + "'></label></div> ";
            ;
            $('#' + this.DivPaginateName).empty();
            $('#' + this.DivPaginateName).append(pager);

        }
        this.FillList('');

    };
    this.GetQuery = function () {
        var sorting = "";
        var query = "";
        /*SORTING***********************************/
        if (this.Sorting) {
            if (sorting != this.SortColumn) {
                if (this.SortColumn == '' || sorting != '') {
                    this.SortOrientation = 'ASC';
                }
                if (this.SelectedHeader != null) {
                    this.SelectedHeader.attr('class', this.ClassHeaderRegular);
                }

            } else {
                if (this.SortOrientation == 'ASC')
                    this.SortOrientation = 'DESC';
                else
                    this.SortOrientation = 'ASC';
            }
            if (sorting == '') { sorting = this.SortColumn; }
            this.SortColumn = sorting;
            if (sorting != '') {
                header = $("#" + tableName + " #a_" + sorting);
                header.attr('class', this.ClassSelectedItem);
                if (this.SortOrientation == 'ASC') {
                    header.attr('class', this.ClassHeaderAsc);
                } else {
                    header.attr('class', this.ClassHeaderDesc);
                }
                this.SelectedHeader = header;
                sorting = sorting + ' ' + this.SortOrientation;

            }
            sorting = sorting.replace('txtB_', '');
        }
        /*FILTER***********************************/
        var filter = '';
        Columns = this.Columns;
        if (this.MultipleSearch) {
            //$("#" + this.ListName + " tbody>tr:first :input").each(function () {
            $("#" + this.ListName + " tr:first :input").each(function () {
                //$("#" + this.ListName + " tbody tr:first :input").each(function () {
                if (this.Type == 'text') {
                    if (this.value != "") {
                        searchOperator = "%LIKE%";
                        filterTmp = "";
                        idField = this.id.replace('txtB_', '');
                        for (x = 0; x < Columns.length; x++) {
                            if (Columns[x].Field == idField) {
                                searchOperator = Columns[x].SearchOperator;
                            }
                        }
                        switch (searchOperator) {
                            case "%LIKE%": filterTmp = idField + " like \\'%" + this.value + "%\\'"; break;
                            case "LIKE%": filterTmp = idField + " like \\'" + this.value + "%\\'"; break;
                            case "%LIKE": filterTmp = idField + " like \\'%" + this.value + "\\'"; break;
                            case "=": filterTmp = idField + " = \\'" + this.value + "\\'"; break;
                            case "!=": filterTmp = idField + " != \\'" + this.value + "\\'"; break;
                            case ">": filterTmp = idField + " > \\'" + this.value + "\\'"; break;
                            case "<": filterTmp = idField + " < \\'" + this.value + "\\'"; break;
                            case ">=": filterTmp = idField + " >= \\'" + this.value + "\\'"; break;
                            case "<=": filterTmp = idField + " <= \\'" + this.value + "\\'"; break;
                            default: filterTmp = idField + " like \\'%" + this.value + "%\\'"; break;
                        }
                        if (filter == "") {
                            filter = filterTmp;
                        }
                        else {
                            filter += " AND " + filterTmp;
                        }
                    }
                }
            });

        }

        if (this.ExtraFilterEstructure) {
            filter += (filter ? (getExternalFilters(this.ExtraFilterEstructure) ? "AND " + getExternalFilters(this.ExtraFilterEstructure) : "") : getExternalFilters(this.ExtraFilterEstructure));
        }
        filter += getExtraFilters(this.ExtraFiltersType);

        var Parameters = "";
        if (this.MultipleSearch) {
            Parameters += "filter:'" + filter + "'";
        }
        if (this.Sorting) {
            if (Parameters != "") Parameters += ", ";
            Parameters += "sorting:'" + sorting + "'";
        }
        if (this.Paginate) {
            if (Parameters != "") Parameters += ", ";
            Parameters += "total:" + $("#" + this.LabelTotalItemsCliendID).text();
        }

        if (Parameters != "" && this.Parameters != "") Parameters += ", ";
        Parameters = "{" + Parameters + this.Parameters + "}";
        return Parameters;

    };
    this.FillList = function (sorting) {
        this.SelectedRow = null;
        var pageNumber = 1;
        var pageSize = 0;
        if (sorting != "") {
            this.IndexLastSelectedRow = -1;
        }
        /*PAGING***********************************/
        if (this.Paginate) {
            pageNumber = $('#' + this.TexboxCurrentPageCliendID + '').val();
            pageSize = this.PageSize;
        }
        /*SORTING***********************************/
        if (this.Sorting) {
            if (sorting != this.SortColumn) {
                if (this.SortColumn == '' || sorting != '') {
                    this.SortOrientation = 'ASC';
                }
                if (this.SelectedHeader != null) {
                    this.SelectedHeader.attr('class', this.ClassHeaderRegular);
                }

            } else {
                if (this.SortOrientation == 'ASC')
                    this.SortOrientation = 'DESC';
                else
                    this.SortOrientation = 'ASC';
            }
            if (sorting == '') { sorting = this.SortColumn; }
            this.SortColumn = sorting;
            if (sorting != '') {
                header = $("#" + tableName + " #a_" + sorting);
                header.attr('class', this.ClassSelectedItem);
                if (this.SortOrientation == 'ASC') {
                    header.attr('class', this.ClassHeaderAsc);
                } else {
                    header.attr('class', this.ClassHeaderDesc);
                }
                this.SelectedHeader = header;
                sorting = sorting + ' ' + this.SortOrientation;

            }
            sorting = sorting.replace('txtB_', '');
        }
        /*FILTER***********************************/
        var filter = '';
        Columns = this.Columns;
        if (this.MultipleSearch) {
            $("#" + this.ListName + " tr:first :input").each(function () {
                if (this.Type == 'text') {
                    if (this.value != "") {
                        searchOperator = "%LIKE%";
                        filterTmp = "";
                        idField = this.id.replace('txtB_', '');
                        for (x = 0; x < Columns.length; x++) {
                            if (Columns[x].Field == idField) {
                                searchOperator = Columns[x].SearchOperator;
                            }
                        }
                        switch (searchOperator) {
                            case "%LIKE%": filterTmp = idField + " like \\'%" + this.value + "%\\'"; break;
                            case "LIKE%": filterTmp = idField + " like \\'" + this.value + "%\\'"; break;
                            case "%LIKE": filterTmp = idField + " like \\'%" + this.value + "\\'"; break;
                            case "=": filterTmp = idField + " = \\'" + this.value + "\\'"; break;
                            case "!=": filterTmp = idField + " != \\'" + this.value + "\\'"; break;
                            case ">": filterTmp = idField + " > \\'" + this.value + "\\'"; break;
                            case "<": filterTmp = idField + " < \\'" + this.value + "\\'"; break;
                            case ">=": filterTmp = idField + " >= \\'" + this.value + "\\'"; break;
                            case "<=": filterTmp = idField + " <= \\'" + this.value + "\\'"; break;
                            default: filterTmp = idField + " like \\'%" + this.value + "%\\'"; break;
                        }
                        if (filter == "") {
                            filter = filterTmp;
                        }
                        else {
                            filter += " AND " + filterTmp;
                        }
                    }
                }
            });

        }

        if (this.ExtraFilterEstructure) {
            filter += (filter ? (getExternalFilters(this.ExtraFilterEstructure) ? "AND " + getExternalFilters(this.ExtraFilterEstructure) : "") : getExternalFilters(this.ExtraFilterEstructure));
        }
        filter += getExtraFilters(this.ExtraFiltersType);


        var obj = this;
        /*Parameters*/
        var Parameters = "";



        if (this.RequesType == "GET") {
            //Need to implement extra parameters
            if (this.MultipleSearch) {
                Parameters += "?filter='" + filter + "'";
            }
            if (this.Sorting) {
                Parameters = Parameters.length > 0 ? Parameters + "&&sorting=" : "?sorting=";
                Parameters += sorting;
            }

            if (this.Paginate) {
                Parameters = Parameters.length > 0 ? Parameters + "&&page=" : "?page=";
                Parameters +=pageNumber;
                Parameters +="&&per_page=" + pageSize;
            }
        } else {
            if (this.MultipleSearch) {
                Parameters += "filter:'" + filter + "'";
            }
            if (this.Sorting) {
                if (Parameters != "") Parameters += ", ";
                Parameters += "sorting:'" + sorting + "'";
            }
            if (this.Paginate) {
                if (Parameters != "") Parameters += ", ";
                pageNumber = (pageNumber ? pageNumber : 1);
                Parameters += "page:" + pageNumber + ",per_page:" + pageSize;
            }

            if (Parameters != "" && this.Parameters != "") Parameters += ", ";
            Parameters = "{" + Parameters + this.Parameters + "}";
        }



        // Parameters = this.RequesType == "GET" ? Object.entries(Parameters).map(e => e.join('=')).join('&') : Parameters;
        var tempasdasd = Parameters; 
        /*LOAD DATA***********************************/

        $.ajax({
            type: this.RequesType,
            url: this.UrlRequest,
            data: Parameters,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                // result = response;
                // var listData = result[0];
                // var rc = 0; //RecordCount
                // var pc = 1; //PageCount
                // var pn = 1; //PageNumber
                // if (result.length > 1 && obj.Paginate) {
                //     rc = result[1];
                //     pc = result[2];
                //     pn = result[3];
                // }

                result = response;
                var listData = result["data"];
                var rc = 0; //RecordCount
                var pc = 1; //PageCount
                var pn = 1; //PageNumber
                if (listData.length > 1 && obj.Paginate) {
                    rc = result["total"];
                    pc = result["total_pages"];
                    pn = result["page"];
                }

                /*CLEAN RECORDS***********************************/
                obj.CleanList();

                /*SORTING***********************************/

                var html = "";
                var ids = obj.Keys.split(',');
                MetodoSelected = "";
                if (obj.MethodSelectedRow != "") {
                    MetodoSelected = obj.MethodSelectedRow;
                }

                for (var i = 0; i < listData.length; i++) {
                    if (i % 2 == 0) {
                        html += "<tr class='" + obj.ClassItem + "'>";
                    } else {
                        html += "<tr class='" + obj.ClassItemAlternative + "'>";
                    }
                    /*CREAMOS EL DATAKEY***********************************************/
                    key = obj.Keys;
                    if (key != "") {
                        for (var x = 0; x < ids.length; x++) {
                            key = key.replace(ids[x], listData[i][ids[x]]);
                        }
                        key = "<input type='hidden' value='" + key + "'/>";
                    }
                    /*******************************************************************/
                    var doubleClick = "";
                    for (var c = 0; c < obj.Columns.length; c++) {
                        type = obj.Columns[c].Type;
                        switch (type) {
                            case "Select":
                                html += "<td style='width:" + obj.Columns[c].Width + obj.UnitMeasure + "'  align='" + obj.Columns[c].Align + "' >"
                                    + "<img src='" + obj.UrlImageSelect + "' OnClick=\"SelectRow(this,'" + obj.ListName + "'); \" style='cursor: pointer;' />";
                                if (c == 0) {
                                    html += key;
                                }
                                html += "</td>";

                                break;
                            default:
                                if ($("#ck_" + c.toString()).length <= 0) {
                                    html += "<td style='width:" + obj.Columns[c].Width + obj.UnitMeasure + "' align='" + obj.Columns[c].Align + "'" + doubleClick + " >";
                                }
                                else {
                                    if ($("#ck_" + c.toString()).is(':checked')) {
                                        html += "<td style='width:" + obj.Columns[c].Width + obj.UnitMeasure + "' align='" + obj.Columns[c].Align + "' " + doubleClick + " >";

                                    } else {
                                        html += "<td style='width:" + obj.Columns[c].Width + obj.UnitMeasure + "; display:none'  align='" + obj.Columns[c].Align + "'" + doubleClick + " >";
                                    }
                                }

                                valueField = listData[i][obj.Columns[c].Field];

                                if (type == "Item") {
                                    if (valueField == null) {
                                        html += '';
                                    } else {
                                        if (valueField.toString().indexOf('/Date') > -1) {
                                            html += formatJSONDate(valueField);
                                        } else {
                                            html += valueField;
                                        }
                                    }
                                }
                                if (type == "Template") {
                                    _tmp = "";
                                    if (obj.Columns[c].ShowColumn) {
                                        _tmp = obj.Columns[c].Atributtes;
                                        for (var atrib in listData[i]) {
                                            v = listData[i][atrib];
                                            if (v != null) {
                                                if (v.toString().indexOf('/Date') > -1) {
                                                    v = formatJSONDate(v);
                                                }
                                            }

                                            _tmp = _tmp.replace("#" + atrib, " '" + JSON.stringify(v) + "' ");
                                        }
                                        //------------------------------------                                        
                                        _tmp = _tmp.replace("$Value", " '" + valueField + "' ");
                                        _tmp = _tmp.replace("$Id", " '" + JSON.stringify(obj.Columns[c].Field) + "' ");
                                    } else {
                                        if (valueField) {
                                            _tmp = obj.Columns[c].Atributtes;
                                            for (var atrib in listData[i]) {
                                                v = listData[i][atrib];
                                                if (v != null) {
                                                    if (v.toString().indexOf('/Date') > -1) {
                                                        v = formatJSONDate(v);
                                                    }
                                                }
                                                _tmp = _tmp.replace("#" + atrib, v);

                                            }
                                            //------------------------------------                                            
                                            _tmp = _tmp.replace("$Value", " '" + valueField + "' ");
                                            _tmp = _tmp.replace("$Id", " '" + obj.Columns[c].Field + "' ");
                                        }
                                    }

                                    html += _tmp;
                                }
                                if (c == 0) {
                                    html += key;
                                }
                                html += "</td>";
                                break;

                        }
                    }
                    html += "</tr>";

                }
                $('#' + obj.ListName).append(html);
                if (obj.Paginate) {

                    document.getElementById(obj.LabelTotalItemsCliendID).innerHTML = rc;
                    document.getElementById(obj.LabelTotalPagesCliendID).innerHTML = pc;
                    $('#' + obj.TexboxCurrentPageCliendID).val(pn);
                }
                if (obj.IndexLastSelectedRow > -1) {
                    SelectRowByIndex(obj.IndexLastSelectedRow, obj.ListName);
                }
            },
            error: function (result) {
                alert('ERROR ' + result.status + ' ' + result.statusText);
            }
        });

    };
    this.CleanList = function () {
        $("#" + this.ListName + " .ListItRow").remove();
        $("#" + this.ListName + " .ListItSelectedRow").remove();
        $("#" + this.ListName + " .ListItRowAlternative").remove();
    };
    this.CreateSelectorColumns = function (linkButton) {
        $("#" + linkButton).attr("onClick", "return ShowSelector('" + this.ListName + "');");

        $("#" + this.DivSelectName).append("<a href=\"#\" onclick=\"return ApplySelector('" + this.ListName + "');\" style=\"padding-left:10px; padding-right:10px;width:250px;border-style:double; background-color:#FFFFC0\">Aceptar</a>");
        $("#" + this.DivSelectName).append("<a href=\"#\" onclick=\"return HideSelector('" + this.ListName + "');\" style=\"padding-left:10px; padding-right:10px;width:250px;border-style:double; background-color:#FFFFC0\">Cerrar</a>");
        $("#" + this.DivSelectName).append("Seleccionar Todo <input type='checkbox' id='ck_all' onclick=\"CheckAllSelector('" + this.ListName + "', this)\" />");
        $("#" + this.DivSelectName).append("<br/><br/>");
        for (i = 0; i < this.Columns.length; i++) {
            if (this.Columns[i].Type != "Select") {
                $("#" + this.DivSelectName).append("<input id='ck_" + i + "' type='checkbox' checked value='" + i.toString() + "'/>" + this.Columns[i].Title + "<br/>")
            }
        }

    };
}
function ControlKeyCode(e) {
    if (e.keyCode == 13) {
        return false;
    }
}
var flag = 0;
function FilterList(e, ListName) {
    if (e.keyCode == 13) {
        var obj = ObjList[ListName];
        obj.FillList('');
        return false;
    }
}
function ControlKeyboard(_flag, ListName) {
    if (_flag == flag) {
        var obj = ObjList[ListName];
        obj.FillList('');

    }
}

function FillList(sorting, ListName) {
    var obj = ObjList[ListName];
    obj.FillList(sorting);
}
function SelectRow(btn, ListName) {
    var obj = ObjList[ListName];
    if (obj.SelectedRow != null) {
        obj.SelectedRow.attr('class', obj.ClassItem);
    }
    row = $(btn).parents("tr:first");
    row.attr('class', obj.ClassSelectedItem);
    //obj.IndexLastSelectedRow = $("#" + ListName + " tr").index($(row));
    index = row[0].sectionRowIndex - 1;
    if (obj.MultipleSearch) index = index - 1;

    obj.IndexLastSelectedRow = index;

    obj.SelectedRow = row;
}

function SelectRowByIndex(index, ListName) {
    var obj = ObjList[ListName];
    var gv = document.getElementById(ListName);
    index++;
    if (obj.MultipleSearch) index = index + 1;
    if (gv != null) {
        if (gv.rows.length > index) {
            gv.rows[index].className = obj.ClassSelectedItem;
            obj.SelectedRow = $(gv.rows[index]);
        } else {
            obj.SelectedRow = null;
        }
    }
}
function ShowSelector(ListName) {
    var obj = ObjList[ListName];
    $("#" + obj.DivSelectName).css("display", "block");
    $("#" + obj.DivSelectName).css("left", event.x.toString() + "px");
    $("#" + obj.DivSelectName).css("top", event.y.toString() + "px");


    return false;
}
function HideSelector(ListName) {
    var obj = ObjList[ListName];
    $("#" + obj.DivSelectName).css("display", "none");

    return false;
}
function ApplySelector(ListName) {
    var obj = ObjList[ListName];
    var gv = document.getElementById(ListName);

    $("#" + obj.DivSelectName).find("input").each(function () {
        if (this.Type == 'checkbox' && this.id != 'ck_all') {
            if (this.checked) {
                x = parseInt($(this).val());
                if (gv.rows[0].cells[x].style.display != "" && gv.rows[0].cells[x].style.display == 'none') {
                    $("#" + obj.ListName + " td:nth-child(" + (x + 1).toString() + "), #" + obj.ListName + " th:nth-child(" + (x + 1).toString() + ")").show();
                }
            } else {
                x = parseInt($(this).val());
                if (gv.rows[0].cells[x].style.display == "" || gv.rows[0].cells[x].style.display == 'table-cell') {
                    $("#" + obj.ListName + " td:nth-child(" + (x + 1).toString() + "), #" + obj.ListName + " th:nth-child(" + (x + 1).toString() + ")").hide();
                    mm = gv.rows[0].innerHTML;
                }
            }
        }
    });

    HideSelector(ListName);

    return false;
}
function CheckAllSelector(ListName, chk) {
    $("#" + obj.DivSelectName).find("input").each(function () {
        if (this.Type == 'checkbox') {
            this.checked = chk.checked;
        }
    });
}
function CleanAllSearchBox(ListName) {
    $("#" + ListName + " tbody>tr:first :input").each(function () {
        if (this.Type == 'text') {
            this.value = "";
        }
    });
}
function GetIdValueFromSelectRow(ListName) {
    var obj = ObjList[ListName];
    if (obj.SelectedRow == null) {
        return null;
    } else {
        var fila = new Array();
        var ids = obj.Keys.split(',');
        obj.SelectedRow.find("input").each(function () {
            if (this.Type == 'hidden') {
                var tempValues = this.value.split(',');
                for (var i = 0; i < tempValues.length; i++) {
                    fila[ids[i]] = tempValues[i];
                }
            }
        });
        return fila;
    }
}
function GetIdValueFromSelectControl(ListName, control) {
    var obj = ObjList[ListName];
    row = $(control).parent().parent();

    var fila = new Array();
    var ids = obj.Keys.split(',');
    row.find("input").each(function () {
        if (this.Type == 'hidden') {
            var tempValues = this.value.split(',');
            for (var i = 0; i < tempValues.length; i++) {
                fila[ids[i]] = tempValues[i];
            }
        }
    });
    return fila;

}
function PaginateList(ListName, type) {
    var obj = ObjList[ListName];
    var pageNumber = $('#' + obj.TexboxCurrentPageCliendID).val();

    if (pageNumber == '') pageNumber = 1;
    pageNumber = parseInt(pageNumber);
    var pageCount = parseInt(document.getElementById(obj.LabelTotalPagesCliendID).innerHTML);
    if (type == 'first') {
        pageNumber = 1;
    }
    if (type == 'previous') {
        if (pageNumber > 1) {
            pageNumber--;
        }
    }
    if (type == 'next') {
        if (pageNumber < pageCount) {
            pageNumber++;
        }
    }
    if (type == 'last') {
        pageNumber = pageCount;
    }
    if (type == 'current') {
        if (event.keyCode != 13) {
            return true;
        } else {
            if (pageNumber > pageCount) {
                pageNumber = pageCount;
            }
            if (pageNumber < 1) {
                pageNumber = 1;
            }
        }

    }
    if (obj.PageNumberActive != pageNumber) {
        obj.IndexLastSelectedRow = -1;
        $('#' + obj.TexboxCurrentPageCliendID).val(pageNumber);
        obj.FillList('');
        obj.PageNumberActive = pageNumber;
    }

    return false;
}
function numberFormat(number, decimalLength, separatorDecimal, separatorThousand) {
    number = parseFloat(number);
    if (isNaN(number)) {
        return "";
    }

    if (decimalLength !== undefined) {
        number = number.toFixed(decimalLength);
    }

    number = number.toString().replace(".", separatorDecimal !== undefined ? separatorDecimal : ",");

    if (separatorThousand) {
        var thounsands = new RegExp("(-?[0-9]+)([0-9]{3})");
        while (thounsands.test(number)) {
            number = number.replace(thounsands, "$1" + separatorThousand + "$2");
        }
    }

    return number;
}
function formatJSONDate(jsonDate) {
    var newDate = new Date(parseInt(jsonDate.substr(6)));
    var month = newDate.getMonth() + 1;
    if (month < 10) { month = '0' + month; }
    var day = newDate.getDate();
    if (day < 10) { day = '0' + day; }
    var year = newDate.getFullYear();
    var date = day + "/" + month + "/" + year;

    if (date == "01/01/1" || date == "31/12/0") {
        date = "";
    }

    return date;

}
function validateJustNumbers() {
    key = event.keyCode || event.which;
    currentKey = String.fromCharCode(key).toLowerCase();
    letters = "0123456789";
    specialKeys = [8, 37, 39, 46, 13];

    isSpecialKey = false
    for (var i in specialKeys) {
        if (key == specialKeys[i]) {
            isSpecialKey = true;
            break;
        }
    }

    if (letters.indexOf(currentKey) == -1 && !isSpecialKey) {
        return false;
    } else {
        return true;
    }
}
function isArray(value) {
    return Object.prototype.toString.call(value) === "[object Array]";
}

function getExternalFilters(query) {
    var result = "";
    $(query).each(function (i, item) {
        var tempValue = $(item).val();
        if (tempValue) {
            var tempField = $(item).prop("id");
            tempField = tempField.replace("extFilter_", "");
            var tempOperator = $(item).parent().find(".extFilterOperador");
            tempOperator = $(tempOperator).val();
            filterTmp = "";
            switch (tempOperator) {
                case "%LIKE%": filterTmp = tempField + " like \\'%" + tempValue + "%\\' AND "; break;
                case "LIKE%": filterTmp = tempField + " like \\'" + tempValue + "%\\' AND "; break;
                case "%LIKE": filterTmp = tempField + " like \\'%" + tempValue + "\\' AND "; break;
                case "=": filterTmp = tempField + " = \\'" + tempValue + "\\' AND "; break;
                case "!=": filterTmp = tempField + " != \\'" + tempValue + "\\' AND "; break;
                case ">": filterTmp = tempField + " > \\'" + tempValue + "\\' AND "; break;
                case "<": filterTmp = tempField + " < \\'" + tempValue + "\\' AND "; break;
                case ">=": filterTmp = tempField + " >= \\'" + tempValue + "\\' AND "; break;
                case "<=": filterTmp = tempField + " <= \\'" + tempValue + "\\' AND "; break;
                default: filterTmp = tempField + " like \\'%" + tempValue + "%\\' AND "; break;
            }
            result += filterTmp;
        }
    });
    result = result.length > 0 ? result.substring(0, result.length - 4) : result;
    return result;
}