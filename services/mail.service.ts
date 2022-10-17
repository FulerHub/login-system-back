import nodemailer from 'nodemailer';

class Mail {
    mailer;
    constructor() {

        this.mailer = nodemailer.createTransport(
            {
                host: "***",
                port: 587,
                secure: false,
                auth: {
                    user: '***',
                    pass: '***'
                },
                tls: {
                    ciphers:'SSLv3'
                }
            })
    }
    async sendActivate(to:string, link:string) {
        await this.mailer.sendMail({
            from: '***',
            to:to,
            subject: 'Account activation from website',
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