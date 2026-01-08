// CSV parsing and data loading utilities

export interface JoeRyanStats {
  season: number;
  name: string;
  age: number;
  wins: number;
  losses: number;
  war: number;
  era: number;
  games: number;
  gamesStarted: number;
  innings: number;
  strikeouts: number;
  walks: number;
  hits: number;
  runs: number;
  earnedRuns: number;
  homeRuns: number;
  whip: number;
  fip: number;
  kPer9: number;
  bbPer9: number;
  hrPer9: number;
  [key: string]: any; // For other stats
}

export interface ArbitrationPrediction {
  player: string;
  arbYear: number;
  mls: number;
  prevSalary: string;
  predictedSalary: string;
}

// Parse CSV line into object - handles quoted fields properly
function parseCSVLine(line: string, headers: string[]): Record<string, string> {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  const result: Record<string, string> = {};
  headers.forEach((header, index) => {
    let value = values[index] || '';
    // Remove surrounding quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    result[header] = value;
  });
  return result;
}

// Load and parse fangraphs CSV
export async function loadJoeRyanStats(): Promise<JoeRyanStats[]> {
  try {
    const response = await fetch('/fangraphs_pitchers.csv');
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return [];

    // Parse header - handle quoted headers
    const headerLine = lines[0];
    const headers: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < headerLine.length; i++) {
      const char = headerLine[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        headers.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    headers.push(current.trim());
    
    // Parse data lines and filter for Joe Ryan
    const joeRyanData: JoeRyanStats[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i], headers);
      
      // Check if this is Joe Ryan (case-insensitive)
      const name = row['Name'] || '';
      if (name.toLowerCase().includes('joe ryan') || name.toLowerCase() === 'joe ryan') {
        const stats: JoeRyanStats = {
          season: parseInt(row['Season'] || '0'),
          name: name,
          age: parseFloat(row['fg_Age'] || '0'),
          wins: parseFloat(row['fg_W'] || '0'),
          losses: parseFloat(row['fg_L'] || '0'),
          war: parseFloat(row['fg_WAR'] || '0'),
          era: parseFloat(row['fg_ERA'] || '0'),
          games: parseFloat(row['fg_G'] || '0'),
          gamesStarted: parseFloat(row['fg_GS'] || '0'),
          innings: parseFloat(row['fg_IP'] || '0'),
          strikeouts: parseFloat(row['fg_SO'] || '0'),
          walks: parseFloat(row['fg_BB'] || '0'),
          hits: parseFloat(row['fg_H'] || '0'),
          runs: parseFloat(row['fg_R'] || '0'),
          earnedRuns: parseFloat(row['fg_ER'] || '0'),
          homeRuns: parseFloat(row['fg_HR'] || '0'),
          whip: parseFloat(row['fg_WHIP'] || '0'),
          fip: parseFloat(row['fg_FIP'] || '0'),
          kPer9: parseFloat(row['fg_K/9'] || '0'),
          bbPer9: parseFloat(row['fg_BB/9'] || '0'),
          hrPer9: parseFloat(row['fg_HR/9'] || '0'),
        };
        
        // Add all other fields
        headers.forEach(header => {
          if (!(header in stats)) {
            stats[header] = row[header] || '';
          }
        });
        
        joeRyanData.push(stats);
      }
    }
    
    // Sort by season descending (most recent first)
    return joeRyanData.sort((a, b) => b.season - a.season);
  } catch (error) {
    console.error('Error loading Joe Ryan stats:', error);
    return [];
  }
}

