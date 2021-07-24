///以上為使用Intellisence功能需要
(function ($) {
    //自訂Plug-In 提供套用jQueryUI外觀
    //depend on jQuery UI
    $.fn.UiButton = function () {
        return this.each(function () {
            //按鈕樣式
            var b = $(this).find(":button,:submit,:reset,a.button,a[data-icon]").not('.ui-button'); //只過濾需要的元素
            if (b.length > 0) {
                //console.log(navigator.userAgent);
                //if (navigator.userAgent.match(/MSIE/)) b.filter("a.button").css('vertical-align', 'middle'); //IE按鈕排版問題

                b.filter("a.button").button(); //一般連結按鈕化
                b.filter(":button").button(); //<input>&<button>的type="button"者
                //<input>僅可有button樣式,但無法有icon
                b.filter(":reset").button({//<input>&<button>的type="reset"者
                    icons: { primary: 'ui-icon-arrowreturnthick-1-n' }//<button type=reset> only
                });
                b.filter(":submit").button({//<input>&<button>的type="submit"者
                    icons: { primary: 'ui-icon-check' }//<button type=submit> only
                });
                b.filter(":button[data-icon],a[data-icon]").each(function () {
                    $(this).button({ //自訂ICON for jQueryUI Helper
                        icons: { primary: "ui-icon-" + $(this).attr("data-icon") }
                    })
                });
            }
            //var b = $(this).find(":button, :submit, :reset, a");
            //if (b.length > 0) {
            //    b.button().addClass("btn btn-brown");
            //}
            //var t = $("#GridV").find("table");
            //if (t.length > 0) {
            //    t.addClass("table table-striped table-striped table-bordered table-hover");
            //}
        });
    };
    $.fn.UiForm = function () {
        return this.each(function () {
            //電子表單樣式
            $(this).find('fieldset').addClass('ui-widget-content');
            $(this).find('legend').addClass('ui-widget-header ui-corner-all');
            //$(this).find('fieldset').addClass('fieldset-brown');
            //$(this).find('legend').addClass('legend-brown');
        });
    };
    $.fn.UiDatePicker = function () {
        return this.each(function () {
            //日期選擇器
            //只過濾尚未套用的元素，但不可包含被設定disabled及readonly者
            var dateBox = $(this).find(":input.datebox").not(':disabled,[readonly],.hasDatepicker');
            if (dateBox.length > 0) {
                dateBox.datepicker({ dateFormat: 'yyyy/mm/dd' }); //日期選擇器 from jQueryUI Plug-In
                //dateBox.mask("999/99/99"); //maskedinput plug-in FOR 民國日期
                dateBox.mask("9999/99/99"); //maskedinput plug-in
            }
        });
    };

    $.fn.ResetTabIndex = function () {
        ///使 TabIndex 由上而下、左而右
        return this.each(function () {
            var frm = $(this).find('form');
            var lastIdx = 0;
            frm.each(function (f) {
                $(this).find('tr').each(function () {
                    $(this).find('td').each(function (i) {
                        lastIdx = f * i + 1;
                        $(this).find('input:text,input[type=number],select')
                        .not(':disabled,[readonly]').attr('tabindex', lastIdx);
                    });
                });
                $(this).find(':button:not([tabindex]),a[data-icon]').attr('tabindex', lastIdx + 1);
            });
            ///防止按下Enter時送出表單
            frm.keydown(function (e) {
                if (e.keyCode == 13) {
                    if ($(':focus').is(':submit,textarea')) {
                        return true; ///若為Submit按鈕或textarea,則允許執行
                    } else {
                        e.preventDefault();
                        return false;
                    }
                }
            });
        });
    };

    $.fn.DecimalFormat = function () {
        var _selector = ':input.dec';
        return this.each(function () {
            $(this).on('focus', _selector, function (evt) {
                //$(this).formatNumber(_setting);
                $(this).val($(this).decimal());
            });
            $(this).on('blur', _selector, function (evt) {
                //失去focus後,即格式化數字
                nStr = $(this).val($(this).decimal()).val();
                x = nStr.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
                $(this).val(x1 + x2);
            });
            //千分號處理 from NumberFormat Plug-In
            //console.log('DecimalFormat handler');
            //var _setting = { format: "#,##0.##########", locale: "tw" };
            //            $(this).on('focus', _selector, function (evt) {
            //                //focus時，將千分號移除，以免後續數值計算錯誤
            //                var num = $(this).parseNumber(_setting);
            //                $(this).val(num);
            //            });
            //            $(this).on('blur', _selector, function (evt) {
            //                //失去focus後,即格式化數字
            //                $(this).formatNumber(_setting);
            //            });
        });
    };
    $.fn.decimal = function () {
        //取得Decimal數值,避免千分號無法於前端計算
        //千分號處理 from NumberFormat Plug-In
        //var _setting = { format: "#,##0.##########", locale: "tw" };
        //focus時，將千分號移除，以免後續數值計算錯誤
        //var num = $(this).parseNumber(_setting);
        //return num;
        ///x1 for Leading Zero
        if ($(this).length > 0) {
            //只允許數字及小數點 (移除其他非必要字元)
            var d = $(this).val().replace(/[^0-9.-]/g, '');
            $(this).val().replace(/,/g, '')
            if ($.isNumeric(d)) return (d * 1);
        }
        return 0;
    };
    $.fn.tip = function (msg) {
        //Tip
        var _opt = {
            position: { my: "left bottom", at: "left top", collision: "flipfit" },
            tooltipClass: "tip"
        };

        return this.each(function () {
            $(this).attr('title', msg); //Tip預設使用的屬性
            $(this).tooltip(_opt); //jQueryUI 1.9內建顯示ToolTips
        });
    };

    $.fn.ToDropDown = function (data) {
        ///以SelectListItem轉成的JSON，製作下拉選單。
        var ddl = $(this);
        $('option', ddl).remove(); //清空
        $.map(data, function (it, i) {
            //填入拿到的data (SelectListItem轉成的JSON)
            var selected = (it.Selected ? 'selected' : '');
            ddl.append('<option value="' + it.Value + '" ' + selected + '>' + it.Text + '</option>');
        });
        ddl.change(); //觸發下拉改變的Event; //modify by ming 20131211 - 變動完之後, 不做focus動作
        return this.each(function () { });
    };

    $.fn.cascade = function (parent, target, url, paraname) {
        //連動下拉選單
        //parent:觸發下拉選單的Selector
        //target:要被改變內容的下拉選單Selector
        //url:取得JSON物件的Action網址
        //paraname:對應網址所需傳入的參數名稱(將會把SelectedValue當成參數內容)，對應多個傳遞參數時，用逗號分隔

        $(this).on('change', parent, function (evt) {
            //設定Action URL的接收參數
            var ddl = $(target); //Local Variable, for 一個連動多個時不衝突
            para = {};
            var p = paraname.split(',');
            if (p.length == 1) {
                para[paraname] = $(this).val();
            }
            else {
                for (var i = 0; i < p.length; i++) {
                    para[p[i]] = $('#' + p[i]).val();
                }
            }

            //將參數傳入URL
            $.post(url, para, function (data) {
                ddl.ToDropDown(data);
            });
        });
        return this.each(function () { });
    };

    $.fn.formatAmount = function (currency) {
        //依幣別格式設定小數位數處理後之數值
        //currency:selector
        var _amt = $(this);
        if (_amt) {
            $.post('/Remote/FormatAmount',
			{ currency: currency, amount: _amt.val() },
			function (d) {
			    _amt.val(d.Amount).blur(); //改值並觸發千分號
			});
        };
        return this.each(function () { });
    };

    $.fn.Round45 = function (num, pos) {
        ///將數值(num)四捨五入至小數點後N位(pos)
        var size = Math.pow(10, pos);
        $(this).val(Math.round(num * size) / size);
        return this.each(function () { });
    }

    $.fn.decorate = function () {
        return this.each(function () {
            //ReadOnly的元件套用CSS
            // $(this).find(':disabled,[readonly=readonly]').addClass('read-only');
            //觸發MVC前端的Model驗證
            $.validator.unobtrusive.parse($(this));
            //jQuery UI 樣式
            $(this).UiForm().UiButton().UiDatePicker().ResetTabIndex();
        });
    };
})(jQuery);

