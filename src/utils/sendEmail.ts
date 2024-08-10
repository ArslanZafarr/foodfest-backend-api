const nodemailer = require("nodemailer");

export async function sendResetPasswordEmail(to: string, token: string) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Reset Password',
        text: `Click the link to reset your password: ${process.env.CLIENT_URL}/reset-password?token=${token}`,
    };

    await transporter.sendMail(mailOptions);
}
