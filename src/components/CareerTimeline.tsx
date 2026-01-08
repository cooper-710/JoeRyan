import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Calendar, TrendingUp, Award, Target } from 'lucide-react';
import twinsLogo from 'figma:asset/920a1daa8da50ac87f6cb37d73c57e60d4e3e18a.png';
import { getAllJoeRyanSeasons, type JoeRyanStats } from '../utils/dataLoader';
import { useIsMobile } from './ui/use-mobile';

interface Milestone {
  year: string;
  description: string;
  stats: string[];
  icon: typeof Calendar;
  color: string;
}

export function CareerTimeline() {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const timelineProgressTransform = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const timelineProgress = isMobile ? 1 : timelineProgressTransform;

  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    getAllJoeRyanSeasons().then((seasons: JoeRyanStats[]) => {
      const sorted = [...seasons].sort((a, b) => a.season - b.season);
      
      // Find the actual career-high strikeouts across all seasons
      const careerHighStrikeouts = Math.max(...sorted.map(s => s.strikeouts));
      const careerHighInnings = Math.max(...sorted.map(s => s.innings));
      // Find the career-low ERA
      const careerLowERA = Math.min(...sorted.map(s => s.era));
      
      const getDescription = (season: JoeRyanStats, index: number, allSeasons: JoeRyanStats[]): string => {
        if (index === 0) {
          return `Made MLB debut with ${season.gamesStarted} starts after being acquired from the Rays.`;
        }
        
        // Check for career highlights first
        const isCareerHighStrikeouts = Math.round(season.strikeouts) === Math.round(careerHighStrikeouts);
        const isCareerLowERA = Math.abs(season.era - careerLowERA) < 0.01;
        
        // Build contextual story
        let story = '';
        
        if (isCareerHighStrikeouts && isCareerLowERA) {
          story = `Career-best season with ${Math.round(season.strikeouts)} strikeouts and a ${season.era.toFixed(2)} ERA in ${season.innings.toFixed(1)} innings.`;
        } else if (isCareerHighStrikeouts) {
          story = `Career-high ${Math.round(season.strikeouts)} strikeouts in ${season.innings.toFixed(1)} innings, showcasing his strikeout ability.`;
        } else if (isCareerLowERA) {
          story = `Career-low ${season.era.toFixed(2)} ERA across ${season.gamesStarted} starts and ${season.innings.toFixed(1)} innings, his best season of his career to date.`;
        } else if (season.era < 3.5 && season.strikeouts > 150) {
          story = `${season.gamesStarted} starts, ${season.innings.toFixed(1)} innings. Established himself as a reliable rotation piece with strong strikeout numbers.`;
        } else if (season.era > 4.0 && season.innings > 150) {
          story = `${season.gamesStarted} starts, ${season.innings.toFixed(1)} innings. Faced some challenges but logged significant innings and continued developing his approach.`;
        } else if (season.innings < 140) {
          story = `${season.gamesStarted} starts, ${season.innings.toFixed(1)} innings. Limited by injuries but maintained effectiveness when on the mound.`;
        } else if (season.strikeouts > 180) {
          story = `${season.gamesStarted} starts, ${season.innings.toFixed(1)} innings. Demonstrated elite strikeout ability while maintaining solid control.`;
        } else {
          story = `${season.gamesStarted} starts, ${season.innings.toFixed(1)} innings. Provided steady production as a key member of the Twins rotation.`;
        }
        
        return story;
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
    <div ref={ref} className="relative py-20 px-8 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={isMobile ? false : { opacity: 0, y: 50 }}
          whileInView={isMobile ? false : { opacity: 1, y: 0 }}
          transition={isMobile ? {} : { duration: 1 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          {/* Twins Logo */}
          <motion.div
            initial={isMobile ? false : { opacity: 0, scale: 0.8 }}
            whileInView={isMobile ? false : { opacity: 1, scale: 1 }}
            transition={isMobile ? {} : { duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-4 flex justify-center"
          >
            {/* ... remove this code ... */}
          </motion.div>

          <h2 
            className="text-[clamp(3rem,8vw,6rem)] leading-none tracking-tight mb-4 text-white"
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
          <div className="space-y-12">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={isMobile ? false : { opacity: 0, x: isLeft ? -100 : 100 }}
                  whileInView={isMobile ? false : { opacity: 1, x: 0 }}
                  transition={isMobile ? {} : { duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className={`grid lg:grid-cols-2 gap-8 items-center ${isLeft ? '' : 'lg:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`${isLeft ? 'lg:text-right lg:pr-16' : 'lg:pl-16 lg:col-start-2'}`}>
                      <div className="group hover-target cursor-pointer">
                        <div className="relative p-8 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden transition-all duration-500 group-hover:border-[#D31145]/50 group-hover:scale-105">
                          <div className={`absolute inset-0 bg-gradient-to-br ${milestone.color} opacity-0 group-hover:opacity-10 transition-all duration-500`} />
                          
                          <div className="relative">
                            <div className="flex items-start gap-4 mb-4">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="text-3xl font-bold text-[#CFAB7A] mb-2" style={{ fontFamily: 'Georgia, serif' }}>{milestone.year}</div>
                                <div className="text-sm text-white/50 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>{milestone.description}</div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 flex-wrap">
                              {milestone.stats.map((stat, i) => (
                                <div key={i} className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                                  <span className="text-white/90 font-medium text-sm">{stat}</span>
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
                        initial={isMobile ? false : { scale: 0 }}
                        whileInView={isMobile ? false : { scale: 1 }}
                        transition={isMobile ? {} : { duration: 0.5, delay: index * 0.1 + 0.3 }}
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