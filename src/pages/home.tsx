import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Target, 
  Brain, 
  Globe, 
  ChevronRight,
  Headphones,
  LayoutDashboard,
  Clock
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-white/10 font-sans">
      {/* Header */}
      <header className="relative z-50 border-b border-[#222] bg-[#000000]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
              <span className="font-bold text-black text-xl">S</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Saubol</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-[#888]">
            <a href="#" className="hover:text-white transition-colors">Programs</a>
            <a href="#" className="hover:text-white transition-colors">IELTS</a>
            <a href="#" className="hover:text-white transition-colors">SAT</a>
            <a href="#" className="hover:text-white transition-colors">Admissions</a>
          </nav>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-[#888] hover:text-white hover:bg-white/5 font-medium"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
            <Button 
              className="bg-white text-black hover:bg-gray-200 rounded-lg px-6 font-semibold h-10"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-40 pb-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-semibold tracking-tight mb-8 leading-[1.05] max-w-4xl">
              Education for the <br />
              <span className="text-[#888]">Top Performers.</span>
            </h1>
            <p className="text-xl text-[#888] max-w-xl mb-12 leading-relaxed font-medium">
              Персонализированная подготовка к SAT и IELTS, подбор программ и аналитика для поступления в лучшие вузы мира.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-200 rounded-lg px-8 h-14 text-base font-semibold"
                onClick={() => navigate('/signup')}
              >
                Начать обучение <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-[#222] bg-transparent hover:bg-white/5 rounded-lg px-8 h-14 text-base font-semibold transition-all"
              >
                Узнать подробнее
              </Button>
            </div>
          </div>
        </section>

        {/* Pro Modules Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto border-t border-[#222]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* IELTS Module */}
            <div className="md:col-span-8 bg-[#0A0A0A] border border-[#222] p-12 rounded-2xl flex flex-col justify-between min-h-[450px] hover:border-[#444] transition-all group cursor-pointer" onClick={() => navigate('/ielts')}>
              <div className="max-w-xl">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8 border border-[#222]">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-4xl font-semibold mb-6">IELTS Intensive</h3>
                <p className="text-[#888] text-xl leading-relaxed">
                  Профессиональная подготовка с использованием AI-аналитики для Writing, Reading и Listening.
                </p>
              </div>
              <div className="flex items-center gap-12 mt-8 pt-8 border-t border-[#222]">
                 <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#444]" />
                    <span className="text-sm font-medium text-[#888]">Adaptive Learning</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-[#444]" />
                    <span className="text-sm font-medium text-[#888]">Expert Feedback</span>
                 </div>
              </div>
            </div>

            {/* SAT Module */}
            <div className="md:col-span-4 bg-[#0A0A0A] border border-[#222] p-12 rounded-2xl flex flex-col justify-between min-h-[450px] hover:border-[#444] transition-all group cursor-pointer" onClick={() => navigate('/sat')}>
              <div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8 border border-[#222]">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-semibold mb-6">SAT Practice</h3>
                <p className="text-[#888] text-lg">
                  Полная база адаптивных тестов 2026 года.
                </p>
              </div>
              <Button variant="ghost" className="p-0 h-auto font-semibold text-white hover:text-gray-300 w-fit group text-lg">
                View Modules <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Admissions */}
            <div className="md:col-span-6 bg-[#0A0A0A] border border-[#222] p-12 rounded-2xl flex flex-col justify-between min-h-[350px] hover:border-[#444] transition-all cursor-pointer" onClick={() => navigate('/admissions')}>
              <div className="max-w-md">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8 border border-[#222]">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-semibold mb-6">Admissions</h3>
                <p className="text-[#888] text-lg">
                  Полное сопровождение в университеты Ivy League и Европы.
                </p>
              </div>
            </div>

            {/* AI Search */}
            <div className="md:col-span-6 bg-[#0A0A0A] border border-[#222] p-12 rounded-2xl flex flex-col justify-between min-h-[350px] hover:border-[#444] transition-all">
              <div className="max-w-md">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8 border border-[#222]">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-semibold mb-6">AI Matchmaker</h3>
                <p className="text-[#888] text-lg">
                  Умный подбор программ на основе твоего текущего уровня.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Minimal CTA */}
        <section className="py-40 px-6 border-t border-[#222]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-semibold mb-12">Ready to start?</h2>
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-200 rounded-lg px-12 h-16 text-lg font-bold transition-all"
              onClick={() => navigate('/signup')}
            >
              Get Access Now
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222] py-24 px-6 bg-[#000000]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <span className="font-bold text-black text-xl">S</span>
              </div>
              <span className="text-2xl font-semibold tracking-tight">Saubol</span>
            </div>
            <p className="text-[#888] text-lg leading-relaxed">
              Excellence in educational technologies. Designed for those who seek high results.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-20">
            <div>
              <h4 className="font-semibold mb-8 text-white uppercase tracking-widest text-xs">Products</h4>
              <ul className="space-y-4 text-[#888] font-medium">
                <li><a href="#" className="hover:text-white transition-colors" onClick={() => navigate('/ielts')}>IELTS Checker</a></li>
                <li><a href="#" className="hover:text-white transition-colors" onClick={() => navigate('/sat')}>SAT Modules</a></li>
                <li><a href="#" className="hover:text-white transition-colors" onClick={() => navigate('/programs')}>AI Matchmaker</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-8 text-white uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-4 text-[#888] font-medium">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-[#222] text-sm text-[#444] font-medium">
          © 2026 Saubol. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
