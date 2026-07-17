import "server-only";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Project } from "./dataTypes";
import { ProjectWithJudgeFeedback } from "./db/project";

const FROM_EMAIL = "noreply@uwbhacks.com";
const EMAIL_SRC = `UWB Hacks <${FROM_EMAIL}>`;

const TEST_MODE = false;
const TEST_EMAIL = "uellenbe@uw.edu";
const SEND_DELAY_MS = 100;

const ses = new SESClient({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// AWS SES email bodies use HTML and a Text fallback for older email clients
// Charset specifies character encoding. Can be changed to support special characters
export type EmailBody = {
    Text: { Data: string; Charset?: string };
    Html?: { Data: string; Charset?: string };
};

// to send an email, there must be a recipient/destination email address (to), email subject,
// and email body sender/source email is not included because we will be sending all emails
// using the same source email: EMAIL_SRC
type SendEmailParams = {
    to: string;
    subject: string;
    body: EmailBody;
};

// Sends one email through AWS SES
async function sendEmail({
    to,
    subject,
    body,
}: SendEmailParams): Promise<void> {
    const destinationEmail = TEST_MODE ? TEST_EMAIL : to;

    const command = new SendEmailCommand({
        Source: EMAIL_SRC,
        Destination: {
            ToAddresses: [destinationEmail],
        },
        Message: {
            Subject: {
                Data: subject,
            },
            Body: body,
        },
    });

    await ses.send(command);
}

// Sends multiple emails with same subject/body
export async function sendEmails(
    emails: string[],
    subject: string,
    message: EmailBody,
) {
    const successfulEmails: string[] = [];
    const failedEmails: { email: string; error: unknown }[] = [];

    const targets = TEST_MODE ? emails.slice(0, 1) : emails;

    for (const email of targets) {
        try {
            await sendEmail({
                to: email,
                subject,
                body: message,
            });

            if (TEST_MODE) {
                failedEmails.push({
                    email,
                    error: "TEST MODE: sent to test inbox instead",
                });
            } else {
                successfulEmails.push(email);
            }
        } catch (error) {
            console.error("SES send failed:", email, error);
            failedEmails.push({ email, error });
        }

        await delay(SEND_DELAY_MS);
    }

    return { successfulEmails, failedEmails };
}

// Sends Devpost linking emails
export async function sendDevpostLinkingEmails(
    targets: { devpost_email: string; code: string }[],
) {
    const successfulEmails: string[] = [];
    const failedEmails: { email: string; error: unknown }[] = [];

    const baseUrl = "https://uwbhacks.com";
    const recipients = TEST_MODE ? targets.slice(0, 1) : targets;

    for (const target of recipients) {
        const link = `${baseUrl}/link-devpost?code=${target.code}`;

        const subject =
            "Action Required: Link your Devpost Account | UWB Hacks";

        const textBody = `
Please link your Devpost account (${target.devpost_email}) here:

${link}

To ensure your team receives judging alerts, please link your accounts.
        `.trim();

        const htmlBody = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 24px;">
    <h1>UWB Hacks 2026</h1>

    <p>
        We noticed you registered on Devpost using:
        <strong>${target.devpost_email}</strong>
    </p>

    <p>
        Your Devpost account has not been linked to your UWB Hacks portal yet.
    </p>

    <p>
        <a href="${link}">
            Link Accounts Now
        </a>
    </p>

    <p>
        If the button doesn't work:
        <br />
        ${link}
    </p>
</body>
</html>
        `.trim();

        try {
            await sendEmail({
                to: target.devpost_email,
                subject,
                body: {
                    Text: { Data: textBody },
                    Html: { Data: htmlBody },
                },
            });

            if (TEST_MODE) {
                failedEmails.push({
                    email: target.devpost_email,
                    error: "TEST MODE: sent to test inbox instead",
                });
            } else {
                successfulEmails.push(target.devpost_email);
            }
        } catch (error) {
            console.error("SES send failed:", target.devpost_email, error);

            failedEmails.push({
                email: target.devpost_email,
                error,
            });
        }

        await delay(SEND_DELAY_MS);
    }

    return { successfulEmails, failedEmails };
}

export async function sendTableAssignmentEmails(projects: Project[]) {
    const successfulEmails: string[] = [];
    const failedEmails: { email: string; error: unknown }[] = [];

    const subject = "[URGENT] UWB Hacks Presentation Location";

    const recipientProjects = TEST_MODE ? projects.slice(0, 1) : projects;

    for (const p of recipientProjects) {
        const destinationEmails = TEST_MODE ? [TEST_EMAIL] : p.userEmails;
        const textBody = `${p.room} at table ${p.tableNum}`;
        const htmlBody = `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #f4f8fe; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f8fe; padding: 40px 20px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #0a84dc; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">UWB HACKS 2026</h1>
               <p style="color: #84c6ff; font-size: 16px; margin: 8px 0 0 0; font-weight: 500; text-transform: uppercase; letter-spacing: 2px;">The Future</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <h2 style="margin:0 0 10px; font-size:18px; color:#111;">
                Your <strong>Official</strong> Presentation Details are Ready
              </h2>

              <p style="font-size:16px; color:#444; line-height:1.6;">
                Hello Hacker!
              </p>

              <!-- Main message box -->
              <div style="margin:20px 0; padding:16px; background:#f0f7ff; border-left:4px solid #0a84dc;">
                <p style="margin:0; font-size:16px; color:#1d4ed8; line-height:1.5;">
                    Your project will present in the following location:
                    <br>
                    ${textBody}
                </p>
              </div>

              <p style="font-size:16px; color:#555; line-height:1.6;">
                Please arrive at your assigned table at least 10 minutes early.
              </p>

              <p style="font-size:16px; color:#555; line-height:1.6;">
                If you have any issues finding your location, please a UWB Hacks staff member.
              </p>
            </td>
          </tr>
        </table>
                 <!-- Outer Footer -->
            <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 20px;">
                &copy; 2026 UWB Hacks. All rights reserved.
            </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

        for (const email of destinationEmails) {
            const command = new SendEmailCommand({
                Source: EMAIL_SRC,
                Destination: {
                    ToAddresses: [email],
                },
                Message: {
                    Subject: {
                        Data: subject,
                    },
                    Body: {
                        Text: {
                            Data: textBody,
                        },
                        Html: {
                            Data: htmlBody,
                        },
                    },
                },
            });

            try {
                await ses.send(command);

                if (TEST_MODE) {
                    failedEmails.push({
                        email,
                        error: "TEST_MODE: sent to test email instead",
                    });
                } else {
                    successfulEmails.push(email);
                }
            } catch (error) {
                console.error("SES send failed:", email, error);
                failedEmails.push({ email, error });
            }

            await delay(100);
        }
    }

    return { successfulEmails, failedEmails };
}

/**
 * Returns a new array with the items shuffled.
 * @param items - is the array to shuffle (not modified).
 */
function shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/**
 * Sends hackathon participants the feedback their judges left after the
 * hackathon concludes. Judge assignments where the judge neither scored any
 * questions nor wrote feedback are dropped entirely. Remaining feedback is
 * anonymized and shuffled so participants cannot map comments back to
 * individual judges.
 * A separate roster of the participating judges is shown at the bottom so
 * participants can reach out to network.
 *
 * @param projectsWithFeedback - is the list of projects paired with their judge assignments.
 */
export async function sendProjectFeedbackEmails(
    projectsWithFeedback: ProjectWithJudgeFeedback[],
) {
    const allSuccessfulEmails: string[] = [];
    const allFailedEmails: { email: string; error: unknown }[] = [];

    const subject = "UWB Hacks Project Feedback";

    const recipientProjects = TEST_MODE
        ? projectsWithFeedback.slice(0, 3)
        : projectsWithFeedback;

    for (const p of recipientProjects) {
        const destinationEmails = TEST_MODE ? [TEST_EMAIL] : p.userEmails;

        try {
            const judgesWithScores = new Set(
                p.judgeScores.map((s) => s.judgeId),
            );

            // Only count judges who actually engaged with the project.
            const participatingJudges = p.judgeAssignments.filter(
                (ja) => judgesWithScores.has(ja.judgeId) || ja.feedback,
            );

            const feedbackItems = shuffle(
                participatingJudges
                    .map((ja) => ja.feedback)
                    .filter((f): f is string => !!f),
            );

            const judgeNames = Array.from(
                new Set(
                    participatingJudges
                        .map((ja) => ja.judgeName?.trim())
                        .filter((n): n is string => !!n),
                ),
            ).sort((a, b) => a.localeCompare(b));

            // Aggregate per-question averages across all judges who scored.
            const scoresByQuestion = new Map<
                number,
                { questionText: string; total: number; count: number }
            >();
            for (const s of p.judgeScores) {
                const entry = scoresByQuestion.get(s.questionId);
                if (entry) {
                    entry.total += s.score;
                    entry.count += 1;
                } else {
                    scoresByQuestion.set(s.questionId, {
                        questionText: s.questionText,
                        total: s.score,
                        count: 1,
                    });
                }
            }
            const questionScores = Array.from(scoresByQuestion.values()).map(
                (q) => ({
                    questionText: q.questionText,
                    averageScore: q.total / q.count,
                }),
            );

            // Nothing to send - skip this project entirely.
            if (questionScores.length === 0 && feedbackItems.length === 0) {
                continue;
            }

            const textScores = questionScores.length
                ? `Scores (averaged across your judges):\n${questionScores
                      .map(
                          (s) =>
                              `- ${s.questionText}: ${s.averageScore.toFixed(2)}`,
                      )
                      .join("\n")}\n\n`
                : "";

            const textFeedback = feedbackItems.length
                ? `Feedback:\n${feedbackItems.map((f, i) => `${i + 1}. ${f}`).join("\n\n")}`
                : "";
            const textJudges = judgeNames.length
                ? `\n\nYour project was reviewed by:\n${judgeNames.map((n) => `- ${n}`).join("\n")}`
                : "";

            const textBody = `Here is your project feedback:

${textScores}${textFeedback}${textJudges}

---

Nominate UWB Hacks and ACM for Club Awards 🏅

Club awards close tonight! They only take a minute to fill out, and it really means a lot to us to receive your nominations 💜

ACM and UWB Hacks are running for the following categories:
- Academic Club of the Year: Association for Computing Machinery
- Best Event Collaboration: UWB Hacks (ACM, ACM-W, BCA, Trickfire Robotics, Inclusive AI, GrayHats)
- Standout Event of the Year: UWB Hacks
- Legacy Award: Association for Computing Machinery

Click here to submit your nomination: https://tinyurl.com/4e6untvf. Thank you so much for taking the time to support us, and we hope you had an amazing time attending our events this year!`;

            const scoresHtml = questionScores.length
                ? `
              <h3 style="margin:24px 0 8px; font-size:16px; color:#111;">
                Scores
              </h3>
              <p style="margin:0 0 8px; font-size:13px; color:#777;">
                Averaged across your judges.
              </p>
              <table cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse;">
                ${questionScores
                    .map(
                        (s) => `
                <tr>
                  <td style="padding:6px 8px 6px 0; font-size:15px; color:#444; line-height:1.5;">${s.questionText}</td>
                  <td style="padding:6px 0; font-size:15px; color:#1d4ed8; line-height:1.5; text-align:right; white-space:nowrap;"><strong>${s.averageScore.toFixed(2)}</strong></td>
                </tr>`,
                    )
                    .join("")}
              </table>`
                : "";

            const feedbackHtml = feedbackItems.length
                ? `
              <h3 style="margin:24px 0 8px; font-size:16px; color:#111;">
                Feedback
              </h3>
              <!-- Main message box -->
              <div style="margin:8px 0 0; padding:16px; background:#f0f7ff; border-left:4px solid #0a84dc;">
                ${feedbackItems
                    .map(
                        (f) => `
                    <p style="margin:0 0 12px; font-size:16px; color:#1d4ed8; line-height:1.5;">
                        ${f}
                    </p>`,
                    )
                    .join("")}
              </div>`
                : "";

            const judgesHtml = judgeNames.length
                ? `
              <h3 style="margin:24px 0 8px; font-size:16px; color:#111;">
                Your project was reviewed by
              </h3>
              <p style="margin:0 0 4px; font-size:13px; color:#777;">
                Comments above are anonymized and shown in random order. Feel free to reach out to network or ask follow-up questions.
              </p>
              <ul style="margin:8px 0 0; padding-left:20px; font-size:15px; color:#444; line-height:1.7;">
                ${judgeNames.map((n) => `<li>${n}</li>`).join("")}
              </ul>`
                : "";

            const htmlBody = `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #f4f8fe; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f8fe; padding: 40px 20px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #0a84dc; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">UWB HACKS 2026</h1>
               <p style="color: #84c6ff; font-size: 16px; margin: 8px 0 0 0; font-weight: 500; text-transform: uppercase; letter-spacing: 2px;">The Future</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="font-size:16px; color:#444; line-height:1.6;">
                Hello Hacker!
                <br><br>
                Below are your scores and feedback from the judges who reviewed your UWB Hacks submission.
              </p>

              ${scoresHtml}

              ${feedbackHtml}

              ${judgesHtml}

              <hr style="border:none; border-top:1px solid #e2e8f0; margin:28px 0;" />

              <!-- Club Awards nomination -->
              <h3 style="margin:0 0 8px; font-size:16px; color:#111;">
                <strong>Nominate UWB Hacks and ACM for Club Awards</strong> 🏅
              </h3>
              <p style="font-size:15px; color:#555; line-height:1.6; margin:0 0 12px;">
                Club awards <strong>close tonight</strong>! They only take a minute to fill out, and it really means a lot to us to receive your nominations 💜
              </p>
              <p style="font-size:15px; color:#555; line-height:1.6; margin:0 0 6px;">
                ACM and UWB Hacks are running for the following categories:
              </p>
              <ul style="margin:0 0 12px; padding-left:20px; font-size:15px; color:#555; line-height:1.7;">
                <li><strong>Academic Club of the Year</strong>: <code style="background:#f1f5f9; padding:1px 6px; border-radius:4px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;">Association for Computing Machinery</code></li>
                <li><strong>Best Event Collaboration</strong>: <code style="background:#f1f5f9; padding:1px 6px; border-radius:4px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;">UWB Hacks (ACM, ACM-W, BCA, Trickfire Robotics, Inclusive AI, GrayHats)</code></li>
                <li><strong>Standout Event of the Year</strong>: <code style="background:#f1f5f9; padding:1px 6px; border-radius:4px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;">UWB Hacks</code></li>
                <li><strong>Legacy Award</strong>: <code style="background:#f1f5f9; padding:1px 6px; border-radius:4px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;">Association for Computing Machinery</code></li>
              </ul>
              <p style="font-size:15px; color:#555; line-height:1.6; margin:0;">
                Click here to submit your nomination: <a href="https://tinyurl.com/4e6untvf" style="color:#0a84dc;">https://tinyurl.com/4e6untvf</a>. Thank you so much for taking the time to support us, and we hope you had an amazing time attending our events this year!
              </p>
            </td>
          </tr>
        </table>
                 <!-- Outer Footer -->
            <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 20px;">
                &copy; 2026 UWB Hacks. All rights reserved.
            </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

            const emailBody: EmailBody = {
                Text: { Data: textBody },
                Html: { Data: htmlBody },
            };
            const { successfulEmails, failedEmails } = await sendEmails(
                destinationEmails,
                subject,
                emailBody,
            );

            allSuccessfulEmails.push(...successfulEmails);
            allFailedEmails.push(...failedEmails);
        } catch (e) {
            allFailedEmails.push(
                ...destinationEmails.map((email) => ({
                    email,
                    error: "Unknown (see logs)",
                })),
            );

            console.error(e);
        }
    }
    return { allSuccessfulEmails, allFailedEmails };
}
