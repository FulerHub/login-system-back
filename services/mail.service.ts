import nodemailer from 'nodemailer';

class Mail {
    mailer;
    constructor() {
        this.mailer = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            port: 587,
            secure: false,
            auth: {
                user: "send.logintest@outlook.com",
                pass: "send.password"
            },
            tls: {
                ciphers:'SSLv3'
            }
        })
    }
    async sendActivate(to:string, link:string) {
        await this.mailer.sendMail({
            from: "send.logintest@gmail.com",
            to:to,
            subject: 'Account activation from localhost',
            text: '',
            html:
                `
                    <div>
                        <h1>Activate your account using the link below</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

export default new Mail();