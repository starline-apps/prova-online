"use strict";
SGPApp
    .factory("Common", ["$rootScope","Config",function ($rootScope,Config) {
        function formatElementName(strName){
            strName = strName.replace("dialog-","");
            var arr = strName.split("-");
            strName = arr[0];
            for (var x=1 ; x<arr.length ; x++){
                strName += arr[x].substring(0, 1).toUpperCase() + arr[x].substring(1, arr[x].length).toLowerCase();
            }
        }
        function toggleDialog(strName){
            if ($rootScope.dialogs.global[strName] !== undefined){
                if ($rootScope.dialogs.global[strName].opened !== undefined) {
                    if ($rootScope.dialogs.global[strName].opened === true) {
                        $rootScope.dialogs.global[strName].opened = false;
                        setTimeout(function(){
                            $rootScope.dialogs.global[strName].openedIf = false;
                        },100);
                    } else {
                        $rootScope.dialogs.global[strName].opened = true;
                        $rootScope.dialogs.global[strName].openedIf = true;
                    }
                }
            }else if ($rootScope.dialogs.exam[strName] !== undefined){
                if ($rootScope.dialogs.exam[strName].opened !== undefined) {
                    if ($rootScope.dialogs.exam[strName].opened === true) {
                        $rootScope.dialogs.exam[strName].opened = false;
                        setTimeout(function(){
                            $rootScope.dialogs.exam[strName].openedIf = false;
                        },100);
                    } else {
                        $rootScope.dialogs.exam[strName].opened = true;
                        $rootScope.dialogs.exam[strName].openedIf = true;
                    }
                }
            }
        }
        function getDialogScaffold(){
            return{
                "style":"min-height:300px;max-height:800px;min-width:500px;max-width:800px;",
                "heading":"Aviso !",
                "opened":false,
                "openedIf":false,
                "transition":"paper-dialog-transition-bottom",
                "layered":true,
                "backdrop":true,
                "autoCloseDisabled":true,
                "content" : {
                    "style":"position:absolute;top:15%;left:0%;height:60%;width:90%;overflow-y:auto;list-style:none;padding-left:24px;",
                    "texts":[
                        {
                            "style":"",
                            "text":""
                        }
                    ]
                },
                "footer" : {
                    "style":"position:absolute;top:80%;left:0%;height:20%;width:100%;",
                    "buttons":[
                        {
                            "style":"",
                            "label":"",
                            "click":function(){
                                // code here
                            },
                            "arguments":""
                        }
                    ]
                }
            };
        }
        function toggleLoader(){
            $("#lstop").toggle();
            $("#lplay").toggle();
        }
        function loading(bln){
            if(bln){
                $("#lstop").hide();
                $("#lplay").show();
            }else{
                $("#lstop").show();
                $("#lplay").hide();
            }

        }

        function setPage (id, value){
            /*
            value = value.toString();
            var p = document.querySelector('#' + id);
            console.log(p);
            if (value==="next" && parseInt(p.selected)===0){
                p.selected = p.selected +1;
            }else if (value==="prev"  && parseInt(p.selected)===1){
                p.selected = p.selected -1;
            }else{
                p.selected = value;
            }
            */
            var p = document.querySelector("#" + id);
            p.selected = value;
        }

        function getDialogs(){
            var objDialogs = {"exam":{},"global":{}};
            var objDialog;
            var strButtonCancelClass  = "position:absolute;bottom:30%;right:5%;background-color:#78AE40;color:#FFF;";
            var strButtonConfirmClass = "position:absolute;bottom:30%;left:5%; background-color:#C9302C;color:#FFF;";
            var strButtonCloseClass   = "position:absolute;bottom:30%;right:5%;background-color:#375B5F;color:#FFF;";

            /* -------------------- dialog-system-unavailable -------------------- */
            objDialog = getDialogScaffold();
            objDialog.name = "dialog-system-unavailable";
            objDialog.content.texts = [
                {
                    "text" : "'Ocorreu um erro no sistema, tente novamente mais tarde.'"
                }
            ];
            objDialog.footer.buttons = [
                {
                    "label" : "Fechar",
                    "style" : strButtonCloseClass,
                    "click" : "$scope.toggleDialog('"+objDialog.name+"');$scope.exit();"
                }
            ];
            objDialogs.global[objDialog.name] = objDialog;
            /* ------------------------------------------------------------------- */

            /* ----------------------- dialog-invalid-exam ----------------------- */
            objDialog = getDialogScaffold();
            objDialog.name = "dialog-invalid-exam";
            objDialog.content.texts = [
                {
                    "text" : "'Não foi possível carregar a prova.'"
                }
            ];
            objDialog.footer.buttons = [
                {
                    "label" : "Fechar",
                    "style" : strButtonCloseClass,
                    "click" : "$scope.toggleDialog('"+objDialog.name+"')"
                }
            ];
            objDialogs.exam[objDialog.name] = objDialog;
            /* ------------------------------------------------------------------- */

            /* ------------------------ dialog-start-exam ------------------------ */
            objDialog = getDialogScaffold();
            objDialog.name = "dialog-start-exam";
            objDialog.content.texts = [
                {
                    "text" : "'A prova será iniciada agora'"
                },
                {
                    "text" : "'Seu navegador pedirá para entrar em modo \"tela cheia\". Autorize e faça sua prova.'"
                },
                {
                    "text" : "'Se você sair desse modo a prova será automaticamente encerrada e enviada a nossos servidores mesmo que não esteja completa.'"
                },
                {
                    "text" : "'Ao finalizar a prova clique no botão \"Finalizar prova\" exibido no menu acima.'"
                }
            ];
            objDialog.footer.buttons = [
                {
                    "label" : "Cancelar",
                    "style" : strButtonConfirmClass,
                    "click" : "$scope.toggleDialog('"+objDialog.name+"')"
                },
                {
                    "label" : "Começar",
                    "style" : strButtonCancelClass,
                    "click" : "$scope.start()"
                }
            ];
            objDialogs.exam[objDialog.name] = objDialog;
            /* ------------------------------------------------------------------- */

            /* -------------------- dialog-finished-by-system -------------------- */
            objDialog = getDialogScaffold();
            objDialog.name = "dialog-finished-by-system";
            objDialog.content.texts = [
                {
                    "text" : "'Detectamos que essa prova já existia no nosso sistema e ainda não havia sido enviada aos nossos servidores.'"
                },
                {
                    "text" : "'A prova foi finalizada e enviada.'"
                }
            ];
            objDialog.footer.buttons = [
                {
                    "label" : "Fechar",
                    "style" : strButtonCloseClass,
                    "click" : "$scope.toggleDialog('"+objDialog.name+"');$scope.instantResult();"
                }
            ];
            objDialogs.exam[objDialog.name] = objDialog;
            /* ------------------------------------------------------------------- */

            /* -------------------- dialog-finished-by-browser -------------------- */
            objDialog = getDialogScaffold();
            objDialog.name = "dialog-finished-by-browser";
            objDialog.content.texts = [
                {
                    "text" : "'A prova foi encerrada e enviada aos nossos servidores devido a uma saída do modo \"tela cheia\"'"
                }
            ];
            objDialog.footer.buttons = [
                {
                    "label" : "Fechar",
                    "style" : strButtonCloseClass,
                    "click" : "$scope.toggleDialog('"+objDialog.name+"');$scope.instantResult();"
                }
            ];
            objDialogs.exam[objDialog.name] = objDialog;
            /* ------------------------------------------------------------------- */

            /* -------------------- dialog-finished-by-time -------------------- */
            objDialog = getDialogScaffold();
            objDialog.name = "dialog-finished-by-time";
            objDialog.content.texts = [
                {
                    "text" : "'Tempo encerrado !'"
                }
            ];
            objDialog.footer.buttons = [
                {
                    "label" : "Fechar",
                    "style" : strButtonCloseClass,
                    "click" : "$scope.toggleDialog('"+objDialog.name+"');$scope.instantResult();"
                }
            ];
            objDialogs.exam[objDialog.name] = objDialog;
            /* ------------------------------------------------------------------- */

            /* -------------------- dialog-finished-by-user -------------------- */
            objDialog = getDialogScaffold();
            objDialog.name = "dialog-finished-by-user";
            objDialog.content.texts = [
                {
                    "text" : "'Obrigado por entregar a prova &nbsp;' + exam.assessment_name"
                },
                {
                    "text" : "'A prova foi enviada para nossos servidores.'"
                }
            ];
            objDialog.footer.buttons = [
                {
                    "label" : "Fechar",
                    "style" : strButtonCloseClass,
                    "click" : "$scope.toggleDialog('"+objDialog.name+"');$scope.instantResult();"
                }
            ];
            objDialogs.exam[objDialog.name] = objDialog;
            /* ------------------------------------------------------------------- */

            /* ------------------ dialog-finish-exam-confirmation ---------------- */
            objDialog = getDialogScaffold();
            objDialog.name = "dialog-finish-exam-confirmation";
            objDialog.heading = "Atenção !";
            objDialog.content.texts = [
                {
                    "text" : "'Questões respondidas : &nbsp;'+ examHeader.answers"
                },
                {
                    "text" : "'Questões sem respostas : &nbsp;' + (examHeader.items - examHeader.answers)"
                }
            ];
            objDialog.footer.buttons = [
                {
                    "label" : "Cancelar",
                    "style" : strButtonConfirmClass,
                    "click" : "Common.toggleDialog('"+objDialog.name+"')"
                },
                {
                    "label" : "Confirmar",
                    "style" : strButtonCancelClass,
                    "click" : "$scope.confirm()"
                }
            ];
            objDialogs.exam[objDialog.name] = objDialog;
            /* ------------------------------------------------------------------- */

            /* -------------------- dialog-processing-result --------------------- */
            objDialog = getDialogScaffold();
            objDialog.name = "dialog-processing-result";
            objDialog.content.texts = [
                {
                    "text" : "'Sua prova está sendo processada.'"
                },
                {
                    "style" : "text-align:center;margin-top:20px;",
                    "text" : "'<img src=\"images/aguarde.gif\" />'"
                }
            ];
            objDialog.footer.buttons = [
                {
                    "label" : "Cancelar",
                    "style" : strButtonCloseClass,
                    "click" : "$scope.toggleDialog('"+objDialog.name+"');$scope.exit();"
                }
            ];
            objDialogs.exam[objDialog.name] = objDialog;
            /* ------------------------------------------------------------------- */

            /* -------------------- dialog-result-processed --------------------- */
            objDialog = getDialogScaffold();
            objDialog.name = "dialog-result-processed";
            objDialog.content.texts = [
                {
                    "style":"text-align:center;margin-top:50px;font-size:24px;",
                    "text" : "'Sua nota é: &nbsp;&nbsp;<b>' + examResult + '</b>'"
                }
            ];
            objDialog.footer.buttons = [
                {
                    "label" : "Fechar",
                    "style" : strButtonCloseClass,
                    "click" : "$scope.toggleDialog('"+objDialog.name+"');$scope.exit();"
                }
            ];
            objDialogs.exam[objDialog.name] = objDialog;
            /* ------------------------------------------------------------------- */


            /* ------------------- dialog-return-to-fullscreen ------------------- */
            objDialog = getDialogScaffold();
            objDialog.name = "dialog-return-to-fullscreen";
            objDialog.content.texts = [
                {
                    "text" : "'Você saiu do modo \"Tela cheia\".'"
                },
                {
                    "text" : "'Clique no botão abaixo para retornar para a prova.'"
                }
            ];
            objDialog.footer.buttons = [
                {
                    "label" : "Retornar",
                    "style" : strButtonCloseClass,
                    "click" : "$scope.toggleDialog('"+objDialog.name+"');$scope.setFullscreen();"
                }
            ];
            objDialogs.exam[objDialog.name] = objDialog;
            /* ------------------------------------------------------------------- */

            return objDialogs;
        }
        function setHtml(html, arr){
            if (arr===undefined){
                arr = [];
            }
            var x;
            for (x=0 ; x<arr.length ; x++){
                html = replaceAll(html,"<" + arr[x],"[" + arr[x]);
            }
            html = $("<div/>").html(html).text();
            for (x=0 ; x<arr.length ; x++){
                html = replaceAll(html,"[" + arr[x],"<" + arr[x]);
            }
            html = setHtmlImage(html);

            html = replaceAll(html,"MsoNormal","");

            return html;
        }
        function setHtmlImage(html){
            return replaceAll(html,"\"/static/","\""+ Config.getStaticContentUrl() + "/");
        }
        function replaceAll(str, de, para){
            var pos = str.indexOf(de);
            while (pos > -1){
                str = str.replace(de, para);
                pos = str.indexOf(de);
            }
            return (str);
        }        
        return {

            loadingPage : function(blnShow, strImageControl){
                if (blnShow){
                    $rootScope.loadingPage = true;
                    $("#container").fadeOut( "fast");
                    $("#lstop").removeClass("opacity");
                    $("#loadingPage").animate({bottom:"45%",left:"47%"}, 300, "swing", function(){
                        loading(true);
                    });
                }else{
                    $rootScope.loadingPage = false;
                    loading(false);
                    $("#loadingPage").animate({bottom:"50px",left:"50px"}, 300, "swing", function(){
                        $("#container").fadeIn("fast");
                        $("#lstop").addClass("opacity");
                    });
                }
                if (strImageControl==="hide"){
                    $("#loadingPage").hide();
                }else{
                    $("#loadingPage").show();
                }
            },
            loading : function (bln){
                loading(bln);
            },
            toggleDialog : function (strName){
                toggleDialog(strName);
            },
            loadingContent : function (bln){
                if (bln){
                    setPage("main-animated-pages", "1");
                    $("#lstop").hide();
                    $("#lplay").show();
                    $(".overlay-transparent").show();
                }else{
                    setPage("main-animated-pages", "0");
                    $("#lstop").show();
                    $("#lplay").hide();
                    $(".overlay-transparent").hide();
                }

            },
            setPage : function (id, value){
                setPage(id, value);
            },
            setHtml : function (html, arr){
                return setHtml(html, arr);
            },
            setHtmlImage : function (html){
                return setHtmlImage(html);
            },
            setProgress : function(id, value){
                $("#" + id).attr("value",value);
                if (parseInt(value)===100){
                    setTimeout(function(){
                        $("#" + id).attr("value","0");
                    },1000);
                }
            },
            getDialogs : function(){
                return getDialogs();
            }
        };
    }]);