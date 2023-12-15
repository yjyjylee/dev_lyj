sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox"
], 

function( Controller, UIComponent, MessageBox ) {
	"use strict";
    var oPageStatus;
	return Controller.extend("project1.controller.View2", {
        /**
         * @override
         */
        onInit: function() {
            var oRouter = UIComponent.getRouterFor(this); //RouteView2
            oRouter.getRoute("RouteView2").attachMatched(this._onDetailMatched , this);
            
        
        },
        _onDetailMatched : function(oEvent) {
        var sPath = oEvent.getParameter('arguments').key
        oPageStatus = decodeURIComponent(sPath);
        if(sPath == 'Create'){
            var oModel = this.getView().getModel();
            //이전 생성 데이터의 오류 메세지가 계속 뜰때 해결 방법
            oModel.resetChanges();
            var oContext = oModel.createEntry("/zc_edu_student_lyj", {properties: {}});
            this.getView().byId('application-project1-display-component---View2--deletebutton').setVisible(false)
            //이전 데이터를 끌고 오는 현상 해결방법
            if(this.getView().getBindingContext()!== undefined){
                this.getView().unbindContext()
            }
            this.getView().setBindingContext(oContext)
            this.getView().byId('smartFormColumn').setEditable(true);
            // this.getView().byId('idStudCodeSmartField').setEditable(false);
        } else{
            // sPath = decodeURIComponent(sPath) // base64 디코딩
            this.getView().bindElement(oPageStatus);
            // this.getView().byId('idStudCodeSmartField').setEditable(false);
            this.getView().byId('application-project1-display-component---View2--deletebutton').setVisible(true)
        }
        
        },
        handleEditToggled : function(){
           var oObjectPage = this.getView().byId("ObjectPageLayout"),
           bCurrentShowFooterState = oObjectPage.getShowFooter();
           oObjectPage.setShowFooter(!bCurrentShowFooterState);
        },
        onCancelPress : function(oEvent){
            this.getView().byId('application-project1-display-component---View2--smartFormColumn-toolbar-sfmain-button-sfmain-editToggle').firePress()
        },

        onSavePress :  function() {
            var sError = '';
            var that = this;
            var oModel = this.getView().getModel();
            //submitchanges 사용-> create / update 나눌 필요 없음. 변화된 값을 가지고 저장.
            oModel.submitChanges({
                success: function(oEvent){
                    try{
                        if (oEvent.__batchResponses[0].response.statusCode >= 400){
                            // console.log('실패')
                            var oResponse = oEvent['__batchResponses'][0].response.body // 문자열
                            var jsondata = JSON.parse(oResponse)
                            sError = jsondata.error.message.value;
                            sap.m.MessageBox.warning(sError);
                            
                        }
                    }
                    catch(err) {
                        // console.log('성공')
                        sap.m.MessageToast.show("Success")
                        // that.getView().getModel().refresh();
                    // }
                    }
                },
                error : function(oError){
                    sap.m.MessageToast.show("Error")
                }
            })
            ////기존의 방법: create 랑 update 랑 나눠서 키 값 가져와서 update 하는거.
        //     if(oPageStatus =='Create'){
        //         //생성
        //         var create = this.getView().getBindingContext().getObject();
        //         oModel.create("/zc_edu_student_lyj", create, {
        //             success: function(){
        //                 debugger;
        //                 sap.m.MessageToast.show("Success")
        //                 // that.onCancelPress()
        //             },
        //             error: function(error){
        //                 var message = JSON.parse(error.responseText).error.message.value;
        //                 sap.m.MessageBox.warning(message);
        //             }
        //         })
                
        //     }else{
        //     var data = oModel.getData('/');
        //     var key = Object.keys(data)[0];
        //     var sPath = "/" + key;
        //     var update = this.getView().getBindingContext().getObject();
        //     oModel.update(sPath, update, {
        //         method: "PATCH",
        //         success: function(){sap.m.MessageToast.show("Success")},
        //         error: function(error){
        //             var message = JSON.parse(error.responseText).error.message.value;
        //             sap.m.MessageBox.warning(message);
        //         }
        //     })
           
        // }

        },

        onDeletePress: function() {
            var that = this;
            MessageBox.show(
                'Delete this product?',
                {
                    icon: MessageBox.Icon.WARNING,
                    title: "DELETE",
                    actions: ["Delete", MessageBox.Action.CANCEL ],
                    emphasizedAction: "Delete",
                    initialFocus: "Delete",
                    onClose:function(oAction){
                        //삭제
                        if(oAction == 'Delete'){
                            that.getView().getModel().remove(oPageStatus, {
                                success: function () {
                                    sap.m.MessageToast.show("Delete Success");
                                    setTimeout(function demo() {
                                        that._move();
                                    }, 1000);
                                },
                                error: function (){
                                    sap.m.MessageToast.show("Error");
                                }
                            }
                            )

                        }
                    }
                }
            );


        },
        _move: function(){
            var oRouter = UIComponent.getRouterFor(this); 
            console.log(oRouter);
            oRouter.navTo("RouteView1", {}, true);
            
        }

	});
});