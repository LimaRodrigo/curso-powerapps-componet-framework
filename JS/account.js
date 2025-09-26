if (typeof (PCFCurso) === "undefined") { PCFCurso = {}; }

PCFCurso.Account = {

    formContext: {},

    OnLoad: function (executionContext) {
        "use strict"
        PCFCurso.Account.formContext = executionContext.getFormContext();
        PCFCurso.Account.OnChange();

    },

    OnChange: function () {
        "use strict"
        const pcfControl = PCFCurso.Account.formContext.getControl("dyndev_PCFSeletor");
        pcfControl.addOnOutputChange(PCFCurso.Account.showDetailsPositiveConfirmationSuccess);
        pcfControl.addEventHandler("clickJorney", PCFCurso.Account.showDetailsJorney);

    },

    OnSave: function (executionContext) {

    },

    showDetailsJorney: (params) =>{
        "use strict"

        console.log(params);
    },

    showDetailsPositiveConfirmationSuccess: () => {
        "use strict"
        const outputs = PCFCurso.Account.formContext.getControl("dyndev_PCFSeletor").getOutputs();
        console.log(outputs);
    }
};