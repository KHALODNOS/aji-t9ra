const { RtcTokenBuilder, RtcRole } = require('agora-token');

exports.generateToken = (req, res) => {
    const channelName = req.query.channelName;
    if (!channelName) return res.status(400).json({ error: 'Channel name is required' });

    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const uid = 0; // 0 تعني أن أغورا ستنشئ معرفاً عشوائياً
    const role = RtcRole.PUBLISHER;
    const privilegeExpiredTs = Math.floor(Date.now() / 1000) + 3600; // صلاحية لساعة واحدة

    const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);

    res.json({ token, appId });
};