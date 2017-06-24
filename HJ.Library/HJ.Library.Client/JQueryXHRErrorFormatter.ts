module hj.library {
    export class JQueryXHRErrorFormatter {
        static toString(xhr: JQueryXHR, errorMessage: string) {
            var responseDetails = "Error Message: " + errorMessage + "r\n";
            responseDetails += "Status Code: " + xhr.status + "\r\n";
            responseDetails += "Status Text: " + xhr.statusText;

            // Since I am not using odata, so don't need to hanlde the odata specific error 
            //if (xhr.responseJSON) {
            //    if (xhr.responseJSON["odata.error"]) {
            //        if (xhr.responseJSON["odata.error"].message) {
            //            responseDetails += "\r\nMessage: " + xhr.responseJSON["odata.error"].message.value + "\r\n";
            //        }

            //        if (xhr.responseJSON["odata.error"].innererror) {
            //            responseDetails += "Inner Message: " + xhr.responseJSON["odata.error"].innererror.message;
            //        }
            //    }
            //}
            //else if (xhr.responseText) {
            //    responseDetails += "\r\nResponse Text: " + xhr.responseText;
            //}

            responseDetails += "\r\nResponse Text: " + xhr.responseText;

            return responseDetails;
        }
    }
}