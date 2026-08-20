// i18n — Translations for 7 languages
// en, bn (Bangla), ar (Arabic), ur (Urdu), es (Spanish), ja (Japanese), zh (Chinese)

export type Locale = 'en' | 'bn' | 'ar' | 'ur' | 'es' | 'ja' | 'zh';

export const LOCALES: { code: Locale; name: string; native: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', name: 'English', native: 'English', dir: 'ltr' },
  { code: 'bn', name: 'Bangla', native: 'বাংলা', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl' },
  { code: 'ur', name: 'Urdu', native: 'اردو', dir: 'rtl' },
  { code: 'es', name: 'Spanish', native: 'Español', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', native: '日本語', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', native: '中文', dir: 'ltr' },
];

export const DEFAULT_LOCALE: Locale = 'en';

type TranslationDict = Record<string, Record<Locale, string>>;

export const DICT: TranslationDict = {
  // ─── NAV ───
'nav.profile': { en:'Profile', bn:'প্রোফাইল', ar:'الملف', ur:'پروفائل', es:'Perfil', ja:'プロフィール', zh:'个人资料' },
  'nav.signin':        { en:'Sign in', bn:'সাইন ইন', ar:'تسجيل', ur:'سائن ان', es:'Entrar', ja:'ログイン', zh:'登录' },

  // ─── HOME ───
  'home.role':         { en:'Educator  ·  Researcher  ·  Mentor', bn:'শিক্ষাবিদ  ·  গবেষক  ·  পরামর্শক', ar:'معلّم  ·  باحث  ·  مرشد', ur:'معلم  ·  محقق  ·  رہنما', es:'Educador  ·  Investigador  ·  Mentor', ja:'教育者 · 研究者 · メンター', zh:'教育家 · 研究员 · 导师' },
  'home.subtitle':     { en:'Bridging classical Islamic scholarship with modern education', bn:'ধ্রুপদী ইসলামী জ্ঞান ও আধুনিক শিক্ষার মধ্যে সেতুবন্ধন', ar:'ربط المعرفة الإسلامية الكلاسيكية بالتعليم الحديث', ur:'کلاسیکی اسلامی علوم اور جدید تعلیم کے درمیان پل', es:'Uniendo la erudición islámica clásica con la educación moderna', ja:'古典イスラーム学と近代教育の架け橋', zh:'连接古典伊斯兰学术与现代教育' },
  'home.join':         { en:'Join the Conversation', bn:'কথোপকথনে যোগ দিন', ar:'انضم إلى المحادثة', ur:'گفتگو میں شامل ہوں', es:'Únete a la Conversación', ja:'会話に参加する', zh:'加入对话' },
  'home.chat_now':     { en:'Chat Now', bn:'এখনই চ্যাট করুন', ar:'تحدث الآن', ur:'ابھی چیٹ کریں', es:'Chatear Ahora', ja:'今すぐチャット', zh:'立即聊天' },
  'home.expertise':    { en:'Expertise', bn:'দক্ষতা', ar:'مجالات الخبرة', ur:'مہارت', es:'Experiencia', ja:'専門分野', zh:'专长' },
  'home.get_in_touch': { en:'Get in Touch', bn:'যোগাযোগ করুন', ar:'تواصل معي', ur:'رابطہ کریں', es:'Contacto', ja:'お問い合わせ', zh:'联系我' },

  // ─── FOOTER ───
  'footer.privacy':    { en:'Privacy', bn:'গোপনীয়তা', ar:'الخصوصية', ur:'رازداری', es:'Privacidad', ja:'プライバシー', zh:'隐私' },
  'footer.terms':      { en:'Terms', bn:'শর্তাবলী', ar:'الشروط', ur:'شرائط', es:'Términos', ja:'利用規約', zh:'条款' },

  // ─── TAB BAR ───
  'tab.home':          { en:'Home', bn:'হোম', ar:'الرئيسية', ur:'ہوم', es:'Inicio', ja:'ホーム', zh:'首页' },
  'tab.feed':          { en:'Feed', bn:'ফিড', ar:'المنشورات', ur:'فیڈ', es:'Feed', ja:'フィード', zh:'动态' },
  'tab.chat':          { en:'Chat', bn:'চ্যাট', ar:'محادثة', ur:'چیٹ', es:'Chat', ja:'チャット', zh:'聊天' },
  'tab.inbox':         { en:'Inbox', bn:'ইনবক্স', ar:'صندوق', ur:'ان باکس', es:'Bandeja', ja:'受信箱', zh:'收件箱' },
  'tab.profile': { en:'Profile', bn:'প্রোফাইল', ar:'الملف', ur:'پروفائل', es:'Perfil', ja:'プロフィール', zh:'个人资料' },

  // ─── ABOUT ───
  'about.title':       { en:'About Me', bn:'আমার সম্পর্কে', ar:'عنّي', ur:'میرے بارے میں', es:'Sobre Mí', ja:'私について', zh:'关于我' },
  'about.bio':         { en:'Educator, researcher, and lifelong learner integrating classical Islamic scholarship with modern thought. Passionate about meaningful conversations, curriculum development, and mentoring the next generation.', bn:'শিক্ষাবিদ, গবেষক এবং আজীবন শিক্ষার্থী যিনি ধ্রুপদী ইসলামী জ্ঞানকে আধুনিক চিন্তার সাথে সমন্বয় করছেন। অর্থবহ কথোপকথন, পাঠ্যক্রম উন্নয়ন এবং পরবর্তী প্রজন্মকে পরামর্শ দিতে আগ্রহী।', ar:'معلّم وباحث ومتعلّم مدى الحياة يدمج المعرفة الإسلامية الكلاسيكية مع الفكر الحديث. شغوف بالمحادثات الهادفة وتطوير المناهج وتوجيه الجيل القادم.', ur:'معلم، محقق، اور تاحیات سیکھنے والا جو کلاسیکی اسلامی علوم کو جدید فکر کے ساتھ مربوط کر رہا ہے۔ بامعنی گفتگو، نصاب سازی، اور اگلی نسل کی رہنمائی کا شوقین۔', es:'Educador, investigador y aprendiz de por vida integrando la erudición islámica clásica con el pensamiento moderno. Apasionado por conversaciones significativas, desarrollo curricular y mentoría de la próxima generación.', ja:'古典イスラーム学と現代的思考を統合する教育者・研究者・生涯学習者。意義ある対話、カリキュラム開発、次世代の指導に情熱を注いでいます。', zh:'教育家、研究员、终身学习者，将古典伊斯兰学术与现代思想相融合。热衷于有意义的对话、课程开发和指导下一代。' },

  // ─── CHAT ───
  'chat.title':        { en:'Live Chat', bn:'লাইভ চ্যাট', ar:'محادثة مباشرة', ur:'لائیو چیٹ', es:'Chat en Vivo', ja:'ライブチャット', zh:'实时聊天' },
  'chat.placeholder':  { en:'Type a message...', bn:'একটি বার্তা লিখুন...', ar:'اكتب رسالة...', ur:'پیغام لکھیں...', es:'Escribe un mensaje...', ja:'メッセージを入力...', zh:'输入消息...' },

  // ─── FEED ───
'feed.empty':        { en:'No posts yet. Be the first to share something!', bn:'এখনও কোনো পোস্ট নেই। প্রথম পোস্টটি শেয়ার করুন!', ar:'لا توجد منشورات بعد. كن أول من يشارك!', ur:'ابھی تک کوئی پوسٹ نہیں۔ پہلا شیئر کریں!', es:'Aún no hay publicaciones. ¡Sé el primero en compartir!', ja:'まだ投稿がありません。最初にシェアしましょう！', zh:'暂无帖子。成为第一个分享的人！' },

  // ─── INBOX ───
  'inbox.title':       { en:'Inbox', bn:'ইনবক্স', ar:'صندوق الوارد', ur:'ان باکس', es:'Bandeja', ja:'受信箱', zh:'收件箱' },
  'inbox.empty':       { en:'No messages yet', bn:'এখনও কোনো বার্তা নেই', ar:'لا توجد رسائل بعد', ur:'ابھی تک کوئی پیغام نہیں', es:'Aún no hay mensajes', ja:'まだメッセージがありません', zh:'暂无消息' },

  // ─── PROFILE ───
  'profile.title':     { en:'My Profile', bn:'আমার প্রোফাইল', ar:'ملفي', ur:'میرا پروفائل', es:'Mi Perfil', ja:'マイプロフィール', zh:'我的资料' },
  'profile.settings':  { en:'Settings', bn:'সেটিংস', ar:'الإعدادات', ur:'ترتیبات', es:'Configuración', ja:'設定', zh:'设置' },
  'profile.signout':   { en:'Sign out', bn:'সাইন আউট', ar:'تسجيل الخروج', ur:'سائن آؤٹ', es:'Cerrar sesión', ja:'ログアウト', zh:'退出登录' },

  // ─── META ───
  'meta.title':        { en:'Muhibbullah Hisham — Educator, Researcher & Mentor', bn:'মুহিব্বুল্লাহ হিশাম — শিক্ষাবিদ, গবেষক ও পরামর্শক', ar:'محب الله هشام — معلّم وباحث ومرشد', ur:'محب اللہ ہشام — معلم، محقق اور رہنما', es:'Muhibbullah Hisham — Educador, Investigador y Mentor', ja:'ムヒブッラー・ヒシャーム — 教育者・研究者・メンター', zh:'Muhibbullah Hisham — 教育家、研究员和导师' },
  'meta.description':  { en:'Official site of Muhibbullah Hisham — educator, researcher, and mentor bridging classical Islamic scholarship with modern education.', bn:'মুহিব্বুল্লাহ হিশামের অফিসিয়াল সাইট — শিক্ষাবিদ, গবেষক ও পরামর্শক যিনি ধ্রুপদী ইসলামী জ্ঞান ও আধুনিক শিক্ষার মধ্যে সেতুবন্ধন তৈরি করছেন।', ar:'الموقع الرسمي لمحب الله هشام — معلّم وباحث ومرشد يربط المعرفة الإسلامية الكلاسيكية بالتعليم الحديث.', ur:'محب اللہ ہشام کی آفیشل سائٹ — معلم، محقق اور رہنما جو کلاسیکی اسلامی علوم اور جدید تعلیم کے درمیان پل بنا رہے ہیں۔', es:'Sitio oficial de Muhibbullah Hisham — educador, investigador y mentor uniendo la erudición islámica clásica con la educación moderna.', ja:'ムヒブッラー・ヒシャームの公式サイト — 古典イスラーム学と近代教育の架け橋となる教育者・研究者・メンター。', zh:'Muhibbullah Hisham 的官方网站 — 连接古典伊斯兰学术与现代教育的教育家、研究员和导师。' },

  // ─── EXPERTISE TAGS ───
  'exp.teaching':      { en:'Teaching & Instruction', bn:'শিক্ষাদান ও নির্দেশনা', ar:'التعليم والتدريس', ur:'تعلیم و تدریس', es:'Enseñanza e Instrucción', ja:'教育・指導', zh:'教学与指导' },
  'exp.research':      { en:'Academic Research', bn:'একাডেমিক গবেষণা', ar:'البحث الأكاديمي', ur:'علمی تحقیق', es:'Investigación Académica', ja:'学術研究', zh:'学术研究' },
  'exp.curriculum':    { en:'Curriculum Development', bn:'পাঠ্যক্রম উন্নয়ন', ar:'تطوير المناهج', ur:'نصاب سازی', es:'Desarrollo Curricular', ja:'カリキュラム開発', zh:'课程开发' },
  'exp.mentoring':     { en:'Youth Mentoring', bn:'যুব পরামর্শদান', ar:'توجيه الشباب', ur:'نوجوانوں کی رہنمائی', es:'Mentoría Juvenil', ja:'青少年指導', zh:'青年辅导' },
  'exp.dawah':         { en:'Public Speaking & Dawah', bn:'পাবলিক স্পিকিং ও দাওয়াহ', ar:'الخطابة والدعوة', ur:'عوامی خطابت و دعوت', es:'Oratoria y Dawah', ja:'講演・ダアワ', zh:'演讲与宣教' },
  'exp.community':     { en:'Community Engagement', bn:'সম্প্রদায় সংযুক্তি', ar:'المشاركة المجتمعية', ur:'سماجی شراکت', es:'Compromiso Comunitario', ja:'コミュニティ活動', zh:'社区参与' },



  // ─── ABOUT PAGE ───
  'about.hero_label':  { en:'About the Mind Behind', bn:'এই মনের পেছনের গল্প', ar:'عن العقل وراء', ur:'اس ذہن کے پیچھے', es:'Sobre la Mente Detrás', ja:'その精神の背景', zh:'关于背后的思想' },
  'about.hero_desc':   { en:'Educator, researcher, and lifelong learner. Integrating classical Islamic scholarship with modern thought for meaningful impact.', bn:'শিক্ষাবিদ, গবেষক ও আজীবন শিক্ষার্থী। অর্থবহ প্রভাবের জন্য ধ্রুপদী ইসলামী জ্ঞানকে আধুনিক চিন্তার সাথে সমন্বয় করছি।', ar:'معلّم وباحث ومتعلّم مدى الحياة. دمج المعرفة الإسلامية الكلاسيكية مع الفكر الحديث لإحداث تأثير هادف.', ur:'معلم، محقق، اور تاحیات سیکھنے والا۔ بامعنی اثر کے لیے کلاسیکی اسلامی علوم کو جدید فکر کے ساتھ مربوط کر رہا ہوں۔', es:'Educador, investigador y aprendiz de por vida. Integrando la erudición islámica clásica con el pensamiento moderno para un impacto significativo.', ja:'教育者、研究者、生涯学習者。意義ある影響のために古典イスラーム学と現代的思考を統合。', zh:'教育家、研究员和终身学习者。将古典伊斯兰学术与现代思想相融合，产生有意义的影响。' },
  'about.who_i_am':    { en:'Who I Am', bn:'আমি কে', ar:'من أنا', ur:'میں کون ہوں', es:'Quién Soy', ja:'私について', zh:'我是谁' },
  'about.born':        { en:'Born 2005 · Mymensingh · Raised in Jamalpur & Dhaka', bn:'জন্ম ২০০৫ · ময়মনসিংহ · বেড়ে ওঠা জামালপুর ও ঢাকায়', ar:'مواليد ٢٠٠٥ · ميمنسينغ · نشأ في جمالبور ودكا', ur:'پیدائش ۲۰۰۵ · میمنسنگھ · پرورش جمالپور اور ڈھاکہ میں', es:'Nacido en 2005 · Mymensingh · Criado en Jamalpur y Dhaka', ja:'2005年生 · マイメンシン · ジャマルプルとダッカで育つ', zh:'2005年出生 · 迈门辛 · 在贾马勒普尔和达卡长大' },
  'about.bio_p1':      { en:"I am Muhibbullah Hisham, an educator, researcher, and lifelong learner with a strong foundation in Islamic studies and an evolving engagement with contemporary education and intellectual inquiry.", bn:"আমি মুহিব্বুল্লাহ হিশাম, একজন শিক্ষাবিদ, গবেষক এবং আজীবন শিক্ষার্থী — ইসলামী শিক্ষায় শক্ত ভিত্তি এবং আধুনিক শিক্ষা ও বুদ্ধিবৃত্তিক অনুসন্ধানের সাথে ক্রমবর্ধমান সম্পৃক্ততা নিয়ে।", ar:"أنا محب الله هشام، معلّم وباحث ومتعلّم مدى الحياة مع أساس قوي في الدراسات الإسلامية وانخراط متطور في التعليم المعاصر والبحث الفكري.", ur:"میں محب اللہ ہشام ہوں، ایک معلم، محقق، اور تاحیات سیکھنے والا — اسلامی علوم میں مضبوط بنیاد اور عصری تعلیم و فکری تحقیق کے ساتھ بڑھتی ہوئی وابستگی کے ساتھ۔", es:"Soy Muhibbullah Hisham, educador, investigador y aprendiz de por vida con una sólida base en estudios islámicos y un compromiso creciente con la educación contemporánea y la investigación intelectual.", ja:"私はムヒブッラー・ヒシャーム。イスラーム学の強固な基盤と、現代教育・知的探究への進化する関わりを持つ教育者・研究者・生涯学習者です。", zh:"我是 Muhibbullah Hisham，一位教育家、研究员和终身学习者，在伊斯兰研究方面有坚实的基础，并日益参与当代教育和知识探究。" },
  'about.bio_p2':      { en:'Professionally and intellectually, I engage in teaching, training, and academic research. My approach seeks to integrate classical Islamic scholarship with modern thought, especially in curriculum development, intellectual guidance, and youth development.', bn:'পেশাগত ও বুদ্ধিবৃত্তিকভাবে আমি শিক্ষাদান, প্রশিক্ষণ ও একাডেমিক গবেষণায় নিয়োজিত। আমার দৃষ্টিভঙ্গি ধ্রুপদী ইসলামী জ্ঞানকে আধুনিক চিন্তার সাথে সমন্বয় করতে চায় — বিশেষ করে পাঠ্যক্রম উন্নয়ন, বুদ্ধিবৃত্তিক দিকনির্দেশনা ও যুব উন্নয়নে।', ar:'مهنيًا وفكريًا، أنخرط في التدريس والتدريب والبحث الأكاديمي. يسعى نهجي إلى دمج المعرفة الإسلامية الكلاسيكية مع الفكر الحديث، خاصة في تطوير المناهج والتوجيه الفكري وتنمية الشباب.', ur:'پیشہ ورانہ اور فکری طور پر، میں تدریس، تربیت، اور علمی تحقیق میں مصروف ہوں۔ میرا نقطہ نظر کلاسیکی اسلامی علوم کو جدید فکر کے ساتھ مربوط کرنے کی کوشش کرتا ہے — خاص طور پر نصاب سازی، فکری رہنمائی، اور نوجوانوں کی ترقی میں۔', es:'Profesional e intelectualmente, me dedico a la enseñanza, formación e investigación académica. Mi enfoque busca integrar la erudición islámica clásica con el pensamiento moderno, especialmente en desarrollo curricular, orientación intelectual y desarrollo juvenil.', ja:'専門的・知的に、教育・研修・学術研究に従事しています。私のアプローチは古典イスラーム学と現代的思考の統合を目指し、特にカリキュラム開発、知的指導、青少年育成に力を入れています。', zh:'在专业和知识层面，我从事教学、培训和学术研究。我的方法旨在将古典伊斯兰学术与现代思想相融合，特别是在课程开发、知识指导和青年发展方面。' },
  'about.bio_p3':      { en:'Beyond formal academia, I value human connection and social responsibility — interacting with people, exploring nature, and contributing to charitable and community-based initiatives.', bn:'প্রাতিষ্ঠানিক শিক্ষার বাইরেও আমি মানবিক সম্পর্ক ও সামাজিক দায়িত্বকে মূল্য দিই — মানুষের সাথে মিথস্ক্রিয়া, প্রকৃতি অন্বেষণ, এবং দাতব্য ও সম্প্রদায়ভিত্তিক উদ্যোগে অবদান রাখি।', ar:'بعيدًا عن الأوساط الأكاديمية الرسمية، أقدّر التواصل الإنساني والمسؤولية الاجتماعية — التفاعل مع الناس، واستكشاف الطبيعة، والمساهمة في المبادرات الخيرية والمجتمعية.', ur:'رسمی تعلیم سے ہٹ کر، میں انسانی تعلق اور سماجی ذمہ داری کو اہمیت دیتا ہوں — لوگوں سے ملنا جلنا، قدرت کی سیر، اور خیراتی و سماجی اقدامات میں حصہ لینا۔', es:'Más allá del ámbito académico formal, valoro la conexión humana y la responsabilidad social — interactuar con personas, explorar la naturaleza y contribuir a iniciativas benéficas y comunitarias.', ja:'公式な学術の枠を超えて、人とのつながりと社会的責任を大切にしています — 人々との交流、自然の探求、慈善・コミュニティ活動への貢献。', zh:'在正式学术之外，我重视人际关系和社会责任 — 与人互动、探索自然、并为慈善和社区倡议做出贡献。' },
  'about.academic':    { en:'Academic Journey', bn:'শিক্ষাগত যাত্রা', ar:'المسيرة الأكاديمية', ur:'تعلیمی سفر', es:'Trayectoria Académica', ja:'学術の歩み', zh:'学术旅程' },
  'about.roles':       { en:'Core Roles & Interests', bn:'মূল ভূমিকা ও আগ্রহ', ar:'الأدوار والاهتمامات الأساسية', ur:'بنیادی کردار اور دلچسپیاں', es:'Roles e Intereses Principales', ja:'主な役割と関心', zh:'核心角色与兴趣' },
  'about.passions':    { en:'Areas of Passion', bn:'আগ্রহের ক্ষেত্রসমূহ', ar:'مجالات الشغف', ur:'دلچسپی کے شعبے', es:'Áreas de Pasión', ja:'情熱の分野', zh:'热忱领域' },
  'about.mission':     { en:'Mission', bn:'লক্ষ্য', ar:'الرسالة', ur:'مشن', es:'Misión', ja:'ミッション', zh:'使命' },
  'about.mission_text':{ en:'To bridge the gap between classical Islamic scholarship and modern intellectual discourse, empowering youth through mentoring, curriculum development, and community engagement — creating spaces for meaningful conversations that transcend borders.', bn:'ধ্রুপদী ইসলামী জ্ঞান ও আধুনিক বুদ্ধিবৃত্তিক আলোচনার মধ্যে ব্যবধান দূর করা, পরামর্শদান, পাঠ্যক্রম উন্নয়ন ও সম্প্রদায় সংযুক্তির মাধ্যমে যুবসমাজকে ক্ষমতায়ন করা — সীমানা অতিক্রমকারী অর্থবহ কথোপকথনের স্থান তৈরি করা।', ar:'سد الفجوة بين المعرفة الإسلامية الكلاسيكية والخطاب الفكري الحديث، وتمكين الشباب من خلال التوجيه وتطوير المناهج والمشاركة المجتمعية — خلق مساحات للمحادثات الهادفة التي تتجاوز الحدود.', ur:'کلاسیکی اسلامی علوم اور جدید فکری مکالمے کے درمیان خلیج کو پاٹنا، رہنمائی، نصاب سازی، اور سماجی شراکت کے ذریعے نوجوانوں کو بااختیار بنانا — سرحدوں سے ماورا بامعنی گفتگو کے لیے جگہیں بنانا۔', es:'Unir la brecha entre la erudición islámica clásica y el discurso intelectual moderno, empoderando a los jóvenes a través de mentoría, desarrollo curricular y compromiso comunitario — creando espacios para conversaciones significativas que trascienden fronteras.', ja:'古典イスラーム学と現代的知的談話の溝を埋め、指導・カリキュラム開発・コミュニティ参加を通じて青少年を力づけ、国境を越えた意義ある対話の場を創り出す。', zh:'弥合古典伊斯兰学术与现代知识话语之间的鸿沟，通过指导、课程开发和社区参与赋能青年——创造跨越国界的有意义对话空间。' },
  // Timeline
  'tl.early_title':    { en:"Memorization of the Qur'an", bn:"কুরআন মুখস্থকরণ", ar:'حفظ القرآن الكريم', ur:'حفظ قرآن', es:'Memorización del Corán', ja:'クルアーン暗唱', zh:'古兰经背诵' },
  'tl.early_desc':     { en:'Completed alongside primary-level education in the Alia madrasa system.', bn:'আলিয়া মাদ্রাসা ব্যবস্থায় প্রাথমিক স্তরের শিক্ষার পাশাপাশি সম্পন্ন।', ar:'أُكمل إلى جانب التعليم الابتدائي في نظام المدارس العالية.', ur:'عالیہ مدرسہ نظام میں پرائمری سطح کی تعلیم کے ساتھ مکمل کیا۔', es:'Completado junto con la educación primaria en el sistema de madrasa Alia.', ja:'アーリヤ・マドラサ制度での初等教育と並行して修了。', zh:'在 Alia 伊斯兰学校系统中与小学教育同时完成。' },
  'tl.qawmi_title':    { en:"Dawra-e-Hadith (Master's Equivalent)", bn:'দাওরায়ে হাদিস (মাস্টার্স সমতুল্য)', ar:'دورة الحديث (معادل للماجستير)', ur:'دورہ حدیث (ماسٹرز کے مساوی)', es:'Dawra-e-Hadith (Equivalente a Maestría)', ja:'ダウラ・ハディース（修士相当）', zh:'Dawra-e-Hadith（相当于硕士）' },
  'tl.qawmi_desc':     { en:'Continued studies within the Qawmi madrasa tradition, completing from Dhaka.', bn:'কওমি মাদ্রাসা ধারায় পড়াশোনা অব্যাহত, ঢাকা থেকে সম্পন্ন।', ar:'واصل الدراسات ضمن تقليد المدارس القومية، وأكملها من دكا.', ur:'قومی مدرسہ روایت میں تعلیم جاری رکھی، ڈھاکہ سے مکمل کی۔', es:'Continuó estudios dentro de la tradición de la madrasa Qawmi, completándolos desde Dhaka.', ja:'カウミー・マドラサの伝統で学びを継続し、ダッカで修了。', zh:'在 Qawmi 伊斯兰学校传统中继续学习，在达卡完成。' },
  'tl.spec_title':     { en:'PGD in Islamic Dawah', bn:'ইসলামিক দাওয়াহ-তে পিজিডি', ar:'دبلوم دراسات عليا في الدعوة الإسلامية', ur:'اسلامی دعوت میں پی جی ڈی', es:'PGD en Dawah Islámica', ja:'イスラーム宣教のPGD', zh:'伊斯兰宣教研究生文凭' },
  'tl.spec_desc':      { en:'Advanced specialization at As-Sunnah Dawah & Research Institute.', bn:'আস-সুন্নাহ দাওয়াহ এন্ড রিসার্চ ইনস্টিটিউটে উচ্চতর বিশেষায়ণ।', ar:'تخصص متقدم في معهد السنة للدعوة والبحوث.', ur:'اس سنہ دعوہ اینڈ ریسرچ انسٹیٹیوٹ میں اعلیٰ تخصص۔', es:'Especialización avanzada en el Instituto As-Sunnah Dawah & Research.', ja:'アッ＝スンナ・ダアワ研究所での高度専門課程。', zh:'在 As-Sunnah Dawah & Research Institute 的高级专业学习。' },
  'tl.present_title':  { en:'SSC Candidate (2027)', bn:'এসএসসি পরীক্ষার্থী (২০২৭)', ar:'مرشح للشهادة الثانوية (٢٠٢٧)', ur:'ایس ایس سی امیدوار (۲۰۲۷)', es:'Candidato SSC (2027)', ja:'SSC受験生（2027年）', zh:'SSC 考生（2027年）' },
  'tl.present_desc':   { en:'Continuing academic journey within general education. Interested in Education Research & African Studies.', bn:'সাধারণ শিক্ষায় একাডেমিক যাত্রা অব্যাহত। শিক্ষা গবেষণা ও আফ্রিকান স্টাডিজে আগ্রহী।', ar:'مواصلة المسيرة الأكاديمية ضمن التعليم العام. مهتم ببحوث التعليم والدراسات الأفريقية.', ur:'عام تعلیم میں تعلیمی سفر جاری۔ تعلیمی تحقیق اور افریقی مطالعات میں دلچسپی۔', es:'Continuando la trayectoria académica dentro de la educación general. Interesado en Investigación Educativa y Estudios Africanos.', ja:'一般教育での学術の歩みを継続中。教育研究とアフリカ研究に関心。', zh:'在普通教育中继续学术旅程。对教育研究和非洲研究感兴趣。' },
  // Timeline year labels
  'tl.early_year':     { en:'Early Years', bn:'প্রারম্ভিক বছর', ar:'السنوات الأولى', ur:'ابتدائی سال', es:'Primeros Años', ja:'初期', zh:'早期' },
  'tl.qawmi_year':     { en:'Qawmi Studies', bn:'কওমি শিক্ষা', ar:'الدراسات القومية', ur:'قومی تعلیم', es:'Estudios Qawmi', ja:'カウミー研究', zh:'Qawmi 学习' },
  'tl.spec_year':      { en:'Specialization', bn:'বিশেষায়ণ', ar:'التخصص', ur:'تخصص', es:'Especialización', ja:'専門課程', zh:'专业' },
  'tl.present_year':   { en:'Present', bn:'বর্তমান', ar:'الحاضر', ur:'حال', es:'Presente', ja:'現在', zh:'现在' },
  // Credentials
  'cred.quran':        { en:"Memorized the Qur'an", bn:'কুরআন মুখস্থ', ar:'حفظ القرآن', ur:'حفظ قرآن', es:'Memorizó el Corán', ja:'クルアーン暗唱', zh:'背诵古兰经' },
  'cred.dawra':        { en:"Dawra-e-Hadith (Master's Equivalent)", bn:'দাওরায়ে হাদিস (মাস্টার্স সমতুল্য)', ar:'دورة الحديث (معادل للماجستير)', ur:'دورہ حدیث (ماسٹرز کے مساوی)', es:'Dawra-e-Hadith (Equivalente a Maestría)', ja:'ダウラ・ハディース（修士相当）', zh:'Dawra-e-Hadith（硕士相当）' },
  'cred.pgd':          { en:'PGD in Islamic Dawah', bn:'ইসলামিক দাওয়াহ-তে পিজিডি', ar:'دبلوم دراسات عليا في الدعوة الإسلامية', ur:'اسلامی دعوت میں پی جی ڈی', es:'PGD en Dawah Islámica', ja:'イスラーム宣教PGD', zh:'伊斯兰宣教研究生文凭' },
  'cred.educator':     { en:'Educator & Researcher', bn:'শিক্ষাবিদ ও গবেষক', ar:'معلّم وباحث', ur:'معلم اور محقق', es:'Educador e Investigador', ja:'教育者・研究者', zh:'教育家与研究员' },
  // Roles
  'role.instructor':   { en:'Instructor', bn:'প্রশিক্ষক', ar:'مدرّب', ur:'انسٹرکٹر', es:'Instructor', ja:'講師', zh:'讲师' },
  'role.educator':     { en:'Educator', bn:'শিক্ষাবিদ', ar:'معلّم', ur:'معلم', es:'Educador', ja:'教育者', zh:'教育家' },
  'role.mentor':       { en:'Mentor', bn:'পরামর্শক', ar:'مرشد', ur:'رہنما', es:'Mentor', ja:'メンター', zh:'导师' },
  'role.researcher':   { en:'Assistant Researcher', bn:'সহকারী গবেষক', ar:'باحث مساعد', ur:'معاون محقق', es:'Investigador Asistente', ja:'研究助手', zh:'助理研究员' },
  'role.ai':           { en:'AI Enthusiast', bn:'এআই উৎসাহী', ar:'متحمس للذكاء الاصطناعي', ur:'اے آئی کے شوقین', es:'Entusiasta de IA', ja:'AI愛好家', zh:'AI 爱好者' },
  'role.thinker':      { en:'Curious Thinker', bn:'কৌতূহলী চিন্তাবিদ', ar:'مفكر فضولي', ur:'متحسس مفکر', es:'Pensador Curioso', ja:'好奇心旺盛な思考家', zh:'好奇的思想者' },
  'role.counselor':    { en:'Guidance Counselor', bn:'দিকনির্দেশক', ar:'مستشار توجيهي', ur:'رہنمائی مشیر', es:'Consejero de Orientación', ja:'ガイダンスカウンセラー', zh:'指导顾问' },
  'role.curriculum':   { en:'Curriculum Developer', bn:'পাঠ্যক্রম বিকাশক', ar:'مطوّر مناهج', ur:'نصاب ساز', es:'Desarrollador Curricular', ja:'カリキュラム開発者', zh:'课程开发者' },
  // Passions
  'passion.languages': { en:'Languages', bn:'ভাষাসমূহ', ar:'اللغات', ur:'زبانیں', es:'Idiomas', ja:'言語', zh:'语言' },
  'passion.entrepreneurship': { en:'Entrepreneurship', bn:'উদ্যোক্তা', ar:'ريادة الأعمال', ur:'کاروباریت', es:'Emprendimiento', ja:'起業', zh:'创业' },
  'passion.charity':   { en:'Charity', bn:'দান-খয়রাত', ar:'العمل الخيري', ur:'خیرات', es:'Caridad', ja:'慈善', zh:'慈善' },
  'passion.social':    { en:'Social Development', bn:'সামাজিক উন্নয়ন', ar:'التنمية الاجتماعية', ur:'سماجی ترقی', es:'Desarrollo Social', ja:'社会開発', zh:'社会发展' },
  'passion.youth':     { en:'Youth Mentoring', bn:'যুব পরামর্শদান', ar:'توجيه الشباب', ur:'نوجوانوں کی رہنمائی', es:'Mentoría Juvenil', ja:'青少年指導', zh:'青年辅导' },
  'passion.community': { en:'Community Engagement', bn:'সম্প্রদায় সংযুক্তি', ar:'المشاركة المجتمعية', ur:'سماجی شراکت', es:'Compromiso Comunitario', ja:'コミュニティ参加', zh:'社区参与' },
  // Auth Modal
  'auth.welcome_back': { en:'Welcome Back', bn:'আবার স্বাগতম', ar:'مرحبًا بعودتك', ur:'خوش آمدید', es:'Bienvenido de Nuevo', ja:'おかえりなさい', zh:'欢迎回来' },
  'auth.create_account': { en:'Create Account', bn:'অ্যাকাউন্ট তৈরি করুন', ar:'إنشاء حساب', ur:'اکاؤنٹ بنائیں', es:'Crear Cuenta', ja:'アカウント作成', zh:'创建账户' },
  'auth.magic_link':   { en:'Passwordless Sign In', bn:'পাসওয়ার্ডবিহীন সাইন ইন', ar:'تسجيل بدون كلمة مرور', ur:'بغیر پاسورڈ سائن ان', es:'Inicio sin Contraseña', ja:'パスワードなしログイン', zh:'无密码登录' },
  'auth.reset_password': { en:'Reset Password', bn:'পাসওয়ার্ড রিসেট', ar:'إعادة تعيين كلمة المرور', ur:'پاسورڈ ری سیٹ', es:'Restablecer Contraseña', ja:'パスワードリセット', zh:'重置密码' },
  'auth.signin_subtitle': { en:'Sign in to continue the discourse', bn:'আলোচনা চালিয়ে যেতে সাইন ইন করুন', ar:'سجّل الدخول لمواصلة الخطاب', ur:'گفتگو جاری رکھنے کے لیے سائن ان کریں', es:'Inicia sesión para continuar el discurso', ja:'対話を続けるにはログイン', zh:'登录以继续对话' },
  'auth.create_subtitle': { en:'Join the intellectual conversation', bn:'বুদ্ধিবৃত্তিক কথোপকথনে যোগ দিন', ar:'انضم إلى المحادثة الفكرية', ur:'فکری گفتگو میں شامل ہوں', es:'Únete a la conversación intelectual', ja:'知的対話に参加', zh:'加入知识对话' },
  'auth.magic_subtitle': { en:"We'll email you a login link", bn:'আমরা আপনাকে লগইন লিংক ইমেইল করব', ar:'سنرسل لك رابط تسجيل الدخول عبر البريد', ur:'ہم آپ کو لاگ ان لنک ای میل کریں گے', es:'Te enviaremos un enlace de inicio de sesión', ja:'ログインリンクをメールでお送りします', zh:'我们将通过电子邮件发送登录链接' },
  'auth.reset_subtitle': { en:'Enter your email to receive a password reset link', bn:'পাসওয়ার্ড রিসেট লিংক পেতে ইমেইল দিন', ar:'أدخل بريدك الإلكتروني لاستلام رابط إعادة التعيين', ur:'پاسورڈ ری سیٹ لنک کے لیے ای میل درج کریں', es:'Ingresa tu correo para recibir un enlace de restablecimiento', ja:'リセットリンクを受け取るメールアドレスを入力', zh:'输入电子邮件以接收密码重置链接' },
  'auth.email':        { en:'Email', bn:'ইমেইল', ar:'البريد الإلكتروني', ur:'ای میل', es:'Correo Electrónico', ja:'メール', zh:'电子邮件' },
  'auth.password':     { en:'Password', bn:'পাসওয়ার্ড', ar:'كلمة المرور', ur:'پاسورڈ', es:'Contraseña', ja:'パスワード', zh:'密码' },
  'auth.username':     { en:'Username', bn:'ইউজারনেম', ar:'اسم المستخدم', ur:'صارف نام', es:'Nombre de Usuario', ja:'ユーザー名', zh:'用户名' },
  'auth.confirm_pw':   { en:'Confirm Password', bn:'পাসওয়ার্ড নিশ্চিত করুন', ar:'تأكيد كلمة المرور', ur:'پاسورڈ کی تصدیق', es:'Confirmar Contraseña', ja:'パスワード確認', zh:'确认密码' },
  'auth.forgot_pw':    { en:'Forgot Password?', bn:'পাসওয়ার্ড ভুলে গেছেন?', ar:'نسيت كلمة المرور؟', ur:'پاسورڈ بھول گئے؟', es:'¿Olvidaste tu Contraseña?', ja:'パスワードをお忘れですか？', zh:'忘记密码？' },
  'auth.agree_terms':  { en:'I agree to the Terms of Service and Privacy Policy', bn:'আমি পরিষেবার শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত', ar:'أوافق على شروط الخدمة وسياسة الخصوصية', ur:'میں سروس کی شرائط اور رازداری کی پالیسی سے متفق ہوں', es:'Acepto los Términos de Servicio y la Política de Privacidad', ja:'利用規約とプライバシーポリシーに同意します', zh:'我同意服务条款和隐私政策' },
  'auth.sign_in':      { en:'Sign In', bn:'সাইন ইন', ar:'تسجيل الدخول', ur:'سائن ان', es:'Iniciar Sesión', ja:'ログイン', zh:'登录' },
  'auth.send_link':    { en:'Send Login Link', bn:'লগইন লিংক পাঠান', ar:'إرسال رابط التسجيل', ur:'لاگ ان لنک بھیجیں', es:'Enviar Enlace', ja:'リンクを送信', zh:'发送登录链接' },
  'auth.send_reset':   { en:'Send Reset Link', bn:'রিসেট লিংক পাঠান', ar:'إرسال رابط إعادة التعيين', ur:'ری سیٹ لنک بھیجیں', es:'Enviar Enlace de Restablecimiento', ja:'リセットリンクを送信', zh:'发送重置链接' },
  'auth.no_account':   { en:"Don't have an account? Create one", bn:'অ্যাকাউন্ট নেই? একটি তৈরি করুন', ar:'ليس لديك حساب؟ أنشئ واحدًا', ur:'اکاؤنٹ نہیں ہے؟ بنائیں', es:'¿No tienes cuenta? Crea una', ja:'アカウントがありませんか？作成する', zh:'没有账户？创建一个' },
  'auth.have_account': { en:'Already have an account? Sign in', bn:'ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন', ar:'لديك حساب بالفعل؟ سجّل الدخول', ur:'پہلے سے اکاؤنٹ ہے؟ سائن ان کریں', es:'¿Ya tienes cuenta? Inicia sesión', ja:'すでにアカウントをお持ちですか？ログイン', zh:'已有账户？登录' },
  'auth.or_continue':  { en:'Or continue with', bn:'অথবা চালিয়ে যান', ar:'أو تابع باستخدام', ur:'یا جاری رکھیں', es:'O continúa con', ja:'または次で続行', zh:'或继续使用' },
  'auth.magic_sent':   { en:'Magic link sent! Check your email.', bn:'ম্যাজিক লিংক পাঠানো হয়েছে! ইমেইল দেখুন।', ar:'تم إرسال الرابط السحري! تحقق من بريدك.', ur:'جادوئی لنک بھیج دیا گیا! ای میل چیک کریں۔', es:'¡Enlace mágico enviado! Revisa tu correo.', ja:'マジックリンクを送信しました！メールを確認してください。', zh:'魔法链接已发送！请查看您的电子邮件。' },
  'auth.reset_sent':   { en:'Password reset link sent! Check your email.', bn:'পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে! ইমেইল দেখুন।', ar:'تم إرسال رابط إعادة التعيين! تحقق من بريدك.', ur:'پاسورڈ ری سیٹ لنک بھیج دیا گیا! ای میل چیک کریں۔', es:'¡Enlace de restablecimiento enviado! Revisa tu correo.', ja:'リセットリンクを送信しました！メールを確認してください。', zh:'密码重置链接已发送！请查看您的电子邮件。' },
  'auth.created':      { en:'Account created! Please check your email.', bn:'অ্যাকাউন্ট তৈরি হয়েছে! ইমেইল চেক করুন।', ar:'تم إنشاء الحساب! تحقق من بريدك.', ur:'اکاؤنٹ بن گیا! ای میل چیک کریں۔', es:'¡Cuenta creada! Revisa tu correo.', ja:'アカウントが作成されました！メールを確認してください。', zh:'账户已创建！请查看您的电子邮件。' },
  'auth.err_firstname':{ en:'First name is required', bn:'নাম প্রয়োজন', ar:'الاسم الأول مطلوب', ur:'پہلا نام درکار ہے', es:'Se requiere el nombre', ja:'名前が必要です', zh:'需要填写名字' },
  'auth.err_username': { en:'Please choose a username', bn:'ইউজারনেম নির্বাচন করুন', ar:'يرجى اختيار اسم مستخدم', ur:'صارف نام منتخب کریں', es:'Elige un nombre de usuario', ja:'ユーザー名を選んでください', zh:'请选择用户名' },
  'auth.err_pw_short': { en:'Password must be at least 6 characters', bn:'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', ar:'يجب أن تكون كلمة المرور ٦ أحرف على الأقل', ur:'پاسورڈ کم از کم ۶ حروف کا ہونا چاہیے', es:'La contraseña debe tener al menos 6 caracteres', ja:'パスワードは6文字以上必要です', zh:'密码至少需要6个字符' },
  'auth.err_pw_match': { en:'Passwords do not match', bn:'পাসওয়ার্ড মিলছে না', ar:'كلمات المرور غير متطابقة', ur:'پاسورڈ مماثل نہیں', es:'Las contraseñas no coinciden', ja:'パスワードが一致しません', zh:'密码不匹配' },
  'auth.err_agree':    { en:'Please accept the terms', bn:'শর্তাবলী গ্রহণ করুন', ar:'يرجى قبول الشروط', ur:'شرائط قبول کریں', es:'Acepta los términos', ja:'利用規約に同意してください', zh:'请接受条款' },
  // Notifications
  'notif.title':       { en:'Notifications', bn:'বিজ্ঞপ্তি', ar:'الإشعارات', ur:'اطلاعات', es:'Notificaciones', ja:'通知', zh:'通知' },
  'notif.empty':       { en:'No notifications yet', bn:'এখনও কোনো বিজ্ঞপ্তি নেই', ar:'لا توجد إشعارات بعد', ur:'ابھی تک کوئی اطلاع نہیں', es:'Aún no hay notificaciones', ja:'まだ通知がありません', zh:'暂无通知' },
  // Profile
  'profile.not_found': { en:'Profile not found.', bn:'প্রোফাইল পাওয়া যায়নি।', ar:'الملف غير موجود.', ur:'پروفائل نہیں ملا۔', es:'Perfil no encontrado.', ja:'プロフィールが見つかりません。', zh:'未找到个人资料。' },
  'profile.no_posts':  { en:'No posts yet.', bn:'এখনও কোনো পোস্ট নেই।', ar:'لا توجد منشورات بعد.', ur:'ابھی تک کوئی پوسٹ نہیں۔', es:'Aún no hay publicaciones.', ja:'まだ投稿がありません。', zh:'暂无帖子。' },
  'profile.no_chats':  { en:'No conversations to show yet.', bn:'এখনও কোনো কথোপকথন নেই।', ar:'لا توجد محادثات بعد.', ur:'ابھی تک کوئی گفتگو نہیں۔', es:'Aún no hay conversaciones.', ja:'まだ会話がありません。', zh:'暂无对话。' },
  // Nav Sign Out
  'nav.sign_out':      { en:'Sign Out', bn:'সাইন আউট', ar:'تسجيل الخروج', ur:'سائن آؤٹ', es:'Cerrar Sesión', ja:'ログアウト', zh:'退出登录' },
  // Statistics section
  'stats.title':       { en:'By The Numbers', bn:'পরিসংখ্যানে', ar:'بالأرقام', ur:'اعداد میں', es:'En Números', ja:'数字で見る', zh:'数据一览' },
  'stats.students':    { en:'Students Taught', bn:'শিক্ষার্থী পড়ানো হয়েছে', ar:'الطلاب الذين تم تدريسهم', ur:'پڑھائے گئے طلباء', es:'Estudiantes Enseñados', ja:'指導した学生', zh:'教授的学生' },
  'stats.years':       { en:'Years of Study', bn:'অধ্যয়নের বছর', ar:'سنوات الدراسة', ur:'تعلیم کے سال', es:'Años de Estudio', ja:'学習年数', zh:'学习年限' },
  'stats.courses':     { en:'Courses & Workshops', bn:'কোর্স ও ওয়ার্কশপ', ar:'الدورات وورش العمل', ur:'کورسز اور ورکشاپس', es:'Cursos y Talleres', ja:'コース・ワークショップ', zh:'课程与工作坊' },
  // Features/Expertise section
  'features.title':    { en:'Areas of Expertise', bn:'দক্ষতার ক্ষেত্রসমূহ', ar:'مجالات الخبرة', ur:'مہارت کے شعبے', es:'Áreas de Experiencia', ja:'専門分野', zh:'专长领域' },
  // CTA section
  'cta.title':         { en:'Ready to Connect?', bn:'সংযোগ করতে প্রস্তুত?', ar:'مستعد للتواصل؟', ur:'رابطہ کرنے کے لیے تیار؟', es:'¿Listo para Conectar?', ja:'つながる準備は？', zh:'准备好联系了吗？' },
  'cta.subtitle':      { en:'Join the conversation. Share ideas, ask questions, or just say hello.', bn:'কথোপকথনে যোগ দিন। আইডিয়া শেয়ার করুন, প্রশ্ন করুন, অথবা শুধু হ্যালো বলুন।', ar:'انضم إلى المحادثة. شارك الأفكار، اطرح الأسئلة، أو قل مرحبًا.', ur:'گفتگو میں شامل ہوں۔ خیالات شیئر کریں، سوال پوچھیں، یا صرف ہیلو کہیں۔', es:'Únete a la conversación. Comparte ideas, haz preguntas, o solo saluda.', ja:'会話に参加しましょう。アイデアを共有し、質問し、あるいはただ挨拶を。', zh:'加入对话。分享想法，提问，或者只是打个招呼。' },
  'cta.button':        { en:'Start Chatting', bn:'চ্যাট শুরু করুন', ar:'ابدأ المحادثة', ur:'چیٹ شروع کریں', es:'Empezar a Chatear', ja:'チャットを始める', zh:'开始聊天' },


  // Auth extra keys
  'auth.magic_title':  { en:'Magic Link', bn:'ম্যাজিক লিংক', ar:'الرابط السحري', ur:'جادوئی لنک', es:'Enlace Mágico', ja:'マジックリンク', zh:'魔法链接' },
  'auth.signup_subtitle': { en:'Fill in your details to get started', bn:'শুরু করতে আপনার তথ্য দিন', ar:'املأ بياناتك للبدء', ur:'شروع کرنے کے لیے اپنی تفصیلات درج کریں', es:'Completa tus datos para empezar', ja:'開始するには情報を入力してください', zh:'填写您的信息以开始' },
  'auth.or':           { en:'or', bn:'অথবা', ar:'أو', ur:'یا', es:'o', ja:'または', zh:'或' },
  'auth.first_name':   { en:'First Name', bn:'নামের প্রথম অংশ', ar:'الاسم الأول', ur:'پہلا نام', es:'Nombre', ja:'名', zh:'名' },
  'auth.last_name':    { en:'Last Name', bn:'নামের শেষ অংশ', ar:'اسم العائلة', ur:'آخری نام', es:'Apellido', ja:'姓', zh:'姓' },
  'auth.email_address':{ en:'Email Address', bn:'ইমেইল ঠিকানা', ar:'البريد الإلكتروني', ur:'ای میل ایڈریس', es:'Correo Electrónico', ja:'メールアドレス', zh:'电子邮件地址' },
  'auth.password_label': { en:'Password', bn:'পাসওয়ার্ড', ar:'كلمة المرور', ur:'پاسورڈ', es:'Contraseña', ja:'パスワード', zh:'密码' },
  'auth.pw_hint':      { en:'Min 6 characters', bn:'সর্বনিম্ন ৬ অক্ষর', ar:'٦ أحرف على الأقل', ur:'کم از کم ۶ حروف', es:'Mínimo 6 caracteres', ja:'6文字以上', zh:'至少6个字符' },
  'auth.reenter_pw':   { en:'Re-enter password', bn:'পাসওয়ার্ড আবার লিখুন', ar:'أعد إدخال كلمة المرور', ur:'پاسورڈ دوبارہ درج کریں', es:'Reingresa la contraseña', ja:'パスワードを再入力', zh:'重新输入密码' },
  'auth.confirm_label':{ en:'Confirm Password', bn:'পাসওয়ার্ড নিশ্চিত করুন', ar:'تأكيد كلمة المرور', ur:'پاسورڈ کی تصدیق', es:'Confirmar Contraseña', ja:'パスワード確認', zh:'确认密码' },
  'auth.hide_pw':      { en:'Hide password', bn:'পাসওয়ার্ড লুকান', ar:'إخفاء كلمة المرور', ur:'پاسورڈ چھپائیں', es:'Ocultar contraseña', ja:'パスワードを隠す', zh:'隐藏密码' },
  'auth.show_pw':      { en:'Show password', bn:'পাসওয়ার্ড দেখান', ar:'إظهار كلمة المرور', ur:'پاسورڈ دکھائیں', es:'Mostrar contraseña', ja:'パスワードを表示', zh:'显示密码' },
  'auth.send_magic':   { en:'Send Magic Link', bn:'ম্যাজিক লিংক পাঠান', ar:'إرسال الرابط السحري', ur:'جادوئی لنک بھیجیں', es:'Enviar Enlace Mágico', ja:'マジックリンクを送信', zh:'发送魔法链接' },
  'auth.back_signin':  { en:'Back to Sign In', bn:'সাইন ইন-এ ফিরুন', ar:'العودة لتسجيل الدخول', ur:'سائن ان پر واپس جائیں', es:'Volver a Iniciar Sesión', ja:'ログインに戻る', zh:'返回登录' },
  'auth.magic_alt':    { en:'Sign in with magic link instead', bn:'পরিবর্তে ম্যাজিক লিংক দিয়ে সাইন ইন করুন', ar:'سجّل الدخول بالرابط السحري بدلاً من ذلك', ur:'اس کے بجائے جادوئی لنک سے سائن ان کریں', es:'Inicia sesión con enlace mágico en su lugar', ja:'代わりにマジックリンクでログイン', zh:'改用魔法链接登录' },
  'auth.account_created': { en:'Account created! Please check your email to confirm registration and activate your account.', bn:'অ্যাকাউন্ট তৈরি হয়েছে! নিবন্ধন নিশ্চিত করতে ইমেইল চেক করুন।', ar:'تم إنشاء الحساب! تحقق من بريدك لتأكيد التسجيل.', ur:'اکاؤنٹ بن گیا! تصدیق کے لیے ای میل چیک کریں۔', es:'¡Cuenta creada! Revisa tu correo para confirmar.', ja:'アカウントが作成されました！確認のためメールをチェックしてください。', zh:'账户已创建！请查看电子邮件确认注册。' },


  'auth.failed_magic': { en:'Failed to send magic link', bn:'ম্যাজিক লিংক পাঠানো যায়নি', ar:'فشل إرسال الرابط السحري', ur:'جادوئی لنک بھیجنے میں ناکامی', es:'No se pudo enviar el enlace mágico', ja:'マジックリンクの送信に失敗しました', zh:'发送魔法链接失败' },


  // FeaturesSection
  'feat.what_i_do':   { en:'What I do', bn:'আমি যা করি', ar:'ما أفعله', ur:'میں کیا کرتا ہوں', es:'Lo que Hago', ja:'私の仕事', zh:'我的工作' },
  'feat.subtitle':    { en:'A foundation in classical Islamic scholarship, applied through teaching, research, and community impact.', bn:'ধ্রুপদী ইসলামী জ্ঞানের ভিত্তি, যা শিক্ষাদান, গবেষণা এবং সম্প্রদায় প্রভাবের মাধ্যমে প্রয়োগ করা হয়।', ar:'أساس في المعرفة الإسلامية الكلاسيكية، يُطبَّق من خلال التدريس والبحث والأثر المجتمعي.', ur:'کلاسیکی اسلامی علوم کی بنیاد، جو تدریس، تحقیق اور سماجی اثر کے ذریعے لاگو کی جاتی ہے۔', es:'Una base en la erudición islámica clásica, aplicada a través de la enseñanza, la investigación y el impacto comunitario.', ja:'古典イスラーム学の基盤を、教育・研究・コミュニティへの影響を通じて応用。', zh:'以古典伊斯兰学术为基础，通过教学、研究和社区影响加以应用。' },
  'feat.teaching_desc': { en:'Classroom instruction and training across Islamic studies and general education, with structured, student-first pedagogy.', bn:'ইসলামী শিক্ষা ও সাধারণ শিক্ষায় শ্রেণিকক্ষ নির্দেশনা ও প্রশিক্ষণ, কাঠামোবদ্ধ, শিক্ষার্থী-কেন্দ্রিক পদ্ধতিতে।', ar:'تدريس وتدريب في الدراسات الإسلامية والتعليم العام، بمنهجية منظمة تركز على الطالب.', ur:'اسلامی علوم اور عام تعلیم میں کلاس روم تدریس اور تربیت، منظم اور طالب علم پر مبنی طریقہ کار کے ساتھ۔', es:'Instrucción y formación en estudios islámicos y educación general, con una pedagogía estructurada centrada en el estudiante.', ja:'イスラーム学と一般教育における教室指導・研修。構造化された学生中心の教授法。', zh:'在伊斯兰研究和普通教育中提供课堂教学和培训，采用结构化、以学生为先的教学法。' },
  'feat.research_desc': { en:'Research bridging classical Islamic scholarship with modern education, intellectual discourse, and curriculum science.', bn:'ধ্রুপদী ইসলামী জ্ঞানকে আধুনিক শিক্ষা, বুদ্ধিবৃত্তিক আলোচনা ও পাঠ্যক্রম বিজ্ঞানের সাথে সংযুক্তকারী গবেষণা।', ar:'بحث يربط المعرفة الإسلامية الكلاسيكية بالتعليم الحديث والخطاب الفكري وعلم المناهج.', ur:'تحقیق جو کلاسیکی اسلامی علوم کو جدید تعلیم، فکری گفتگو اور نصاب سائنس سے جوڑتا ہے۔', es:'Investigación que une la erudición islámica clásica con la educación moderna, el discurso intelectual y la ciencia curricular.', ja:'古典イスラーム学と現代教育・知的談話・カリキュラム科学を橋渡しする研究。', zh:'连接古典伊斯兰学术与现代教育、知识话语和课程科学的研究。' },
  'feat.curriculum_desc': { en:'Designing curricula and learning materials that connect timeless knowledge with contemporary learning needs.', bn:'চিরন্তন জ্ঞানকে সমসাময়িক শেখার প্রয়োজনের সাথে সংযুক্ত করে এমন পাঠ্যক্রম ও শিক্ষা উপকরণ ডিজাইন করা।', ar:'تصميم مناهج ومواد تعليمية تربط المعرفة الخالدة باحتياجات التعلم المعاصرة.', ur:'ایسے نصاب اور تعلیمی مواد تیار کرنا جو لازوال علم کو عصر حاضر کی ضروریات سے جوڑیں۔', es:'Diseñando currículos y materiales de aprendizaje que conectan el conocimiento atemporal con las necesidades contemporáneas.', ja:'時代を超えた知識と現代の学習ニーズを結ぶカリキュラムと教材の設計。', zh:'设计将永恒知识与当代学习需求相连接的课程和学习材料。' },
  'feat.mentoring_desc': { en:'Guiding young learners through academic and personal growth - mentorship built on trust, structure, and purpose.', bn:'তরুণ শিক্ষার্থীদের একাডেমিক ও ব্যক্তিগত বিকাশে পথ দেখানো — বিশ্বাস, কাঠামো ও লক্ষ্যের উপর নির্মিত পরামর্শদান।', ar:'توجيه المتعلمين الشباب في النمو الأكاديمي والشخصي - إرشاد مبني على الثقة والهيكل والهدف.', ur:'نوجوان سیکھنے والوں کی تعلیمی اور ذاتی ترقی میں رہنمائی — اعتماد، ساخت اور مقصد پر مبنی رہنمائی۔', es:'Guiando a jóvenes estudiantes en su crecimiento académico y personal: mentoría construida sobre confianza, estructura y propósito.', ja:'信頼・構造・目的に基づくメンタリングで、若い学習者の学問的・人格的成長を導く。', zh:'通过建立在信任、结构和目标之上的指导，引导青年学习者的学术和个人成长。' },
  'feat.dawah_desc':  { en:'Clear, grounded communication on faith, education, and social development for diverse and global audiences.', bn:'বৈচিত্র্যময় ও বৈশ্বিক শ্রোতাদের জন্য信仰, শিক্ষা ও সামাজিক উন্নয়ন নিয়ে স্পষ্ট, ভিত্তিগত যোগাযোগ।', ar:'تواصل واضح وراسخ حول الإيمان والتعليم والتنمية الاجتماعية لجماهير متنوعة وعالمية.', ur:'متنوع اور عالمی سامعین کے لیے ایمان، تعلیم اور سماجی ترقی پر واضح، زمینی حقیقت پر مبنی گفتگو۔', es:'Comunicación clara y fundamentada sobre fe, educación y desarrollo social para audiencias diversas y globales.', ja:'多様な国内外の聴衆への、信仰・教育・社会開発に関する明確で地に足のついた発信。', zh:'面向多元化和全球受众，就信仰、教育和社会发展进行清晰、务实的沟通。' },
  'feat.community_desc': { en:'Charitable and community-based initiatives focused on social development, youth empowerment, and connection.', bn:'সামাজিক উন্নয়ন, যুব ক্ষমতায়ন ও সংযোগের উপর কেন্দ্রীভূত দাতব্য ও সম্প্রদায়ভিত্তিক উদ্যোগ।', ar:'مبادرات خيرية ومجتمعية تركز على التنمية الاجتماعية وتمكين الشباب والتواصل.', ur:'سماجی ترقی، نوجوانوں کو بااختیار بنانے اور رابطے پر مرکوز خیراتی اور سماجی اقدامات۔', es:'Iniciativas benéficas y comunitarias centradas en el desarrollo social, el empoderamiento juvenil y la conexión.', ja:'社会開発・青少年エンパワーメント・つながりに焦点を当てた慈善・コミュニティ活動。', zh:'专注于社会发展、青年赋权和联系的慈善和社区倡议。' },
  // CTASection
  'cta.conversation': { en:'Let\'s start a', bn:'শুরু করি একটি', ar:'لنبدأ', ur:'آئیے شروع کریں', es:'Empecemos una', ja:'始めましょう', zh:'让我们开始' },
  'cta.conversation_word': { en:'conversation', bn:'কথোপকথন', ar:'محادثة', ur:'گفتگو', es:'conversación', ja:'対話', zh:'对话' },
  'cta.desc':         { en:'Whether it\'s education, research, collaboration, or simply a meaningful discussion - reach out and connect.', bn:'শিক্ষা, গবেষণা, সহযোগিতা, অথবা শুধুই একটি অর্থবহ আলোচনা — হোক তা যাই, যোগাযোগ করুন।', ar:'سواء كان الأمر تعليمًا أو بحثًا أو تعاونًا أو مجرد نقاش هادف - تواصل معي.', ur:'چاہے یہ تعلیم ہو، تحقیق، تعاون، یا صرف ایک بامعنی گفتگو — رابطہ کریں اور جڑیں۔', es:'Ya sea educación, investigación, colaboración o simplemente una discusión significativa: comunícate y conecta.', ja:'教育、研究、コラボレーション、あるいは単なる意義ある対話 — 何でもご連絡を。', zh:'无论是教育、研究、合作，还是仅仅一次有意义的讨论——请随时联系。' },
  'cta.join':         { en:'Join the Community', bn:'কমিউনিটিতে যোগ দিন', ar:'انضم إلى المجتمع', ur:'کمیونٹی میں شامل ہوں', es:'Únete a la Comunidad', ja:'コミュニティに参加', zh:'加入社区' },
  'cta.email':        { en:'Email Directly', bn:'সরাসরি ইমেইল করুন', ar:'راسلني مباشرة', ur:'براہ راست ای میل کریں', es:'Enviar Correo', ja:'直接メール', zh:'直接发邮件' },
  // StatsCounter
  'stats.active_users': { en:'Active Users', bn:'সক্রিয় ব্যবহারকারী', ar:'المستخدمون النشطون', ur:'فعال صارفین', es:'Usuarios Activos', ja:'アクティブユーザー', zh:'活跃用户' },
  'stats.messages':   { en:'Messages Sent', bn:'বার্তা পাঠানো হয়েছে', ar:'الرسائل المرسلة', ur:'بھیجے گئے پیغامات', es:'Mensajes Enviados', ja:'送信メッセージ', zh:'已发送消息' },
  'stats.feed_posts': { en:'Feed Posts', bn:'ফিড পোস্ট', ar:'منشورات التغذية', ur:'فیڈ پوسٹس', es:'Publicaciones del Feed', ja:'フィード投稿', zh:'动态帖子' },





  // Chat page
  'chat.access_title': { en:'Chat Access Required', bn:'চ্যাট অ্যাক্সেস প্রয়োজন', ar:'يتطلب الوصول إلى المحادثة', ur:'چیٹ تک رسائی درکار ہے', es:'Acceso al Chat Requerido', ja:'チャットへのアクセスが必要です', zh:'需要聊天访问权限' },
  'chat.access_desc':  { en:'Sign in to join the live conversation.', bn:'লাইভ কথোপকথনে যোগ দিতে সাইন ইন করুন।', ar:'سجّل الدخول للانضمام إلى المحادثة المباشرة.', ur:'لائیو گفتگو میں شامل ہونے کے لیے سائن ان کریں۔', es:'Inicia sesión para unirte a la conversación en vivo.', ja:'ライブ対話に参加するにはログインしてください。', zh:'登录以加入实时对话。' },
  'chat.search':       { en:'Search messages...', bn:'বার্তা খুঁজুন...', ar:'ابحث عن الرسائل...', ur:'پیغامات تلاش کریں...', es:'Buscar mensajes...', ja:'メッセージを検索...', zh:'搜索消息...' },
  'chat.sound_on':     { en:'Sound on - click to mute', bn:'সাউন্ড চালু - মিউট করতে ক্লিক করুন', ar:'الصوت مفعّل - انقر للكتم', ur:'آواز آن ہے - خاموش کرنے کے لیے کلک کریں', es:'Sonido activado - clic para silenciar', ja:'サウンドオン - クリックでミュート', zh:'声音开启 - 点击静音' },
  'chat.sound_off':    { en:'Sound off - click to enable', bn:'সাউন্ড বন্ধ - চালু করতে ক্লিক করুন', ar:'الصوت مكتوم - انقر للتفعيل', ur:'آواز بند ہے - چالو کرنے کے لیے کلک کریں', es:'Sonido apagado - clic para activar', ja:'サウンドオフ - クリックで有効化', zh:'声音关闭 - 点击启用' },
  'chat.sent_failed':  { en:'Failed to send', bn:'পাঠানো ব্যর্থ হয়েছে', ar:'فشل الإرسال', ur:'بھیجنا ناکام', es:'Error al enviar', ja:'送信に失敗しました', zh:'发送失败' },
  'chat.deleted':      { en:'Message deleted', bn:'বার্তা মুছে ফেলা হয়েছে', ar:'تم حذف الرسالة', ur:'پیغام حذف کر دیا گیا', es:'Mensaje eliminado', ja:'メッセージを削除しました', zh:'消息已删除' },
  'chat.copied':       { en:'Copied to clipboard', bn:'ক্লিপবোর্ডে কপি হয়েছে', ar:'تم النسخ إلى الحافظة', ur:'کلپ بورڈ پر کاپی ہو گیا', es:'Copiado al portapapeles', ja:'クリップボードにコピーしました', zh:'已复制到剪贴板' },
  'chat.img_big':      { en:'Image must be under 5MB', bn:'ছবি ৫ এমবির কম হতে হবে', ar:'يجب أن يكون حجم الصورة أقل من ٥ ميجابايت', ur:'تصویر ۵ ایم بی سے کم ہونی چاہیے', es:'La imagen debe ser menor a 5MB', ja:'画像は5MB未満にしてください', zh:'图片必须小于5MB' },
  // Feed page
  'feed.access_title': { en:'Feed Access Required', bn:'ফিড অ্যাক্সেস প্রয়োজন', ar:'يتطلب الوصول إلى المنشورات', ur:'فیڈ تک رسائی درکار ہے', es:'Acceso al Feed Requerido', ja:'フィードへのアクセスが必要です', zh:'需要动态访问权限' },
  'feed.access_desc':  { en:'Sign in to view posts and join the conversation.', bn:'পোস্ট দেখতে ও কথোপকথনে যোগ দিতে সাইন ইন করুন।', ar:'سجّل الدخول لعرض المنشورات والانضمام للمحادثة.', ur:'پوسٹس دیکھنے اور گفتگو میں شامل ہونے کے لیے سائن ان کریں۔', es:'Inicia sesión para ver publicaciones y unirte a la conversación.', ja:'投稿を見て対話に参加するにはログインしてください。', zh:'登录以查看帖子并加入对话。' },
  'feed.title':        { en:'Community', bn:'কমিউনিটি', ar:'المجتمع', ur:'کمیونٹی', es:'Comunidad', ja:'コミュニティ', zh:'社区' },
  'feed.subtitle':     { en:'Follow the discourse, react, and share your thoughts.', bn:'আলোচনা অনুসরণ করুন, প্রতিক্রিয়া দিন এবং আপনার মতামত শেয়ার করুন।', ar:'تابع الخطاب، تفاعل، وشارك أفكارك.', ur:'گفتگو کی پیروی کریں، ردعمل دیں، اور اپنے خیالات شیئر کریں۔', es:'Sigue el discurso, reacciona y comparte tus pensamientos.', ja:'対話を追いかけ、反応し、考えを共有しましょう。', zh:'关注讨论，做出反应，分享您的想法。' },
  'feed.placeholder':  { en:'Share your thoughts with the community...', bn:'কমিউনিটির সাথে আপনার মতামত শেয়ার করুন...', ar:'شارك أفكارك مع المجتمع...', ur:'کمیونٹی کے ساتھ اپنے خیالات شیئر کریں...', es:'Comparte tus pensamientos con la comunidad...', ja:'コミュニティとあなたの考えを共有...', zh:'与社区分享您的想法...' },
  'feed.add_image':    { en:'Add Image', bn:'ছবি যোগ করুন', ar:'إضافة صورة', ur:'تصویر شامل کریں', es:'Añadir Imagen', ja:'画像を追加', zh:'添加图片' },
  'feed.empty_alt':    { en:'No posts yet. Stay tuned!', bn:'এখনও কোনো পোস্ট নেই। অপেক্ষা করুন!', ar:'لا توجد منشورات بعد. ترقبوا!', ur:'ابھی تک کوئی پوسٹ نہیں۔ انتظار کریں!', es:'Aún no hay publicaciones. ¡Mantente atento!', ja:'まだ投稿がありません。お楽しみに！', zh:'暂无帖子。敬请期待！' },
  'feed.no_reactions': { en:'No reactions yet', bn:'এখনও কোনো প্রতিক্রিয়া নেই', ar:'لا توجد تفاعلات بعد', ur:'ابھی تک کوئی ردعمل نہیں', es:'Aún no hay reacciones', ja:'まだ反応がありません', zh:'暂无反应' },
  'feed.comment_ph':   { en:'Write a comment...', bn:'মন্তব্য লিখুন...', ar:'اكتب تعليقًا...', ur:'تبصرہ لکھیں...', es:'Escribe un comentario...', ja:'コメントを書く...', zh:'写评论...' },
  // Inbox page
  'inbox.signin_title':{ en:'Sign in Required', bn:'সাইন ইন প্রয়োজন', ar:'تسجيل الدخول مطلوب', ur:'سائن ان درکار ہے', es:'Inicio de Sesión Requerido', ja:'ログインが必要です', zh:'需要登录' },
  'inbox.signin_desc': { en:'Sign in to access your inbox.', bn:'ইনবক্স অ্যাক্সেস করতে সাইন ইন করুন।', ar:'سجّل الدخول للوصول إلى صندوق الوارد.', ur:'ان باکس تک رسائی کے لیے سائن ان کریں۔', es:'Inicia sesión para acceder a tu bandeja.', ja:'受信箱にアクセスするにはログインしてください。', zh:'登录以访问您的收件箱。' },
  'inbox.private':     { en:'Private Inbox', bn:'ব্যক্তিগত ইনবক্স', ar:'صندوق خاص', ur:'پرائیویٹ ان باکس', es:'Bandeja Privada', ja:'プライベート受信箱', zh:'私人收件箱' },
  'inbox.desc':        { en:'Send private messages directly to Hisham.', bn:'হিশামকে সরাসরি ব্যক্তিগত বার্তা পাঠান।', ar:'أرسل رسائل خاصة مباشرة إلى هشام.', ur:'ہشام کو براہ راست نجی پیغامات بھیجیں۔', es:'Envía mensajes privados directamente a Hisham.', ja:'ヒシャームに直接プライベートメッセージを送信。', zh:'直接向 Hisham 发送私人消息。' },
  'inbox.write_ph':    { en:'Write a private message...', bn:'একটি ব্যক্তিগত বার্তা লিখুন...', ar:'اكتب رسالة خاصة...', ur:'نجی پیغام لکھیں...', es:'Escribe un mensaje privado...', ja:'プライベートメッセージを書く...', zh:'写一条私人消息...' },
  'inbox.send':        { en:'Send', bn:'পাঠান', ar:'إرسال', ur:'بھیجیں', es:'Enviar', ja:'送信', zh:'发送' },
  'inbox.empty_alt':   { en:'No messages yet.', bn:'এখনও কোনো বার্তা নেই।', ar:'لا توجد رسائل بعد.', ur:'ابھی تک کوئی پیغام نہیں۔', es:'Aún no hay mensajes.', ja:'まだメッセージがありません。', zh:'暂无消息。' },


  // Nav links
  'nav.home': { en:'Home', bn:'হোম', ar:'الرئيسية', ur:'ہوم', es:'Inicio', ja:'ホーム', zh:'首页' },
  'nav.about': { en:'About', bn:'আমার সম্পর্কে', ar:'حول', ur:'میرے بارے میں', es:'Acerca', ja:'について', zh:'关于' },
  'nav.feed': { en:'Feed', bn:'ফিড', ar:'المنشورات', ur:'فیڈ', es:'Feed', ja:'フィード', zh:'动态' },
  'nav.chat': { en:'Chat', bn:'চ্যাট', ar:'المحادثة', ur:'چیٹ', es:'Chat', ja:'チャット', zh:'聊天' },
  'nav.inbox': { en:'Inbox', bn:'ইনবক্স', ar:'صندوق الوارد', ur:'ان باکس', es:'Bandeja', ja:'受信箱', zh:'收件箱' },
  'nav.admin': { en:'Admin', bn:'অ্যাডমিন', ar:'الإدارة', ur:'ایڈمن', es:'Admin', ja:'管理', zh:'管理' },
  // Settings page
  'settings.title': { en:'Settings', bn:'সেটিংস', ar:'الإعدادات', ur:'ترتیبات', es:'Ajustes', ja:'設定', zh:'设置' },
  'settings.subtitle': { en:'Manage your profile and account settings.', bn:'আপনার প্রোফাইল ও অ্যাকাউন্ট সেটিংস পরিচালনা করুন।', ar:'إدارة ملفك الشخصي وإعدادات الحساب.', ur:'اپنی پروفائل اور اکاؤنٹ کی ترتیبات کا نظم کریں۔', es:'Gestiona tu perfil y la configuración de tu cuenta.', ja:'プロフィールとアカウント設定を管理します。', zh:'管理您的个人资料和账户设置。' },
  'settings.remove_avatar': { en:'Remove Avatar', bn:'অবতার সরান', ar:'إزالة الصورة الرمزية', ur:'اوتار ہٹائیں', es:'Quitar Avatar', ja:'アバターを削除', zh:'移除头像' },
  'settings.no_pic': { en:'No profile picture', bn:'কোনো প্রোফাইল ছবি নেই', ar:'لا توجد صورة شخصية', ur:'کوئی پروفائل تصویر نہیں', es:'Sin foto de perfil', ja:'プロフィール写真がありません', zh:'没有个人资料照片' },
  'settings.google_imported': { en:'Google profile picture imported! Save Changes to persist.', bn:'গুগল প্রোফাইল ছবি আমদানি হয়েছে! সংরক্ষণ করতে Save Changes চাপুন।', ar:'تم استيراد صورة جوجل! احفظ التغييرات.', ur:'گوگل پروفائل تصویر درآمد ہو گئی! محفوظ کرنے کے لیے تبدیلیاں محفوظ کریں۔', es:'¡Foto de Google importada! Guarda los cambios.', ja:'Googleプロフィール写真をインポートしました！変更を保存してください。', zh:'已导入谷歌照片！请保存更改。' },
  'settings.use_google': { en:'Use Google Photo', bn:'গুগল ফটো ব্যবহার করুন', ar:'استخدم صورة جوجل', ur:'گوگل فوٹو استعمال کریں', es:'Usar Foto de Google', ja:'Google写真を使用', zh:'使用谷歌照片' },
  'settings.cover_photo': { en:'Cover Photo', bn:'কভার ফটো', ar:'صورة الغلاف', ur:'کور فوٹو', es:'Foto de Portada', ja:'カバー写真', zh:'封面照片' },
  'settings.no_cover': { en:'No cover photo uploaded', bn:'কোনো কভার ফটো আপলোড হয়নি', ar:'لم يتم رفع صورة الغلاف', ur:'کوئی کور فوٹو اپ لوڈ نہیں', es:'Sin foto de portada subida', ja:'カバー写真がアップロードされていません', zh:'未上传封面照片' },
  'settings.upload': { en:'Upload', bn:'আপলোড', ar:'رفع', ur:'اپ لوڈ', es:'Subir', ja:'アップロード', zh:'上传' },
  'settings.remove': { en:'Remove', bn:'সরান', ar:'إزالة', ur:'ہٹائیں', es:'Quitar', ja:'削除', zh:'移除' },
  'settings.username': { en:'Username', bn:'ব্যবহারকারীর নাম', ar:'اسم المستخدم', ur:'صارف نام', es:'Nombre de usuario', ja:'ユーザー名', zh:'用户名' },
  'settings.full_name': { en:'Full Name', bn:'পুরো নাম', ar:'الاسم الكامل', ur:'پورا نام', es:'Nombre completo', ja:'フルネーム', zh:'全名' },
  'settings.email': { en:'Email', bn:'ইমেইল', ar:'البريد الإلكتروني', ur:'ای میل', es:'Correo electrónico', ja:'メール', zh:'邮箱' },
  'settings.bio': { en:'Bio', bn:'বায়ো', ar:'نبذة', ur:'بائیو', es:'Biografía', ja:'自己紹介', zh:'简介' },
  'settings.bio_ph': { en:'Tell us about yourself...', bn:'নিজের সম্পর্কে বলুন...', ar:'أخبرنا عن نفسك...', ur:'اپنے بارے میں بتائیں...', es:'Cuéntanos sobre ti...', ja:'あなたについて教えてください...', zh:'介绍一下你自己...' },
  'settings.save_changes': { en:'Save Changes', bn:'পরিবর্তন সংরক্ষণ করুন', ar:'حفظ التغييرات', ur:'تبدیلیاں محفوظ کریں', es:'Guardar Cambios', ja:'変更を保存', zh:'保存更改' },
  'settings.change_password': { en:'Change Password', bn:'পাসওয়ার্ড পরিবর্তন', ar:'تغيير كلمة المرور', ur:'پاس ورڈ تبدیل کریں', es:'Cambiar Contraseña', ja:'パスワード変更', zh:'更改密码' },
  'settings.pw_desc': { en:'Secure your account by updating your password.', bn:'পাসওয়ার্ড আপডেট করে আপনার অ্যাকাউন্ট সুরক্ষিত করুন।', ar:'قم بتأمين حسابك بتحديث كلمة المرور.', ur:'پاس ورڈ اپ ڈیٹ کر کے اپنا اکاؤنٹ محفوظ بنائیں۔', es:'Asegura tu cuenta actualizando tu contraseña.', ja:'パスワードを更新してアカウントを保護します。', zh:'通过更新密码保护您的账户。' },
  'settings.new_password': { en:'New Password', bn:'নতুন পাসওয়ার্ড', ar:'كلمة مرور جديدة', ur:'نیا پاس ورڈ', es:'Nueva Contraseña', ja:'新しいパスワード', zh:'新密码' },
  'settings.pw_min_ph': { en:'Min 6 characters', bn:'সর্বনিম্ন ৬ অক্ষর', ar:'٦ أحرف على الأقل', ur:'کم از کم ۶ حروف', es:'Mínimo 6 caracteres', ja:'6文字以上', zh:'至少6个字符' },
  'settings.confirm_password': { en:'Confirm New Password', bn:'নতুন পাসওয়ার্ড নিশ্চিত করুন', ar:'تأكيد كلمة المرور الجديدة', ur:'نیا پاس ورڈ تصدیق کریں', es:'Confirmar Nueva Contraseña', ja:'新しいパスワードを確認', zh:'确认新密码' },
  'settings.reenter_ph': { en:'Re-enter new password', bn:'নতুন পাসওয়ার্ড আবার লিখুন', ar:'أعد إدخال كلمة المرور الجديدة', ur:'نیا پاس ورڈ دوبارہ درج کریں', es:'Vuelve a escribir la nueva contraseña', ja:'新しいパスワードを再入力', zh:'重新输入新密码' },
  'settings.update_password': { en:'Update Password', bn:'পাসওয়ার্ড আপডেট করুন', ar:'تحديث كلمة المرور', ur:'پاس ورڈ اپ ڈیٹ کریں', es:'Actualizar Contraseña', ja:'パスワードを更新', zh:'更新密码' },
  'settings.saved': { en:'Profile updated!', bn:'প্রোফাইল আপডেট হয়েছে!', ar:'تم تحديث الملف الشخصي!', ur:'پروفائل اپ ڈیٹ ہو گئی!', es:'¡Perfil actualizado!', ja:'プロフィールを更新しました！', zh:'个人资料已更新！' },
  'settings.save_failed': { en:'Failed to save', bn:'সংরক্ষণ ব্যর্থ হয়েছে', ar:'فشل الحفظ', ur:'محفوظ کرنا ناکام', es:'Error al guardar', ja:'保存に失敗しました', zh:'保存失败' },
  'settings.avatar_uploaded': { en:'Avatar uploaded', bn:'অবতার আপলোড হয়েছে', ar:'تم رفع الصورة الرمزية', ur:'اوتار اپ لوڈ ہو گیا', es:'Avatar subido', ja:'アバターをアップロードしました', zh:'头像已上传' },
  'settings.pw_updated': { en:'Password updated successfully!', bn:'পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!', ar:'تم تحديث كلمة المرور بنجاح!', ur:'پاس ورڈ کامیابی سے اپ ڈیٹ ہو گیا!', es:'¡Contraseña actualizada con éxito!', ja:'パスワードを更新しました！', zh:'密码更新成功！' },
  'settings.pw_failed': { en:'Failed to update password', bn:'পাসওয়ার্ড আপডেট ব্যর্থ হয়েছে', ar:'فشل تحديث كلمة المرور', ur:'پاس ورڈ اپ ڈیٹ ناکام', es:'Error al actualizar la contraseña', ja:'パスワードの更新に失敗しました', zh:'密码更新失败' },

  // Reset Password page
  'reset.verifying': { en:'Verifying session...', bn:'সেশন যাচাই করা হচ্ছে...', ar:'جارٍ التحقق من الجلسة...', ur:'سیشن کی تصدیق ہو رہی ہے...', es:'Verificando sesión...', ja:'セッションを確認中...', zh:'正在验证会话...' },
  'reset.invalid': { en:'Invalid or Expired Link', bn:'অবৈধ বা মেয়াদোত্তীর্ণ লিংক', ar:'رابط غير صالح أو منتهي', ur:'نادرست یا میعاد ختم شدہ لنک', es:'Enlace Inválido o Expirado', ja:'無効または期限切れのリンク', zh:'无效或过期的链接' },
  'reset.title': { en:'Reset Password', bn:'পাসওয়ার্ড রিসেট', ar:'إعادة تعيين كلمة المرور', ur:'پاسورڈ ری سیٹ', es:'Restablecer Contraseña', ja:'パスワードリセット', zh:'重置密码' },
  'reset.subtitle': { en:'Please set your new password below.', bn:'নিচে আপনার নতুন পাসওয়ার্ড সেট করুন।', ar:'يرجى تعيين كلمة المرور الجديدة أدناه.', ur:'براہ کرم نیچے اپنا نیا پاس ورڈ سیٹ کریں۔', es:'Establece tu nueva contraseña a continuación.', ja:'以下に新しいパスワードを設定してください。', zh:'请在下方设置您的新密码。' },
  'reset.confirm_ph': { en:'Confirm your new password', bn:'নতুন পাসওয়ার্ড নিশ্চিত করুন', ar:'تأكيد كلمة المرور الجديدة', ur:'نئے پاس ورڈ کی تصدیق کریں', es:'Confirma tu nueva contraseña', ja:'新しいパスワードを確認', zh:'确认您的新密码' },
  'reset.signed_in': { en:'You must be signed in to reset your password.', bn:'পাসওয়ার্ড রিসেট করতে সাইন ইন থাকতে হবে।', ar:'يجب تسجيل الدخول لإعادة تعيين كلمة المرور.', ur:'پاس ورڈ ری سیٹ کرنے کے لیے سائن ان ہونا ضروری ہے۔', es:'Debes iniciar sesión para restablecer tu contraseña.', ja:'パスワードをリセットするにはログインが必要です。', zh:'您必须登录才能重置密码。' },
  'reset.pw_short': { en:'Password must be at least 6 characters', bn:'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', ar:'يجب أن تكون كلمة المرور ٦ أحرف على الأقل', ur:'پاس ورڈ کم از کم ۶ حروف کا ہونا چاہیے', es:'La contraseña debe tener al menos 6 caracteres', ja:'パスワードは6文字以上必要です', zh:'密码至少需要6个字符' },
  'reset.pw_mismatch': { en:'Passwords do not match', bn:'পাসওয়ার্ড মিলছে না', ar:'كلمات المرور غير متطابقة', ur:'پاس ورڈ مماثل نہیں', es:'Las contraseñas no coinciden', ja:'パスワードが一致しません', zh:'密码不匹配' },
  // Admin dashboard
  'admin.denied': { en:'Access Denied', bn:'প্রবেশাধিকার নেই', ar:'تم رفض الوصول', ur:'رسائی سے انکار', es:'Acceso Denegado', ja:'アクセス拒否', zh:'访问被拒绝' },
  'admin.title': { en:'Admin Dashboard', bn:'অ্যাডমিন ড্যাশবোর্ড', ar:'لوحة الإدارة', ur:'ایڈمن ڈیش بورڈ', es:'Panel de Administración', ja:'管理ダッシュボード', zh:'管理仪表板' },
  'admin.subtitle': { en:'Manage your platform', bn:'আপনার প্ল্যাটফর্ম পরিচালনা করুন', ar:'إدارة منصتك', ur:'اپنا پلیٹ فارم چلائیں', es:'Gestiona tu plataforma', ja:'プラットフォームを管理', zh:'管理您的平台' },
  'admin.no_msgs': { en:'No private messages.', bn:'কোনো ব্যক্তিগত বার্তা নেই।', ar:'لا توجد رسائل خاصة.', ur:'کوئی نجی پیغام نہیں۔', es:'No hay mensajes privados.', ja:'プライベートメッセージはありません。', zh:'暂无私人消息。' },
  'admin.your_reply': { en:'Your Reply', bn:'আপনার উত্তর', ar:'ردّك', ur:'آپ کا جواب', es:'Tu Respuesta', ja:'あなたの返信', zh:'您的回复' },
  'admin.reply_ph': { en:'Type a reply...', bn:'একটি উত্তর লিখুন...', ar:'اكتب ردًا...', ur:'جواب لکھیں...', es:'Escribe una respuesta...', ja:'返信を入力...', zh:'输入回复...' },
  'admin.delete': { en:'Delete message', bn:'বার্তা মুছুন', ar:'حذف الرسالة', ur:'پیغام حذف کریں', es:'Eliminar mensaje', ja:'メッセージを削除', zh:'删除消息' },
  'admin.reply_sent': { en:'Reply sent', bn:'উত্তর পাঠানো হয়েছে', ar:'تم إرسال الرد', ur:'جواب بھیج دیا گیا', es:'Respuesta enviada', ja:'返信を送信しました', zh:'回复已发送' },
  'admin.reply_fail': { en:'Failed to reply', bn:'উত্তর পাঠানো ব্যর্থ', ar:'فشل الرد', ur:'جواب دینے میں ناکامی', es:'Error al responder', ja:'返信に失敗しました', zh:'回复失败' },
  'admin.deleted': { en:'Deleted', bn:'মুছে ফেলা হয়েছে', ar:'تم الحذف', ur:'حذف کر دیا گیا', es:'Eliminado', ja:'削除しました', zh:'已删除' },
  // Post detail
  'post.signin_t': { en:'Sign in to view this post', bn:'এই পোস্ট দেখতে সাইন ইন করুন', ar:'سجّل الدخول لعرض هذا المنشور', ur:'اس پوسٹ کو دیکھنے کے لیے سائن ان کریں', es:'Inicia sesión para ver esta publicación', ja:'この投稿を見るにはログイン', zh:'登录以查看此帖子' },
  'post.signin_d': { en:'You need to be signed in to view posts.', bn:'পোস্ট দেখতে সাইন ইন থাকা প্রয়োজন।', ar:'يجب تسجيل الدخول لعرض المنشورات.', ur:'پوسٹس دیکھنے کے لیے سائن ان ہونا ضروری ہے۔', es:'Necesitas iniciar sesión para ver publicaciones.', ja:'投稿を見るにはログインが必要です。', zh:'您需要登录才能查看帖子。' },
  'post.not_found': { en:'Post not found.', bn:'পোস্ট পাওয়া যায়নি।', ar:'المنشور غير موجود.', ur:'پوسٹ نہیں ملی۔', es:'Publicación no encontrada.', ja:'投稿が見つかりません。', zh:'未找到帖子。' },
  'post.author': { en:'Author', bn:'লেখক', ar:'المؤلف', ur:'مصنف', es:'Autor', ja:'著者', zh:'作者' },
  'post.no_comments': { en:'No comments yet. Be the first!', bn:'এখনও কোনো মন্তব্য নেই। প্রথম হোন!', ar:'لا توجد تعليقات بعد. كن الأول!', ur:'ابھی تک کوئی تبصرہ نہیں۔ پہلے بنیں!', es:'Aún no hay comentarios. ¡Sé el primero!', ja:'まだコメントがありません。最初にどうぞ！', zh:'暂无评论。成为第一个！' },
  'post.send_cmt': { en:'Send comment', bn:'মন্তব্য পাঠান', ar:'إرسال تعليق', ur:'تبصرہ بھیجیں', es:'Enviar comentario', ja:'コメントを送信', zh:'发送评论' },
  'post.cmt_fail': { en:'Failed to post comment', bn:'মন্তব্য পোস্ট করা ব্যর্থ', ar:'فشل نشر التعليق', ur:'تبصرہ پوسٹ کرنے میں ناکامی', es:'Error al publicar comentario', ja:'コメントの投稿に失敗しました', zh:'发表评论失败' },
  'post.link_copied': { en:'Link copied!', bn:'লিংক কপি হয়েছে!', ar:'تم نسخ الرابط!', ur:'لنک کاپی ہو گیا!', es:'¡Enlace copiado!', ja:'リンクをコピーしました！', zh:'链接已复制！' },
  'post.copy_fail': { en:'Failed to copy link', bn:'লিংক কপি করা ব্যর্থ', ar:'فشل نسخ الرابط', ur:'لنک کاپی کرنے میں ناکامی', es:'Error al copiar el enlace', ja:'リンクのコピーに失敗しました', zh:'复制链接失败' },
  // Chat extra
  'chat.reactions': { en:'Reactions', bn:'প্রতিক্রিয়া', ar:'التفاعلات', ur:'ردعمل', es:'Reacciones', ja:'リアクション', zh:'反应' },
  'chat.actions': { en:'Actions', bn:'কাজসমূহ', ar:'الإجراءات', ur:'اعمال', es:'Acciones', ja:'操作', zh:'操作' },
  'chat.sent_label': { en:'Sent', bn:'পাঠানো হয়েছে', ar:'أُرسل', ur:'بھیج دیا گیا', es:'Enviado', ja:'送信済み', zh:'已发送' },
  'chat.no_receipts': { en:'No read receipts yet', bn:'এখনও কোনো রিড রিসিট নেই', ar:'لا توجد إيصالات قراءة بعد', ur:'ابھی تک کوئی ریڈ رسید نہیں', es:'Aún no hay confirmaciones de lectura', ja:'まだ既読がありません', zh:'暂无已读回执' },
  'chat.close_reply': { en:'Close reply', bn:'উত্তর বন্ধ করুন', ar:'إغلاق الرد', ur:'جواب بند کریں', es:'Cerrar respuesta', ja:'返信を閉じる', zh:'关闭回复' },
  'chat.remove_img': { en:'Remove image', bn:'ছবি সরান', ar:'إزالة الصورة', ur:'تصویر ہٹائیں', es:'Quitar imagen', ja:'画像を削除', zh:'移除图片' },
  'chat.upload_img': { en:'Upload image', bn:'ছবি আপলোড', ar:'رفع صورة', ur:'تصویر اپ لوڈ کریں', es:'Subir imagen', ja:'画像をアップロード', zh:'上传图片' },
  'chat.send_msg': { en:'Send message', bn:'বার্তা পাঠান', ar:'إرسال رسالة', ur:'پیغام بھیجیں', es:'Enviar mensaje', ja:'メッセージを送信', zh:'发送消息' },
  'chat.reply': { en:'Reply', bn:'উত্তর দিন', ar:'رد', ur:'جواب', es:'Responder', ja:'返信', zh:'回复' },
  'chat.react': { en:'React', bn:'প্রতিক্রিয়া দিন', ar:'تفاعل', ur:'ردعمل دیں', es:'Reaccionar', ja:'リアクション', zh:'做出反应' },
  // Feed extra
  'feed.delete': { en:'Delete', bn:'মুছুন', ar:'حذف', ur:'حذف کریں', es:'Eliminar', ja:'削除', zh:'删除' },
  'feed.published': { en:'Post published!', bn:'পোস্ট প্রকাশিত হয়েছে!', ar:'تم نشر المنشور!', ur:'پوسٹ شائع ہو گئی!', es:'¡Publicación publicada!', ja:'投稿を公開しました！', zh:'帖子已发布！' },
  'feed.deleted': { en:'Post deleted', bn:'পোস্ট মুছে ফেলা হয়েছে', ar:'تم حذف المنشور', ur:'پوسٹ حذف ہو گئی', es:'Publicación eliminada', ja:'投稿を削除しました', zh:'帖子已删除' },
  'feed.link_copied': { en:'Post link copied!', bn:'পোস্ট লিংক কপি হয়েছে!', ar:'تم نسخ رابط المنشور!', ur:'پوسٹ لنک کاپی ہو گیا!', es:'¡Enlace de publicación copiado!', ja:'投稿リンクをコピーしました！', zh:'帖子链接已复制！' },
  // Inbox extra
  'inbox.replied': { en:'Replied', bn:'উত্তর দেওয়া হয়েছে', ar:'تم الرد', ur:'جواب دیا گیا', es:'Respondido', ja:'返信済み', zh:'已回复' },
  'inbox.awaiting': { en:'Awaiting reply', bn:'উত্তরের অপেক্ষায়', ar:'بانتظار الرد', ur:'جواب کا انتظار', es:'Esperando respuesta', ja:'返信待ち', zh:'等待回复' },
  'inbox.reply': { en:'Reply', bn:'উত্তর দিন', ar:'رد', ur:'جواب', es:'Responder', ja:'返信', zh:'回复' },
  'inbox.sent_toast': { en:'Message sent to Hisham!', bn:'হিশামকে বার্তা পাঠানো হয়েছে!', ar:'تم إرسال الرسالة إلى هشام!', ur:'ہشام کو پیغام بھیج دیا گیا!', es:'¡Mensaje enviado a Hisham!', ja:'ヒシャームにメッセージを送信しました！', zh:'消息已发送给 Hisham！' },
  'inbox.email_new': { en:'New Message Received', bn:'নতুন বার্তা এসেছে', ar:'تم استلام رسالة جديدة', ur:'نیا پیغام موصول ہوا', es:'Nuevo Mensaje Recibido', ja:'新しいメッセージを受信', zh:'收到新消息' },
  'inbox.email_sender': { en:'Sender:', bn:'প্রেরক:', ar:'المرسل:', ur:'مرسل:', es:'Remitente:', ja:'送信者:', zh:'发件人：' },
  'inbox.email_msg': { en:'Message:', bn:'বার্তা:', ar:'الرسالة:', ur:'پیغام:', es:'Mensaje:', ja:'メッセージ:', zh:'消息：' },
  'inbox.email_login': { en:'Login to your', bn:'আপনার', ar:'سجّل الدخول إلى', ur:'اپنے میں لاگ ان کریں', es:'Inicia sesión en tu', ja:'にログイン', zh:'登录您的' },
  'inbox.email_admin': { en:'Admin Dashboard', bn:'অ্যাডমিন ড্যাশবোর্ড', ar:'لوحة الإدارة', ur:'ایڈمن ڈیش بورڈ', es:'Panel de Administración', ja:'管理ダッシュボード', zh:'管理仪表板' },
  'inbox.email_reply': { en:'to reply.', bn:'উত্তর দিতে।', ar:'للرد.', ur:'جواب دینے کے لیے۔', es:'para responder.', ja:'返信するには。', zh:'以回复。' },
  // Settings extra
  'settings.max2mb': { en:'Max 2MB', bn:'সর্বোচ্চ ২ এমবি', ar:'بحد أقصى ٢ ميجابايت', ur:'زیادہ سے زیادہ ۲ ایم بی', es:'Máximo 2MB', ja:'最大2MB', zh:'最大2MB' },
  'settings.upload_fail': { en:'Upload failed', bn:'আপলোড ব্যর্থ', ar:'فشل الرفع', ur:'اپ لوڈ ناکام', es:'Error al subir', ja:'アップロードに失敗しました', zh:'上传失败' },
  'settings.max5mb': { en:'Max 5MB', bn:'সর্বোচ্চ ৫ এমবি', ar:'بحد أقصى ٥ ميجابايت', ur:'زیادہ سے زیادہ ۵ ایم بی', es:'Máximo 5MB', ja:'最大5MB', zh:'最大5MB' },
  'settings.cover_up': { en:'Cover uploaded', bn:'কভার আপলোড হয়েছে', ar:'تم رفع الغلاف', ur:'کور اپ لوڈ ہو گیا', es:'Portada subida', ja:'カバーをアップロードしました', zh:'封面已上传' },
  // Auth extra
  'auth.close_modal': { en:'Close modal', bn:'মোডাল বন্ধ করুন', ar:'إغلاق النافذة', ur:'موڈل بند کریں', es:'Cerrar ventana', ja:'モーダルを閉じる', zh:'关闭弹窗' },
  'auth.welcome_toast': { en:'Welcome back!', bn:'আবার স্বাগতম!', ar:'مرحبًا بعودتك!', ur:'خوش آمدید!', es:'¡Bienvenido de nuevo!', ja:'おかえりなさい！', zh:'欢迎回来！' },
  // Home extra
  'home.start_convo': { en:'Start a Conversation', bn:'কথোপকথন শুরু করুন', ar:'ابدأ محادثة', ur:'گفتگو شروع کریں', es:'Inicia una Conversación', ja:'会話を始める', zh:'开始对话' },
  'home.email_copied': { en:'Email copied', bn:'ইমেইল কপি হয়েছে', ar:'تم نسخ البريد', ur:'ای میل کاپی ہو گیا', es:'Correo copiado', ja:'メールをコピーしました', zh:'邮箱已复制' },
  'home.copy_fail': { en:'Failed to copy', bn:'কপি করা ব্যর্থ', ar:'فشل النسخ', ur:'کاپی کرنے میں ناکامی', es:'Error al copiar', ja:'コピーに失敗しました', zh:'复制失败' },
  // Nav extra
  'nav.mark_read': { en:'Mark all read', bn:'সব পড়া হয়েছে চিহ্নিত করুন', ar:'تحديد الكل كمقروء', ur:'سب کو پڑھا ہوا نشان زد کریں', es:'Marcar todo como leído', ja:'すべて既読にする', zh:'全部标为已读' },
  'nav.clear_all': { en:'Clear all', bn:'সব মুছুন', ar:'مسح الكل', ur:'سب صاف کریں', es:'Borrar todo', ja:'すべてクリア', zh:'全部清除' },
  // Misc
  'misc.back_top': { en:'Back to top', bn:'উপরে ফিরে যান', ar:'العودة إلى الأعلى', ur:'اوپر جائیں', es:'Volver arriba', ja:'トップに戻る', zh:'返回顶部' },
  'misc.switch_lang': { en:'Switch language', bn:'ভাষা পরিবর্তন করুন', ar:'تغيير اللغة', ur:'زبان تبدیل کریں', es:'Cambiar idioma', ja:'言語を切り替える', zh:'切换语言' },
  'misc.verified': { en:'Verified', bn:'ভেরিফাইড', ar:'موثّق', ur:'تصدیق شدہ', es:'Verificado', ja:'認証済み', zh:'已认证' },
  'misc.load_settings': { en:'Loading settings...', bn:'সেটিংস লোড হচ্ছে...', ar:'جارٍ تحميل الإعدادات...', ur:'ترتیبات لوڈ ہو رہی ہیں...', es:'Cargando ajustes...', ja:'設定を読み込み中...', zh:'正在加载设置...' },
  // Privacy policy
  'priv.title': { en:'Privacy Policy', bn:'গোপনীয়তা নীতি', ar:'سياسة الخصوصية', ur:'رازداری کی پالیسی', es:'Política de Privacidad', ja:'プライバシーポリシー', zh:'隐私政策' },
  'priv.last_upd': { en:'Last updated:', bn:'সর্বশেষ আপডেট:', ar:'آخر تحديث:', ur:'آخری اپ ڈیٹ:', es:'Última actualización:', ja:'最終更新:', zh:'最后更新：' },
  'priv.s1_t': { en:'1. Information We Collect', bn:'১. আমরা যে তথ্য সংগ্রহ করি', ar:'١. المعلومات التي نجمعها', ur:'۱. ہم جو معلومات جمع کرتے ہیں', es:'1. Información que Recopilamos', ja:'1. 収集する情報', zh:'1. 我们收集的信息' },
  'priv.s1_b': { en:'While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This includes:', bn:'আমাদের সেবা ব্যবহারের সময় আমরা আপনার কাছ থেকে কিছু ব্যক্তিগত শনাক্তকরণ তথ্য চাইতে পারি যা আপনাকে যোগাযোগ বা শনাক্ত করতে ব্যবহৃত হতে পারে। এর মধ্যে রয়েছে:', ar:'أثناء استخدام خدمتنا، قد نطلب منك تقديم بعض المعلومات الشخصية التي يمكن استخدامها للتواصل معك أو التعرف عليك. يشمل ذلك:', ur:'ہماری سروس استعمال کرتے وقت، ہم آپ سے کچھ ذاتی شناختی معلومات فراہم کرنے کے لیے کہہ سکتے ہیں جو آپ سے رابطہ یا شناخت کے لیے استعمال ہو سکتی ہیں۔ اس میں شامل ہیں:', es:'Al usar nuestro Servicio, podemos pedirte cierta información personal identificable que pueda usarse para contactarte o identificarte. Esto incluye:', ja:'本サービス利用中、連絡や本人確認に使用できる個人情報の提供をお願いする場合があります。これには以下が含まれます：', zh:'在使用我们的服务时，我们可能会要求您提供某些可用于联系或识别您的个人信息。包括：' },
  'priv.s1_l1': { en:'Email address', bn:'ইমেইল ঠিকানা', ar:'البريد الإلكتروني', ur:'ای میل ایڈریس', es:'Correo electrónico', ja:'メールアドレス', zh:'电子邮件地址' },
  'priv.s1_l2': { en:'First name and last name', bn:'নামের প্রথম ও শেষ অংশ', ar:'الاسم الأول واسم العائلة', ur:'پہلا اور آخری نام', es:'Nombre y apellido', ja:'氏名', zh:'名字和姓氏' },
  'priv.s1_l3': { en:'Profile data (when signing in via Google/GitHub)', bn:'প্রোফাইল ডেটা (গুগল/গিটহাব দিয়ে সাইন ইন করলে)', ar:'بيانات الملف (عند تسجيل الدخول عبر جوجل/جيت هاب)', ur:'پروفائل ڈیٹا (گوگل/گٹ ہب کے ذریعے سائن ان کرتے وقت)', es:'Datos de perfil (al iniciar sesión con Google/GitHub)', ja:'プロフィールデータ（Google/GitHubでログイン時）', zh:'个人资料数据（通过 Google/GitHub 登录时）' },
  'priv.s1_l4': { en:'Usage Data (analytics)', bn:'ব্যবহারের ডেটা (অ্যানালিটিক্স)', ar:'بيانات الاستخدام (تحليلات)', ur:'استعمال کا ڈیٹا (تجزیات)', es:'Datos de uso (analíticas)', ja:'利用データ（分析）', zh:'使用数据（分析）' },
  'priv.s2_t': { en:'2. How We Use Your Data', bn:'২. আমরা আপনার ডেটা কীভাবে ব্যবহার করি', ar:'٢. كيف نستخدم بياناتك', ur:'۲. ہم آپ کا ڈیٹا کیسے استعمال کرتے ہیں', es:'2. Cómo Usamos tus Datos', ja:'2. データの利用目的', zh:'2. 我们如何使用您的数据' },
  'priv.s2_b': { en:'We use the collected data for various purposes:', bn:'সংগৃহীত ডেটা আমরা বিভিন্ন উদ্দেশ্যে ব্যবহার করি:', ar:'نستخدم البيانات المجمعة لأغراض متعددة:', ur:'ہم جمع شدہ ڈیٹا مختلف مقاصد کے لیے استعمال کرتے ہیں:', es:'Usamos los datos recopilados para varios propósitos:', ja:'収集したデータは様々な目的で使用します：', zh:'我们将收集的数据用于多种目的：' },
  'priv.s2_l1': { en:'To provide and maintain our Service', bn:'আমাদের সেবা প্রদান ও রক্ষণাবেক্ষণ করতে', ar:'لتقديم خدمتنا والحفاظ عليها', ur:'ہماری سروس فراہم اور برقرار رکھنے کے لیے', es:'Para proporcionar y mantener nuestro Servicio', ja:'サービスの提供と維持のため', zh:'提供和维护我们的服务' },
  'priv.s2_l2': { en:'To notify you about changes to our Service', bn:'সেবার পরিবর্তন সম্পর্কে আপনাকে জানাতে', ar:'لإعلامك بالتغييرات في خدمتنا', ur:'ہماری سروس میں تبدیلیوں کے بارے میں آگاہ کرنے کے لیے', es:'Para notificarte sobre cambios en nuestro Servicio', ja:'サービスの変更をお知らせするため', zh:'通知您服务的变更' },
  'priv.s2_l3': { en:'To allow you to participate in interactive features (like Chat and Feed)', bn:'ইন্টারঅ্যাকটিভ ফিচারে অংশ নিতে দিতে (যেমন চ্যাট ও ফিড)', ar:'لتمكينك من المشاركة في الميزات التفاعلية (مثل المحادثة والمنشورات)', ur:'انٹرایکٹو خصوصیات میں حصہ لینے کی اجازت دینے کے لیے (جیسے چیٹ اور فیڈ)', es:'Para permitirte participar en funciones interactivas (como Chat y Feed)', ja:'チャットやフィードなどの対話機能への参加を可能にするため', zh:'允许您参与互动功能（如聊天和动态）' },
  'priv.s2_l4': { en:'To provide customer support', bn:'গ্রাহক সহায়তা প্রদান করতে', ar:'لتقديم دعم العملاء', ur:'کسٹمر سپورٹ فراہم کرنے کے لیے', es:'Para proporcionar soporte al cliente', ja:'カスタマーサポートの提供のため', zh:'提供客户支持' },
  'priv.s2_l5': { en:'To monitor the usage of our Service (e.g., Vercel Speed Insights)', bn:'সেবার ব্যবহার পর্যবেক্ষণ করতে (যেমন Vercel Speed Insights)', ar:'لمراقبة استخدام خدمتنا (مثل Vercel Speed Insights)', ur:'ہماری سروس کے استعمال کی نگرانی کے لیے (مثلاً Vercel Speed Insights)', es:'Para monitorear el uso de nuestro Servicio (p. ej., Vercel Speed Insights)', ja:'サービスの利用状況の監視のため（例：Vercel Speed Insights）', zh:'监控我们服务的使用情况（例如 Vercel Speed Insights）' },
  'priv.s3_t': { en:'3. Third-Party Services', bn:'৩. থার্ড-পার্টি সার্ভিস', ar:'٣. خدمات الطرف الثالث', ur:'۳. تیسرے فریق کی خدمات', es:'3. Servicios de Terceros', ja:'3. 第三者サービス', zh:'3. 第三方服务' },
  'priv.s3_b': { en:'We use third-party services to facilitate our platform, including Supabase (for database and authentication), Vercel (for hosting and analytics), and OAuth providers (Google, GitHub). These third parties have access to your Personal Data only to perform these tasks on our behalf.', bn:'আমরা আমাদের প্ল্যাটফর্ম পরিচালনার জন্য থার্ড-পার্টি সার্ভিস ব্যবহার করি, যার মধ্যে রয়েছে Supabase (ডেটাবেস ও অথেনটিকেশনের জন্য), Vercel (হোস্টিং ও অ্যানালিটিক্সের জন্য), এবং OAuth প্রদানকারী (গুগল, গিটহাব)। এই তৃতীয় পক্ষগুলো শুধুমাত্র আমাদের পক্ষে এই কাজগুলো করার জন্যই আপনার ব্যক্তিগত ডেটায় প্রবেশাধিকার পায়।', ar:'نستخدم خدمات طرف ثالث لتشغيل منصتنا، بما في ذلك Supabase (لقواعد البيانات والمصادقة) وVercel (للاستضافة والتحليلات) وموفري OAuth (جوجل، جيت هاب). لا يمكن لهذه الأطراف الوصول إلى بياناتك الشخصية إلا لأداء هذه المهام نيابة عنا.', ur:'ہم اپنے پلیٹ فارم کو چلانے کے لیے تیسرے فریق کی خدمات استعمال کرتے ہیں، بشمول Supabase (ڈیٹا بیس اور تصدیق کے لیے)، Vercel (ہوسٹنگ اور تجزیات کے لیے)، اور OAuth فراہم کنندگان (گوگل، گٹ ہب)۔ یہ فریقین صرف ہماری طرف سے یہ کام انجام دینے کے لیے آپ کے ذاتی ڈیٹا تک رسائی حاصل کرتے ہیں۔', es:'Usamos servicios de terceros para facilitar nuestra plataforma, incluyendo Supabase (para base de datos y autenticación), Vercel (para hosting y analíticas) y proveedores OAuth (Google, GitHub). Estos terceros acceden a tus Datos Personales solo para realizar estas tareas en nuestro nombre.', ja:'プラットフォーム運営のため、Supabase（データベース・認証）、Vercel（ホスティング・分析）、OAuthプロバイダー（Google、GitHub）などの第三者サービスを利用しています。これらの第三者による個人データへのアクセスは、当社に代わってこれらのタスクを実行する場合に限られます。', zh:'我们使用第三方服务来运营平台，包括 Supabase（用于数据库和身份验证）、Vercel（用于托管和分析）以及 OAuth 提供商（Google、GitHub）。这些第三方仅在代表我们执行这些任务时才能访问您的个人数据。' },
  'priv.s4_t': { en:'4. Security of Data', bn:'৪. ডেটার নিরাপত্তা', ar:'٤. أمان البيانات', ur:'۴. ڈیٹا کی حفاظت', es:'4. Seguridad de los Datos', ja:'4. データのセキュリティ', zh:'4. 数据安全' },
  'priv.s4_b': { en:'The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. We strive to use commercially acceptable means to protect your Personal Data.', bn:'আপনার ডেটার নিরাপত্তা আমাদের কাছে গুরুত্বপূর্ণ, তবে মনে রাখবেন ইন্টারনেটে তথ্য প্রেরণের কোনো পদ্ধতি বা ইলেকট্রনিক স্টোরেজের কোনো পদ্ধতি ১০০% নিরাপদ নয়। আমরা আপনার ব্যক্তিগত ডেটা রক্ষায় বাণিজ্যিকভাবে গ্রহণযোগ্য উপায় ব্যবহারের চেষ্টা করি।', ar:'أمان بياناتك مهم بالنسبة لنا، لكن تذكر أنه لا توجد طريقة نقل عبر الإنترنت أو تخزين إلكتروني آمنة 100%. نسعى لاستخدام وسائل مقبولة تجاريًا لحماية بياناتك الشخصية.', ur:'آپ کے ڈیٹا کی حفاظت ہمارے لیے اہم ہے، لیکن یاد رکھیں کہ انٹرنیٹ پر منتقلی کا کوئی طریقہ یا الیکٹرانک ذخیرہ کرنے کا کوئی طریقہ ۱۰۰٪ محفوظ نہیں ہے۔ ہم آپ کے ذاتی ڈیٹا کی حفاظت کے لیے تجارتی طور پر قابل قبول ذرائع استعمال کرنے کی کوشش کرتے ہیں۔', es:'La seguridad de tus datos es importante para nosotros, pero recuerda que ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro. Nos esforzamos por usar medios comercialmente aceptables para proteger tus Datos Personales.', ja:'データのセキュリティは重要ですが、インターネット上の送信方法や電子的保存方法が100%安全であることはありません。個人データの保護には商業的に妥当な手段を用いるよう努めています。', zh:'您的数据安全对我们很重要，但请记住，互联网上的任何传输方式或电子存储方式都不是 100% 安全的。我们努力使用商业上可接受的方式来保护您的个人数据。' },
  'priv.s5_t': { en:'5. Cookies and Tracking', bn:'৫. কুকিজ ও ট্র্যাকিং', ar:'٥. ملفات تعريف الارتباط والتتبع', ur:'۵. کوکیز اور ٹریکنگ', es:'5. Cookies y Rastreo', ja:'5. クッキーとトラッキング', zh:'5. Cookie 与跟踪' },
  'priv.s5_b': { en:'We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.', bn:'আমরা আমাদের সেবার কার্যকলাপ ট্র্যাক করতে এবং নির্দিষ্ট তথ্য ধরে রাখতে কুকিজ ও অনুরূপ ট্র্যাকিং প্রযুক্তি ব্যবহার করি। আপনি আপনার ব্রাউজারকে সব কুকি প্রত্যাখ্যান করতে বা কুকি পাঠানোর সময় জানাতে নির্দেশ দিতে পারেন।', ar:'نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتتبع النشاط على خدمتنا والاحتفاظ بمعلومات معينة. يمكنك توجيه متصفحك لرفض جميع ملفات تعريف الارتباط أو الإشارة عند إرسال ملف تعريف الارتباط.', ur:'ہم اپنی سروس پر سرگرمی کو ٹریک کرنے اور مخصوص معلومات رکھنے کے لیے کوکیز اور اسی طرح کی ٹریکنگ ٹیکنالوجیز استعمال کرتے ہیں۔ آپ اپنے براؤزر کو تمام کوکیز مسترد کرنے یا کوکی بھیجے جانے پر اشارہ کرنے کی ہدایت دے سکتے ہیں۔', es:'Usamos cookies y tecnologías de rastreo similares para monitorear la actividad en nuestro Servicio y retener cierta información. Puedes indicarle a tu navegador que rechace todas las cookies o que avise cuando se envíe una.', ja:'当サービスでは、活動の追跡と特定情報の保持にクッキーや類似の追跡技術を使用しています。ブラウザで全クッキーを拒否したり、クッキー送信時に通知するよう設定できます。', zh:'我们使用 Cookie 和类似的跟踪技术来跟踪我们服务的活动并保留某些信息。您可以指示浏览器拒绝所有 Cookie，或在发送 Cookie 时提示。' },
  'priv.s6_t': { en:'6. Contact Us', bn:'৬. আমাদের সাথে যোগাযোগ', ar:'٦. تواصل معنا', ur:'۶. ہم سے رابطہ کریں', es:'6. Contáctanos', ja:'6. お問い合わせ', zh:'6. 联系我们' },
  'priv.s6_b': { en:'If you have any questions about this Privacy Policy, please contact the administrator via the platform.', bn:'এই গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন থাকলে প্ল্যাটফর্মের মাধ্যমে অ্যাডমিনিস্ট্রেটরের সাথে যোগাযোগ করুন।', ar:'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل مع المسؤول عبر المنصة.', ur:'اس رازداری کی پالیسی کے بارے میں کوئی سوال ہو تو براہ کرم پلیٹ فارم کے ذریعے منتظم سے رابطہ کریں۔', es:'Si tienes preguntas sobre esta Política de Privacidad, contacta al administrador a través de la plataforma.', ja:'このプライバシーポリシーについてご質問がある場合は、プラットフォームから管理者にお問い合わせください。', zh:'如果您对本隐私政策有任何疑问，请通过平台联系管理员。' },
  // Terms of Service
  'terms.title': { en:'Terms of Service', bn:'পরিষেবার শর্তাবলী', ar:'شروط الخدمة', ur:'سروس کی شرائط', es:'Términos de Servicio', ja:'利用規約', zh:'服务条款' },
  'terms.s1_t': { en:'1. Acceptance of Terms', bn:'১. শর্তাবলীর গ্রহণ', ar:'١. قبول الشروط', ur:'۱. شرائط کی قبولیت', es:'1. Aceptación de los Términos', ja:'1. 規約の承諾', zh:'1. 条款的接受' },
  'terms.s1_b': { en:'By accessing and using the "Talk with Hisham" platform, you accept and agree to be bound by the terms and provision of this agreement.', bn:'"Talk with Hisham" প্ল্যাটফর্ম অ্যাক্সেস ও ব্যবহারের মাধ্যমে আপনি এই চুক্তির শর্তাবলী মেনে চলতে সম্মত হচ্ছেন।', ar:'من خلال الوصول إلى منصة "Talk with Hisham" واستخدامها، فإنك تقبل وتوافق على الالتزام بشروط وأحكام هذه الاتفاقية.', ur:'"Talk with Hisham" پلیٹ فارم تک رسائی اور استعمال کے ذریعے، آپ اس معاہدے کی شرائط و ضوابط کا پابند ہونے کو قبول اور متفق کرتے ہیں۔', es:'Al acceder y usar la plataforma "Talk with Hisham", aceptas y te obligas a cumplir los términos y disposiciones de este acuerdo.', ja:'「Talk with Hisham」プラットフォームにアクセスし利用することで、本規約の条項に拘束されることに同意したものとみなされます。', zh:'通过访问和使用 "Talk with Hisham" 平台，您接受并同意受本协议条款和规定的约束。' },
  'terms.s2_t': { en:'2. User Accounts', bn:'২. ব্যবহারকারী অ্যাকাউন্ট', ar:'٢. حسابات المستخدمين', ur:'۲. صارف اکاؤنٹس', es:'2. Cuentas de Usuario', ja:'2. ユーザーアカウント', zh:'2. 用户账户' },
  'terms.s2_b': { en:'When you create an account with us (via Email, Google, or GitHub), you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the service.', bn:'আপনি যখন আমাদের সাথে অ্যাকাউন্ট তৈরি করেন (ইমেইল, গুগল বা গিটহাবের মাধ্যমে), আপনাকে সর্বদা সঠিক, সম্পূর্ণ ও বর্তমান তথ্য দিতে হবে। সেবা অ্যাক্সেস করতে আপনি যে পাসওয়ার্ড ব্যবহার করেন তা সুরক্ষিত রাখা আপনার দায়িত্ব।', ar:'عند إنشاء حساب معنا (عبر البريد أو جوجل أو جيت هاب)، يجب عليك تقديم معلومات دقيقة وكاملة وحديثة في جميع الأوقات. أنت مسؤول عن حماية كلمة المرور التي تستخدمها للوصول إلى الخدمة.', ur:'جب آپ ہمارے ساتھ اکاؤنٹ بناتے ہیں (ای میل، گوگل، یا گٹ ہب کے ذریعے)، تو آپ کو ہر وقت درست، مکمل اور موجودہ معلومات فراہم کرنی ہوں گی۔ سروس تک رسائی کے لیے جو پاس ورڈ استعمال کرتے ہیں اس کی حفاظت آپ کی ذمہ داری ہے۔', es:'Al crear una cuenta con nosotros (vía Email, Google o GitHub), debes proporcionar información precisa, completa y actualizada en todo momento. Eres responsable de proteger la contraseña que usas para acceder al servicio.', ja:'（メール、Google、GitHubで）アカウントを作成する際は、常に正確で完全かつ最新の情報を提供する必要があります。サービスへのアクセスに使用するパスワードの保護は利用者の責任です。', zh:'当您与我们创建账户（通过电子邮件、Google 或 GitHub）时，您必须始终提供准确、完整和最新的信息。您有责任保护好用于访问服务的密码。' },
  'terms.s3_t': { en:'3. Content and Conduct', bn:'৩. কন্টেন্ট ও আচরণ', ar:'٣. المحتوى والسلوك', ur:'۳. مواد اور رویہ', es:'3. Contenido y Conducta', ja:'3. コンテンツと行為', zh:'3. 内容与行为' },
  'terms.s3_b1': { en:'Our platform allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you post on or through the Service.', bn:'আমাদের প্ল্যাটফর্মে আপনি নির্দিষ্ট তথ্য, লেখা, ছবি বা অন্যান্য উপকরণ পোস্ট, লিংক, সংরক্ষণ, শেয়ার ও উপলব্ধ করতে পারেন। সেবায় আপনি যে কন্টেন্ট পোস্ট করেন তার জন্য আপনি দায়ী।', ar:'تتيح منصتنا لك نشر وربط وتخزين ومشاركة وإتاحة معلومات معينة أو نصوص أو رسومات أو مواد أخرى. أنت مسؤول عن المحتوى الذي تنشره على الخدمة أو من خلالها.', ur:'ہمارا پلیٹ فارم آپ کو مخصوص معلومات، متن، گرافکس، یا دیگر مواد پوسٹ، لنک، ذخیرہ، شیئر اور دستیاب کرنے کی اجازت دیتا ہے۔ سروس پر یا اس کے ذریعے جو مواد آپ پوسٹ کرتے ہیں اس کے ذمہ دار آپ ہیں۔', es:'Nuestra plataforma te permite publicar, enlazar, almacenar, compartir y poner a disposición cierta información, texto, gráficos u otro material. Eres responsable del contenido que publicas en o a través del Servicio.', ja:'当プラットフォームでは、情報・テキスト・グラフィック等を投稿、リンク、保存、共有できます。サービス上で投稿するコンテンツの責任は利用者にあります。', zh:'我们的平台允许您发布、链接、存储、分享和提供某些信息、文本、图形或其他材料。您对在服务上或通过服务发布的内容负责。' },
  'terms.s3_b2': { en:'You agree not to post content that is:', bn:'আপনি সম্মত হচ্ছেন যে নিচের ধরনের কন্টেন্ট পোস্ট করবেন না:', ar:'تتعهد بعدم نشر محتوى:', ur:'آپ متفق ہیں کہ ایسا مواد پوسٹ نہیں کریں گے:', es:'Aceptas no publicar contenido que sea:', ja:'次のようなコンテンツを投稿しないことに同意します：', zh:'您同意不发布以下内容：' },
  'terms.s3_l1': { en:'Unlawful, defamatory, or fraudulent.', bn:'অবৈধ, মানহানিকর বা প্রতারণামূলক।', ar:'غير قانوني أو تشهيري أو احتيالي.', ur:'غیر قانونی، ہتک آمیز، یا دھوکہ دہی پر مبنی۔', es:'Ilegal, difamatorio o fraudulento.', ja:'違法、名誉毀損、詐欺的。', zh:'非法、诽谤或欺诈。' },
  'terms.s3_l2': { en:'Offensive, hateful, or promoting discrimination.', bn:'আপত্তিকর, ঘৃণাসূচক বা বৈষম্য প্রচারকারী।', ar:'مسيء أو كاره أو يشجع على التمييز.', ur:'اشتعال انگیز، نفرت انگیز، یا امتیاز کو فروغ دینے والا۔', es:'Ofensivo, odioso o que promueva discriminación.', ja:'不快、憎悪、差別を助長するもの。', zh:'冒犯性、仇恨性或宣扬歧视。' },
  'terms.s3_l3': { en:'Infringing on any third party\'s intellectual property rights.', bn:'তৃতীয় পক্ষের বুদ্ধিবৃত্তিক সম্পত্তির অধিকার লঙ্ঘনকারী।', ar:'ينتهك حقوق الملكية الفكرية لأي طرف ثالث.', ur:'کسی تیسرے فریق کے دانشورانہ املاک کے حقوق کی خلاف ورزی کرنے والا۔', es:'Que infrinja los derechos de propiedad intelectual de terceros.', ja:'第三者の知的財産権を侵害するもの。', zh:'侵犯任何第三方知识产权。' },
  'terms.s4_t': { en:'4. Termination', bn:'৪. সমাপ্তি', ar:'٤. الإنهاء', ur:'۴. اختتام', es:'4. Terminación', ja:'4. 契約の終了', zh:'4. 终止' },
  'terms.s4_b': { en:'We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.', bn:'আমরা কোনো পূর্ব নোটিশ বা দায় ছাড়াই যেকোনো কারণে আপনার সেবা অ্যাক্সেস অবিলম্বে বাতিল বা স্থগিত করতে পারি, যার মধ্যে শর্তাবলী লঙ্ঘনও অন্তর্ভুক্ত।', ar:'يجوز لنا إنهاء أو تعليق الوصول إلى خدمتنا فورًا، دون إشعار مسبق أو مسؤولية، لأي سبب كان، بما في ذلك على سبيل المثال لا الحصر إذا خالفت الشروط.', ur:'ہم بغیر کسی پیشگی اطلاع یا ذمہ داری کے، کسی بھی وجہ سے، بشمول شرائط کی خلاف ورزی پر، آپ کی سروس تک رسائی فوری طور پر ختم یا معطل کر سکتے ہیں۔', es:'Podemos terminar o suspender el acceso a nuestro Servicio de inmediato, sin aviso previo ni responsabilidad, por cualquier motivo, incluyendo sin limitación si incumples los Términos.', ja:'当社は、事前の通知や責任なしに、規約違反を含むいかなる理由でも、サービスの利用を直ちに終了または停止する場合があります。', zh:'我们可能因任何原因（包括但不限于您违反条款）立即终止或暂停您对我们服务的访问，恕不另行通知，也不承担任何责任。' },
  'terms.s5_t': { en:'5. Changes to Terms', bn:'৫. শর্তাবলীর পরিবর্তন', ar:'٥. التغييرات على الشروط', ur:'۵. شرائط میں تبدیلیاں', es:'5. Cambios a los Términos', ja:'5. 規約の変更', zh:'5. 条款变更' },
  'terms.s5_b': { en:'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.', bn:'আমরা আমাদের নিজস্ব বিবেচনায় যেকোনো সময় এই শর্তাবলী পরিবর্তন বা প্রতিস্থাপনের অধিকার রাখি। গুরুত্বপূর্ণ পরিবর্তন কী তা আমাদের নিজস্ব বিবেচনায় নির্ধারিত হবে।', ar:'نحتفظ بالحق، وفق تقديرنا المطلق، في تعديل أو استبدال هذه الشروط في أي وقت. سيتم تحديد ما يشكل تغييرًا جوهريًا وفق تقديرنا المطلق.', ur:'ہم اپنی صوابدید پر کسی بھی وقت ان شرائط میں ترمیم یا تبدیلی کا حق محفوظ رکھتے ہیں۔ مادی تبدیلی کیا ہوگی اس کا تعین ہماری صوابدید سے ہوگا۔', es:'Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Lo que constituye un cambio material se determinará a nuestra entera discreción.', ja:'当社は独自の裁量により、いつでも本規約を変更または置き換える権利を留保します。重要な変更に当たるかは当社の独自の判断で決定されます。', zh:'我们保留自行决定随时修改或替换这些条款的权利。何为重大变更将由我们自行决定。' },
  'terms.s6_t': { en:'6. Contact Us', bn:'৬. আমাদের সাথে যোগাযোগ', ar:'٦. تواصل معنا', ur:'۶. ہم سے رابطہ کریں', es:'6. Contáctanos', ja:'6. お問い合わせ', zh:'6. 联系我们' },
  'terms.s6_b': { en:'If you have any questions about these Terms, please contact us via the platform or email.', bn:'এই শর্তাবলী সম্পর্কে কোনো প্রশ্ন থাকলে প্ল্যাটফর্ম বা ইমেইলের মাধ্যমে আমাদের সাথে যোগাযোগ করুন।', ar:'إذا كان لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا عبر المنصة أو البريد الإلكتروني.', ur:'ان شرائط کے بارے میں کوئی سوال ہو تو براہ کرم پلیٹ فارم یا ای میل کے ذریعے ہم سے رابطہ کریں۔', es:'Si tienes preguntas sobre estos Términos, contáctanos a través de la plataforma o por correo.', ja:'本規約についてご質問がある場合は、プラットフォームまたはメールでお問い合わせください。', zh:'如果您对这些条款有任何疑问，请通过平台或电子邮件与我们联系。' },

  // Round4 extras
  'post.back_feed': { en:'Back to Feed', bn:'ফিডে ফিরুন', ar:'العودة إلى المنشورات', ur:'فیڈ پر واپس جائیں', es:'Volver al Feed', ja:'フィードに戻る', zh:'返回动态' },
  'post.comment': { en:'Comment', bn:'মন্তব্য', ar:'تعليق', ur:'تبصرہ', es:'Comentar', ja:'コメント', zh:'评论' },
  'post.comments': { en:'Comments', bn:'মন্তব্যসমূহ', ar:'التعليقات', ur:'تبصرے', es:'Comentarios', ja:'コメント', zh:'评论' },
  'post.share': { en:'Share', bn:'শেয়ার', ar:'مشاركة', ur:'شیئر', es:'Compartir', ja:'シェア', zh:'分享' },
  'post.attach_alt': { en:'Post attachment', bn:'পোস্টের সংযুক্তি', ar:'مرفق المنشور', ur:'پوسٹ منسلکہ', es:'Adjunto de publicación', ja:'投稿の添付', zh:'帖子附件' },
  'admin.tab_msgs': { en:'Messages', bn:'বার্তা', ar:'الرسائل', ur:'پیغامات', es:'Mensajes', ja:'メッセージ', zh:'消息' },
  'admin.tab_users': { en:'Users', bn:'ব্যবহারকারী', ar:'المستخدمون', ur:'صارفین', es:'Usuarios', ja:'ユーザー', zh:'用户' },
  'admin.st_users': { en:'Users', bn:'ব্যবহারকারী', ar:'المستخدمون', ur:'صارفین', es:'Usuarios', ja:'ユーザー', zh:'用户' },
  'admin.st_posts': { en:'Posts', bn:'পোস্ট', ar:'المنشورات', ur:'پوسٹس', es:'Publicaciones', ja:'投稿', zh:'帖子' },
  'admin.st_chat': { en:'Chat Messages', bn:'চ্যাট বার্তা', ar:'رسائل المحادثة', ur:'چیٹ پیغامات', es:'Mensajes de Chat', ja:'チャットメッセージ', zh:'聊天消息' },
  'admin.st_priv': { en:'Private Messages', bn:'ব্যক্তিগত বার্তা', ar:'الرسائل الخاصة', ur:'نجی پیغامات', es:'Mensajes Privados', ja:'プライベートメッセージ', zh:'私人消息' },
  'admin.confirm_del': { en:'Delete this message?', bn:'এই বার্তাটি মুছবেন?', ar:'حذف هذه الرسالة؟', ur:'کیا یہ پیغام حذف کریں؟', es:'¿Eliminar este mensaje?', ja:'このメッセージを削除しますか？', zh:'删除此消息？' },
  'reset.invalid_desc': { en:'You must be logged in to reset your password. If you requested a reset email, please ensure you clicked the link correctly.', bn:'পাসওয়ার্ড রিসেট করতে আপনাকে লগ ইন থাকতে হবে। আপনি যদি রিসেট ইমেইল চেয়ে থাকেন, তবে নিশ্চিত করুন আপনি লিংকটি সঠিকভাবে ক্লিক করেছেন।', ar:'يجب تسجيل الدخول لإعادة تعيين كلمة المرور. إذا طلبت بريد إعادة التعيين، فتأكد من أنك نقرت على الرابط بشكل صحيح.', ur:'پاس ورڈ ری سیٹ کرنے کے لیے آپ کا لاگ ان ہونا ضروری ہے۔ اگر آپ نے ری سیٹ ای میل مانگا تھا، تو براہ کرم یقینی بنائیں کہ آپ نے لنک درست طریقے سے کلک کیا۔', es:'Debes iniciar sesión para restablecer tu contraseña. Si solicitaste un correo de restablecimiento, asegúrate de haber hecho clic correctamente en el enlace.', ja:'パスワードをリセットするにはログインが必要です。リセットメールをリクエストした場合は、リンクを正しくクリックしたか確認してください。', zh:'您必须登录才能重置密码。如果您请求了重置邮件，请确保正确点击了链接。' },
  'reset.go_home': { en:'Go to Home', bn:'হোমে যান', ar:'اذهب إلى الرئيسية', ur:'ہوم پر جائیں', es:'Ir al Inicio', ja:'ホームへ', zh:'前往首页' },
  'feed.share': { en:'Share', bn:'শেয়ার', ar:'مشاركة', ur:'شیئر', es:'Compartir', ja:'シェア', zh:'分享' },

  // Feed action bar
  'feed.like': { en:'Like', bn:'লাইক', ar:'إعجاب', ur:'لائک', es:'Me gusta', ja:'いいね', zh:'点赞' },
  'feed.comment': { en:'Comment', bn:'মন্তব্য', ar:'تعليق', ur:'تبصرہ', es:'Comentar', ja:'コメント', zh:'评论' },

  'exp.title': { en:'Areas of Expertise', bn:'দক্ষতার ক্ষেত্রসমূহ', ar:'مجالات الخبرة', ur:'مہارت کے شعبے', es:'Áreas de Experiencia', ja:'専門分野', zh:'专业领域' },
};

export function t(key: string, locale: Locale): string {
  return DICT[key]?.[locale] ?? DICT[key]?.[DEFAULT_LOCALE] ?? key;
}
