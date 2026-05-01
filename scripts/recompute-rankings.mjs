#!/usr/bin/env node
/**
 * Recompute baseScore + finalScore + asiaRank + cityRank for every school
 * using the v2.1 methodology:
 *
 *   Base Score = Top Year Fees in USD + 500,000
 *   Final Score = Base × (1 + bonuses − penalties)
 *
 * Adjustments (qualityBonus, countryFreedomBonus, socialPenalty, pressPenalty)
 * are read from the existing schools.json — they reflect the evidence log and
 * are not re-derived here.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHOOLS = join(__dirname, '../src/data/schools.json');

const schools = JSON.parse(readFileSync(SCHOOLS, 'utf8'));
console.log(`Loaded ${schools.length} schools.`);

for (const s of schools) {
  if (typeof s.topYearFeeUSD !== 'number') {
    console.warn(`  ! ${s.name}: missing topYearFeeUSD`);
    continue;
  }
  s.baseScore = s.topYearFeeUSD + 500000;
  const totalAdj =
    (s.qualityBonus || 0) + (s.countryFreedomBonus || 0) - (s.socialPenalty || 0) - (s.pressPenalty || 0);
  s.totalAdjustment = Math.round(totalAdj * 1000) / 1000;
  s.finalScore = Math.round(s.baseScore * (1 + totalAdj));
}

// Sort + rank
schools.sort((a, b) => b.finalScore - a.finalScore);
schools.forEach((s, i) => { s.asiaRank = i + 1; });

// City ranks
const byCity = {};
for (const s of schools) {
  byCity[s.city] = byCity[s.city] || [];
  byCity[s.city].push(s);
}
for (const city of Object.keys(byCity)) {
  byCity[city]
    .sort((a, b) => b.finalScore - a.finalScore)
    .forEach((s, i) => { s.cityRank = i + 1; });
}

writeFileSync(SCHOOLS, JSON.stringify(schools, null, 2) + '\n');

console.log('\nTop 10 (Asia):');
for (const s of schools.slice(0, 10)) {
  const adjStr = `${s.totalAdjustment >= 0 ? '+' : ''}${(s.totalAdjustment * 100).toFixed(0)}%`;
  console.log(`  #${s.asiaRank.toString().padStart(2)}  ${s.name.padEnd(50)}  $${s.topYearFeeUSD.toLocaleString().padStart(7)}  base ${s.baseScore.toLocaleString().padStart(7)}  ${adjStr.padStart(5)}  final ${s.finalScore.toLocaleString()}`);
}
console.log(`\nWrote ${SCHOOLS}.`);
