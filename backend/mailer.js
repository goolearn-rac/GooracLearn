require('dotenv').config();

/**
 * Send Advanced Payment Receipt Email via Google Apps Script Webhook Bypass
 */
const sendCourseReceipt = async (userEmail, userName, courseId, amountPaid, currency, paymentId) => {
    
    // Format the course string (e.g., "hr-management" -> "HR Management")
    const courseNameFormatted = courseId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
    // Convert Razorpay sub-units (paise) back to readable pricing integers
    const actualAmount = (amountPaid / 100).toFixed(2);
    const currencySymbol = currency === "INR" ? "₹" : currency;
    const dateOfPurchase = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const dashboardLink = "https://learn.goorac.biz/";
    const currentYear = new Date().getFullYear();

    // ==========================================
    // 🚀 ENTERPRISE HTML TEMPLATE RANDOMIZER
    // ==========================================
    
    // Base table CSS injected into templates to strictly prevent layout breaks from long strings
    const safeTableStyle = "width: 100%; border-collapse: collapse; table-layout: fixed;";
    const safeTdStyleLeft = "padding: 8px 0; font-weight: 500; word-wrap: break-word;";
    const safeTdStyleRight = "padding: 8px 0; text-align: right; font-weight: 600; word-break: break-all;";

    const templates = [
        // 1. Original Upgraded (Dark/Green)
        `<!DOCTYPE html><html><body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #0f172a;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; word-wrap: break-word;">
                <div style="background-color: #020617; padding: 30px 40px; text-align: center;"><h1 style="color: #10b981; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Goorac <span style="color: #ffffff;">Learn</span></h1></div>
                <div style="padding: 40px;">
                    <div style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Welcome to the community, ${userName}! 🎉</div>
                    <div style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 30px;">We're thrilled to have you on board. Your payment was successful, and your learning journey in <strong>${courseNameFormatted}</strong> starts right now. Let's achieve great things together!</div>
                    <div style="background-color: #f1f5f9; border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; font-weight: 700;">Transaction Receipt</div>
                        <table style="${safeTableStyle}">
                            <tr><td style="${safeTdStyleLeft} color: #64748b; width: 40%;">Date</td><td style="${safeTdStyleRight} color: #0f172a;">${dateOfPurchase}</td></tr>
                            <tr><td style="${safeTdStyleLeft} color: #64748b;">Course</td><td style="${safeTdStyleRight} color: #0f172a;">${courseNameFormatted}</td></tr>
                            <tr><td style="${safeTdStyleLeft} color: #64748b;">Transaction ID</td><td style="${safeTdStyleRight} color: #059669; font-family: monospace;">${paymentId}</td></tr>
                        </table>
                        <div style="border-top: 1px dashed #cbd5e1; padding-top: 15px; margin-top: 15px;">
                            <table style="${safeTableStyle}"><tr style="font-size: 18px;"><td style="${safeTdStyleLeft} color: #64748b;">Total Paid</td><td style="${safeTdStyleRight} color: #0f172a;">${currencySymbol}${actualAmount}</td></tr></table>
                        </div>
                    </div>
                    <div style="text-align: center; margin: 35px 0 10px 0;"><a href="${dashboardLink}" style="background-color: #059669; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">Go to Dashboard</a></div>
                </div>
                <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0;">&copy; ${currentYear} Goorac Corporation. All rights reserved.<br>This is an automated receipt. Please do not reply to this email.</div>
            </div>
        </body></html>`,

        // 2. Corporate Blue
        `<!DOCTYPE html><html><body style="font-family: Arial, sans-serif; background-color: #f0f4f8; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="background-color: #0052cc; padding: 30px; text-align: left;"><h1 style="color: #ffffff; margin: 0; font-size: 22px;">Goorac Learn | Receipt</h1></div>
                <div style="padding: 30px;">
                    <h2 style="color: #172b4d; font-size: 20px; margin-top: 0;">Dear Student, ${userName},</h2>
                    <p style="color: #42526e; line-height: 1.5;">Welcome to our learning platform! We truly appreciate your trust in us. Your enrollment in <strong>${courseNameFormatted}</strong> is confirmed, and your premium resources are officially unlocked and ready for you.</p>
                    <table style="${safeTableStyle} margin: 20px 0; border: 1px solid #dfe1e6;">
                        <tr style="background-color: #f4f5f7;"><th style="padding: 12px; text-align: left; color: #5e6c84; font-size: 12px; text-transform: uppercase;">Description</th><th style="padding: 12px; text-align: right; color: #5e6c84; font-size: 12px; text-transform: uppercase;">Details</th></tr>
                        <tr><td style="${safeTdStyleLeft} padding: 12px; border-bottom: 1px solid #dfe1e6;">Order Date</td><td style="${safeTdStyleRight} padding: 12px; border-bottom: 1px solid #dfe1e6;">${dateOfPurchase}</td></tr>
                        <tr><td style="${safeTdStyleLeft} padding: 12px; border-bottom: 1px solid #dfe1e6;">Ref ID</td><td style="${safeTdStyleRight} padding: 12px; border-bottom: 1px solid #dfe1e6; font-family: monospace; color: #0052cc;">${paymentId}</td></tr>
                        <tr><td style="${safeTdStyleLeft} padding: 12px; font-weight: bold; color: #172b4d;">Total</td><td style="${safeTdStyleRight} padding: 12px; font-weight: bold; color: #172b4d;">${currencySymbol}${actualAmount}</td></tr>
                    </table>
                    <a href="${dashboardLink}" style="display: block; width: 100%; text-align: center; background-color: #0052cc; color: white; text-decoration: none; padding: 14px 0; border-radius: 4px; font-weight: bold; margin-top: 20px;">Access Course</a>
                </div>
                <div style="background-color: #f4f5f7; padding: 20px; text-align: center; font-size: 12px; color: #5e6c84;">&copy; ${currentYear} Goorac Corporation. All rights reserved. <br>System Generated Receipt.</div>
            </div>
        </body></html>`,

        // 3. Dark Mode Tech
        `<!DOCTYPE html><html><body style="font-family: Consolas, 'Courier New', monospace; background-color: #000000; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #333333; padding: 30px;">
                <div style="color: #00ff00; font-size: 24px; font-weight: bold; margin-bottom: 20px;">>_ GOORAC_LEARN</div>
                <div style="color: #ffffff; font-size: 16px; margin-bottom: 10px;">> ACCESS_GRANTED. WELCOME, ${userName.toUpperCase()}.</div>
                <p style="color: #aaaaaa; margin-top: 0; margin-bottom: 30px; line-height: 1.5;">Your secure connection to the knowledge base is established. We are glad to have you in our network. Your system is ready when you are.</p>
                <div style="color: #aaaaaa; margin-bottom: 15px;">TARGET_MODULE: ${courseNameFormatted}</div>
                <table style="${safeTableStyle} color: #ffffff; border-top: 1px solid #333; border-bottom: 1px solid #333; padding: 10px 0;">
                    <tr><td style="${safeTdStyleLeft} width: 40%; color: #888;">DATE:</td><td style="${safeTdStyleRight}">${dateOfPurchase}</td></tr>
                    <tr><td style="${safeTdStyleLeft} color: #888;">TX_ID:</td><td style="${safeTdStyleRight} color: #00ff00;">${paymentId}</td></tr>
                    <tr><td style="${safeTdStyleLeft} color: #888;">AMOUNT:</td><td style="${safeTdStyleRight}">${currencySymbol}${actualAmount}</td></tr>
                </table>
                <div style="margin-top: 30px;"><a href="${dashboardLink}" style="background-color: #00ff00; color: #000000; text-decoration: none; padding: 12px 24px; font-weight: bold; display: inline-block;">[ INITIATE_DASHBOARD ]</a></div>
                <div style="margin-top: 40px; font-size: 11px; color: #444444; border-top: 1px solid #222; padding-top: 15px;">(c) ${currentYear} GOORAC CORP. // AUTOMATED_TRANSMISSION // DO_NOT_REPLY</div>
            </div>
        </body></html>`,

        // 4. Minimalist White
        `<!DOCTYPE html><html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff; margin: 0; padding: 0;">
            <div style="max-width: 500px; margin: 40px auto; padding: 20px; color: #1d1d1f;">
                <h1 style="font-size: 28px; font-weight: 600; margin-bottom: 8px;">Receipt.</h1>
                <p style="color: #86868b; font-size: 15px; margin-top: 0; margin-bottom: 25px;">Goorac Learn</p>
                <p style="color: #1d1d1f; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">Hello ${userName}. We're incredibly glad you're here. Your transaction is complete, and your next big chapter awaits. Dive right in.</p>
                <div style="font-size: 42px; font-weight: 500; margin-bottom: 40px; letter-spacing: -1px;">${currencySymbol}${actualAmount}</div>
                <table style="${safeTableStyle} font-size: 14px; border-top: 1px solid #d2d2d7; margin-bottom: 40px;">
                    <tr><td style="${safeTdStyleLeft} border-bottom: 1px solid #d2d2d7; color: #86868b; width: 35%;">Item</td><td style="${safeTdStyleRight} border-bottom: 1px solid #d2d2d7;">${courseNameFormatted}</td></tr>
                    <tr><td style="${safeTdStyleLeft} border-bottom: 1px solid #d2d2d7; color: #86868b;">Date</td><td style="${safeTdStyleRight} border-bottom: 1px solid #d2d2d7;">${dateOfPurchase}</td></tr>
                    <tr><td style="${safeTdStyleLeft} border-bottom: 1px solid #d2d2d7; color: #86868b;">Payment ID</td><td style="${safeTdStyleRight} border-bottom: 1px solid #d2d2d7; font-family: monospace;">${paymentId}</td></tr>
                </table>
                <a href="${dashboardLink}" style="background-color: #1d1d1f; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 20px; font-size: 14px; display: inline-block; font-weight: 500;">View Dashboard</a>
                <div style="margin-top: 50px; border-top: 1px solid #f5f5f7; padding-top: 20px; font-size: 12px; color: #86868b; text-align: left;">&copy; ${currentYear} Goorac Corporation. All rights reserved.<br>Please do not reply to this automated message.</div>
            </div>
        </body></html>`,

        // 5. Modern Card UI (Purple/Indigo)
        `<!DOCTYPE html><html><body style="font-family: 'Inter', sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
            <div style="max-width: 550px; margin: 0 auto; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 24px; padding: 3px;">
                <div style="background-color: #ffffff; border-radius: 22px; padding: 40px;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div style="background-color: #ede9fe; color: #5b21b6; font-weight: bold; padding: 8px 16px; border-radius: 99px; display: inline-block; margin-bottom: 15px; font-size: 14px;">Goorac Learn</div>
                        <h1 style="color: #111827; margin: 0; font-size: 26px;">Hey there, ${userName}!</h1>
                    </div>
                    <p style="text-align: center; color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">We are so excited to see you here. Everything is set up perfectly, and your new course is officially unlocked. Happy learning!</p>
                    <table style="${safeTableStyle} background-color: #f9fafb; border-radius: 12px; padding: 20px;">
                        <tr><td style="${safeTdStyleLeft} color: #6b7280; padding: 12px 20px;">Course</td><td style="${safeTdStyleRight} color: #111827; padding: 12px 20px;">${courseNameFormatted}</td></tr>
                        <tr><td style="${safeTdStyleLeft} color: #6b7280; padding: 12px 20px;">Date</td><td style="${safeTdStyleRight} color: #111827; padding: 12px 20px;">${dateOfPurchase}</td></tr>
                        <tr><td style="${safeTdStyleLeft} color: #6b7280; padding: 12px 20px;">Ref ID</td><td style="${safeTdStyleRight} color: #4f46e5; padding: 12px 20px; font-family: monospace;">${paymentId}</td></tr>
                        <tr><td colspan="2"><hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 0 20px;"></td></tr>
                        <tr><td style="${safeTdStyleLeft} color: #111827; font-weight: bold; padding: 12px 20px;">Total</td><td style="${safeTdStyleRight} color: #111827; font-weight: bold; font-size: 18px; padding: 12px 20px;">${currencySymbol}${actualAmount}</td></tr>
                    </table>
                    <div style="text-align: center; margin-top: 30px;"><a href="${dashboardLink}" style="background-color: #4f46e5; color: white; text-decoration: none; padding: 14px 40px; border-radius: 12px; font-weight: 600; display: inline-block;">Start Learning</a></div>
                    <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #9ca3af;">&copy; ${currentYear} Goorac Corporation. All rights reserved.<br>Automated Notice.</div>
                </div>
            </div>
        </body></html>`,

        // 6. Fintech Style (Dark Slate & Mint)
        `<!DOCTYPE html><html><body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; margin: 0; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                <div style="color: #2dd4bf; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Goorac Learn</div>
                <div style="color: #f8fafc; font-size: 32px; font-weight: 300; margin-bottom: 15px;">Payment <span style="font-weight: 700;">Confirmed</span></div>
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Welcome aboard, ${userName}. Your transaction has cleared successfully. We are deeply committed to supporting your educational growth.</p>
                <table style="${safeTableStyle} color: #cbd5e1; border-top: 1px solid #334155; padding-top: 20px;">
                    <tr><td style="${safeTdStyleLeft} color: #94a3b8; width: 30%;">User</td><td style="${safeTdStyleRight}">${userName}</td></tr>
                    <tr><td style="${safeTdStyleLeft} color: #94a3b8;">Item</td><td style="${safeTdStyleRight}">${courseNameFormatted}</td></tr>
                    <tr><td style="${safeTdStyleLeft} color: #94a3b8;">Txn Hash</td><td style="${safeTdStyleRight} color: #2dd4bf; font-family: monospace;">${paymentId}</td></tr>
                    <tr><td style="${safeTdStyleLeft} color: #94a3b8;">Date</td><td style="${safeTdStyleRight}">${dateOfPurchase}</td></tr>
                </table>
                <div style="background-color: #0f172a; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                    <div style="color: #94a3b8; font-size: 14px; margin-bottom: 5px;">Amount Settled</div>
                    <div style="color: #f8fafc; font-size: 28px; font-weight: bold;">${currencySymbol}${actualAmount}</div>
                </div>
                <a href="${dashboardLink}" style="background-color: #2dd4bf; color: #0f172a; text-decoration: none; padding: 16px; border-radius: 8px; font-weight: bold; display: block; text-align: center;">Access Dashboard</a>
                <div style="margin-top: 40px; font-size: 12px; color: #475569; text-align: center; border-top: 1px solid #334155; padding-top: 20px;">&copy; ${currentYear} Goorac Corporation. System Generated Record. Do not reply.</div>
            </div>
        </body></html>`,

        // 7. Elegant Light (Soft Shadows)
        `<!DOCTYPE html><html><body style="font-family: 'Trebuchet MS', sans-serif; background-color: #fafafa; margin: 0; padding: 40px 20px;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); padding: 40px;">
                <div style="text-align: center; margin-bottom: 25px;">
                    <img src="https://img.icons8.com/fluency/48/000000/ok.png" width="48" style="margin-bottom: 15px;"/>
                    <h2 style="color: #333; margin: 0; font-size: 22px;">Payment Successful</h2>
                    <p style="color: #777; font-size: 14px; margin-top: 5px;">Goorac Learn Enrollment</p>
                </div>
                <p style="text-align: center; color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">Warm greetings, ${userName}. Thank you for choosing us for your educational journey. Your access has been beautifully prepared.</p>
                <table style="${safeTableStyle} font-size: 15px; color: #444;">
                    <tr><td style="${safeTdStyleLeft} border-bottom: 1px solid #eee;">Name</td><td style="${safeTdStyleRight} border-bottom: 1px solid #eee;">${userName}</td></tr>
                    <tr><td style="${safeTdStyleLeft} border-bottom: 1px solid #eee;">Course</td><td style="${safeTdStyleRight} border-bottom: 1px solid #eee;">${courseNameFormatted}</td></tr>
                    <tr><td style="${safeTdStyleLeft} border-bottom: 1px solid #eee;">Date</td><td style="${safeTdStyleRight} border-bottom: 1px solid #eee;">${dateOfPurchase}</td></tr>
                    <tr><td style="${safeTdStyleLeft} border-bottom: 1px solid #eee;">Receipt No.</td><td style="${safeTdStyleRight} border-bottom: 1px solid #eee; font-family: monospace;">${paymentId}</td></tr>
                    <tr><td style="${safeTdStyleLeft} font-weight: bold; font-size: 18px; padding-top: 15px;">Total</td><td style="${safeTdStyleRight} font-weight: bold; font-size: 18px; padding-top: 15px;">${currencySymbol}${actualAmount}</td></tr>
                </table>
                <div style="text-align: center; margin-top: 40px;"><a href="${dashboardLink}" style="background-color: #1a1a1a; color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-size: 15px;">Login to Portal</a></div>
                <div style="text-align: center; margin-top: 30px; border-top: 1px solid #f0f0f0; padding-top: 20px; font-size: 12px; color: #aaa;">&copy; ${currentYear} Goorac Corporation. All rights reserved. Automated Receipt.</div>
            </div>
        </body></html>`,

        // 8. Start-up Vibrant (Gradient Header)
        `<!DOCTYPE html><html><body style="font-family: 'Helvetica Neue', sans-serif; background-color: #f4f7f6; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                <div style="background: linear-gradient(90deg, #ff6b6b 0%, #ff8e53 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Goorac Learn!</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="color: #333; font-size: 18px; font-weight: bold; margin-top: 0;">Awesome to meet you, ${userName}!</p>
                    <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">Get ready for an incredible learning experience. Your spot is completely secured and you're all set to start.</p>
                    <div style="background-color: #fff9f6; border-left: 4px solid #ff6b6b; padding: 15px; margin-bottom: 25px;">
                        <table style="${safeTableStyle} color: #333; font-size: 14px;">
                            <tr><td style="${safeTdStyleLeft} color: #777; width: 30%;">Enrolled in:</td><td style="${safeTdStyleRight} font-weight: bold;">${courseNameFormatted}</td></tr>
                            <tr><td style="${safeTdStyleLeft} color: #777;">Paid:</td><td style="${safeTdStyleRight} font-weight: bold; color: #ff6b6b;">${currencySymbol}${actualAmount}</td></tr>
                            <tr><td style="${safeTdStyleLeft} color: #777;">Date:</td><td style="${safeTdStyleRight}">${dateOfPurchase}</td></tr>
                            <tr><td style="${safeTdStyleLeft} color: #777;">Order ID:</td><td style="${safeTdStyleRight} font-family: monospace;">${paymentId}</td></tr>
                        </table>
                    </div>
                    <a href="${dashboardLink}" style="display: block; width: 100%; text-align: center; background-color: #ff6b6b; color: white; text-decoration: none; padding: 15px 0; border-radius: 6px; font-weight: bold; font-size: 16px;">Jump to Dashboard</a>
                </div>
                <div style="background-color: #f9fbfb; padding: 20px; text-align: center; font-size: 12px; color: #888;">&copy; ${currentYear} Goorac Corporation. All rights reserved.</div>
            </div>
        </body></html>`,

        // 9. Classic Academic (Serif, Navy & Gold)
        `<!DOCTYPE html><html><body style="font-family: 'Georgia', serif; background-color: #eaeaea; margin: 0; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #cccccc; padding: 40px;">
                <div style="text-align: center; border-bottom: 2px solid #002147; padding-bottom: 20px; margin-bottom: 20px;">
                    <h1 style="color: #002147; font-size: 28px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Goorac Learn</h1>
                    <div style="color: #b38b22; font-style: italic; margin-top: 5px;">Official Receipt of Enrollment</div>
                </div>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">Esteemed Student, <strong>${userName}</strong>. We are honored to welcome you to our institution. Your administrative and financial clearances are complete. Let the studies commence.</p>
                <table style="${safeTableStyle} margin: 30px 0; font-size: 15px; color: #000;">
                    <tr><td style="${safeTdStyleLeft} border-bottom: 1px dotted #ccc;">Program</td><td style="${safeTdStyleRight} border-bottom: 1px dotted #ccc;">${courseNameFormatted}</td></tr>
                    <tr><td style="${safeTdStyleLeft} border-bottom: 1px dotted #ccc;">Date of Transaction</td><td style="${safeTdStyleRight} border-bottom: 1px dotted #ccc;">${dateOfPurchase}</td></tr>
                    <tr><td style="${safeTdStyleLeft} border-bottom: 1px dotted #ccc;">Reference Code</td><td style="${safeTdStyleRight} border-bottom: 1px dotted #ccc; font-family: monospace;">${paymentId}</td></tr>
                    <tr><td style="${safeTdStyleLeft} padding-top: 15px;"><strong>Total Remitted</strong></td><td style="${safeTdStyleRight} padding-top: 15px;"><strong>${currencySymbol}${actualAmount}</strong></td></tr>
                </table>
                <div style="text-align: center; margin-top: 40px; margin-bottom: 30px;"><a href="${dashboardLink}" style="background-color: #002147; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 2px; font-family: sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Access Portal</a></div>
                <div style="text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; font-family: sans-serif;">&copy; ${currentYear} Goorac Corporation. All Rights Reserved. Automated Issuance.</div>
            </div>
        </body></html>`,

        // 10. High-Contrast Accessibility-focused
        `<!DOCTYPE html><html><body style="font-family: Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; border: 4px solid #000000; padding: 30px;">
                <div style="background-color: #000000; color: #ffff00; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; text-transform: uppercase;">Goorac Learn Receipt</div>
                <h2 style="color: #000000; font-size: 22px; margin-top: 25px;">Payment Received</h2>
                <p style="color: #000000; font-size: 18px; font-weight: bold;">User: ${userName}</p>
                <p style="color: #000000; font-size: 16px; font-weight: bold; background-color: #ffff00; padding: 10px; margin-bottom: 20px;">WELCOME! YOUR PAYMENT IS SECURE. YOU ARE READY TO START LEARNING IMMEDIATELY.</p>
                <table style="${safeTableStyle} margin-top: 20px; border-collapse: collapse; width: 100%;">
                    <tr><td style="${safeTdStyleLeft} border: 2px solid #000; padding: 10px; background-color: #f0f0f0;">Course</td><td style="${safeTdStyleRight} border: 2px solid #000; padding: 10px;">${courseNameFormatted}</td></tr>
                    <tr><td style="${safeTdStyleLeft} border: 2px solid #000; padding: 10px; background-color: #f0f0f0;">Date</td><td style="${safeTdStyleRight} border: 2px solid #000; padding: 10px;">${dateOfPurchase}</td></tr>
                    <tr><td style="${safeTdStyleLeft} border: 2px solid #000; padding: 10px; background-color: #f0f0f0;">ID</td><td style="${safeTdStyleRight} border: 2px solid #000; padding: 10px; font-family: monospace;">${paymentId}</td></tr>
                    <tr><td style="${safeTdStyleLeft} border: 2px solid #000; padding: 10px; background-color: #000000; color: #ffffff;">Amount</td><td style="${safeTdStyleRight} border: 2px solid #000; padding: 10px; font-size: 20px;">${currencySymbol}${actualAmount}</td></tr>
                </table>
                <a href="${dashboardLink}" style="display: block; width: 100%; text-align: center; background-color: #000000; color: #ffff00; text-decoration: none; padding: 18px 0; font-weight: bold; font-size: 18px; margin-top: 30px; border: 2px solid #000;">OPEN DASHBOARD</a>
                <div style="margin-top: 30px; font-size: 14px; font-weight: bold; color: #000000; text-align: center; border-top: 4px solid #000000; padding-top: 15px;">&copy; ${currentYear} GOORAC CORPORATION. AUTOMATED MESSAGE.</div>
            </div>
        </body></html>`,

        // 11. Neumorphic Design
        `<!DOCTYPE html><html><body style="font-family: 'Poppins', sans-serif; background-color: #e0e5ec; margin: 0; padding: 40px 20px;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #e0e5ec; border-radius: 20px; box-shadow: 9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5); padding: 40px;">
                <h1 style="color: #4d4d4d; text-align: center; font-size: 24px; margin-top: 0;">Goorac Learn</h1>
                <p style="color: #4d4d4d; text-align: center; font-size: 18px; font-weight: bold; margin-top: 10px; margin-bottom: 5px;">Hi ${userName}!</p>
                <p style="color: #666; text-align: center; margin-bottom: 30px; font-size: 15px; line-height: 1.5;">Great to have you with us. Your payment went through perfectly, and it's time to dive right in.</p>
                <div style="background-color: #e0e5ec; border-radius: 15px; box-shadow: inset 6px 6px 10px 0 rgba(163,177,198, 0.5), inset -6px -6px 10px 0 rgba(255,255,255, 0.8); padding: 25px;">
                    <table style="${safeTableStyle} color: #4d4d4d;">
                        <tr><td style="${safeTdStyleLeft} font-size: 14px;">Course</td><td style="${safeTdStyleRight}">${courseNameFormatted}</td></tr>
                        <tr><td style="${safeTdStyleLeft} font-size: 14px;">Date</td><td style="${safeTdStyleRight}">${dateOfPurchase}</td></tr>
                        <tr><td style="${safeTdStyleLeft} font-size: 14px;">ID</td><td style="${safeTdStyleRight} font-family: monospace; font-size: 12px;">${paymentId}</td></tr>
                        <tr><td colspan="2"><hr style="border: 0; border-top: 1px solid #cbd2d9; margin: 15px 0;"></td></tr>
                        <tr><td style="${safeTdStyleLeft} font-weight: bold;">Total</td><td style="${safeTdStyleRight} font-weight: bold; color: #2ecc71;">${currencySymbol}${actualAmount}</td></tr>
                    </table>
                </div>
                <div style="text-align: center; margin-top: 35px; margin-bottom: 25px;">
                    <a href="${dashboardLink}" style="display: inline-block; background-color: #e0e5ec; color: #4d4d4d; text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; box-shadow: 6px 6px 10px 0 rgba(163,177,198, 0.5), -6px -6px 10px 0 rgba(255,255,255, 0.8);">Dashboard</a>
                </div>
                <div style="text-align: center; font-size: 11px; color: #888; padding-top: 15px;">&copy; ${currentYear} Goorac Corporation. <br>System Message.</div>
            </div>
        </body></html>`
    ];

    // Select a random layout string from the array
    const htmlTemplate = templates[Math.floor(Math.random() * templates.length)];

    try {
        // Securely fetching the Google Script URL from your environment secrets
        const googleScriptUrl = process.env.SCRIPT_URL;

        // Safety check to ensure the secret is properly loaded
        if (!googleScriptUrl) {
            throw new Error("SCRIPT_URL is missing from environment variables.");
        }

        const response = await fetch(googleScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: userEmail,
                subject: `Receipt: ${courseNameFormatted} Enrollment Confirmed`,
                html: htmlTemplate
            })
        });

        const result = await response.json();
        
        if (result.status === "success") {
            console.log(`✅ Email sent successfully via Gmail script to ${userEmail}`);
            return true;
        } else {
            console.error("❌ Google Script Error:", result.message);
            throw new Error(result.message);
        }

    } catch (error) {
        console.error("❌ Mailer Pipeline Failed:", error);
        throw error;
    }
};

module.exports = { sendCourseReceipt };
