(function ($) {
    $.fn.UiButton = function () {
        var a = $("#container").find("a");
        if (a.length > 0) {
            a.attr("role", "button");
        }

        var b = $("#container").find("button, a");
        if (b.length > 0) {
            b.addClass("btn btn-outlined btn-primary");
        }
    }
})(jQuery);

var xAjaxDialog = null;
$(function () {
    // ref https://nakupanda.github.io/bootstrap3-dialog/
    xAjaxDialog = new BootstrapDialog({
        title: $('title:first').text()
    });
    //=====一般行為=====
    $('body').UiButton();
    //=====Ajax行為=====
    $.ajaxSetup({ cache: false }); //防止ajax呼叫時拿到cache資料
    $(document).ajaxStart(function () { //所有AjaxRequest發出、結束時，自動呼叫及取消載入中的畫面        
        //$("div#info").text("載入中...").addClass("alert alert-info").show();
        xAjaxDialog.setMessage("載入中...");
        xAjaxDialog.setClosable(false);
        xAjaxDialog.open();
    }).ajaxStop(function () {
        //$("div#info").text("").removeClass("alert alert-info").hide();
        xAjaxDialog.setMessage("");
        xAjaxDialog.setClosable(true);
        xAjaxDialog.close();
        $('body').UiButton(); //動態改變頁面後, 重新偵測新物件並套用外觀
    }).ajaxError(function (e, jqxhr, settings, exception) {//錯誤時顯示
        //$("div#info").text(jqxhr.responseText).addClass("alert alert-info").show();
        xAjaxDialog.setMessage(jqxhr.responseText);
        xAjaxDialog.setClosable(true);
        xAjaxDialog.open();
    }).ajaxComplete(function () {
        //$("div#info").text("").removeClass("alert alert-info").hide();
        xAjaxDialog.setMessage("");
        xAjaxDialog.setClosable(true);
        xAjaxDialog.close();
    });

    //複寫window.alert
    window.alert = function (str) {
        BootstrapDialog.show({
            title: $('title:first').text(),
            message: str
        });
    }
});