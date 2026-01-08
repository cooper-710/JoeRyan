import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Calendar, TrendingUp, Award, Target } from 'lucide-react';
import twinsLogo from 'figma:asset/920a1daa8da50ac87f6cb37d73c57e60d4e3e18a.png';
import { getAllJoeRyanSeasons, type JoeRyanStats } from '../utils/dataLoader';

interface Milestone {
  year: string;
  title: string;
  description: string;
  stats: string[];
  icon: typeof Calendar;
  color: string;
}

export function CareerTimeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const timelineProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    getAllJoeRyanSeasons().then((seasons: JoeRyanStats[]) => {
      const sorted = [...seasons].sort((a, b) => a.season - b.season);
      
      const getTitle = (season: JoeRyanStats, index: number, allSeasons: JoeRyanStats[]): string => {
        if (index === 0) return 'MLB Debut';
        if (index === sorted.length - 1) return 'Elite Performance';
        if (season.era < 3.5) return 'Breakout Season';
        if (season.era > 4.0) return 'Building Experience';
        return 'Strong Performance';
      };
      
      const getDescription = (season: JoeRyanStats, index: number, allSeasons: JoeRyanStats[]): string => {
        if (index === 0) return 'Joined the Minnesota Twins rotation';
        if (index === sorted.length - 1) {
          return `Career-high ${Math.round(season.strikeouts)} strikeouts, ${season.innings.toFixed(1)} innings pitched`;
        }
        if (season.era < 3.5) return 'Established as reliable starter with sub-3.50 ERA';
        if (season.era > 4.0) return 'Gained valuable experience and refined approach';
        if (season.strikeouts > 150) return 'Strong strikeout numbers with solid command';
        return 'Continued development and improvement';
      };
      
      const icons = [Calendar, TrendingUp, Target, Award, Award];
      const colors = [
        'from-[#CFAB7A] to-[#CFAB7A]',
        'from-[#D31145] to-[#D31145]',
        'from-[#CFAB7A] to-[#CFAB7A]',
        'from-[#D31145] to-[#CFAB7A]',
        'from-[#D31145] to-[#CFAB7A]'
      ];

      const ms = sorted.map((season, index) => ({
        year: season.season.toString(),
        title: getTitle(season, index, sorted),
        description: getDescription(season, index, sorted),
        stats: [
          `${season.era.toFixed(2)} ERA`,
          `${Math.round(season.strikeouts)} K`,
          `${season.innings.toFixed(1)} IP`
        ],
        icon: icons[Math.min(index, icons.length - 1)],
        color: colors[Math.min(index, colors.length - 1)]
      }));

      setMilestones(ms);
    });
  }, []);

  return (
    <div ref={ref} className="relative py-40 px-6">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          {/* Twins Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8 flex justify-center"
          >
            {/* ... remove this code ... */}
          </motion.div>

          <h2 
            className="text-[clamp(4rem,12vw,9rem)] leading-none tracking-tight mb-6 text-white"
            style={{
              fontWeight: 800,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            Career
          </h2>
          <div className="flex items-center justify-center">
            <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#D31145] to-transparent" />
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Twins colored progress line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2 hidden lg:block">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#D31145] via-[#D31145] to-[#CFAB7A] origin-top"
              style={{ scaleY: timelineProgress }}
            />
          </div>

          {/* Milestones */}
          <div className="space-y-24">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className={`grid lg:grid-cols-2 gap-8 items-center ${isLeft ? '' : 'lg:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`${isLeft ? 'lg:text-right lg:pr-16' : 'lg:pl-16 lg:col-start-2'}`}>
                      <div className="group hover-target cursor-pointer">
                        <div className="relative p-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden transition-all duration-500 group-hover:border-[#D31145]/50 group-hover:scale-105">
                          <div className={`absolute inset-0 bg-gradient-to-br ${milestone.color} opacity-0 group-hover:opacity-10 transition-all duration-500`} />
                          
                          <div className="relative">
                            <div className="flex items-center gap-4 mb-6">
                              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-2xl`}>
                                <Icon className="w-8 h-8 text-white" />
                              </div>
                              <div>
                                <div className="text-6xl font-black text-[#CFAB7A]" style={{ fontFamily: 'Georgia, serif' }}>{milestone.year}</div>
                              </div>
                            </div>
                            
                            <div className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>{milestone.title}</div>
                            <div className="text-xl text-white/60 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>{milestone.description}</div>
                            
                            <div className="flex gap-4 flex-wrap">
                              {milestone.stats.map((stat, i) => (
                                <div key={i} className="px-4 py-2 bg-white/5 rounded-full border border-[#D31145]/20">
                                  <span className="text-white/80 font-medium">{stat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Center dot with Twins colors */}
                    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        viewport={{ once: true }}
                        className={`w-6 h-6 rounded-full bg-gradient-to-br ${milestone.color} shadow-2xl border-4 border-black`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}