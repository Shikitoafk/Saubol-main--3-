import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Target, 
  Brain, 
  Globe, 
  ChevronRight,
  Headphones,
  LayoutDashboard
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-blue-500/30 font-sans">
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/5 backdrop-blur-md bg-[#0B0F19]/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <span className="font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Saubol</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A0AAB2]">
            <a href="#" className="hover:text-white transition-colors">Programs</a>
            <a href="#" className="hover:text-white transition-colors">IELTS</a>
            <a href="#" className="hover:text-white transition-colors">SAT</a>
            <a href="#" className="hover:text-white transition-colors">Admissions</a>
          </nav>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-[#A0AAB2] hover:text-white hover:bg-white/5"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-[0_0_15px_rgba(59,130,246,0.4)] rounded-full px-6"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI-POWERED ADMISSIONS 2026
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
              Твой путь в <span className="text-blue-400">топовые вузы</span> мира
            </h1>
            <p className="text-xl text-[#A0AAB2] max-w-2xl mx-auto mb-12 leading-relaxed">
              Персонализированная подготовка к SAT и IELTS, подбор программ и аналитика с помощью AI для тех, кто целится высоко.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-200 rounded-full px-8 h-14 text-base font-bold transition-all hover:scale-105"
                onClick={() => navigate('/signup')}
              >
                Начать подготовку <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/10 bg-white/5 hover:bg-white/10 rounded-full px-8 h-14 text-base font-bold backdrop-blur-sm transition-all"
              >
                Узнать подробнее
              </Button>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* IELTS Card */}
            <div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] flex flex-col justify-between min-h-[400px] hover:bg-white/10 transition-all group cursor-pointer" onClick={() => navigate('/ielts')}>
              <div>
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30 group-hover:scale-110 transition-transform">
                  <Headphones className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-3xl font-bold mb-4">IELTS Preparation</h3>
                <p className="text-[#A0AAB2] text-lg max-w-md">
                  Мультимодальная проверка эссе, тренажер Listening и Reading с детальной аналитикой ошибок.
                </p>
              </div>
              <div className="flex items-center gap-8 mt-8">
                <div>
                  <p className="text-3xl font-bold text-white">8.5</p>
                  <p className="text-sm text-[#A0AAB2]">Avg. Score</p>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div>
                  <p className="text-3xl font-bold text-white">12k+</p>
                  <p className="text-sm text-[#A0AAB2]">Students</p>
                </div>
              </div>
            </div>

            {/* SAT Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] flex flex-col justify-between min-h-[400px] hover:bg-white/10 transition-all group cursor-pointer" onClick={() => navigate('/sat')}>
              <div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">SAT Practice</h3>
                <p className="text-[#A0AAB2]">
                  Адаптивные тесты 2026 года с мгновенным разбором решений.
                </p>
              </div>
              <Button variant="ghost" className="p-0 h-auto font-bold text-blue-400 hover:text-blue-300 w-fit group">
                Open Modules <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* AI Matchmaker */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] flex flex-col justify-between min-h-[400px] hover:bg-white/10 transition-all group">
              <div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI Matchmaker</h3>
                <p className="text-[#A0AAB2]">
                  Умный подбор университетов на основе твоего профиля и амбиций.
                </p>
              </div>
              <div className="relative h-20 w-full overflow-hidden rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                 <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
                 <span className="text-xs font-mono text-purple-300 animate-pulse">ANALYZING PROFILE...</span>
              </div>
            </div>

            {/* Global Admissions */}
            <div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] flex items-center justify-between min-h-[250px] hover:bg-white/10 transition-all cursor-pointer" onClick={() => navigate('/admissions')}>
              <div className="max-w-md">
                <h3 className="text-2xl font-bold mb-4">Global Admissions</h3>
                <p className="text-[#A0AAB2]">
                  Сопровождение при поступлении в США, Европу и Азию. Полный цикл от эссе до визы.
                </p>
              </div>
              <div className="hidden sm:flex h-32 w-32 items-center justify-center rounded-full border border-white/5 bg-white/5 relative overflow-hidden">
                <Globe className="w-16 h-16 text-blue-400/30" />
                <div className="absolute inset-0 border-t-2 border-blue-400/50 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-24 px-6 overflow-hidden">
           <div className="max-w-7xl mx-auto">
             <div className="text-center mb-16">
               <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Твой прогресс в реальном времени</h2>
               <p className="text-[#A0AAB2] text-lg">Умные графики и аналитика по каждому предмету.</p>
             </div>
             
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 md:p-8 max-w-5xl mx-auto rounded-[40px] relative group overflow-hidden">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[40px] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
               <div className="relative bg-[#0B0F19] rounded-[24px] overflow-hidden border border-white/10 shadow-2xl">
                 {/* Mock UI for preview */}
                 <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                     <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                     <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                   </div>
                   <div className="text-xs font-mono text-white/40 tracking-widest">SAUBOL_OS_PREVIEW_V2</div>
                 </div>
                 <div className="p-8 grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                       <div className="h-48 w-full bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden flex items-end px-4 pt-10">
                         {/* Simple visual graph lines */}
                         <div className="absolute inset-0 flex items-center justify-center opacity-10">
                           <div className="w-full h-px bg-white/20" />
                           <div className="w-full h-px bg-white/20 -translate-y-10" />
                           <div className="w-full h-px bg-white/20 translate-y-10" />
                         </div>
                         {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85].map((h, i) => (
                           <div 
                             key={i} 
                             className="flex-1 mx-1 bg-gradient-to-t from-blue-600/50 to-blue-400/50 rounded-t-lg transition-all hover:brightness-125 cursor-pointer" 
                             style={{ height: `${h}%` }}
                           />
                         ))}
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                            <p className="text-xs font-bold text-[#A0AAB2] mb-2 uppercase tracking-widest">Accuracy</p>
                            <p className="text-3xl font-bold text-emerald-400">92.4%</p>
                         </div>
                         <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                            <p className="text-xs font-bold text-[#A0AAB2] mb-2 uppercase tracking-widest">Score Boost</p>
                            <p className="text-3xl font-bold text-blue-400">+140</p>
                         </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                      <div className="p-8 rounded-[24px] bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 h-full flex flex-col justify-between">
                         <div>
                           <LayoutDashboard className="w-10 h-10 mb-6 text-indigo-400" />
                           <h4 className="text-xl font-bold mb-3">Ready to level up?</h4>
                           <p className="text-sm text-[#A0AAB2] leading-relaxed">Получи доступ к полной аналитике и адаптивным модулям подготовки.</p>
                         </div>
                         <Button 
                           className="w-full bg-white text-black font-bold h-12 rounded-full mt-8 hover:bg-gray-200"
                           onClick={() => navigate('/dashboard')}
                         >
                           Open Dashboard
                         </Button>
                      </div>
                    </div>
                 </div>
               </div>
             </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">Saubol</span>
            </div>
            <p className="text-[#A0AAB2] text-lg max-w-sm leading-relaxed">
              Платформа №1 для подготовки к топовым мировым вузам. Технологии для твоих амбиций.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-white">Продукты</h4>
            <ul className="space-y-4 text-[#A0AAB2]">
              <li><a href="#" className="hover:text-white transition-colors" onClick={() => navigate('/ielts')}>IELTS Checker</a></li>
              <li><a href="#" className="hover:text-white transition-colors" onClick={() => navigate('/sat')}>SAT Modules</a></li>
              <li><a href="#" className="hover:text-white transition-colors" onClick={() => navigate('/programs')}>AI Matchmaker</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-white">Компания</h4>
            <ul className="space-y-4 text-[#A0AAB2]">
              <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 text-center text-sm text-[#64748B]">
          © 2026 Saubol Platform. Excellence in education.
        </div>
      </footer>
    </div>
  );
}
