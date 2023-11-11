class GoogleMail {
  
  /**
   * @param senderName - The name of the email sender.
   * @param senderEmailAlias - The email alias of the sender.
   */
  constructor(public senderName: string, public senderEmailAlias: string) {}

  //////////////////////
  ////    Public    ////
  //////////////////////
  
  /**
   * Sends an email with the specified subject and body to the given recipient.
   * 
   * @param emailRecipient - The email address of the recipient.
   * @param emailSubject - The subject line of the email.
   * @param emailBody - The body content of the email, in plain text.
   */
  public send(
    emailRecipient: string,
    emailSubject: string,
    emailBody: string,
  ): void {

    try {
      console.log(
        `[GoogleMail] Sending email...\n`,
        `  • Sender: ${this.senderName} <${this.senderEmailAlias}>\n`,
        `  • Recipient: ${emailRecipient}\n`,
        `  • Subject: ${emailSubject}\n`,
        `  • Body: ${emailBody}\n`,
      );
      const rawMimeEmail = this.toWebSafeEncoding(
        this.compileRawEmail(
          emailRecipient,
          emailSubject,
          emailBody,
        )
      )
      Gmail.Users?.Messages?.send({ "raw": rawMimeEmail }, "me");
    }
    catch (e) {
      throw new Error(
        `🔴 [GoogleMail] Failed to send email to '${emailRecipient}': ${e}`,
      );
    }
  }

  /////////////////////////
  ////    Protected    ////
  /////////////////////////

  protected compileRawEmail(
    emailRecipient: string,
    emailSubject: string,
    emailBody?: string,
  ): string {

    const encodedEmailSubject = this.utfEncodeSubject(emailSubject) ?? "";
    const lineSeparator: string = "\r\n";
    
    return [
      `MIME-Version: 1.0`,
      `To: ${emailRecipient}`,
      `From: ${this.senderName} <${this.senderEmailAlias}>`,
      `Subject: ${encodedEmailSubject}`,
      `Content-Type: multipart/alternative; boundary=boundaryboundary`,
      ``,
      `--boundaryboundary`,
      `Content-Type: text/plain; charset=UTF-8`,
      `Content-Transfer-Encoding: base64`,
      `${Utilities.base64Encode(emailBody ?? "", Utilities.Charset.UTF_8)}`,
      ``,
      `--boundaryboundary`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: base64`,
      `${Utilities.base64Encode(emailBody ?? "", Utilities.Charset.UTF_8)}`,
      ``,
      `--boundaryboundary--`,
    ]
      .join(lineSeparator);
  }

  protected utfEncodeSubject(value: string): string {
    return `=?UTF-8?B?${Utilities.base64Encode(value, Utilities.Charset.UTF_8)}?=`;
  }

  protected toWebSafeEncoding(data: string): string {
    return Utilities.base64EncodeWebSafe(data);
  }

}
