import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-3xl -z-10" />

        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">
          About Me
        </h1>

        <div className="space-y-6 text-white/80 leading-relaxed text-lg">
          <p>
            I am <span className="text-white font-semibold">Muhibbullah Hisham</span>, an educator, researcher, and lifelong learner with a strong foundation in Islamic studies and an evolving engagement with contemporary education and intellectual inquiry. I was born in 2005 in Mymensingh and raised in Jamalpur & Dhaka, Bangladesh.
          </p>

          <p>
            My academic journey began with the memorization of the Qur'an, alongside which I completed my primary-level education in the Alia madrasa system. I then continued my studies within the Qawmi madrasa tradition, successfully completing Dawra-e-Hadith (Master's equivalent) from Dhaka. Subsequently, I pursued advanced specialization at As-Sunnah Dawah & Research Institute, where I completed a Postgraduate Diploma in Islamic Dawah.
          </p>

          <p>
            At present, I am continuing my academic journey within the general education system and am a candidate for the Secondary School Certificate (SSC) examination in 2027. Looking ahead, I am particularly interested in the fields of Education Research and African Studies, aiming to develop a broader, interdisciplinary academic perspective.
          </p>

          <p>
            Professionally and intellectually, I engage in teaching, training, and academic research. My approach seeks to integrate classical Islamic scholarship with modern thought, especially in areas such as curriculum development, intellectual guidance, and youth development. I have a strong inclination toward mentoring and counseling young people, helping them navigate both educational and personal growth.
          </p>

          <p>
            Beyond formal academia, I value human connection and social responsibility. I enjoy interacting with people, exploring nature, and actively contributing to charitable and community-based initiatives, particularly supporting the underprivileged.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div>
              <h3 className="text-orange-400 font-bold uppercase tracking-tighter text-sm mb-4">Core Roles & Interests</h3>
              <div className="flex flex-wrap gap-2">
                {["Instructor", "Educator", "Mentor", "Assistant Researcher", "AI Enthusiast", "Curious Thinker", "Guidance Counselor", "Curriculum Developer"].map(role => (
                  <span key={role} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-rose-400 font-bold uppercase tracking-tighter text-sm mb-4">Areas of Passion</h3>
              <div className="flex flex-wrap gap-2">
                {["Languages", "Entrepreneurship", "Charity", "Social Development", "Youth Mentoring", "Community Engagement"].map(passion => (
                  <span key={passion} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-rose-200/60">
                    {passion}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