var Apex = null;
$(function () {
    ////全頁面的投組切換方式共用
    //$('#PortfolioID').on('change', function () {
    //    window.location.href = encodeURI('?PortfolioID=' + $(this).val());
    //});

    if ($.fn.menubar) {
        //menubar 導覽列
        $('nav>ul').menubar({ autoExpand: true, menuIcon: true, buttons: true })
		.removeClass('ui-widget-header')
		.addClass('ui-widget-content'); //修改CSS以免佈景主題文字不明顯
    }
    //子系統Menu; User資訊放在導覽列最後方
    $('header a:not(:last)').button();

    // MinValueAttribute 驗證 (Client) ------------------------
    $.validator.addMethod("minvalue", function (value, element, param) {
        value = value.replace(/\,/g, ''); //將千分號去除
        return ($.isNumeric(value)) ? (parseFloat(value) > parseFloat(param)) : false;
    });
    $.validator.unobtrusive.adapters.addSingleVal("minvalue", "min");

    //自訂物件 APEX  -------------------------------------------------
    Apex = {
        Dialog: {
            //Ajax錯誤訊息視窗
            Error: $('<div></div>').dialog({
                title: "系統訊息", autoOpen: false, draggable: true, resizable: true, modal: false, width: 600,
                buttons: {
                    "確定": function () {
                        $(this).dialog("close");
                    }
                }
            }),
            //「載入中」訊息
            Loading: $('<div>請稍候...</div>').dialog({
                title: "載入中", autoOpen: false, draggable: false, resizable: false, modal: true, width: 200
            }),
            Alert:
				$("<div></div>").dialog({
				    resizable: false,
				    autoOpen: false,
				    modal: true,
				    title: $('title:first').text(),
				    buttons: { "確定": function () { $(this).dialog("close"); } }
				})
			,
            ShowLoading: true, //是否顯示載入中的Flag
            HideLoading: function () {
                this.ShowLoading = false;
                //停用「載入中」的畫面,以免防礙其他Ajax(Remote Attribute, 自動完成...)
            }
        }
    };

    //Ajax行為 -------------------------------------------------
    $.ajaxSetup({ cache: false }); //防止ajax呼叫時拿到cache資料
    var LoadingMsg = "<label id='LoadingMsg'  style='color:red;position:absolute;z-index:99;font-size:50%;'><b>載入中，請稍候... </b></label>";
    $(document).ajaxStart(function () { //所有AjaxRequest發出、結束時，自動呼叫及取消載入中的畫面
        if (Apex.Dialog.ShowLoading == true) {
            Apex.Dialog.Loading.dialog("open");
            //保護眼睛，讀取中少用燈箱效果的dialog啊啊啊啊~~~~ by suan, 2013/05/09
            //暫時放置於H3也就是每頁Function名稱的標題
            //$("H3").append(LoadingMsg)
        }
    }).ajaxStop(function () {
        Apex.Dialog.Loading.dialog("close");
        $('body').decorate(); //動態改變頁面後, 重新偵測新物件並套用外觀
        $("#LoadingMsg").remove();
    }).ajaxError(function (e, jqxhr, settings, exception) {//錯誤時顯示
        Apex.Dialog.Loading.dialog("close");
        Apex.Dialog.Error.html(jqxhr.responseText).dialog("open");
    }).ajaxComplete(function () {
        $("#LoadingMsg").remove();
    })
    ;

    //jQueryUI + 千分號處理  -------------------------------------------------
    $('body').decorate().DecimalFormat();

    // GRID / DataTable -------------------------------------------------
    //光棒效果
    $('body').on('click', '.grid tbody tr', function () {
        //非凍結窗格的鎖定才可被選取(被鎖定的區域,也不會擁有Grid的JSON Data)
        if ($(this).parents('div.DTFC_LeftBodyWrapper').length < 1) {
            //改變選取列顏色
            var hiClass = 'ui-state-highlight';
            $(this).addClass(hiClass).siblings('.' + hiClass).removeClass(hiClass);
        };
    }).on('mouseenter', '.dataTables_wrapper', function () {
        //移至GRID上時，顯示提示
        if ($(this).find('table.grid').not('.noTips').length > 0) {
            $(this).tip('點選資料列以進行編輯');
        }
    });

    if ($.fn.dataTable) {
        //所有頁面的DataTables預設值
        $.extend(true, $.fn.dataTable.defaults, {
            "bJQueryUI": true,
            "bScrollCollapse": true,
            "sScrollY": "350px",
            //"sDom": '<"H"Tfr>t<"F"ip>', //for TableTools
            //"oLanguage": { "sUrl": "/Scripts/jquery.dataTable.zh.txt" }
        });

        //以下為TableTools 預設值
        //TableTools.DEFAULTS.sSwfPath = '/Content/DataTables-1.9.4/extras/TableTools/media/swf/copy_csv_xls_pdf.swf';
        //TableTools.DEFAULTS.aButtons = [{
        //    "sExtends": "csv",
        //    "sButtonText": "CSV文字檔",
        //    "sFileName": "*.txt", //存檔附檔名
        //    "sCharSet": "utf8", "bBomInc": true //避免中文亂碼
        //}];

        //-----數值排序
        //http://datatables.net/plug-ins/sorting#formatted_numbers
        //用於欄位的sType="decimal"
        jQuery.extend(jQuery.fn.dataTableExt.oSort, {
            "decimal-pre": function (a) {
                a = (a === "-") ? 0 : a.replace(/[^\d\-\.]/g, "");
                return parseFloat(a);
            },
            "decimal-asc": function (a, b) { return a - b; },
            "decimal-desc": function (a, b) { return b - a; }
        });
    }
    //--------------------------民國年 extender ---------------------------//
    // Pad Left
    String.prototype.padLeft = function (l, c) {
        return Array(l - this.length + 1).join(c || " ") + this;
    }
    $.extend($.datepicker, {
        formatDate: function (format, date, settings) {
            var d = date.getDate();
            var m = date.getMonth() + 1;
            var y = date.getFullYear();

            return String(y).padLeft(4, '0') + '/' + String(m).padLeft(2, '0') + '/' + String(d).padLeft(2, '0');
        },
        parseDate: function (format, value, settings) {
            // #4029，用tab建移至日期格式的input會出現NaN的狀況
            if (value == '____/__/__' || value == '') return new Date();

            var v = new String(value);

            var dd = v.split('/');
            var Y, M, D;

            Y = dd[0] - 0;// + 1911;
            M = dd[1] - 0 - 1;
            D = dd[2] - 0;

            //            if (v.length == 9) {/*1001215*/
            //                Y = v.substring(0, 3) - 0 + 1911;
            //                M = v.substring(4, 6) - 0 - 1;
            //                D = v.substring(7, 9) - 0;
            //                console.log(Y + ',' + M + ',' + D);
            //                return (new Date(Y, M, D));
            //            } else if (v.length == 8) {/*98/12/15*/
            //                Y = v.substring(0, 2) - 0 + 1911;
            //                M = v.substring(3, 5) - 0 - 1;
            //                D = v.substring(6, 8) - 0;
            //                console.log(Y + ',' + M + ',' + D);
            //                return (new Date(Y, M, D));
            //            }
            return (new Date(Y, M, D));
            //return (new Date());
        },
        //override _generateMonthYearHeader
        _generateMonthYearHeader: function (inst, drawMonth, drawYear, minDate, maxDate,
				secondary, monthNames, monthNamesShort) {
            var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
				changeMonth = this._get(inst, "changeMonth"),
				changeYear = this._get(inst, "changeYear"),
				showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
				html = "<div class='ui-datepicker-title'>",
				monthHtml = "";

            // month selection
            if (secondary || !changeMonth) {
                monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
            } else {
                inMinYear = (minDate && minDate.getFullYear() === drawYear);
                inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
                monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
                for (month = 0; month < 12; month++) {
                    if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
                        monthHtml += "<option value='" + month + "'" +
							(month === drawMonth ? " selected='selected'" : "") +
							">" + monthNamesShort[month] + "</option>";
                    }
                }
                monthHtml += "</select>";
            }

            if (!showMonthAfterYear) {
                html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
            }

            // year selection
            if (!inst.yearshtml) {
                inst.yearshtml = "";
                if (secondary || !changeYear) {
                    //非下拉式選單的年份顯示，修改此處年份, 2013/07/04 , by suan
                    html += "<span class='ui-datepicker-year'>" + (drawYear) + "</span>";
                    //底下為原程式碼，也可以在jquery主檔裡找到
                    //html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
                } else {
                    // determine range of years to display
                    years = this._get(inst, "yearRange").split(":");
                    thisYear = new Date().getFullYear();
                    determineYear = function (value) {
                        var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
							(value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
							parseInt(value, 10)));
                        return (isNaN(year) ? thisYear : year);
                    };
                    year = determineYear(years[0]);
                    endYear = Math.max(year, determineYear(years[1] || ""));
                    year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
                    endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
                    inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
                    for (; year <= endYear; year++) {
                        inst.yearshtml += "<option value='" + year + "'" +
							(year === drawYear ? " selected='selected'" : "") +
							">" + (year) + "</option>"; //下拉式選單年份顯示，修改此處年份, 2013/07/04 , by suan
                    }
                    inst.yearshtml += "</select>";

                    html += inst.yearshtml;
                    inst.yearshtml = null;
                }
            }

            html += this._get(inst, "yearSuffix");
            if (showMonthAfterYear) {
                html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
            }
            html += "</div>"; // Close datepicker_header
            return html;
        }
    });
    //--------------------------民國年 extender End---------------------------//
    //報表的form設定另開視窗的屬性,2013/08/06,by suan
    $("#frmQuery").attr("target", "_blank");

    //複寫window.alert , 2013/08/17, by suan
    window.alert = function (str) {
        //do something additional
        if (console) console.log(str);

        $("<div>" + str + "</div>").dialog({
            resizable: false,
            autoOpen: true,
            modal: true,
            title: $('title:first').text(),
            buttons: { "確定": function () { $(this).dialog("close"); } }
        });
    }
});