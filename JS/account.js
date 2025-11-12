if (typeof (PCFCurso) === "undefined") { PCFCurso = {}; }
PCFCurso.Account = {
    formContext: {},
    controlName: "accountnumber",
    fieldNameDataUltimaValidacao: "dyndev_lastvalidationdate",
    tabNameJornada: "tab_jorneys",

    OnLoad: function (executionContext) {
        "use strict"
        try {

            PCFCurso.Account.formContext = executionContext.getFormContext();
            PCFCurso.Account.OnChange();

        } catch (error) {
            console.error(error, "error");
        }
    },

    OnChange: function () {
        "use strict"
        try {
            //o controle é exatamente o nome do campo que vc embedou o PCF 'dyndev_validation'
            const pcfControl = PCFCurso.Account.formContext.getControl(PCFCurso.Account.controlName);
            pcfControl.addOnOutputChange(PCFCurso.Account.notifyPositiveConfirmationSuccess);
            pcfControl.addEventHandler("clickJorney", PCFCurso.Account.showDetailsJorney);

        } catch (error) {
            PCFCurso.Account.log(error, "error");

        }
    },

    OnSave: function (executionContext) {

    },

    showDetailsJorney: function (params) {
        "use strict"
        try {
            PCFCurso.Account.formContext.ui.tabs.get(PCFCurso.Account.tabNameJornada).setVisible(true);
            PCFCurso.Account.formContext.ui.tabs.get(PCFCurso.Account.tabNameJornada).setFocus();
            console.log(params);
        } catch (error) {
            PCFCurso.Account.log(error, "error");
        }
    },

    notifyPositiveConfirmationSuccess: function () {
        "use strict"

        try {
            const outputs = PCFCurso.Account.formContext.getControl(PCFCurso.Account.controlName).getOutputs();
            PCFCurso.Account.log(`Positive Confirmation Success: ${outputs}`);
            const outputsprops = `${PCFCurso.Account.controlName}.fieldControl.validationDetailsForNotification`;
            if (outputs[outputsprops].value) {
                PCFCurso.Account.formContext.ui.setFormNotification(outputs[outputsprops].value, "INFO", "NTF");
            }

        } catch (error) {
            PCFCurso.Account.log(error, "error");
        }
    },

    log: function (message, level = "info") {
        if (level === "error") {
            console.error(`${new Date().toISOString()} - PCFCurso.Account - Error: ${message}`);
            return;
        }
        console.log(`${new Date().toISOString()} - PCFCurso.Account - Info: ${message}`);
    }
};