// Load and parse arbitration predictions CSV
export async function loadArbitrationPredictions(): Promise<ArbitrationPrediction[]> {
  try {
    const response = await fetch('/sorted_predictions.csv');
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return [];

    // Parse header - handle quoted headers
    const headerLine = lines[0];
    const headers: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < headerLine.length; i++) {
      const char = headerLine[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        headers.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    headers.push(current.trim());
    
    // Parse data lines
    const predictions: ArbitrationPrediction[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i], headers);
      
      const prediction: ArbitrationPrediction = {
        player: (row['Player'] || '').replace(/"/g, ''),
        arbYear: parseInt(row['Arb_Year'] || '0'),
        mls: parseFloat(row['MLS'] || '0'),
        prevSalary: (row['Prev_Salary'] || '').replace(/"/g, ''),
        predictedSalary: (row['Predicted_Salary_2026'] || '').replace(/"/g, ''),
      };
      
      predictions.push(prediction);
    }
    
    return predictions;
  } catch (error) {
    console.error('Error loading arbitration predictions:', error);
    return [];
  }
}

// Get Joe Ryan's arbitration prediction
export async function getJoeRyanPrediction(): Promise<ArbitrationPrediction | null> {
  const predictions = await loadArbitrationPredictions();
  return predictions.find(p => 
    p.player.toLowerCase().includes('ryan') && 
    p.player.toLowerCase().includes('joe')
  ) || null;
}

// Get comparison players (top similar players from predictions)
export async function getComparablePlayers(limit: number = 5): Promise<ArbitrationPrediction[]> {
  const predictions = await loadArbitrationPredictions();
  
  // Force specific players as comparables in the specified order
  const targetPlayers = [
    { firstName: 'george', lastName: 'kirby' },
    { firstName: 'nick', lastName: 'lodolo' },
    { firstName: 'hunter', lastName: 'brown' },
    { firstName: 'trevor', lastName: 'rogers' },
    { firstName: 'david', lastName: 'peterson' }
  ];
  
  const comparables: ArbitrationPrediction[] = [];
  
  for (const target of targetPlayers) {
    const found = predictions.find(p => {
      const playerName = p.player.toLowerCase();
      return playerName.includes(target.firstName) && playerName.includes(target.lastName);
    });
    
    if (found) {
      comparables.push(found);
    }
  }
  
  return comparables.slice(0, limit);
}

// Get player stats by name (for comparison players)
export async function getPlayerStatsByName(playerName: string, season?: number): Promise<JoeRyanStats | null> {
  try {
    const response = await fetch('/fangraphs_pitchers.csv');
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return null;

    const headers = lines[0].split(',').map(h => h.trim());
    
    // Parse name parts for matching
    const nameParts = playerName.toLowerCase().split(',').map(p => p.trim());
    const lastName = nameParts[0];
    const firstName = nameParts.length > 1 ? nameParts[1] : '';
    
    // If season is specified, use it; otherwise default to 2025 (latest season)
    const targetSeason = season || 2025;
    
    // First, try to find exact match with target season
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i], headers);
      const csvName = (row['Name'] || row['name'] || '').toLowerCase();
      const csvSeason = parseInt(row['Season'] || row['season'] || '0');
      
      // Check if name matches and season matches
      const matchesName = csvName.includes(lastName) && (!firstName || csvName.includes(firstName));
      const matchesSeason = csvSeason === targetSeason;
      
      if (matchesName && matchesSeason) {
        return {
          season: csvSeason,
          name: row['Name'] || row['name'] || '',
          age: parseFloat(row['fg_Age'] || row['Age'] || '0'),
          wins: parseFloat(row['fg_W'] || row['W'] || '0'),
          losses: parseFloat(row['fg_L'] || row['L'] || '0'),
          war: parseFloat(row['fg_WAR'] || row['WAR'] || '0'),
          era: parseFloat(row['fg_ERA'] || row['ERA'] || '0'),
          games: parseFloat(row['fg_G'] || row['G'] || '0'),
          gamesStarted: parseFloat(row['fg_GS'] || row['GS'] || '0'),
          innings: parseFloat(row['fg_IP'] || row['IP'] || '0'),
          strikeouts: parseFloat(row['fg_SO'] || row['SO'] || '0'),
          walks: parseFloat(row['fg_BB'] || row['BB'] || '0'),
          hits: parseFloat(row['fg_H'] || row['H'] || '0'),
          runs: parseFloat(row['fg_R'] || row['R'] || '0'),
          earnedRuns: parseFloat(row['fg_ER'] || row['ER'] || '0'),
          homeRuns: parseFloat(row['fg_HR'] || row['HR'] || '0'),
          whip: parseFloat(row['fg_WHIP'] || row['WHIP'] || '0'),
          fip: parseFloat(row['fg_FIP'] || row['FIP'] || '0'),
          kPer9: parseFloat(row['fg_K/9'] || row['K/9'] || '0'),
          bbPer9: parseFloat(row['fg_BB/9'] || row['BB/9'] || '0'),
          hrPer9: parseFloat(row['fg_HR/9'] || row['HR/9'] || '0'),
        };
      }
    }
    
    // If no match found for target season and season wasn't explicitly specified,
    // try to find the latest season for this player
    if (!season) {
      let latestStats: JoeRyanStats | null = null;
      let latestSeason = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i], headers);
        const csvName = (row['Name'] || row['name'] || '').toLowerCase();
        const csvSeason = parseInt(row['Season'] || row['season'] || '0');
        
        const matchesName = csvName.includes(lastName) && (!firstName || csvName.includes(firstName));
        
        if (matchesName && csvSeason > latestSeason) {
          latestSeason = csvSeason;
          latestStats = {
            season: csvSeason,
            name: row['Name'] || row['name'] || '',
            age: parseFloat(row['fg_Age'] || row['Age'] || '0'),
            wins: parseFloat(row['fg_W'] || row['W'] || '0'),
            losses: parseFloat(row['fg_L'] || row['L'] || '0'),
            war: parseFloat(row['fg_WAR'] || row['WAR'] || '0'),
            era: parseFloat(row['fg_ERA'] || row['ERA'] || '0'),
            games: parseFloat(row['fg_G'] || row['G'] || '0'),
            gamesStarted: parseFloat(row['fg_GS'] || row['GS'] || '0'),
            innings: parseFloat(row['fg_IP'] || row['IP'] || '0'),
            strikeouts: parseFloat(row['fg_SO'] || row['SO'] || '0'),
            walks: parseFloat(row['fg_BB'] || row['BB'] || '0'),
            hits: parseFloat(row['fg_H'] || row['H'] || '0'),
            runs: parseFloat(row['fg_R'] || row['R'] || '0'),
            earnedRuns: parseFloat(row['fg_ER'] || row['ER'] || '0'),
            homeRuns: parseFloat(row['fg_HR'] || row['HR'] || '0'),
            whip: parseFloat(row['fg_WHIP'] || row['WHIP'] || '0'),
            fip: parseFloat(row['fg_FIP'] || row['FIP'] || '0'),
            kPer9: parseFloat(row['fg_K/9'] || row['K/9'] || '0'),
            bbPer9: parseFloat(row['fg_BB/9'] || row['BB/9'] || '0'),
            hrPer9: parseFloat(row['fg_HR/9'] || row['HR/9'] || '0'),
          };
        }
      }
      
      return latestStats;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading player stats:', error);
    return null;
  }
}

