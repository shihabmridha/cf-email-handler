import PostalMime from 'postal-mime';

export default {
    async email(message: ForwardableEmailMessage, env: CloudflareBindings, _ctx: ExecutionContext) {
        const url = env.DISCORD_HOOK_URL;

        const rawMessage = await PostalMime.parse(message.raw);
        const aiResponse = rawMessage.text;

        console.log('ai response', aiResponse);

        const params = {
            username: "Robot",
            content: `Got an email from ${message.from}.\nSubject: ${message.headers.get('subject')}.`
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
};
