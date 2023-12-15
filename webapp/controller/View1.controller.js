sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function () {
                $.sap.list = [];
                var oRouter = UIComponent.getRouterFor(this); //RouteView1
                oRouter.getRoute("RouteView1").attachMatched(this._onListMatched , this);
            },
            _onListMatched: function () {
                var oModel = this.getView().getModel();
                oModel.refresh(true);
            },
            onItemPress: function (oEvent) {
                var id = oEvent.getSource().getBindingContext().getPath()
                id = encodeURIComponent(id); //base 64 인코딩
                this.getOwnerComponent().getRouter().navTo("RouteView2", { key : id });
            },
            onCreate : function(oEvent){
                var sPath = oEvent.getSource().mProperties.text; //create
                sPath = encodeURIComponent(sPath); //base 64 인코딩
                this.getOwnerComponent().getRouter().navTo("RouteView2", { key : sPath });
                
            },
            onDelsel : function(oEvent){
                var oModel = this.getView().getModel();
                var list = this.getView().byId('LineItemsSmartTable').getTable().getSelectedContexts();
                if(list.length > 0){
                    for (var i = 0; i< list.length; i++){
                        console.log(list[i].getPath())
                        oModel.remove(list[i].getPath(),{
                            success: function () {
                                sap.m.MessageToast.show("Delete Success");
                            },
                            error: function (){
                                sap.m.MessageToast.show("Error");
                            }
                        });
                    }
                }
                oModel.refresh(true);
            },
            onSave : function(){
                var that = this;
                var oMaodel = this.getView().getModel();
                var Error = '';
                oModel.submitChanges({
                    success: function(oEvent){
                        try{
                            if (oEvent.__batchResponses[0].response.statusCode >= 400){
                                // console.log('실패')
                                var oResponse = oEvent['__batchResponses'][0].response.body // 문자열
                                var jsondata = JSON.parse(oResponse)
                                Error = jsondata.error.message.value;
                                sap.m.MessageBox.warning(Error);
                                
                            }
                        }
                        catch(err) {
                            // console.log('성공')
                            sap.m.MessageToast.show("Success")
                            that.getView().getModel().refresh();
                        }
                    },
                    error: function(oError){
                        console.log('실패')
                    }

                })

            },
            onEdit: function(){
                this.getView().byId('LineItemsSmartTable').setEditable(true);
            }

        });
    });