// Get comparison players with their stats
export interface ComparablePlayer extends ArbitrationPrediction {
  stats?: JoeRyanStats;
}

export async function getComparablePlayersWithStats(limit: number = 5): Promise<ComparablePlayer[]> {
  const comparables = await getComparablePlayers(limit);
  const playersWithStats: ComparablePlayer[] = [];
  
  for (const comp of comparables) {
    // Get 2025 season stats for this player
    const stats = await getPlayerStatsByName(comp.player, 2025);
    playersWithStats.push({
      ...comp,
      stats: stats || undefined
    });
  }
  
  return playersWithStats;
}

// Get latest season stats for Joe Ryan
export async function getLatestJoeRyanStats(): Promise<JoeRyanStats | null> {
  const stats = await loadJoeRyanStats();
  return stats.length > 0 ? stats[0] : null;
}

// Get all seasons for Joe Ryan (for charts/timeline)
export async function getAllJoeRyanSeasons(): Promise<JoeRyanStats[]> {
  return await loadJoeRyanStats();
}

// Interface for historical arbitration data
export interface HistoricalArbitrationData {
  arbYear: number;
  player: string;
  season: number;
  club: string;
  mls: number;
  salary: string;
  era: number;
  wins: number;
  strikeouts: number;
  innings: number;
  whip: number;
  fip: number;
  war: number;
}

