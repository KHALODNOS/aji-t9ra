import React from 'react';
import OnboardingFlow from "../components/Onboarding/OnboardingFlow";
import background from '../assets/background.png';
import { Sparkles } from 'lucide-react';

const Register = () => {
    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
            {/* Branding Header */}
            <div className="absolute top-8 right-8 z-20 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#5DA296] rounded-lg flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black tracking-tight text-[#5DA296] font-heading">أجي تقرا</span>
            </div>
            
            <OnboardingFlow />
        </div>
    );
};

export default Register;