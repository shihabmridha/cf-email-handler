import PostalMime from 'postal-mime';

export default {
    async email(message: ForwardableEmailMessage, env: CloudflareBindings, ctx: ExecutionContext) {
        const url = env.DISCORD_HOOK_URL;

        // const rawMessage = await streamToString(message.raw);
        const rawMessage = await PostalMime.parse(message.raw);
        const messages = [
            {
                role: "system",
                content: "You are an email assistant. You take raw email including all the metadata and " +
                    "parse the content and summarize it. The email can be in HTML or plain text."
            },
            {
                role: "user",
                content: `This is the raw email content: ${rawMessage.text}.\nPlease parse the content and summarize it.`,
            },
        ];

        // @ts-ignore
        const aiResponse: AiTextGenerationOutput = await env.AI.run("@hf/google/gemma-7b-it", { rawMessage });

        // console.log('ai response', aiResponse.);

        const params = {
            username: "Robot",
            content: `Got an email from ${message.from}.\nSubject: ${message.headers.get('subject')}.\nSummary: ${aiResponse}`
        };

        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        await message.forward(env.EMAIL_FORWARD_TO);
    }
}