// Load historical arbitration data from CSV
export async function loadHistoricalArbitrationData(): Promise<HistoricalArbitrationData[]> {
  try {
    const response = await fetch('/ArbitrationData.csv');
    // Get the file as array buffer to control encoding
    const arrayBuffer = await response.arrayBuffer();
    
    // Try different encodings - CSV files can have various encodings
    // First try UTF-8, then fall back to Latin-1 if needed
    let text: string;
    try {
      // Try UTF-8 first (most common)
      const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
      text = utf8Decoder.decode(arrayBuffer);
      // Check if we got replacement characters (indicates wrong encoding)
      if (text.includes('\uFFFD')) {
        throw new Error('UTF-8 decode produced replacement characters');
      }
    } catch {
      // Fall back to ISO-8859-1 (Latin-1) - handles accented characters
      const latin1Decoder = new TextDecoder('iso-8859-1');
      text = latin1Decoder.decode(arrayBuffer);
    }
    
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return [];

    // Parse header
    const headerLine = lines[0];
    const headers: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < headerLine.length; i++) {
      const char = headerLine[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        headers.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    headers.push(current.trim());
    
    // Parse data lines - filter for pitchers only
    const historicalData: HistoricalArbitrationData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i], headers);
      
      // Only include pitchers (is_pitcher = TRUE)
      const isPitcher = row['is_pitcher']?.toLowerCase() === 'true';
      if (!isPitcher) continue;
      
      const era = parseFloat(row['p_1_fg_era'] || '0');
      const wins = parseFloat(row['p_1_fg_w'] || '0');
      const strikeouts = parseFloat(row['p_1_fg_so'] || '0');
      const innings = parseFloat(row['p_1_fg_ip'] || '0');
      const whip = parseFloat(row['p_1_fg_whip'] || '0');
      const fip = parseFloat(row['p_1_fg_fip'] || '0');
      const war = parseFloat(row['p_1_fg_war'] || '0');
      
      // Skip if missing essential stats
      if (!era || !innings || !strikeouts || isNaN(era) || isNaN(innings) || isNaN(strikeouts)) continue;
      
      // Format salary (remove quotes and format)
      let salary = row['Salary'] || '';
      if (salary.startsWith('"') && salary.endsWith('"')) {
        salary = salary.slice(1, -1);
      }
      if (salary && salary.trim() !== '' && !salary.startsWith('$')) {
        const numSalary = parseFloat(salary.replace(/,/g, ''));
        if (!isNaN(numSalary)) {
          salary = `$${numSalary.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        }
      }
      
      // Format player name
      let playerName = row['Player'] || '';
      if (playerName.startsWith('"') && playerName.endsWith('"')) {
        playerName = playerName.slice(1, -1);
      }
      // Fix UTF-8 replacement characters - the file has corrupted "ú" characters
      // The corrupted pattern is: U+00EF (ï) U+00BF (¿) U+00BD (½) repeated twice
      // This appears as "Lï¿½ï¿½zardo" and should be "Lúzardo"
      // Fix using Unicode escapes to ensure it works
      playerName = playerName.replace(/L\u00EF\u00BF\u00BD\u00EF\u00BF\u00BDzardo/gi, 'Lúzardo');
      // Also try the literal characters (in case encoding is different)
      playerName = playerName.replace(/Lï¿½ï¿½zardo/gi, 'Lúzardo');
      // Catch UTF-8 replacement character (U+FFFD)
      playerName = playerName.replace(/L\uFFFD+\uFFFD*zardo/gi, 'Lúzardo');
      // Catch any pattern where L is followed by non-ASCII characters then zardo
      playerName = playerName.replace(/L[^\x00-\x7FáéíóúÁÉÍÓÚñÑ]+zardo/gi, 'Lúzardo');
      // Catch if the character is completely missing
      playerName = playerName.replace(/Lzardo/gi, 'Lúzardo');
      if (playerName.includes(',')) {
        const parts = playerName.split(',');
        playerName = (parts[1]?.trim() || '') + ' ' + (parts[0]?.trim() || '');
      }
      
      historicalData.push({
        arbYear: parseInt(row['Arb_Year'] || '0'),
        player: playerName.trim(),
        season: parseInt(row['Season'] || '0'),
        club: row['Club'] || 'N/A',
        mls: parseFloat(row['MLS'] || '0'),
        salary: salary || 'N/A',
        era: era,
        wins: wins,
        strikeouts: strikeouts,
        innings: innings,
        whip: whip,
        fip: fip,
        war: war,
      });
    }
    
    return historicalData;
  } catch (error) {
    console.error('Error loading historical arbitration data:', error);
    return [];
  }
}

// Find historical comparables similar to Joe Ryan's stats
export async function findHistoricalComparables(
  joeStats: JoeRyanStats,
  limit: number = 8
): Promise<HistoricalArbitrationData[]> {
  const historicalData = await loadHistoricalArbitrationData();
  
  // Filter for only 2nd arbitration players (MLS between 3.15 and 4.1)
  // Based on arbitration eligibility: 3.15-4.1 = 2nd Arb (Super 2)
  // Also exclude Joe Ryan from historical comparables
  const secondArbPlayers = historicalData.filter(comp => {
    const isSecondArb = comp.mls >= 3.15 && comp.mls < 4.1;
    const playerName = comp.player.toLowerCase();
    const isJoeRyan = playerName.includes('joe') && playerName.includes('ryan');
    return isSecondArb && !isJoeRyan;
  });
  
  // Calculate similarity scores based on key stats
  interface ComparableWithSimilarity extends HistoricalArbitrationData {
    similarity: number;
  }
  
  const comparables: ComparableWithSimilarity[] = secondArbPlayers.map(comp => {
    // Weighted similarity calculation
    const eraDiff = Math.abs(comp.era - joeStats.era);
    const kDiff = Math.abs(comp.strikeouts - joeStats.strikeouts);
    const ipDiff = Math.abs(comp.innings - joeStats.innings);
    const wDiff = Math.abs(comp.wins - joeStats.wins);
    
    // Normalize differences (percentage based)
    const eraScore = eraDiff / Math.max(joeStats.era, comp.era, 1);
    const kScore = kDiff / Math.max(joeStats.strikeouts, comp.strikeouts, 1);
    const ipScore = ipDiff / Math.max(joeStats.innings, comp.innings, 1);
    const wScore = wDiff / Math.max(Math.max(joeStats.wins, comp.wins, 1), 10);
    
    // Combined similarity score (lower is better)
    const similarity = eraScore * 0.4 + kScore * 0.3 + ipScore * 0.2 + wScore * 0.1;
    
    return {
      ...comp,
      similarity
    };
  });
  
  // Sort by similarity and take top matches
  comparables.sort((a, b) => a.similarity - b.similarity);
  
  // Remove similarity property before returning
  return comparables.slice(0, limit).map(({ similarity, ...rest }) => rest);
}

