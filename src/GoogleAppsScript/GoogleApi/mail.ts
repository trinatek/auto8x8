class GoogleMail {
  private static lineSeparator: string = "\r\n";
  private static boundary: string = "boundaryboundary"
  private static authenticatedUser: string = "me"
  
  //////////////////////
  ////    Public    ////
  //////////////////////
  
  public static send(
    emailRecipient: string,
    emailSubject: string,
    emailBody: string,
    senderName?: string,
    senderEmailAlias?: string,
  ): void {
    
    log(
      `[GOOGLE MAIL] Sending email...\n`,
      `    Sender: ${senderName} <${senderEmailAlias}>\n`,
      `    Recipient: ${emailRecipient}\n`,
      `    Subject: ${emailSubject}\n`,
      `    Body: ${emailBody}\n`,
    );
    
    try {
      Gmail.Users?.Messages?.send(
        {
          raw: this.toWebSafeUtf(this.compileRawEmail(
            emailRecipient,
            emailSubject,
            emailBody,
            senderName,
            senderEmailAlias,
          ))
        },
        this.authenticatedUser,
      );
    } catch (e) {
      throw new Error(
        `[GOOGLE MAIL] 🔴 Failed to send email to '${emailRecipient}': ${e}`,
      );
    }
    
    log(`[GOOGLE MAIL] 🟢 Successfully sent email to '${emailRecipient}'.`)
  }

  ///////////////////////
  ////    Private    ////
  ///////////////////////

  private static compileRawEmail(
    emailRecipient: string,
    emailSubject: string,
    emailBody: string,
    senderName?: string,
    senderEmailAlias?: string,
  ): string {
    
    const encodedEmailSubject = this.toBase64Utf(emailSubject);
    const encodedEmailBody = this.toBase64Utf(emailBody);
    const fromNameEmail = [
      (senderName) ? `"${senderName}"` : "",
      (senderEmailAlias) ? `<${senderEmailAlias}>` : "",
    ]
      .join(" ");
    
    return [
      `MIME-Version: 1.0`,
      `To: ${emailRecipient}`,
      `From: ${fromNameEmail}`,
      `Subject: ${encodedEmailSubject}`,
      `Content-Type: multipart/alternative; boundary=${this.boundary}`,

      `--${this.boundary}`,
      `Content-Type: text/plain; charset=UTF-8`,
      `Content-Transfer-Encoding: base64`,
      `${encodedEmailBody}`,

      `--${this.boundary}`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: base64`,

      `${encodedEmailBody}`,
      `--${this.boundary}--`,
    ]
      .filter(this.filterEmptyRawLines)
      .join(this.lineSeparator);
  }
  
  private static toWebSafeUtf(data: string): string {
    return Utilities.base64EncodeWebSafe(data);
  }
  
  private static toBase64Utf(value: string): string {
    return `=?UTF-8?B?${Utilities.base64Encode(value, Utilities.Charset.UTF_8)}?=`;
  }
  
  private static filterEmptyRawLines(keyValue: string): boolean {
    const regex = /^.*[:]\s*(?<value>.*)$/;
    const match = keyValue.match(regex);
    return Boolean(match?.groups?.value?.trim());
  }
  
}
