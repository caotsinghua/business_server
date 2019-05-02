import nodemailer from 'nodemailer';
const transport = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: '1577499543@qq.com',
        pass: 'tjkulsszmudkjibb',
    },
});

export function sendEmail({
    from,
    to,
    subject,
    text,
    html,
}: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
}) {
    return new Promise((resolve, reject) => {
        transport.sendMail(
            {
                from,
                to,
                subject,
                text,
                html,
            },
            function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            },
        );
    });
}

export default sendEmail;
