import nodemailer from 'nodemailer'
import { validate } from './validate.js'


// create email




export const emailSend = async (to,data)=>{

    try {

        const transport = nodemailer.createTransport({
            host : process.env.Email_HOST ,
            port : process.env.Email_PORT ,
            auth : {
                user : process.env.Email_USER ,
                pass : process.env.Email_PASS
            }
        });

        await transport.sendMail({
            from : `"User Authentication" <${process.env.Email_USER}>` ,
            to : to,
            subject : `Account Activation Email`,
            html : `
        
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <style>
                    *{
                        margin: 0;
                        padding: 0;
                    }
                    img{
                        max-width: 100%;
                    }
                    .main_wrapper{
                        height: 100vh;
                        background-color: gray;
                        padding-top: 50px;
                    }
                    .wrapper {
                    width: 50%;
                    display: block;
                    margin: auto;
                    background: white;
                    padding: 28px 0px;
                    padding-bottom: 0px;
                    box-shadow: 4px 4px 19px 7px black;
                    }
                    .logo {
                text-align: center;
                margin-bottom: 19px;
            }
                .body{
                    padding: 0px 25px;
                }
                
                .body h2 {
                font-size: 41px;
                margin: 12px 0px;
                font-style: italic;
                font-weight: 600;
                margin-top: 37px;
            }
            .body p {
                font-size: 19px;
                font-style: italic;
                font-weight: 400;
                margin-bottom: 23px;
            }
            .body a {
                font-size: 19px;
                color: white;
                background: #eb8383;
                text-decoration: none;
                padding: 8px 19px;
                border-radius: 11px;
                transition: .3s;
            }
            .footer {
                margin-top: 22px !important;
                font-size: 22px;
                list-style: none;
                padding: 0px 25px;
                margin-bottom: 30px;
            }
            .footer_bottom {
                background: black;
                color: white;
                padding: 18px;
                text-align: center;
            }
            .footer_bottom p {
                font-size: 20px;
                font-style: italic;
            }
                </style>
            </head>
            <body>
                <div class="main_wrapper">
                    <div class="wrapper">
                        <div class="logo">
                            <img src="https://ci3.googleusercontent.com/proxy/38rSLh8vi3V3b_6Fj0U20YET3Go4yRH34krH4MSit7LsTdrprPjRk0XdJKsZioXXfgih2W3M7zg7hReT-1GM0lV_gBR1f0nR1Mwig4Hm8aOUlczQ=s0-d-e1-ft#https://www.twilio.com/resources/images/email/twilio-logo-alt.jpg" alt="">
                        </div>
                        <hr>
                        <div class="body">
                            <h2>Dear ${data.name}</h2>
                            <p>You Email Verification link given below.please Check this mail ${data.email} and click this Button.</p>
                            <a href="${data.link}">Verify Now</a>
                            </div>
                        <div class="footer">
                            <span>If you want to know about to us go to our website.</span>
                        </div>
                        <div class="footer_bottom">
                            <p>©All right reserved by developershajib</p>
                        </div>
                    </div>
            
                </div>
            </body>
            </html>
                    
            `
        })
        
    } catch (error) {
        console.log(error.message);
    }

}

