import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export default function VocalRoom() {
    const [joined, setJoined] = useState(false);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);

    useEffect(() => {
        // الاستماع للأعضاء الآخرين عند انضمامهم وتحدثهم
        client.on("user-published", async (user, mediaType) => {
            await client.subscribe(user, mediaType);
            if (mediaType === "audio") {
                user.audioTrack.play(); // تشغيل صوت الطرف الآخر
            }
        });

        // تنظيف الأحداث عند إغلاق المكون
        return () => {
            client.off("user-published");
        };
    }, []);

    const startCall = async () => {
        try {
            const response = await axios.get(`http://${window.location.hostname}:5000/api/agora/token?channelName=main-room`);
            const { token, appId } = response.data;

            await client.join(appId, "main-room", token, null);

            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
                encoderConfig: "high_quality",
                AEC: true,
                ANS: true,
                AGC: true
            });
            await client.publish([audioTrack]);

            setLocalAudioTrack(audioTrack);
            setJoined(true);
        } catch (err) {
            console.error("Join failed:", err);
        }
    };

    const endCall = async () => {
        localAudioTrack?.stop();
        localAudioTrack?.close();
        await client.leave();
        setJoined(false);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1 style={{ color: "#5DA296" }}>أجي تقرا Voice Room 🎙️</h1>
            {joined ? (
                <button onClick={endCall} style={{ background: "red", color: "white", padding: "15px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
                    Leave Room
                </button>
            ) : (
                <button onClick={startCall} style={{ background: "green", color: "white", padding: "15px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
                    Join Room
                </button>
            )}
            <div style={{ marginTop: "20px" }}>
                {joined ? "Status: Connected ✅" : "Status: Disconnected ❌"}
            </div>
        </div>
    );
}
