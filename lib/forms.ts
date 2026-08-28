/**
 * Web3Forms delivers both site forms. The access key is a public, per form
 * identifier by design; it authorises delivery to the owner's inbox and
 * carries no account privileges.
 */
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
export const WEB3FORMS_ACCESS_KEY = "cd45ef9f-52a9-4848-839f-1fcaaea9bfc3";

export type SubmitState = "idle" | "sending" | "sent" | "error";
