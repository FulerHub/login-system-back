import nodemailer from 'nodemailer';

class Mail {
    mailer;
    constructor() {

        this.mailer = nodemailer.createTransport(
            {
                host: "in-v3.mailjet.com",
                port: 587,
                secure: false,
                auth: {
                    user: 'd664d3d5980e29975654da8ba0ef7cbe',
                    pass: 'b3ec98a460ad5bcce0e78f267d9e4f81'
                },
                tls: {
                    ciphers:'SSLv3'
                }
            })
    }
    async sendActivate(to:string, link:string) {
        await this.mailer.sendMail({
            from: 'chuprina1936@outlook.com',
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